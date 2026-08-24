# TableSpark Documentation Index

TableSpark 2.0.12 has multiple documentation layers because a short README cannot safely contain setup, shared web/native architecture, persistence, security, accessibility, localization, CI, platform build, signing, and release procedures in full detail.

This index explains which document is authoritative for each task and how documentation relates to executable source/tests.

## Start here by task

### I want to use TableSpark

Read:

1. [`README.md`](../README.md) — product overview, features, supported platforms, quick starts.
2. [`docs/user-guide.md`](user-guide.md) — detailed feature usage.
3. [`PRIVACY.md`](../PRIVACY.md) — local data/privacy behavior across browser/native installations.
4. [`SUPPORT.md`](../SUPPORT.md) — support/contact paths.
5. [`docs/troubleshooting.md`](troubleshooting.md) — common setup/runtime/storage problems.

### I want to build the web/PWA

Read:

1. [`docs/setup.md`](setup.md)
2. [`docs/commands-reference.md`](commands-reference.md)
3. [`docs/configuration-reference.md`](configuration-reference.md)
4. [`docs/development.md`](development.md)
5. [`docs/testing.md`](testing.md)

### I want to build Windows/macOS/Linux/Android/iOS

Read in this order:

1. [`docs/native-packaging-evaluation.md`](native-packaging-evaluation.md) — implemented Tauri 2 architecture and platform model.
2. [`docs/setup.md`](setup.md) — Rust/platform SDK prerequisites.
3. [`docs/commands-reference.md`](commands-reference.md) — exact native/mobile commands.
4. [`docs/configuration-reference.md`](configuration-reference.md) — `src-tauri`, Vite target defines, CSP/capabilities, mobile minimums.
5. [`docs/testing.md`](testing.md) — native config tests, desktop/mobile compile CI, real-device boundary.
6. [`docs/ci-cd.md`](ci-cd.md) — Native Cross-Platform workflow.
7. [`docs/release.md`](release.md) — signing/distribution procedure.
8. [`docs/release-evidence.md`](release-evidence.md) — per-platform evidence matrix.

Cross-platform source/build support is implemented. Signed public installers/store packages remain release-operation evidence, not something inferred from source alone.

### I want to understand the codebase

Read:

1. [`docs/architecture.md`](architecture.md) — shared React/web/PWA/Tauri architecture and dependency direction.
2. [`docs/domain-model.md`](domain-model.md) — mathematical/learning rules.
3. [`docs/state-and-persistence.md`](state-and-persistence.md) — React state, four storage startup states, migration/backup/recovery.
4. [`docs/data-schema-v2.md`](data-schema-v2.md) — persisted schema fields/invariants.
5. [`docs/security-model.md`](security-model.md) — browser/native trust boundaries.
6. [`docs/localization.md`](localization.md) — locale provider/catalog design.
7. [`docs/repository-file-reference.md`](repository-file-reference.md) — exhaustive tracked-file map.

### I want to add/fix a shared feature

Read:

1. [`CONTRIBUTING.md`](../CONTRIBUTING.md)
2. [`docs/development.md`](development.md)
3. relevant domain/state/architecture document
4. [`docs/testing.md`](testing.md)
5. [`docs/accessibility.md`](accessibility.md)
6. [`docs/localization.md`](localization.md)
7. [`docs/maintenance.md`](maintenance.md)

Prefer shared TypeScript/domain implementation. Add a platform/native branch only when a real native API is required.

Then update direct tests, relevant docs, `CHANGELOG.md` when release-visible, and `what_changed.md` for handoff state.

### I want to add/change a native permission

Read/review:

1. [`docs/architecture.md`](architecture.md) — platform/native boundary.
2. [`docs/security-model.md`](security-model.md) — least-privilege threat model.
3. [`SECURITY.md`](../SECURITY.md) — public security policy.
4. [`PRIVACY.md`](../PRIVACY.md) — privacy consequences.
5. [`docs/configuration-reference.md`](configuration-reference.md) — Tauri capability/CSP configuration.
6. [`docs/testing.md`](testing.md) — config and real-platform verification.
7. [`docs/release-evidence.md`](release-evidence.md) — native evidence.

Never broaden Tauri permissions merely for convenience. The current shell grants core defaults plus exact allowlisted external destinations only.

### I want to work on persistence/backups

Read:

1. [`docs/state-and-persistence.md`](state-and-persistence.md)
2. [`docs/data-schema-v2.md`](data-schema-v2.md)
3. [`docs/adr/0002-local-first-persistence.md`](adr/0002-local-first-persistence.md)
4. [`docs/adr/0004-preserve-unreadable-local-state.md`](adr/0004-preserve-unreadable-local-state.md)
5. [`PRIVACY.md`](../PRIVACY.md)
6. [`docs/security-model.md`](security-model.md)
7. [`docs/testing.md`](testing.md)

Browser/PWA and native installations use separate platform-managed storage. Validated backup export/import is the supported cross-platform transfer path.

### I want to work on localization/Hindi

Read:

1. [`docs/localization.md`](localization.md)
2. [`docs/hindi-review-checklist.md`](hindi-review-checklist.md)
3. [`docs/accessibility.md`](accessibility.md)
4. [`docs/testing.md`](testing.md)
5. [`docs/release-evidence.md`](release-evidence.md)

Automated catalog/browser coverage does not replace fluent/native review, especially on narrow native mobile layouts and assistive technology.

### I want to review accessibility

Read:

1. [`docs/accessibility.md`](accessibility.md)
2. [`docs/hindi-review-checklist.md`](hindi-review-checklist.md)
3. [`docs/testing.md`](testing.md)
4. [`docs/release-evidence.md`](release-evidence.md)

The shared React UI reduces divergence but real NVDA/Narrator/VoiceOver/TalkBack behavior must still be tested on intended browser/native hosts.

### I want to review security/privacy

Read:

1. [`SECURITY.md`](../SECURITY.md)
2. [`PRIVACY.md`](../PRIVACY.md)
3. [`docs/security-model.md`](security-model.md)
4. [`docs/state-and-persistence.md`](state-and-persistence.md)
5. [`docs/data-schema-v2.md`](data-schema-v2.md)
6. [`docs/native-packaging-evaluation.md`](native-packaging-evaluation.md)
7. [`docs/ci-cd.md`](ci-cd.md)

Native-specific topics include capability allowlists, CSP, per-install storage isolation, generated-project boundaries, and signing-secret handling.

### I want to maintain dependencies/tooling

Read:

1. [`docs/maintenance.md`](maintenance.md)
2. [`docs/configuration-reference.md`](configuration-reference.md)
3. [`docs/commands-reference.md`](commands-reference.md)
4. [`docs/ci-cd.md`](ci-cd.md)
5. [`docs/testing.md`](testing.md)
6. [`docs/quality-gates.md`](quality-gates.md)

Tauri JavaScript/Rust/plugin upgrades should be reviewed as one native toolchain change, including permission/platform implications.

### I want to prepare/release 2.0.12

Read in this order:

1. [`CHANGELOG.md`](../CHANGELOG.md)
2. [`ROADMAP.md`](../ROADMAP.md)
3. [`docs/verification-plan.md`](verification-plan.md)
4. [`docs/quality-gates.md`](quality-gates.md)
5. [`docs/testing.md`](testing.md)
6. [`docs/ci-cd.md`](ci-cd.md)
7. [`docs/release.md`](release.md)
8. [`docs/release-evidence.md`](release-evidence.md)
9. [`docs/release-notes-template.md`](release-notes-template.md)
10. [`docs/deployment-evaluation.md`](deployment-evaluation.md)
11. [`docs/native-packaging-evaluation.md`](native-packaging-evaluation.md)
12. [`what_changed.md`](../what_changed.md)

A release tag must correspond to a frozen exact SHA. Successful debug/simulator native builds are not the same as signed public native packages.

## Document catalog

### Root public/project documents

| File | Main purpose |
| --- | --- |
| `README.md` | Cross-platform public landing page, features, platform matrix, web/native quick starts. |
| `CHANGELOG.md` | Versioned release-visible changes, including the 2.0.12 cross-platform candidate. |
| `ROADMAP.md` | Completed/planned source/build work and external/manual/signing gates. |
| `PRIVACY.md` | Local data behavior across browser/native installations and backup portability. |
| `SECURITY.md` | Vulnerability reporting plus public browser/native security/signing policy. |
| `SUPPORT.md` | Support/contact guidance. |
| `CONTRIBUTING.md` | Contribution/review expectations. |
| `CODE_OF_CONDUCT.md` | Community standards. |
| `LICENSE` | MIT license. |
| `what_changed.md` | Current implementation/checkpoint/handoff ledger. |

### Core engineering guides

| File | Main purpose |
| --- | --- |
| `docs/architecture.md` | Shared web/PWA/Tauri architecture, platform boundary, dependency direction. |
| `docs/domain-model.md` | Pure learning/domain rules. |
| `docs/state-and-persistence.md` | State/storage/migration/transactional backup/recovery lifecycle. |
| `docs/data-schema-v2.md` | Persisted schema-2 reference. |
| `docs/security-model.md` | Detailed browser/native threat and trust boundaries. |
| `docs/native-packaging-evaluation.md` | Implemented Tauri 2 targets, native commands, generated-output/signing model. |
| `docs/localization.md` | Locale architecture/adding translations. |
| `docs/accessibility.md` | Accessibility implementation and manual matrix. |
| `docs/performance.md` | Performance budgets/measurement. |

### Setup/development/maintenance

| File | Main purpose |
| --- | --- |
| `docs/setup.md` | Web/Rust/Tauri/Windows/macOS/Linux/Android/iOS prerequisites and setup. |
| `docs/commands-reference.md` | Web/native/mobile command behavior and failure guidance. |
| `docs/configuration-reference.md` | Package/Vite/Tauri/CSP/capability/mobile config synchronization. |
| `docs/development.md` | Daily development conventions. |
| `docs/git-workflow.md` | Git branch/commit/PR expectations. |
| `docs/testing.md` | Shared/browser/native compile/manual/signing verification layers. |
| `docs/quality-gates.md` | Merge/release quality/security gate expectations. |
| `docs/ci-cd.md` | Five workflows, including Native Cross-Platform build matrix. |
| `docs/maintenance.md` | Recurring toolchain/schema/docs/release maintenance. |
| `docs/troubleshooting.md` | Common development/runtime problems. |
| `docs/glossary.md` | Project terminology. |

### User/review/release guides

| File | Main purpose |
| --- | --- |
| `docs/user-guide.md` | End-user feature guide. |
| `docs/hindi-review-checklist.md` | Hindi terminology/layout/print/accessibility review. |
| `docs/release-evidence.md` | Exact-head web/native/manual/signing evidence matrix. |
| `docs/release-notes-template.md` | Release-note structure. |
| `docs/verification-plan.md` | Candidate verification sequence. |
| `docs/release.md` | Web/native release, signing, tag, checksum, rollback procedure. |
| `docs/deployment-evaluation.md` | Web static-host evaluation and approval gate. |
| `docs/repository-settings.md` | Recommended branch protection/check settings. |

### Architecture Decision Records

| ADR | Scope |
| --- | --- |
| `0001-typescript-react-pwa.md` | TypeScript/React/PWA foundation. |
| `0002-local-first-persistence.md` | Local-first learner persistence. |
| `0003-deterministic-practice.md` | Reproducible seeded practice. |
| `0004-preserve-unreadable-local-state.md` | Preserve invalid returned data until explicit recovery. |

ADRs describe decisions at a point in time. Current architecture/reference docs are authoritative when later explicit requirements supersede an earlier evaluation detail. In particular, the cross-platform requirement supersedes the old native-packaging deferral; `docs/native-packaging-evaluation.md` now documents the implemented Tauri approach.

## Source-of-truth hierarchy

### Runtime/domain behavior

1. executable source + direct tests;
2. domain/state/schema/architecture references;
3. user guide/README;
4. historical ADR/changelog text.

### Native platform configuration

1. tracked `src-tauri/`, `vite.config.ts`, `package.json`, `src/platform/`;
2. native config tests/check;
3. `docs/configuration-reference.md` / `docs/native-packaging-evaluation.md`;
4. README/other summaries.

### Security/privacy

1. actual source/permissions/storage/network behavior;
2. `SECURITY.md` / `PRIVACY.md` public contracts;
3. `docs/security-model.md` explanation.

Code/policy mismatch is a release blocker.

### Release process

1. actual workflows/configuration;
2. `docs/release.md`;
3. `docs/ci-cd.md`;
4. verification/evidence templates.

### Current candidate status

1. current GitHub branch/PR/check state;
2. `what_changed.md` handoff snapshot.

Do not use a tracked “final SHA” field that becomes stale when the file is committed.

## Documentation update matrix

### New shared user feature

Review/update README, user guide, locale catalogs/Hindi review, accessibility, testing, changelog/roadmap, and handoff.

### New persisted field/schema change

Review/update domain types, validator, migrations/schema version, state/persistence/schema docs, privacy/security, backup/user docs, tests, changelog/handoff.

### New native permission/plugin

Review/update package/Cargo deps, Tauri capability/config, platform adapter, native config tests, architecture/security/privacy/native packaging docs, native CI if necessary, release evidence, repository-file inventory, changelog/handoff.

### Native minimum/identifier/version change

Synchronize package/Cargo/Tauri config, visible UI version when relevant, native config tests, README/platform claims, setup/release/security docs, signing/store identity records.

### Workflow change

Review/update CI/CD, testing/quality gates, repository settings, release docs, handoff.

### New/remove/rename tracked file

Update `docs/repository-file-reference.md` exhaustive inventory/count in the same change series. Update this index if the file changes documentation/navigation or a major workflow/tool surface.

## Generated assets are not tracked-source completeness items

Generated/untracked outputs such as:

```text
node_modules/
dist/
coverage/
playwright-report/
test-results/
src-tauri/target/
src-tauri/gen/
src-tauri/icons/
```

are not counted as tracked repository source files.

`docs/assets/interface-preview.svg` is a repository illustration, not release screenshot evidence. Real browser evidence is produced by the visual workflow and manually reviewed.

## Documentation validation

Formal local link gate:

```bash
npm run test:docs
```

Markdown is review-formatted manually rather than included in the package-level Prettier script.

## Completeness rule

`docs/repository-file-reference.md` is the canonical “no tracked file skipped” documentation inventory.

Whenever tracked files are added/removed/renamed, update its current count and entries before freezing a release candidate.
