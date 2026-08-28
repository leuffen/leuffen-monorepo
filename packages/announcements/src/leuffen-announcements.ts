import { domReady, markdownToHtml, sleep } from './functions.js';
import { OfficeHours } from './office-hours.js';

export class LeuffenAnnouncements extends HTMLElement {
  private defaultMarkup: string | null = null;

  async connectedCallback(): Promise<void> {
    await domReady();
    await sleep(100);

    const dataClass = this.getAttribute('data-class');
    if (window.openhours === undefined) {
      console.error('[leuffen-announcements] window.openhours not defined');
      return;
    }

    const openhours = new OfficeHours();
    openhours.loadStruct(window.openhours);

    if (this.defaultMarkup === null) this.defaultMarkup = this.innerHTML;
    this.innerHTML = '';

    const announcements = document.createElement('div');
    announcements.dataset['owner'] = 'leuffen-announcements';
    if (dataClass !== null) announcements.className = dataClass;
    this.append(announcements);

    let messageCount = 0;
    for (const vacation of openhours.getUpcomingVacation(null)) {
      messageCount++;
      const paragraph = document.createElement('p');
      paragraph.dataset['owner'] = 'leuffen-announcement';
      paragraph.innerHTML = markdownToHtml(vacation.title);
      announcements.append(paragraph);
    }

    if (messageCount === 0) {
      this.classList.add('no-announcements');
      this.innerHTML = this.defaultMarkup;
    }
  }
}

if (!customElements.get('leuffen-announcements')) {
  customElements.define('leuffen-announcements', LeuffenAnnouncements);
}
