export interface AnnouncementDisplay {
  list?: boolean;
  dialog?: 'during' | 'never';
}

export interface AnnouncementBase {
  id: string;
  startsOn: string;
  endsOn: string;
  title: string;
  summary?: string;
  content?: string;
  priority?: number;
  display?: AnnouncementDisplay;
}

export interface GeneralAnnouncement extends AnnouncementBase {
  type: 'announcement';
}

export interface ReplacementPractice {
  name: string;
  phone?: string;
  url?: string;
  note?: string;
}

export interface VacationAnnouncement extends AnnouncementBase {
  type: 'vacation';
  replacements?: ReplacementPractice[];
}

export type Announcement = GeneralAnnouncement | VacationAnnouncement;

export interface AnnouncementData {
  version: 1;
  locale?: string;
  timeZone?: string;
  announcements: Announcement[];
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
