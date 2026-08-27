import { NteDialogComponent } from '@nextrap/nte-dialog-component';
import { html } from 'lit';

import type { VacationAnnouncement } from './types.js';

export class LeuffenVacationDialog extends NteDialogComponent<
  VacationAnnouncement,
  void
> {
  protected override dialogOptions = {
    dismiss: {
      closeButton: true,
      escape: true,
      backdrop: 'shake' as const,
    },
  };

  protected override renderTitle() {
    return this.input.title;
  }

  protected override renderDialog() {
    const body = this.input.content ?? this.input.summary ?? '';
    return html`
      ${body
        ? html`<p>
            ${body
              .split('\n')
              .map(
                (line, index) =>
                  html`${index > 0 ? html`<br />` : null}${line}`,
              )}
          </p>`
        : null}
      ${this.input.replacements?.length
        ? html`
            <section aria-label="Urlaubsvertretung">
              <h3>Vertretung</h3>
              <ul>
                ${this.input.replacements.map(
                  (replacement) => html`
                    <li>
                      <strong>${replacement.name}</strong>
                      ${replacement.phone
                        ? html`<br /><a href=${`tel:${replacement.phone}`}
                              >${replacement.phone}</a
                            >`
                        : null}
                      ${replacement.url
                        ? html`<br /><a href=${replacement.url}>Website</a>`
                        : null}
                      ${replacement.note
                        ? html`<br />${replacement.note}`
                        : null}
                    </li>
                  `,
                )}
              </ul>
            </section>
          `
        : null}
    `;
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
