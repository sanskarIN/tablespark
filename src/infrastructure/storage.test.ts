import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PersistedState } from '../domain/types';
import {
  clearState,
  exportState,
  importState,
  loadState,
  loadStateResult,
  MAX_BACKUP_BYTES,
  readRawState,
  saveState,
} from './storage';

const state: PersistedState = {
  schemaVersion: 2,
  activeProfileId: 'p1',
  profiles: [
    {
      id: 'p1',
      name: 'Learner',
      createdAt: '2026-08-19T00:00:00.000Z',
      mastery: {},
      mistakes: [],
      sessions: [],
      masteredFactsGoal: null,
    },
  ],
  settings: {
    theme: 'system',
    largeText: false,
    reducedMotion: false,
    speechEnabled: false,
    defaultQuestionCount: 10,
    defaultTimeLimitSeconds: 60,
    sessionHistoryLimit: 25,
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

  it('migrates a valid schema one backup during import', () => {
    const legacy = {
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

    expect(importState(JSON.stringify(legacy))).toEqual(state);
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

  it('rejects non-canonical mastery keys', () => {
    const profile = state.profiles[0]!;
    const invalid = {
      ...state,
      profiles: [
        {
          ...profile,
          mastery: {
            '7x4': {
              key: '7x4',
              attempts: 1,
              correct: 1,
              streak: 1,
              lastAttemptAt: '2026-08-19T00:00:00.000Z',
            },
          },
        },
      ],
    };
    expect(() => importState(JSON.stringify(invalid))).toThrow(
      'Mastery key must be a canonical multiplication fact',
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

  it('rejects correct attempts stored in mistake history', () => {
    const profile = state.profiles[0]!;
    const invalid = {
      ...state,
      profiles: [
        {
          ...profile,
          mistakes: [
            {
              question: { id: 'correct', left: 4, right: 7, answer: 28 },
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
      'Saved mistake history cannot contain correct attempts',
    );
  });

  it('rejects inconsistent session summaries', () => {
    const profile = state.profiles[0]!;
    const invalid = {
      ...state,
      profiles: [
        {
          ...profile,
          sessions: [
            {
              id: 'session-1',
              kind: 'generated',
              mode: 'untimed',
              completedAt: '2026-08-19T00:00:00.000Z',
              questionCount: 10,
              correctCount: 11,
              elapsedMs: 1000,
              seed: null,
            },
          ],
        },
      ],
    };

    expect(() => importState(JSON.stringify(invalid))).toThrow(
      'Session correct answers cannot exceed its question count',
    );
  });

  it('rejects generated sessions without replay seeds', () => {
    const profile = state.profiles[0]!;
    const invalid = {
      ...state,
      profiles: [
        {
          ...profile,
          sessions: [
            {
              id: 'session-1',
              kind: 'generated',
              mode: 'untimed',
              completedAt: '2026-08-19T00:00:00.000Z',
              questionCount: 10,
              correctCount: 8,
              elapsedMs: 1000,
              seed: null,
            },
          ],
        },
      ],
    };

    expect(() => importState(JSON.stringify(invalid))).toThrow(
      'Generated sessions must retain their replay seed',
    );
  });

  it('rejects session history beyond the selected retention limit', () => {
    const profile = state.profiles[0]!;
    const sessions = Array.from({ length: 11 }, (_, index) => ({
      id: `session-${index}`,
      kind: 'generated' as const,
      mode: 'untimed' as const,
      completedAt: '2026-08-19T00:00:00.000Z',
      questionCount: 10,
      correctCount: 8,
      elapsedMs: 1000,
      seed: index,
    }));
    const invalid = {
      ...state,
      settings: { ...state.settings, sessionHistoryLimit: 10 },
      profiles: [{ ...profile, sessions }],
    };

    expect(() => importState(JSON.stringify(invalid))).toThrow(
      'Session history exceeds the configured retention limit',
    );
  });

  it('rejects unsupported session retention limits and profile goals', () => {
    expect(() =>
      importState(
        JSON.stringify({
          ...state,
          settings: { ...state.settings, sessionHistoryLimit: 11 },
        }),
      ),
    ).toThrow('Session history limit is not supported');

    expect(() =>
      importState(
        JSON.stringify({
          ...state,
          profiles: [{ ...state.profiles[0]!, masteredFactsGoal: 0 }],
        }),
      ),
    ).toThrow();
  });

  it('marks corrupted local storage invalid while preserving its raw value', () => {
    localStorage.setItem('tablespark.state.v1', '{broken');
    expect(loadStateResult()).toEqual({ status: 'invalid', state: null });
    expect(loadState()).toBeNull();
    expect(readRawState()).toBe('{broken');
  });

  it('classifies blocked storage reads as unavailable instead of invalid', () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Blocked', 'SecurityError');
    });

    expect(loadStateResult()).toEqual({ status: 'unavailable', state: null });
    getItem.mockRestore();
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
