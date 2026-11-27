export type AnnouncementType = 'vacation' | 'info' | 'popup';
export type AnnouncementVariant = 'danger' | 'warning' | 'info' | 'success';

export interface LeuOpenHour {
  dayOfWeek?: string | number;
  from?: string | number;
  till?: string | number;
  /** Legacy name; new openhours.yml files use till. */
  to?: string | number;
  status?: string | null;
}

export interface LeuVacation {
  from?: string;
  till?: string;
  title?: string;
  text?: string;
  short_text?: string;
  type?: AnnouncementType;
  popup?: boolean;
  is_closed?: boolean;
  variant?: AnnouncementVariant;
}

export class LeuOpenHours {
  public _editor?: string;
  /** Optionale Freigaben nur für den Page-Builder-Editor. */
  public _features?: Partial<Record<AnnouncementType, boolean>>;
  public table?: Array<{ day: string; time: string }>;
  public _status_values?: string[];
  public json?: LeuOpenHour[];
  public vacation?: LeuVacation[];
}

declare global {
  interface Window {
    openhours?: LeuOpenHours;
  }
}
