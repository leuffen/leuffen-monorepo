import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LeuffenAnnouncements } from './leuffen-announcements.js';
import { LeuffenVacationDialog } from './leuffen-vacation-dialog.js';
import { LeuffenVacationModal } from './leuffen-vacation-modal.js';
import type { AnnouncementData } from './types.js';

const data: AnnouncementData = {
  version: 1,
  announcements: [
    {
      id: 'vacation',
      type: 'vacation',
      startsOn: '2026-08-03',
      endsOn: '2026-08-14',
      title: 'Praxisurlaub',
    },
  ],
};

describe('announcement components', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('renders upcoming announcements and retains the authored fallback when empty', () => {
    const announcements = new LeuffenAnnouncements();
    announcements.innerHTML = 'Keine aktuellen Hinweise';
    announcements.today = '2026-08-05';
    announcements.data = data;
    document.body.append(announcements);

    expect(announcements.textContent).toContain('Praxisurlaub');
    expect(announcements.classList.contains('no-announcements')).toBe(false);

    announcements.today = '2026-08-15';
    announcements.refresh();
    expect(announcements.textContent).toBe('Keine aktuellen Hinweise');
    expect(announcements.classList.contains('no-announcements')).toBe(true);
  });

  it('opens the programmatic vacation dialog once for an active vacation', async () => {
    const show = vi.spyOn(LeuffenVacationDialog, 'show').mockResolvedValue({ submitted: false });
    const modal = new LeuffenVacationModal();
    modal.today = '2026-08-05';
    modal.data = data;
    document.body.append(modal);

    await modal.refresh();
    await modal.refresh();

    expect(show).toHaveBeenCalledTimes(1);
    expect(show).toHaveBeenCalledWith(expect.objectContaining({ id: 'vacation' }));
  });

  it('does not open the dialog outside the vacation period', async () => {
    const show = vi.spyOn(LeuffenVacationDialog, 'show').mockResolvedValue({ submitted: false });
    const modal = new LeuffenVacationModal();
    modal.today = '2026-08-15';
    modal.data = data;
    document.body.append(modal);

    await modal.refresh();
    expect(show).not.toHaveBeenCalled();
  });
});
