import { LeuffenPagebuilderConnector } from './leuffen-pagebuilder-connector.js';

/**
 * Renders the PageBuilder edit icon and uses the shared connector configuration.
 */
export class LeuffenPagebuilderEditButton extends HTMLElement {
  connectedCallback(): void {
    this.innerHTML = `<a part="link" aria-label="Edit page" title="Edit page">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
        viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        aria-hidden="true" focusable="false">
        <path d="M12 20h9"/>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L9 17l-4 1 1-4Z"/>
      </svg>
    </a>`;

    this.querySelector('a')?.addEventListener('click', this.updateLink);
    this.updateLink();
  }

  disconnectedCallback(): void {
    this.querySelector('a')?.removeEventListener('click', this.updateLink);
  }

  private readonly updateLink = (): void => {
    const anchor = this.querySelector('a');
    if (!anchor) return;

    const connector = this.closest('leuffen-pagebuilder-connector') ??
      document.querySelector('leuffen-pagebuilder-connector');

    const url = connector instanceof LeuffenPagebuilderConnector
      ? connector.getEditUrl()
      : null;

    if (url === null) {
      anchor.removeAttribute('href');
      return;
    }

    anchor.href = url;
  };
}

if (!customElements.get('leuffen-pagebuilder-edit-button')) {
  customElements.define('leuffen-pagebuilder-edit-button', LeuffenPagebuilderEditButton);
}
