# Persisted Data Schema — Version 2

This document describes TableSpark's current learner-state persistence contract. The validator in `src/infrastructure/storage.ts` is the executable source of truth; this document exists to make migrations, privacy review, backup compatibility, and release testing easier to audit.

## Storage key

Current learner state is stored under:

```text
tablespark.state.v1
```

The storage-key suffix did **not** change when the internal schema moved from version 1 to version 2. Keeping the key stable allows the application to discover and migrate a valid older value in place.

The interface-language preference is separate:

```text
tablespark.locale.v1
```

It is not part of the learner-state backup format documented below.

## Top-level shape

A valid version-2 state has this conceptual shape:

```ts
interface PersistedStateV2 {
  schemaVersion: 2;
  activeProfileId: string;
  profiles: ProfileV2[];
  settings: AppSettingsV2;
}
```

The application requires at least one profile and currently allows at most 100 profiles.

`activeProfileId` must reference exactly one existing profile.

Profile identifiers must be unique.

## Profile shape

```ts
interface ProfileV2 {
  id: string;
  name: string;
  createdAt: string;
  mastery: Record<string, MasteryStat>;
  mistakes: Attempt[];
  sessions: SessionSummary[];
  masteredFactsGoal: number | null;
}
```

### Profile identity

- `id` is bounded text and must be unique inside the backup.
- `name` must contain non-whitespace text and is length-bounded.
- `createdAt` must use the application's canonical ISO-8601 UTC timestamp format.

### Mastery

Each mastery entry stores:

```ts
interface MasteryStat {
  key: string;
  attempts: number;
  correct: number;
  streak: number;
  lastAttemptAt: string;
}
```

Important semantic rules:

- object key and `MasteryStat.key` must match;
- the key must be the canonical commutative multiplication fact key;
- `correct` cannot exceed `attempts`;
- `streak` cannot exceed `correct` or `attempts`;
- timestamps must use the canonical application format.

For example, 4 × 7 and 7 × 4 contribute to the same canonical fact key rather than creating two independent mastery records.

### Recent mistakes

Each saved mistake is an `Attempt`:

```ts
interface Attempt {
  question: Question;
  response: number | null;
  correct: boolean;
  answeredAt: string;
  elapsedMs: number;
}
```

The current mistake list is capped at 100 entries.

A `Question` stores:

```ts
interface Question {
  id: string;
  left: number;
  right: number;
  answer: number;
}
```

Semantic validation verifies:

- operands are within the supported question bounds;
- `answer === left * right`;
- attempt correctness matches whether the recorded response equals the answer;
- saved mistake history contains only incorrect attempts;
- elapsed time is finite and non-negative;
- timestamps use the canonical application format.

### Session summaries

```ts
interface SessionSummary {
  id: string;
  kind: 'generated' | 'mistake-review';
  mode: 'timed' | 'untimed';
  completedAt: string;
  questionCount: number;
  correctCount: number;
  elapsedMs: number;
  seed: number | null;
}
```

Session history is summary-only. It does not duplicate every answer submitted in the practice session.

Rules include:

- `questionCount` is a positive supported count;
- `correctCount` cannot exceed `questionCount`;
- `elapsedMs` is finite and non-negative;
- `completedAt` is a canonical application timestamp;
- a `generated` session must keep its validated replay seed;
- a `mistake-review` session must use `seed: null`;
- a profile cannot retain more summaries than the selected application retention setting;
- the hard schema maximum is 100 summaries per profile.

### Optional mastered-facts goal

`masteredFactsGoal` is either `null` or a positive bounded integer.

The current hard maximum is 10,000.

This field is intentionally a low-pressure local target. Its existence does not imply a deadline, notification schedule, daily streak requirement, ranking, or penalty.

## Settings shape

Conceptually:

```ts
interface AppSettingsV2 {
  theme: 'system' | 'light' | 'dark';
  largeText: boolean;
  reducedMotion: boolean;
  speechEnabled: boolean;
  defaultQuestionCount: number;
  defaultTimeLimitSeconds: number;
  sessionHistoryLimit: 10 | 25 | 50 | 100;
}
```

Current bounds:

- default question count: 1–200;
- default timed-session duration: 10–3600 seconds;
- session history retention: exactly 10, 25, 50, or 100.

Reducing the selected retention limit trims older local summaries immediately before the next persisted state is written.

## Size budget

Both current persisted learner state and imported backup text share a 2,000,000-byte budget.

The import path checks this budget before JSON parsing. The save path checks serialized state before writing to browser storage.

The size budget is a product reliability/privacy guardrail, not a claim about the browser's total storage quota.

## Version-1 migration

A valid schema-1 state is migrated locally by adding:

```text
profile.sessions = []
profile.masteredFactsGoal = null
settings.sessionHistoryLimit = 25
schemaVersion = 2
```

The resulting candidate then passes through the normal schema-2 validator.

Migration does not:

- upload learner data;
- bypass semantic validation;
- guess at malformed unknown fields;
- silently treat an unsupported schema as current data.

If an existing value cannot be parsed, migrated, or validated, TableSpark preserves the raw stored value for explicit recovery instead of automatically overwriting it with defaults.

## Backup import behavior

A selected backup is untrusted input.

Before replacement, TableSpark:

1. checks the byte budget;
2. parses JSON;
3. applies a supported schema migration when required;
4. validates structural fields and bounds;
5. validates semantic invariants;
6. asks the user to confirm replacement;
7. replaces current state only with the validated result.

A valid import can also resolve the unreadable-local-data recovery state because the user has explicitly selected a valid replacement.

## Export behavior

Export serializes the validated in-memory learner state as formatted JSON.

An exported file can contain personal learning information, including:

- profile names;
- mastery history;
- recent mistakes;
- session summaries;
- optional goals;
- learning/application settings.

Treat exported JSON as a personal file.

The separate interface-language preference is not included in this backup.

## Reset and deletion behavior

Resetting the active profile's learning progress clears:

- mastery statistics;
- recent mistakes;
- session summaries.

It does not automatically clear the optional mastered-facts goal. The goal can be cleared separately.

Deleting a profile removes that profile's local learning data after confirmation, but the application never allows deleting the last remaining profile.

Clearing browser site data can remove all TableSpark local data, including learner state and the separate locale preference.

## Rules for a future schema version

A schema-3 change should not simply edit the schema-2 validator in place. It should:

1. increment `schemaVersion`;
2. add an explicit migration path in `src/infrastructure/migrations.ts`;
3. keep known old data where safe;
4. route migrated output through the new validator;
5. add migration and malformed-input regression tests;
6. update `PRIVACY.md`, `README.md`, architecture/testing docs, this document, and `what_changed.md`;
7. document whether old exported backups remain importable;
8. preserve unreadable/unknown state for recovery rather than silently destroying it.
