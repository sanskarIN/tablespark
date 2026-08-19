<p align="center">
  <img src="public/logo.svg" width="112" height="112" alt="TableSpark logo" />
</p>

<h1 align="center">TableSpark</h1>

<p align="center"><strong>Generate multiplication tables, print worksheets, run replayable drills, review mistakes, and build mastery — offline-first.</strong></p>

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

> The image above is a repository interface preview illustration. Release documentation should replace or supplement it with real browser captures when a release candidate is visually reviewed.

## Why TableSpark?

TableSpark turns a simple multiplication-table exercise into a maintainable learning product. It combines custom table generation, solved and blank printable worksheets, random/replayable seeded practice, timed or untimed drills, deduplicated mistake review, searchable mastery statistics, offline profiles, accessibility controls, and portable local backups.

The app is designed as a Progressive Web App (PWA), so a single codebase works in modern browsers and can be installed through supported browsers across Windows, macOS, and Linux. Core learning workflows do not require an account, server, or network request.

## Features

### Tables and worksheets

- Generate multiplication tables for custom table ranges, multiplier ranges, and table step sizes.
- Protect the UI with an explicit 5,000-row worksheet rendering budget.
- Switch between solved study sheets and blank-answer practice worksheets.
- Print clean classroom output with paper-only Name and Date lines.
- Keep the active offline profile name out of printed worksheet metadata by default.

### Practice

- Start practice with a fresh random seed by default.
- Reuse the visible unsigned 32-bit seed to reproduce the same generated question sequence.
- Choose a new random seed without changing the other setup controls.
- Run timed or untimed drills with configurable ranges and question counts.
- Use Starter, Builder, Challenge, or Custom difficulty ranges.
- Review recent mistakes with equivalent commutative facts deduplicated.
- Receive immediate correctness feedback and keep deterministic sessions testable.

### Progress

- Track attempts, accuracy, correct-answer streaks, and recent mistakes per offline profile.
- Treat equivalent facts such as 4 × 7 and 7 × 4 as the same mastery key.
- Classify a fact as mastered after at least three attempts with 90% or better accuracy.
- Search practiced facts using `x` or `×` notation.
- Filter progress by All practiced facts, Needs practice, or Mastered.

### Offline data and privacy

- Create multiple local learner profiles without sign-in, up to the supported local profile limit.
- Store current state locally in the browser.
- Warn visibly when browser storage cannot persist changes.
- Export and import validated JSON backups.
- Apply the same 2 MB byte budget to current persisted state and imported backups.
- Validate profile identity, mastery counters, multiplication answers, and attempt correctness on backup import.
- Confirm destructive backup replacement, profile deletion, and progress reset operations.

### Appearance and accessibility

- Use light, dark, or system theme.
- Enable large-text classroom mode and reduced-motion preferences.
- Use keyboard navigation, visible focus states, semantic labels, and a skip link.
- Enable progressive text-to-speech controls only where usable browser speech synthesis is available.
- Fall back safely when speech synthesis is unavailable or throws at runtime.
- Use responsive layouts and touch-friendly control targets.

### PWA and maintainability

- Continue core workflows while offline after the production PWA assets are cached.
- Install the PWA through a supported desktop browser.
- Keep product UI strings centralized in `src/i18n/en.ts` for future locale-provider work.
- Keep business/domain rules separate from React and browser adapters.

## Supported platforms

| Platform | Support model |
| --- | --- |
| Web | Primary target in current Chrome/Chromium, Edge, Firefox, and Safari-class browsers |
| Windows | Installable PWA through supporting browsers |
| macOS | Installable PWA through supporting browsers |
| Linux | Installable PWA through supporting Chromium-class browsers |

Native app-store packaging is not part of the initial release. See [ROADMAP.md](ROADMAP.md) for future packaging options.

## Tech stack

- TypeScript in strict mode
- React
- Vite
- `vite-plugin-pwa` / Workbox-generated service worker
- Zod for persisted/imported data validation
- Vitest + Testing Library
- fast-check for property-based domain testing
- Playwright for primary browser journeys
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
- A modern browser

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

A tag matching `v*.*.*` triggers the release workflow, which verifies the release candidate, builds the PWA, packages `dist/`, and creates a GitHub release artifact. See [docs/release.md](docs/release.md) before publishing a tag.

## Architecture overview

TableSpark is a modular client application:

- `src/domain/` — pure multiplication, deterministic question, mastery, review, progress-filter, worksheet, and data rules.
- `src/features/` — product screens grouped by user capability.
- `src/state/` — explicit application state wiring for offline profiles, settings, and persistence-health state.
- `src/infrastructure/` — local persistence, migrations, speech, random-seed, browser-preference, and structured logging adapters.
- `src/components/` — cross-cutting UI states such as onboarding, offline/persistence banners, and error handling.
- `src/i18n/` — externalized English interface copy.
- `scripts/` — repository-only quality/security utilities.
- `e2e/` — browser-level journey verification.
- `docs/adr/` — architecture decisions.

Domain rules do not depend on React. Persisted JSON is versioned, bounded, and validated before use. Core learning workflows require no network connection or remote account.

Read [docs/architecture.md](docs/architecture.md) and [docs/adr/0001-typescript-react-pwa.md](docs/adr/0001-typescript-react-pwa.md).

## Data, security, and privacy

TableSpark stores profiles, settings, mastery statistics, and recent mistake history in browser `localStorage`. It does not require a server account for core functionality.

Backups are JSON files and may contain learner profile names and learning history. Treat exported backups as personal files and review them before sharing.

The project:

- validates imported state with a versioned schema;
- rejects unsupported backup versions;
- limits current persisted state and imports to a shared 2 MB byte budget;
- validates profile IDs, active-profile identity, mastery counters, multiplication answers, and recorded correctness;
- surfaces browser-storage failures in the UI;
- avoids storing credentials because no credentials are needed;
- redacts sensitive structured-log field names and recognizable sensitive values;
- tests and runs a dependency-free repository secret scanner in CI;
- runs production dependency auditing and CodeQL in GitHub Actions;
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
- print output designed not to automatically expose the active learner profile name.

See [docs/accessibility.md](docs/accessibility.md) for the review checklist and known platform differences.

## Testing

The test strategy includes:

- unit tests for table generation, row budgets, validation, review selection, progress filtering, and worksheet modeling;
- deterministic question-generation and seed-validation tests;
- property-based generated-range tests;
- mastery and mistake-regression tests;
- persistence, semantic backup validation, migration, browser-preference, logger, and speech tests;
- React integration tests for navigation, table changes, print metadata, progress filtering, speech fallback, and persistence warnings;
- a Node test suite for the repository secret scanner;
- Playwright browser tests for table generation, worksheet mode, practice, profiles, and accessibility settings.

CI treats formatting, linting, type checks, application tests, security utility tests, repository secret scanning, production build, browser journeys, and production dependency audit as quality gates. CodeQL runs separately.

See [docs/testing.md](docs/testing.md).

## Contributing

Contributions are welcome. Please read:

- [CONTRIBUTING.md](CONTRIBUTING.md)
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- [SECURITY.md](SECURITY.md)

Use focused commits and add tests for behavior changes. Do not include credentials, private learner data, or generated secrets in issues, pull requests, fixtures, or commits.

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
- [Release](docs/release.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Accessibility](docs/accessibility.md)
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
