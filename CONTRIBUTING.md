# Contributing to TableSpark

Thank you for helping improve TableSpark. Contributions should strengthen learning value, reliability, accessibility, maintainability, privacy, or documentation rather than merely increasing feature count.

## Before you start

1. Search existing issues and pull requests.
2. For a substantial feature, open a feature request first so the intended user problem can be discussed.
3. For security vulnerabilities, follow `SECURITY.md` instead of opening a public issue.

## Local setup

```bash
git clone https://github.com/sanskarIN/tablespark.git
cd tablespark
npm install
npm run dev
```

Install the Playwright browser if you will run end-to-end tests:

```bash
npx playwright install chromium
```

## Development rules

- Keep domain logic independent from React when possible.
- Validate untrusted imported data at the infrastructure boundary.
- Do not add real learner data, secrets, credentials, private endpoints, or generated production tokens.
- Maintain keyboard and screen-reader usability for new controls.
- Preserve offline behavior for core learning workflows.
- Add or update automated tests for behavior changes and bug fixes.
- Externalize new user-facing strings with the existing i18n structure.
- Keep optional funding references non-intrusive.

## Commit style

Use small, meaningful, atomic commits. Conventional Commit prefixes are encouraged:

- `feat:` product behavior
- `fix:` bug fixes
- `test:` automated coverage
- `docs:` documentation
- `refactor:` internal restructuring without intended behavior changes
- `perf:` measured performance improvements
- `build:` build/tooling
- `ci:` automation
- `chore:` maintenance

Do not create empty or artificial commits simply to increase commit count.

## Verification

Before opening a pull request, run:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
```

For changes to primary user journeys, also run:

```bash
npm run test:e2e
```

For a broader local check:

```bash
npm run check
```

## Pull requests

A good pull request:

- explains the user or engineering problem;
- describes the chosen solution;
- includes relevant tests;
- updates documentation when behavior changes;
- includes screenshots for visible UI changes when useful;
- has no unrelated formatting churn;
- passes repository quality checks.

## Accessibility review

For user-interface changes, manually check:

- keyboard-only operation;
- visible focus;
- meaningful labels;
- readable zoom/large text;
- light and dark themes;
- reduced motion where animation exists;
- mobile/touch target sizing;
- status messages that do not rely only on color.

See `docs/accessibility.md` for the full checklist.

## Data schema changes

Persisted state is versioned. Do not silently change stored JSON semantics. If the shape changes:

1. increment the schema version;
2. add an explicit migration;
3. add migration tests;
4. update backup/import documentation;
5. document compatibility in `CHANGELOG.md` and `what_changed.md`.

## Questions

- Business: `sanskarin@outlook.in`
- Business: `sanskarin.business@gmail.com`
- Support: `supportramsandesh@gmail.com`

**Made by the Sanskar**
