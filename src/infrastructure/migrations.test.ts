import { describe, expect, it } from 'vitest';
import { CURRENT_SCHEMA_VERSION, migratePersistedState } from './migrations';

describe('persisted state migrations', () => {
  it('accepts the current schema version unchanged', () => {
    const candidate = { schemaVersion: CURRENT_SCHEMA_VERSION, profiles: [] };
    expect(migratePersistedState(candidate)).toBe(candidate);
  });

  it('rejects unknown schema versions explicitly', () => {
    expect(() => migratePersistedState({ schemaVersion: 99 })).toThrow('Unsupported backup schema version');
  });

  it('rejects non-object roots', () => {
    expect(() => migratePersistedState('invalid')).toThrow('Backup root must be an object');
  });
});
