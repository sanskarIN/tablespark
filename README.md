<p align="center">
  <img src="public/logo.svg" width="112" height="112" alt="TableSpark logo" />
</p>

<h1 align="center">TableSpark</h1>

<p align="center"><strong>Generate multiplication tables, compose printable worksheets, run replayable drills, review mistakes, and build mastery — offline-first.</strong></p>

<p align="center">
  <a href="https://github.com/sanskarIN/tablespark/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/sanskarIN/tablespark/actions/workflows/ci.yml/badge.svg" /></a>
  <a href="https://github.com/sanskarIN/tablespark/actions/workflows/codeql.yml"><img alt="CodeQL" src="https://github.com/sanskarIN/tablespark/actions/workflows/codeql.yml/badge.svg" /></a>
  <a href="LICENSE"><img alt="MIT License" src="https://img.shields.io/badge/license-MIT-blue.svg" /></a>
</p>

<p align="center">
  <a href="https://buymeacoffee.com/sanskarIN"><img alt="Buy Me a Coffee" src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-sanskarIN-FFDD00?logo=buy-me-a-coffee&logoColor=000000" /></a>
</p>

> **Made by the Sanskar** · Open source under the MIT License. Donations are optional and never required to use the product.

![TableSpark interface preview](docs/assets/interface-preview.svg)

> The image above is a repository interface preview illustration. Release documentation should replace or supplement it with real browser captures only after a release candidate is visually verified. The repository does not present fabricated mock screenshots as release evidence.

## Why TableSpark?

TableSpark turns multiplication-table practice into a maintainable learning product. It combines custom table generation, a flexible printable worksheet composer, random/replayable seeded practice, timed or untimed drills, deduplicated mistake review, searchable mastery statistics, compact local session history, optional non-punitive goals, offline profiles, accessibility controls, English/Hindi interfaces, and portable validated backups.

The app is designed as a Progressive Web App (PWA). A single web codebase works in modern browsers and can be installed when the browser/platform provides install capability. Core learning workflows do not require an account, TableSpark backend, payment, or network request.

## Features

### Tables and worksheet composer

- Generate multiplication tables for custom table ranges, multiplier ranges, and table step sizes.
- Protect the UI with an explicit 5,000-row worksheet rendering budget.
- Choose one of three printable outputs:
  - solved study sheet;
  - blank-answer practice worksheet;
  - answer key.
- Configure practice answer blanks as a writing line, single box, or open writing space.
- Choose A4 portrait or US Letter portrait print intent.
- Choose one, two, or three print columns.
- Print learner-facing sheets with paper-only blank Name and Date lines.
- Keep the active offline profile name out of printed learner metadata by default.
- Omit learner Name/Date metadata from answer-key output.

### Practice

- Start generated practice with a fresh random seed by default.
- Reuse the visible unsigned 32-bit seed to reproduce the same generated question sequence.
- Choose a new random seed without changing the remaining setup controls.
- Run timed or untimed drills with configurable ranges and question counts.
- Use five progression presets plus Custom:
  - Starter · 0–5;
  - Foundation · 0–10;
  - Builder · 2–12;
  - Fluency · 2–15;
  - Challenge · 2–20.
- Keep entered practice responses inside the supported whole-number range.
- Review recent mistakes with equivalent commutative facts deduplicated.
- Distinguish generated seeded sessions from mistake-review sessions at completion.
- Receive immediate correctness feedback.
- Store only compact completed-session summaries rather than duplicating every submitted answer into session history.

### Progress and local learning records

- Track attempts, accuracy, correct-answer streaks, and recent mistakes per offline profile.
- Treat equivalent facts such as 4 × 7 and 7 × 4 as the same canonical mastery key.
- Classify a fact as mastered after at least three attempts with 90% or better accuracy.
- Search practiced facts using `x` or `×` notation.
- Filter progress by All practiced facts, Needs practice, or Mastered.
- Review recent session summaries with:
  - generated drill or mistake-review type;
  - timed/untimed mode;
  - completion time;
  - score;
  - duration;
  - replay seed for generated drills.
- Choose to retain the latest 10, 25, 50, or 100 session summaries per profile.
- Reduce the retention limit and immediately trim older summaries locally.
- Set an optional per-profile mastered-facts goal.
- Use goals without deadlines, daily streak requirements, penalties, or notification pressure.
- Clear a goal at any time.

### Offline data, recovery, and privacy

- Create multiple local learner profiles without sign-in, up to the supported 100-profile limit.
- Store current validated learning state locally in the browser.
- Use persisted schema version 2 with an explicit migration from valid schema-1 data.
- Keep the existing storage key so valid older installations can migrate instead of appearing empty.
- Warn visibly when a normal browser-storage write cannot persist changes.
- Export and import validated JSON backups.
- Apply the same 2 MB byte budget to current persisted state and imported backups.
- Validate profile identity, canonical mastery keys, mastery counters, multiplication answers, attempt correctness, mistake-history semantics, session summaries, retention limits, and optional goal bounds.
- Preserve an existing unreadable local value rather than automatically overwriting it with defaults.
- Pause automatic persistence while unreadable data awaits recovery.
- Download unreadable raw local data privately as a recovery text artifact.
- Replace unreadable data by importing a valid backup, or explicitly discard it after confirmation.
- Confirm destructive backup replacement, profile deletion, progress reset, and unreadable-data discard operations.
- Keep the interface-language preference separate from exported learner-state JSON.

### Languages

- Use English as the primary/source interface locale.
- Switch the complete interface to Hindi (`हिन्दी`).
- Persist the selected interface language in the current browser.
- Update the document `<html lang>` attribute with the active locale.
- Keep catalog structure typed so missing translated message keys become TypeScript errors.
- Fall back to Hindi when the browser language starts with `hi` and no valid stored preference exists; otherwise fall back to English.

See [docs/localization.md](docs/localization.md).

### Appearance and accessibility

- Use light, dark, or system theme.
- Enable large-text classroom mode and reduced-motion preferences.
- Use keyboard navigation, visible focus states, semantic labels, and a skip link.
- Open an in-app keyboard shortcut reference from the navigation or with `?` when focus is not in an editable control.
- Close shortcut help with `Escape`.
- Use Alt+1 through Alt+5 section shortcuts where the browser/operating system does not reserve them.
- Enable progressive text-to-speech controls only where usable browser speech synthesis is available.
- Fall back safely when speech synthesis is unavailable or throws at runtime.
- Use responsive layouts and touch-friendly control targets.
- Run stable browser-assisted checks for landmarks, form labels, image alternatives, and keyboard shortcut reachability.
- Maintain a manual assistive-technology matrix without claiming unexecuted screen-reader passes.

### PWA lifecycle

- Continue core workflows while offline after production PWA assets are cached.
- Surface a dismissible offline-ready message when the service worker reports readiness.
- Surface a non-blocking update-ready notice instead of automatically interrupting active work.
- Let the user choose **Update now** or **Later**.
- Offer installation only when a supporting browser emits its install prompt event.
- Let the user dismiss the optional install notice.
- Treat install/update prompt failures as non-fatal to learning workflows.

### Maintainability and release safety

- Keep product UI text behind a central typed locale provider.
- Keep business/domain rules separate from React and browser adapters.
- Keep non-runtime repository security utilities under `scripts/` with independent tests.
- Validate persisted/imported state structurally and semantically.
- Test schema migration behavior.
- Package tagged web releases as `tablespark-web.zip`.
- Publish `tablespark-web.zip.sha256` alongside the exact packaged artifact.
- Document checksum verification before deployment.
- Keep production hosting and native packaging behind explicit architecture/owner decisions rather than adding speculative infrastructure.

## Supported platforms

| Platform | Support model |
| --- | --- |
| Web | Primary target in current Chrome/Chromium, Edge, Firefox, and Safari-class browsers |
| Windows | Web; installable PWA through supporting browsers |
| macOS | Web; installable PWA where the browser/platform supports it |
| Linux | Web; installable PWA through supporting Chromium-class browsers |
| Android | Browser/PWA experience; no native wrapper in the current release line |
| iOS/iPadOS | Browser/PWA capabilities available through the platform; behavior remains platform-controlled |

A native wrapper is not part of the current release line. The current evaluation keeps the PWA canonical. See [docs/native-packaging-evaluation.md](docs/native-packaging-evaluation.md).

## Tech stack

- TypeScript in strict mode
- React
- Vite
- `vite-plugin-pwa` / Workbox-generated service worker
- Zod for persisted/imported data validation
- Vitest + Testing Library
- fast-check for property-based domain testing
- Playwright for primary browser journeys and stable accessibility/localization browser checks
- ESLint + JSX accessibility rules
- Prettier
- Node built-in test runner for repository security utilities
- GitHub Actions, CodeQL, Dependabot

## Quick start

### Prerequisites

Install:

- Git
- Node.js 22.12.0 or newer
- npm 10 or newer
- a modern browser.

Then run:

```bash
git clone https://github.com/sanskarIN/tablespark.git
cd tablespark
npm install
npm run dev
```

Vite serves the development app at `http://localhost:5173` by default.

For detailed operating-system setup and upgrade guidance, see [docs/setup.md](docs/setup.md).

## Development setup

```bash
npm install
npm run dev
```

Useful commands:

```bash
npm run format:check   # Verify formatting without changing files
npm run lint           # Run ESLint and accessibility rules
npm run typecheck      # Run strict TypeScript project checks
npm run test           # Run application unit/component/integration tests once
npm run test:watch     # Run Vitest in watch mode
npm run test:coverage  # Generate application test coverage
npm run test:security  # Test the built-in repository secret scanner
npm run secret:scan    # Scan repository files for supported credential patterns
npm run build          # Type-check and build the production PWA
npm run preview        # Serve the production build locally
npm run check          # Run format/lint/types/app tests/security tests/secret scan/build
npm run test:e2e       # Run Playwright browser journeys
```

For Playwright on a fresh machine, install the browser binary once:

```bash
npx playwright install chromium
```

On Linux CI or a minimal Linux machine, Playwright may require:

```bash
npx playwright install --with-deps chromium
```

See [docs/development.md](docs/development.md) and [docs/testing.md](docs/testing.md).

## Build and release

Create a production build:

```bash
npm run build
```

The deployable static site is written to `dist/`.

Preview it locally:

```bash
npm run preview
```

A tag matching `v*.*.*` triggers the release workflow. It verifies the release candidate, builds the PWA, packages `dist/`, generates SHA-256 integrity metadata, and creates a GitHub release containing both files.

Verify a downloaded release artifact on a compatible shell with:

```bash
sha256sum -c tablespark-web.zip.sha256
```

See [docs/release.md](docs/release.md) before publishing a tag.

## Architecture overview

TableSpark is a modular client application:

- `src/domain/` — pure multiplication, answer, deterministic question, mastery, session-retention, review, progress-filter, worksheet, and persisted-data rules.
- `src/features/` — product screens grouped by user capability.
- `src/state/` — explicit application state wiring for offline profiles, session history, optional goals, settings, persistence health, and unreadable-data recovery state.
- `src/infrastructure/` — local persistence, migrations, speech, random-seed, PWA lifecycle/install, browser-preference, and structured logging adapters.
- `src/components/` — cross-cutting UI states such as onboarding, PWA/offline/persistence/recovery banners, and error handling.
- `src/i18n/` — English/Hindi typed message catalogs, locale preference, and the central locale provider.
- `scripts/` — repository-only quality/security utilities.
- `e2e/` — browser-level journey, accessibility, and localization verification.
- `docs/adr/` — architecture decisions.

Domain rules do not depend on React. Persisted JSON is versioned, bounded, and validated before use. Core learning workflows require no network connection or remote account.

An existing stored value that fails validation is classified separately from empty storage. TableSpark uses a temporary in-memory state while preserving the original raw local value until the user imports a valid replacement or explicitly discards it. See [ADR 0004](docs/adr/0004-preserve-unreadable-local-state.md).

Read [docs/architecture.md](docs/architecture.md) and [docs/adr/0001-typescript-react-pwa.md](docs/adr/0001-typescript-react-pwa.md).

## Data, security, and privacy

TableSpark stores profiles, settings, mastery statistics, recent mistake history, bounded session summaries, and optional mastery goals in browser `localStorage`. It does not require a TableSpark server account for core functionality.

Backups and raw recovery artifacts may contain learner profile names and learning history. Treat exported files as personal files and review them before sharing.

The project:

- validates imported state with a versioned schema;
- migrates supported schema-1 learner data to schema 2 locally;
- rejects unsupported backup versions;
- limits current persisted state and imports to a shared 2 MB byte budget;
- validates profile IDs, active-profile identity, canonical mastery keys, mastery counters, multiplication answers, recorded correctness, mistake-history semantics, session-summary invariants, retention, and goal bounds;
- preserves unreadable existing local state instead of silently destroying it;
- surfaces browser-storage failures and unreadable-state recovery needs in the UI;
- avoids storing authentication credentials because none are needed;
- redacts sensitive structured-log field names and recognizable sensitive values;
- tests and runs a dependency-free repository secret scanner in CI;
- runs production dependency auditing and CodeQL in GitHub Actions;
- publishes release ZIP checksum metadata;
- maintains a responsible disclosure process.

Run the local security checks with:

```bash
npm run test:security
npm run secret:scan
```

Read [PRIVACY.md](PRIVACY.md) and [SECURITY.md](SECURITY.md).

## Accessibility

TableSpark includes:

- keyboard-operable navigation and controls;
- visible focus indicators;
- a skip link;
- semantic labels, descriptions, alerts, and live regions;
- touch-friendly targets;
- large-text classroom mode;
- reduced-motion handling;
- non-color-only text for important states;
- responsive layouts;
- optional speech synthesis where supported, with disabled fallback messaging otherwise;
- explicit accessible recovery alerts/actions for unreadable local data;
- an in-app keyboard shortcut reference;
- automatic document-language updates for English/Hindi switching;
- print output designed not to automatically expose the active learner profile name;
- browser-assisted semantic invariants plus a documented manual screen-reader matrix.

See [docs/accessibility.md](docs/accessibility.md) for the review checklist and known platform differences.

## Testing

The test strategy includes:

- unit tests for table generation, row budgets, answer validation, difficulty presets, session retention, review selection, progress filtering, and worksheet modeling;
- deterministic question-generation and seed-validation tests;
- property-based generated-range tests;
- mastery and mistake-regression tests;
- persistence, schema-1 migration, schema-2 semantic backup validation, unreadable-state preservation/recovery, browser-preference, logger, and speech tests;
- React integration tests for navigation, table changes, worksheet composition, print metadata, progress filtering, session history, optional goals, mistake-review completion, speech fallback, PWA notices, persistence warnings, unreadable-state recovery, keyboard shortcuts, and localization;
- a Node test suite for the repository secret scanner;
- Playwright browser tests for table/worksheet generation, practice, profiles, accessibility invariants, and Hindi locale persistence.

CI treats formatting, linting, type checks, application tests, security utility tests, repository secret scanning, production build, browser journeys, and production dependency audit as quality gates. CodeQL runs separately.

See [docs/testing.md](docs/testing.md).

## Deployment status

`dist/` is suitable for static HTTPS hosting, but this repository does not treat an unapproved host as production. Candidate hosting options and the required owner-approval/verification gate are documented in [docs/deployment-evaluation.md](docs/deployment-evaluation.md).

Real release screenshots, production-origin PWA installability checks, and production offline-reload verification remain release-candidate tasks because they must be performed against a real verified build/origin rather than inferred from source code.

## Contributing

Contributions are welcome. Please read:

- [CONTRIBUTING.md](CONTRIBUTING.md)
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- [SECURITY.md](SECURITY.md)

Use focused commits and add tests for behavior changes. Do not include credentials, private learner data, raw recovery data, or generated secrets in issues, pull requests, fixtures, or commits.

The intended project commit email is `sanskarin@outlook.in`. Configure your local Git identity appropriately before committing if you are contributing through a normal Git checkout.

## Repository quality and branch protection

Recommended protection for `main`:

- require pull requests before merging;
- require the CI `quality` and `e2e` jobs;
- require CodeQL where available;
- dismiss stale approvals when new commits are pushed;
- require conversation resolution;
- block force pushes and branch deletion;
- require linear history if that matches the repository merge policy.

Exact GitHub UI steps are documented in [docs/repository-settings.md](docs/repository-settings.md).

## Documentation

- [Architecture](docs/architecture.md)
- [Setup](docs/setup.md)
- [Development](docs/development.md)
- [Testing](docs/testing.md)
- [User guide](docs/user-guide.md)
- [Localization](docs/localization.md)
- [Accessibility](docs/accessibility.md)
- [Release](docs/release.md)
- [Deployment evaluation](docs/deployment-evaluation.md)
- [Native packaging evaluation](docs/native-packaging-evaluation.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Performance](docs/performance.md)
- [Repository settings](docs/repository-settings.md)
- [Roadmap](ROADMAP.md)
- [Changelog](CHANGELOG.md)
- [Current handoff](what_changed.md)

## License

TableSpark is licensed under the [MIT License](LICENSE).

## Contact and support

- Business: `sanskarin@outlook.in`
- Business: `sanskarin.business@gmail.com`
- Support: `supportramsandesh@gmail.com`
- GitHub: https://github.com/sanskarIN
- Repository: https://github.com/sanskarIN/tablespark
- Buy Me a Coffee: https://buymeacoffee.com/sanskarIN

### Optional funding

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-sanskarIN-FFDD00?logo=buy-me-a-coffee&logoColor=000000)](https://buymeacoffee.com/sanskarIN)

**Made by the Sanskar**
