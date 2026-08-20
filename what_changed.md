# TableSpark — Current Work Handoff

Last updated: 2026-08-20

This file is the detailed continuation record for the current TableSpark implementation, cross-platform expansion, documentation, verification boundaries, and release-candidate state. It intentionally separates **implemented source/build support** from **verified/signed public distribution** so future work does not overclaim platform readiness.

# Current repository checkpoint

- Application/product version: **`2.0.12`**.
- Release state: **2.0.12 cross-platform source/release candidate prepared; `v2.0.12` is not yet created**.
- Repository: `https://github.com/sanskarIN/tablespark`.
- Default branch: `main`.
- Current development/verification branch: `feat/roadmap-refinement-2026-08-19`.
- Current pull request: PR `#4`.
- PR remains open, draft, and intentionally unmerged while final exact-head checks/manual release gates are pending.
- Shared product architecture: strict TypeScript + React + Vite.
- Web delivery: browser + installable PWA where the browser/platform supports it.
- Native packaging: **Tauri 2 + Rust thin shell** using the same shared frontend/product/domain code.
- Native source/build targets: **Windows, macOS, Linux, Android, iOS/iPadOS**.
- Core persistence model: local-first runtime/webview storage.
- Current learner-data schema: **version 2**.
- Stable learner storage key: `tablespark.state.v1`.
- Locale preference key: `tablespark.locale.v1`.
- Core learning requires no TableSpark backend, account, payment system, advertising SDK, or remote analytics service.

The immutable final candidate SHA must be recorded in PR/check/release metadata **after the final tracked-file commit**. It is intentionally not hard-coded in this tracked handoff because doing so would immediately create a newer SHA.

# Cross-platform architecture completed in this continuation

## 1. Shared-code strategy

The prior “PWA-first/native packaging deferred” direction has been superseded by the explicit requirement to make TableSpark cross-platform.

The implementation deliberately does **not** create separate Windows/Android/iOS product rewrites.

Current architecture:

```text
shared React / TypeScript product
        │
        ├── Web/PWA → Vite + optional service worker
        │
        └── Native → Vite assets → Tauri 2 / Rust → system webview
                                      ├── Windows
                                      ├── macOS
                                      ├── Linux
                                      ├── Android
                                      └── iOS/iPadOS
```

Shared code remains responsible for:

- multiplication/table domain rules;
- seeded practice and mistake review;
- mastery/progress/session/goals;
- local learner schema/migrations;
- backup import/export/recovery;
- English/Hindi localization;
- accessibility semantics;
- worksheet/print model;
- shared React UI.

Tauri is a packaging/native-bridge layer rather than a second application architecture.

## 2. New Tauri/Rust native project

Added tracked native files:

```text
src-tauri/Cargo.toml
src-tauri/build.rs
src-tauri/capabilities/default.json
src-tauri/src/lib.rs
src-tauri/src/main.rs
src-tauri/tauri.conf.json
src-tauri/tauri.android.conf.json
src-tauri/tauri.ios.conf.json
```

`Cargo.toml` is prepared for TableSpark `2.0.12` and contains the Tauri runtime, Tauri build helper, and opener plugin dependencies.

The library entrypoint uses Tauri’s mobile entrypoint attribute and is shared by generated Android/iOS projects. The desktop executable delegates to the same library entrypoint.

## 3. Native application identity

Configured native identifier:

```text
in.sanskar.tablespark
```

The product name remains `TableSpark`.

Tauri reads its application version from:

```text
../package.json
```

The Rust package version is also `2.0.12` and is checked against the JavaScript package version by the native configuration gate.

Product semantic version remains separate from learner `schemaVersion: 2` and storage key `tablespark.state.v1`.

# Native platform support

## 4. Windows

Implemented source/build path:

```bash
npm run native:dev
npm run native:build:ci
npm run native:build
```

GitHub native CI now includes Windows desktop compilation.

Still external/manual before claiming a public Windows release:

- production signing/publisher identity;
- actual installer/package inspection;
- installed application launch/restart/local persistence;
- backup/print/speech/external-link behavior;
- NVDA/Narrator review;
- upgrade/reinstall/uninstall behavior.

## 5. macOS

Implemented source/build path through the same Tauri desktop commands.

GitHub native CI includes macOS desktop compilation.

Still external/manual before a public macOS release:

- owner Apple signing identity;
- notarization/App Store path if applicable;
- installed bundle behavior;
- VoiceOver/print/speech/local persistence;
- upgrade/replacement behavior.

## 6. Linux

Implemented source/build path through Tauri desktop packaging.

Native CI installs the maintained Ubuntu/WebKitGTK build dependencies and compiles the Linux native application.

Still manual before broad Linux distribution claims:

- representative intended distribution/package testing;
- installation/removal/upgrade behavior;
- print/speech/accessibility/local-storage behavior.

One Ubuntu CI runner does not prove every Linux distribution behaves identically.

## 7. Android

Added:

```text
src-tauri/tauri.android.conf.json
```

Current maintained configuration:

```text
minimum Android SDK/API: 24
debug application ID suffix: .debug
```

Package commands:

```bash
npm run android:init
npm run android:dev
npm run android:build:debug
npm run android:build
```

Native CI now:

- configures Java 17;
- installs Rust Android targets;
- resolves the runner Android NDK;
- regenerates the ignored Android project;
- compiles a debug APK.

A debug APK is build evidence only. Production Android release still requires repository-owner release keystore/signing, APK/AAB verification, real-device testing, and store ownership if Google Play distribution is intended.

## 8. iOS/iPadOS

Added:

```text
src-tauri/tauri.ios.conf.json
```

Current minimum system version:

```text
14.0
```

Commands:

```bash
npm run ios:init
npm run ios:dev
npm run ios:dev:device
npm run ios:build:simulator
npm run ios:build
```

`ios:dev:device` uses Tauri host behavior for physical-device development.

`vite.config.ts` reads `TAURI_DEV_HOST` when supplied so the development frontend/HMR can use the reachable address chosen by the Tauri tooling rather than assuming the device can reach host `localhost`.

Native CI now:

- runs on macOS;
- verifies Xcode/CocoaPods tooling;
- adds the `aarch64-apple-ios-sim` Rust target;
- regenerates the ignored iOS project;
- compiles an iOS simulator application.

Simulator compilation is not physical-device/App Store signing evidence. Apple Developer team ownership, signing/provisioning, physical iPhone/iPad testing and App Store distribution remain external release operations.

# Shared web/native runtime behavior

## 9. Platform runtime abstraction

Added:

```text
src/platform/runtime.ts
src/platform/runtime.test.ts
src/platform/openExternalUrl.ts
```

`vite.config.ts` defines:

```text
__TABLESPARK_NATIVE__
__TABLESPARK_PLATFORM__
```

`runtime.ts` exposes the current platform/native state and whether the PWA service worker should register.

A real reliability issue found during implementation was fixed: non-Vite/test contexts might not inject those constants. The platform module now uses safe `typeof` checks and falls back to:

```text
platform: web
native: false
```

The regression test verifies that normal Vitest usage cannot fail simply because Tauri/Vite build constants are absent.

## 10. PWA lifecycle inside native packages

`src/main.tsx` now registers the PWA service worker **only** when the runtime is not a native shell.

Web/PWA behavior remains intact:

- offline shell caching;
- offline-ready notice;
- non-blocking service-worker update-ready prompt;
- optional browser install prompt.

Packaged native applications deliberately skip that service-worker registration. Their application assets belong to the native package/store lifecycle rather than running a second browser-style updater inside the native webview.

The repository does not currently enable a Tauri native updater plugin or updater artifacts.

## 11. External links in native apps

The About page and footer support link now use `src/platform/openExternalUrl.ts`.

Web builds keep normal anchor behavior.

Native builds hand maintained destinations to the operating system through `@tauri-apps/plugin-opener` instead of replacing the TableSpark application webview with GitHub, email, or funding pages.

The native permission is not a wildcard.

Allowed maintained destinations are limited to:

```text
mailto:sanskarin@outlook.in
mailto:sanskarin.business@gmail.com
mailto:supportramsandesh@gmail.com
https://github.com/sanskarIN
https://github.com/sanskarIN/tablespark
https://buymeacoffee.com/sanskarIN
```

# Native security hardening

## 12. Explicit capability selection

`src-tauri/tauri.conf.json` explicitly selects only:

```text
main-capability
```

The native configuration checker fails if unexpected extra capability names are selected.

This avoids silently enabling every future capability file by configuration accident.

## 13. Least-privilege native capability

`src-tauri/capabilities/default.json` grants:

- `core:default`;
- exact URL opening described above.

It does not grant general-purpose:

- shell/process execution;
- arbitrary filesystem access;
- arbitrary URL opening;
- background learner-data upload;
- authentication/token-store access;
- broad device APIs.

Future native permissions require a concrete product need, minimum scope, tests and privacy/security review.

## 14. Native Content Security Policy

The initial native configuration used an unrestricted/null CSP during scaffolding. The final security audit tightened this before freeze.

Production native webview CSP now restricts default content to packaged/self/Tauri asset sources and required Tauri IPC, with required local style/font/image allowances and explicit blocks for objects, frames, form submissions and base-URL rewriting.

A separate `devCsp` permits local HTTP/WebSocket traffic required by Vite/Tauri development.

The native configuration gate requires both production CSP and development CSP to exist so a later accidental regression back to `csp: null` fails shared CI.

## 15. Signing/store secret protection

`.gitignore` now also excludes common native signing artifacts:

```text
*.jks
*.keystore
*.p12
*.p8
*.mobileprovision
keystore.properties
```

Production signing secrets remain outside repository source and untrusted pull-request CI.

A signing credential exposed in Git/history/logs must be treated as compromised; ignoring the file later does not make an exposed key safe again.

# Native branding/generated output

## 16. Native icons

The maintained identity asset remains:

```text
public/logo.svg
```

Command:

```bash
npm run native:icons
```

Native package scripts call a shared preparation step that regenerates platform icon assets before building.

Tracked Tauri bundle config declares the expected Windows/macOS/Linux icon paths.

Generated icon output:

```text
src-tauri/icons/
```

is ignored because it is reproducible from the SVG source.

## 17. Generated native projects/build output

Ignored/reproducible:

```text
src-tauri/gen/
src-tauri/target/
src-tauri/icons/
```

`gen/` contains generated Android/iOS project files.

`target/` contains Rust build output.

Security-sensitive source-of-truth settings stay in tracked Tauri configuration/capability files rather than hidden inside generated output.

# Native configuration integrity gate

## 18. New repository scripts

Added:

```text
scripts/native-config.mjs
scripts/native-config-check.mjs
scripts/native-config.test.mjs
```

New package commands:

```bash
npm run test:native-config
npm run native:config:check
```

They are now included in `npm run check`.

## 19. Static invariants enforced

The gate checks:

- Cargo package version exists;
- Cargo version equals `package.json` version;
- Tauri version remains sourced from `../package.json`;
- native identifier remains `in.sanskar.tablespark`;
- Tauri `frontendDist` remains `../dist`;
- Tauri `devUrl` remains `http://localhost:5173`;
- production CSP exists;
- development CSP exists;
- only `main-capability` is selected;
- required generated native icon paths are declared;
- required native/Android/iOS scripts exist;
- Tauri CLI dependency exists;
- Tauri opener runtime dependency exists;
- Android minimum API remains at least 24;
- iOS minimum remains at least 14.0.

The regression fixture intentionally introduces version, CSP, capability, icon, Android and iOS drift and verifies that these mistakes are rejected.

This checker is Node-based so ordinary shared CI can detect critical native configuration drift without installing every platform SDK.

# Native Cross-Platform GitHub Actions

## 20. New workflow

Added:

```text
.github/workflows/native.yml
```

Triggers:

- push to `main`;
- PR targeting `main`.

Permission:

```text
contents: read
```

Production signing credentials are intentionally absent.

## 21. Desktop matrix

CI compiles the native desktop application on:

```text
ubuntu-latest
windows-latest
macos-latest
```

Each host runs Rust format/type checks plus `native:build:ci`.

The Linux job installs the maintained WebKitGTK/GTK/build dependencies required by the Ubuntu runner path.

## 22. Android CI

CI compiles a debug APK after setting up Java, Rust Android targets, NDK environment and generated Android project files.

This is a much stronger gate than merely generating an Android project, but it remains unsigned/debug release evidence only.

## 23. iOS CI

CI generates the iOS project and compiles an Apple-silicon simulator application on macOS.

This checks the actual iOS compile path while keeping Apple device signing/provisioning secrets out of PR CI.

# Local learner data across platforms

## 24. No second native learner schema

Native packaging does not create a Rust/SQLite/backend data model.

The shared schema remains:

```text
schemaVersion: 2
storage key: tablespark.state.v1
```

All existing structural/semantic validation, migration and transactional import rules remain active.

## 25. Per-install storage isolation

A web/PWA origin and a packaged native installation have separate platform-managed storage contexts. Different devices/installed apps do not automatically share progress.

TableSpark intentionally does not request broad filesystem access to locate/copy another app/browser’s private storage.

Supported portability mechanism:

```text
validated JSON Export backup → Import backup
```

This keeps cross-platform transfer explicit and sends every transferred state through the same validator/migration rules.

# Existing product/reliability work preserved

The cross-platform phase retains all earlier 2.0.12 candidate functionality/hardening, including:

- custom multiplication table ranges/steps;
- 5,000-row render protection;
- worksheet composer with study/practice/answer-key modes;
- A4/US Letter and one/two/three-column print options;
- random/replayable seeded practice;
- timed/untimed modes and five presets;
- bounded answers/seeds;
- deduplicated mistake review;
- mastery/search/filter/session history/goals;
- 100-profile capacity with atomic updater enforcement;
- schema-2 persistence with schema-1 migration;
- 2 MB import/persistence budget;
- four startup storage outcomes: `empty`, `loaded`, `invalid`, `unavailable`;
- known-invalid raw recovery preservation;
- blocked startup-read write suppression;
- transactional backup replacement;
- English/Hindi runtime locale system;
- localized failure paths;
- keyboard shortcuts;
- optional speech fallback;
- web/PWA non-blocking update/install behavior;
- structured log redaction;
- repository secret scanner;
- documentation-link gate;
- CodeQL/dependency auditing;
- web release ZIP/checksum workflow;
- real browser screenshot evidence workflow.

# Platform-neutral localization work

## 26. English/Hindi copy

Updated English and Hindi wording that previously assumed “browser” everywhere.

Copy now correctly describes:

- browser **or installed app** local data;
- active device/runtime speech availability;
- web/PWA service-worker updates versus packaged native package/store updates;
- TableSpark availability across web, desktop, Android and iOS;
- local storage/recovery terminology that works in system webviews too.

Version remains `2.0.12` in both catalogs and stays covered by package/catalog/browser assertions.

# Documentation completed in this cross-platform pass

Major documents updated/replaced:

```text
README.md
CHANGELOG.md
ROADMAP.md
PRIVACY.md
SECURITY.md
docs/architecture.md
docs/ci-cd.md
docs/commands-reference.md
docs/configuration-reference.md
docs/documentation-index.md
docs/native-packaging-evaluation.md
docs/quality-gates.md
docs/release.md
docs/release-evidence.md
docs/repository-file-reference.md
docs/security-model.md
docs/setup.md
docs/testing.md
what_changed.md
```

The existing reusable `docs/release-notes-template.md` remains in place; one attempted metadata-only documentation rewrite was blocked by an automated mutation-safety check and was intentionally not forced because it is not required for executable cross-platform support.

# Exhaustive tracked-file documentation

## 27. Inventory count

Before this phase:

```text
156 tracked files
```

Exactly 15 tracked files were added:

```text
.github/workflows/native.yml
scripts/native-config.mjs
scripts/native-config-check.mjs
scripts/native-config.test.mjs
src/platform/runtime.ts
src/platform/runtime.test.ts
src/platform/openExternalUrl.ts
src-tauri/Cargo.toml
src-tauri/build.rs
src-tauri/capabilities/default.json
src-tauri/src/lib.rs
src-tauri/src/main.rs
src-tauri/tauri.conf.json
src-tauri/tauri.android.conf.json
src-tauri/tauri.ios.conf.json
```

No tracked file was intentionally removed in the cross-platform phase.

Current documented inventory:

```text
171 tracked files
```

`docs/repository-file-reference.md` now lists every one of those 171 files individually and explains its primary purpose.

Generated Tauri/mobile/icon/build output is excluded from the count because it is intentionally ignored and reproducible.

# Package command surface after this phase

## 28. Shared quality

Important commands:

```text
npm run dev
npm run build
npm run preview
npm run typecheck
npm run lint
npm run format
npm run format:check
npm run test
npm run test:watch
npm run test:coverage
npm run test:e2e
npm run test:security
npm run secret:scan
npm run test:docs
npm run test:native-config
npm run native:config:check
npm run check
```

Current `npm run check` order:

```text
format:check
→ lint
→ typecheck
→ test
→ test:security
→ secret:scan
→ test:docs
→ test:native-config
→ native:config:check
→ build
```

## 29. Desktop native commands

```text
npm run native:info
npm run native:icons
npm run native:prepare
npm run native:dev
npm run native:fmt
npm run native:fmt:check
npm run native:check
npm run check:native
npm run native:build:ci
npm run native:build
```

## 30. Android commands

```text
npm run android:init
npm run android:dev
npm run android:build:debug
npm run android:build
```

## 31. iOS/iPadOS commands

```text
npm run ios:init
npm run ios:dev
npm run ios:dev:device
npm run ios:build:simulator
npm run ios:build
```

# Verification state at this handoff commit

## 32. This commit changes the candidate SHA

Because this handoff itself is a tracked-file commit, no earlier workflow run can be treated as final evidence for the exact new head.

After this commit, the safe continuation sequence is:

1. fetch PR #4 and record the exact new `head_sha` externally;
2. fetch workflow runs for that exact SHA;
3. require/inspect ordinary CI `quality` and `e2e`;
4. require/inspect CodeQL;
5. require/inspect Release Visual Evidence;
6. require/inspect Native Cross-Platform Windows/macOS/Linux/Android/iOS jobs;
7. if a job fails, inspect its exact job steps/logs and fix only the real failure;
8. any fix creates a new candidate, so repeat the exact-head rule.

A job is **not** a pass when it is:

- queued;
- pending/in progress;
- cancelled;
- skipped;
- unavailable;
- associated only with an older SHA.

# What “fully cross-platform supportable” means now

Source/build architecture is implemented for:

```text
Web
PWA
Windows
macOS
Linux
Android
iOS/iPadOS
```

This means the repository contains the shared native shell, target configuration, commands, platform runtime behavior, native security policy, config tests and CI compile paths required to build those targets.

It does **not** mean signed installers/store packages have already been publicly released.

Signed/public native release additionally needs private owner-controlled assets/actions that should not be invented or committed by source work:

- Windows/macOS code-signing identity as applicable;
- macOS notarization/App Store configuration if used;
- Android release keystore and APK/AAB signing;
- Google Play ownership/metadata if used;
- Apple Developer team, signing/provisioning and App Store configuration;
- real installed-device/host verification.

# Manual/external gates intentionally still pending

## 33. Shared/manual review

- human inspection of real light/dark compact/wide screenshot artifacts;
- fluent/native Hindi terminology review;
- Hindi narrow-layout/print review;
- manual print-preview/platform print review;
- NVDA review;
- Narrator review;
- VoiceOver review;
- TalkBack review.

## 34. Web production

- owner approval of production HTTPS host/origin;
- first production load;
- manifest/service-worker scope;
- browser PWA installability;
- online load then offline reload;
- non-blocking deployed update behavior;
- production core learning flows.

## 35. Native installed applications

- real Windows installed package/application test;
- real macOS installed package/application test;
- representative Linux installed package test;
- physical Android device test;
- physical iPhone test;
- physical iPad test;
- platform print/speech/file/link behavior;
- install/restart/local persistence/backup transfer;
- update/reinstall/replacement behavior.

## 36. Native signing/store distribution

- owner-controlled Windows/macOS signing as required by intended channel;
- macOS notarization if used;
- Android release keystore ownership/backup/signing;
- signed Android APK/AAB;
- Google Play ownership/submission if intended;
- Apple Developer/team ownership;
- iOS/iPadOS signing/provisioning;
- signed Apple distribution package/App Store submission if intended.

These credentials must not be added to untrusted PR CI or committed to source.

## 37. Final version publication

- exact final head green checks;
- create annotated `v2.0.12` tag only for verified commit;
- verify tagged web release workflow;
- download `tablespark-web.zip` and `.sha256`;
- verify checksum;
- inspect packaged files;
- tie any signed native artifacts to the intended source/version/signing identity;
- record rollback/replacement plan.

# Next safe work

The cross-platform source/build/documentation implementation is now at a freeze candidate.

The next action should be **exact-head executable verification**, not speculative feature expansion:

1. read the new PR #4 head after this handoff commit;
2. inspect all exact-head web/security/visual/native workflow runs;
3. fix only real exact-head failures;
4. if all automated checks become green, keep manual/device/signing/production-origin gates pending until actually executed;
5. do not create `v2.0.12` or merge PR #4 merely because source work appears complete.

No claim is made here that Windows/macOS/Linux installers, Android Play packages, or iOS/iPadOS App Store packages are already signed/published. The repository is now cross-platform **source/build supportable**; production native distribution remains an evidence/signing/release operation.

# 2026-08-20 exact-head verification repair continuation

## 38. Failing executable baseline inspected

The earlier freeze candidate `aa0fa7068cb0a50921383a2c97768fe4c168c25f` was not green when its workflows completed.

Observed evidence:

- CI run `32320815521` failed.
  - `quality` stopped at `npm run format:check`; Prettier 3.6.2 reported 26 tracked files requiring canonical formatting.
  - `e2e` could not start Playwright's preview web server because the nested production build exited with TypeScript code 2.
- Release Visual Evidence run `32320815527` failed for the same production-build failure, so no current browser screenshot artifact was produced.
- Native Cross-Platform run `32320815531` failed.
  - desktop Rust checks reached `tauri::generate_context!()` before generated native icons existed on a clean checkout;
  - Android project generation succeeded, then the shared production TypeScript build failed because browser-context E2E code was being compiled by the Node-only TypeScript project without DOM types such as `document`, `HTMLInputElement`, `HTMLSelectElement`, and `HTMLTextAreaElement`;
  - the shared TypeScript cause also invalidated treating the other platform build paths as a clean final candidate.
- CodeQL run `32320815530` succeeded on that same baseline, but an older/partial success does not override failures in the other required gates.

## 39. Production/E2E TypeScript separation repaired

The browser E2E project now has its own strict DOM-aware TypeScript configuration instead of being mixed into the Node-only tooling project.

Granular commits:

- `0f3cced6e15ceeb48d343627abaf968299987bd6` — `build: add dedicated Playwright TypeScript config`;
- `2d4564d271740cdcc48ef154983a1bb135b7f047` — `build: isolate browser E2E types from Node config`;
- `909e71cd617699ea161009c31fa4defa30c1bc33` — `build: typecheck E2E with its browser-aware project`.

The resulting structure is:

```text
tsconfig.app.json  → application/browser source
tsconfig.node.json → Vite/Vitest/Playwright configuration running in Node
tsconfig.e2e.json  → Playwright browser-context E2E source with DOM libraries
```

The root `tsconfig.json` references all three projects, so E2E remains part of strict build-time type checking rather than being excluded to make the build pass.

## 40. Clean-checkout native icon dependency repaired

Commit:

- `10e5983926218af31d440039dadf183dcbd6f1e3` — `build: prepare generated icons before native checks`.

`npm run native:check` now runs the existing deterministic native preparation step before `cargo check`.

This removes the previous hidden dependency on somebody having run icon generation earlier in the same checkout while keeping generated `src-tauri/icons/` untracked.

## 41. Dependency-update coverage expanded

Commit:

- `5a4599e60822b899eb6d3571d0fe7b07a713dad3` — `chore: add Dependabot coverage for Rust dependencies`.

Dependabot now covers:

- npm at repository root;
- Cargo under `/src-tauri`;
- GitHub Actions.

Rust dependency updates remain review-gated; this does not auto-merge native dependency changes.

## 42. Release tag/version integrity hardened

Commit:

- `cd32a157aec2680d8640fa64ec5431a71e343cc1` — `release: require tag to match package version`.

The tag-triggered release workflow now verifies that `GITHUB_REF_NAME` exactly equals `v${package.json.version}` before installation, verification, packaging, checksum generation, or GitHub Release creation.

This prevents a mistyped semantic tag from publishing artifacts under a version that disagrees with the product metadata.

## 43. Temporary self-mutating CI approach removed

Several small intermediate commits explored a one-shot formatter/lockfile repair job because the managed runner could execute the repository-pinned Prettier version even though the local shell could not resolve GitHub/npm dependencies.

That approach was **not** left as permanent CI design. The latest cleanup commit before this handoff was:

- `3a183bcb805c69dcd553d77513ce582390937854` — `ci: restore read-only verification workflow`.

Normal PR CI is again read-only (`contents: read`) and contains only the maintained `quality` and `e2e` verification jobs. No permanent PR job retains `contents: write` merely to rewrite its own branch.

## 44. Formatting remains an explicit unresolved gate

The 26-file Prettier failure from run `32320815521` has **not** been falsely marked fixed.

A repository-hosted one-shot formatter was prepared during this continuation, but GitHub-hosted jobs remained queued without runner execution during the active work session. Because no formatter execution result was obtained, the temporary write-enabled job was removed instead of being left behind as hidden future work.

Therefore the next continuation must still run the repository-pinned formatter and commit the deterministic formatting diff before expecting `format:check` to pass.

Do not weaken `format:check`, exclude the reported files, or claim a pass based on source inspection.

## 45. Dependency lockfiles remain pending, not fabricated

The audit found that neither root `package-lock.json` nor `src-tauri/Cargo.lock` is currently tracked.

Tracking both would improve reproducibility and would then allow CI/release workflows to use deterministic `npm ci` and native Cargo `--locked` verification. However, lockfiles must be generated by the real package managers against the declared dependency graphs; they were **not** hand-written or guessed.

The attempted managed-runner generation did not execute before the temporary repair path was removed, so no lockfile is claimed here.

Safe follow-up after real generation:

1. generate/commit `package-lock.json` using the repository's npm version policy;
2. generate/commit `src-tauri/Cargo.lock` using Cargo;
3. switch maintained CI/native/visual-evidence/release npm installs to `npm ci`;
4. use Cargo locked verification/build behavior where appropriate;
5. keep npm, Cargo, and Actions Dependabot coverage;
6. update dependency/reproducibility documentation and the exhaustive tracked-file inventory in the same change series.

## 46. Exhaustive inventory has known drift after the E2E split

`docs/repository-file-reference.md` still describes the earlier 171-file native-support checkpoint and still describes `tsconfig.node.json` as covering E2E.

The newly tracked `tsconfig.e2e.json` means that reference is no longer exact. Do not silently leave the stale count in a final release candidate.

Update the exhaustive inventory after the lockfile decision so the count is changed once, accurately, with every permanent new file represented.

## 47. Verification state after this repair series

The latest exact-head workflows observed during this continuation remained queued/pending rather than completed. Queued is not a pass.

The executable fixes above therefore have source-level review plus earlier failure evidence, but they still require fresh exact-head execution of:

- CI `quality`;
- CI `e2e`;
- Release Visual Evidence;
- Native Cross-Platform Windows/macOS/Linux/Android/iOS jobs;
- CodeQL.

If any of those fail on the new head, inspect that exact job/log and fix the actual failure. Every tracked fix changes the candidate SHA and invalidates older-SHA final evidence.

The PR should remain draft/unmerged and `v2.0.12` should remain uncreated until the automated exact-head gates and the already-documented manual/device/signing/production gates are actually satisfied.
