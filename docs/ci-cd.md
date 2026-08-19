# TableSpark CI/CD and Repository Automation

This document explains every automated GitHub workflow and maintenance automation currently tracked in TableSpark. It describes triggers, permissions, jobs, artifacts, intended branch-protection use, and failure triage.

## Automation map

TableSpark currently has four GitHub Actions workflows:

1. **CI** — formatting, lint, types, tests, security scan, production build, dependency audit, and Chromium E2E.
2. **CodeQL** — JavaScript/TypeScript static security analysis.
3. **Release** — verifies a version tag, builds/packages the web artifact, creates SHA-256 metadata, and publishes a GitHub Release.
4. **Release Visual Evidence** — captures real Chromium screenshots of the built UI for release-candidate review.

Other repository automation/configuration:

- Dependabot for npm and GitHub Actions updates;
- GitHub generated-release-note categories;
- issue and pull-request templates;
- repository funding configuration.

## Security principle for automation

Workflows use the smallest GitHub token permissions appropriate to their job.

- CI: `contents: read`
- CodeQL: `contents: read`, `security-events: write`
- Visual evidence: `contents: read`
- Release: `contents: write` because creating a release and attaching assets requires repository-content/release write capability.

Do not add broad `write-all`, issue, pull-request, package, deployment, or identity-token permissions unless a reviewed feature actually requires them.

A workflow file is executable repository configuration. Treat workflow changes like application code: review action versions, shell commands, secret exposure, artifact contents, and permissions.

# 1. CI workflow

File:

```text
.github/workflows/ci.yml
```

Workflow name:

```text
CI
```

## Triggers

CI runs on:

- pushes to `main`;
- pull requests whose base is `main`.

It does not run on every arbitrary branch push unless that push is part of a pull request to `main`.

## Concurrency

The workflow groups executions by workflow + ref and enables:

```text
cancel-in-progress: true
```

Meaning: if a newer run supersedes an older run for the same ref, GitHub can cancel the obsolete run. This reduces wasted CI time and helps reviewers focus on the newest commit.

A cancelled older run is not a failure in the candidate code, but it is also not evidence for the newest candidate. Release evidence must refer to the final head commit's checks.

## `quality` job

Runner:

```text
ubuntu-latest
```

Timeout:

```text
15 minutes
```

### Step 1 — Checkout

```yaml
uses: actions/checkout@v7
```

Makes the candidate repository contents available to later steps.

### Step 2 — Node setup

```yaml
uses: actions/setup-node@v7
node-version: 22.12.0
package-manager-cache: false
```

The workflow deliberately pins the expected Node version. Package-manager caching is disabled, favoring simpler/fresher installs over cache-specific behavior.

If the repository's supported Node version changes, update this value together with `.nvmrc`, `package.json`, other workflows, and setup documentation.

### Step 3 — Dependency installation

```bash
npm install --no-fund --no-audit
```

`--no-audit` here avoids duplicating the explicit audit step later. It does **not** mean dependency auditing is disabled for CI overall.

### Step 4 — Formatting

```bash
npm run format:check
```

A failure means a covered file does not match Prettier configuration/scope.

Typical fix:

```bash
npm run format
npm run format:check
```

Review formatting changes before committing them.

### Step 5 — Lint

```bash
npm run lint
```

This includes type-aware TypeScript rules plus JSX accessibility and React rules.

A lint failure should normally be fixed in source rather than suppressed globally.

### Step 6 — Type check

```bash
npm run typecheck
```

Validates strict application/tooling TypeScript projects.

Especially important after:

- persisted-schema changes;
- locale catalog changes;
- React state/context changes;
- configuration or E2E TypeScript changes.

### Step 7 — Application tests

```bash
npm run test
```

Runs Vitest tests, including domain, persistence, localization, PWA adapter, component, and integration regression coverage.

### Step 8 — Secret-scanner implementation tests

```bash
npm run test:security
```

Tests the repository's dependency-free credential-pattern scanner.

This verifies the scanner itself; it is separate from scanning the repository.

### Step 9 — Repository secret scan

```bash
npm run secret:scan
```

Runs the scanner over its intended repository scope.

If this reports a real credential:

1. stop treating the branch as releasable;
2. revoke/rotate the credential;
3. remove it from current source;
4. determine whether Git history or already-published artifacts contain it;
5. follow `SECURITY.md`.

Never merely add a real secret to an ignore list to restore a green build.

### Step 10 — Production build

```bash
npm run build
```

Runs strict TypeScript build mode and Vite's production PWA build. A passing test suite with a failing build is still a release blocker.

### Step 11 — Production dependency audit

```bash
npm audit --omit=dev --audit-level=high
```

CI fails for covered high/critical production dependency advisories reported by npm.

This is advisory-database based; a clean audit does not prove that dependencies are vulnerability-free.

### Step 12 — Upload production build

```yaml
uses: actions/upload-artifact@v7
name: tablespark-web
path: dist
if-no-files-found: error
```

The artifact is the exact `dist/` directory produced in the `quality` job.

Uses:

- inspect build output without rebuilding locally;
- compare candidate contents;
- diagnose release/deployment differences.

It is a CI artifact, not automatically a published production deployment.

## `e2e` job

Runner:

```text
ubuntu-latest
```

Timeout:

```text
20 minutes
```

This job is independent of `quality`; both can run in parallel.

Steps:

1. checkout;
2. set up Node 22.12.0;
3. install dependencies;
4. install Chromium plus Linux dependencies;
5. run `npm run test:e2e`.

The Playwright configuration itself builds and starts the production preview before running browser specs.

Current E2E areas include:

- smoke/product flows;
- accessibility invariants;
- English/Hindi switching;
- Hindi localized error paths;
- print media behavior;
- release screenshot capture spec (normally skipped unless its explicit flag is supplied).

## Branch protection recommendation

For `main`, the CI checks corresponding to both `quality` and `e2e` should be required before merge when GitHub repository settings permit it.

The exact check names shown by GitHub should be selected from successful recent runs, not guessed from documentation.

See `docs/repository-settings.md`.

# 2. CodeQL workflow

File:

```text
.github/workflows/codeql.yml
```

Workflow name:

```text
CodeQL
```

## Triggers

CodeQL runs on:

- pushes to `main`;
- pull requests targeting `main`;
- a weekly schedule.

Scheduled cron:

```text
17 3 * * 1
```

This means 03:17 UTC every Monday. GitHub scheduled workflow timing can be delayed by platform load; it should not be treated as a real-time scheduler.

## Permissions

```yaml
contents: read
security-events: write
```

`security-events: write` allows CodeQL analysis results to be uploaded to GitHub code scanning.

## Concurrency

Like CI, CodeQL cancels obsolete in-progress runs for the same workflow/ref.

## Analysis job

Job display name:

```text
Analyze TypeScript
```

Runner:

```text
ubuntu-latest
```

Timeout:

```text
20 minutes
```

Steps:

1. `actions/checkout@v7`
2. `github/codeql-action/init@v4` for `javascript-typescript`
3. `github/codeql-action/autobuild@v4`
4. `github/codeql-action/analyze@v4`

CodeQL complements, but does not replace:

- TypeScript correctness checks;
- ESLint;
- dependency audits;
- the repository secret scanner;
- privacy/security design review;
- manual review of browser trust boundaries.

## CodeQL failure triage

Distinguish:

- **workflow/tool failure** — setup/autobuild/action infrastructure failed;
- **analysis alert** — CodeQL successfully found a potentially unsafe code pattern.

For a real alert:

1. inspect data flow and reachability;
2. reproduce/understand the pattern;
3. fix the smallest responsible boundary;
4. add a regression test when practical;
5. rerun CodeQL on the fix;
6. do not dismiss an alert solely to make branch protection green.

# 3. Tagged Release workflow

File:

```text
.github/workflows/release.yml
```

Workflow name:

```text
Release
```

## Trigger

Runs when a tag matching:

```text
v*.*.*
```

is pushed.

Examples:

```text
v0.1.0
v0.2.1
v1.0.0
```

The pattern is syntactic; maintainers still need to follow semantic-versioning/release policy intentionally.

## Permission

```yaml
contents: write
```

This is required because the workflow creates a GitHub Release and uploads assets.

Do not expose `github.token` to arbitrary untrusted shell input. The current release command uses repository/tag environment variables generated by GitHub and known artifact paths.

## Release job

Runner:

```text
ubuntu-latest
```

Timeout:

```text
20 minutes
```

### Checkout and Node setup

Uses the same checkout and Node 22.12.0 baseline as CI.

### Dependency install

```bash
npm install --no-fund --no-audit
```

### Verify release candidate

```bash
npm run check
```

This reruns local quality checks before packaging.

Important limitation: `npm run check` does not include Playwright E2E. Therefore a release tag should be created only from a commit whose PR/CI E2E and required manual release gates were already reviewed.

### Build release

```bash
npm run build
```

This intentionally rebuilds the production artifact from the tagged commit rather than blindly republishing an older CI artifact.

### Package

```bash
cd dist && zip -r ../tablespark-web.zip .
```

The ZIP contains the contents of `dist/` at the archive root, not an extra `dist/` parent directory.

Output:

```text
tablespark-web.zip
```

### Generate integrity metadata

```bash
sha256sum tablespark-web.zip > tablespark-web.zip.sha256
```

Output:

```text
tablespark-web.zip.sha256
```

The checksum lets a downloader detect accidental or malicious byte-level modification relative to the workflow-produced digest.

It is **not** a digital signature or independent proof of publisher identity.

### Create release

The GitHub CLI receives `GH_TOKEN` from `github.token` and runs `gh release create` with:

- current tag name from `GITHUB_REF_NAME`;
- ZIP artifact;
- checksum file;
- repository from `GITHUB_REPOSITORY`;
- generated release notes;
- `--verify-tag`.

If tag verification fails, do not bypass it by removing the check without understanding the tag/repository state.

## Safe release sequence

Before pushing the tag:

1. freeze the candidate commit;
2. verify PR `quality`, `e2e`, CodeQL, and release visual evidence for that SHA;
3. perform/manual-record required accessibility, Hindi, and production-origin gates where applicable;
4. update changelog/version/release notes;
5. create annotated tag;
6. push only the intended tag;
7. inspect workflow result;
8. download ZIP + checksum;
9. verify checksum independently;
10. only then deploy the artifact if a production host has been approved.

See `docs/release.md` and `docs/release-evidence.md`.

# 4. Release Visual Evidence workflow

File:

```text
.github/workflows/visual-evidence.yml
```

Workflow name:

```text
Release Visual Evidence
```

## Triggers

Runs on:

- pull requests targeting `main`;
- manual `workflow_dispatch`.

The manual trigger is useful when evidence needs to be regenerated without changing source.

## Permission

```yaml
contents: read
```

The workflow does not modify the repository or deploy anything.

## Screenshot job

Runner:

```text
ubuntu-latest
```

Timeout:

```text
20 minutes
```

Steps:

1. checkout;
2. set up Node 22.12.0;
3. install dependencies;
4. install Chromium/system dependencies;
5. set `CAPTURE_RELEASE_EVIDENCE=1`;
6. run only `e2e/release-evidence.spec.ts`;
7. upload generated PNG evidence.

## Artifact

Name:

```text
tablespark-release-visual-evidence
```

Expected path:

```text
test-results/release-evidence/*.png
```

`if-no-files-found: error` prevents a workflow from appearing successful if the test ran without producing screenshots.

Retention:

```text
30 days
```

Current expected captures:

- light/wide;
- dark/wide;
- light/compact;
- dark/compact.

These screenshots are **real Chromium renderings of the built application**.

They still require human inspection for clipping, awkward wrapping, typography, layout quality, and whether the candidate displayed an unexpected banner/state.

A passing screenshot workflow is not proof of:

- Safari/Firefox rendering;
- screen-reader behavior;
- production hosting correctness;
- PWA scope/installability on the final origin;
- Hindi linguistic quality.

# 5. Dependabot

File:

```text
.github/dependabot.yml
```

Dependabot configuration version:

```text
2
```

## npm updates

Directory:

```text
/
```

Schedule:

- weekly;
- Monday;
- 04:00 (GitHub's Dependabot scheduling context).

Open PR limit:

```text
10
```

Development dependency updates are grouped under:

```text
development-dependencies
```

Grouping reduces noisy one-PR-per-dev-package maintenance while still allowing runtime dependency changes to receive separate scrutiny where Dependabot determines appropriate updates.

## GitHub Actions updates

Ecosystem:

```text
github-actions
```

Schedule:

- weekly;
- Monday;
- 04:30.

Open PR limit:

```text
5
```

Action updates are supply-chain-sensitive. Review:

- publisher/action identity;
- major-version migration notes;
- requested permissions;
- changed behavior;
- whether a new major version still works with repository policies.

Do not auto-merge a major workflow action change solely because Dependabot opened it.

# 6. Generated release-note configuration

File:

```text
.github/release.yml
```

This is **not** the Actions release workflow. It configures GitHub's generated changelog/release-note grouping.

## Exclusion

PRs/issues with label:

```text
skip-changelog
```

are excluded from generated notes.

Use the label only when omission is intentional; do not hide security-significant or user-visible changes from release notes merely for cleanliness.

## Categories

Generated notes classify labels into:

- Features → `enhancement`
- Fixes → `bug`
- Accessibility → `accessibility`
- Documentation → `documentation`
- Dependencies → `dependencies`
- Other changes → wildcard fallback

Good PR labeling improves release-note usefulness but does not replace the maintained `CHANGELOG.md`.

# 7. Issue and pull-request automation surfaces

Files:

```text
.github/ISSUE_TEMPLATE/bug_report.md
.github/ISSUE_TEMPLATE/feature_request.md
.github/ISSUE_TEMPLATE/config.yml
.github/pull_request_template.md
```

Their role is contributor guidance rather than executable product code.

Important privacy rule: issue/PR templates should never ask users to upload raw learner backups or unreadable recovery artifacts publicly. Reproduction guidance should request synthetic/redacted examples.

# 8. Funding configuration

File:

```text
.github/FUNDING.yml
```

This exposes optional repository funding through GitHub UI.

Funding must remain:

- optional;
- separate from core learning features;
- unrelated to access to privacy/security support;
- described without pressure or misleading urgency.

# 9. What is not automated

The repository intentionally does **not** currently automate these decisions as if they were already approved:

- production static-host selection;
- production deployment;
- custom domain/DNS ownership;
- TWA/native packaging;
- app-store publishing;
- manual NVDA/Narrator/VoiceOver/TalkBack passes;
- fluent/native Hindi linguistic approval;
- final visual screenshot human review;
- production-origin installability/offline reload verification;
- release tag creation itself.

See deployment/native-packaging/evidence docs for the explicit gates.

# 10. Workflow failure triage

## Formatting/lint/type/test failure

Reproduce locally with the exact named npm command before changing unrelated code.

## Build failure

Run:

```bash
npm run build
```

Check TypeScript first, then Vite/PWA diagnostics.

## E2E failure

Run the failing spec locally:

```bash
npx playwright test e2e/<file>.spec.ts
```

If CI retried, inspect trace/test artifacts where available. Do not increase retries to hide deterministic failures.

## Audit failure

Identify whether the advisory affects a production dependency and reachable use case. Upgrade/replace the dependency where possible. Document a deliberate risk decision if immediate remediation is impossible.

## CodeQL failure/alert

Separate infrastructure failure from an actual code-scanning result. Real alerts require investigation and remediation/reasoned disposition.

## Visual evidence failure

Determine whether:

- the screenshot test failed to render;
- expected files were not created;
- artifact upload failed;
- the workflow lacks a browser/system dependency.

Even after a green run, manually inspect the artifact.

## Release failure before GitHub Release creation

Do not manually create a release from an unverified partial artifact just to bypass the failed workflow. Fix the cause or rerun from the same intended tag/commit according to release policy.

## Release created but later found faulty

Do not move the public tag silently. Follow the rollback/patch guidance in `docs/release.md`.

# 11. Required-check maintenance

Whenever a workflow/job is renamed:

1. merge/establish a successful run under the new name;
2. inspect the exact status/check names GitHub exposes;
3. update branch protection/rulesets;
4. update `docs/repository-settings.md` and `docs/quality-gates.md`;
5. make sure the old required check is not left impossible to satisfy.

Branch protection should follow actual check names, not documentation guesses.

# 12. Automation-change checklist

For any `.github/workflows/*.yml` change:

- [ ] Review trigger scope.
- [ ] Review token permissions.
- [ ] Review third-party action publisher/version.
- [ ] Check whether untrusted PR data enters a shell command.
- [ ] Check whether secrets/tokens can reach untrusted code.
- [ ] Check artifact contents for personal/sensitive data.
- [ ] Keep Node/tool versions synchronized.
- [ ] Re-run relevant workflow on a PR before relying on it.
- [ ] Update CI/CD, testing, release, and repository-settings docs.
- [ ] Record the change in `what_changed.md` when it changes a release/verification gate.

For Dependabot/release-note configuration changes, also verify the intended maintenance cadence/labels against current repository practice.
