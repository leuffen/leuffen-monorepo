import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { OfficeHours } from './office-hours.js';

function createOfficeHours(): OfficeHours {
  const officeHours = new OfficeHours();
  officeHours.loadStruct({
    _editor: 'openhours',
    table: [],
    _status_values: [],
    json: [
      {
        dayOfWeek: 'Monday',
        from: '08:00',
        to: '12:00',
        status: 'open',
      },
    ],
    vacation: [
      {
        from: '2026-08-03',
        till: '2026-08-14',
        title: 'Sommerurlaub',
        text: 'Die Praxis bleibt geschlossen.',
      },
      {
        from: '2026-09-01',
        till: '2026-09-30',
        title: 'September',
        text: 'Hinweis',
      },
    ],
  });
  return officeHours;
}

describe('OfficeHours vacation logic', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-10T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('uses the original inclusive end-of-day vacation range', () => {
    const officeHours = createOfficeHours();

    expect(officeHours.isVacation('2026-08-03')).toBe(true);
    expect(
      officeHours.isVacation(new Date(2026, 7, 14, 23, 59, 59, 999)),
    ).toBe(true);
    expect(officeHours.isVacation('2026-08-15')).toBe(false);
  });

  it('returns the title and text of the first active vacation', () => {
    expect(createOfficeHours().getVacation('2026-08-10')).toEqual({
      title: 'Sommerurlaub',
      text: 'Die Praxis bleibt geschlossen.',
    });
  });

  it('returns all current and future vacations without an interval', () => {
    expect(
      createOfficeHours()
        .getUpcomingVacation(null)
        .map((vacation) => vacation.title),
    ).toEqual(['Sommerurlaub', 'September']);
  });

  it('uses the original overlap checks for a limited interval', () => {
    expect(
      createOfficeHours()
        .getUpcomingVacation({ days: 10 })
        .map((vacation) => vacation.title),
    ).toEqual(['Sommerurlaub']);
  });
});
