# Quality Gates

TableSpark uses layered automated checks so release confidence does not depend on a single test runner.

## Standard local gate

Run:

```bash
npm run check
```

The command executes, in order:

1. `npm run format:check` — verifies repository-formatted source/configuration files.
2. `npm run lint` — runs TypeScript-aware ESLint, React Hooks/refresh rules, JSX accessibility rules, and Node-script linting.
3. `npm run typecheck` — runs strict TypeScript project checks.
4. `npm run test` — runs Vitest domain, infrastructure, and React integration tests.
5. `npm run test:security` — tests the repository credential-pattern scanner.
6. `npm run secret:scan` — scans repository text for supported high-risk credential signatures without printing matched values.
7. `npm run test:docs` — tests the documentation-link checker implementation and verifies that local Markdown links resolve against the checked-out repository.
8. `npm run build` — creates the production PWA after TypeScript checking.

Because the commands are joined with `&&`, the gate stops at the first failing step.

`npm run test:docs` is intentionally offline for repository-local links. It does not crawl or guarantee the availability/safety of every external website linked from documentation.

## Browser journey gate

Install Chromium once:

```bash
npx playwright install chromium
```

Then run:

```bash
npm run test:e2e
```

Linux CI uses:

```bash
npx playwright install --with-deps chromium
```

The E2E suite covers primary learning/settings journeys plus accessibility invariants, localization/localized error paths, print behavior, and unreadable local-state preservation/recovery.

The opt-in release-evidence screenshot spec is normally skipped during ordinary E2E and is activated by the dedicated visual-evidence workflow.

## Production dependency gate

Run:

```bash
npm audit --omit=dev --audit-level=high
```

A high-severity production finding requires investigation before a release. Do not lower the threshold only to make a release pass.

The audit is advisory-database based and cannot prove that every dependency is vulnerability-free.

## GitHub automation

`.github/workflows/ci.yml` runs the source/documentation/security/build checks plus browser E2E on pushes and pull requests to `main`.

The CI `quality` job explicitly runs:

- formatting;
- lint;
- type checks;
- application tests;
- secret-scanner tests;
- repository secret scan;
- documentation-link tests/check;
- production build;
- production dependency audit;
- build-artifact upload.

The CI `e2e` job installs Chromium and runs Playwright separately.

`.github/workflows/codeql.yml` performs JavaScript/TypeScript static security analysis.

`.github/workflows/visual-evidence.yml` captures real light/dark compact/wide Chromium screenshots for review.

The tagged release workflow runs `npm run check` again before packaging the web artifact and checksum.

See `docs/ci-cd.md` for the exact trigger, permission, artifact, and failure-triage model.

## Documentation completeness gate

The repository contains an exhaustive tracked-file map at:

```text
docs/repository-file-reference.md
```

The link checker verifies that local Markdown targets exist; it does not automatically prove that every newly added tracked file has been described in the inventory. When adding/removing/renaming a tracked file, update the file reference in the same change series and review the recursive tree/`git ls-files` count.

## Release-candidate rule

Before tagging a release candidate, the recommended local sequence is:

```bash
npm run check
npm run test:e2e
npm audit --omit=dev --audit-level=high
```

Then:

1. freeze the candidate SHA;
2. confirm final-head GitHub CI/CodeQL/visual-evidence results;
3. inspect screenshot artifacts;
4. complete required manual checks in `docs/release.md`, `docs/accessibility.md`, and `docs/hindi-review-checklist.md`;
5. record exact outcomes in `docs/release-evidence.md` and `what_changed.md`;
6. tag only the verified commit.

A queued, skipped, cancelled, unavailable, or older-SHA CI job is **not** a passing result. Record the exact external limitation when a platform runner prevents executable verification.
