import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readBooleanFlag, writeBooleanFlag } from './browserPreferences';

describe('browser preference flags', () => {
  beforeEach(() => localStorage.clear());

  it('round-trips boolean flags', () => {
    expect(writeBooleanFlag('feature', true)).toBe(true);
    expect(readBooleanFlag('feature')).toBe(true);
  });

  it('uses the fallback for missing flags', () => {
    expect(readBooleanFlag('missing', true)).toBe(true);
  });

  it('handles storage read failures without throwing', () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(() => {
      throw new DOMException('Blocked', 'SecurityError');
    });
    expect(readBooleanFlag('feature', true)).toBe(true);
    getItem.mockRestore();
  });

  it('reports storage write failures without throwing', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw new DOMException('Blocked', 'SecurityError');
    });
    expect(writeBooleanFlag('feature', true)).toBe(false);
    setItem.mockRestore();
  });
});
