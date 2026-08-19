# TableSpark Documentation Index

TableSpark has multiple documentation layers because a short README cannot safely contain setup, architecture, persistence, security, accessibility, localization, CI, and release procedures in full detail.

This index explains **which document to read for which task**, which document is authoritative for a subject, and how the docs relate to executable source/tests.

## Start here by audience

### I want to use TableSpark

Read:

1. [`README.md`](../README.md) — product overview, features, quick start, platform/support summary.
2. [`docs/user-guide.md`](user-guide.md) — detailed Tables, worksheet, Practice, Progress, Settings, backup/recovery, offline/PWA, keyboard use.
3. [`PRIVACY.md`](../PRIVACY.md) — what local data exists and what is/is not sent remotely.
4. [`SUPPORT.md`](../SUPPORT.md) — support/contact paths.
5. [`docs/troubleshooting.md`](troubleshooting.md) — common installation/runtime/storage/PWA problems.

### I want to set up a development machine

Read:

1. [`docs/setup.md`](setup.md) — installation/tool setup and upgrade guidance.
2. [`docs/commands-reference.md`](commands-reference.md) — exact meaning of every common repository command.
3. [`docs/configuration-reference.md`](configuration-reference.md) — what each config file controls.
4. [`docs/development.md`](development.md) — development workflow/conventions.
5. [`docs/git-workflow.md`](git-workflow.md) — branch/commit/PR workflow.

### I want to understand the codebase

Read:

1. [`docs/architecture.md`](architecture.md) — high-level architecture and dependency direction.
2. [`docs/domain-model.md`](domain-model.md) — mathematical/learning rules and domain types.
3. [`docs/state-and-persistence.md`](state-and-persistence.md) — React state, localStorage, migration, backup/recovery lifecycle.
4. [`docs/data-schema-v2.md`](data-schema-v2.md) — persisted schema fields/invariants.
5. [`docs/localization.md`](localization.md) — locale provider/catalog design.
6. [`docs/repository-file-reference.md`](repository-file-reference.md) — every tracked file and its purpose.

### I want to add/fix a feature

Read:

1. [`CONTRIBUTING.md`](../CONTRIBUTING.md)
2. [`docs/development.md`](development.md)
3. Relevant domain/state/architecture document.
4. [`docs/testing.md`](testing.md)
5. [`docs/accessibility.md`](accessibility.md)
6. [`docs/localization.md`](localization.md)
7. [`docs/maintenance.md`](maintenance.md)

Then update:

- direct tests;
- relevant user/engineering docs;
- `CHANGELOG.md` when release-visible;
- `what_changed.md` for continuation/handoff state.

### I want to work on persistence/backups

Read in this order:

1. [`docs/state-and-persistence.md`](state-and-persistence.md)
2. [`docs/data-schema-v2.md`](data-schema-v2.md)
3. [`docs/adr/0002-local-first-persistence.md`](adr/0002-local-first-persistence.md)
4. [`docs/adr/0004-preserve-unreadable-local-state.md`](adr/0004-preserve-unreadable-local-state.md)
5. [`PRIVACY.md`](../PRIVACY.md)
6. [`docs/security-model.md`](security-model.md)
7. [`docs/testing.md`](testing.md)

Do not change persisted fields without migration/compatibility review.

### I want to work on localization/Hindi

Read:

1. [`docs/localization.md`](localization.md)
2. [`docs/hindi-review-checklist.md`](hindi-review-checklist.md)
3. [`docs/accessibility.md`](accessibility.md)
4. [`docs/user-guide.md`](user-guide.md)
5. [`docs/testing.md`](testing.md)

Automated catalog parity does not replace fluent/native language review.

### I want to review accessibility

Read:

1. [`docs/accessibility.md`](accessibility.md)
2. [`docs/hindi-review-checklist.md`](hindi-review-checklist.md) for localized accessibility review.
3. [`docs/release-evidence.md`](release-evidence.md) for recording manual passes.
4. [`docs/testing.md`](testing.md) for automated accessibility invariant coverage.

### I want to review security/privacy

Read:

1. [`SECURITY.md`](../SECURITY.md) — vulnerability-reporting and public security policy.
2. [`PRIVACY.md`](../PRIVACY.md) — data/privacy statements.
3. [`docs/security-model.md`](security-model.md) — detailed engineering trust boundaries.
4. [`docs/state-and-persistence.md`](state-and-persistence.md) — local/import/recovery boundary.
5. [`docs/data-schema-v2.md`](data-schema-v2.md) — validation contract.
6. [`docs/ci-cd.md`](ci-cd.md) — Actions/dependency/code-scanning controls.

### I want to maintain dependencies/tooling

Read:

1. [`docs/maintenance.md`](maintenance.md)
2. [`docs/configuration-reference.md`](configuration-reference.md)
3. [`docs/commands-reference.md`](commands-reference.md)
4. [`docs/ci-cd.md`](ci-cd.md)
5. [`docs/testing.md`](testing.md)
6. [`docs/quality-gates.md`](quality-gates.md)

### I want to prepare a release

Read in this order:

1. [`CHANGELOG.md`](../CHANGELOG.md)
2. [`ROADMAP.md`](../ROADMAP.md)
3. [`docs/verification-plan.md`](verification-plan.md)
4. [`docs/quality-gates.md`](quality-gates.md)
5. [`docs/release.md`](release.md)
6. [`docs/release-evidence.md`](release-evidence.md)
7. [`docs/release-notes-template.md`](release-notes-template.md)
8. [`docs/ci-cd.md`](ci-cd.md)
9. [`docs/deployment-evaluation.md`](deployment-evaluation.md)
10. [`what_changed.md`](../what_changed.md)

A release tag should not be created merely because source work is “done.” Evidence must correspond to the frozen candidate SHA.

### I want to deploy/package the app

Read:

1. [`docs/deployment-evaluation.md`](deployment-evaluation.md)
2. [`docs/native-packaging-evaluation.md`](native-packaging-evaluation.md)
3. [`docs/release.md`](release.md)
4. [`docs/release-evidence.md`](release-evidence.md)
5. [`docs/configuration-reference.md`](configuration-reference.md) — Vite/PWA base/scope concerns.

Production deployment/native packaging still require explicit owner-approved decisions where documented.

## Document-by-document catalog

### Root public/project documents

| File | Main purpose |
| --- | --- |
| `README.md` | Public project landing page, features, quick start, high-level architecture/testing/privacy/docs links. |
| `CHANGELOG.md` | Release-facing notable changes by version/Unreleased category. |
| `ROADMAP.md` | Planned/completed product direction and explicit external/manual gates. |
| `PRIVACY.md` | User-facing local data, backup, locale, PWA, logging and deletion privacy behavior. |
| `SECURITY.md` | Vulnerability reporting, supported-version policy and public security model summary. |
| `SUPPORT.md` | User/contributor support channels and safe information-sharing guidance. |
| `CONTRIBUTING.md` | Contribution expectations and review workflow. |
| `CODE_OF_CONDUCT.md` | Community participation standards. |
| `LICENSE` | MIT license terms. |
| `what_changed.md` | Current implementation/verification handoff ledger, especially useful across continuation sessions. |

### Core engineering guides

| File | Main purpose |
| --- | --- |
| `docs/architecture.md` | Layer/module architecture, dependency direction, major decisions. |
| `docs/domain-model.md` | Pure multiplication/practice/mastery/session/worksheet rules and invariants. |
| `docs/state-and-persistence.md` | State actions, localStorage lifecycle, migration/import/export/recovery. |
| `docs/data-schema-v2.md` | Field-level persisted schema-2 reference. |
| `docs/security-model.md` | Engineering trust boundaries and threat model. |
| `docs/localization.md` | Locale architecture, adding languages, storage/testing guidance. |
| `docs/accessibility.md` | Accessibility implementation, automation/manual matrix/checklists. |
| `docs/performance.md` | Performance budgets, measurement and optimization rules. |

### Setup/development/maintenance

| File | Main purpose |
| --- | --- |
| `docs/setup.md` | Tool installation/upgrade across supported development environments. |
| `docs/commands-reference.md` | Exact command meanings, outputs and failure resolution. |
| `docs/configuration-reference.md` | Every major configuration surface and synchronization rules. |
| `docs/development.md` | Daily development workflow and coding practices. |
| `docs/git-workflow.md` | Git branch/commit/push/PR expectations. |
| `docs/testing.md` | Test layers, commands, boundaries and release test strategy. |
| `docs/quality-gates.md` | Quality/security checks required before merge/release. |
| `docs/ci-cd.md` | GitHub Actions, Dependabot, artifacts, permissions and triage. |
| `docs/maintenance.md` | Recurring dependency/schema/docs/PWA/release maintenance handbook. |
| `docs/troubleshooting.md` | Common setup/runtime/storage/build/PWA/test problems. |
| `docs/glossary.md` | Precise project terminology. |

### User/product/review guides

| File | Main purpose |
| --- | --- |
| `docs/user-guide.md` | Full end-user feature guide. |
| `docs/hindi-review-checklist.md` | Fluent/native Hindi terminology/layout/print/accessibility review. |
| `docs/release-evidence.md` | Evidence recording template; intentionally marks unexecuted checks as pending. |
| `docs/release-notes-template.md` | Consistent release-note drafting structure. |
| `docs/verification-plan.md` | Candidate verification sequence. |

### Distribution/repository administration

| File | Main purpose |
| --- | --- |
| `docs/release.md` | Tag/package/checksum/release/rollback process. |
| `docs/deployment-evaluation.md` | Static-host candidates and approval/validation gate. |
| `docs/native-packaging-evaluation.md` | TWA/wrapper/native evaluation and current PWA decision. |
| `docs/repository-settings.md` | Recommended branch protection/rules/check configuration. |

### Architecture Decision Records

| ADR | Decision |
| --- | --- |
| `0001-typescript-react-pwa.md` | Use TypeScript + React + PWA architecture. |
| `0002-local-first-persistence.md` | Keep core learner data local-first. |
| `0003-deterministic-practice.md` | Use reproducible seeded generated practice. |
| `0004-preserve-unreadable-local-state.md` | Preserve unreadable existing local state until explicit recovery action. |

ADRs explain why a foundational choice was made at a point in time. The current source/architecture docs describe the current implementation if later work has refined details.

## Documentation source-of-truth hierarchy

Documentation cannot replace executable behavior.

Use this priority when facts conflict:

### Runtime/domain/persistence behavior

1. executable source + direct tests;
2. schema/domain/state engineering docs;
3. user guide/README;
4. historical ADR/changelog notes.

### Security reporting policy

1. `SECURITY.md`;
2. current repository security settings/workflows;
3. `docs/security-model.md` engineering explanation.

### Privacy statement

1. actual source/network/storage behavior;
2. `PRIVACY.md` public policy;
3. engineering docs.

A mismatch between code and privacy policy is a release blocker, not an excuse to pick whichever text is convenient.

### Release process

1. actual workflow/configuration;
2. `docs/release.md`;
3. `docs/ci-cd.md`;
4. evidence/verification templates.

### Current continuation status

1. current branch/PR/check state in GitHub;
2. `what_changed.md` as the maintained handoff snapshot.

## Documentation categories: normative vs explanatory

### Normative/operational

These tell maintainers what must be done:

- security/privacy policies;
- contributing/community policies;
- release/verification procedures;
- quality gates;
- schema constraints;
- branch/repository settings guidance.

### Explanatory

These explain structure/reasoning:

- architecture;
- domain model;
- glossary;
- configuration reference;
- performance;
- ADRs.

Both need to remain accurate, but normative docs especially must not claim actions/tests were completed when they were not.

## Documentation update matrix

### New user-facing feature

Review/update:

- README;
- user guide;
- locale catalogs/Hindi review;
- accessibility;
- testing;
- changelog;
- roadmap if planned item;
- `what_changed.md`.

### New persisted field

Review/update:

- domain types;
- storage validator;
- migrations/version;
- schema doc;
- state/persistence doc;
- privacy/security;
- backup/user guide;
- tests;
- changelog/handoff.

### New dependency/tool

Review/update:

- package manifest;
- setup/commands/configuration;
- maintenance/security;
- CI if needed;
- repository file reference;
- changelog/handoff if significant.

### Workflow change

Review/update:

- CI/CD guide;
- quality gates;
- repository settings required checks;
- release/testing docs where affected;
- maintenance;
- handoff.

### New file

At minimum update:

- `docs/repository-file-reference.md`;
- this documentation index if it is a documentation/public workflow file;
- relevant specialized guide.

## Generated/illustrative documentation assets

`docs/assets/interface-preview.svg` is an interface preview illustration, not a real release screenshot.

Real release screenshots are generated through Playwright/Actions and stored as workflow artifacts rather than committed as fabricated proof.

## Documentation validation

Local repository link utilities:

```bash
node --test scripts/link-checker.test.mjs
node scripts/link-check.mjs
```

Markdown is not currently included in the package-level Prettier script. Review Markdown formatting manually and use the local link checker for path integrity.

## Completeness rule

`docs/repository-file-reference.md` is the canonical “no tracked file skipped” inventory for documentation purposes.

Whenever the repository adds/removes/renames a tracked file, update that reference in the same change series so the file map does not silently become stale.
