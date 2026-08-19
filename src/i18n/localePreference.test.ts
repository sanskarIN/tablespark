import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  isLocale,
  readLocalePreference,
  writeLocalePreference,
} from './localePreference';

describe('locale preference', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('recognizes only supported locale identifiers', () => {
    expect(isLocale('en')).toBe(true);
    expect(isLocale('hi')).toBe(true);
    expect(isLocale('fr')).toBe(false);
    expect(isLocale(null)).toBe(false);
  });

  it('prefers a valid stored locale over the browser locale', () => {
    localStorage.setItem('tablespark.locale.v1', 'hi');
    expect(readLocalePreference()).toBe('hi');
  });

  it('falls back to Hindi for a Hindi browser locale when no valid preference exists', () => {
    Object.defineProperty(window.navigator, 'language', {
      configurable: true,
      value: 'hi-IN',
    });
    localStorage.setItem('tablespark.locale.v1', 'unsupported');

    expect(readLocalePreference()).toBe('hi');
  });

  it('falls back to English for other browser locales', () => {
    Object.defineProperty(window.navigator, 'language', {
      configurable: true,
      value: 'en-IN',
    });

    expect(readLocalePreference()).toBe('en');
  });

  it('returns false rather than throwing when locale storage is blocked', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Blocked', 'SecurityError');
    });

    expect(writeLocalePreference('hi')).toBe(false);
    setItem.mockRestore();
  });
});
