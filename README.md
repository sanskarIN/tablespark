<p align="center">
  <img src="public/logo.svg" width="112" height="112" alt="TableSpark logo" />
</p>

<h1 align="center">TableSpark</h1>

<p align="center"><strong>Generate multiplication tables, run focused drills, review mistakes, and build mastery — offline-first.</strong></p>

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

TableSpark turns a simple multiplication-table exercise into a maintainable learning product. It combines custom table generation with deterministic practice sessions, timed or untimed drills, mistake review, mastery statistics, offline profiles, print-friendly worksheets, accessibility controls, and portable local backups.

The app is designed as a Progressive Web App (PWA), so a single codebase works in modern browsers and can be installed on supported browsers across Windows, macOS, and Linux.

## Features

- Generate multiplication tables for custom table ranges, multiplier ranges, and table step sizes.
- Print clean worksheet-style output directly from the browser.
- Practice with randomized questions generated from a reproducible seed.
- Run timed or untimed drills with configurable ranges and question counts.
- Review recent mistakes and retry difficult facts.
- Track attempts, accuracy, streaks, fact mastery, and recent mistakes per offline profile.
- Create multiple local learner profiles without sign-in.
- Export and import validated JSON backups.
- Use light, dark, or system theme.
- Enable large-text classroom mode and reduced-motion preferences.
- Use keyboard navigation and visible focus states.
- Enable progressive text-to-speech controls where the browser supports speech synthesis.
- Continue core workflows while offline after the PWA assets are cached.
- Install the PWA through a supported desktop browser.
- Keep interface strings separated from core UI structure for future internationalization.

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
- GitHub Actions, CodeQL, Dependabot

## Quick start

### Prerequisites

Install:

- Git
- Node.js 22 or newer
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
npm run test           # Run unit/component/integration tests once
npm run test:watch     # Run Vitest in watch mode
npm run test:coverage  # Generate test coverage
npm run build          # Type-check and build the production PWA
npm run preview        # Serve the production build locally
npm run check          # Run formatting, lint, types, tests, and build
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

- `src/domain/` — pure multiplication, deterministic question, mastery, and data types.
- `src/features/` — product screens grouped by user capability.
- `src/state/` — explicit application state wiring for offline profiles and settings.
- `src/infrastructure/` — local persistence, migrations, speech, and structured logging adapters.
- `src/components/` — cross-cutting UI states such as onboarding, offline banners, and error handling.
- `src/i18n/` — externalized interface copy.
- `e2e/` — browser-level journey verification.
- `docs/adr/` — architecture decisions.

Domain rules do not depend on React. Persisted JSON is versioned and validated before use. Core learning workflows require no network connection or remote account.

Read [docs/architecture.md](docs/architecture.md) and [docs/adr/0001-typescript-react-pwa.md](docs/adr/0001-typescript-react-pwa.md).

## Data, security, and privacy

TableSpark stores profiles, settings, mastery statistics, and recent mistake history in browser `localStorage`. It does not require a server account for core functionality.

Backups are JSON files and may contain learner profile names and learning history. Treat exported backups as personal files and review them before sharing.

The project:

- validates imported state with a versioned schema;
- rejects unsupported backup versions;
- limits imported backup file size in the UI;
- avoids storing credentials because no credentials are needed;
- redacts sensitive field names in structured logging;
- runs dependency auditing and CodeQL in GitHub Actions;
- maintains a responsible disclosure process.

Read [PRIVACY.md](PRIVACY.md) and [SECURITY.md](SECURITY.md).

## Accessibility

TableSpark includes:

- keyboard-operable navigation and controls;
- visible focus indicators;
- a skip link;
- semantic labels and live regions;
- touch-friendly targets;
- large-text classroom mode;
- reduced-motion handling;
- non-color-only text for important states;
- responsive layouts;
- optional speech synthesis where supported.

See [docs/accessibility.md](docs/accessibility.md) for the review checklist and known platform differences.

## Testing

The test strategy includes:

- unit tests for table generation and validation;
- deterministic question-generation tests;
- property-based generated-range tests;
- mastery and mistake-regression tests;
- persistence and migration tests;
- React integration tests for navigation and table changes;
- Playwright browser tests for table generation, practice, profiles, and accessibility settings.

CI treats formatting, linting, type checks, unit/integration tests, production build, browser journeys, and production dependency audit as quality gates.

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
