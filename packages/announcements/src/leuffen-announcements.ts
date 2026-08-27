import {
  resolveAnnouncementData,
  reportAnnouncementError,
} from './data-source.js';
import {
  AnnouncementSchedule,
  type AnnouncementDateInput,
} from './schedule.js';
import type { AnnouncementData } from './types.js';

export class LeuffenAnnouncements extends HTMLElement {
  private explicitData?: AnnouncementData;
  private fallbackMarkup = '';
  private initialized = false;

  today?: AnnouncementDateInput;

  get data(): AnnouncementData | undefined {
    return this.explicitData;
  }

  set data(value: AnnouncementData | undefined) {
    this.explicitData = value;
    if (this.isConnected) this.refresh();
  }

  connectedCallback(): void {
    if (!this.initialized) {
      this.fallbackMarkup = this.innerHTML;
      this.initialized = true;
    }
    this.refresh();
  }

  refresh(): void {
    try {
      const data = resolveAnnouncementData(this, this.explicitData);
      const announcements = data
        ? new AnnouncementSchedule(data)
            .getUpcoming({ from: this.today })
            .filter((announcement) => announcement.display?.list !== false)
        : [];

      this.classList.toggle('no-announcements', announcements.length === 0);
      if (announcements.length === 0) {
        this.innerHTML = this.fallbackMarkup;
        return;
      }

      const container = document.createElement('div');
      container.dataset.owner = 'leuffen-announcements';
      const dataClass = this.getAttribute('data-class');
      if (dataClass) container.className = dataClass;

      for (const announcement of announcements) {
        const paragraph = document.createElement('p');
        paragraph.dataset.owner = 'leuffen-announcement';
        paragraph.textContent = announcement.title;
        container.append(paragraph);
      }
      this.replaceChildren(container);
    } catch (error) {
      this.classList.add('no-announcements');
      this.innerHTML = this.fallbackMarkup;
      reportAnnouncementError(this, error);
    }
  }
}

if (!customElements.get('leuffen-announcements')) {
  customElements.define('leuffen-announcements', LeuffenAnnouncements);
}
