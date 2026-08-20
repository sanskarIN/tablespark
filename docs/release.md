# Release Guide

This document defines the release process for TableSpark **2.0.12** across web/PWA, Windows, macOS, Linux, Android, and iOS/iPadOS.

## Release principles

A release tag should point only to a commit that has passed the repository quality gates and the intended manual/platform release review. Do not create a tag merely to make a workflow pass.

Cross-platform source/build support and production distribution are separate states:

- the repository can compile the shared TableSpark product for all maintained targets;
- public native distribution requires owner-controlled signing identities, platform accounts where applicable, and actual installed-device/package verification;
- pull-request CI must never receive production signing secrets.

The prepared semantic version is **2.0.12**. This does not mean the `v2.0.12` tag or signed native releases already exist.

## 1. Freeze release metadata

Before tagging:

- confirm `package.json` version;
- confirm `src-tauri/Cargo.toml` package version;
- confirm `src-tauri/tauri.conf.json` sources its version from `../package.json`;
- confirm visible English/Hindi About and Settings copy matches the package version;
- update `CHANGELOG.md`;
- update `ROADMAP.md`;
- update `what_changed.md`;
- verify `docs/release-evidence.md` names the intended candidate version;
- verify documentation describes the current web/native architecture.

Run:

```bash
npm run test:native-config
npm run native:config:check
```

The standard `npm run check` already includes both commands.

## 2. Install dependencies

```bash
npm install
```

For native builds, also install Rust and the platform-specific Tauri prerequisites described in `docs/native-packaging-evaluation.md` and `docs/setup.md`.

## 3. Run shared quality gates

```bash
npm run check
npm run test:e2e
```

`npm run check` verifies:

```text
format:check
→ lint
→ typecheck
→ application tests
→ repository security-scanner tests
→ repository secret scan
→ documentation-link tests/check
→ native-configuration tests
→ native-configuration check
→ web production build
```

Do not release with a failing shared gate.

## 4. Run native quality gates

On a machine with Rust/Tauri prerequisites:

```bash
npm run check:native
npm run native:build:ci
```

`check:native` verifies Rust formatting and `cargo check` for `src-tauri/Cargo.toml`.

`native:build:ci` generates TableSpark native icons from `public/logo.svg`, builds the shared frontend, and compiles the current desktop host target without producing/signing installers.

The Native Cross-Platform GitHub Actions workflow separately validates:

- Windows desktop compilation;
- macOS desktop compilation;
- Linux desktop compilation;
- Android debug APK compilation;
- iOS simulator compilation.

Exact-head workflow results are the authoritative repository-level evidence. A queued, pending, cancelled, skipped, or older-SHA run is not a pass for the current candidate.

## 5. Review production dependencies and repository secrets

```bash
npm audit --omit=dev --audit-level=high
npm run secret:scan
```

A high-severity production dependency finding requires investigation before release. Do not lower the threshold merely to make the release gate green.

A clean pattern scan is defense in depth; if a real secret was exposed, revoke/rotate it and assess repository history/artifacts separately.

## 6. Web/PWA release-candidate review

Build and preview:

```bash
npm run build
npm run preview
```

Review at minimum:

- onboarding and initial load;
- custom tables and 5,000-row protection;
- solved study sheets, practice worksheets, and answer keys;
- A4/US Letter and one/two/three-column print layouts;
- timed/untimed generated practice;
- deterministic seed replay;
- mistake review;
- mastery/progress filters/search;
- profile capacity and profile deletion;
- local session retention/goals;
- validated backup export/import;
- known-invalid data recovery;
- blocked/unavailable storage behavior;
- transactional destructive backup replacement;
- English/Hindi UI and version 2.0.12;
- theme, large text, reduced motion;
- text-to-speech/fallback behavior;
- keyboard shortcuts;
- PWA offline-ready/update-ready/install flows;
- About/contact/funding links.

Use `docs/accessibility.md` and `docs/hindi-review-checklist.md` for manual evidence.

## 7. Desktop native release-candidate review

### Windows

On Windows with Tauri prerequisites:

```powershell
npm install
npm run native:info
npm run check:native
npm run native:build
```

Before public distribution verify the produced Windows package/executable on a clean or representative target machine. Confirm:

- startup and window sizing;
- local storage persistence across restart;
- backup export/import;
- print behavior;
- speech behavior where available;
- external GitHub/funding/email links leave the app through the operating system;
- accessibility with intended Windows assistive technology;
- signing/publisher identity for a production installer;
- upgrade and uninstall behavior.

### macOS

On macOS:

```bash
npm install
npm run native:info
npm run check:native
npm run native:build
```

For normal public distribution, configure the repository-owner Apple signing identity and notarization/App Store path as appropriate. Verify installation, Gatekeeper behavior, update/replacement behavior, VoiceOver, printing, speech, and local-data persistence.

### Linux

On the target Linux build environment:

```bash
npm install
npm run native:info
npm run check:native
npm run native:build
```

Verify the intended package formats on representative target distributions. Do not claim universal Linux distribution coverage based on one package manager or one CI image.

## 8. Android release-candidate review

Prepare the Android project/toolchain:

```bash
npm install
npm run android:init
```

CI-safe/debug package:

```bash
npm run android:build:debug
```

Production package after signing is configured:

```bash
npm run android:build
```

Before public or Play distribution verify:

- package identifier ownership for `in.sanskar.tablespark`;
- release keystore ownership and secure backup;
- signing password/key protection;
- APK/AAB installation;
- upgrade from prior test/release package where applicable;
- local-data persistence;
- backup export/import;
- Android print/share/file-picker behavior used by browser/webview APIs;
- TalkBack and touch behavior;
- speech behavior;
- external links/email handoff;
- store privacy/data declarations;
- Google Play ownership if Play distribution is intended.

Never commit keystores or `keystore.properties`.

## 9. iOS/iPadOS release-candidate review

iOS builds require macOS/Xcode.

Initialize:

```bash
npm install
npm run ios:init
```

CI/simulator verification:

```bash
npm run ios:build:simulator
```

For physical-device development where the frontend must be reachable through the host selected by Tauri:

```bash
npm run ios:dev:device
```

Production build after Apple signing/provisioning is configured:

```bash
npm run ios:build
```

Before App Store/device distribution verify:

- bundle identifier ownership;
- Apple Developer/team ownership;
- signing certificate/private-key handling;
- provisioning configuration;
- physical iPhone/iPad installation;
- application restart/local-data persistence;
- backup export/import;
- printing and document/file handling;
- VoiceOver/touch behavior;
- speech behavior;
- external link/email handoff;
- App Store privacy declarations and screenshots/metadata.

Never commit Apple `.p8`, `.p12`, or provisioning-profile signing material.

## 10. Native icon generation

Native packages use TableSpark branding generated from the maintained SVG:

```bash
npm run native:icons
```

Generated icon output is under `src-tauri/icons/` and is intentionally ignored because it can be reproduced from `public/logo.svg`. Native package build scripts run icon generation automatically before bundling.

## 11. Signing-secret boundary

Signing keys are not ordinary source files.

Never commit or expose in untrusted pull-request workflows:

- Android `.jks`/`.keystore` files;
- Android keystore properties/passwords;
- Apple `.p8` private keys;
- Apple `.p12` signing certificates/private keys;
- provisioning profiles containing private distribution configuration;
- store API tokens/credentials;
- Windows/macOS signing private keys.

If automated signed release workflows are introduced later, use protected environment/repository secrets with restricted release permissions and never make them available to fork pull requests.

## 12. Create the 2.0.12 tag

Only after the exact frozen candidate satisfies intended gates:

```bash
git tag -a v2.0.12 -m "TableSpark v2.0.12"
git push origin v2.0.12
```

Do not move an already-published version tag to a different commit. Prepare a later patch release for a faulty published version.

## 13. Current automated tagged release scope

`.github/workflows/release.yml` currently publishes the canonical web/PWA package only:

```text
tablespark-web.zip
tablespark-web.zip.sha256
```

The workflow reruns `npm run check`, builds `dist/`, packages the exact web assets, creates SHA-256 integrity metadata, and creates the GitHub release.

Signed native installers/APK/AAB/IPA/App Store artifacts are intentionally **not** uploaded automatically until repository-owner signing identities and release-channel ownership are configured. This avoids publishing unsigned artifacts as if they were production native releases.

## 14. Verify web release artifact integrity

Linux/macOS-compatible shell:

```bash
sha256sum -c tablespark-web.zip.sha256
```

Windows PowerShell:

```powershell
Get-FileHash .\tablespark-web.zip -Algorithm SHA256
Get-Content .\tablespark-web.zip.sha256
```

Compare the hexadecimal digest exactly. The checksum proves byte-level integrity relative to the workflow digest; it is not a publisher signature.

## 15. Post-release verification

After publication:

- confirm the GitHub release points to the intended `v2.0.12` commit;
- download and verify the web ZIP/checksum;
- inspect packaged web files;
- verify the approved production HTTPS origin if deployed;
- verify PWA install/offline/update behavior on production origin;
- inspect real visual-evidence screenshots;
- verify every signed native package points to the intended version/source commit through release records;
- install and test each native artifact on its intended platform before calling it released;
- record exact evidence in release records and `what_changed.md`.

## Rollback

For web deployment, redeploy the last known-good artifact while preparing a fixed patch release.

For native distribution, follow the platform’s update/replacement process. Do not silently replace a signed artifact under an existing public version identity.

Document incidents/fixes in `CHANGELOG.md`, `what_changed.md`, and release notes.
