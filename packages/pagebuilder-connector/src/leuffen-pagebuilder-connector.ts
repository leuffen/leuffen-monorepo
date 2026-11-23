import { pagebuilderConfig } from './pagebuilder-config.js';

/**
 * Übernimmt die PageBuilder-Konfiguration beim Verbinden mit dem DOM.
 */
export class LeuffenPagebuilderConnector extends HTMLElement {
  connectedCallback(): void {
    pagebuilderConfig.baseUrl = this.getAttribute('base-url');
    pagebuilderConfig.subscriptionId = this.getAttribute('subscription-id');
    pagebuilderConfig.scopeId = this.getAttribute('scope-id');
    pagebuilderConfig.fileName = this.getAttribute('file-name');
  }
}

if (!customElements.get('leuffen-pagebuilder-connector')) {
  customElements.define('leuffen-pagebuilder-connector', LeuffenPagebuilderConnector);
}
