import type { LeuOpenHours } from './types.js';

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
  private vacations: Vacation[] = [];

  private static convertToDateTime(input: Date | string | null): Date | null {
    if (input === null || input === undefined) return null;
    if (input instanceof Date) return input;
    if (typeof input === 'string') return new Date(input);
    return new Date();
  }

  addOpenHour(dayOfWeek: string, from: string, till: string): void {
    const dayHours = this.openHours.get(dayOfWeek) || [];
    dayHours.push({ from, till });
    this.openHours.set(dayOfWeek, dayHours);
  }

  addVacation(
    fromDate: Date | string,
    tillDate: Date | string,
    title: string,
    text: string,
  ): void {
    const fromDateTime = OfficeHours.convertToDateTime(fromDate);
    const tillDateEod = OfficeHours.convertToDateTime(tillDate);
    if (fromDateTime === null || tillDateEod === null) return;

    tillDateEod.setHours(23, 59, 59, 999);
    this.vacations.push({
      fromDate: fromDateTime,
      tillDate: tillDateEod,
      title,
      text,
    });
  }

  isVacation(date: Date | string | null = null): boolean {
    const dateTime = OfficeHours.convertToDateTime(date ?? new Date());
    return this.vacations.some(
      (vacation) =>
        vacation.fromDate !== null &&
        dateTime !== null &&
        dateTime >= vacation.fromDate &&
        dateTime <= vacation.tillDate,
    );
  }

  getVacation(
    date: Date | string | null = null,
  ): { title: string; text: string } | null {
    const dateTime = OfficeHours.convertToDateTime(date ?? new Date());
    if (dateTime === null) return null;

    const vacation = this.vacations.find(
      (current) => dateTime >= current.fromDate && dateTime <= current.tillDate,
    );
    return vacation ? { title: vacation.title, text: vacation.text } : null;
  }

  getUpcomingVacation(interval: TimeInterval | null = null): Vacation[] {
    const currentDate = new Date();
    const endDate = new Date(currentDate);

    if (interval === null) {
      return this.vacations.filter(
        (vacation) => vacation.tillDate >= currentDate,
      );
    }
    if (interval.days) endDate.setDate(endDate.getDate() + interval.days);
    if (interval.months) endDate.setMonth(endDate.getMonth() + interval.months);

    return this.vacations.filter(
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
      !this.isVacation(dateObject) &&
      this.getTodayOpenDates(dateObject).some((hour) => {
        const currentTime = `${dateObject.getHours()}:${String(dateObject.getMinutes()).padStart(2, '0')}`;
        return currentTime >= hour.from && currentTime <= hour.till;
      })
    );
  }

  getNextOpenDate(dateTime: Date | string | null = null): Date {
    const nextDate = OfficeHours.convertToDateTime(dateTime) as Date;
    while (this.isVacation(nextDate) || !this.isOpen(nextDate)) {
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
    if (this.isVacation(dateObject)) {
      const vacation = this.getVacation(dateObject);
      return `Closed due to vacation: ${vacation?.title}. Next open date: ${DAY_OF_WEEK[this.getNextOpenDate(dateObject).getDay()]} ${this.getNextOpenDate(dateObject).toLocaleDateString()} at 9:00.`;
    }
    if (this.isOpen(dateObject)) {
      const openHours = this.getTodayOpenDates(dateObject);
      const currentOpenHour = openHours.find(
        (hour) =>
          `${dateObject.getHours()}:${String(dateObject.getMinutes()).padStart(2, '0')}` <=
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
    this.vacations = [];

    inputData.json.forEach((hour) => {
      if (hour.status === 'open') {
        const day =
          typeof hour.dayOfWeek === 'number'
            ? DAY_OF_WEEK[hour.dayOfWeek]
            : hour.dayOfWeek;
        this.addOpenHour(day, hour.from as string, hour.to as string);
      }
    });

    if (!Array.isArray(inputData.vacation)) return;
    inputData.vacation.forEach((vacation) => {
      this.addVacation(
        vacation.from,
        vacation.till,
        vacation.title,
        vacation.text,
      );
    });
  }
}
