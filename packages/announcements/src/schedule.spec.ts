import { describe, expect, it } from 'vitest';

import { AnnouncementSchedule } from './schedule.js';
import type { AnnouncementData } from './types.js';

const data: AnnouncementData = {
  version: 1,
  timeZone: 'Europe/Berlin',
  announcements: [
    {
      id: 'summer',
      type: 'vacation',
      startsOn: '2026-08-03',
      endsOn: '2026-08-14',
      title: 'Sommerurlaub',
      priority: 10,
    },
    {
      id: 'september',
      type: 'announcement',
      startsOn: '2026-09-01',
      endsOn: '2026-09-30',
      title: 'September-Hinweis',
    },
  ],
};

describe('AnnouncementSchedule', () => {
  it('treats start and end dates as inclusive', () => {
    const schedule = new AnnouncementSchedule(data);

    expect(
      schedule.getActive('2026-08-03').map((announcement) => announcement.id),
    ).toEqual(['summer']);
    expect(
      schedule.getActive('2026-08-14').map((announcement) => announcement.id),
    ).toEqual(['summer']);
    expect(schedule.getActive('2026-08-15')).toEqual([]);
  });

  it('returns active and future announcements but excludes expired announcements', () => {
    const schedule = new AnnouncementSchedule(data);

    expect(
      schedule
        .getUpcoming({ from: '2026-08-10' })
        .map((announcement) => announcement.id),
    ).toEqual(['summer', 'september']);
    expect(
      schedule
        .getUpcoming({ from: '2026-08-15' })
        .map((announcement) => announcement.id),
    ).toEqual(['september']);
  });

  it('limits upcoming announcements to an overlapping day window', () => {
    const schedule = new AnnouncementSchedule(data);

    expect(
      schedule
        .getUpcoming({ from: '2026-08-01', days: 20 })
        .map((announcement) => announcement.id),
    ).toEqual(['summer']);
  });

  it('handles leap days as calendar dates', () => {
    const schedule = new AnnouncementSchedule({
      version: 1,
      announcements: [
        {
          id: 'leap-day',
          type: 'vacation',
          startsOn: '2028-02-29',
          endsOn: '2028-02-29',
          title: 'Schalttag',
        },
      ],
    });

    expect(schedule.getActive('2028-02-29')).toHaveLength(1);
  });

  it('uses priority to resolve overlapping vacations deterministically', () => {
    const schedule = new AnnouncementSchedule({
      ...data,
      announcements: [
        data.announcements[0],
        {
          ...data.announcements[0],
          id: 'urgent',
          title: 'Dringend',
          priority: 20,
        },
      ],
    });

    expect(schedule.getActiveVacation('2026-08-05')?.id).toBe('urgent');
  });

  it('rejects inverted ranges and invalid windows', () => {
    expect(
      () =>
        new AnnouncementSchedule({
          version: 1,
          announcements: [
            {
              id: 'invalid',
              type: 'announcement',
              startsOn: '2026-09-02',
              endsOn: '2026-09-01',
              title: 'Ungültig',
            },
          ],
        }),
    ).toThrow(/ends before/);
    expect(() =>
      new AnnouncementSchedule(data).getUpcoming({ days: -1 }),
    ).toThrow(/non-negative/);
  });
});
