# Architecture

## Goals

TableSpark uses a modular client architecture that keeps learning rules testable without a browser UI, keeps persistence replaceable, and avoids introducing remote infrastructure that the product does not need.

## High-level structure

```text
src/
├── components/       Cross-cutting UI states and boundaries
├── domain/           Pure business rules and domain types
├── features/         User-facing feature modules
├── i18n/             Externalized interface copy
├── infrastructure/   Browser adapters and persistence boundaries
├── state/            Application state composition
├── App.tsx           Product shell and navigation
└── main.tsx          Browser bootstrap
scripts/               Repository-only quality/security utilities
```

### Domain

`src/domain/` owns rules that can run independently of React:

- `answers.ts` defines the bounded practice-response contract used by the UI.
- `tables.ts` validates table ranges and enforces the render-output budget.
- `questions.ts` validates seeds and produces deterministic seeded practice questions.
- `mastery.ts` updates mastery statistics and bounded mistake history.
- `difficulty.ts` defines transparent practice progression presets.
- `review.ts` builds deduplicated mistake-review sessions.
- `progress.ts` classifies, searches, filters, and orders mastery facts.
- `worksheet.ts` maps table rows into solved/blank printable worksheet items.
- `types.ts` defines immutable product data shapes.

The deterministic generator is intentionally explicit so tests and bug reports can reproduce a generated session by seed. Random seed selection is infrastructure convenience; deterministic generation remains domain logic.

### Feature modules

`src/features/` groups UI by user intent rather than generic component type:

- `tables/` — custom table generation, solved/blank worksheet views, and print entry point.
- `practice/` — random/replayable seeded practice, timed/untimed drills, and mistake review.
- `progress/` — accuracy, mastery classification, search/filtering, streaks, and mistake summaries.
- `settings/` — appearance, accessibility, offline profiles, persistence capacity, backup/restore, and unreadable-state recovery.
- `about/` — project identity, privacy summary, support, license, and funding links.

### State

`AppStateProvider` wires state transitions explicitly. It is responsible for:

- selecting the active offline profile;
- creating/deleting profiles within the supported capacity;
- applying settings updates;
- recording practice attempts via domain logic;
- replacing state from a validated backup;
- resetting the active profile's learning progress;
- exposing whether the latest browser-storage write succeeded;
- distinguishing an empty store from an existing but unreadable stored value;
- pausing automatic persistence while unreadable stored data is awaiting explicit recovery.

The provider persists state after changes through the storage adapter. If a normal persistence write fails, current in-memory state remains usable and the UI exposes the durability problem instead of silently implying data was saved.

If an existing stored value fails validation during startup, the provider uses a temporary in-memory default state but deliberately does **not** save it over the unreadable value. The user can replace the value with a valid backup or explicitly discard it. See ADR 0004.

### Infrastructure

`src/infrastructure/` contains browser-specific boundaries:

- `storage.ts` validates, bounds, serializes, restores, and classifies local state while preserving unreadable raw values for recovery.
- `migrations.ts` centralizes persisted schema-version handling.
- `speech.ts` wraps optional browser speech synthesis and converts platform failures into a safe fallback.
- `logger.ts` emits structured events while redacting sensitive field names and recognizable sensitive values.
- `browserPreferences.ts` safely reads/writes small non-critical browser flags such as onboarding dismissal.
- `random.ts` creates bounded practice seeds while allowing deterministic injection in tests.

No domain module imports these adapters.

### Repository quality utilities

`scripts/secret-scanner.mjs` is deliberately outside application runtime code. It scans repository text files for a bounded set of common credential signatures and reports only finding metadata. The scanner is tested with Node's built-in test runner and participates in CI.

## Persistence model

The current schema version is `1`.

State includes:

- active profile identifier;
- one or more offline profiles;
- per-profile mastery and recent mistakes;
- application settings.

Persistence and backup import share a 2 MB byte budget. The storage adapter validates imported JSON before use and verifies structural plus semantic invariants, including:

- active-profile existence;
- unique profile IDs;
- valid settings ranges;
- bounded question operands and correct multiplication answers;
- attempt correctness matching the recorded response;
- mistake history containing only incorrect attempts;
- mastery correct/streak counters not exceeding valid totals;
- canonical commutative mastery keys;
- mastery object keys matching stored fact keys.

Unsupported versions fail explicitly rather than being interpreted as current data.

### Initial load states

The storage adapter classifies startup into three explicit states:

- `empty` — no persisted TableSpark value exists;
- `loaded` — a persisted value exists and validates successfully;
- `invalid` — a value exists but cannot be safely parsed, migrated, or validated.

The distinction matters because `invalid` data must not be treated as disposable empty storage. While an invalid value is preserved, normal automatic persistence is suspended. Settings can download the raw stored text, replace it by importing a valid backup, or discard it after confirmation.

### Migration rule

Any future persisted schema change must:

1. increment the schema version;
2. add a migration path in `migrations.ts`;
3. preserve user data where safe;
4. add migration tests;
5. document backup compatibility.

Known old schema shapes should be migrated explicitly. Unknown malformed data should remain preserved for recovery rather than being heuristically repaired.

## Offline model

The PWA service worker is generated during the production build. Static application assets are precached. Core learning workflows do not depend on network requests, so once the application is available locally they can continue offline.

External links such as GitHub, email, and Buy Me a Coffee naturally require network access.

## Security and reliability boundaries

- Imported data is untrusted and validated before replacement.
- Existing unreadable local data is preserved until explicit recovery action.
- Application UI does not render raw HTML from imported/user data.
- There is no authentication secret, payment credential, or remote API token in the current product.
- Logs contain technical events rather than learner content and redact sensitive keys/values.
- Browser storage failure is surfaced to users instead of silently losing durability.
- Repository secret scanning supplements normal secret-handling discipline.
- GitHub Actions permissions are scoped per workflow.
- Dependency auditing and CodeQL run in automation.

## Accessibility architecture

Accessibility is implemented as a product constraint rather than a post-processing layer:

- semantic HTML controls;
- labels, descriptions, status messages, and live regions;
- visible keyboard focus;
- skip navigation;
- touch target sizing;
- responsive structure;
- reduced-motion handling;
- large-text mode;
- progressive speech synthesis with unsupported-platform fallback;
- printable output that does not automatically expose the active profile name;
- explicit recovery alerts and labelled recovery actions for local-data problems.

See `docs/accessibility.md`.

## Internationalization

User-facing interface copy is externalized in `src/i18n/en.ts`, including dynamic message factories for values such as scores, seeds, profile counts, progress statistics, and recovery states. Domain validation messages remain close to domain rules because they are also error contracts used by tests and non-UI callers.

A locale provider is intentionally deferred until a second locale is introduced. This avoids premature runtime framework complexity while keeping product copy separated from feature structure.

## Architecture decisions

Architecture decisions are recorded in `docs/adr/`:

- ADR 0001 — TypeScript React PWA as the primary client.
- ADR 0002 — local-first persistence.
- ADR 0003 — deterministic seeded practice.
- ADR 0004 — preserve unreadable local state until explicit recovery.

## Dependency direction

Preferred direction:

```text
UI/features → state/application wiring → domain
UI/features → infrastructure adapters (only where needed)
infrastructure → domain types/domain constants
domain → no UI or browser infrastructure
scripts → no application runtime dependency
```

Keeping domain code at the bottom of the dependency graph makes it easier to test, reuse, and reason about correctness.
