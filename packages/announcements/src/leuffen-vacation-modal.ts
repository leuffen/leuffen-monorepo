import { domReady, sleep } from './functions.js';
import { LeuffenVacationDialog } from './leuffen-vacation-dialog.js';
import { OfficeHours } from './office-hours.js';

export class LeuffenVacationModal extends HTMLElement {
  async connectedCallback(): Promise<void> {
    this.style.display = 'none';
    await domReady();
    await sleep(100);

    if (window.openhours === undefined) {
      console.error('[leuffen-vacation-modal] window.openhours not defined');
      return;
    }
    if (!Array.isArray(window.openhours.vacation)) {
      console.error(
        '[leuffen-vacation-modal] window.openhours.vacation is not a array',
      );
      return;
    }

    const openhours = new OfficeHours();
    openhours.loadStruct(window.openhours);
    console.log('[leuffen-vacation-modal] openhours loaded', openhours);

    if (openhours.isVacation(null)) {
      console.log('[leuffen-vacation-modal] showing vacation modal');
      const vacation = openhours.getVacation(null);
      if (vacation !== null) await LeuffenVacationDialog.show(vacation);
    }
  }
}

if (!customElements.get('leuffen-vacation-modal')) {
  customElements.define('leuffen-vacation-modal', LeuffenVacationModal);
}
