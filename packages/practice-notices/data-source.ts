import { fromLegacyOpenHours } from './legacy.js';
import type { LegacyOpenHours, PracticeNoticeData } from './types.js';

declare global {
  interface Window {
    openhours?: LegacyOpenHours;
  }
}

export function resolvePracticeNoticeData(
  host: HTMLElement,
  explicitData?: PracticeNoticeData,
): PracticeNoticeData | null {
  if (explicitData) return explicitData;

  const source = host.getAttribute('source');
  if (source) {
    const script = document.querySelector(source);
    if (!(script instanceof HTMLScriptElement)) {
      throw new TypeError(`Practice notice source ${source} must select a script element`);
    }
    return JSON.parse(script.textContent ?? '') as PracticeNoticeData;
  }

  return window.openhours ? fromLegacyOpenHours(window.openhours) : null;
}

export function reportNoticeError(host: HTMLElement, error: unknown): void {
  host.dispatchEvent(
    new CustomEvent('leuffen-notices-error', {
      bubbles: true,
      composed: true,
      detail: { error },
    }),
  );
}
