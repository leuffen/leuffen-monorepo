import { NteDialogComponent } from '@nextrap/nte-dialog-component';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { markdownToHtml } from './functions.js';

export interface VacationDialogInput {
  title: string;
  text: string;
  classes?: string;
}

export class LeuffenVacationDialog extends NteDialogComponent<
  VacationDialogInput,
  void
> {
  protected override dialogOptions = {
    dismiss: {
      closeButton: true,
      escape: false,
      backdrop: 'close' as const,
    },
  };

  protected override renderTitle() {
    return html`${unsafeHTML(markdownToHtml(this.input.title))}`;
  }

  protected override renderDialog() {
    const body = this.input.text.replace(/\n/g, '<br>');
    return html`${unsafeHTML(markdownToHtml(body))}`;
  }

  protected override renderFooter() {
    return html`<button
      type="button"
      class="btn btn-secondary"
      @click=${() => this.abort()}
    >
      Schließen
    </button>`;
  }
}

if (!customElements.get('leuffen-vacation-dialog')) {
  customElements.define('leuffen-vacation-dialog', LeuffenVacationDialog);
}
