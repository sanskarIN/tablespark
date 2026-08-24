# TableSpark CI/CD and Repository Automation

This document describes the automation currently tracked for TableSpark 2.0.12 across web/PWA and native Windows, macOS, Linux, Android, and iOS/iPadOS builds.

## Automation map

TableSpark currently has five GitHub Actions workflows:

1. **CI** — shared web/application quality, security, documentation, native-configuration checks, production web build/audit, and Chromium E2E.
2. **Native Cross-Platform** — Tauri/Rust desktop compilation on Windows/macOS/Linux plus Android debug APK and iOS simulator compilation.
3. **CodeQL** — JavaScript/TypeScript static security analysis using an explicit locked install/build path.
4. **Release** — verifies a version tag, verifies/builds from locked dependencies, packages the canonical web artifact, creates SHA-256 metadata, and publishes a GitHub Release.
5. **Release Visual Evidence** — captures real Chromium screenshots for release-candidate review.

Other automation/configuration includes Dependabot for npm, Cargo and GitHub Actions, generated-release-note categories, issue/PR templates, and funding configuration.

## Automation security and reproducibility principles

- Keep GitHub token permissions minimal.
- Never make production native signing credentials available to pull-request jobs.
- Treat workflow YAML as executable code.
- Pin/track supported Node/npm/toolchain baselines deliberately.
- Use the committed `package-lock.json` with `npm ci` in automated JavaScript installation paths.
- Keep `src-tauri/Cargo.lock` committed and reject unintended Rust dependency re-resolution during native verification.
- Never use a green job from an older SHA as final candidate evidence.
- Debug/unsigned/simulator artifacts prove build viability, not production signing/store readiness.

Current workflow permission intent:

- CI — `contents: read`;
- Native Cross-Platform — `contents: read`;
- Visual Evidence — `contents: read`;
- CodeQL — `contents: read`, `security-events: write`;
- Release — `contents: write` for release creation/assets.

No temporary branch-maintenance workflow is part of the maintained automation set.

# 1. CI workflow

File:

```text
.github/workflows/ci.yml
```

Workflow name: `CI`.

## Triggers and concurrency

CI runs on pushes to `main` and pull requests targeting `main`. Obsolete in-progress runs for the same workflow/ref may be cancelled when newer commits arrive. A cancelled older run is neither a current failure nor final evidence.

## `quality` job

Runner: `ubuntu-latest`.

Baseline setup:

- `actions/checkout@v7`;
- `actions/setup-node@v7`;
- Node `22.12.0`;
- `npm ci --no-fund --no-audit` against the committed lockfile.

The maintained shared quality path verifies formatting, linting, strict TypeScript, application tests, repository security tests/scanning, documentation links, native configuration consistency, production web build, and production dependency audit.

Important commands:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run test:security
npm run secret:scan
npm run test:docs
npm run test:native-config
npm run native:config:check
npm run build
npm audit --omit=dev --audit-level=high
```

`npm run check` includes the maintained aggregate sequence through the production build, including the Node-based native configuration tests/check.

### Native/reproducibility configuration coverage inside ordinary CI

The native configuration gate does not require Rust/Android/Xcode and verifies:

- package/Cargo version consistency;
- `packageManager: npm@10.9.0`;
- Tauri version source;
- `in.sanskar.tablespark` identifier;
- Vite build/development paths;
- production/development CSP presence;
- explicit selection of only `main-capability`;
- native bundle icon declarations;
- required desktop/mobile scripts;
- `native:check` retaining `cargo check --locked`;
- Tauri CLI/opener dependencies;
- Android/iOS minimum versions.

This lets ordinary CI catch cross-platform/toolchain configuration drift before the heavier native workflow starts compiling SDK-specific targets.

### Production web artifact

The job uploads the built `dist/` tree as the `tablespark-web` CI artifact. It is candidate evidence, not an automatically approved deployment.

## `e2e` job

Runner: `ubuntu-latest`.

The job installs the same locked npm dependency graph, installs Chromium/system dependencies, and runs `npm run test:e2e` against the production preview.

Normal E2E covers product smoke flows, stable accessibility semantics, English/Hindi localization and error paths, print-media behavior, and visible 2.0.12 version presentation. Release screenshot capture remains opt-in to the dedicated visual-evidence workflow.

# 2. Native Cross-Platform workflow

File:

```text
.github/workflows/native.yml
```

Workflow name: `Native Cross-Platform`.

## Triggers/permission

- push to `main`;
- pull request targeting `main`;
- `contents: read` only.

No production signing credential is required or intended.

## Desktop matrix

Runners:

```text
ubuntu-latest
windows-latest
macos-latest
```

Each job:

1. checks out source;
2. sets up Node 22.12.0;
3. installs Linux Tauri system libraries on Ubuntu;
4. updates/selects stable Rust;
5. installs locked JavaScript dependencies with `npm ci --no-fund --no-audit`;
6. runs `npm run check:native`, whose Cargo check uses `--locked`;
7. runs `npm run native:build:ci`.

`native:build:ci` generates TableSpark native icons from `public/logo.svg`, invokes the configured frontend build, and compiles the host native application using `--no-bundle --no-sign`.

Linux CI installs:

```text
libwebkit2gtk-4.1-dev
build-essential
curl
wget
file
libxdo-dev
libssl-dev
libayatana-appindicator3-dev
librsvg2-dev
```

Equivalent packages vary by distribution; this job establishes the maintained Ubuntu runner path rather than claiming every Linux distribution is identical.

## Android job

Display name: `Android debug APK`.

Runner: `ubuntu-latest`.

Setup includes:

- Node 22.12.0;
- Java Temurin 17;
- stable Rust;
- `aarch64-linux-android`;
- `armv7-linux-androideabi`;
- `i686-linux-android`;
- `x86_64-linux-android`;
- the newest installed runner Android NDK exported as `NDK_HOME`.

Build flow:

```bash
npm ci --no-fund --no-audit
npm run android:init -- --skip-targets-install
npm run android:build:debug
```

Generated Android project files live under ignored `src-tauri/gen/`.

A passing debug APK build proves candidate source/toolchain viability. It does not prove release-keystore ownership, production APK/AAB signing, Google Play acceptance, or real-device accessibility/print/storage behavior.

## iOS job

Display name: `iOS simulator build`.

Runner: `macos-latest`.

Setup includes:

- Node 22.12.0;
- stable Rust;
- `aarch64-apple-ios-sim` target;
- Xcode tooling;
- CocoaPods.

Build flow:

```bash
npm ci --no-fund --no-audit
npm run ios:init -- --skip-targets-install
npm run ios:build:simulator
```

Generated iOS project files live under ignored `src-tauri/gen/`.

A simulator build proves candidate compilation. It does not prove physical-device provisioning/signing, Apple Developer team ownership, App Store acceptance, or real iPhone/iPad behavior.

## Native branch-protection guidance

After stable successful runs establish the exact GitHub check names, the intended native checks can be made required for `main` where repository policy permits. Use actual recent check names rather than guessing them from documentation.

# 3. CodeQL workflow

File:

```text
.github/workflows/codeql.yml
```

Runs on `main` pushes, PRs targeting `main`, and a weekly schedule with permissions:

```text
contents: read
security-events: write
```

The analysis job explicitly:

1. checks out source;
2. selects Node 22.12.0;
3. initializes JavaScript/TypeScript CodeQL;
4. runs `npm ci --no-fund --no-audit`;
5. runs `npm run build`;
6. runs CodeQL analysis.

This avoids an opaque dependency/build resolution path and makes CodeQL analyze the same locked application dependency graph used by other automation.

CodeQL complements strict TypeScript, linting, dependency audit, native capability/CSP review, Rust/native compilation, and repository secret scanning.

For a real alert, investigate data flow/reachability, fix the smallest responsible boundary, add a regression test when practical, and rerun analysis rather than dismissing solely to satisfy branch protection.

# 4. Tagged Release workflow

File:

```text
.github/workflows/release.yml
```

Trigger: `v*.*.*`.

Permission: `contents: write`.

The current tagged-release automation publishes the canonical **web/PWA package**. It:

1. checks out the tagged commit;
2. sets up Node 22.12.0;
3. verifies the pushed tag exactly equals `v${package.json.version}`;
4. installs the committed dependency graph with `npm ci --no-fund --no-audit`;
5. runs `npm run check`;
6. builds `dist/`;
7. creates `tablespark-web.zip`;
8. creates `tablespark-web.zip.sha256`;
9. creates the GitHub Release with generated notes/assets and verifies the tag exists.

Native signed artifacts are deliberately not published by this workflow yet because public Windows/macOS/Android/iOS distribution requires owner-controlled signing identities/release-channel credentials. Do not add those secrets to ordinary or fork PR workflow contexts.

## Safe `v2.0.12` tag sequence

Before tagging:

1. freeze exact candidate SHA;
2. verify exact-head CI quality/e2e;
3. verify exact-head CodeQL;
4. verify exact-head visual evidence;
5. verify exact-head Native Cross-Platform desktop/Android/iOS jobs;
6. inspect screenshot evidence;
7. complete intended manual accessibility/Hindi/installed-device/native-signing/web-origin gates;
8. create/push annotated tag;
9. inspect release workflow;
10. verify downloaded web ZIP/checksum;
11. verify every signed native package separately before public distribution.

# 5. Release Visual Evidence workflow

File:

```text
.github/workflows/visual-evidence.yml
```

Triggers on PRs targeting `main` and manual dispatch, with `contents: read`.

It installs the locked npm dependency graph, installs Chromium, sets `CAPTURE_RELEASE_EVIDENCE=1`, runs the dedicated screenshot spec, and uploads `tablespark-release-visual-evidence` containing light/dark compact/wide PNGs.

A green screenshot workflow proves only that browser captures were generated. Human review is still required and it does not prove native app rendering or signed distribution.

# 6. Dependabot

File:

```text
.github/dependabot.yml
```

Maintains these dependency ecosystems weekly:

- npm at repository root;
- Cargo under `/src-tauri`;
- GitHub Actions.

Dependency update pull requests remain review-gated. For Tauri/native/Rust/toolchain updates, review:

- `Cargo.toml` / `Cargo.lock` resolution changes;
- breaking/migration notes;
- new permissions/capabilities;
- changed system prerequisites;
- platform minimum-version changes;
- signing/distribution implications;
- supply-chain provenance/ownership.

For npm updates, review `package.json` and `package-lock.json` together and require `npm ci` plus normal quality/security gates.

# 7. Generated release notes

`.github/release.yml` configures GitHub generated release-note categories; it is not the Actions release workflow.

Labels improve generated notes but do not replace maintained `CHANGELOG.md`.

# 8. Contributor templates and funding

Issue/PR/funding configuration guides contributors and support. These surfaces must never encourage posting private learner backups/recovery data, authentication credentials, Android/Apple/desktop signing private keys, or store/developer API credentials.

# 9. Exact-head evidence rule

Final evidence must be associated with the immutable final candidate SHA.

Do not count:

- older successful runs;
- queued/pending jobs;
- cancelled/superseded jobs;
- artifacts built from another SHA;
- debug/simulator artifacts when claiming production-signed native distribution.

If any tracked source/doc commit changes the head, affected verification must be repeated for the new SHA.

Avoid hard-coding a purported “final SHA” into a tracked file when that edit would itself create a newer commit. Put immutable candidate/run identifiers in PR/check/release metadata after the final tracked-file commit.

# 10. Failure triage

## Shared CI

Find the first responsible command and reproduce it locally when practical. Do not suppress a global gate to hide an isolated failure. A lockfile mismatch is a dependency-integrity failure, not a reason to replace `npm ci` with a mutable install.

## Native desktop

Check platform libraries/toolchain, Rust/Tauri compatibility, committed Cargo resolution, generated icons, frontend build, CSP/capability parsing, and host linker/compiler output.

## Android

Check Java, SDK/NDK, Rust Android targets, regenerated `src-tauri/gen/`, Gradle/toolchain errors, identifier/minSdk/config.

Do not commit generated mobile output merely to hide a reproducibility issue unless generated-source policy is deliberately changed.

## iOS

Check Xcode/CocoaPods, Rust simulator/device target, generated Xcode project, bundle/version config, and whether the failure is compile-time versus signing/provisioning.

Simulator/source failures belong in repository code/tooling. Production signing failures require owner credentials rather than weakened security.

## Native configuration gate

Correct the maintained source-of-truth invariant named by the failure (version, package manager, locked Cargo command, identifier, CSP, capability, icon, script, dependency, mobile minimum) rather than relaxing the checker to accept unintended divergence.

# 11. Automation synchronization matrix

When changing Node/npm support, synchronize:

- `.nvmrc`;
- `package.json` engines and `packageManager`;
- `package-lock.json` when dependency metadata changes;
- workflow Node/setup/install values;
- setup/configuration/command documentation.

When changing Rust dependencies, synchronize:

- `src-tauri/Cargo.toml`;
- `src-tauri/Cargo.lock`;
- native configuration fixtures/checks when commands or packages change;
- native CI/build documentation where applicable.

When changing product/native identity/version, synchronize:

- `package.json`;
- `src-tauri/Cargo.toml` when required;
- visible English/Hindi version copy;
- changelog/release documentation;
- native config tests.

When changing native permissions/CSP/platform minimums, synchronize:

- tracked `src-tauri` configuration;
- native config tests;
- security/privacy docs;
- release evidence;
- native CI/toolchain setup if needed.

When adding/removing/renaming a tracked file, update `docs/repository-file-reference.md` exhaustive inventory/count.
