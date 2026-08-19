# TableSpark — Current Work Handoff

Last updated: 2026-08-19

This file is the detailed continuation record for the current TableSpark implementation and documentation work. It is intentionally explicit about what is implemented, what is automatically tested, what remains manually/external to verify, and which repository checkpoint should be treated as current.

## Current repository checkpoint

- Application version: `0.1.0`
- Repository: `https://github.com/sanskarIN/tablespark`
- Default branch: `main`
- Current development/verification branch: `feat/roadmap-refinement-2026-08-19`
- Current pull request: PR `#4` — `feat: continue TableSpark roadmap refinement`
- PR state at the time of this handoff update: open, draft, not merged.
- Primary architecture: strict TypeScript + React + Vite Progressive Web App.
- Core persistence model: local-first browser storage.
- Current persisted learner-data schema: **version 2**.
- Existing learner storage key remains `tablespark.state.v1` so valid schema-1 data can be discovered and migrated rather than appearing empty.
- Interface locale preference is stored separately under `tablespark.locale.v1` and is not included in learner-state backup JSON.
- Core product has no required TableSpark backend, user account, payment system, advertising SDK, or remote analytics dependency.

The branch should remain the source of truth for the current work until PR #4 is deliberately merged or superseded. Older verification branches/pull requests do not represent the current implementation.

# Current product implementation

## 1. Multiplication tables

Implemented:

- Custom table start/end values.
- Custom multiplier start/end values.
- Positive table-step control.
- Integer validation for supported table values.
- Supported table/multiplier values are bounded by the domain layer.
- Explicit `MAX_RENDERED_ROWS = 5000` generation budget prevents a mathematically valid-looking configuration from creating an excessively large worksheet DOM.
- Deterministic row ordering.
- Solved equation formatting using the multiplication sign `×`.
- Table-configuration failures resolve through the active locale catalog instead of surfacing raw English domain exceptions.

The row budget is enforced before rendering, not merely hidden by the UI.

## 2. Worksheet composer and printing

The Tables feature includes a dedicated worksheet composer rather than a single hide-answers toggle.

Printable output modes:

1. **Solved study sheet**
2. **Practice worksheet**
3. **Answer key**

Practice answer-blank styles:

- writing line: `______`
- single box: `□`
- open writing space

Paper/layout controls:

- A4 portrait
- US Letter portrait
- one print column
- two print columns
- three print columns

Privacy/accessibility behavior:

- learner-facing study/practice sheets contain blank paper-only Name and Date lines;
- the active local learner profile name is not inserted automatically into printed metadata;
- answer-key output omits learner Name/Date metadata;
- speech controls do not reveal answers in practice-worksheet mode;
- print CSS hides application navigation/configuration controls and aims to avoid unreadable equation-card page breaks.

Browser print behavior is additionally covered by `e2e/print.spec.ts`, while physical printer/browser-engine differences still require release-candidate print-preview review.

# Practice implementation

## 3. Random and reproducible generated practice

Generated sessions use a visible validated unsigned 32-bit seed.

Supported seed range:

```text
0 through 4294967295
```

The deterministic domain generator means the same current-generator inputs:

```text
seed + min + max + count
```

produce the same generated sequence.

The seed is for educational replay/debug reproducibility and is **not cryptographic randomness**.

Implemented actions include:

- a random seed on a fresh practice setup;
- **New random seed**;
- **New random drill** after a generated session;
- **Repeat this seed** after a generated session.

## 4. Practice modes and presets

Implemented modes:

- untimed;
- timed with configurable duration.

Current visible progression presets:

| Preset | Range | Questions |
| --- | --- | ---: |
| Starter | 0–5 | 10 |
| Foundation | 0–10 | 15 |
| Builder | 2–12 | 20 |
| Fluency | 2–15 | 25 |
| Challenge | 2–20 | 30 |

Custom setup remains available, and preset values can still be edited after selection.

Practice question count is bounded to the supported product range. Entered answers are constrained to whole-number values intended by the current product/persistence model.

## 5. Practice feedback and speech

Implemented:

- immediate correct/incorrect feedback;
- per-question elapsed time recording;
- progressive browser speech synthesis for questions where available;
- disabled speech controls plus explanatory copy when the browser cannot provide a usable synthesis API;
- runtime speech failures are non-fatal;
- practice-start and review failures use active-locale fallback copy instead of raw domain exception messages.

This last point is important for Hindi UI correctness: invalid practice setup no longer leaks English exception text into a Hindi session.

## 6. Mistake review

Recent incorrect attempts can be converted into a review session.

Review behavior:

- newest recent mistakes are considered first;
- equivalent commutative facts are deduplicated;
- 4 × 7 and 7 × 4 therefore do not waste two review slots;
- review question count remains bounded;
- a review completion message is distinct from generated-seed replay behavior;
- mistake-review session summaries use `seed: null` because they are not generated seeded drills.

# Progress and learning records

## 7. Mastery model

Per canonical multiplication fact TableSpark tracks:

- attempts;
- correct answers;
- current consecutive-correct streak for that fact;
- last-attempt timestamp;
- mastery percentage.

Commutative normalization means:

```text
4 × 7
7 × 4
```

share one canonical mastery key:

```text
4x7
```

The current transparent mastered rule is:

```text
at least 3 attempts AND at least 90% mastery accuracy
```

This rule is shown in product documentation/UI rather than hidden behind an opaque adaptive score.

The stored streak is a fact-level consecutive-correct statistic; it is not a daily engagement/login streak.

## 8. Progress dashboard

Implemented metrics:

- overall profile accuracy;
- total attempts;
- facts practiced;
- mastered facts;
- saved recent mistakes.

Mastery list features:

- search using `x` or `×` notation;
- All practiced facts filter;
- Needs practice filter;
- Mastered filter;
- deterministic ordering;
- textual percentage information alongside visual progress bars.

## 9. Local session history

Persisted schema 2 adds compact completed-session summaries.

A summary stores:

- session id;
- generated-drill or mistake-review kind;
- timed/untimed mode;
- completion timestamp;
- question count;
- correct count;
- elapsed time;
- replay seed for generated drills;
- `null` seed for mistake review.

Session history intentionally stores **summary data**, not a duplicate copy of every submitted answer.

Supported per-profile retention choices:

```text
10
25
50
100
```

Default retention:

```text
25
```

Hard maximum:

```text
100
```

Reducing retention immediately trims older profile session summaries.

The Progress screen displays recent retained summaries with session type, mode, score, duration, completion time, and generated seed where applicable.

## 10. Optional mastery goals

Each local profile can store an optional mastered-facts target.

Current goal semantics are deliberately low pressure:

- no deadline;
- no daily streak requirement;
- no inactivity penalty;
- no ranking against other learners/profiles;
- no notification pressure;
- can be cleared at any time.

Goal progress is displayed separately from the mastery definition itself. Reaching or missing a goal does not change whether a fact satisfies the 3-attempt/90% mastered rule.

# Profiles and settings

## 11. Offline profiles

Implemented:

- multiple local learner profiles without an online account;
- profile names with bounded/trimmed input;
- active-profile switching;
- new profile becomes active;
- maximum supported profile capacity: `100`;
- final remaining profile cannot be deleted;
- destructive profile deletion requires confirmation.

The 100-profile maximum is enforced inside the functional React state updater, not only from the rendered Settings count. This prevents two batched additions at a 99-profile state from both observing stale render state and creating 101 profiles.

Each profile keeps separate:

- mastery;
- recent mistakes;
- session summaries;
- optional mastered-facts goal.

## 12. Appearance and accessibility preferences

Implemented:

- System theme;
- Light theme;
- Dark theme;
- large-text classroom mode;
- reduced-motion mode;
- optional text-to-speech controls;
- practice default question count;
- timed-session default duration;
- session-history retention.

# Localization

## 13. Central locale provider

The earlier “English copy prepared for future localization” state has been superseded.

TableSpark now has a real runtime locale system:

- central `LocaleProvider`;
- typed message-catalog contract;
- English source catalog;
- complete Hindi (`hi`) catalog;
- locale preference persistence;
- automatic root `<html lang>` update;
- browser-language fallback when no valid stored preference exists.

Supported locales:

```text
en — English
hi — हिन्दी
```

Language selector naming remains recognizable even after switching so the learner can recover from choosing an unfamiliar UI language.

Locale preference is separate from learner-state backup JSON.

## 14. Localization test coverage

Implemented automated coverage includes:

- runtime catalog structural parity;
- nonblank static Hindi messages;
- supported locale recognition;
- stored locale preference;
- Hindi browser-language fallback;
- blocked locale-storage failure containment;
- English → Hindi UI switching;
- persisted Hindi restoration after remount/reload;
- document language metadata;
- locale preference excluded from learner-state JSON;
- browser-level Hindi navigation/reload;
- browser-level Hindi table/practice/backup error paths.

The final hardening pass changed table generation, practice start/review, and invalid-backup feedback so these paths use localized catalog messages rather than embedding raw English parser/domain exceptions.

A fluent/native Hindi terminology review remains a **manual release-quality gate** and is documented in `docs/hindi-review-checklist.md`.

# Persistence and recovery

## 15. Current schema version

Current learner-state schema:

```text
schemaVersion: 2
```

Current learner-state storage key:

```text
tablespark.state.v1
```

These values intentionally differ. The existing key is retained so old data can be found and migrated.

## 16. Schema 1 → 2 migration

A valid schema-1 profile is migrated by adding:

```text
sessions: []
masteredFactsGoal: null
```

Schema-1 settings receive:

```text
sessionHistoryLimit: 25
```

Then:

```text
schemaVersion = 2
```

The migrated candidate still passes through the complete schema-2 validator.

Malformed old structures are not heuristically “fixed” into trusted state.

Unsupported unknown schema versions fail explicitly.

## 17. Shared persistence/import budget

Maximum learner-state/import text budget:

```text
2,000,000 bytes
```

The application calculates encoded byte length, not merely JavaScript character count.

The budget is applied:

- before imported/stored JSON parsing;
- before writing serialized current state.

## 18. Structural and semantic validation

Persisted/imported learner state is treated as untrusted input.

Validation includes:

- schema version;
- one through 100 profiles;
- unique profile ids;
- active profile exists;
- bounded nonblank profile names;
- application-format UTC ISO timestamps;
- valid theme/accessibility/practice settings;
- supported session-retention value;
- canonical mastery keys;
- mastery object key matches each stored mastery-stat key;
- correct count cannot exceed attempts;
- streak cannot exceed correct/attempt counts;
- question operand bounds;
- question answer equals operand product;
- attempt correctness agrees with recorded response;
- saved recent mistakes contain only incorrect attempts;
- bounded mistakes;
- session id/kind/mode/timestamp/count/elapsed-time bounds;
- session correct count cannot exceed question count;
- generated sessions require a replay seed;
- mistake-review sessions require `seed: null`;
- stored session history cannot exceed configured retention;
- optional mastery goal bounds.

## 19. Startup storage classification

The learner-state loader now distinguishes **four** startup outcomes:

### `empty`

`localStorage.getItem()` succeeded and no learner-state value exists. TableSpark can create and persist defaults.

### `loaded`

The browser read succeeded and the existing value parses/migrates/validates successfully. It becomes current state.

### `invalid`

The browser read succeeded and returned an existing raw value, but parsing, migration, size validation, schema validation, or semantic validation failed.

This case is **not** treated as empty. The exact returned value is preserved for explicit recovery.

### `unavailable`

`localStorage.getItem()` itself threw before TableSpark obtained a learner-state value.

This is deliberately neither `empty` nor `invalid`:

- TableSpark cannot know whether learner data exists;
- it creates only temporary in-memory defaults so core UI can render;
- `storageReadUnavailable = true`;
- `unreadableStoredState = false`;
- automatic learner-state writes are paused;
- normal validated backup export/import controls are disabled because the visible default is not a trustworthy representation of inaccessible storage;
- recovery UI for a known invalid raw value is not shown because no raw value was obtained.

This distinction fixes the prior edge case where a browser storage read exception could be misclassified as corrupted data and could eventually risk writing temporary defaults over unknown inaccessible state.

## 20. Known-invalid local-state recovery

When an existing learner-state value was successfully read but is invalid:

- original raw stored value is preserved;
- TableSpark creates only a temporary in-memory default state so UI remains usable;
- automatic learner-state persistence is paused;
- **Stored learning data needs recovery** is displayed;
- ordinary validated Export backup is disabled because visible state is temporary;
- exact raw stored text can be downloaded privately as a recovery `.txt` artifact;
- a valid backup can explicitly replace the unreadable value;
- unreadable value can be explicitly discarded after confirmation;
- normal persistence resumes only after valid replacement/discard.

This prevents a temporary default state from automatically destroying recoverable existing data.

## 21. Transactional backup replacement

Backup replacement now has a durability boundary rather than treating a React state update as equivalent to a successful import.

Pipeline:

```text
raw backup
→ byte-size check
→ JSON parsing
→ supported migration
→ complete schema-2 validation
→ confirm startup storage was readable
→ save validated replacement
→ only after successful save, replace React state
→ report import success
```

If validation fails:

- current state remains unchanged;
- localized generic import failure is shown.

If startup storage reads were unavailable:

- replacement is refused without writing, because TableSpark will not overwrite unknown inaccessible data.

If the replacement write fails:

- current state remains unchanged;
- `persistenceAvailable` is set false;
- import reports failure rather than success.

If the replacement write succeeds:

- validated replacement becomes current state;
- known-invalid recovery state is cleared when applicable;
- persistence is marked available;
- the normal persistence effect can continue from the durable replacement.

## 22. Normal storage write failure

A different condition exists when current state is known/valid but the browser later refuses a save.

TableSpark:

- keeps in-memory state usable;
- reports the failed write as `persistenceAvailable = false`;
- displays **Local saving is unavailable**;
- does not crash the application;
- warns that changes may not survive reload.

This later write-failure state remains distinct from both known-invalid existing data and startup storage-read unavailability because their safe export/recovery behavior differs.

# Accessibility and keyboard behavior

## 23. Implemented accessibility structure

Current implementation includes:

- semantic native controls;
- visible labels;
- explicit navigation label;
- `aria-current` for active section;
- skip-to-content link;
- visible focus styling;
- touch-friendly controls;
- status/alert/live-region usage where appropriate;
- light/dark/system themes;
- large-text mode;
- reduced motion;
- responsive narrow layouts;
- profile-name-safe print metadata;
- document language updates for locale changes;
- progress percentages available as text/accessible labels.

## 24. Keyboard shortcut reference

Implemented:

- Alt+1 — Tables
- Alt+2 — Practice
- Alt+3 — Progress
- Alt+4 — Settings
- Alt+5 — About
- `?` — open/close shortcut reference outside editable controls
- Escape — close shortcut reference
- normal navigation button opens shortcut help without remembering a key

The shortcuts are optional enhancements and may be intercepted by an OS/browser.

## 25. Accessibility verification boundary

Automated Playwright checks verify stable semantics such as:

- one main landmark;
- named primary navigation;
- skip-link target;
- form control labeling;
- image alt attributes;
- shortcut reference keyboard reachability.

They do not prove WCAG conformance or real screen-reader success.

The manual assistive-technology matrix remains pending until actually executed with combinations such as NVDA, Narrator, VoiceOver, and TalkBack.

# PWA lifecycle

## 26. Offline/update behavior

The production PWA service worker can cache the app shell.

TableSpark surfaces:

- offline status;
- offline-ready status;
- update-ready status.

An available update does **not** automatically reload an active learner task.

User choices:

- **Update now**
- **Later**

## 27. Optional installation

When a supporting browser emits its install-prompt event, TableSpark can display an optional installation message/action.

Properties:

- no fabricated install capability;
- install is optional;
- **Not now** can dismiss it;
- no account is created;
- install-prompt failures remain non-fatal.

# Release and distribution work

## 28. Release artifact integrity

Tagged release workflow packages:

```text
tablespark-web.zip
```

and publishes:

```text
tablespark-web.zip.sha256
```

The checksum verifies byte-level integrity relative to the workflow-produced digest.

It is not a cryptographic publisher signature.

## 29. Real browser visual evidence

The repository contains:

```text
e2e/release-evidence.spec.ts
.github/workflows/visual-evidence.yml
```

The workflow can capture real Chromium screenshots from the built app for:

- light / wide;
- dark / wide;
- light / compact;
- dark / compact.

These are intended as real browser evidence rather than fabricated/mock release screenshots.

The uploaded artifact still requires human inspection before being marked reviewed.

## 30. Deployment/native packaging decisions

Static hosting is technically appropriate for `dist/`, but no repository document claims an unapproved host is production.

`docs/deployment-evaluation.md` documents static-host candidates and the owner-approval/real-origin validation gate.

`docs/native-packaging-evaluation.md` records the current decision:

- keep the PWA as canonical;
- do not add a TWA/Capacitor/native rewrite speculatively;
- re-evaluate a TWA first if Android store distribution becomes an explicit approved requirement after a production origin/signing plan exists.

# Automated test system

## 31. Domain/unit/property coverage

Current coverage includes:

- bounded practice answers;
- difficulty presets;
- table range/step/order/5,000-row budget;
- worksheet blank styles;
- deterministic seeded question generation;
- seed bounds;
- generated operand/product property tests;
- canonical mastery keys;
- mastery counters/accuracy/streaks/mistakes;
- progress mastery/search/filter/order;
- deduplicated mistake review;
- session retention/prepend/trim.

## 32. Infrastructure coverage

Includes:

- browser preference resilience;
- locale preference resilience;
- install-prompt type guard;
- structured log redaction;
- schema migrations;
- PWA lifecycle events;
- random seed helper;
- speech availability/failure;
- local storage round trip;
- portable JSON import/export;
- size budget;
- schema-1 migration;
- duplicate profile ids;
- active-profile integrity;
- mastery semantic invariants;
- question/attempt/mistake semantics;
- session semantics/retention;
- goal bounds;
- known-invalid stored-state classification/preservation;
- blocked startup storage-read classification as `unavailable` rather than `invalid`;
- normal write failure;
- explicit clear.

## 33. React integration coverage

Includes:

- initial app/generator;
- navigation;
- generator updates;
- worksheet composer output/blank behavior;
- print metadata;
- mastery filtering/search;
- mistake-review completion;
- speech unavailable UI;
- persistence failure alert;
- unreadable-state preservation/recovery controls;
- keyboard shortcut help;
- session-history persistence;
- retention trimming;
- optional mastery goals;
- English/Hindi locale switching/persistence;
- atomic profile-capacity enforcement during batched additions;
- startup blocked-read behavior with recovery disabled and automatic writes suppressed;
- successful transactional backup replacement;
- failed backup replacement leaving the current profile/state unchanged.

## 34. Browser E2E coverage

Current specs:

```text
e2e/smoke.spec.ts
e2e/accessibility.spec.ts
e2e/localization.spec.ts
e2e/localized-errors.spec.ts
e2e/print.spec.ts
e2e/release-evidence.spec.ts
```

Ordinary E2E covers core flows, accessibility invariants, localization/error localization and print behavior.

Release-evidence screenshot capture is opt-in through its dedicated flag/workflow.

# Repository security/quality tooling

## 35. Secret scanner

Files:

```text
scripts/secret-scanner.mjs
scripts/secret-scanner.test.mjs
scripts/secret-scan.mjs
```

Properties:

- dependency-free;
- recognizes a bounded set of high-risk credential signatures;
- reports file/line/finding type rather than echoing the matched value;
- has its own Node tests;
- is part of the standard quality gate/CI.

It is defense in depth, not permission to commit credentials. A real exposed secret must be revoked/rotated and history/artifacts assessed separately.

## 36. Documentation link checker

Files:

```text
scripts/link-checker.mjs
scripts/link-checker.test.mjs
scripts/link-check.mjs
```

Formal package command:

```bash
npm run test:docs
```

It:

1. tests the checker implementation;
2. verifies supported repository-local Markdown link targets against the checkout.

`test:docs` is part of:

- `npm run check`;
- CI `quality`;
- tagged release verification because release runs `npm run check`.

The checker deliberately focuses on local paths and does not crawl every external website.

# Current npm quality commands

Main scripts:

```text
npm run dev
npm run build
npm run preview
npm run typecheck
npm run lint
npm run format
npm run format:check
npm run test
npm run test:watch
npm run test:coverage
npm run test:e2e
npm run test:security
npm run secret:scan
npm run test:docs
npm run check
```

Current `npm run check` order:

```text
format:check
→ lint
→ typecheck
→ test
→ test:security
→ secret:scan
→ test:docs
→ build
```

Playwright E2E and the npm production advisory audit remain separate CI/release-candidate gates.

# Current GitHub automation

## 37. CI

`.github/workflows/ci.yml`

Triggers:

- push to `main`;
- pull request targeting `main`.

`quality` currently performs:

1. checkout;
2. Node 22.12.0 setup;
3. dependency install;
4. formatting check;
5. lint;
6. strict type check;
7. application tests;
8. secret-scanner tests;
9. repository secret scan;
10. documentation-link quality gate;
11. production build;
12. high-severity production dependency audit;
13. `dist/` artifact upload.

`e2e`:

- installs Chromium/system dependencies;
- runs production-preview Playwright tests.

## 38. CodeQL

`.github/workflows/codeql.yml`

Runs on:

- main pushes;
- PRs to main;
- weekly schedule.

Uses JavaScript/TypeScript CodeQL analysis with scoped `security-events: write` permission.

## 39. Release

`.github/workflows/release.yml`

Runs on `v*.*.*` tags and:

- reruns `npm run check`;
- rebuilds;
- packages ZIP;
- creates SHA-256 metadata;
- creates GitHub Release with generated notes and both assets.

## 40. Release Visual Evidence

`.github/workflows/visual-evidence.yml`

Runs on PRs to main and manual dispatch, captures real Chromium screenshots, and uploads a 30-day evidence artifact.

## 41. Dependabot

Configured weekly for:

- npm;
- GitHub Actions.

Development dependencies can be grouped to reduce update noise.

# Deep documentation completion phase

The project documentation has been expanded from topic-level guides into a complete repository documentation system.

## 42. Deep documentation references

### `docs/commands-reference.md`

Deep explanation of npm, browser, evidence, security, documentation, Git and release commands plus common failures.

### `docs/configuration-reference.md`

Documents package, Node, TypeScript, Vite/PWA, Vitest, Playwright, ESLint, Prettier, EditorConfig, VS Code, environment, Git and GitHub configuration and synchronized values.

### `docs/ci-cd.md`

Documents CI quality/e2e, CodeQL, release workflow, visual evidence, permissions, concurrency, artifacts, Dependabot, generated notes, failure triage and check-name maintenance.

### `docs/domain-model.md`

Documents core domain types, mathematical invariants, table/worksheet budgets, deterministic generation, mastery, mistake review, sessions/goals and feature-to-domain flows.

### `docs/state-and-persistence.md`

Now documents in detail:

- storage keys;
- **empty / loaded / invalid / unavailable** startup states;
- distinction between known-invalid returned data and a storage read that never returned a value;
- suppression of writes after blocked startup reads;
- ordinary write failures;
- all `AppState` actions;
- atomic 100-profile capacity enforcement;
- structural/semantic validation;
- migration pipeline;
- transactional backup replacement;
- backup/raw recovery behavior;
- future schema-change procedure and maintainer checklist.

### `docs/security-model.md`

Documents engineering trust boundaries for browser input, localStorage/read availability, transactional backup import, raw recovery, browser APIs, service worker/install prompt, external navigation, dependencies, Actions, release artifacts, XSS/rendering, logging, repository scanning and future backend/auth consequences.

### `docs/maintenance.md`

Maintainer operations handbook covering dependency/toolchain upgrades, TypeScript/lint/formatting, domain/schema compatibility, storage budgets, localization/Hindi review, accessibility/print, PWA/hosting, Actions/Dependabot, scanner/docs gates, documentation, releases and incidents.

### `docs/glossary.md`

A project-specific A–Z glossary covering product, learning, persistence, accessibility, PWA, testing, Git, security and release terminology.

### `docs/documentation-index.md`

Audience/task navigation plus documentation source-of-truth hierarchy and update matrix.

### `docs/repository-file-reference.md`

Exhaustive tracked-file inventory.

At the documentation-completeness checkpoint it explicitly lists **156 tracked files**, including every root config/policy/document, GitHub config/workflow/template, VS Code file, ADR/document/asset, E2E spec, public asset, repository script/test and application source/test/style/type file.

The final audit temporarily evaluated adding a CODEOWNERS file, but did not retain it because the project already has a single clear repository maintainer and retaining it would have expanded the tracked-file inventory without enough functional value. The final tree therefore remains aligned with the 156-file exhaustive reference.

## 43. Public policy/documentation synchronization

The final hardening pass synchronized:

- `CHANGELOG.md` with blocked-read, transactional-import, localized-error and atomic-profile fixes;
- `ROADMAP.md` with the now-implemented runtime locale provider/Hindi interface rather than stale “ready for a locale provider” wording;
- `SECURITY.md` with blocked-read and transactional replacement trust boundaries;
- `PRIVACY.md` with startup-read unavailability, disabled unsafe backup actions and durability-before-import-success behavior;
- `docs/security-model.md` and `docs/state-and-persistence.md` with the same executable invariants.

This is important because persistence behavior is part of the public privacy/data-loss contract, not merely an internal refactor.

# Final reliability hardening in this continuation

## 44. Atomic profile-capacity invariant

A real React batching edge case was fixed.

Before the fix, `addProfile()` checked the rendered `state.profiles.length` before scheduling the functional update. At 99 profiles, two additions fired in one event could both pass that stale outer check and sequentially produce 101 profiles.

Current behavior:

- trim/validate name first;
- inspect `current.profiles.length` inside the updater;
- only create/append a profile when the latest state is below `MAX_PROFILES`.

Regression coverage creates 99 profiles, dispatches two additions in one event and verifies both rendered and persisted counts stop at 100.

## 45. Browser storage-read classification

A second real reliability/data-safety issue was fixed.

Previously, an exception from `localStorage.getItem()` was grouped with malformed returned data. That could incorrectly show a corrupted-data recovery flow even though TableSpark had never obtained any value to parse or preserve.

Current loader result type has four explicit outcomes:

```text
empty
loaded
invalid
unavailable
```

`unavailable` is reserved for a storage read operation that throws.

Regression coverage verifies:

- the storage infrastructure returns `unavailable`;
- the provider reports saving unavailable;
- recovery remains not required;
- no automatic `setItem()` call is attempted after the blocked startup read.

## 46. Transactional destructive backup import

A third reliability issue was fixed.

Previously, a validated backup could replace React state and immediately show “imported successfully,” while persistence happened later in an effect. If the browser then rejected the write, the imported state existed only in memory and could disappear on reload despite the success message.

Current behavior:

1. parse/migrate/validate;
2. refuse replacement if startup storage was unreadable;
3. call `saveState(replacement)`;
4. if saving fails, leave current state unchanged and return failure;
5. only after successful saving, replace React state and clear invalid-data recovery;
6. the Settings UI reports localized success/failure from that durability result.

Regression coverage verifies both successful and failed replacement paths.

## 47. Safe backup actions during blocked startup reads

When the initial learner-state read is unavailable:

- validated backup export is disabled because the displayed defaults are only temporary;
- backup import is disabled because TableSpark refuses to overwrite unknown inaccessible storage;
- a localized storage warning remains available as explanation;
- known-invalid-value recovery controls stay hidden.

A normal later write failure is intentionally different: current state was already known, so exporting it can still be useful.

## 48. Localized validation failures

The final audit compared Hindi browser error expectations with feature catch paths and found a source/test mismatch.

Fixed paths:

- table generation/configuration failure;
- generated practice startup failure;
- mistake-review setup failure;
- invalid backup parsing/schema failure.

These paths now use the active message catalog/generic localized copy rather than raw English domain/Zod exception messages.

# Documentation integrity and completeness

## 49. Documentation link gate

Formal package command:

```bash
npm run test:docs
```

It tests the link-checker implementation and checks supported repository-local Markdown links.

It is included in:

- `npm run check`;
- CI `quality`;
- tagged release verification through `npm run check`.

## 50. Exhaustive tracked-file reference

`docs/repository-file-reference.md` is the auditable artifact for the “do not skip files” requirement.

The maintained checkpoint lists **156 tracked files individually**.

Generated/untracked directories such as `node_modules/`, `dist/`, `coverage/`, Playwright reports/results and similar build/runtime output are deliberately excluded from tracked-file counts.

# Verification status for this handoff

## 51. Local execution limitation

A direct clean-clone verification attempt in the execution container could not resolve `github.com` because that container had no working outbound DNS/network path for the clone.

Therefore this handoff makes **no claim** that a local clean-clone:

```text
npm install
npm run check
npm run test:e2e
npm audit
```

completed successfully in that container.

GitHub Actions remains the authoritative executable verification path for the branch.

## 52. GitHub exact-final-head verification rule

This handoff update itself changes the branch SHA. Prior workflow runs—even successful runs—cannot be used as final evidence for the exact SHA produced by this commit.

After this commit:

1. fetch PR #4 again and record its exact new head SHA externally;
2. inspect CI for that exact SHA;
3. inspect CodeQL for that exact SHA;
4. inspect Release Visual Evidence for that exact SHA;
5. if any exact-head job fails, inspect its job/steps/logs and make only focused fixes;
6. after any fix, repeat the exact-head rule because the SHA changed again.

Do not edit this handoff merely to paste a green workflow status if doing so would create another unverified head.

A run is not a pass when it is:

- queued;
- in progress;
- cancelled;
- skipped;
- unavailable;
- attached only to an older head SHA.

# Manual/external gates

## 53. Gates that remain pending until actually executed

These are intentionally **not** marked complete by source/documentation work alone:

- human inspection of real light/dark compact/wide screenshot artifacts;
- manual NVDA review;
- manual Narrator review;
- manual VoiceOver review;
- manual TalkBack review;
- fluent/native Hindi terminology review;
- Hindi narrow-layout/print review;
- production static host/origin approval;
- production-origin first-load validation;
- production manifest/service-worker scope validation;
- production PWA installability behavior;
- online-load then offline-reload validation on production origin;
- deployed update producing the expected non-blocking update notice;
- final release tag creation;
- downloaded release ZIP/checksum verification;
- final deployment/rollback evidence.

These gates are tracked in `docs/release-evidence.md`, `docs/accessibility.md`, `docs/hindi-review-checklist.md`, `docs/deployment-evaluation.md`, and `docs/release.md`.

# Next safe work

Source/product/documentation scope is now at the final release-candidate/refinement checkpoint. The next work should be **verification and evidence**, not speculative feature expansion:

1. fetch final PR #4 head SHA;
2. inspect CI `quality` and `e2e` for that exact SHA;
3. inspect CodeQL for that exact SHA;
4. inspect Release Visual Evidence for that exact SHA;
5. fix only real final-head failures with focused commits/tests;
6. if visual evidence succeeds, inspect the artifact before marking screenshots reviewed;
7. keep assistive-technology/Hindi/production-origin/release gates pending until actually performed;
8. do not merge PR #4 until required repository checks and intended review gates are satisfied.

No production deployment, native wrapper, app-store package, release tag, or manual assistive-technology/Hindi certification is claimed by this handoff.
