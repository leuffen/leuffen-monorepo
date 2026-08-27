import { Temporal } from 'temporal-polyfill';

import type { PracticeNotice, PracticeNoticeData, VacationNotice } from './types.js';

export type NoticeDateInput = string | Temporal.PlainDate;

export interface UpcomingNoticeOptions {
  from?: NoticeDateInput;
  days?: number;
  months?: number;
}

function toPlainDate(value: NoticeDateInput): Temporal.PlainDate {
  return value instanceof Temporal.PlainDate ? value : Temporal.PlainDate.from(value);
}

function compareNotices(left: PracticeNotice, right: PracticeNotice): number {
  const priority = (right.priority ?? 0) - (left.priority ?? 0);
  if (priority !== 0) return priority;

  const start = Temporal.PlainDate.compare(left.startsOn, right.startsOn);
  return start !== 0 ? start : left.id.localeCompare(right.id);
}

function validateWindowPart(name: 'days' | 'months', value: number | undefined): void {
  if (value !== undefined && (!Number.isInteger(value) || value < 0)) {
    throw new RangeError(`${name} must be a non-negative integer`);
  }
}

function validateNotice(notice: PracticeNotice): void {
  if (!notice.id || !notice.title) {
    throw new TypeError('Every notice requires a non-empty id and title');
  }
  if (notice.type !== 'news' && notice.type !== 'vacation') {
    throw new TypeError('Unsupported notice type');
  }

  const startsOn = Temporal.PlainDate.from(notice.startsOn);
  const endsOn = Temporal.PlainDate.from(notice.endsOn);
  if (Temporal.PlainDate.compare(startsOn, endsOn) > 0) {
    throw new RangeError(`Notice ${notice.id} ends before it starts`);
  }
}

export class NoticeSchedule {
  readonly data: PracticeNoticeData;

  constructor(data: PracticeNoticeData) {
    if (data.version !== 1 || !Array.isArray(data.notices)) {
      throw new TypeError('Practice notice data must use version 1 and contain a notices array');
    }
    data.notices.forEach(validateNotice);
    this.data = data;
  }

  today(): Temporal.PlainDate {
    return Temporal.Now.plainDateISO(this.data.timeZone ?? 'Europe/Berlin');
  }

  getActive(date: NoticeDateInput = this.today()): PracticeNotice[] {
    const current = toPlainDate(date);
    return this.data.notices
      .filter((notice) => {
        const startsOn = Temporal.PlainDate.from(notice.startsOn);
        const endsOn = Temporal.PlainDate.from(notice.endsOn);
        return Temporal.PlainDate.compare(startsOn, current) <= 0 && Temporal.PlainDate.compare(current, endsOn) <= 0;
      })
      .sort(compareNotices);
  }

  getUpcoming(options: UpcomingNoticeOptions = {}): PracticeNotice[] {
    validateWindowPart('days', options.days);
    validateWindowPart('months', options.months);

    const from = options.from === undefined ? this.today() : toPlainDate(options.from);
    const hasWindow = options.days !== undefined || options.months !== undefined;
    const until = hasWindow ? from.add({ days: options.days ?? 0, months: options.months ?? 0 }) : null;

    return this.data.notices
      .filter((notice) => {
        const startsOn = Temporal.PlainDate.from(notice.startsOn);
        const endsOn = Temporal.PlainDate.from(notice.endsOn);
        if (Temporal.PlainDate.compare(endsOn, from) < 0) return false;
        return until === null || Temporal.PlainDate.compare(startsOn, until) <= 0;
      })
      .sort(compareNotices);
  }

  getActiveVacation(date: NoticeDateInput = this.today()): VacationNotice | null {
    return (
      this.getActive(date).find(
        (notice): notice is VacationNotice => notice.type === 'vacation' && notice.display?.dialog !== 'never',
      ) ?? null
    );
  }
}
