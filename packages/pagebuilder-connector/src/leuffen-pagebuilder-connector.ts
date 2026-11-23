/**
 * Stores the PageBuilder configuration for edit buttons on the page.
 * No visible markup is rendered by this component.
 */
export class LeuffenPagebuilderConnector extends HTMLElement {
  /**
   * Creates the edit URL from the element's configuration.
   * Returns null while required attributes are missing.
   */
  getEditUrl(): string | null {
    const baseUrl = this.getAttribute('base-url');
    const subscriptionId = this.getAttribute('subscription-id');
    const fileName = this.getAttribute('file-name');

    if (!baseUrl || !subscriptionId || !fileName) {
      return null;
    }

    const url = new URL(baseUrl, document.baseURI);
    url.searchParams.set('subscription', subscriptionId);
    url.searchParams.set('path', fileName);

    const scopeId = this.getAttribute('scope-id');
    if (scopeId) {
      url.searchParams.set('scope', scopeId);
    } else {
      url.searchParams.delete('scope');
    }

    return url.href;
  }
}

if (!customElements.get('leuffen-pagebuilder-connector')) {
  customElements.define('leuffen-pagebuilder-connector', LeuffenPagebuilderConnector);
}
