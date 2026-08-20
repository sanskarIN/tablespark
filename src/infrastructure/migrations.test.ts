import { describe, expect, it } from 'vitest';
import { DEFAULT_SESSION_HISTORY_LIMIT } from '../domain/sessions';
import { CURRENT_SCHEMA_VERSION, migratePersistedState } from './migrations';

describe('persisted state migrations', () => {
  it('accepts the current schema version unchanged', () => {
    const candidate = { schemaVersion: CURRENT_SCHEMA_VERSION, profiles: [] };
    expect(migratePersistedState(candidate)).toBe(candidate);
  });

  it('migrates schema one profiles and settings to schema two', () => {
    const candidate = {
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

    expect(migratePersistedState(candidate)).toEqual({
      ...candidate,
      schemaVersion: 2,
      profiles: [
        {
          ...candidate.profiles[0],
          sessions: [],
          masteredFactsGoal: null,
        },
      ],
      settings: {
        ...candidate.settings,
        sessionHistoryLimit: DEFAULT_SESSION_HISTORY_LIMIT,
      },
    });
  });

  it('lets validation handle malformed schema one profile/settings shapes after migration', () => {
    expect(migratePersistedState({ schemaVersion: 1, profiles: 'bad', settings: null })).toEqual({
      schemaVersion: 2,
      profiles: 'bad',
      settings: null,
    });
  });

  it('rejects unknown schema versions explicitly', () => {
    expect(() => migratePersistedState({ schemaVersion: 99 })).toThrow(
      'Unsupported backup schema version',
    );
  });

  it('rejects non-object roots', () => {
    expect(() => migratePersistedState('invalid')).toThrow('Backup root must be an object');
  });
});
