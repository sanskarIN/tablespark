# TableSpark — Work Handoff

Last updated: 2026-08-19

## Current version and milestone

- Application version: `0.1.0`
- Repository: `https://github.com/sanskarIN/tablespark`
- Default branch: `main`
- Primary architecture: strict TypeScript + React + Vite Progressive Web App.
- Persistence model: local-first, versioned schema `1` with semantic validation and explicit recovery handling.
- Current implementation status: Phases 0–5 are implemented at release-candidate depth. Phase 6 final executable verification is represented by the fresh verification pull request created from the latest `main` after the reliability/security/documentation pass.
- Current verification branch: `chore/final-verification-2026-08-19-v2`
- Current verification pull request: `#4 chore: run final TableSpark release-candidate verification`
- Earlier verification pull requests `#1`, `#2`, and `#3` were superseded/closed because later work changed the codebase after those checkpoints.

## Completed work

### Product: table generation and worksheets

- Custom multiplication table start/end values.
- Custom multiplier start/end values.
- Configurable table step sizes.
- Domain validation for integer/range constraints.
- Explicit `MAX_RENDERED_ROWS = 5000` budget to prevent valid-looking input from freezing the browser with an enormous worksheet DOM.
- Solved study-sheet mode.
- Blank-answer practice worksheet mode.
- Print-specific worksheet heading.
- Blank Name and Date lines in printed output.
- Active offline profile names are intentionally not inserted into print metadata.
- Print CSS hides configuration/navigation controls and formats equation cards for paper.
- Optional text-to-speech controls remain hidden in blank-answer worksheet mode so speech does not reveal the answer.

### Product: practice

- Random seed selected by default for a new practice setup.
- Explicit unsigned 32-bit deterministic seed range (`0` through `4294967295`).
- Deterministic seeded question generation remains reproducible for tests and bug reports.
- **New random seed** action without changing the other setup values.
- **New random drill** after a generated session.
- **Repeat this seed** after a generated session.
- Timed practice.
- Untimed practice.
- Starter / Builder / Challenge / Custom difficulty progression.
- Configurable number range and question count.
- Whole-number answer checking.
- Explicit supported practice-response range through `src/domain/answers.ts`.
- Immediate correctness feedback.
- Per-question elapsed time recording.
- Progressive speech synthesis for questions where available.
- Mistake-review mode built from recent incorrect facts.
- Equivalent commutative mistakes are deduplicated so review capacity is not wasted by 4×7 and 7×4 appearing as separate facts.
- Generated-seed replay controls are not shown after a mistake-review session; review completion has its own message and return-to-setup action.

### Product: progress and mastery

- Per-fact attempts.
- Per-fact correct answers.
- Current correct-answer streak.
- Per-fact mastery percentage.
- Overall profile accuracy.
- Bounded recent mistake history.
- Commutative facts share a canonical mastery key.
- Explicit mastered-fact rule: at least three attempts and at least 90% accuracy.
- Mastered-fact count.
- Search practiced facts using `x` or `×` notation.
- Filters for All practiced facts / Needs practice / Mastered.
- Deterministic sorting for filtered progress results.

### Product: offline profiles and settings

- Multiple offline profiles with no account requirement.
- Maximum supported profile capacity aligned between runtime and import validation (`100`).
- Active-profile switching.
- Final remaining profile cannot be deleted.
- Destructive profile deletion requires confirmation.
- System / Light / Dark theme.
- Large-text classroom mode.
- Reduced-motion mode.
- Practice defaults for question count and timed duration.
- Text-to-speech controls are disabled with explanatory text when the browser cannot provide a usable synthesis API.
- Settings includes About/update guidance.

### Reliability: persistence health

- Versioned `localStorage` state.
- Shared `MAX_BACKUP_BYTES = 2_000_000` byte budget for current persisted state and imported backups.
- Browser storage write failures return a safe failure result rather than crashing the UI.
- A visible **Local saving is unavailable** alert tells users when changes may not survive reload.
- Lightweight onboarding preference storage has its own safe read/write adapter and tests.

### Reliability: unreadable stored-state recovery

A significant data-loss bug was removed during this continuation.

Previously, treating invalid stored JSON as `null` followed by automatically saving a default state could overwrite a recoverable value. The current architecture distinguishes:

- `empty` — no stored TableSpark value exists;
- `loaded` — stored value exists and validates;
- `invalid` — stored value exists but cannot be parsed/migrated/validated.

When startup state is `invalid`:

- the original raw stored value is preserved;
- TableSpark starts a temporary in-memory default state so the interface remains usable;
- automatic persistence is paused so the unreadable value is not overwritten;
- the UI shows **Stored learning data needs recovery**;
- ordinary Export backup is disabled because it would represent the temporary state rather than the stored value;
- Settings can download the exact raw value as a `.txt` recovery artifact;
- a validated backup import can replace the unreadable value and end recovery;
- the user can explicitly discard the unreadable value only after confirmation;
- after successful replacement/discard, normal persistence resumes.

This behavior is covered by storage tests, React integration regression coverage, Playwright browser coverage, and ADR 0004.

### Backup/import validation

Imported state is treated as untrusted input and is validated before replacement.

Current checks include:

- shared byte-size budget before JSON parsing;
- supported schema version;
- one through the maximum supported profile count;
- unique profile IDs;
- active profile ID references an existing profile;
- nonblank bounded profile names;
- application-format ISO UTC timestamps;
- settings ranges;
- question operand bounds;
- question answer equals the multiplication product;
- attempt correctness agrees with the stored response;
- recent mistake history contains only incorrect attempts;
- canonical mastery fact keys;
- mastery map key equals each stored mastery-stat key;
- correct/streak counters cannot exceed valid totals.

Destructive backup replacement requires confirmation.

### Accessibility and UX

- Native semantic buttons/inputs/selects.
- Visible labels.
- `aria-describedby` where support/recovery context matters.
- Skip-to-content navigation.
- Visible keyboard focus.
- `aria-current` for active navigation.
- Live/status/alert roles for meaningful asynchronous and durability states.
- Large text.
- Reduced motion.
- Responsive layouts down to narrow mobile widths.
- Touch-friendly targets.
- Light/dark/system theme tokens.
- Alt+1 through Alt+5 desktop section shortcuts where not intercepted by the browser/OS.
- Progressive speech capability detection and failure fallback.
- Recovery actions are explicit, keyboard-operable, and confirmed before irreversible deletion.
- Printed worksheet metadata avoids automatically exposing the active local learner profile name.

### Internationalization readiness

- Product UI copy is centralized in `src/i18n/en.ts`.
- Shell, status/recovery, fatal error, tables, practice, progress, settings, and About copy use the externalized English structure.
- Dynamic copy uses typed message factories for scores, seeds, profile capacity, progress statistics, recovery states, and other variable text.
- Domain validation messages remain with domain/infrastructure rules because they are non-UI error contracts used by tests and programmatic callers.
- A runtime locale provider is intentionally deferred until a second locale is added.

### Structured logging

- Technical event logging remains structured.
- Sensitive-looking field names are redacted.
- Recognizable sensitive string values (including email/representative credential formats/private-key headers) are also redacted even when stored under a generic field name.
- Recovery data itself is not logged.
- Speech/storage/browser-preference failures use generic technical event names without learner content.

### Repository secret scanner

Added a dependency-free repository credential-pattern scanner:

- `scripts/secret-scanner.mjs`
- `scripts/secret-scan.mjs`
- `scripts/secret-scanner.test.mjs`

Properties:

- scans repository text while ignoring generated/dependency directories;
- skips binary and oversized files;
- recognizes representative private-key, GitHub, AWS, Google, Slack, and Stripe credential signatures;
- reports file, line, and finding type only;
- deliberately does not echo the matched credential value;
- has an independent Node test suite;
- participates in the standard quality gate and CI.

This is defense in depth and is documented as not replacing credential revocation/history cleanup after an actual exposure.

### Documentation link integrity

Added a dependency-free local documentation link checker:

- `scripts/link-checker.mjs`
- `scripts/link-check.mjs`
- `scripts/link-checker.test.mjs`

It:

- scans Markdown files;
- recognizes ordinary Markdown relative links/images and simple HTML href/src references;
- ignores external URLs, mail/tel/data targets, and fragment-only links;
- verifies local targets exist;
- ignores generated/dependency directories;
- has its own Node test suite;
- participates in `npm run check` and CI.

### Quality scripts

Current relevant scripts include:

```text
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run test:coverage
npm run test:security
npm run test:docs
npm run secret:scan
npm run docs:check
npm run build
npm run test:e2e
npm run check
```

`npm run check` currently sequences formatting, linting, strict types, Vitest, security-scanner tests, documentation-link-checker tests, repository secret scan, documentation link integrity check, and production build.

### GitHub automation

- CI quality job:
  - dependency installation;
  - formatting check;
  - lint;
  - TypeScript checking;
  - Vitest;
  - secret-scanner tests;
  - documentation-link-checker tests;
  - repository credential-pattern scan;
  - local documentation link check;
  - production PWA build;
  - high-severity production dependency audit;
  - production build artifact upload.
- Separate Playwright E2E job.
- CodeQL JavaScript/TypeScript analysis.
- Dependabot for dependency maintenance.
- Tagged release workflow that re-runs `npm run check` before packaging.
- CI/CodeQL concurrency rules prevent superseded runs from growing indefinitely where configured.

### GitHub repository templates

- Bug reports explicitly warn reporters not to attach exported learner backups, unreadable recovery files, raw local-storage values, profile names, email addresses, credentials, or other private data.
- Pull-request template includes data/security/recovery invariants and verification requirements.
- Existing feature request, funding, release-note, dependency-update, support/security, and repository guidance remain in place.

## Automated test coverage added/expanded

### Domain

- table generation and row budget;
- equation formatting;
- deterministic question generation;
- unsigned seed validation;
- property-based operand/product correctness;
- practice seed helper;
- bounded practice-response validation;
- mastery updates/accuracy/streaks;
- canonical mastery keys;
- difficulty progression;
- deduplicated mistake review;
- progress search/filter/mastered rules;
- worksheet prompt model.

### Infrastructure

- local-storage round trip;
- exported/imported validated state;
- shared size limit;
- duplicate profile rejection;
- blank profile-name rejection;
- application-format timestamp validation;
- impossible mastery-counter rejection;
- noncanonical mastery-key rejection;
- question-answer semantic rejection;
- attempt-correctness semantic rejection;
- correct-attempt-in-mistake-history rejection;
- invalid local-state classification;
- raw unreadable state remains available;
- normal storage-write failure behavior;
- migrations;
- resilient onboarding preferences;
- structured log redaction;
- speech unsupported/supported/failure behavior.

### React integration

- primary generator rendering;
- navigation;
- table input updates;
- solved/blank worksheet switch;
- printable worksheet heading/Name/Date metadata;
- mastery search and filters;
- mistake-review completion behavior;
- unavailable speech fallback;
- local persistence failure alert;
- unreadable local data is preserved until explicit discard;
- recovery controls and disabled normal export during recovery.

### Browser E2E

- table generation;
- blank worksheet mode;
- deterministic practice completion;
- offline profile creation;
- large-text setting;
- unreadable local state is preserved after startup;
- raw unreadable state can be downloaded and the downloaded file contains the original raw value;
- confirmed discard resolves recovery and normal persistence resumes.

### Repository tooling tests

- secret scanner clean ordinary text;
- scanner finds representative credentials/private-key headers;
- scanner finding metadata does not contain matched secret values;
- documentation-link checker extracts local targets while ignoring external/fragment targets;
- documentation-link checker passes existing relative links;
- documentation-link checker reports missing local links.

## Important modules/files added or changed in this continuation

### Domain

- `src/domain/answers.ts`
- `src/domain/answers.test.ts`
- `src/domain/questions.ts`
- `src/domain/questions.test.ts`
- `src/domain/random` functionality is kept in infrastructure while deterministic generation stays domain-owned.
- `src/domain/review.ts`
- `src/domain/review.test.ts`
- `src/domain/progress.ts`
- `src/domain/progress.test.ts`
- `src/domain/tables.ts`
- `src/domain/tables.test.ts`

### Infrastructure

- `src/infrastructure/random.ts`
- `src/infrastructure/random.test.ts`
- `src/infrastructure/browserPreferences.ts`
- `src/infrastructure/browserPreferences.test.ts`
- `src/infrastructure/logger.ts`
- `src/infrastructure/logger.test.ts`
- `src/infrastructure/speech.ts`
- `src/infrastructure/speech.test.ts`
- `src/infrastructure/storage.ts`
- `src/infrastructure/storage.test.ts`

### State

- `src/state/AppStateContext.ts`
- `src/state/AppStateProvider.tsx`
- `src/state/useAppState.ts`

### UI/features

- `src/App.tsx`
- `src/App.test.tsx`
- `src/components/ErrorBoundary.tsx`
- `src/components/StatusBanners.tsx`
- `src/features/tables/TableGenerator.tsx`
- `src/features/practice/PracticeDrill.tsx`
- `src/features/progress/ProgressDashboard.tsx`
- `src/features/settings/SettingsPage.tsx`
- `src/features/about/AboutPage.tsx`
- `src/i18n/en.ts`
- `src/styles.css`
- `src/status.css`

### E2E

- `e2e/smoke.spec.ts`

### Repository scripts

- `scripts/secret-scanner.mjs`
- `scripts/secret-scan.mjs`
- `scripts/secret-scanner.test.mjs`
- `scripts/link-checker.mjs`
- `scripts/link-check.mjs`
- `scripts/link-checker.test.mjs`

### Automation/configuration

- `package.json`
- `eslint.config.js`
- `.github/workflows/ci.yml`
- `.github/ISSUE_TEMPLATE/bug_report.md`
- `.github/pull_request_template.md`

### Documentation

- `README.md`
- `CHANGELOG.md`
- `ROADMAP.md`
- `SECURITY.md`
- `PRIVACY.md`
- `CONTRIBUTING.md`
- `docs/accessibility.md`
- `docs/architecture.md`
- `docs/development.md`
- `docs/performance.md`
- `docs/quality-gates.md`
- `docs/release.md`
- `docs/setup.md`
- `docs/testing.md`
- `docs/troubleshooting.md`
- `docs/user-guide.md`
- `docs/verification-plan.md`
- `docs/adr/0004-preserve-unreadable-local-state.md`
- `docs/verification-checkpoint-v2.md` exists only on the current verification branch as a documentation-only workflow trigger.

## Architecture decisions

Current ADR set:

1. `docs/adr/0001-typescript-react-pwa.md` — TypeScript React PWA primary client.
2. `docs/adr/0002-local-first-persistence.md` — local-first persistence.
3. `docs/adr/0003-deterministic-practice.md` — deterministic seeded practice.
4. `docs/adr/0004-preserve-unreadable-local-state.md` — preserve unreadable local state until explicit recovery.

## Commands/checks and current verification status

### Local/container execution limitation

A previous direct container clone/verification attempt could not resolve `github.com`, so the tool container could not obtain the repository and install its package tree. The container did have a compatible Node 22/npm 10 line, but without repository/package-network access it could not truthfully execute `npm install`, `npm run check`, Playwright, or the dependency audit from a clean clone.

No claim is made that local/container checks passed.

### GitHub executable verification

The fresh release-candidate verification branch is:

```text
chore/final-verification-2026-08-19-v2
```

The fresh pull request is:

```text
#4 chore: run final TableSpark release-candidate verification
```

The verification checkpoint was created only after the current reliability, security, recovery, documentation integrity, accessibility, and test changes were pushed to `main`.

Required conclusions to review on this PR:

- CI `quality`;
- CI `e2e`;
- CodeQL JavaScript/TypeScript analysis.

Do **not** claim those checks passed unless their final GitHub workflow conclusions are fetched and reviewed. If runner capacity/platform state leaves them queued, record that external limitation rather than treating queued as success.

## Repository audit notes

- A repository TODO/FIXME/HACK audit was run during this continuation and did not identify an intentional unfinished core implementation item that should be shipped as a placeholder.
- Core product screenshots are still represented by an editable repository preview illustration; real release browser captures remain a final release/deployment evidence task.
- The application still intentionally has no backend, authentication system, advertising, payments, or mandatory account because those are not required by the chosen local-first learning product.

## Commit identity

Requested repository commit email:

```text
sanskarin@outlook.in
```

Current GitHub commit/branch metadata inspected during this continuation confirms the connector-created repository commits are using the requested author/committer email. Local contributors should still configure the repository-scoped identity explicitly:

```bash
git config user.email "sanskarin@outlook.in"
```

## Persisted-data migration and recovery notes

Current schema version remains `1`; this continuation strengthened validation without changing the stored TypeScript data shape.

Important compatibility rule:

- known future shape changes must increment the schema and include explicit tested migrations;
- unknown malformed state must not be heuristically repaired or automatically overwritten;
- startup invalid state is preserved for recovery;
- imported backup replacement is validated and confirmed;
- raw recovery artifacts can contain personal learner data and must be handled privately.

The storage validator now treats the application-created ISO UTC timestamp format and canonical mastery keys as part of the schema-1 semantic contract.

## Known limitations / non-blocking release items

- Final CI/E2E/CodeQL conclusions for the fresh verification PR must still be reviewed before declaring a verified release candidate.
- A transitive npm `package-lock.json` has not been committed because the available execution environment could not perform a package-network install from a clean checkout. Direct dependencies remain exact-version pinned. A reviewed lockfile generated by a supported networked Node/npm environment remains recommended before a production release if feasible.
- Real browser screenshots have not yet replaced/supplemented the editable interface preview illustration.
- No production static hosting target was specified, so no live deployment was configured.
- Final PWA installability/offline reload must be checked on the eventual secure production origin.
- Browser speech synthesis behavior depends on the platform; TableSpark now provides an explicit unsupported/failure fallback.
- The current desktop distribution is an installable PWA rather than native Windows/macOS/Linux installer packages.
- `main` branch protection is documented but requires repository settings/owner configuration; no connector action available in this workflow was used to impose branch rules automatically.

## Release notes draft — 0.1.0 release candidate

TableSpark 0.1.0 establishes a production-oriented offline-first multiplication learning PWA with custom bounded table generation, printable solved/blank worksheets, random and deterministically replayable practice, timed/untimed drills, difficulty presets, deduplicated mistake review, mastery tracking, searchable progress, offline learner profiles, validated backup/restore, unreadable local-state recovery, persistence-health feedback, themes, classroom accessibility controls, progressive speech support, responsive layouts, comprehensive tests, repository secret scanning, documentation link integrity checks, CodeQL/CI automation, and complete governance/security/privacy documentation.

## Recent meaningful commit messages from this continuation

The continuation intentionally used many small atomic commits. Recent meaningful messages include:

- `security: validate persisted timestamps and profile names`
- `test: cover persisted profile and timestamp validation`
- `test: verify unreadable recovery download contents`
- `test: cover unreadable local data recovery in browser`
- `docs: record unreadable local state recovery decision`
- `fix: preserve unreadable local data until explicit recovery`
- `feat: expose unreadable state recovery controls`
- `feat: surface unreadable local data recovery state`
- `feat: add explicit unreadable local data recovery controls`
- `test: cover unreadable local data recovery workflow`
- `security: validate mastery keys and mistake semantics`
- `fix: bound practice responses to persisted limits`
- `feat: define bounded practice answer validation`
- `test: cover bounded practice answers`
- `fix: distinguish generated drills from mistake reviews`
- `test: cover mistake review completion behavior`
- `refactor: externalize complete English interface copy`
- `feat: add polished printable worksheet header`
- `style: polish progress filters and printable worksheets`
- `security: add repository secret scanning engine`
- `test: cover repository secret scanner`
- `security: add secret scan command`
- `build: add secret scanning quality gates`
- `ci: enforce repository secret scanning`
- `docs: add local documentation link checker`
- `test: cover local documentation link checker`
- `build: add documentation link quality gates`
- `ci: enforce local documentation link integrity`
- `docs: add consolidated quality gate reference`
- `docs: refresh complete TableSpark work handoff`

Git commit hashes should be read directly from the repository history when preparing signed/published release notes; the messages above are the stable handoff identifiers for this continuation.

## Next exact tasks

1. Fetch pull request `#4` head SHA and its GitHub Actions workflow runs.
2. Wait for final `quality`, `e2e`, and CodeQL conclusions only as GitHub itself executes them; do not substitute a queued status for a pass.
3. If any workflow fails, inspect the failed job/step logs, fix the exact root cause on `main`, add/retain a regression test, close the stale verification PR, and create a fresh checkpoint PR from the corrected `main`.
4. Update this file with exact final workflow run IDs/conclusions after they are available.
5. Run the manual release-candidate checklist in `docs/release.md` on a real browser environment, especially keyboard, themes, large text, reduced motion, print preview, unreadable-state recovery, and speech capability fallback.
6. Generate/review a dependency lockfile from a supported networked Node/npm environment if possible; commit it only after reviewing the resolved dependency changes and rerunning quality gates.
7. Capture real release screenshots from the verified production preview/deployment and supplement/replace the repository illustration.
8. Choose/approve a static HTTPS production host, deploy the verified `dist/`, and verify PWA installability plus one offline reload.
9. Only after all release gates are satisfied, finalize `CHANGELOG.md` version entries and create/push the `v0.1.0` tag so the release workflow packages the verified artifact.
