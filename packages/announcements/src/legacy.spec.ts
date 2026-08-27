import { describe, expect, it } from 'vitest';

import { fromLegacyOpenHours } from './legacy.js';

describe('fromLegacyOpenHours', () => {
  it('maps existing vacation metadata to versioned announcements', () => {
    const result = fromLegacyOpenHours({
      vacation: [
        {
          from: '2026-08-03',
          till: '2026-08-14',
          title: 'Praxisurlaub',
          short_text: 'Kurzinfo',
          text: 'Lange Information',
        },
      ],
    });

    expect(result).toMatchObject({
      version: 1,
      locale: 'de-DE',
      timeZone: 'Europe/Berlin',
      announcements: [
        {
          type: 'vacation',
          startsOn: '2026-08-03',
          endsOn: '2026-08-14',
          title: 'Praxisurlaub',
          summary: 'Kurzinfo',
          content: 'Lange Information',
        },
      ],
    });
  });

  it('accepts legacy data without vacations', () => {
    expect(fromLegacyOpenHours({}).announcements).toEqual([]);
  });
});
