import { resolvePracticeNoticeData, reportNoticeError } from './data-source.js';
import { NoticeSchedule, type NoticeDateInput } from './schedule.js';
import type { PracticeNoticeData } from './types.js';

export class LeuffenNews extends HTMLElement {
  private explicitData?: PracticeNoticeData;
  private fallbackMarkup = '';
  private initialized = false;

  today?: NoticeDateInput;

  get data(): PracticeNoticeData | undefined {
    return this.explicitData;
  }

  set data(value: PracticeNoticeData | undefined) {
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
      const data = resolvePracticeNoticeData(this, this.explicitData);
      const notices = data
        ? new NoticeSchedule(data)
            .getUpcoming({ from: this.today })
            .filter((notice) => notice.display?.news !== false)
        : [];

      this.classList.toggle('no-news', notices.length === 0);
      if (notices.length === 0) {
        this.innerHTML = this.fallbackMarkup;
        return;
      }

      const container = document.createElement('div');
      container.dataset.owner = 'leuffen-news';
      const dataClass = this.getAttribute('data-class');
      if (dataClass) container.className = dataClass;

      for (const notice of notices) {
        const paragraph = document.createElement('p');
        paragraph.dataset.owner = 'leuffen-notice';
        paragraph.textContent = notice.title;
        container.append(paragraph);
      }
      this.replaceChildren(container);
    } catch (error) {
      this.classList.add('no-news');
      this.innerHTML = this.fallbackMarkup;
      reportNoticeError(this, error);
    }
  }
}

if (!customElements.get('leuffen-news')) {
  customElements.define('leuffen-news', LeuffenNews);
}
