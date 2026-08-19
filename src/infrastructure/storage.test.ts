import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PersistedState } from '../domain/types';
import {
  clearState,
  exportState,
  importState,
  loadState,
  MAX_BACKUP_BYTES,
  saveState,
} from './storage';

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

  it('rejects backup data above the application size budget', () => {
    expect(() => importState(' '.repeat(MAX_BACKUP_BYTES + 1))).toThrow(
      'Backup data cannot exceed',
    );
  });

  it('rejects duplicate profile IDs', () => {
    const profile = state.profiles[0]!;
    const invalid = {
      ...state,
      profiles: [profile, { ...profile, name: 'Duplicate' }],
    };
    expect(() => importState(JSON.stringify(invalid))).toThrow('Profile IDs must be unique');
  });

  it('rejects impossible mastery counters', () => {
    const profile = state.profiles[0]!;
    const invalid = {
      ...state,
      profiles: [
        {
          ...profile,
          mastery: {
            '4x7': {
              key: '4x7',
              attempts: 2,
              correct: 3,
              streak: 3,
              lastAttemptAt: '2026-08-19T00:00:00.000Z',
            },
          },
        },
      ],
    };
    expect(() => importState(JSON.stringify(invalid))).toThrow(
      'Correct answers cannot exceed attempts',
    );
  });

  it('rejects inconsistent question answers and attempt correctness', () => {
    const profile = state.profiles[0]!;
    const invalid = {
      ...state,
      profiles: [
        {
          ...profile,
          mistakes: [
            {
              question: { id: 'bad', left: 4, right: 7, answer: 99 },
              response: 28,
              correct: true,
              answeredAt: '2026-08-19T00:00:00.000Z',
              elapsedMs: 500,
            },
          ],
        },
      ],
    };
    expect(() => importState(JSON.stringify(invalid))).toThrow(
      'Question answer must match its operands',
    );
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
