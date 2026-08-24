# TableSpark State and Persistence Lifecycle

This document is the maintainer reference for how TableSpark moves learner state between React, domain rules, browser storage, backup import/export, migrations, and recovery.

The core safety principles are:

> **Missing data, invalid existing data, and unavailable browser storage are three different conditions.**

> **A validated backup must be durably written before it is allowed to replace the current in-memory state.**

TableSpark can create defaults for a genuinely empty installation. It must not overwrite a value that could not be validated, and it must not write temporary defaults when the browser prevented the application from reading storage at startup.

See also:

- [Data schema v2](data-schema-v2.md)
- [Architecture](architecture.md)
- [Security model](security-model.md)
- [ADR 0002 — local-first persistence](adr/0002-local-first-persistence.md)
- [ADR 0004 — preserve unreadable local state](adr/0004-preserve-unreadable-local-state.md)
- [Privacy policy](../PRIVACY.md)

## Main implementation files

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

## Storage locations

### Learner state

Browser key:

```text
tablespark.state.v1
```

Current internal schema:

```text
schemaVersion: 2
```

The key suffix and schema number intentionally differ. The stable key lets TableSpark find schema-1 state and migrate it instead of making older data appear missing.

Do not rename the browser key merely because a schema version changes. A storage-key change needs its own explicit migration strategy.

### Locale preference

```text
tablespark.locale.v1
```

The locale preference is intentionally outside learner backup JSON. It controls interface presentation, not mastery state.

### Onboarding preference

A separate Boolean browser preference records whether the first-run welcome notice was dismissed. It is also outside learner backup JSON.

## Startup lifecycle

`AppStateProvider` calls `loadStateResult()` once while creating its initial state.

`loadStateResult()` has four outcomes:

```ts
{ status: 'empty', state: null }
{ status: 'loaded', state: PersistedState }
{ status: 'invalid', state: null }
{ status: 'unavailable', state: null }
```

### `empty`

Meaning:

```text
localStorage.getItem('tablespark.state.v1') === null
```

The read itself succeeded and no learner-state value exists.

Provider behavior:

1. create one local `Learner` profile;
2. create default settings;
3. use schema version 2;
4. permit automatic persistence.

The new profile uses `crypto.randomUUID()` and a UTC ISO creation timestamp.

### `loaded`

Meaning:

- browser storage read succeeded;
- a value exists;
- the byte budget passes;
- JSON parsing passes;
- a supported migration passes when required;
- schema-2 structural validation passes;
- schema-2 semantic validation passes.

Provider behavior:

- use the validated state;
- resolve the active profile;
- permit automatic persistence.

The validator requires the active profile to exist, so the provider's first-profile fallback is defensive rather than permission for invalid imports.

### `invalid`

Meaning: the browser successfully returned an existing raw value, but that value could not safely become `PersistedState` because parsing, migration, size validation, schema validation, or semantic validation failed.

Provider behavior:

1. create a temporary in-memory default so the interface remains usable;
2. set `unreadableStoredState = true`;
3. set persistence unavailable;
4. pause automatic learner-state writes;
5. preserve the original raw browser value;
6. show recovery guidance;
7. wait for explicit replacement or discard.

`invalid` is never treated as `empty`.

### `unavailable`

Meaning: `localStorage.getItem()` itself threw, for example because browser policy, privacy mode, origin policy, or an implementation failure blocked access.

This is deliberately **not** classified as invalid learner data because TableSpark never obtained a value to validate.

Provider behavior:

1. create a temporary in-memory default so core learning UI can still render;
2. set `storageReadUnavailable = true`;
3. leave `unreadableStoredState = false`;
4. set persistence unavailable;
5. do not attempt automatic writes, because an unreadable existing value could otherwise be overwritten without ever having been observed;
6. show the ordinary local-saving warning rather than the corrupted-data recovery workflow.

Backup export and import controls are disabled for this startup condition because the visible temporary state is not a trustworthy representation of whatever may exist in inaccessible browser storage, and TableSpark refuses to overwrite an unknown value.

## Automatic persistence

The provider persistence effect observes:

- current state;
- unreadable-existing-data state;
- startup storage-read availability.

Conceptually:

```text
state changes
  ↓
unreadableStoredState OR storageReadUnavailable?
  ├─ yes → do not write; persistenceAvailable = false
  └─ no  → saveState(state)
             ↓
           true / false
             ↓
           persistenceAvailable
```

`saveState()`:

1. serializes with `JSON.stringify`;
2. enforces the 2,000,000-byte budget;
3. calls `localStorage.setItem`;
4. returns `true` on success;
5. logs a redacted technical event and returns `false` on failure.

Storage exceptions do not escape into the React tree.

## Storage conditions are intentionally distinct

### Existing value is invalid

The application knows a raw value exists because the read succeeded. It preserves that exact value and exposes explicit recovery actions.

User-facing state:

```text
Stored learning data needs recovery.
```

### Startup read is unavailable

The application does not know whether a learner-state value exists because the browser blocked the read itself. It therefore refuses to write temporary defaults or perform backup replacement.

User-facing state:

```text
Local saving is unavailable.
```

Recovery controls for a known invalid value are not shown because no raw value was successfully obtained.

### Later write fails

The application may have loaded valid state successfully, but a later `setItem()` can still fail because of quota or changing browser policy.

The in-memory state remains usable and export can remain valuable because the loaded/current state is known. `persistenceAvailable` becomes false and the user is warned that current changes may not survive reload.

Do not collapse these cases into one generic flag. Their safe write/export/recovery behavior differs.

## Default state

Default settings:

```text
theme: system
largeText: false
reducedMotion: false
speechEnabled: false
defaultQuestionCount: 10
defaultTimeLimitSeconds: 60
sessionHistoryLimit: 25
```

Default profile learning fields:

```text
mastery: {}
mistakes: []
sessions: []
masteredFactsGoal: null
```

Changes to defaults require review of:

- migration defaults;
- integration fixtures;
- settings UI;
- user/privacy documentation;
- backup compatibility.

## State actions

Features use `AppStateContext` actions instead of mutating storage directly.

### `setActiveProfile(id)`

Changes the active profile only when the requested id exists in the current rendered profile collection.

### `addProfile(name)`

Rules:

1. trim surrounding whitespace;
2. truncate to 40 characters;
3. reject an empty result;
4. enforce the 100-profile capacity **inside the functional React state updater**;
5. create the profile only after the latest `current` state passes the capacity check;
6. append it and make it active.

The capacity check intentionally lives inside `setState(current => ...)`. This prevents two batched additions from both observing a stale 99-profile render and creating 101 profiles.

### `deleteProfile(id)`

Rules:

- never delete the last remaining profile;
- remove the matching profile;
- if the removed profile was active, activate the first remaining profile.

The Settings UI asks for confirmation before invoking this destructive action.

### `updateSettings(partialSettings)`

Merges supported settings into current state.

Session-history retention receives additional handling:

1. validate the requested limit with `isSessionHistoryLimit()`;
2. ignore unsupported values;
3. trim every profile's retained session summaries immediately when a lower valid limit is selected;
4. commit settings and trimmed profile state together.

Supported session-history limits are 10, 25, 50, and 100.

### `recordAttempt(attempt)`

Updates only the active profile through the pure mastery-domain operation. This updates canonical fact mastery and bounded recent-mistake state.

### `recordSession(summary)`

Prepends a compact session summary for the active profile and immediately enforces the selected retention limit. If state somehow contains an unsupported runtime limit, the provider defensively uses the default limit of 25.

### `setMasteredFactsGoal(goal)`

Accepted values:

- `null`;
- integer 1 through 10,000.

Invalid values are ignored. The goal is local to the active profile and does not alter mastery math, daily streaks, notifications, or session generation.

### `replaceFromBackup(raw)`

Backup replacement is transactional.

Pipeline:

```text
raw text
  → byte-budget check
  → JSON.parse
  → supported migration
  → schema-2 structural validation
  → semantic validation
  → storage-read safety check
  → save validated replacement
  → only then replace React state
```

The action returns a Boolean durability result.

Rules:

- validation failure throws to the caller and current state remains unchanged;
- if startup storage reads were unavailable, replacement returns `false` without writing because TableSpark will not overwrite unknown inaccessible state;
- if the validated replacement cannot be saved, replacement returns `false`, marks persistence unavailable, and leaves current React state unchanged;
- only after `saveState(replacement)` succeeds does the provider set the replacement state, clear unreadable-state recovery, and report success.

This prevents the UI from saying a backup was imported successfully when it existed only in memory and could disappear on reload.

The Settings UI uses a localized generic failure message for validation/storage failure rather than leaking raw English schema-library or domain exception text into another locale.

### `discardUnreadableState()`

Only relevant to a known `invalid` startup value.

It calls `clearState()` and clears the recovery flag only after browser removal succeeds. The temporary in-memory default can then become eligible for normal persistence.

The UI requires explicit destructive confirmation and offers raw download first.

### `resetProgress()`

Clears, for the active profile only:

```text
mastery
mistakes
sessions
```

It deliberately preserves:

- profile id/name/creation time;
- optional mastered-facts goal;
- global settings.

Goal removal is a separate explicit action.

## Storage validator pipeline

File:

```text
src/infrastructure/storage.ts
```

The same parser/validator protects browser-state loading and backup import.

### Byte budget

Maximum learner-state/import text size:

```text
2,000,000 bytes
```

Byte length uses `TextEncoder` so UTF-8 multibyte content is counted as encoded bytes rather than JavaScript characters.

The budget is checked before JSON parsing.

### Timestamp validation

Persisted timestamps must parse and round-trip exactly through `new Date(parsed).toISOString()`. This keeps runtime and persisted UTC representation aligned.

### Profile validation

Includes:

- id length;
- nonblank name, maximum 40 characters;
- canonical creation timestamp;
- mastery record;
- maximum 100 recent mistakes;
- maximum 100 session summaries;
- optional goal 1–10,000 or null.

### Mastery validation

Checks:

- canonical multiplication-fact key syntax;
- commutative normalization;
- supported operand range;
- object key equals `MasteryStat.key`;
- `correct <= attempts`;
- `streak <= correct` and `streak <= attempts`.

### Question and attempt validation

Questions validate:

- bounded integer operands;
- bounded integer product;
- `answer === left * right`.

Attempts validate:

- integer/null response;
- canonical timestamp;
- finite non-negative elapsed time;
- stored `correct` exactly matches the recorded response and answer.

Saved mistake arrays additionally reject correct attempts.

### Session-summary validation

Checks:

- id;
- generated/mistake-review kind;
- timed/untimed mode;
- timestamp;
- question count 1–200;
- correct count 0–200 and not greater than question count;
- finite non-negative elapsed time;
- unsigned supported seed or null;
- generated sessions require a seed;
- mistake-review sessions require `seed: null`.

### Top-level validation

Checks:

- literal schema version 2;
- 1–100 profiles;
- unique profile ids;
- valid active-profile reference;
- supported global settings;
- supported session-retention value;
- every profile's retained session count does not exceed the configured retention limit.

Import does not silently trim malformed/untrusted state just to make it pass validation.

## Migration pipeline

File:

```text
src/infrastructure/migrations.ts
```

### Schema 2

Returned unchanged and then fully validated.

### Schema 1 → schema 2

For object-shaped legacy profiles, migration adds:

```text
sessions: []
masteredFactsGoal: null
```

For object-shaped legacy settings, migration adds:

```text
sessionHistoryLimit: 25
```

Then the candidate receives:

```text
schemaVersion: 2
```

The migrated candidate must still pass the complete schema-2 validator. Migration is not a general-purpose repair function.

### Unknown versions

Missing, nonnumeric, malformed, or unsupported future schema versions fail safely. TableSpark does not guess how to downgrade unknown future data.

## Backup export

`exportState(state)` returns formatted JSON:

```text
JSON.stringify(state, null, 2)
```

It can contain profile names and learning history and should be treated as personal data.

Locale and onboarding preferences are not included.

Ordinary backup export is disabled when:

- a known existing raw learner-state value is in recovery; or
- startup browser storage could not be read.

In both situations the visible temporary default is not a trustworthy replacement for existing learner data.

A normal later write failure is different: the application has already loaded/constructed known valid current state, so export can still be useful even though automatic saving is currently failing.

## Raw recovery export

`readRawState()` reads the exact learner-state browser string when browser policy permits it.

For a known invalid value, Settings can download that exact text as a private recovery artifact. It is not validated backup JSON and may contain malformed, legacy, manually edited, or private information.

Never treat a raw recovery file as safe merely because it was downloadable.

## User-facing recovery sequence

For a known invalid existing value:

1. open Settings → Data & privacy;
2. download the raw recovery value if it may be needed;
3. choose either a known-good backup replacement or explicit discard;
4. confirm the destructive action;
5. verify local saving status after recovery.

For startup storage-read unavailability:

1. do not attempt to overwrite or export the temporary default as a trusted backup;
2. restore browser/site storage access;
3. reload TableSpark so it can classify the real stored value;
4. then use normal backup/recovery actions as appropriate.

## React timing and durability

Ordinary feature state changes and durable persistence are separate events:

```text
user action
  → React state transition
  → render
  → persistence effect
  → browser write success/failure
  → persistence status
```

Features must not equate “React state changed” with “browser storage accepted the write.”

Backup replacement is intentionally stricter than ordinary feature state changes: it performs the validated replacement write first so a destructive import can be reported transactionally.

## Responsibility boundaries

### Feature components

Should:

- call context actions;
- use localized user-facing errors;
- request confirmation before destructive user actions;
- respect persistence/recovery status;
- avoid direct learner-state `localStorage` writes.

### State provider

Should:

- orchestrate cross-feature transitions;
- preserve profile/settings invariants;
- guard destructive replacement semantics;
- delegate mathematics and retention rules to domain functions;
- delegate parsing/storage to infrastructure.

### Storage infrastructure

Should:

- treat persisted/imported text as untrusted;
- distinguish read unavailability from invalid returned data;
- validate before returning typed state;
- contain browser exceptions;
- never decide UI navigation or wording.

### Domain layer

Should:

- remain pure where practical;
- own reusable learning/numeric invariants;
- never depend on React or browser storage.

## Schema-change review triggers

A migration/security review is required when changing any of these:

- persisted profile fields;
- field types or nullable semantics;
- canonical mastery-key format;
- session-summary shape;
- per-profile/global ownership of data;
- validation bounds that can make existing data invalid;
- browser storage key;
- backup compatibility behavior.

TypeScript compilation alone is not enough because persisted JSON exists outside the source tree.

## Future schema-change procedure

1. Define the new typed model.
2. Increment the internal schema version.
3. Add explicit migration from supported prior versions.
4. Preserve invalid/unavailable startup safety behavior.
5. Update structural and semantic validation.
6. Add realistic migration tests.
7. Add malformed and boundary tests.
8. Update integration fixtures.
9. Add/update version-specific schema documentation.
10. Review privacy/security implications.
11. Confirm backup compatibility.
12. Run the complete quality and browser suites.
13. Record the migration in `CHANGELOG.md` and `what_changed.md`.

## Current persistence test coverage

Automated tests cover, among other cases:

- local-state round trip;
- portable export/import parsing;
- schema-1 migration;
- byte-budget rejection;
- duplicate profile ids;
- canonical mastery and counter invariants;
- mathematically consistent questions/attempts;
- mistake-history integrity;
- session-summary and retention invariants;
- goal bounds;
- known invalid stored-data preservation;
- blocked storage-read classification as `unavailable`;
- suppression of writes after a blocked startup read;
- normal write failure containment;
- atomic enforcement of the 100-profile capacity during batched updates;
- successful transactional backup replacement;
- failed replacement leaving current state unchanged;
- explicit stored-state clear/recovery flows.

Run the maintained local quality gate with:

```bash
npm run check
```

Browser recovery/localization behavior is additionally exercised by Playwright through:

```bash
npm run test:e2e
```

## Maintainer checklist for persistence changes

Before merging a persistence-related change:

- [ ] Confirm empty, loaded, invalid, and unavailable startup semantics remain distinct.
- [ ] Confirm temporary defaults cannot overwrite unknown/unreadable existing storage.
- [ ] Confirm backup replacement cannot report success before a durable write succeeds.
- [ ] Confirm import/export size limits remain synchronized with documentation.
- [ ] Confirm profile and session limits remain synchronized across UI, provider, validator, tests, and docs.
- [ ] Confirm migrations are explicit and tested.
- [ ] Confirm localized user-facing failures do not expose raw schema/domain exception strings.
- [ ] Run `npm run check`.
- [ ] Run `npm run test:e2e`.
- [ ] Review privacy/security documentation if data semantics changed.
