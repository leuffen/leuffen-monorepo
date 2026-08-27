export interface PracticeNoticeDisplay {
  news?: boolean;
  dialog?: 'during' | 'never';
}

export interface PracticeNoticeBase {
  id: string;
  startsOn: string;
  endsOn: string;
  title: string;
  summary?: string;
  content?: string;
  priority?: number;
  display?: PracticeNoticeDisplay;
}

export interface NewsNotice extends PracticeNoticeBase {
  type: 'news';
}

export interface ReplacementPractice {
  name: string;
  phone?: string;
  url?: string;
  note?: string;
}

export interface VacationNotice extends PracticeNoticeBase {
  type: 'vacation';
  replacements?: ReplacementPractice[];
}

export type PracticeNotice = NewsNotice | VacationNotice;

export interface PracticeNoticeData {
  version: 1;
  locale?: string;
  timeZone?: string;
  notices: PracticeNotice[];
}

export interface LegacyVacation {
  from: string;
  till: string;
  title: string;
  text?: string;
  short_text?: string;
}

export interface LegacyOpenHours {
  vacation?: LegacyVacation[];
  [key: string]: unknown;
}
