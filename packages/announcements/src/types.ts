export interface LeuOpenHour {
  dayOfWeek: string | number;
  from: string | number;
  to: string | number;
  status: string;
}

export interface LeuVacation {
  from: string;
  till: string;
  title: string;
  text: string;
  short_text?: string;
}

export class LeuOpenHours {
  public _editor!: string;
  public table!: Array<{ day: string; time: string }>;
  public _status_values!: string[];
  public json!: LeuOpenHour[];
  public vacation!: LeuVacation[];
}

declare global {
  interface Window {
    openhours?: LeuOpenHours;
  }
}
