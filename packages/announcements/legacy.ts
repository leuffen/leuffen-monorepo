import type { LegacyOpenHours, AnnouncementData } from './types.js';

export interface LegacyAdapterOptions {
  locale?: string;
  timeZone?: string;
}

export function fromLegacyOpenHours(
  input: LegacyOpenHours,
  options: LegacyAdapterOptions = {},
): AnnouncementData {
  const vacations = Array.isArray(input.vacation) ? input.vacation : [];

  return {
    version: 1,
    locale: options.locale ?? 'de-DE',
    timeZone: options.timeZone ?? 'Europe/Berlin',
    announcements: vacations.map((vacation, index) => ({
      id: `legacy-vacation-${vacation.from}-${vacation.till}-${index + 1}`,
      type: 'vacation',
      startsOn: vacation.from,
      endsOn: vacation.till,
      title: vacation.title,
      summary: vacation.short_text,
      content: vacation.text,
      display: {
        list: true,
        dialog: 'during',
      },
    })),
  };
}
