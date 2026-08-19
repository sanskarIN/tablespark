import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PersistedState } from '../domain/types';
import { clearState, exportState, importState, loadState, saveState } from './storage';

const state: PersistedState = {
  schemaVersion: 1,
  activeProfileId: 'p1',
  profiles: [
    {
      id: 'p1',
      name: 'Learner',
      createdAt: '2026-08-19T00:00:00.000Z',
      mastery: {},
      mistakes: [],
    },
  ],
  settings: {
    theme: 'system',
    largeText: false,
    reducedMotion: false,
    speechEnabled: false,
    defaultQuestionCount: 10,
    defaultTimeLimitSeconds: 60,
  },
};

describe('local persistence', () => {
  beforeEach(() => localStorage.clear());

  it('round-trips validated state through localStorage', () => {
    expect(saveState(state)).toBe(true);
    expect(loadState()).toEqual(state);
  });

  it('exports and imports a portable JSON backup', () => {
    expect(importState(exportState(state))).toEqual(state);
  });

  it('rejects malformed backup data', () => {
    expect(() => importState('{"schemaVersion":99}')).toThrow();
  });

  it('returns null instead of throwing for corrupted local storage', () => {
    localStorage.setItem('tablespark.state.v1', '{broken');
    expect(loadState()).toBeNull();
  });

  it('reports storage write failure instead of throwing', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError');
    });
    expect(saveState(state)).toBe(false);
    setItem.mockRestore();
  });

  it('clears persisted state', () => {
    saveState(state);
    expect(clearState()).toBe(true);
    expect(loadState()).toBeNull();
  });
});
