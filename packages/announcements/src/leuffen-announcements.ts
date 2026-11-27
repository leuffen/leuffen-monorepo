import { domReady, markdownToHtml, sleep } from './functions.js';
import { OfficeHours } from './office-hours.js';
import type { AnnouncementType } from './types.js';

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

    const type = this.getAttribute('type');
    if (this.defaultMarkup === null) this.defaultMarkup = this.innerHTML;

    // Ein explizit deaktivierter Typ darf auch keinen Fallback anzeigen.
    if (type !== null && window.openhours._features?.[type as AnnouncementType] === false) {
      console.warn(`[leuffen-announcements] Announcement type "${type}" is disabled (window.openhours._features.${type} = false). Nothing will be displayed.`);
      this.classList.add('no-announcements');
      this.replaceChildren();
      return;
    }

    const openhours = new OfficeHours();
    openhours.loadStruct(window.openhours);
    this.innerHTML = '';

    const announcements = document.createElement('div');
    announcements.dataset['owner'] = 'leuffen-announcements';
    if (dataClass !== null) announcements.className = dataClass;
    this.append(announcements);

    const messages = openhours.getAnnouncements(type);
    this.classList.toggle('no-announcements', messages.length === 0);
    for (const message of messages) {
      const item = document.createElement('div');
      item.dataset['owner'] = 'leuffen-announcement';
      item.classList.add(
        'announcement',
        `announcement-${message.type}`,
        `announcement-variant-${message.variant}`,
      );
      if (message.type === 'vacation' && message.popup) item.classList.add('has-popup');
      if (message.is_closed) item.classList.add('is-closed');

      // Urlaubsbanner zeigen weiterhin nur den Titel; Hinweise auch den Text.
      const title = document.createElement('p');
      title.className = 'announcement-title';
      title.innerHTML = markdownToHtml(message.title);
      item.append(title);
      if (message.type !== 'vacation' && message.text) {
        const body = document.createElement('div');
        body.className = 'announcement-text';
        body.innerHTML = markdownToHtml(message.text.replace(/\n/g, '<br>'));
        item.append(body);
      }
      announcements.append(item);
    }

    if (messages.length === 0) {
      this.innerHTML = this.defaultMarkup;
    }
  }
}

if (!customElements.get('leuffen-announcements')) {
  customElements.define('leuffen-announcements', LeuffenAnnouncements);
}
