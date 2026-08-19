# TableSpark Repository File Reference

This is the exhaustive tracked-file map for the TableSpark branch at the documentation-completeness checkpoint on 2026-08-19.

The inventory below contains **156 explicitly listed tracked files**. Directories are explained through their files rather than counted as separate tracked-file entries.

Purpose of this document:

- make it possible to audit that no tracked file was skipped in repository documentation;
- help new contributors understand where a change belongs;
- expose cross-file maintenance relationships;
- distinguish source, tests, configuration, automation, assets, policies, and generated output;
- provide a checklist when files are added, removed, renamed, or repurposed.

## Maintenance rule

Whenever a tracked file is added, removed, or renamed, update this reference in the same change series.

This reference explains **what each file is for**. Specialized documents such as `architecture.md`, `domain-model.md`, `state-and-persistence.md`, `security-model.md`, and `ci-cd.md` explain deeper behavior.

Generated/untracked directories such as `node_modules/`, `dist/`, `coverage/`, `playwright-report/`, and `test-results/` are intentionally not part of the tracked-file count.

# 1. Root configuration and repository metadata

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `.editorconfig` | Editor-independent UTF-8/LF/two-space/basic whitespace policy. | Keep consistent with formatting expectations; Markdown intentionally keeps trailing whitespace. |
| `.env.example` | Documents that no secrets/remote services are required and provides a non-secret Vite environment placeholder. | Never place real secrets here; `VITE_` variables are client-visible if used. |
| `.gitattributes` | Git text normalization and binary raster-image classification. | Add new binary formats if Git starts treating them as text. |
| `.gitignore` | Excludes dependencies, builds, coverage, local env files, editor/OS junk, Playwright output, logs. | Do not force-add generated/private files without a documented reason. |
| `.nvmrc` | Pins the preferred Node.js version for Node version managers. | Synchronize with `package.json` engines and GitHub Actions Node versions. |
| `.prettierignore` | Excludes generated assets and selected SVG/CSS files from Prettier. | Review when adding new file types or changing formatting scope. |
| `.prettierrc.json` | Prettier style: single quotes, trailing commas, 100-column width, semicolons. | Keep package formatting scripts aligned with this policy. |
| `eslint.config.js` | Flat ESLint config for Node scripts and strict type-aware TS/React/JSX accessibility rules. | Tool/rule upgrades can change CI; do not broadly suppress accessibility/type issues. |
| `index.html` | Vite HTML entry document and React mount host. | Any external script/meta/network additions need privacy/security review and production testing. |
| `package.json` | Node project manifest: metadata, engine minimums, scripts, runtime/dev dependencies, including the formal `test:docs` gate. | Central synchronized source for commands, version, dependencies, Node requirements and aggregate `check`. |
| `playwright.config.ts` | Playwright Chromium E2E config, production-preview web server, CI retry/worker behavior. | Keep preview port/build command and E2E docs synchronized. |
| `tsconfig.app.json` | Strict browser/application TypeScript project for `src/`. | Schema/i18n/state changes intentionally surface typed fixture/catalog errors here. |
| `tsconfig.json` | Root TypeScript project-reference coordinator. | References app and Node projects used by `tsc -b`. |
| `tsconfig.node.json` | Strict Node/tooling/E2E TypeScript project. | Includes Vite/Vitest/Playwright configs and E2E specs. |
| `vite.config.ts` | Vite React build/dev/preview configuration and PWA manifest/Workbox setup. | Production path/origin/service-worker changes must be reviewed together. |
| `vitest.config.ts` | Vitest jsdom/setup/coverage configuration. | Distinguish jsdom coverage from real-browser E2E behavior. |

# 2. Root public project/policy documents

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `README.md` | Public project landing page, features, quick start, architecture/privacy/testing/documentation links. | Keep concise but accurate; link deep procedures instead of duplicating them. |
| `CHANGELOG.md` | Release-facing record of notable Added/Changed/Security/Accessibility/Fixed work. | Move Unreleased entries into version sections during release preparation. |
| `ROADMAP.md` | Product/refinement direction with completed items and explicit external/manual gates. | Do not mark production/manual evidence complete from source code alone. |
| `PRIVACY.md` | Public local-data, backup, locale, PWA, logging, deletion and no-account/ads statements. | Must match actual storage/network behavior; mismatch is a release blocker. |
| `SECURITY.md` | Vulnerability-reporting policy and public security-control summary. | Keep private reporting contacts/current supported-version policy accurate. |
| `SUPPORT.md` | Support routes and guidance for safe information sharing. | Must not encourage posting raw learner backups/recovery data publicly. |
| `CONTRIBUTING.md` | Contributor workflow/quality/security/documentation expectations. | Update when branch, test, tooling, or commit expectations change. |
| `CODE_OF_CONDUCT.md` | Community participation/conduct policy. | Governance document; review if project community processes change. |
| `LICENSE` | MIT license text governing repository use/distribution. | Do not modify casually; license changes are project-owner/legal decisions. |
| `what_changed.md` | Detailed current implementation/verification handoff ledger. | Update after meaningful work; keep unexecuted external/manual gates explicitly pending. |

# 3. GitHub repository configuration

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `.github/FUNDING.yml` | Configures GitHub repository funding UI. | Funding remains optional and separate from core learning/support. |
| `.github/dependabot.yml` | Weekly npm and GitHub Actions dependency update policy/grouping. | Review cadence/open-PR limits and major/supply-chain changes intentionally. |
| `.github/pull_request_template.md` | Pull-request author/reviewer checklist. | Keep aligned with actual quality, tests, privacy/security and docs expectations. |
| `.github/release.yml` | GitHub generated release-note categories based on labels. | Distinct from the Actions release workflow; update labels/categories together with repo practice. |
| `.github/ISSUE_TEMPLATE/bug_report.md` | Structured bug-report guidance. | Ask for synthetic/redacted reproduction details, never private learner artifacts. |
| `.github/ISSUE_TEMPLATE/config.yml` | Issue-template chooser/blank-issue/contact-link behavior. | Keep security/support routing consistent with `SECURITY.md`/`SUPPORT.md`. |
| `.github/ISSUE_TEMPLATE/feature_request.md` | Feature-request guidance. | Encourage problem/use-case description without collecting sensitive learner data. |

# 4. GitHub Actions workflows

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `.github/workflows/ci.yml` | Main PR/main CI: formatting, lint, types, Vitest, scanner tests/scan, documentation-link gate, build, production audit, build artifact, plus Chromium E2E. | `quality` and `e2e` are recommended required checks; keep Node/actions/scripts/docs synchronized. |
| `.github/workflows/codeql.yml` | Push/PR/weekly JavaScript-TypeScript CodeQL security analysis. | Needs `security-events: write`; real alerts require investigation rather than dismissal for a green check. |
| `.github/workflows/release.yml` | Tag-triggered verification, production build, ZIP packaging, SHA-256 generation and GitHub Release creation. | Tag only verified candidate; checksum is integrity metadata, not a signature. |
| `.github/workflows/visual-evidence.yml` | PR/manual Chromium real-browser screenshot capture and artifact upload. | Human review is still required; screenshots are candidate evidence, not production-origin evidence. |

# 5. VS Code workspace files

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `.vscode/extensions.json` | Recommends ESLint and Prettier extensions. | Editor convenience only; repo checks remain authoritative. |
| `.vscode/settings.json` | Enables format-on-save, workspace Prettier/ESLint flat config and local TypeScript SDK. | Keeps editor diagnostics closer to CI's installed TypeScript/tooling. |

# 6. Architecture Decision Records

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `docs/adr/0001-typescript-react-pwa.md` | Records decision to use a TypeScript/React PWA client architecture. | Historical rationale; current architecture doc describes refinements. |
| `docs/adr/0002-local-first-persistence.md` | Records local-first learner-state persistence decision. | New cloud/backend features require explicit reconsideration rather than silently bypassing it. |
| `docs/adr/0003-deterministic-practice.md` | Records deterministic seeded-practice decision. | Generator changes can affect replay compatibility and need documentation/tests. |
| `docs/adr/0004-preserve-unreadable-local-state.md` | Records preservation of invalid existing local data until explicit recovery. | Critical anti-data-loss invariant; do not regress to automatic overwrite. |

# 7. Main engineering/product documentation

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `docs/accessibility.md` | Accessibility implementation, automated invariants and manual NVDA/Narrator/VoiceOver/TalkBack/print/zoom review matrix. | Never convert unexecuted matrix rows into claimed passes. |
| `docs/architecture.md` | High-level modules, dependency direction, persistence/PWA/i18n/print architecture and decisions. | Update after major module/boundary changes. |
| `docs/data-schema-v2.md` | Field/invariant reference for current persisted schema version 2 and v1 migration. | Executable validator remains source of truth; update when schema changes. |
| `docs/deployment-evaluation.md` | Static-host candidates and owner-approval/production verification gate. | Evaluation does not equal deployment; update once real origin/host is approved. |
| `docs/development.md` | Daily development setup/workflow/coding practices. | Keep commands/toolchain and source-organization guidance current. |
| `docs/git-workflow.md` | Git branch/status/diff/commit/push/PR workflow guidance. | Keep branch/commit conventions aligned with repository policy. |
| `docs/hindi-review-checklist.md` | Fluent/native Hindi terminology, layout, print and assistive-technology manual review checklist. | Automated locale tests do not replace this human-language quality gate. |
| `docs/localization.md` | Locale provider/catalog architecture, language preference storage, adding a locale, testing guidance. | Update supported-locale list/provider/catalog/test procedure together. |
| `docs/native-packaging-evaluation.md` | TWA/Capacitor/native options and current decision to keep PWA canonical. | Re-evaluate only when a real distribution/native capability need exists. |
| `docs/performance.md` | Performance goals, table/session/storage budgets, measurement and optimization rules. | Update when limits/bundle/caching architecture changes. |
| `docs/quality-gates.md` | Merge/release verification expectations, including documentation-link integrity. | Keep synchronized with actual package scripts, CI job/check names and release process. |
| `docs/release-evidence.md` | Candidate evidence recording template for CI, screenshots, accessibility, Hindi, production PWA and artifact checks. | Evidence must be tied to final candidate SHA; pending means not run. |
| `docs/release-notes-template.md` | Structured template for consistent release notes. | Keep aligned with product/change categories and security/privacy communication. |
| `docs/release.md` | Version/tag/quality/build/package/checksum/GitHub Release/post-release/rollback procedure. | Keep artifact names and workflow behavior synchronized. |
| `docs/repository-settings.md` | Recommended main-branch protection/ruleset/check settings. | Required check names must come from real GitHub runs, not guesses. |
| `docs/setup.md` | Development tool installation and upgrade guidance. | Keep supported Node/npm/browser/Playwright instructions current. |
| `docs/testing.md` | Unit/property/integration/security/docs/E2E/accessibility/localization testing strategy and boundaries. | Update when tests/scripts/workflows are added/renamed. |
| `docs/troubleshooting.md` | Setup/build/test/storage/PWA/common failure diagnosis. | Add real recurring failures; remove obsolete tooling instructions. |
| `docs/user-guide.md` | End-user guide to Tables, worksheet composer, Practice, Progress, Settings, backup/recovery, PWA and keyboard behavior. | Must match visible localized product behavior and destructive semantics. |
| `docs/verification-plan.md` | Candidate verification sequence/plan. | Use alongside evidence document; source implementation alone cannot satisfy manual gates. |

# 8. Comprehensive documentation references added by the deep documentation pass

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `docs/commands-reference.md` | Deep explanation of npm, Playwright, security, documentation-link, Git, release/checksum commands and failures. | Update whenever package scripts/commands/toolchain procedures change. |
| `docs/configuration-reference.md` | Explains package/TypeScript/Vite/PWA/Vitest/Playwright/ESLint/Prettier/editor/env/Git/GitHub configuration. | Maintains synchronized-values checklist to prevent config drift. |
| `docs/ci-cd.md` | Complete CI/CodeQL/release/visual-evidence/Dependabot/release-note automation guide. | Update workflow triggers/jobs/permissions/artifacts and branch protection guidance together. |
| `docs/domain-model.md` | Detailed pure domain types, multiplication/practice/mastery/review/session/worksheet invariants and flows. | Update with any mathematical/learning rule or bound change. |
| `docs/state-and-persistence.md` | React state actions, startup classifications, localStorage, migration/import/export/recovery and save-failure lifecycle. | Critical for schema/recovery changes; keep aligned with storage/provider tests. |
| `docs/security-model.md` | Engineering trust boundaries for local input/storage/import, browser APIs, dependencies, Actions, releases and no-backend model. | New network/auth/HTML-rendering/deployment boundaries require explicit update. |
| `docs/maintenance.md` | Recurring dependency/toolchain/schema/i18n/accessibility/PWA/docs/release/incident maintenance handbook. | Use as maintainer operational checklist; `test:docs` is a formal quality gate. |
| `docs/glossary.md` | Defines project/product/engineering/security/release terminology. | Update when introducing terms that have project-specific meaning. |
| `docs/documentation-index.md` | Audience/task navigation and documentation source-of-truth hierarchy. | Add newly created public/deep docs so they remain discoverable. |
| `docs/repository-file-reference.md` | This exhaustive tracked-file inventory. | Must change when any tracked file is added/removed/renamed. |

# 9. Documentation asset

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `docs/assets/interface-preview.svg` | Repository interface preview illustration used by README/documentation. | It is not real release evidence; real captures come from Playwright workflow artifacts. |

# 10. Browser end-to-end tests

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `e2e/accessibility.spec.ts` | Real-browser semantic invariants: landmarks, skip target, form labels, image alts, keyboard shortcut reachability. | Stable automation only; does not replace human screen-reader/WCAG review. |
| `e2e/localization.spec.ts` | Switches to Hindi and verifies navigation/document language/persistence across reload. | Update when locale selector/messages/navigation behavior changes. |
| `e2e/localized-errors.spec.ts` | Verifies important Hindi table/practice/backup error paths do not leak raw English feature messages. | Add critical localized error paths as they are introduced. |
| `e2e/print.spec.ts` | Verifies worksheet/answer-key print media semantics, paper/column state and learner metadata rules. | Complement with manual real print-preview review. |
| `e2e/release-evidence.spec.ts` | Opt-in real-browser light/dark + wide/compact screenshot capture. | Normally skipped unless `CAPTURE_RELEASE_EVIDENCE=1`; artifact must be manually reviewed. |
| `e2e/smoke.spec.ts` | Core browser journey covering table/worksheet, deterministic practice, profiles/accessibility and unreadable-state recovery. | Keep the primary user flow representative without making one test cover every feature. |

# 11. Public static asset

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `public/logo.svg` | TableSpark runtime/manifest/app logo served as static asset. | Used by UI/PWA manifest; path/purpose changes affect install/build/docs. |

# 12. Repository utility scripts

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `scripts/link-check.mjs` | CLI entry that runs local repository Markdown link checking. | Invoked by formal `npm run test:docs`, which is part of `npm run check` and CI/release verification. |
| `scripts/link-checker.mjs` | Dependency-free implementation for extracting/validating repository-local Markdown links. | Keep behavior deterministic/offline for local paths; parser changes need tests. |
| `scripts/link-checker.test.mjs` | Node tests for link-checker implementation. | Also run by `npm run test:docs`; update before expanding Markdown/path syntax handling. |
| `scripts/secret-scan.mjs` | CLI entry that scans repository files using the secret-scanner implementation. | Scanner is defense in depth; never use it to justify committing real secrets. |
| `scripts/secret-scanner.mjs` | Dependency-free supported credential-pattern detection/redacted finding logic. | Add specific patterns carefully and never echo matched secret values. |
| `scripts/secret-scanner.test.mjs` | Node tests for scanner detections/redaction behavior. | Use synthetic fake credential samples only. |

# 13. Application shell and top-level integration tests

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `src/App.tsx` | Main application shell: header/profile chip, primary view navigation, theme application, keyboard shortcuts/dialog and feature rendering. | Cross-cutting UI changes affect accessibility/localization/navigation tests. |
| `src/App.test.tsx` | Integration coverage for default render/navigation/table composer/progress/review/speech/storage recovery/failure behavior. | Keep broad application regressions here without duplicating all domain tests. |
| `src/main.tsx` | Browser bootstrap: PWA service-worker registration/events, CSS imports, Locale/ErrorBoundary/AppState provider mounting. | Runtime initialization order matters; production PWA changes require E2E/build verification. |

# 14. Shared cross-cutting React components

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `src/components/ErrorBoundary.tsx` | Catches unexpected React UI errors, logs redacted technical metadata and presents localized reload fallback. | Must not intentionally clear learner storage as part of UI recovery. |
| `src/components/StatusBanners.tsx` | Displays storage/recovery/offline/offline-ready/update/install/onboarding notices and browser/PWA event handling. | Status roles/copy/user-controlled update/install behavior require accessibility/localization tests. |
| `src/components/StatusBanners.test.tsx` | Regression coverage for PWA update deferral/apply, offline-ready and browser install prompt behaviors. | Update when banner actions/lifecycle events change. |

# 15. Domain: answers

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `src/domain/answers.ts` | Defines/validates supported bounded integer practice responses. | Keep response bounds compatible with question/product/storage constraints. |
| `src/domain/answers.test.ts` | Tests accepted/rejected practice response bounds. | Change together with product numeric-range changes. |

# 16. Domain: difficulty

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `src/domain/difficulty.ts` | Defines Starter/Foundation/Builder/Fluency/Challenge min/max/count preset metadata. | Visible localized labels live in catalogs; avoid leaking English domain descriptions into Hindi UI. |
| `src/domain/difficulty.test.ts` | Validates difficulty preset bounds/progression/shape. | Update when presets/ranges/counts change. |

# 17. Domain: mastery

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `src/domain/mastery.ts` | Applies attempts to canonical fact stats, streaks, bounded mistakes and computes fact/profile accuracy. | Must preserve profile session/goal metadata and canonicalization. |
| `src/domain/mastery.test.ts` | Tests counters, streak reset, mistakes, accuracy and schema-2 profile metadata preservation. | Add regressions at this layer for mastery math/state bugs. |

# 18. Domain: progress

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `src/domain/progress.ts` | Defines transparent mastery rule, search normalization, All/Needs practice/Mastered filtering and ordering. | UI/user docs must match the same 3-attempt/90% rule. |
| `src/domain/progress.test.ts` | Tests mastery classification, query normalization/filtering/order. | Update with any rule/search semantics change. |

# 19. Domain: questions

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `src/domain/questions.ts` | Validates generated-practice settings, deterministic `mulberry32` sequence, question construction and canonical mastery keys. | Seed algorithm changes affect historical replay expectations; PRNG is not cryptographic. |
| `src/domain/questions.test.ts` | Deterministic/bound/property-based tests for generation/seed/ranges/mathematics. | Preserve reproducibility tests if generator implementation changes intentionally. |

# 20. Domain: mistake review

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `src/domain/review.ts` | Builds newest-first deduplicated mistake-review questions using canonical commutative keys. | Review sessions are not seeded generated sessions; summary seed remains null. |
| `src/domain/review.test.ts` | Tests count bounds and unique commutative fact selection. | Keep if recent-mistake ordering/dedup policy changes. |

# 21. Domain: session history/goals

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `src/domain/sessions.ts` | Defines retention options/default/hard max, goal max and newest-first session trim/prepend helpers. | Synchronized with Settings, storage validation, privacy/schema docs and tests. |
| `src/domain/sessions.test.ts` | Tests supported retention values, prepend bounding and trimming. | Update when retention policy changes. |

# 22. Domain: multiplication tables

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `src/domain/tables.ts` | Validates table ranges/positive step/5,000-row budget, generates solved rows and formats equations. | Row-budget/numeric changes affect UI, print performance and tests/docs. |
| `src/domain/tables.test.ts` | Tests range/order/step/invalid configurations and render budget. | Add regression here for generation math/termination issues. |

# 23. Domain: types

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `src/domain/types.ts` | Immutable shared types for tables, questions, attempts, mastery, sessions, profiles, settings and persisted schema 2. | Persisted type changes require migration + validator + docs/test review, not just compilation. |

# 24. Domain: worksheet model

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `src/domain/worksheet.ts` | Converts table rows into prompt/answer/solved worksheet items with line/box/space blank styles. | Presentation must not alter mathematical answer; add new blank modes to UI/i18n/tests. |
| `src/domain/worksheet.test.ts` | Tests worksheet prompt/answer/blank formatting. | Keep aligned with printable composer behavior. |

# 25. Feature: About

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `src/features/about/AboutPage.tsx` | Localized project/version/license/privacy/contact/source/funding information. | Contact/version/privacy/funding claims must stay synchronized with repository metadata/policies. |

# 26. Feature: Practice

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `src/features/practice/PracticeDrill.tsx` | Practice setup/presets/seeds/timed mode/questions/answers/speech/mistake review/completion and session recording. | Coordinates many domain/state/i18n rules; use localized generic failures instead of raw English domain messages. |

# 27. Feature: Progress

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `src/features/progress/ProgressDashboard.tsx` | Shows profile metrics, optional goal, searchable/filterable mastery, recent sessions and mistakes. | Mastery/goal labels must match domain rule and current locale; session dates use active locale. |

# 28. Feature: Settings

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `src/features/settings/SettingsPage.tsx` | Language/theme/accessibility/practice defaults, session retention, goals, profiles, backup/recovery/reset/update-about controls. | Primary destructive/privacy UI; confirmations, file input labels, validation and locale behavior require regression coverage. |

# 29. Feature: Tables/print

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `src/features/tables/TableGenerator.tsx` | Table range controls, worksheet composer, study/practice/answer-key rendering, print metadata, speech controls. | Must respect domain row budget, localized validation, profile-name print privacy and print E2E. |

# 30. Internationalization core

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `src/i18n/LocaleContext.tsx` | Central React locale provider selecting catalog, persisting locale and updating document `lang`. | New locales must be wired here and tested across reload/accessibility. |
| `src/i18n/messages.ts` | Composes English source catalog and exports structural `MessageCatalog` type. | All translated catalogs must satisfy this structure. |
| `src/i18n/types.ts` | Type utility widening literal English messages/functions into reusable catalog shape. | Type-level localization infrastructure; changes can affect all catalogs. |
| `src/i18n/en.ts` | Primary English product copy for shell/status/errors/tables/practice/progress/settings/about. | New user-facing feature copy belongs in typed catalogs. |
| `src/i18n/hi.ts` | Complete Hindi catalog matching message structure. | Needs automated parity plus fluent/native review for release-quality terminology. |
| `src/i18n/learning.ts` | English copy specifically for session-history/goal learning-record UI. | Composed into English catalog; Hindi equivalents are in Hindi catalog. |
| `src/i18n/pwa.ts` | English optional PWA install-prompt copy. | Keep installation optional/non-account/coercion-free in every locale. |
| `src/i18n/shortcuts.ts` | English keyboard-shortcut reference copy/functions. | Keep shortcut descriptions synchronized with actual App keyboard behavior. |
| `src/i18n/localePreference.ts` | Supported locale list plus resilient localStorage read/write and browser-language fallback. | Locale preference intentionally remains outside learner backups. |

# 31. Internationalization tests

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `src/i18n/catalogParity.test.ts` | Runtime structural parity + nonblank static Hindi message checks. | Complements TypeScript; does not judge translation quality. |
| `src/i18n/localePreference.test.ts` | Tests supported locale recognition, stored/browser fallback and blocked-storage behavior. | Keep deterministic by controlling navigator/storage in tests. |
| `src/localization.test.tsx` | Integration tests for English→Hindi switch, document language, persistence and backup-key separation. | Update when selector/provider/storage behavior changes. |

# 32. Browser-preference infrastructure

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `src/infrastructure/browserPreferences.ts` | Safe read/write helpers for non-critical boolean browser preferences such as onboarding dismissal. | Storage failures must remain non-fatal. |
| `src/infrastructure/browserPreferences.test.ts` | Tests preference read/write and blocked-storage resilience. | Preserve failure-containment behavior. |

# 33. Install-prompt infrastructure

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `src/infrastructure/installPrompt.ts` | Runtime type guard/interface for browser install-prompt event capability. | Never assume every browser supports install prompt; keep feature optional. |
| `src/infrastructure/installPrompt.test.ts` | Tests ordinary/non-callable/callable prompt event recognition. | Update if browser API adapter shape intentionally changes. |

# 34. Logging infrastructure

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `src/infrastructure/logger.ts` | Structured technical logger with sensitive key/value redaction. | Do not log learner data first and rely on redaction; recovery raw text stays out of logs. |
| `src/infrastructure/logger.test.ts` | Tests logger redaction/technical event behavior. | Add regressions for newly recognized sensitive value classes without real secrets. |

# 35. Persistence migration infrastructure

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `src/infrastructure/migrations.ts` | Current schema version and explicit schema-1→2 candidate transformation. | New persisted schema requires a new explicit migration path, not heuristic repair. |
| `src/infrastructure/migrations.test.ts` | Tests current passthrough, v1→v2 migration and unknown/malformed version rejection. | Include realistic old-state fixtures for future versions. |

# 36. PWA lifecycle infrastructure

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `src/infrastructure/pwaEvents.ts` | Defines/dispatches decoupled update-ready/offline-ready window events from service-worker callbacks. | UI listeners live in StatusBanners; callback must not force-update automatically. |
| `src/infrastructure/pwaEvents.test.ts` | Tests lifecycle event dispatch and update callback is passed without automatic invocation. | Protects non-blocking update semantics. |

# 37. Practice seed infrastructure

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `src/infrastructure/random.ts` | Creates valid practice seeds from random source for new generated sessions. | Security is not its purpose; deterministic generator remains in domain. |
| `src/infrastructure/random.test.ts` | Tests bounded seed generation with injectable deterministic randomness. | Avoid tests depending on real `Math.random()` output. |

# 38. Speech infrastructure

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `src/infrastructure/speech.ts` | Feature-detects browser speech synthesis and safely speaks text when available. | Browser exceptions must be non-fatal; platform voices/privacy vary. |
| `src/infrastructure/speech.test.ts` | Tests available/unavailable/failure behavior. | Keep learning workflows independent of audio support. |

# 39. Storage/import infrastructure

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `src/infrastructure/storage.ts` | Zod structural/semantic schema validation, byte/profile bounds, local read/write/classification, raw recovery, import/export/clear. | Major trust boundary; persisted/import changes require migration/security/privacy tests/docs. |
| `src/infrastructure/storage.test.ts` | Comprehensive schema/storage/import/semantic/corruption/write-failure/clear tests. | Add regression first for persistence/data-integrity issues. |

# 40. App-wide integration tests

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `src/keyboardShortcuts.test.tsx` | Tests shortcut dialog open/close and editable-field `?` guard. | Extend with focus management/shortcut behavior regressions as needed. |
| `src/learningRecords.test.tsx` | Tests completed-session persistence, optional goal UI and retention trimming. | Protects cross-feature schema-2/state behavior. |

# 41. Application state layer

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `src/state/AppStateContext.ts` | Defines typed state/context action API exposed to features. | Add state mutations here instead of letting features write persistence directly. |
| `src/state/AppStateProvider.tsx` | Loads/classifies state, constructs defaults, auto-saves, applies profile/settings/attempt/session/goal/import/recovery/reset transitions. | Cross-layer invariant coordinator; preserve unreadable-state save pause. |
| `src/state/useAppState.ts` | Safe hook for consuming AppStateContext and rejecting use outside provider. | Keep feature state access centralized/typed. |

# 42. Stylesheets

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `src/styles.css` | Main design tokens/layout/components/themes/responsive/print styles for application and worksheet output. | Review light/dark/compact/wide/large-text/print/Hindi; currently excluded from Prettier. |
| `src/status.css` | Status/recovery/PWA/fatal-error banner/panel styles and responsive behavior. | Status content must remain visible/usable on narrow layouts; currently excluded from Prettier. |
| `src/shortcuts.css` | Keyboard shortcut dialog/backdrop/list/kbd/responsive styling. | Maintain modal readability/focus visibility and mobile layout. |
| `src/learning.css` | Mastery goal/recent-session/learning-record responsive styling. | Review long localized strings and mobile collapse behavior. |

# 43. Test environment/type declarations

| File | Purpose | Important maintenance relationship |
| --- | --- | --- |
| `src/test/setup.ts` | Shared Vitest/jsdom setup/polyfills/matchers needed before application tests. | Changes affect all jsdom tests; keep browser mocks minimal and explicit. |
| `src/vite-env.d.ts` | Vite client TypeScript declaration inclusion. | Type-only file; normally changes only with Vite/client env typing needs. |

# 44. Cross-file relationship checklist

When changing one of these concepts, review the listed files/categories rather than editing only the first obvious file.

## App version

Review:

- `package.json`;
- visible English/Hindi About/settings version copy;
- changelog/release notes;
- README/release docs where version-specific.

## Node version

Review:

- `.nvmrc`;
- `package.json` engines;
- all Actions setup-node steps;
- setup/configuration/command docs.

## Persistence schema

Review:

- `src/domain/types.ts`;
- migrations/storage/provider;
- related tests/fixtures;
- schema/state/privacy/security/user docs;
- changelog/handoff.

## Mastery rule

Review:

- `src/domain/progress.ts` + tests;
- Progress UI/copy;
- user/domain docs;
- Hindi text;
- goals if interpretation changes.

## Practice generator

Review:

- questions/random/practice feature;
- deterministic/property/E2E tests;
- session replay semantics;
- user/domain docs.

## Worksheet/print

Review:

- table/worksheet domain;
- TableGenerator;
- styles;
- print E2E;
- user/accessibility/Hindi review docs.

## Locale

Review:

- supported locale preference;
- provider/catalogs;
- localization/catalog parity/integration/E2E;
- document language/accessibility;
- user docs.

## PWA lifecycle

Review:

- Vite config;
- `main.tsx`;
- PWA event/install adapters;
- StatusBanners/copy/tests;
- E2E/release/deployment docs.

## Documentation quality gate

Review:

- `package.json` `test:docs`/`check`;
- `scripts/link-check*.mjs`;
- CI `quality` step;
- commands/testing/quality/CI/maintenance docs.

The link gate verifies local references. The tracked-file map must still be manually/automatically compared with a recursive Git file list for completeness.

## CI/job names

Review:

- workflow YAML;
- CI/CD/quality/testing docs;
- branch protection/ruleset settings.

# 45. Files intentionally not tracked

These are normal generated/local paths and should not be added to this tracked-file inventory unless repository policy intentionally changes:

```text
node_modules/
dist/
coverage/
.vite/
playwright-report/
test-results/
*.tsbuildinfo
.env
.env.local
.env.*.local
*.log
```

Their absence is controlled primarily by `.gitignore`.

# 46. Completeness verification procedure

When maintaining this file:

1. obtain a recursive Git tree for the intended branch/commit;
2. collect every entry with `type: blob` (tracked files);
3. compare those paths against this reference;
4. add/remove/rename entries as necessary;
5. verify documentation index links for new docs;
6. run `npm run test:docs` against an actual checkout;
7. record the completeness update in `what_changed.md`.

A directory listing alone is not sufficient because nested files can be missed. Use the recursive tree or equivalent `git ls-files` from a real checkout.

Local checkout alternative:

```bash
git ls-files
```

Count tracked files:

```bash
git ls-files | wc -l
```

On PowerShell:

```powershell
(git ls-files).Count
```

At this documentation checkpoint, this reference lists **156 tracked files**. Future commits can legitimately change the count; update this document rather than preserving the number artificially.
