import type {
  AnnouncementType,
  AnnouncementVariant,
  LeuOpenHours,
  LeuVacation,
} from './types.js';

export interface OpenHour {
  from: string;
  till: string;
}

export interface Vacation {
  fromDate: Date;
  tillDate: Date;
  title: string;
  text: string;
}

export interface Announcement extends Vacation {
  type: AnnouncementType;
  popup: boolean;
  is_closed: boolean;
  variant: AnnouncementVariant;
}

export interface TimeInterval {
  days?: number;
  months?: number;
}

const DAY_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export class OfficeHours {
  private openHours: Map<string, OpenHour[]> = new Map();
  private announcements: Announcement[] = [];

  private static convertToDateTime(input: Date | string | null): Date | null {
    if (input === null || input === undefined) return null;
    if (input instanceof Date) return input;
    if (typeof input === 'string') return new Date(input);
    return new Date();
  }

  addOpenHour(dayOfWeek: string, from: string, till: string): void {
    const dayHours = this.openHours.get(dayOfWeek) || [];
    dayHours.push({ from: from.padStart(5, '0'), till: till.padStart(5, '0') });
    this.openHours.set(dayOfWeek, dayHours);
  }

  addVacation(
    fromDate: Date | string,
    tillDate: Date | string,
    title: string,
    text: string,
  ): void {
    this.addAnnouncement(fromDate, tillDate, title, text, {});
  }

  private addAnnouncement(
    from: Date | string,
    till: Date | string,
    title: string,
    text: string,
    options: LeuVacation,
  ): void {
    // Leere Datumsgrenzen erlauben zeitlich unbegrenzte Meldungen.
    const fromDate = from === '' ? new Date(-8640000000000000) : new Date(from);
    const tillDate = till === '' ? new Date(8640000000000000) : new Date(till);
    if (!Number.isFinite(fromDate.getTime()) || !Number.isFinite(tillDate.getTime())) return;
    if (till !== '') tillDate.setHours(23, 59, 59, 999);

    const type = options.type ?? 'vacation';
    // Altdaten ohne Typ waren immer Urlaub mit Popup und Schließung.
    this.announcements.push({
      fromDate,
      tillDate,
      title,
      text,
      type,
      popup: options.popup ?? (type === 'vacation'),
      is_closed: type === 'vacation' && (options.is_closed ?? options.type === undefined),
      variant: options.variant ?? 'info',
    });
  }

  private activeAt(announcement: Announcement, date: Date): boolean {
    return date >= announcement.fromDate && date <= announcement.tillDate;
  }

  private getClosedVacation(date: Date): Announcement | undefined {
    return this.announcements.find(
      (announcement) =>
        announcement.type === 'vacation' &&
        announcement.is_closed &&
        this.activeAt(announcement, date),
    );
  }

  isVacation(date: Date | string | null = null): boolean {
    const dateTime = OfficeHours.convertToDateTime(date ?? new Date());
    return dateTime !== null && this.announcements.some(
      (announcement) =>
        announcement.type === 'vacation' && this.activeAt(announcement, dateTime),
    );
  }

  getVacation(
    date: Date | string | null = null,
  ): { title: string; text: string } | null {
    const dateTime = OfficeHours.convertToDateTime(date ?? new Date());
    if (dateTime === null) return null;

    const vacation = this.announcements.find(
      (current) => current.type === 'vacation' && this.activeAt(current, dateTime),
    );
    return vacation ? { title: vacation.title, text: vacation.text } : null;
  }

  /**
   * Meldungen für die Seitenbereiche: Urlaub auch im Voraus, andere Typen
   * nur im aktiven Anzeigezeitraum. Ohne Typ werden alle Typen berücksichtigt.
   * Beispiel: officeHours.getAnnouncements('info').
   */
  getAnnouncements(type: string | null = null, date = new Date()): Announcement[] {
    return this.announcements.filter(
      (announcement) =>
        (!type || announcement.type === type) &&
        (announcement.type === 'vacation'
          ? announcement.tillDate >= date
          : this.activeAt(announcement, date)),
    );
  }

  /** Erster aktiver Popup-Hinweis in der Reihenfolge von openhours.vacation. */
  getActivePopup(date = new Date()): { title: string; text: string } | null {
    const popup = this.announcements.find(
      (announcement) =>
        (announcement.type === 'popup' ||
          (announcement.type === 'vacation' && announcement.popup)) &&
        this.activeAt(announcement, date),
    );
    return popup ? { title: popup.title, text: popup.text } : null;
  }

  getUpcomingVacation(interval: TimeInterval | null = null): Vacation[] {
    const currentDate = new Date();
    const endDate = new Date(currentDate);

    const vacations = this.announcements
      .filter((announcement) => announcement.type === 'vacation')
      .map(({ fromDate, tillDate, title, text }) => ({ fromDate, tillDate, title, text }));
    if (interval === null) {
      return vacations.filter(
        (vacation) => vacation.tillDate >= currentDate,
      );
    }
    if (interval.days) endDate.setDate(endDate.getDate() + interval.days);
    if (interval.months) endDate.setMonth(endDate.getMonth() + interval.months);

    return vacations.filter(
      (vacation) =>
        (vacation.fromDate >= currentDate && vacation.fromDate <= endDate) ||
        (vacation.tillDate >= currentDate && vacation.tillDate <= endDate) ||
        (vacation.fromDate <= currentDate && vacation.tillDate >= endDate),
    );
  }

  isOpen(dateTime: Date | string | null = null): boolean {
    const dateObject = OfficeHours.convertToDateTime(dateTime);
    if (dateObject === null) return false;

    return (
      !this.getClosedVacation(dateObject) &&
      this.getTodayOpenDates(dateObject).some((hour) => {
        const currentTime = `${String(dateObject.getHours()).padStart(2, '0')}:${String(dateObject.getMinutes()).padStart(2, '0')}`;
        return currentTime >= hour.from && currentTime <= hour.till;
      })
    );
  }

  getNextOpenDate(dateTime: Date | string | null = null): Date {
    const nextDate = OfficeHours.convertToDateTime(dateTime) as Date;
    while (!this.isOpen(nextDate)) {
      nextDate.setHours(0, 0, 0, 0);
      nextDate.setDate(nextDate.getDate() + 1);
    }
    return nextDate;
  }

  getTodayOpenDates(dateTime: Date | string | null = null): OpenHour[] {
    const dateObject = OfficeHours.convertToDateTime(dateTime) as Date;
    const dayOfWeek = DAY_OF_WEEK[dateObject.getDay()];
    return this.openHours.get(dayOfWeek) || [];
  }

  getHumanReadableOpenDates(dateTime: Date | string | null = null): string {
    const dateObject = OfficeHours.convertToDateTime(dateTime) as Date;
    const vacation = this.getClosedVacation(dateObject);
    if (vacation) {
      return `Closed due to vacation: ${vacation.title}. Next open date: ${DAY_OF_WEEK[this.getNextOpenDate(dateObject).getDay()]} ${this.getNextOpenDate(dateObject).toLocaleDateString()} at 9:00.`;
    }
    if (this.isOpen(dateObject)) {
      const openHours = this.getTodayOpenDates(dateObject);
      const currentOpenHour = openHours.find(
        (hour) =>
          `${String(dateObject.getHours()).padStart(2, '0')}:${String(dateObject.getMinutes()).padStart(2, '0')}` <=
          hour.till,
      );
      return `Currently open till ${currentOpenHour?.till}. Next open date: ${DAY_OF_WEEK[this.getNextOpenDate(dateObject).getDay()]} at 9:00.`;
    }

    const nextOpenDate = this.getNextOpenDate(dateObject);
    const nextOpenHours = this.getTodayOpenDates(nextOpenDate);
    const nextOpenDay = DAY_OF_WEEK[nextOpenDate.getDay()];
    const nextOpenDateString = nextOpenHours
      .map((hour) => `${hour.from} - ${hour.till}`)
      .join(' and ');
    return `Closed now. Open next: ${nextOpenDay} ${nextOpenDateString}.`;
  }

  loadStruct(inputData: LeuOpenHours): void {
    this.openHours.clear();
    this.announcements = [];

    for (const hour of inputData.json ?? []) {
      if (hour.status !== 'open' && hour.status !== 'Offen') continue;
      const weekday = String(hour.dayOfWeek ?? '');
      const day = /^[0-6]$/.test(weekday) ? DAY_OF_WEEK[Number(weekday)] : weekday;
      const from = String(hour.from ?? '');
      const till = String(hour.till ?? hour.to ?? '');
      if (!day || !from || !till) continue;
      this.addOpenHour(day, from, till);
    }

    for (const vacation of inputData.vacation ?? []) {
      this.addAnnouncement(
        vacation.from ?? '',
        vacation.till ?? '',
        vacation.title ?? '',
        vacation.text ?? '',
        vacation,
      );
    }
  }
}
