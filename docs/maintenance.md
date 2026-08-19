# TableSpark Maintenance Handbook

This handbook describes recurring repository maintenance after feature implementation: dependency/toolchain upkeep, schema compatibility, localization, PWA behavior, accessibility, documentation drift, security, release preparation, and post-release housekeeping.

It is intentionally operational. Architecture decisions are explained elsewhere; this file focuses on **what maintainers should routinely check and how to change the project without creating hidden drift**.

# Maintenance principles

1. Prefer small, reviewable commits.
2. Keep source, tests, configuration, and documentation synchronized.
3. Never mark a manual/external verification gate passed without evidence.
4. Treat persisted-data compatibility as a release concern, not only a TypeScript concern.
5. Treat GitHub workflow changes as executable supply-chain code.
6. Preserve unreadable learner state rather than “repairing” it destructively.
7. Keep optional goals/donations/install prompts non-coercive.
8. Add dependencies only when their value exceeds maintenance/security cost.
9. Keep core learning usable without an account/network after PWA assets are cached.
10. Do not let documentation become a historical description of a product that no longer exists.

# Recommended maintenance cadence

## On every pull request

Review:

- source behavior;
- direct tests;
- TypeScript/lint impact;
- persistence compatibility;
- accessibility semantics;
- localization impact;
- privacy/security impact;
- documentation links/content;
- release notes/changelog relevance.

Required automated evidence should include current PR checks for the final head SHA.

## Weekly

When update PRs exist:

- review Dependabot npm changes;
- review GitHub Actions version changes;
- inspect CodeQL scheduled results;
- check unresolved security/dependency alerts;
- close/supersede stale automated update PRs only with a documented reason.

## Monthly or before a release train

- run local full checks from a clean clone;
- review current Node/npm support;
- review bundle/build output;
- review privacy/security docs against current data fields;
- inspect roadmap and remove completed/stale promises;
- audit local links/documentation index;
- inspect release evidence/manual-gate status;
- review screenshots on current candidate rather than reusing old ones.

## Before every public release

Use `docs/release.md` and `docs/release-evidence.md` as the authoritative operational checklists.

# Dependency maintenance

## Runtime dependencies

Current runtime dependencies are deliberately limited.

A runtime dependency update can affect every user because its code may enter the browser bundle.

Review:

- package ownership/repository;
- changelog/release notes;
- breaking changes;
- browser compatibility;
- bundle-size impact;
- security advisories;
- new network/browser behavior;
- transitive dependencies.

After changing runtime dependencies:

```bash
npm install
npm run check
npm run test:e2e
npm audit --omit=dev --audit-level=high
```

Inspect `npm run build` output sizes.

## Development dependencies

Tooling updates can still be security/reliability significant because they execute in developer/CI environments.

Examples:

- TypeScript can expose new type errors;
- ESLint/plugin updates can introduce/retire rules;
- Vite/PWA updates can change generated service-worker behavior;
- Playwright updates can change browser binaries/semantics;
- GitHub Actions updates can change CI execution.

Do not dismiss development dependency changes as “non-production” without testing.

## Lock/dependency reproducibility

Use the repository's npm metadata consistently. If dependency install behavior changes, verify CI and clean-clone installation rather than assuming an existing `node_modules/` directory proves correctness.

# Node/npm toolchain upgrades

Values to synchronize:

- `.nvmrc`;
- `package.json` engines;
- every Actions `setup-node` version;
- setup/development/command docs.

Upgrade procedure:

1. choose supported Node release;
2. update all synchronized locations;
3. delete/recreate local dependencies if necessary;
4. run `npm run check`;
5. install Playwright browser if toolchain update invalidated it;
6. run `npm run test:e2e`;
7. verify production build/preview;
8. record upgrade in changelog/handoff.

# TypeScript maintenance

Strictness options are deliberate safeguards.

When a TypeScript upgrade reports new errors:

- first determine whether the new diagnostic reveals a real issue;
- prefer fixing code/types;
- avoid broadly disabling strict rules;
- update typed test fixtures when a domain schema intentionally changes;
- verify locale catalogs still satisfy structural contracts.

If a compiler option changes, document why and its safety implications in configuration/architecture docs.

# ESLint/Prettier maintenance

## ESLint

When updating ESLint/plugins:

1. inspect new/reclassified rules;
2. run repository lint;
3. do not blanket-disable accessibility or Hooks rules merely to remove errors;
4. record project-specific exceptions in `eslint.config.js` and documentation.

## Prettier

When updating Prettier:

1. run `npm run format:check` first;
2. run `npm run format` intentionally;
3. review the potentially large formatting diff separately from logic changes where possible;
4. ensure formatting globs still cover newly added source/config file types.

# Domain rule maintenance

See `docs/domain-model.md`.

Any change to:

- table numeric bounds;
- row budget;
- practice ranges/counts;
- seed range/generator;
- mastery canonicalization;
- mastery threshold;
- mistake retention;
- session retention;
- goal bounds

must include direct domain tests and review every dependent UI/storage/documentation location.

## Seed generator compatibility

The same seed currently reproduces the same sequence under the current algorithm.

Changing `mulberry32` or question-generation order is a behavior compatibility change. Existing session summaries retain seeds, so a future algorithm change could make “replay this historical seed” produce a different sequence.

If changing the generator:

- document compatibility impact;
- consider generator versioning if historical replay matters;
- update deterministic tests;
- update user/release docs.

# Persistence/schema maintenance

See `docs/state-and-persistence.md` and `docs/data-schema-v2.md`.

## Rule

A persisted shape change is never complete with only a TypeScript interface edit.

Required review areas:

- domain type;
- schema version;
- migration;
- Zod validation;
- default state;
- UI action/state transitions;
- backup import/export;
- tests with old/current/malformed data;
- privacy/security/schema docs;
- changelog.

## Backward compatibility

Keep import support for known older backups when migration is safe and product requirements allow it.

Never silently reinterpret an unknown future schema as current data.

## Storage key

Do not casually rename `tablespark.state.v1`. The key and schema version are separate. A key rename needs its own migration/recovery plan.

# LocalStorage capacity maintenance

Current application budget is 2 MB even if browsers allow more.

If new fields cause legitimate state to approach the limit:

1. measure real/synthetic state sizes;
2. reduce redundant storage first;
3. consider bounded summaries rather than raw event accumulation;
4. document any size-limit change;
5. test near-limit import/save behavior;
6. avoid assuming all browsers provide identical quotas.

# Localization maintenance

See `docs/localization.md` and `docs/hindi-review-checklist.md`.

## Adding English UI text

Before putting a string directly in a feature component, ask whether it is human-facing/localizable.

Human-facing copy belongs in the typed message catalog.

Language-neutral technical identifiers may remain direct when appropriate, for example:

- product name;
- version number;
- seed numeric value;
- email address;
- GitHub URL.

## Updating message catalogs

When adding a message:

1. update English source catalog;
2. update Hindi catalog;
3. rely on type/catalog-parity tests to catch missing structure;
4. add/update runtime tests for important dynamic/error paths;
5. manually review long strings on compact layouts.

## Adding a language

Follow `docs/localization.md` completely, including `html lang`, persistence, E2E, accessibility, print, and fluent-speaker review.

# Hindi maintenance

Automated catalog parity cannot evaluate translation quality.

For major UI/content changes:

- update Hindi copy in the same feature series;
- run localized error/switch E2E;
- review new terminology with the Hindi checklist before release-quality claims;
- inspect 320–390 px layouts and print output.

# Accessibility maintenance

See `docs/accessibility.md`.

For every new control/state:

- use semantic native element when possible;
- provide visible label;
- provide accessible name/description;
- ensure keyboard operation;
- preserve visible focus;
- avoid color-only meaning;
- test compact/large-text/200% zoom;
- consider screen-reader announcement timing;
- add stable automation where possible without pretending automation proves WCAG conformance.

For modal-like UI, manage focus entry/containment/return, not only ARIA roles.

# CSS/layout maintenance

Important files:

```text
src/styles.css
src/status.css
src/shortcuts.css
src/learning.css
```

When changing CSS:

- review light and dark themes;
- compact and wide layouts;
- large-text mode;
- reduced motion;
- Hindi strings;
- print media where relevant;
- focus state/contrast;
- overflow/horizontal scrolling.

`src/styles.css` and `src/status.css` are currently excluded from Prettier, so manual consistency/review matters.

# Print maintenance

Worksheet print behavior is part of the product, not incidental CSS.

When changing tables/worksheet layout:

- run `e2e/print.spec.ts`;
- manually inspect browser print preview;
- check A4 and US Letter;
- check 1/2/3 columns;
- verify answer-key metadata omission;
- verify active profile name is not inserted;
- inspect Hindi headings/glyphs;
- verify equation cards are not unreadably split.

# PWA/service-worker maintenance

See Vite configuration and PWA docs.

Review after Vite/PWA plugin updates:

- manifest output;
- service-worker registration;
- precache asset patterns;
- navigation fallback;
- update-ready callback behavior;
- offline-ready callback;
- install prompt behavior;
- production base/scope assumptions.

Do not verify PWA installability solely on the development server. Use a real production build and, for final evidence, the approved HTTPS production origin.

# Production-host maintenance

No production host is currently activated by repository evaluation alone.

After a host is approved:

- document owner/account access;
- protect deployment credentials/settings;
- verify HTTPS/custom-domain behavior;
- verify service-worker scope;
- record rollback mechanism;
- monitor broken deploys without adding learner telemetry by default;
- update deployment/evidence docs.

# GitHub Actions maintenance

See `docs/ci-cd.md`.

When updating actions:

- confirm official/expected publisher;
- review major-version notes;
- review permissions;
- check untrusted-data interpolation;
- preserve Node version sync;
- run workflow on a PR;
- update branch-protection required checks if job names change.

# Dependabot maintenance

Current update cadence is weekly.

If update volume becomes noisy:

- prefer grouping compatible development dependencies;
- avoid disabling security-relevant updates entirely;
- document cadence changes;
- retain human review for major upgrades.

# Secret-scanner maintenance

Files:

```text
scripts/secret-scanner.mjs
scripts/secret-scanner.test.mjs
scripts/secret-scan.mjs
```

When adding a credential signature:

1. use a pattern specific enough to avoid overwhelming false positives;
2. add positive test;
3. add negative/ordinary-text test where useful;
4. ensure output does not echo the secret;
5. run scanner against current repo;
6. document new coverage if significant.

Do not store a real credential in tests. Use clearly synthetic samples.

# Documentation-link checker maintenance

Files:

```text
scripts/link-checker.mjs
scripts/link-checker.test.mjs
scripts/link-check.mjs
```

When adding new Markdown structure/path handling:

- update checker tests;
- run direct link-check command;
- keep checks deterministic/offline for local repository paths.

If link checking becomes part of `npm run check`, update CI/quality/commands docs together.

# Documentation maintenance

The documentation system has topic guides plus `docs/repository-file-reference.md` as a complete tracked-file map.

Whenever adding/removing a tracked file:

- update the repository file reference;
- update `docs/documentation-index.md` if it is a public documentation surface;
- update README links if user/contributor discoverability changes.

Whenever changing product behavior:

review at minimum:

- README;
- user guide;
- changelog;
- what_changed;
- relevant architecture/domain/state/security/privacy/accessibility/testing docs.

## Avoiding documentation claims without evidence

Do not write:

- “screen-reader tested” before actual assisted testing;
- “production ready/deployed” before a real production origin is approved/verified;
- “Hindi translation reviewed” before fluent/native review;
- “all checks pass” based on an older SHA;
- “offline install works” solely because service-worker source exists.

Use `Not run`, `Pending`, or exact automated evidence instead.

# README maintenance

README is the public entry point, not the place for every implementation detail.

Keep it:

- accurate;
- feature-focused;
- quick-start friendly;
- linked to deep docs;
- clear about preview vs real screenshots;
- clear about local data/privacy;
- clear about optional funding.

Move long specialized procedures into `docs/` and link them.

# Changelog maintenance

`CHANGELOG.md` describes user/maintainer-visible changes.

Use categories consistently:

- Added;
- Changed;
- Security;
- Accessibility;
- Fixed.

Do not treat `what_changed.md` as a replacement for release-facing changelog entries; the handoff can be more detailed and branch-specific.

# `what_changed.md` maintenance

This is the continuation/handoff ledger.

Update it after meaningful work with:

- implemented changes;
- commit/checkpoint identifiers where useful;
- verification completed;
- verification still pending;
- blockers requiring owner/manual/external action.

It should never claim an external/manual gate passed when no evidence exists.

# Repository metadata/governance maintenance

Review periodically:

- `CONTRIBUTING.md`;
- `CODE_OF_CONDUCT.md`;
- `SECURITY.md`;
- `SUPPORT.md`;
- issue templates;
- PR template;
- funding file;
- repository settings/branch protection.

Contact/support information should remain current and consistent.

# Release version maintenance

Version appears in multiple places (package metadata and visible UI copy/documentation).

Before release:

1. select version;
2. update package/app-visible version consistently;
3. move changelog Unreleased entries into version section;
4. update release notes;
5. freeze candidate;
6. complete evidence;
7. tag only verified commit.

Use the synchronized-values table in `docs/configuration-reference.md`.

# Release-artifact maintenance

Current release assets:

```text
tablespark-web.zip
tablespark-web.zip.sha256
```

If names/package layout change:

- release workflow;
- release docs;
- commands reference;
- evidence template;
- deployment procedure

must change together.

# Screenshot/evidence maintenance

Real screenshot spec lives at:

```text
e2e/release-evidence.spec.ts
```

Workflow:

```text
.github/workflows/visual-evidence.yml
```

When major UI surfaces change, consider adding representative evidence captures, but avoid creating huge artifact sets without a review need.

Screenshots should be generated from the real built app and manually inspected.

# Branch protection/ruleset maintenance

When CI jobs/workflows change names, required checks may become stale.

Procedure:

1. run new workflow/job successfully;
2. inspect exact check name in GitHub;
3. update branch protection/ruleset;
4. remove obsolete required check;
5. update repository-settings documentation.

Do not guess required check strings.

# Cleanup of generated files

Normally do not commit:

- `node_modules/`;
- `dist/`;
- `coverage/`;
- `.vite/`;
- `playwright-report/`;
- `test-results/`;
- logs;
- local `.env` files.

They are covered by `.gitignore`.

Before committing:

```bash
git status
```

Investigate unexpected generated/untracked output rather than adding it automatically.

# Clean-clone verification

A high-value maintenance test before significant releases/toolchain changes:

```bash
git clone <repo>
cd tablespark
npm install
npm run check
npx playwright install chromium
npm run test:e2e
```

A clean clone catches hidden dependencies on:

- untracked files;
- stale node_modules;
- local environment variables;
- cached build output;
- editor-generated configuration.

# Incident maintenance

## Bad release

- identify last known-good artifact/tag;
- stop/rollback deployment as documented;
- create a corrective patch release;
- do not silently move public tag;
- document incident/fix.

## Corrupted learner-state regression

- preserve original data behavior first;
- add regression fixture;
- avoid shipping an automatic destructive repair;
- provide migration/recovery path;
- update privacy/release notes if affected.

## Exposed secret

- revoke/rotate first;
- remove current source;
- assess history/artifacts;
- coordinate remediation/disclosure;
- update scanner/test only as defense in depth.

# Maintenance completion checklist

For a significant maintenance PR:

- [ ] Scope is focused and explained.
- [ ] Dependencies/config values synchronized.
- [ ] Direct tests updated.
- [ ] `npm run check` completed for final local candidate where possible.
- [ ] E2E completed when browser/build behavior changed.
- [ ] CI/CodeQL final-head evidence reviewed.
- [ ] Security/privacy impact reviewed.
- [ ] Persistence compatibility reviewed.
- [ ] Localization/accessibility impact reviewed.
- [ ] Relevant docs updated.
- [ ] `CHANGELOG.md` updated if release-visible.
- [ ] `what_changed.md` updated.
- [ ] Manual/external gates remain accurately marked pending when not executed.
