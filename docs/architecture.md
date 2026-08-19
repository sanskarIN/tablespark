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
- `settings/` — appearance, accessibility, offline profiles, persistence capacity, and backup/restore.
- `about/` — project identity, privacy summary, support, license, and funding links.

### State

`AppStateProvider` wires state transitions explicitly. It is responsible for:

- selecting the active offline profile;
- creating/deleting profiles within the supported capacity;
- applying settings updates;
- recording practice attempts via domain logic;
- replacing state from a validated backup;
- resetting the active profile's learning progress;
- exposing whether the latest browser-storage write succeeded.

The provider persists state after changes through the storage adapter. If persistence fails, current in-memory state remains usable and the UI exposes the durability problem instead of silently implying data was saved.

### Infrastructure

`src/infrastructure/` contains browser-specific boundaries:

- `storage.ts` validates, bounds, serializes, and restores local state.
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
- mastery correct/streak counters not exceeding valid totals;
- mastery object keys matching stored fact keys.

Unsupported versions fail explicitly rather than being interpreted as current data.

### Migration rule

Any future persisted schema change must:

1. increment the schema version;
2. add a migration path in `migrations.ts`;
3. preserve user data where safe;
4. add migration tests;
5. document backup compatibility.

## Offline model

The PWA service worker is generated during the production build. Static application assets are precached. Core learning workflows do not depend on network requests, so once the application is available locally they can continue offline.

External links such as GitHub, email, and Buy Me a Coffee naturally require network access.

## Security boundaries

- Imported data is untrusted and validated before replacement.
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
- printable output that does not automatically expose the active profile name.

See `docs/accessibility.md`.

## Internationalization

User-facing interface copy is externalized in `src/i18n/en.ts`, including dynamic message factories for values such as scores, seeds, profile counts, and progress statistics. Domain validation messages remain close to domain rules because they are also error contracts used by tests and non-UI callers.

A locale provider is intentionally deferred until a second locale is introduced. This avoids premature runtime framework complexity while keeping product copy separated from feature structure.

## Architecture decisions

Architecture decisions are recorded in `docs/adr/`:

- ADR 0001 — TypeScript React PWA as the primary client.
- ADR 0002 — local-first persistence.
- ADR 0003 — deterministic seeded practice.

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
