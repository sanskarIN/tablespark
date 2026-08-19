import { logger } from '../infrastructure/logger';

export type Locale = 'en' | 'hi';

export const SUPPORTED_LOCALES: ReadonlyArray<{
  readonly value: Locale;
  readonly label: string;
}> = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिन्दी' },
];

const LOCALE_KEY = 'tablespark.locale.v1';

export function isLocale(value: string | null): value is Locale {
  return value === 'en' || value === 'hi';
}

export function readLocalePreference(): Locale {
  try {
    const stored = localStorage.getItem(LOCALE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    logger.warn('locale_preference_read_failed');
  }

  return navigator.language.toLowerCase().startsWith('hi') ? 'hi' : 'en';
}

export function writeLocalePreference(locale: Locale): boolean {
  try {
    localStorage.setItem(LOCALE_KEY, locale);
    return true;
  } catch {
    logger.warn('locale_preference_write_failed');
    return false;
  }
}
