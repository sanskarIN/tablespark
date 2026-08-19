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
git config user.email "sanskarin@outlook.in"
npm install
npm run dev
```

Install the Playwright browser if you will run end-to-end tests:

```bash
npx playwright install chromium
```

## Development rules

- Keep domain logic independent from React and browser APIs.
- Validate untrusted imported data at the infrastructure boundary.
- Keep runtime creation limits aligned with persisted/imported validation limits.
- Do not add real learner data, secrets, credentials, private endpoints, or generated production tokens.
- Maintain keyboard and screen-reader usability for new controls.
- Preserve offline behavior for core learning workflows.
- Surface durability failures rather than silently implying local data was saved.
- Add or update automated tests for behavior changes and bug fixes.
- Add user-facing product strings to `src/i18n/en.ts` instead of scattering them through feature components.
- Keep domain validation messages near domain code when they are part of non-UI behavior contracts.
- Keep optional funding references non-intrusive.
- Do not add a dependency when the platform or existing code can provide a small, testable implementation.

## Persisted-data invariants

Current persisted state intentionally enforces:

- schema version `1`;
- a shared 2 MB persistence/backup budget;
- maximum supported offline-profile capacity;
- unique profile IDs and a valid active profile;
- mathematically valid stored multiplication questions;
- attempt correctness consistent with the saved response;
- mastery counters that cannot exceed their totals.

If a new feature stores data, update the type model, validator, runtime state logic, tests, privacy documentation, and migration plan together.

## Commit style

Use small, meaningful, atomic commits. Conventional Commit prefixes are encouraged:

- `feat:` product behavior
- `fix:` bug fixes
- `test:` automated coverage
- `docs:` documentation
- `refactor:` internal restructuring without intended behavior changes
- `perf:` measured performance improvements
- `security:` security hardening where the repository convention benefits from the distinction
- `build:` build/tooling
- `ci:` automation
- `chore:` maintenance

Do not create empty or artificial commits simply to increase commit count.

## Verification

For a broad local check run:

```bash
npm run check
```

That command covers formatting, linting, strict types, application tests, security-scanner tests, repository credential-pattern scanning, and the production build.

For changes to primary user journeys, also run:

```bash
npm run test:e2e
```

Review production dependency security separately:

```bash
npm audit --omit=dev --audit-level=high
```

You can run the repository security checks independently with:

```bash
npm run test:security
npm run secret:scan
```

Do not weaken a security scanner test simply to make a credential-like fixture pass. Test fixtures should construct representative fake values safely and should never contain a real credential.

## Pull requests

A good pull request:

- explains the user or engineering problem;
- describes the chosen solution;
- includes relevant tests;
- updates documentation when behavior changes;
- includes screenshots for visible UI changes when useful;
- has no unrelated formatting churn;
- passes repository quality checks;
- does not expose learner data or secrets in logs, screenshots, fixtures, or comments.

## Accessibility review

For user-interface changes, manually check:

- keyboard-only operation;
- visible focus;
- meaningful labels/descriptions;
- readable zoom/large text;
- light and dark themes;
- reduced motion where animation exists;
- mobile/touch target sizing;
- status messages that do not rely only on color;
- unsupported-platform fallback when using progressive browser APIs;
- print output when the feature affects classroom worksheets.

See `docs/accessibility.md` for the full checklist.

## Data schema changes

Persisted state is versioned. Do not silently change stored JSON semantics. If the shape changes:

1. update domain/types;
2. increment the schema version;
3. add an explicit migration;
4. update Zod validation and runtime constraints;
5. add migration and malformed-input tests;
6. update backup/import/privacy documentation;
7. document compatibility in `CHANGELOG.md` and `what_changed.md`.

## Security issues

Do not publish a vulnerability as a normal issue. Follow `SECURITY.md` and report it privately. Never paste a real secret into a reproduction, test, issue, pull request, or log.

If a real credential is accidentally committed, rotate/revoke it first. A later deletion or passing secret scan does not make the exposed credential safe again.

## Questions

- Business: `sanskarin@outlook.in`
- Business: `sanskarin.business@gmail.com`
- Support: `supportramsandesh@gmail.com`

**Made by the Sanskar**
