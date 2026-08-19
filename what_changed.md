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

The row budget is enforced before rendering, not merely hidden by the UI.

## 2. Worksheet composer and printing

The Tables feature now includes a dedicated worksheet composer rather than a single hide-answers toggle.

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
- runtime speech failures are non-fatal.

User-facing practice/table error paths are localized rather than exposing raw English domain exception strings while the Hindi locale is active.

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

The local storage loader distinguishes:

### `empty`

No learner-state value exists. TableSpark can create/persist defaults.

### `loaded`

Existing value parses/migrates/validates successfully and becomes current state.

### `invalid`

A value exists but cannot safely be read/parsed/migrated/validated.

The `invalid` case is **not** treated as empty.

## 20. Unreadable local-state recovery

When an existing learner-state value is unreadable:

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

## 21. Normal storage write failure

A different condition exists when current state is valid but the browser refuses a save.

TableSpark:

- keeps in-memory state usable;
- reports the failed write as `persistenceAvailable = false`;
- displays **Local saving is unavailable**;
- does not crash the application;
- warns that changes may not survive reload.

Write failure and unreadable-existing-data recovery intentionally remain separate states because their safe behavior differs.

# Accessibility and keyboard behavior

## 22. Implemented accessibility structure

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

## 23. Keyboard shortcut reference

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

## 24. Accessibility verification boundary

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

## 25. Offline/update behavior

The production PWA service worker can cache the app shell.

TableSpark surfaces:

- offline status;
- offline-ready status;
- update-ready status.

An available update does **not** automatically reload an active learner task.

User choices:

- **Update now**
- **Later**

## 26. Optional installation

When a supporting browser emits its install-prompt event, TableSpark can display an optional installation message/action.

Properties:

- no fabricated install capability;
- install is optional;
- **Not now** can dismiss it;
- no account is created;
- install-prompt failures remain non-fatal.

# Release and distribution work

## 27. Release artifact integrity

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

## 28. Real browser visual evidence

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

## 29. Deployment/native packaging decisions

Static hosting is technically appropriate for `dist/`, but no repository document claims an unapproved host is production.

`docs/deployment-evaluation.md` documents static-host candidates and the owner-approval/real-origin validation gate.

`docs/native-packaging-evaluation.md` records the current decision:

- keep the PWA as canonical;
- do not add a TWA/Capacitor/native rewrite speculatively;
- re-evaluate a TWA first if Android store distribution becomes an explicit approved requirement after a production origin/signing plan exists.

# Automated test system

## 30. Domain/unit/property coverage

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

## 31. Infrastructure coverage

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
- unreadable stored-state classification/preservation;
- normal write failure;
- explicit clear.

## 32. React integration coverage

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
- English/Hindi locale switching/persistence.

## 33. Browser E2E coverage

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

## 34. Secret scanner

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

## 35. Documentation link checker

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

`test:docs` is now part of:

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

## 36. CI

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

## 37. CodeQL

`.github/workflows/codeql.yml`

Runs on:

- main pushes;
- PRs to main;
- weekly schedule.

Uses JavaScript/TypeScript CodeQL analysis with scoped `security-events: write` permission.

## 38. Release

`.github/workflows/release.yml`

Runs on `v*.*.*` tags and:

- reruns `npm run check`;
- rebuilds;
- packages ZIP;
- creates SHA-256 metadata;
- creates GitHub Release with generated notes and both assets.

## 39. Release Visual Evidence

`.github/workflows/visual-evidence.yml`

Runs on PRs to main and manual dispatch, captures real Chromium screenshots, and uploads a 30-day evidence artifact.

## 40. Dependabot

Configured weekly for:

- npm;
- GitHub Actions.

Development dependencies can be grouped to reduce update noise.

# Deep documentation completion phase

The project documentation has now been expanded from topic-level guides into a complete repository documentation system.

## 41. New deep documentation references

Added:

### `docs/commands-reference.md`

Deep explanation of:

- npm install/dev/build/preview/typecheck/lint/format/tests;
- Playwright/browser installation;
- visual evidence capture;
- secret scanning;
- formal documentation-link gate;
- aggregate quality gate;
- npm audit;
- Git commands;
- release tags/checksum verification;
- common failures.

### `docs/configuration-reference.md`

Documents:

- `package.json`;
- `.nvmrc`;
- TypeScript project graph/strictness;
- Vite/PWA manifest/Workbox;
- Vitest;
- Playwright;
- ESLint;
- Prettier;
- EditorConfig;
- VS Code workspace settings;
- environment placeholders/security;
- Git ignore/attributes;
- GitHub repository configuration;
- synchronized values that must move together.

### `docs/ci-cd.md`

Documents every repository automation surface:

- CI quality/e2e;
- documentation-link step;
- CodeQL;
- release workflow;
- visual-evidence workflow;
- permissions;
- concurrency;
- artifacts;
- Dependabot;
- generated release notes;
- failure triage;
- branch-protection check-name maintenance.

### `docs/domain-model.md`

Documents:

- all core domain types;
- mathematical invariants;
- table bounds/render budget;
- worksheet model;
- deterministic generator/seed semantics;
- canonical commutative fact keys;
- difficulty presets;
- mastery math/rule;
- mistake-review deduplication;
- session retention/goals;
- feature-to-domain data flows.

### `docs/state-and-persistence.md`

Documents:

- storage keys;
- empty/loaded/invalid startup states;
- automatic save lifecycle;
- normal write failure vs unreadable existing data;
- all AppState actions;
- Zod structural/semantic validation;
- migration pipeline;
- backup/raw recovery behavior;
- future schema-change process.

### `docs/security-model.md`

Documents engineering trust boundaries for:

- browser inputs;
- localStorage;
- backup import;
- raw recovery data;
- browser APIs;
- service workers/install prompts;
- external navigation;
- dependencies;
- GitHub Actions;
- release artifacts;
- rendering/XSS;
- logging;
- repository scanner;
- consequences of any future backend/auth feature.

### `docs/maintenance.md`

Maintainer operations handbook covering:

- dependency/toolchain upgrades;
- TypeScript/ESLint/Prettier;
- domain/schema compatibility;
- localStorage budgets;
- localization/Hindi review;
- accessibility/CSS/print;
- PWA/hosting;
- Actions/Dependabot;
- scanner/documentation gate;
- README/changelog/handoff maintenance;
- releases/incidents/clean-clone verification.

### `docs/glossary.md`

A project-specific A–Z glossary covering product, learning, persistence, accessibility, PWA, testing, Git, security and release terminology.

It explicitly distinguishes concepts such as:

- local vs encrypted;
- offline-first vs never needing internet;
- checksum vs signature;
- seeded vs secure random;
- fact streak vs engagement streak;
- profile vs authenticated account;
- source inspection vs executed evidence.

### `docs/documentation-index.md`

Audience/task navigation for:

- users;
- developers;
- maintainers;
- persistence work;
- localization;
- accessibility;
- security/privacy;
- releases;
- deployment/packaging.

It also defines documentation source-of-truth hierarchy and an update matrix.

### `docs/repository-file-reference.md`

Exhaustive tracked-file inventory.

At the documentation-completeness checkpoint it explicitly lists **156 tracked files**, including:

- every root config/policy/document;
- every GitHub config/workflow/template;
- both VS Code workspace files;
- every ADR/document/asset;
- every E2E spec;
- every public asset;
- every repository script/test;
- every application/component/domain/feature/i18n/infrastructure/state/test/style/type file.

Each entry explains its purpose and important maintenance relationship.

The reference also includes cross-file synchronization checklists and a procedure for comparing against a recursive Git tree/`git ls-files`.

## 42. Existing documentation retained and integrated

The new documentation does not replace the existing focused guides. It integrates with and links to:

- README;
- CHANGELOG;
- ROADMAP;
- PRIVACY;
- SECURITY;
- SUPPORT;
- CONTRIBUTING;
- CODE OF CONDUCT;
- accessibility;
- architecture;
- data-schema-v2;
- deployment evaluation;
- development;
- git workflow;
- Hindi review;
- localization;
- native packaging evaluation;
- performance;
- quality gates;
- release evidence;
- release notes template;
- release guide;
- repository settings;
- setup;
- testing;
- troubleshooting;
- user guide;
- verification plan;
- ADRs 0001–0004.

## 43. Documentation integrity improvement

Before this phase, the repository had a local link-checker utility but documentation/process text was partially stale about how it was invoked.

Current state:

- `npm run test:docs` is declared in `package.json`;
- it tests the link-checker implementation and then checks repository-local Markdown targets;
- `npm run check` includes `test:docs`;
- CI `quality` has an explicit documentation-link step;
- tagged release verification inherits it through `npm run check`;
- `docs/quality-gates.md`, `docs/testing.md`, `docs/commands-reference.md`, `docs/ci-cd.md`, `docs/maintenance.md`, and the tracked-file reference are synchronized with this behavior;
- stale documentation that referred to an undeclared `docs:check` command has been corrected.

# Verification status for this handoff

## 44. Local execution limitation

A direct clean-clone verification attempt in the execution container could not resolve `github.com` because that container had no working outbound DNS/network path for the clone.

Therefore this handoff makes **no claim** that a local clean-clone:

```text
npm install
npm run check
npm run test:e2e
npm audit
```

completed successfully in that container.

The repository is public and GitHub Actions remains the authoritative executable verification path for the branch.

## 45. GitHub final-head verification rule

This handoff update itself changes the branch SHA, so prior workflow runs—even successful runs—cannot be used as final evidence for this exact final documentation checkpoint.

After this commit, fetch/check the final PR head and its GitHub Actions runs.

Do not edit this file again merely to paste a green status if doing so would create a new unverified SHA. Record final external workflow state in the PR/check UI and final response/release-evidence process instead.

A run is not a pass when it is:

- queued;
- in progress;
- cancelled;
- skipped;
- unavailable;
- attached only to an older head SHA.

## 46. Manual/external gates that remain pending until actually executed

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

# Documentation completeness checkpoint

The current documentation pass was explicitly performed to satisfy the requirement to document the complete repository without skipping tracked files.

The auditable completeness artifact is:

```text
docs/repository-file-reference.md
```

At this checkpoint it documents **156 tracked files individually**.

The maintained completeness procedure is:

1. obtain a recursive Git tree or run `git ls-files` on the exact candidate;
2. compare every tracked file against the reference;
3. update the reference for any add/remove/rename;
4. run `npm run test:docs` to verify supported local documentation targets;
5. keep documentation-index/README discoverability current;
6. record meaningful documentation-system changes in CHANGELOG and this handoff.

# Next safe work

Source/product scope is largely at a release-candidate/refinement checkpoint. The next work should prioritize **verification and evidence**, not speculative architecture expansion:

1. fetch final PR #4 head SHA;
2. inspect CI `quality` and `e2e` for that exact SHA;
3. inspect CodeQL for that exact SHA;
4. inspect Release Visual Evidence run for that exact SHA;
5. fix only real final-head failures with focused commits/tests;
6. if visual evidence succeeds, manually inspect the artifact before marking screenshots reviewed;
7. keep remaining assistive-technology/Hindi/production-origin/release gates pending until actually performed;
8. do not merge PR #4 until the required repository checks and intended review gates are satisfied.

No production deployment, native wrapper, app-store package, release tag, or manual assistive-technology/Hindi certification is claimed by this handoff.
