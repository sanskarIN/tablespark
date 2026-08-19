# Release Guide

This document defines a reproducible release process for TableSpark.

## Release principles

A release tag should point only to a commit that has passed the repository quality gates and a manual release-candidate review. Do not create a tag merely to make a workflow pass.

## 1. Update release metadata

Before tagging:

- choose the semantic version;
- update `package.json` version if needed;
- move completed entries from `CHANGELOG.md` Unreleased into the version section;
- update `ROADMAP.md` if priorities changed;
- update `what_changed.md` with the release candidate status;
- verify documentation describes the actual product.

## 2. Install dependencies

```bash
npm install
```

Use the supported Node.js/npm versions documented in `docs/setup.md`.

## 3. Run quality gates

```bash
npm run check
npm run test:e2e
```

Do not release with failing formatting, lint, types, tests, build, or primary browser journeys.

## 4. Review production dependencies

```bash
npm audit --omit=dev --audit-level=high
```

A high-severity production finding requires investigation before release. Do not hide an audit failure by lowering the severity threshold without documenting the risk decision.

## 5. Preview the production build

```bash
npm run build
npm run preview
```

The `build` command type-checks and creates production assets under `dist/`. The `preview` command serves the already-built output rather than using the development transform pipeline.

Manually review:

- initial load;
- table generation;
- timed and untimed practice;
- mistake review;
- progress dashboard;
- profile creation/deletion;
- backup export/import;
- theme changes;
- large text and reduced motion;
- text-to-speech where available;
- print preview;
- offline reload after service-worker caching;
- About/contact/funding links.

## 6. Verify repository state

Confirm:

```bash
git status
git log -5 --oneline
```

The working tree should contain no accidental generated files or uncommitted release changes.

## 7. Create the tag

For version `0.1.0`:

```bash
git tag -a v0.1.0 -m "TableSpark v0.1.0"
git push origin v0.1.0
```

Command meaning:

- `git tag -a` creates an annotated tag.
- `v0.1.0` is the tag name expected by the release workflow pattern.
- `-m` supplies the tag message.
- `git push origin v0.1.0` publishes that specific tag to GitHub.

## 8. Automated release workflow

A `v*.*.*` tag starts `.github/workflows/release.yml`.

The workflow:

1. checks out the tagged commit;
2. installs Node.js 22;
3. installs dependencies;
4. runs `npm run check`;
5. builds the production PWA;
6. packages `dist/` as `tablespark-web.zip`;
7. creates a GitHub release with generated notes and attaches the artifact.

## 9. Post-release verification

After the release appears on GitHub:

- confirm the release points to the intended tag/commit;
- download and inspect the attached ZIP;
- deploy through the chosen static host if deployment is part of the release plan;
- verify the final secure deployment origin;
- capture real release screenshots;
- confirm PWA installability from the release origin;
- update `what_changed.md` with the release result.

## Rollback

For a faulty published release, prefer a new patch release that fixes the problem. Do not silently move an existing public version tag to a different commit.

If deployment must be rolled back, redeploy the last known-good artifact and document the incident/fix in `CHANGELOG.md` and `what_changed.md`.

## Release artifact scope

The initial release produces a static web/PWA artifact. Native installers are not generated because the chosen architecture does not require a native wrapper for its current product requirements.
