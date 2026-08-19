import { DEFAULT_SESSION_HISTORY_LIMIT } from '../domain/sessions';

const CURRENT_SCHEMA_VERSION = 2;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function migrateProfileFromV1(candidate: unknown): unknown {
  if (!isRecord(candidate)) return candidate;
  return {
    ...candidate,
    sessions: [],
    masteredFactsGoal: null,
  };
}

function migrateFromV1(candidate: Record<string, unknown>): Record<string, unknown> {
  return {
    ...candidate,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    profiles: Array.isArray(candidate.profiles)
      ? candidate.profiles.map(migrateProfileFromV1)
      : candidate.profiles,
    settings: isRecord(candidate.settings)
      ? {
          ...candidate.settings,
          sessionHistoryLimit: DEFAULT_SESSION_HISTORY_LIMIT,
        }
      : candidate.settings,
  };
}

export function migratePersistedState(candidate: unknown): unknown {
  if (!isRecord(candidate)) throw new Error('Backup root must be an object.');
  const version = candidate.schemaVersion;
  if (version === CURRENT_SCHEMA_VERSION) return candidate;
  if (version === 1) return migrateFromV1(candidate);
  if (typeof version !== 'number') throw new Error('Backup schema version is missing.');
  throw new Error(`Unsupported backup schema version: ${String(version)}.`);
}

export { CURRENT_SCHEMA_VERSION };
