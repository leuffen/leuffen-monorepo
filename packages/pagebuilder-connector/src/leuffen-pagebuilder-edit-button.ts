import { pagebuilderConfig } from './pagebuilder-config.js';

/**
 * Zeigt das Edit-Icon und navigiert erst beim Klick zum PageBuilder.
 */
export class LeuffenPagebuilderEditButton extends HTMLElement {
  connectedCallback(): void {
    this.innerHTML = `<button type="button" part="button" aria-label="Edit page" title="Edit page">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
        viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        aria-hidden="true" focusable="false">
        <path d="M12 20h9"/>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L9 17l-4 1 1-4Z"/>
      </svg>
    </button>`;

    this.querySelector('button')?.addEventListener('click', this.openPagebuilder);
  }

  disconnectedCallback(): void {
    this.querySelector('button')?.removeEventListener('click', this.openPagebuilder);
  }

  private readonly openPagebuilder = (): void => {
    const { baseUrl, subscriptionId, scopeId, fileName } = pagebuilderConfig;
    if (!baseUrl || !subscriptionId || !fileName) return;

    const url = new URL(baseUrl, document.baseURI);
    url.searchParams.set('subscription', subscriptionId);
    url.searchParams.set('path', fileName);

    if (scopeId) {
      url.searchParams.set('scope', scopeId);
    } else {
      url.searchParams.delete('scope');
    }

    window.location.assign(url.href);
  };
}

if (!customElements.get('leuffen-pagebuilder-edit-button')) {
  customElements.define('leuffen-pagebuilder-edit-button', LeuffenPagebuilderEditButton);
}
