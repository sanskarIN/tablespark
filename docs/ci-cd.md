# TableSpark CI/CD and Repository Automation

This document explains every automated GitHub workflow and maintenance automation currently tracked in TableSpark. It describes triggers, permissions, jobs, artifacts, intended branch-protection use, documentation integrity, and failure triage.

## Automation map

TableSpark currently has four GitHub Actions workflows:

1. **CI** — formatting, lint, types, application tests, repository security checks, documentation-link integrity, production build/audit, and Chromium E2E.
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

It does not run on every arbitrary branch push unless that branch is represented by a pull request to `main`.

## Concurrency

The workflow groups executions by workflow + ref and enables:

```text
cancel-in-progress: true
```

If a newer run supersedes an older run for the same ref, GitHub can cancel the obsolete run. A cancelled older run is not a failure in the candidate code, but it is also not evidence for the newest candidate. Release evidence must refer to checks for the final head SHA.

## `quality` job

Runner:

```text
ubuntu-latest
```

Timeout:

```text
15 minutes
```

### Checkout

```yaml
uses: actions/checkout@v7
```

Makes the candidate repository contents available to later steps.

### Node setup

```yaml
uses: actions/setup-node@v7
node-version: 22.12.0
package-manager-cache: false
```

The workflow pins the expected Node version. Package-manager caching is disabled for simpler/fresher installs.

If the supported Node version changes, update this value together with `.nvmrc`, `package.json`, every other workflow, and setup/configuration documentation.

### Dependency installation

```bash
npm install --no-fund --no-audit
```

`--no-audit` avoids duplicating the explicit production-audit step later. It does **not** disable dependency security review overall.

### Check formatting

```bash
npm run format:check
```

A failure means a covered source/config file differs from Prettier policy.

Typical fix:

```bash
npm run format
npm run format:check
```

Review the formatting diff before committing.

### Lint

```bash
npm run lint
```

Includes strict type-aware TypeScript, React Hooks/refresh, JSX accessibility, and Node-script lint rules.

A lint failure should normally be fixed in source rather than suppressed globally.

### Type-check

```bash
npm run typecheck
```

Validates strict browser and Node/E2E TypeScript project references.

Especially important after:

- persisted schema changes;
- locale catalog changes;
- React state/context changes;
- configuration/E2E TypeScript changes.

### Application tests

```bash
npm run test
```

Runs Vitest domain, infrastructure, localization, PWA adapter, component, and integration tests.

### Secret-scanner implementation tests

```bash
npm run test:security
```

Tests the dependency-free repository scanner implementation. This is different from scanning the current repository.

### Repository secret scan

```bash
npm run secret:scan
```

Scans the intended repository text for supported credential signatures while avoiding echoing the matched credential value.

If this reports a real credential:

1. stop treating the branch as releasable;
2. revoke/rotate the credential;
3. remove it from current source;
4. assess repository history/artifact exposure;
5. follow `SECURITY.md`.

Never add a real exposed secret to an ignore list merely to restore green CI.

### Documentation-link quality gate

```bash
npm run test:docs
```

This formal gate performs two stages:

1. tests `scripts/link-checker.mjs` through `scripts/link-checker.test.mjs`;
2. runs `scripts/link-check.mjs` over the checked-out repository.

It validates supported repository-local Markdown targets and therefore protects deep documentation from silently accumulating broken file/image links.

Important boundary:

- it validates **local** repository links;
- it does not crawl every external website;
- it does not automatically know whether every new tracked source file has been described in `docs/repository-file-reference.md`.

The exhaustive file inventory still requires tracked-file review when files are added/removed/renamed.

### Production build

```bash
npm run build
```

Runs strict TypeScript build mode and Vite's production PWA build. A passing unit suite with a failing production build is still a release blocker.

### Production dependency audit

```bash
npm audit --omit=dev --audit-level=high
```

CI fails for covered high/critical production dependency advisories reported by npm.

This is advisory-database based; a clean audit does not prove dependencies are vulnerability-free.

### Upload production build

```yaml
uses: actions/upload-artifact@v7
name: tablespark-web
path: dist
if-no-files-found: error
```

The artifact is the exact `dist/` produced by this quality job.

Uses include:

- inspect candidate build output without rebuilding locally;
- compare packaged/static contents;
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

The Playwright configuration builds and starts the production preview automatically.

Current ordinary E2E areas include:

- smoke/product flows;
- accessibility invariants;
- English/Hindi switching;
- Hindi localized error paths;
- print media behavior.

`e2e/release-evidence.spec.ts` is normally skipped during ordinary E2E because its screenshot capture is enabled by a dedicated environment flag/workflow.

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

This means 03:17 UTC every Monday. GitHub scheduled workflow execution can be delayed by platform load and should not be treated as a real-time scheduler.

## Permissions

```yaml
contents: read
security-events: write
```

`security-events: write` allows analysis results to be uploaded to GitHub code scanning.

## Concurrency

CodeQL cancels obsolete in-progress runs for the same workflow/ref.

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

- strict TypeScript correctness checks;
- ESLint;
- dependency audits;
- repository secret scanning;
- privacy/security design review;
- manual review of browser trust boundaries.

## CodeQL failure triage

Distinguish:

- **workflow/tool failure** — setup/autobuild/action infrastructure failed;
- **analysis alert** — CodeQL completed and found a potentially unsafe pattern.

For a real alert:

1. inspect data flow/reachability;
2. reproduce/understand the pattern;
3. fix the smallest responsible boundary;
4. add a regression test when practical;
5. rerun CodeQL;
6. do not dismiss solely to satisfy branch protection.

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

Runs when a pushed tag matches:

```text
v*.*.*
```

Examples:

```text
v0.1.0
v0.2.1
v1.0.0
```

The glob is syntactic; maintainers still need to apply release/version policy intentionally.

## Permission

```yaml
contents: write
```

Required because the workflow creates a GitHub Release and uploads assets.

Do not expose `github.token` to arbitrary untrusted shell input.

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

The standard local gate now includes:

- formatting;
- lint;
- type checks;
- application tests;
- secret-scanner tests;
- repository secret scan;
- documentation-link tests/local-link integrity;
- production build.

Important limitation: `npm run check` does not include Playwright E2E or the npm advisory audit. A release tag should be created only from a commit whose PR/CI browser/audit/security/manual gates were already reviewed.

### Build release

```bash
npm run build
```

The workflow intentionally rebuilds from the tagged commit rather than publishing an arbitrary local artifact.

### Package

```bash
cd dist && zip -r ../tablespark-web.zip .
```

The ZIP contains the contents of `dist/` at archive root.

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

The checksum lets a downloader detect byte-level modification relative to the workflow-produced digest.

It is **not** a digital signature or independent proof of publisher identity.

### Create release

The GitHub CLI receives `GH_TOKEN` from `github.token` and runs `gh release create` with:

- current tag from `GITHUB_REF_NAME`;
- ZIP artifact;
- checksum file;
- repository from `GITHUB_REPOSITORY`;
- generated release notes;
- `--verify-tag`.

If tag verification fails, do not remove the check just to publish. Diagnose the tag/repository state.

## Safe release sequence

Before pushing a tag:

1. freeze candidate SHA;
2. verify final-head PR `quality`, `e2e`, CodeQL, and visual evidence;
3. inspect screenshot artifact;
4. complete/manual-record required accessibility/Hindi/production-origin gates where applicable;
5. update changelog/version/release notes;
6. create annotated tag;
7. push intended tag;
8. inspect release workflow result;
9. download ZIP + checksum;
10. verify checksum independently;
11. deploy only after production host/origin approval.

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

The manual trigger can regenerate evidence without a source edit.

## Permission

```yaml
contents: read
```

The workflow does not modify/deploy the repository.

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

`if-no-files-found: error` prevents a misleading green upload step without screenshots.

Retention:

```text
30 days
```

Expected captures:

- light/wide;
- dark/wide;
- light/compact;
- dark/compact.

These are **real Chromium renderings of the built application**.

They still need human inspection for:

- clipping/overlap;
- awkward localization wrapping;
- typography;
- theme correctness;
- unexpected banners/state.

A green screenshot workflow is not proof of:

- Safari/Firefox rendering;
- screen-reader behavior;
- production hosting correctness;
- PWA installability/scope on final origin;
- Hindi linguistic quality.

# 5. Dependabot

File:

```text
.github/dependabot.yml
```

Configuration version:

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
- 04:00.

Open PR limit:

```text
10
```

Development dependency updates are grouped under:

```text
development-dependencies
```

Grouping reduces noisy one-PR-per-dev-package maintenance while runtime/security-sensitive updates can still receive focused scrutiny.

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
- compatibility with repository policies.

Do not auto-merge a major workflow action update solely because Dependabot opened it.

# 6. Generated release-note configuration

File:

```text
.github/release.yml
```

This is **not** the Actions release workflow. It configures GitHub's generated changelog/release-note grouping.

## Exclusion

PRs/issues labeled:

```text
skip-changelog
```

are excluded from generated notes.

Do not hide security-significant or user-visible changes merely for cleaner notes.

## Categories

Generated notes classify labels into:

- Features → `enhancement`
- Fixes → `bug`
- Accessibility → `accessibility`
- Documentation → `documentation`
- Dependencies → `dependencies`
- Other changes → wildcard fallback

Good labeling improves generated notes but does not replace maintained `CHANGELOG.md`.

# 7. Issue and pull-request automation surfaces

Files:

```text
.github/ISSUE_TEMPLATE/bug_report.md
.github/ISSUE_TEMPLATE/feature_request.md
.github/ISSUE_TEMPLATE/config.yml
.github/pull_request_template.md
```

Their role is contributor guidance rather than executable product code.

Privacy rule: templates should never request public upload of raw learner backups or unreadable recovery artifacts. Reproduction guidance should use synthetic/redacted examples.

# 8. Funding configuration

File:

```text
.github/FUNDING.yml
```

Exposes optional repository funding through GitHub UI.

Funding remains:

- optional;
- separate from core learning features;
- unrelated to access to privacy/security support;
- described without pressure/misleading urgency.

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

## Formatting/lint/type/application-test failure

Reproduce locally with the exact named npm command before changing unrelated code.

## Documentation-link failure

Run:

```bash
npm run test:docs
```

For a reported broken target:

1. inspect source Markdown and intended target;
2. fix stale/misspelled local path;
3. if the link is valid and checker parsing is wrong, add a focused checker test before changing `link-checker.mjs`;
4. rerun the full documentation gate.

Do not disable link checking merely because a large documentation commit created many failures.

## Build failure

Run:

```bash
npm run build
```

Check TypeScript first, then Vite/PWA diagnostics.

## E2E failure

Run failing spec locally:

```bash
npx playwright test e2e/<file>.spec.ts
```

If CI retried, inspect trace/test artifacts where available. Do not increase retries to hide deterministic failures.

## Audit failure

Identify whether advisory affects a production dependency/reachable use case. Upgrade/replace where possible. Document a deliberate risk decision if immediate remediation is impossible.

## CodeQL failure/alert

Separate infrastructure failure from an actual code-scanning result. Real alerts require investigation and remediation/reasoned disposition.

## Visual evidence failure

Determine whether:

- screenshot test failed to render;
- expected files were not created;
- artifact upload failed;
- workflow lacks browser/system dependency.

Even after green automation, manually inspect images.

## Release failure before GitHub Release creation

Do not manually create a release from an unverified partial artifact merely to bypass workflow failure. Fix the cause/rerun according to release policy.

## Faulty published release

Do not move the public tag silently. Follow rollback/patch guidance in `docs/release.md`.

# 11. Required-check maintenance

Whenever a workflow/job is renamed:

1. establish a successful run under new name;
2. inspect exact status/check names GitHub exposes;
3. update branch protection/rulesets;
4. update `docs/repository-settings.md` and `docs/quality-gates.md`;
5. remove obsolete impossible-to-satisfy required checks.

Branch protection follows actual check names, not guesses.

# 12. Automation-change checklist

For any `.github/workflows/*.yml` change:

- [ ] Review trigger scope.
- [ ] Review token permissions.
- [ ] Review third-party action publisher/version.
- [ ] Check untrusted PR data does not enter unsafe shell commands.
- [ ] Check secrets/tokens cannot reach untrusted code.
- [ ] Check artifact contents for private/sensitive data.
- [ ] Keep Node/tool versions synchronized.
- [ ] Re-run relevant workflow on a PR before relying on it.
- [ ] Update CI/CD, testing, release, quality-gate and repository-settings docs.
- [ ] Record release/verification behavior changes in `what_changed.md`.

For Dependabot/release-note configuration changes, also verify maintenance cadence/labels against current repository practice.
