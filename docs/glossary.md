# TableSpark Glossary

This glossary defines product, learning, persistence, accessibility, PWA, testing, Git, and release terms as they are used in this repository. It is intended to reduce ambiguity across code reviews, documentation, issues, and future continuation work.

## A

### Accessibility
Design and implementation practices that make TableSpark usable by people with different visual, motor, cognitive, and assistive-technology needs. In this repository it includes semantic controls, labels, keyboard operation, focus visibility, large text, reduced motion, language metadata, screen-reader review, responsive layouts, and accessible status/error messages.

Accessibility automation does not prove full WCAG conformance; manual assistive-technology review remains a release-quality activity.

### Active profile
The local learner profile whose mastery, mistakes, session history, and optional goal are currently displayed/updated.

The top-level persisted state stores `activeProfileId`, which must reference an existing profile.

### Answer key
A printable worksheet output mode showing solved multiplication equations. Unlike learner-facing study/practice sheets, the answer-key header omits blank Name/Date learner metadata.

### Attempt
One recorded response to one practice question, including the question, learner response, correctness, timestamp, and elapsed time.

### Audit
In release/CI context, usually `npm audit --omit=dev --audit-level=high`, which checks npm advisory metadata for high/critical findings affecting production dependencies. A clean audit does not prove all dependencies are secure.

## B

### Backup
A validated JSON export of current learner state. It can contain profile names, mastery, mistakes, session summaries, goals, and settings. The separate interface locale preference is not included.

A backup is personal data and should be reviewed before sharing.

### Base branch
The branch a pull request proposes to merge into. Current TableSpark feature work generally targets `main`.

### Browser preference
A small local setting stored separately from learner-state JSON, such as onboarding dismissal or interface locale.

### Build
The production compilation/bundling operation:

```bash
npm run build
```

It runs strict TypeScript build mode and Vite production build, producing `dist/`.

## C

### Canonical mastery key
The normalized identity of a commutative multiplication fact. The smaller operand is placed first.

Example:

```text
4 × 7 → 4x7
7 × 4 → 4x7
```

Both orientations update one mastery record.

### Check / quality gate
An automated verification step whose failure blocks confidence/release. `npm run check` is the local aggregate check; GitHub CI adds E2E and production dependency auditing as separate steps/jobs.

### CI
Continuous Integration. The `.github/workflows/ci.yml` workflow runs formatting, lint, types, application tests, security scanner tests, secret scan, build, production audit, and Chromium E2E for relevant pushes/PRs.

### CodeQL
GitHub code-scanning/static-analysis workflow used for JavaScript/TypeScript security analysis.

### Commit
An immutable Git snapshot plus metadata/message. TableSpark prefers small focused commits so review/history explains why each change exists.

### Compact layout
A narrow/mobile-sized UI layout, often tested around 390 CSS pixels and manually near 320 CSS pixels where practical.

### Concurrency cancellation
GitHub Actions behavior that cancels an older in-progress run when a newer run for the same workflow/ref supersedes it. A cancelled old run is not evidence for the newest commit.

### Correct-answer streak
For one canonical multiplication fact, the number of consecutive correct attempts since the last incorrect attempt. It is **not** a daily-login/engagement streak.

### CSP (Content Security Policy)
A browser security policy delivered by HTTP headers/meta that can restrict script/style/network sources. TableSpark does not currently define a production-host CSP in repository source because the final hosting layer is not yet activated. If a production host adds CSP, document/test it with PWA behavior.

## D

### Dark theme
One of TableSpark's display themes. It can be explicitly selected or selected through system theme behavior.

### Dependabot
GitHub automation configured to propose npm and GitHub Actions dependency updates on a weekly schedule.

### Deterministic practice
Practice question generation where identical validated seed/range/count values produce the same sequence under the current generator algorithm.

### Development server
Vite source-development server, normally at port 5173. It is not equivalent to a production build/preview and should not be used as final release evidence.

### Difficulty preset
A transparent practice setup shortcut defining a min/max fact range and question count. Presets are Starter, Foundation, Builder, Fluency, Challenge; users can still edit values.

### Domain layer
Pure/reusable product/math rules under `src/domain/`. It should not depend on React or browser storage.

### Draft pull request
A GitHub PR marked as not yet ready for normal merge/review completion. PR #4 has been used as a draft implementation/verification checkpoint during the current work.

## E

### E2E (End-to-End test)
A Playwright test that runs the built application in a real Chromium engine, covering integrated browser behavior such as navigation, print media, localization, or accessibility invariants.

### ES module / ESM
JavaScript module system using `import`/`export`. `package.json` declares `"type": "module"`.

### ES2022 / ES2023
ECMAScript language/library targets used by build/TypeScript configuration. Application production build targets ES2022; Node/tooling TypeScript uses ES2023 libraries.

### Evidence
A concrete recorded result tied to a particular candidate, such as a workflow run, screenshot artifact, checksum verification, or manually recorded assistive-technology test. Source code alone is not evidence that a manual/external behavior passed.

### Export
Creating a JSON backup from current validated learner state.

## F

### Fact
A multiplication relationship between two operands, such as 4 × 7. In mastery tracking, commutative orientations share one canonical fact.

### Feature module
A user-facing module grouped by intent under `src/features/`: tables, practice, progress, settings, about.

### Fluent/native Hindi review
Human language-quality review of the Hindi interface. Type checking and browser tests can ensure coverage/behavior but cannot certify natural terminology.

### Focus management
Keyboard-accessibility behavior controlling where focus moves when UI such as a modal/dialog opens/closes. Proper dialog behavior includes focus entry, containment where appropriate, escape/dismissal, and return to the opener.

## G

### Generated drill
A seeded practice session produced from min/max/count/seed settings. Its completed session summary retains the replay seed.

### GitHub Actions artifact
A file/directory uploaded by a workflow for later inspection/download. CI build output and visual-evidence screenshots are artifacts; an artifact is not automatically a deployment/release.

### Goal / mastered-facts goal
An optional per-profile target number of mastered facts. It has no deadline, daily streak requirement, ranking, penalty, or notification pressure.

## H

### Head branch / head SHA
The source branch and exact latest commit of a pull request. Verification must be associated with the final head SHA; checks from an older head do not prove the newest changes pass.

### Hindi locale (`hi`)
The included Hindi interface catalog. The locale provider updates the root document language to `hi` and stores the selection separately from learner backup state.

## I

### Import
Reading a selected backup JSON as untrusted input, applying size/version/migration/validation checks, then replacing current learner state only after success and user confirmation.

### Install prompt
Browser-provided `beforeinstallprompt` capability used to offer optional PWA installation. TableSpark cannot guarantee every browser provides it and does not fabricate installability.

### Integration test
A test that exercises multiple components/state boundaries together, commonly through Testing Library/jsdom, but without necessarily running a real browser engine.

### Integrity checksum
The SHA-256 digest published alongside `tablespark-web.zip`. It can confirm downloaded bytes match the workflow-produced ZIP digest. It is not a publisher digital signature.

### Invalid/unreadable stored state
A local learner-state value that exists but cannot safely pass read/size/parse/migration/validation. It is preserved rather than treated as empty.

## J

### jsdom
A JavaScript DOM implementation used by Vitest tests. It provides browser-like DOM APIs but is not a full browser engine/service-worker/print/PWA environment.

### JSX accessibility rule
An ESLint `eslint-plugin-jsx-a11y` rule that checks common accessibility semantics in JSX source.

## K

### Keyboard shortcut reference
In-app dialog listing optional shortcuts such as Alt+1…Alt+5, `?`, and Escape behavior. Shortcuts supplement rather than replace normal keyboard navigation.

## L

### Large-text classroom mode
Accessibility preference increasing the root text scale for easier classroom/learner reading.

### Learner-facing sheet
Solved study sheet or practice worksheet intended to be given to a learner. It includes blank Name/Date print metadata but does not automatically insert the active local profile name.

### Least privilege
Security principle of granting only permissions needed for a task. GitHub workflows use scoped token permissions rather than broad write access.

### Light theme
Explicit light display theme.

### Local-first
Architecture where core learning state/functionality lives in the browser and does not require an online account/backend for normal use.

### LocalStorage
Browser origin-scoped key/value storage used for learner state and small preferences. It is persistent but treated as untrusted on read and is not encrypted secure storage.

### Locale
The selected interface language identifier, currently `en` or `hi`.

### Locale provider
React context/provider that selects the active typed message catalog, exposes locale switching, persists the preference, and updates document language metadata.

## M

### Main branch
The repository's primary integration branch. Feature work should generally reach `main` through verified pull requests rather than unreviewed direct changes where protection is enabled.

### Mastered fact
A canonical fact with at least 3 attempts and at least 90% rounded mastery accuracy under the current transparent rule.

### Mastery percentage
Rounded `correct / attempts × 100` for one canonical fact.

### Mastery stat
Per-fact aggregate containing attempts, correct count, consecutive correct streak, and latest attempt time.

### Migration
Explicit transformation from a known older persisted schema into the current candidate schema before normal validation. Current migration supports schema 1 → 2.

### Mistake review
Practice session built from recent incorrect attempts, deduplicated by canonical commutative fact. It is not generated from a replay seed and persists `seed: null` in its session summary.

### Mock screenshot
An illustration or manually drawn preview that resembles UI but is not evidence of a real browser rendering. TableSpark docs distinguish the repository preview SVG from real release screenshots.

## N

### `node_modules/`
Generated local directory containing installed npm dependencies. It is ignored by Git and should not be committed.

### Non-blocking update
PWA behavior that announces an available service-worker update but lets the user choose when to reload instead of interrupting an active task automatically.

## O

### Offline-first
Design where core workflows can continue without network after the necessary app assets have been loaded/cached. It does not mean initial download or external links work without internet.

### Offline-ready
Service-worker lifecycle state indicating the current application shell is cached for offline use on that device/browser context.

### Optional funding
Buy Me a Coffee/GitHub funding links. Funding is never required for core learning, security reporting, privacy support, or application access.

## P

### Persistence
Saving validated application state from React memory into browser storage so it can survive reload.

### Persistence available
Runtime flag indicating the latest normal local save succeeded. A failed write leaves in-memory state usable but not necessarily durable.

### Practice worksheet
Printable output where answers are replaced by the selected writing-line/box/open-space blank.

### Preview server
Vite server for already-built `dist/`, normally port 4173. Playwright uses it to test production output.

### Production origin
The final approved HTTPS URL from which the app is deployed. It is not currently activated merely by repository code. PWA installability/scope must be verified on the real origin.

### Profile
Local learner record containing identity label, mastery, mistakes, session history, and optional goal. It is not an authenticated web account.

### Progressive enhancement
Approach where optional browser capabilities (speech/install prompt) enhance experience when available but core learning remains usable without them.

### Pseudo-random number generator (PRNG)
Deterministic generator used for seeded practice. It is suitable for reproducibility, not cryptographic security.

### Pull request (PR)
GitHub change proposal from a head branch to a base branch, with diff, review conversation, and automated checks.

### PWA (Progressive Web App)
Web application with manifest/service-worker/install/offline capabilities supplied by supported browsers/platforms.

## Q

### Quality job
CI job that runs formatting, lint, TypeScript, Vitest, scanner tests, repository secret scan, production build, production dependency audit, and uploads `dist/`.

### Question count
Number of questions in a generated/review practice session. Supported domain/persistence range is 1–200.

## R

### Raw recovery artifact
Exact unreadable learner-state localStorage string downloaded as text for private recovery/inspection. It is not a validated backup and should not be publicly shared without review/redaction.

### Recovery state
Application mode entered when an existing learner-state value is unreadable. Automatic learner-state persistence pauses until the user imports a valid replacement or explicitly discards the raw value.

### Reduced motion
Accessibility preference minimizing animation/transition duration so motion is not required to understand state.

### Regression test
Automated test added to reproduce a bug/unsafe behavior and prevent it from silently returning later.

### Release
Published version/tag plus packaged artifact(s) and release notes. A branch/PR build is a release candidate, not automatically a release.

### Release candidate
Specific commit being evaluated for release. Once candidate evidence begins, changing the commit invalidates evidence tied to the previous SHA.

### Release evidence
Automated/manual records proving a candidate was actually checked: CI, CodeQL, browser screenshots, accessibility/Hindi review, production PWA checks, checksum verification, etc.

### Render budget
Maximum number of table/worksheet rows the domain permits for one generated configuration. Current value: 5,000.

### Retention
Maximum number of recent session summaries kept per profile. Supported choices: 10, 25, 50, 100; default 25.

### Rollback
Restoring/redeploying a previously known-good artifact after a faulty deployment. Public release tags should not be silently moved as a rollback mechanism.

## S

### Schema
Formal persisted-data shape and validation contract. Current `PersistedState` schema version is 2.

### Schema version vs storage-key version
The learner key remains `tablespark.state.v1`, while JSON inside uses `schemaVersion: 2`. The two versions are separate; changing the data schema does not automatically require changing the storage key.

### Secret
Credential/private value that grants access or authority, such as tokens, private keys, passwords, or API credentials. Real secrets must never be committed to this client repository.

### Secret scanner
Dependency-free repository utility that detects a bounded set of recognizable credential patterns and reports finding metadata without echoing matched values.

### Seed
Unsigned 32-bit integer controlling deterministic generated-practice question order. Current allowed range: 0–4,294,967,295. It is not a security secret.

### Semantic validation
Validation beyond field type/shape. Examples: multiplication answer matches operands; active profile exists; correct count cannot exceed attempts; generated session has a seed.

### Service worker
Browser background script generated/configured through PWA tooling that caches application assets and participates in offline/update lifecycle.

### Session summary
Compact newest-first record of a completed practice session containing kind/mode/time/count/score/duration and generated seed when applicable.

### Solved study sheet
Printable learner-facing output showing completed equations plus blank Name/Date paper metadata.

### Source map
Build artifact mapping optimized JavaScript back to source for debugging. Production source maps are currently enabled; the repository is open source.

### Strict TypeScript
Compiler settings that reject broader classes of unsafe/ambiguous code/data assumptions. TableSpark additionally enables options such as unchecked-index and exact-optional-property checks.

### Structured logging
Technical event logging using named fields rather than arbitrary learner-content strings. The logger applies sensitive-key/value redaction as defense in depth.

### System theme
Appearance mode following the OS/browser `prefers-color-scheme` result.

## T

### Table
In TableSpark, usually a multiplication table for one multiplicand across a multiplier range.

### Table step
Positive interval between generated tables. Example: 2–10 step 2 → 2,4,6,8,10.

### Temporary in-memory default state
Default state used to keep the UI operable while an unreadable existing local value is preserved. It must not be automatically saved over the unreadable value.

### Test fixture
Synthetic data constructed for automated tests. Fixtures should never use real learner data or real secrets.

### TWA (Trusted Web Activity)
Android wrapper approach that can display a verified web origin as an app. TableSpark has evaluated it but keeps the PWA as canonical until a real Android distribution requirement/production origin exists.

### Type guard
Function that validates/narrows a value's TypeScript type at runtime, such as checking supported locale or install-prompt shape.

## U

### Untrusted input
Data that must be validated rather than assumed correct. Backups and localStorage are explicitly untrusted; browser form constraints alone do not make data trusted.

### Untimed mode
Practice mode with no countdown.

### Update-ready
PWA lifecycle state indicating a newer service-worker/app version is waiting/available. TableSpark surfaces a non-blocking choice to reload now or later.

## V

### Validation boundary
A point where untrusted data is checked before entering trusted typed/application state. The storage/import Zod parser is a major validation boundary.

### Version tag
Git tag such as `v0.1.0` matching the release workflow trigger. Tags should point to verified immutable release commits.

### Visual evidence
Real browser screenshots captured automatically from the built application in light/dark and compact/wide contexts, then manually reviewed.

### Vite
Development/build tool used for source serving, production bundling, preview, React integration, and PWA plugin execution.

### Vitest
Unit/integration test runner configured with jsdom for application tests.

## W

### WCAG
Web Content Accessibility Guidelines. TableSpark uses accessibility practices/tests, but automated checks alone do not justify claiming WCAG conformance.

### Wide layout
Desktop-size UI layout, used alongside compact captures during visual release evidence.

### Workbox
Service-worker tooling used through `vite-plugin-pwa` to precache static assets and provide navigation fallback.

### Workflow
GitHub Actions YAML automation under `.github/workflows/`.

### Worksheet composer
Tables feature controls that select solved/practice/answer-key output, answer blank style, paper size, and print column count without changing multiplication math.

## X

### XSS (Cross-Site Scripting)
Security issue where untrusted content becomes executable HTML/script. TableSpark currently renders learner/imported strings through React text/value binding and does not intentionally render user-controlled raw HTML.

## Z

### Zod
Runtime schema-validation library used to validate persisted/imported learner state. TypeScript interfaces disappear at runtime; Zod enforces data shape/semantics when untrusted JSON enters the app.

# Common distinctions

## “Local” does not mean “encrypted”

Learner state stays in browser storage by default, but localStorage is not an encrypted vault. Device/browser/profile compromise can expose local data.

## “Offline-first” does not mean “never needs internet”

Initial app download, external links, GitHub, email, funding pages, and updates require connectivity. Cached core workflows can continue offline afterward.

## “Checksum” does not mean “signature”

SHA-256 proves byte comparison against a known digest, not signer identity.

## “Seeded” does not mean “secure random”

Practice seed randomness is for varied/reproducible learning, not security.

## “Streak” does not mean “daily engagement streak”

The stored mastery streak is consecutive correctness on a fact, reset by an incorrect attempt. TableSpark does not currently punish missed days.

## “Profile” does not mean “account”

Profiles are local learner buckets; there is no required login/account backend.

## “Pass” does not mean “source looks correct”

A gate is passed only when its actual test/review was executed for the relevant candidate and recorded.
