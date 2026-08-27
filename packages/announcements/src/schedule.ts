import { Temporal } from 'temporal-polyfill';

import type {
  Announcement,
  AnnouncementData,
  VacationAnnouncement,
} from './types.js';

export type AnnouncementDateInput = string | Temporal.PlainDate;

export interface UpcomingAnnouncementOptions {
  from?: AnnouncementDateInput;
  days?: number;
  months?: number;
}

function toPlainDate(value: AnnouncementDateInput): Temporal.PlainDate {
  return value instanceof Temporal.PlainDate
    ? value
    : Temporal.PlainDate.from(value);
}

function compareAnnouncements(left: Announcement, right: Announcement): number {
  const priority = (right.priority ?? 0) - (left.priority ?? 0);
  if (priority !== 0) return priority;

  const start = Temporal.PlainDate.compare(left.startsOn, right.startsOn);
  return start !== 0 ? start : left.id.localeCompare(right.id);
}

function validateWindowPart(
  name: 'days' | 'months',
  value: number | undefined,
): void {
  if (value !== undefined && (!Number.isInteger(value) || value < 0)) {
    throw new RangeError(`${name} must be a non-negative integer`);
  }
}

function validateAnnouncement(announcement: Announcement): void {
  if (!announcement.id || !announcement.title) {
    throw new TypeError('Every announcement requires a non-empty id and title');
  }
  if (
    announcement.type !== 'announcement' &&
    announcement.type !== 'vacation'
  ) {
    throw new TypeError('Unsupported announcement type');
  }

  const startsOn = Temporal.PlainDate.from(announcement.startsOn);
  const endsOn = Temporal.PlainDate.from(announcement.endsOn);
  if (Temporal.PlainDate.compare(startsOn, endsOn) > 0) {
    throw new RangeError(
      `Announcement ${announcement.id} ends before it starts`,
    );
  }
}

export class AnnouncementSchedule {
  readonly data: AnnouncementData;

  constructor(data: AnnouncementData) {
    if (data.version !== 1 || !Array.isArray(data.announcements)) {
      throw new TypeError(
        'Announcement data must use version 1 and contain an announcements array',
      );
    }
    data.announcements.forEach(validateAnnouncement);
    this.data = data;
  }

  today(): Temporal.PlainDate {
    return Temporal.Now.plainDateISO(this.data.timeZone ?? 'Europe/Berlin');
  }

  getActive(date: AnnouncementDateInput = this.today()): Announcement[] {
    const current = toPlainDate(date);
    return this.data.announcements
      .filter((announcement) => {
        const startsOn = Temporal.PlainDate.from(announcement.startsOn);
        const endsOn = Temporal.PlainDate.from(announcement.endsOn);
        return (
          Temporal.PlainDate.compare(startsOn, current) <= 0 &&
          Temporal.PlainDate.compare(current, endsOn) <= 0
        );
      })
      .sort(compareAnnouncements);
  }

  getUpcoming(options: UpcomingAnnouncementOptions = {}): Announcement[] {
    validateWindowPart('days', options.days);
    validateWindowPart('months', options.months);

    const from =
      options.from === undefined ? this.today() : toPlainDate(options.from);
    const hasWindow =
      options.days !== undefined || options.months !== undefined;
    const until = hasWindow
      ? from.add({ days: options.days ?? 0, months: options.months ?? 0 })
      : null;

    return this.data.announcements
      .filter((announcement) => {
        const startsOn = Temporal.PlainDate.from(announcement.startsOn);
        const endsOn = Temporal.PlainDate.from(announcement.endsOn);
        if (Temporal.PlainDate.compare(endsOn, from) < 0) return false;
        return (
          until === null || Temporal.PlainDate.compare(startsOn, until) <= 0
        );
      })
      .sort(compareAnnouncements);
  }

  getActiveVacation(
    date: AnnouncementDateInput = this.today(),
  ): VacationAnnouncement | null {
    return (
      this.getActive(date).find(
        (announcement): announcement is VacationAnnouncement =>
          announcement.type === 'vacation' &&
          announcement.display?.dialog !== 'never',
      ) ?? null
    );
  }
}
