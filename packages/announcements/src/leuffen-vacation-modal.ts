import {
  resolveAnnouncementData,
  reportAnnouncementError,
} from './data-source.js';
import { LeuffenVacationDialog } from './leuffen-vacation-dialog.js';
import {
  AnnouncementSchedule,
  type AnnouncementDateInput,
} from './schedule.js';
import type { AnnouncementData } from './types.js';

export class LeuffenVacationModal extends HTMLElement {
  private explicitData?: AnnouncementData;
  private openedAnnouncementId?: string;

  today?: AnnouncementDateInput;

  get data(): AnnouncementData | undefined {
    return this.explicitData;
  }

  set data(value: AnnouncementData | undefined) {
    this.explicitData = value;
    if (this.isConnected) void this.refresh();
  }

  connectedCallback(): void {
    this.hidden = true;
    void this.refresh();
  }

  async refresh(): Promise<void> {
    try {
      const data = resolveAnnouncementData(this, this.explicitData);
      if (!data) return;

      const schedule = new AnnouncementSchedule(data);
      const vacation = schedule.getActiveVacation(this.today);
      if (!vacation || vacation.id === this.openedAnnouncementId) return;

      this.openedAnnouncementId = vacation.id;
      await LeuffenVacationDialog.show(vacation);
    } catch (error) {
      reportAnnouncementError(this, error);
    }
  }
}

if (!customElements.get('leuffen-vacation-modal')) {
  customElements.define('leuffen-vacation-modal', LeuffenVacationModal);
}
