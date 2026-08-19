import { logger } from './logger';

export function readBooleanFlag(key: string, fallback = false): boolean {
  try {
    const value = localStorage.getItem(key);
    if (value === null) return fallback;
    return value === 'true';
  } catch {
    logger.warn('preference_read_failed');
    return fallback;
  }
}

export function writeBooleanFlag(key: string, value: boolean): boolean {
  try {
    localStorage.setItem(key, String(value));
    return true;
  } catch {
    logger.warn('preference_write_failed');
    return false;
  }
}
