import { fromLegacyOpenHours } from './legacy.js';
import type { LegacyOpenHours, AnnouncementData } from './types.js';

declare global {
  interface Window {
    openhours?: LegacyOpenHours;
  }
}

export function resolveAnnouncementData(
  host: HTMLElement,
  explicitData?: AnnouncementData,
): AnnouncementData | null {
  if (explicitData) return explicitData;

  const source = host.getAttribute('source');
  if (source) {
    const script = document.querySelector(source);
    if (!(script instanceof HTMLScriptElement)) {
      throw new TypeError(`Announcement source ${source} must select a script element`);
    }
    return JSON.parse(script.textContent ?? '') as AnnouncementData;
  }

  return window.openhours ? fromLegacyOpenHours(window.openhours) : null;
}

export function reportAnnouncementError(host: HTMLElement, error: unknown): void {
  host.dispatchEvent(
    new CustomEvent('leuffen-announcements-error', {
      bubbles: true,
      composed: true,
      detail: { error },
    }),
  );
}
