import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LeuffenAnnouncements } from './leuffen-announcements.js';
import { LeuffenVacationDialog } from './leuffen-vacation-dialog.js';
import { LeuffenVacationModal } from './leuffen-vacation-modal.js';

function setOpenHours(from = '2026-08-03', till = '2026-08-14'): void {
  window.openhours = {
    _editor: 'openhours',
    table: [],
    _status_values: [],
    json: [],
    vacation: [
      {
        from,
        till,
        title: '**Praxisurlaub**',
        text: 'Ab Montag\nsind wir wieder da.',
      },
    ],
  };
}

async function initializeComponents(): Promise<void> {
  document.dispatchEvent(new Event('DOMContentLoaded'));
  await vi.runAllTimersAsync();
}

describe('announcement components', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-05T12:00:00Z'));
    document.body.innerHTML = '';
    setOpenHours();
  });

  afterEach(() => {
    delete window.openhours;
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders upcoming vacations like the original news component', async () => {
    const announcements = new LeuffenAnnouncements();
    announcements.innerHTML = 'Keine aktuellen Hinweise';
    document.body.append(announcements);

    await initializeComponents();

    expect(announcements.innerHTML).toContain('<strong>Praxisurlaub</strong>');
    expect(
      announcements.querySelector('[data-owner="leuffen-announcements"]'),
    ).not.toBeNull();
    expect(announcements.classList.contains('no-announcements')).toBe(false);
  });

  it('retains the authored fallback when no vacation is upcoming', async () => {
    setOpenHours('2026-07-01', '2026-07-02');
    const announcements = new LeuffenAnnouncements();
    announcements.innerHTML = 'Keine aktuellen Hinweise';
    document.body.append(announcements);

    await initializeComponents();

    expect(announcements.textContent).toBe('Keine aktuellen Hinweise');
    expect(announcements.classList.contains('no-announcements')).toBe(true);
  });

  it('opens the programmatic dialog with the active legacy vacation', async () => {
    const show = vi
      .spyOn(LeuffenVacationDialog, 'show')
      .mockResolvedValue({ submitted: false });
    document.body.append(new LeuffenVacationModal());

    await initializeComponents();

    expect(show).toHaveBeenCalledTimes(1);
    expect(show).toHaveBeenCalledWith({
      title: '**Praxisurlaub**',
      text: 'Ab Montag\nsind wir wieder da.',
    });
  });

  it('does not open the dialog outside the vacation period', async () => {
    setOpenHours('2026-08-06', '2026-08-14');
    const show = vi
      .spyOn(LeuffenVacationDialog, 'show')
      .mockResolvedValue({ submitted: false });
    document.body.append(new LeuffenVacationModal());

    await initializeComponents();

    expect(show).not.toHaveBeenCalled();
  });
});
