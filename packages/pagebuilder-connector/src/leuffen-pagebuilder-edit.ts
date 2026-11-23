type SubscriptionData = string | {
  id?: string;
  subscriptionId?: string;
  basePath?: string;
  pagebuilderBasePath?: string;
};

type SubscriptionWindow = Window & {
  'micx-subscription'?: SubscriptionData;
  'mix-subscription'?: SubscriptionData;
  micxSubscription?: SubscriptionData;
};

/**
 * Renders an inline edit icon linking to the PageBuilder for the current page.
 * Set base-path on the element or provide a basePath in the subscription data.
 */
export class LeuffenPagebuilderEdit extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['base-path', 'subscription-id'];
  }

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

  attributeChangedCallback(): void {
    this.updateLink();
  }

  private readonly updateLink = (): void => {
    const anchor = this.querySelector('a');
    if (!anchor) return;

    const globalWindow = window as SubscriptionWindow;
    const subscription =
      globalWindow['micx-subscription'] ??
      globalWindow['mix-subscription'] ??
      globalWindow.micxSubscription;

    const subscriptionId = this.getAttribute('subscription-id') ||
      (typeof subscription === 'string'
        ? subscription
        : subscription?.subscriptionId || subscription?.id);

    const basePath = this.getAttribute('base-path') ||
      (typeof subscription === 'object'
        ? subscription.pagebuilderBasePath || subscription.basePath
        : undefined);

    if (!subscriptionId || !basePath) {
      anchor.removeAttribute('href');
      return;
    }

    const url = new URL(basePath, document.baseURI);
    url.searchParams.set('subscription', subscriptionId);
    url.searchParams.set('path', window.location.pathname);
    anchor.href = url.href;
  };
}

if (!customElements.get('leuffen-pagebuilder-edit')) {
  customElements.define('leuffen-pagebuilder-edit', LeuffenPagebuilderEdit);
}
