import { pagebuilderConfig } from './pagebuilder-config.js';

/**
 * Übernimmt die PageBuilder-Konfiguration beim Verbinden mit dem DOM.
 */
export class LeuffenPagebuilderConnector extends HTMLElement {
  connectedCallback(): void {
    if (this.hasAttribute('base-url')) {
      pagebuilderConfig.baseUrl = this.getAttribute('base-url');
    }
    if (this.hasAttribute('subscription-id')) {
      pagebuilderConfig.subscriptionId = this.getAttribute('subscription-id');
    }
    if (this.hasAttribute('scope-id')) {
      pagebuilderConfig.scopeId = this.getAttribute('scope-id');
    }
    if (this.hasAttribute('file-name')) {
      pagebuilderConfig.fileName = this.getAttribute('file-name');
    }
  }
}

if (!customElements.get('leuffen-pagebuilder-connector')) {
  customElements.define('leuffen-pagebuilder-connector', LeuffenPagebuilderConnector);
}
