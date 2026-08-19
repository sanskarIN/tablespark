const CURRENT_SCHEMA_VERSION = 1;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function migratePersistedState(candidate: unknown): unknown {
  if (!isRecord(candidate)) throw new Error('Backup root must be an object.');
  const version = candidate.schemaVersion;
  if (version === CURRENT_SCHEMA_VERSION) return candidate;
  if (typeof version !== 'number') throw new Error('Backup schema version is missing.');
  throw new Error(`Unsupported backup schema version: ${String(version)}.`);
}

export { CURRENT_SCHEMA_VERSION };
