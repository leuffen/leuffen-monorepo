import { describe, expect, it } from 'vitest';

import { NoticeSchedule } from './schedule.js';
import type { PracticeNoticeData } from './types.js';

const data: PracticeNoticeData = {
  version: 1,
  timeZone: 'Europe/Berlin',
  notices: [
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
      type: 'news',
      startsOn: '2026-09-01',
      endsOn: '2026-09-30',
      title: 'September-Hinweis',
    },
  ],
};

describe('NoticeSchedule', () => {
  it('treats start and end dates as inclusive', () => {
    const schedule = new NoticeSchedule(data);

    expect(schedule.getActive('2026-08-03').map((notice) => notice.id)).toEqual(['summer']);
    expect(schedule.getActive('2026-08-14').map((notice) => notice.id)).toEqual(['summer']);
    expect(schedule.getActive('2026-08-15')).toEqual([]);
  });

  it('returns active and future notices but excludes expired notices', () => {
    const schedule = new NoticeSchedule(data);

    expect(schedule.getUpcoming({ from: '2026-08-10' }).map((notice) => notice.id)).toEqual(['summer', 'september']);
    expect(schedule.getUpcoming({ from: '2026-08-15' }).map((notice) => notice.id)).toEqual(['september']);
  });

  it('limits upcoming notices to an overlapping day window', () => {
    const schedule = new NoticeSchedule(data);

    expect(schedule.getUpcoming({ from: '2026-08-01', days: 20 }).map((notice) => notice.id)).toEqual(['summer']);
  });

  it('handles leap days as calendar dates', () => {
    const schedule = new NoticeSchedule({
      version: 1,
      notices: [
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
    const schedule = new NoticeSchedule({
      ...data,
      notices: [
        data.notices[0],
        { ...data.notices[0], id: 'urgent', title: 'Dringend', priority: 20 },
      ],
    });

    expect(schedule.getActiveVacation('2026-08-05')?.id).toBe('urgent');
  });

  it('rejects inverted ranges and invalid windows', () => {
    expect(
      () =>
        new NoticeSchedule({
          version: 1,
          notices: [
            {
              id: 'invalid',
              type: 'news',
              startsOn: '2026-09-02',
              endsOn: '2026-09-01',
              title: 'Ungültig',
            },
          ],
        }),
    ).toThrow(/ends before/);
    expect(() => new NoticeSchedule(data).getUpcoming({ days: -1 })).toThrow(/non-negative/);
  });
});
