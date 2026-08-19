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
├── App.tsx            Product shell and navigation
└── main.tsx           Browser bootstrap
```

### Domain

`src/domain/` owns rules that can run independently of React:

- `tables.ts` validates ranges and produces table rows.
- `questions.ts` produces deterministic seeded practice questions.
- `mastery.ts` updates mastery statistics and mistake history.
- `types.ts` defines immutable product data shapes.

The deterministic generator is intentionally explicit so tests and bug reports can reproduce a session by seed.

### Feature modules

`src/features/` groups UI by user intent rather than generic component type:

- `tables/` — custom table generation and print entry point.
- `practice/` — timed/untimed practice and mistake review.
- `progress/` — accuracy, fact mastery, streak, and mistake summaries.
- `settings/` — appearance, accessibility, offline profiles, and backup/restore.
- `about/` — project identity, privacy summary, support, license, and funding links.

### State

`AppStateProvider` wires state transitions explicitly. It is responsible for:

- selecting the active offline profile;
- creating/deleting profiles;
- applying settings updates;
- recording practice attempts via domain logic;
- replacing state from a validated backup;
- resetting the active profile's learning progress.

The provider persists state after changes through the storage adapter.

### Infrastructure

`src/infrastructure/` contains browser-specific boundaries:

- `storage.ts` validates and serializes local state.
- `migrations.ts` centralizes persisted schema-version handling.
- `speech.ts` wraps optional browser speech synthesis.
- `logger.ts` emits structured events while redacting sensitive field names.

No domain module imports these adapters.

## Persistence model

The current schema version is `1`.

State includes:

- active profile identifier;
- one or more offline profiles;
- per-profile mastery and recent mistakes;
- application settings.

The storage adapter validates imported JSON before use and verifies that `activeProfileId` points to a stored profile. Unsupported versions fail explicitly rather than being interpreted as current data.

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

- Imported data is untrusted and validated.
- Application UI does not render raw HTML from imported/user data.
- There is no authentication secret, payment credential, or remote API token in the current product.
- Logs should contain technical events, not personal learner content.
- GitHub Actions permissions are scoped per workflow.
- Dependency auditing and CodeQL run in automation.

## Accessibility architecture

Accessibility is implemented as a product constraint rather than a post-processing layer:

- semantic HTML controls;
- labels and live regions;
- visible keyboard focus;
- skip navigation;
- touch target sizing;
- responsive structure;
- reduced-motion handling;
- large-text mode;
- progressive speech synthesis.

See `docs/accessibility.md`.

## Internationalization

Initial user-facing navigation copy is externalized in `src/i18n/en.ts`. A full locale provider is deferred until a second locale is introduced, avoiding premature framework complexity while preserving a migration path.

## Architecture decisions

Architecture decisions are recorded in `docs/adr/`.

- ADR 0001: TypeScript React PWA as the primary client.

## Dependency direction

Preferred direction:

```text
UI/features → state/application wiring → domain
UI/features → infrastructure adapters (only where needed)
infrastructure → domain types
domain → no UI or browser infrastructure
```

Keeping domain code at the bottom of the dependency graph makes it easier to test, reuse, and reason about correctness.
