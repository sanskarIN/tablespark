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

`npm run check` verifies formatting, linting, strict types, application tests, repository security-scanner tests, repository secret scanning, documentation-link integrity, and the production build.

Do not release with failing formatting, lint, types, tests, security checks, documentation checks, build, or primary browser journeys.

## 4. Review production dependencies

```bash
npm audit --omit=dev --audit-level=high
```

A high-severity production finding requires investigation before release. Do not hide an audit failure by lowering the severity threshold without documenting the risk decision.

Also ensure `npm run secret:scan` is clean. A clean pattern scan does not prove the repository never contained a secret; if a real secret was exposed, revoke/rotate it and remediate history separately.

## 5. Preview the production build

```bash
npm run build
npm run preview
```

The `build` command type-checks and creates production assets under `dist/`. The `preview` command serves the already-built output rather than using the development transform pipeline.

Manually review:

- initial load and onboarding dismissal;
- custom table generation and the 5,000-row guard;
- solved study sheet, practice worksheet, and answer-key output;
- worksheet blank style, A4/US Letter selection, and one/two/three-column print layouts;
- print preview including blank Name/Date lines on learner-facing sheets and no automatic active-profile name;
- random default practice seed selection;
- all difficulty presets and custom practice setup;
- deterministic replay using a known seed;
- New random drill and Repeat this seed flows;
- timed and untimed practice;
- deduplicated mistake review;
- progress dashboard, mastery rule, search, and filters;
- profile creation/deletion and profile-capacity behavior;
- backup export/import and destructive-import confirmation;
- invalid/oversized backup rejection;
- unreadable-local-state preservation/download/import/discard recovery;
- user-visible storage-failure state where practical to simulate;
- theme changes;
- large text and reduced motion;
- keyboard shortcut reference plus Alt+1 through Alt+5 behavior where available;
- text-to-speech where available;
- disabled speech fallback in an unsupported browser/profile;
- offline reload after service-worker caching;
- About/contact/funding links.

Use `docs/accessibility.md` for the separate keyboard, zoom, screen-reader, touch, theme, reduced-motion, and print accessibility review matrix.

## 6. Verify repository state

Confirm:

```bash
git status
git log -5 --oneline
```

The working tree should contain no accidental generated files or uncommitted release changes.

Also confirm the commit identity expected by this repository:

```bash
git config user.email
```

The intended project commit email is `sanskarin@outlook.in`.

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
2. installs the supported Node.js runtime;
3. installs dependencies;
4. runs `npm run check`, including security utility tests, repository secret scanning, and documentation checks;
5. builds the production PWA;
6. packages `dist/` as `tablespark-web.zip`;
7. generates `tablespark-web.zip.sha256` with the SHA-256 digest of the exact ZIP artifact;
8. creates a GitHub release with generated notes and attaches both the ZIP and checksum file.

## 9. Verify release artifact integrity

After downloading both release files on Linux/macOS or a compatible shell, verify the package before deploying it:

```bash
sha256sum -c tablespark-web.zip.sha256
```

A successful check reports `tablespark-web.zip: OK`. A mismatch means the downloaded ZIP is not byte-for-byte identical to the artifact hashed by the release workflow; do not deploy a mismatched artifact.

On Windows PowerShell, compute the local digest with:

```powershell
Get-FileHash .\tablespark-web.zip -Algorithm SHA256
Get-Content .\tablespark-web.zip.sha256
```

Compare the hexadecimal values exactly. The checksum is integrity metadata, not a cryptographic signature or proof of publisher identity.

## 10. Post-release verification

After the release appears on GitHub:

- confirm the release points to the intended tag/commit;
- download the attached ZIP and SHA-256 file;
- verify the ZIP against the checksum before deployment;
- inspect the packaged files;
- deploy through the chosen static host if deployment is part of the release plan;
- verify the final secure deployment origin;
- capture real release screenshots in light/dark and compact/wide layouts;
- confirm PWA installability from the release origin;
- verify one offline reload from the deployed production origin;
- update `what_changed.md` with the release result.

## Rollback

For a faulty published release, prefer a new patch release that fixes the problem. Do not silently move an existing public version tag to a different commit.

If deployment must be rolled back, redeploy the last known-good artifact and document the incident/fix in `CHANGELOG.md` and `what_changed.md`.

## Release artifact scope

The initial release produces a static web/PWA artifact. Native installers are not generated because the chosen architecture does not require a native wrapper for its current product requirements.
