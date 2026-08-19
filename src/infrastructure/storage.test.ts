import { beforeEach, describe, expect, it } from 'vitest';
import type { PersistedState } from '../domain/types';
import { clearState, exportState, importState, loadState, saveState } from './storage';

const state: PersistedState = {
  schemaVersion: 1,
  activeProfileId: 'p1',
  profiles: [{ id: 'p1', name: 'Learner', createdAt: '2026-08-19T00:00:00.000Z', mastery: {}, mistakes: [] }],
  settings: {
    theme: 'system',
    largeText: false,
    reducedMotion: false,
    soundEnabled: true,
    speechEnabled: false,
    defaultQuestionCount: 10,
    defaultTimeLimitSeconds: 60,
  },
};

describe('local persistence', () => {
  beforeEach(() => localStorage.clear());

  it('round-trips validated state through localStorage', () => {
    saveState(state);
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

  it('clears persisted state', () => {
    saveState(state);
    clearState();
    expect(loadState()).toBeNull();
  });
});
