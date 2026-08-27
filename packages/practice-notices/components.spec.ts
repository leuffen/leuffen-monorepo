import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LeuffenNews } from './leuffen-news.js';
import { LeuffenVacationDialog } from './leuffen-vacation-dialog.js';
import { LeuffenVacationModal } from './leuffen-vacation-modal.js';
import type { PracticeNoticeData } from './types.js';

const data: PracticeNoticeData = {
  version: 1,
  notices: [
    {
      id: 'vacation',
      type: 'vacation',
      startsOn: '2026-08-03',
      endsOn: '2026-08-14',
      title: 'Praxisurlaub',
    },
  ],
};

describe('practice notice components', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('renders upcoming news and retains the authored fallback when empty', () => {
    const news = new LeuffenNews();
    news.innerHTML = 'Keine aktuellen Hinweise';
    news.today = '2026-08-05';
    news.data = data;
    document.body.append(news);

    expect(news.textContent).toContain('Praxisurlaub');
    expect(news.classList.contains('no-news')).toBe(false);

    news.today = '2026-08-15';
    news.refresh();
    expect(news.textContent).toBe('Keine aktuellen Hinweise');
    expect(news.classList.contains('no-news')).toBe(true);
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
