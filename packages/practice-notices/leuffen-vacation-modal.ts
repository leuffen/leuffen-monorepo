import { resolvePracticeNoticeData, reportNoticeError } from './data-source.js';
import { LeuffenVacationDialog } from './leuffen-vacation-dialog.js';
import { NoticeSchedule, type NoticeDateInput } from './schedule.js';
import type { PracticeNoticeData } from './types.js';

export class LeuffenVacationModal extends HTMLElement {
  private explicitData?: PracticeNoticeData;
  private openedNoticeId?: string;

  today?: NoticeDateInput;

  get data(): PracticeNoticeData | undefined {
    return this.explicitData;
  }

  set data(value: PracticeNoticeData | undefined) {
    this.explicitData = value;
    if (this.isConnected) void this.refresh();
  }

  connectedCallback(): void {
    this.hidden = true;
    void this.refresh();
  }

  async refresh(): Promise<void> {
    try {
      const data = resolvePracticeNoticeData(this, this.explicitData);
      if (!data) return;

      const schedule = new NoticeSchedule(data);
      const vacation = schedule.getActiveVacation(this.today);
      if (!vacation || vacation.id === this.openedNoticeId) return;

      this.openedNoticeId = vacation.id;
      await LeuffenVacationDialog.show(vacation);
    } catch (error) {
      reportNoticeError(this, error);
    }
  }
}

if (!customElements.get('leuffen-vacation-modal')) {
  customElements.define('leuffen-vacation-modal', LeuffenVacationModal);
}
