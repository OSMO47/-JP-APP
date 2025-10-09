import type { JLPTLevel } from '@/types/vocab';

export type AppLanguage = 'th' | 'jp';

export interface AppSettings {
  language: AppLanguage;
  showKana: boolean;
  enableAudio: boolean;
  darkMode: boolean;
  levels: JLPTLevel[];
}

export const defaultSettings: AppSettings = {
  language: 'th',
  showKana: true,
  enableAudio: false,
  darkMode: false,
  levels: ['N5', 'N4', 'N3']
};
