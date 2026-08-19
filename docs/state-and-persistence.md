# TableSpark State and Persistence Lifecycle

This document explains how application state moves between React, domain rules, browser storage, backup import/export, and unreadable-data recovery.

The most important design principle is:

> **A missing value and an existing-but-unreadable value are different states.**

TableSpark may create defaults for an empty installation. It must not automatically overwrite an existing local value that failed parsing, migration, or validation.

See also:

- `docs/data-schema-v2.md` — field-level persisted schema contract;
- `docs/adr/0002-local-first-persistence.md` — local-first decision;
- `docs/adr/0004-preserve-unreadable-local-state.md` — unreadable-state preservation decision;
- `PRIVACY.md` — user-facing privacy implications.

# Main files

```text
src/state/AppStateContext.ts
src/state/AppStateProvider.tsx
src/state/useAppState.ts
src/infrastructure/storage.ts
src/infrastructure/migrations.ts
src/domain/types.ts
src/domain/mastery.ts
src/domain/sessions.ts
src/features/settings/SettingsPage.tsx
src/components/StatusBanners.tsx
```

# Storage locations

## Learner state

Browser key:

```text
tablespark.state.v1
```

Current internal schema:

```text
schemaVersion: 2
```

The storage-key suffix remains `v1` intentionally. The **key version** and **persisted schema version** are different concepts. Keeping the existing key lets TableSpark discover schema-1 data and migrate it.

Do not rename the storage key simply because a schema version increments. A key rename can make existing data appear missing unless an explicit key migration is implemented.

## Locale preference

Browser key:

```text
tablespark.locale.v1
```

This is intentionally outside learner-state JSON and backup export.

## Onboarding preference

A small separate browser preference records whether the first-run welcome message was dismissed.

These lightweight UI preferences are independent of learner mastery/session data.

# Startup lifecycle

`AppStateProvider` calls `loadStateResult()` once when its initial state is created.

`loadStateResult()` returns one of three states:

```ts
{ status: 'empty', state: null }
{ status: 'loaded', state: PersistedState }
{ status: 'invalid', state: null }
```

## Case 1 — `empty`

Meaning:

```text
localStorage.getItem('tablespark.state.v1') === null
```

No learner-state value exists.

Provider behavior:

1. create one default local profile named `Learner`;
2. create default settings;
3. use schema version 2;
4. allow normal automatic persistence.

A new profile id is generated with `crypto.randomUUID()` and creation time with `new Date().toISOString()`.

## Case 2 — `loaded`

Meaning:

- a value exists;
- byte-budget check succeeds;
- JSON parsing succeeds;
- supported migration succeeds if needed;
- schema-2 structural and semantic validation succeeds.

Provider behavior:

- use the validated persisted state;
- allow automatic persistence;
- resolve the active profile from `activeProfileId`.

If the active profile cannot exist after validation, that is a validator defect because storage validation explicitly requires the reference to match a profile.

## Case 3 — `invalid`

Meaning: a value exists but one of these failed:

- browser storage read;
- size budget;
- JSON parse;
- schema migration;
- schema validation;
- semantic invariant validation.

Provider behavior:

1. create a **temporary in-memory default state** so the interface can still render;
2. set `unreadableStoredState = true`;
3. set persistence unavailable;
4. **do not save the temporary default state over the existing raw value**;
5. display recovery guidance;
6. wait for explicit user recovery/replacement/discard action.

This is the critical data-preservation behavior.

# Automatic persistence

`AppStateProvider` has an effect watching:

- current state;
- unreadable-state flag.

Conceptually:

```text
state changes
  ↓
unreadableStoredState?
  ├─ yes → do not save; persistenceAvailable = false
  └─ no  → saveState(state)
             ↓
           boolean success
             ↓
           persistenceAvailable
```

`saveState()`:

1. serializes with `JSON.stringify`;
2. verifies the 2,000,000-byte budget;
3. calls `localStorage.setItem`;
4. returns `true` on success;
5. logs a technical warning and returns `false` on failure.

It does not throw storage errors into the React tree.

# Storage write failure vs unreadable stored state

These are different conditions.

## Normal write failure

Example causes:

- browser quota;
- restrictive browser mode;
- storage permission/policy;
- browser implementation failure.

The current in-memory state can still be valid and usable.

UI consequence:

```text
Local saving is unavailable.
```

The learner should understand that current changes may not survive reload.

## Unreadable existing value

A pre-existing value itself cannot be safely interpreted.

UI consequence:

```text
Stored learning data needs recovery.
```

Automatic saving is paused because writing would risk destroying the original value.

Do not merge these two states into one generic “storage error” flag; their safe recovery behavior is different.

# Default state

Current default settings:

```text
theme: system
largeText: false
reducedMotion: false
speechEnabled: false
defaultQuestionCount: 10
defaultTimeLimitSeconds: 60
sessionHistoryLimit: 25
```

Default profile:

```text
name: Learner
mastery: {}
mistakes: []
sessions: []
masteredFactsGoal: null
```

If these defaults change, review:

- UI expectations;
- tests;
- schema migration defaults;
- user guide;
- privacy docs where data semantics change.

# Active profile resolution

The provider finds:

```text
profile.id === state.activeProfileId
```

with a defensive fallback to the first profile.

Storage validation requires at least one profile and a valid active-profile reference, so the fallback primarily protects runtime composition rather than legitimizing invalid imported JSON.

The provider throws if no profile exists at all. That condition should be unreachable from validated persistence.

# State actions

`AppStateContext` exposes explicit application actions rather than allowing feature components to mutate persistence directly.

## `setActiveProfile(id)`

Changes the active id only when the requested id exists in current profiles.

No profile data is modified.

## `addProfile(name)`

Behavior:

1. trim whitespace;
2. truncate to 40 characters;
3. reject empty names;
4. reject creation at the 100-profile capacity;
5. create new id/timestamp/default learning state;
6. append profile;
7. make the new profile active.

UI and import validation use the same overall profile-capacity concept.

## `deleteProfile(id)`

Rules:

- last remaining profile cannot be deleted;
- matching profile is removed;
- if it was active, first remaining profile becomes active.

The Settings UI provides user confirmation before invoking the destructive action.

The provider itself enforces the “never zero profiles” invariant even if a caller bypasses the normal button flow.

## `updateSettings(partialSettings)`

Merges provided settings with current settings.

Special handling exists for session-history retention:

1. validate requested retention with `isSessionHistoryLimit()`;
2. ignore unsupported retention values and keep current value;
3. if valid, trim **every profile's** session history to the new limit;
4. store the new settings/profile arrays together.

Therefore lowering retention is destructive immediately in application state, not deferred until display time.

## `recordAttempt(attempt)`

Updates only the active profile through:

```text
applyAttempt(profile, attempt)
```

That domain function updates canonical fact mastery/streak and bounded recent mistakes.

Other profiles remain unchanged.

## `recordSession(summary)`

Uses the selected session-history limit if valid; otherwise defensively falls back to the default limit of 25.

Only active profile is modified.

The new summary is prepended and the array is sliced to retention in one domain operation.

## `setMasteredFactsGoal(goal)`

Accepted values:

- `null`;
- integer from 1 through 10,000.

Invalid values are ignored.

Only the active profile's goal changes.

A goal does not alter mastery counters, session behavior, or notifications.

## `replaceFromBackup(raw)`

Calls the storage import parser/validator:

```text
raw string
  → byte budget
  → JSON.parse
  → migratePersistedState
  → schema-2 Zod validation
  → PersistedState
```

Only after all validation succeeds does the provider replace current state.

A valid replacement also clears the unreadable-state flag, so automatic persistence can resume.

The Settings UI asks the user to confirm destructive replacement before calling this action.

## `discardUnreadableState()`

Only meaningful while unreadable-state recovery is active.

It calls `clearState()` to remove the raw browser value.

If removal succeeds:

- unreadable-state flag becomes false;
- current temporary in-memory state becomes eligible for normal persistence on the next effect cycle.

The Settings UI requires destructive confirmation and encourages downloading the raw value first.

## `resetProgress()`

For the active profile, clears:

```text
mastery
mistakes
sessions
```

It deliberately preserves:

- profile identity/name/creation timestamp;
- optional mastered-facts goal;
- global settings.

Goal clearing is a separate explicit action.

# Storage validator pipeline

File:

```text
src/infrastructure/storage.ts
```

The validator protects both current local storage load and backup import.

## Byte budget

Maximum serialized/import text size:

```text
2,000,000 bytes
```

Byte length uses `TextEncoder`, not JavaScript character count, so multibyte UTF-8 text is handled as actual encoded bytes.

The budget is checked **before** parsing imported/stored JSON.

## Timestamp validation

A timestamp must:

1. parse with `Date.parse`;
2. round-trip exactly through `new Date(parsed).toISOString()`.

This keeps persisted timestamp representation consistent with runtime-generated UTC ISO strings.

## Profile validation

Includes:

- id length;
- nonblank trimmed name, max 40 characters;
- creation timestamp;
- mastery record;
- max 100 mistakes;
- max 100 session summaries;
- optional goal 1–10,000 or null.

## Mastery semantic validation

Checks:

- key format;
- canonical commutative ordering;
- operands represented by key stay within supported fact bounds;
- correct <= attempts;
- streak <= correct and attempts;
- stored object property key equals `MasteryStat.key`.

## Question semantic validation

Checks:

- id length;
- operands 0–1000;
- answer 0–1,000,000;
- answer exactly equals left × right.

## Attempt validation

Checks:

- integer/null response;
- correctness boolean;
- canonical timestamp;
- finite non-negative elapsed time;
- `correct` exactly matches `response === question.answer`.

Saved mistake arrays additionally reject any `correct: true` attempt.

## Session validation

Checks:

- id length;
- kind generated/mistake-review;
- mode timed/untimed;
- timestamp;
- question count 1–200;
- correct count 0–200 and <= question count;
- finite non-negative elapsed time;
- seed null or unsigned supported seed;
- generated session must have seed;
- mistake-review must not have seed.

## Top-level validation

Checks:

- literal schema version 2;
- active-profile id;
- profiles array 1–100;
- valid theme/preferences/default practice settings;
- supported session retention;
- active profile exists;
- profile ids are unique;
- every profile session count <= configured retention.

This last rule means exported/imported state must already respect its own retention setting; the importer does not silently discard excess untrusted history to make invalid input pass.

# Migration pipeline

File:

```text
src/infrastructure/migrations.ts
```

Current schema version:

```text
2
```

## Current schema

If candidate `schemaVersion === 2`, migration returns the candidate unchanged and normal validation continues.

## Schema 1

Migration adds to each object-shaped profile:

```text
sessions: []
masteredFactsGoal: null
```

and to object-shaped settings:

```text
sessionHistoryLimit: 25
```

Then sets:

```text
schemaVersion: 2
```

Malformed shapes are not magically repaired. The transformed candidate still goes through schema-2 validation and can fail.

## Missing/unknown version

- non-object root → explicit error;
- missing/non-numeric schema version → explicit error;
- unsupported numeric version → explicit error.

Do not treat a future schema as an old schema. Unsupported future data should fail safely rather than losing unknown fields through a guessed downgrade.

# Backup export

`exportState(state)` returns:

```text
JSON.stringify(state, null, 2)
```

The exported file is human-inspectable formatted JSON.

It can contain personal learning information and should be treated as a personal file.

The locale preference is not included because it lives outside `PersistedState`.

# Raw unreadable recovery export

`readRawState()` returns the exact current learner-state localStorage string when browser policy permits reading it.

Settings can download this string to a `.txt` file.

The raw file is **not** a validated backup and must not be imported/treated as safe simply because it was downloaded successfully.

It may contain malformed, old, manually edited, or otherwise invalid content.

# User-facing recovery sequence

Recommended sequence when the recovery warning appears:

1. open Settings → Data & privacy;
2. download unreadable local data if it may be needed;
3. choose one of:
   - import a known-good valid backup;
   - explicitly discard unreadable local state;
4. confirm destructive action;
5. verify saving resumes.

Do not advise users to manually edit browser localStorage unless they understand that it can destroy recoverable data.

# React persistence timing

State updates are React state updates; localStorage persistence happens in the provider effect after state changes.

This means UI/state mutation and durable browser write are conceptually separate:

```text
user action
  → React state update
  → render/update
  → persistence effect
  → save success/failure
  → persistence banner state
```

A feature should not assume “state changed” means “storage definitely accepted the write.” Use `persistenceAvailable` for durability messaging.

# Feature boundaries

## Features should

- call context actions;
- show confirmation before destructive user actions;
- display persistence/recovery status;
- localize user-facing errors;
- avoid writing learner state directly to localStorage.

## State provider should

- orchestrate application transitions;
- preserve invariants that span profiles/settings;
- delegate mathematics/mastery/session retention to domain functions;
- delegate parsing/validation/storage to infrastructure.

## Storage infrastructure should

- treat persisted/imported text as untrusted;
- validate before returning typed state;
- classify load result;
- contain browser-storage exceptions;
- not decide UI navigation or learner messaging.

## Domain should

- remain pure where possible;
- not access localStorage/React;
- own reusable numeric/learning invariants.

# Changes that require a migration review

Examples:

- adding/removing a persisted profile field;
- changing a field type;
- changing canonical mastery-key format;
- changing session-summary shape;
- moving per-profile data into global settings or vice versa;
- changing required/nullable semantics;
- changing bounds in a way that makes previously valid stored values invalid.

A migration review is required even if TypeScript compiles, because existing browser JSON exists outside the source tree.

# Future schema-change procedure

1. Define new domain/persisted type.
2. Increment schema version.
3. Add explicit migration from known old version(s).
4. Keep unknown/unreadable state preservation behavior.
5. Update Zod structural/semantic validation.
6. Add migration tests using realistic old JSON.
7. Add malformed/edge-case tests.
8. Update current-state fixtures in integration tests.
9. Update `docs/data-schema-v2.md` by replacing/adding version-specific schema documentation appropriately.
10. Update architecture/privacy/user/backup docs.
11. Confirm backup compatibility policy.
12. Run full quality/E2E checks.
13. Record the migration in `CHANGELOG.md` and `what_changed.md`.

# State/persistence test coverage

Current coverage includes:

- storage round trip;
- export/import;
- schema-1 migration;
- unsupported/malformed version rejection;
- duplicate profile ids;
- active-profile integrity;
- mastery counter/key invariants;
- question answer invariants;
- attempt correctness/mistake semantics;
- session semantics and retention;
- goal bounds;
- oversized data;
- corrupted local storage preservation;
- storage write failure;
- explicit clear;
- UI recovery behavior;
- completed session persistence;
- retention trimming.

When fixing a persistence bug, add the regression at the lowest layer that can reproduce the issue, then add a UI/E2E case if the user-facing recovery path can regress independently.
