# Architecture

## Goals

TableSpark uses a modular client architecture that keeps learning rules testable without a browser UI, keeps persistence replaceable, and avoids introducing remote infrastructure that the product does not need.

## High-level structure

```text
src/
├── components/       Cross-cutting UI states and boundaries
├── domain/           Pure business rules and domain types
├── features/         User-facing feature modules
├── i18n/             Typed message catalogs and locale provider
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
- `sessions.ts` defines supported local session-history retention and bounded optional mastery-goal values.
- `worksheet.ts` maps table rows into printable worksheet items with configurable answer blanks.
- `types.ts` defines immutable product data shapes, including schema-2 session summaries and optional profile goals.

The deterministic generator is intentionally explicit so tests and bug reports can reproduce a generated session by seed. Random seed selection is infrastructure convenience; deterministic generation remains domain logic.

### Feature modules

`src/features/` groups UI by user intent rather than generic component type:

- `tables/` — custom table generation, solved study-sheet/practice/answer-key composition, paper sizing, print columns, and print entry points.
- `practice/` — random/replayable seeded practice, five difficulty presets, timed/untimed drills, mistake review, and compact session-summary recording.
- `progress/` — accuracy, mastery classification, search/filtering, recent sessions, optional goal progress, streaks, and mistake summaries.
- `settings/` — language, appearance, accessibility, learning-record retention, optional profile goals, offline profiles, persistence capacity, backup/restore, and unreadable-state recovery.
- `about/` — project identity, privacy summary, support, license, and funding links.

### State

`AppStateProvider` wires state transitions explicitly. It is responsible for:

- selecting the active offline profile;
- creating/deleting profiles within the supported capacity;
- applying settings updates;
- trimming session history when retention is reduced;
- recording practice attempts via domain logic;
- recording bounded practice-session summaries;
- setting/clearing optional per-profile mastered-facts goals;
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
- `migrations.ts` centralizes persisted schema-version handling and currently migrates valid schema-1 state into schema 2.
- `speech.ts` wraps optional browser speech synthesis and converts platform failures into a safe fallback.
- `logger.ts` emits structured events while redacting sensitive field names and recognizable sensitive values.
- `browserPreferences.ts` safely reads/writes small non-critical browser flags such as onboarding dismissal.
- `random.ts` creates bounded practice seeds while allowing deterministic injection in tests.
- `pwaEvents.ts` decouples service-worker lifecycle callbacks from non-blocking UI notices.
- `installPrompt.ts` models the optional browser-provided PWA installation event without adding a browser-vendor dependency.

Locale preference storage is kept under `src/i18n/localePreference.ts` because it is part of interface-language selection rather than learner-state persistence. It uses the same resilient local-storage philosophy as other non-critical browser preferences.

No domain module imports browser adapters.

### Repository quality utilities

`scripts/secret-scanner.mjs` is deliberately outside application runtime code. It scans repository text files for a bounded set of common credential signatures and reports only finding metadata. The scanner is tested with Node's built-in test runner and participates in CI.

## Persistence model

The current persisted schema version is `2`. The existing storage key remains stable so valid schema-1 installations can migrate locally rather than appearing empty.

State includes:

- active profile identifier;
- one or more offline profiles;
- per-profile mastery and recent mistakes;
- bounded per-profile session summaries;
- an optional per-profile mastered-facts goal;
- application settings including session-history retention.

The interface locale preference is stored separately and is not part of learner-state backup JSON.

Persistence and backup import share a 2 MB byte budget. The storage adapter validates imported JSON before use and verifies structural plus semantic invariants, including:

- active-profile existence;
- unique profile IDs;
- valid settings ranges;
- supported session-history retention values;
- retained session history not exceeding the selected limit;
- bounded question operands and correct multiplication answers;
- attempt correctness matching the recorded response;
- mistake history containing only incorrect attempts;
- mastery correct/streak counters not exceeding valid totals;
- canonical commutative mastery keys;
- mastery object keys matching stored fact keys;
- session question/correct-count bounds;
- generated-session replay seeds and mistake-review null-seed semantics;
- optional mastery-goal bounds.

### Schema 1 → 2 migration

A valid schema-1 profile is migrated locally by adding:

- `sessions: []`;
- `masteredFactsGoal: null`.

Schema-1 settings receive the default session-history retention of 25. The migrated candidate then passes through the normal schema-2 validator. Migration does not bypass semantic validation and does not upload data.

Unsupported versions fail explicitly rather than being interpreted as current data.

### Initial load states

The storage adapter classifies startup into three explicit states:

- `empty` — no persisted TableSpark value exists;
- `loaded` — a persisted value exists and validates successfully, including supported migration when required;
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

## Session history model

Session history stores compact completed-session summaries rather than every answer. A summary records:

- session identifier;
- generated-drill or mistake-review kind;
- timed/untimed mode;
- completion timestamp;
- question count;
- correct count;
- elapsed time;
- replay seed for generated drills, or `null` for mistake review.

Retention is selected from the supported 10/25/50/100 values. Lowering the limit trims older histories immediately. The hard schema maximum remains 100 summaries per profile.

This separation avoids duplicating answer-level data while still giving learners a useful recent-practice record.

## Offline and PWA model

The PWA service worker is generated during the production build. Static application assets are precached. Core learning workflows do not depend on network requests, so once the application is available locally they can continue offline.

`main.tsx` translates service-worker lifecycle callbacks into application events. UI banners then show:

- a dismissible offline-ready notice;
- a non-blocking update-ready notice with explicit **Update now** / **Later** choice.

A pending update is never forced in the middle of an active practice task.

When a supporting browser emits `beforeinstallprompt`, TableSpark stores only the in-memory event long enough to present an optional install action. If the browser never supplies that event, the application does not fabricate install capability.

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
- Release automation publishes SHA-256 integrity metadata for the packaged web ZIP.

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
- keyboard shortcut reference with non-editable-field shortcut guards;
- printable output that does not automatically expose the active profile name;
- explicit recovery alerts and labelled recovery actions for local-data problems;
- document language updates when the locale changes.

Stable browser-level accessibility invariants complement manual assistive-technology review. See `docs/accessibility.md`.

## Internationalization

TableSpark now has a central `LocaleProvider` and typed runtime message catalogs.

English source messages are composed from the existing English copy modules in `src/i18n/messages.ts`. `MessageCatalog` widens literal English values into a structural string/function contract. Translated catalogs must satisfy that shape at compile time so missing message keys are type failures rather than silent runtime gaps.

The included Hindi catalog lives in `src/i18n/hi.ts`. Language selection is persisted separately from learner-state backup data, and the root document `lang` attribute follows the active locale.

Domain validation messages remain close to domain rules because they are error contracts used by tests and non-UI callers. User-facing feature text should be added to locale catalogs rather than directly into feature components unless the text is deliberately language-neutral (for example technical identifiers).

See `docs/localization.md`.

## Worksheet and print architecture

The worksheet composer separates source table configuration from presentation choices. The generated mathematical rows stay the same while presentation selects:

- solved study sheet;
- practice worksheet;
- answer key;
- writing-line / box / open-space answer blank for practice;
- A4 or US Letter portrait page intent;
- one, two, or three print columns.

Print CSS uses named `@page` rules where the browser supports them and avoids cutting individual equation cards. Browser print engines retain final control over margins/headers/footers.

## Architecture decisions and evaluations

Architecture decisions are recorded in `docs/adr/`:

- ADR 0001 — TypeScript React PWA as the primary client.
- ADR 0002 — local-first persistence.
- ADR 0003 — deterministic seeded practice.
- ADR 0004 — preserve unreadable local state until explicit recovery.

Additional evaluations:

- `docs/native-packaging-evaluation.md` — keep the PWA canonical; re-evaluate a TWA first only if Android distribution becomes an explicit need.
- `docs/deployment-evaluation.md` — static-host candidates and the owner-approval/deployment verification gate.

## Dependency direction

Preferred direction:

```text
UI/features → state/application wiring → domain
UI/features → infrastructure adapters (only where needed)
UI/features → i18n locale provider/messages
infrastructure → domain types/domain constants
i18n → infrastructure logging only for resilient locale-preference storage
domain → no UI or browser infrastructure
scripts → no application runtime dependency
```

Keeping domain code at the bottom of the dependency graph makes it easier to test, reuse, and reason about correctness.
