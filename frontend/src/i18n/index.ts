import en from './en.json';
import fr from './fr.json';

export type Language = 'en' | 'fr';

export const translations = {
  en,
  fr,
} as const;

export type TranslationKeys = typeof en;

export const languageNames: Record<Language, string> = {
  en: 'English',
  fr: 'Français',
};

export const languageFlags: Record<Language, string> = {
  en: '🇬🇧',
  fr: '🇫🇷',
};

export default translations;
