# Quality Gates

TableSpark 2.0.12 uses layered checks across the shared React/TypeScript product, web/PWA delivery, Tauri native configuration, Windows/macOS/Linux compilation, Android APK compilation, iOS simulator compilation, security, documentation, and manual release evidence.

## Standard local shared gate

Run:

```bash
npm run check
```

The command executes, in order:

1. `npm run format:check` — verifies maintained source/configuration formatting, including tracked Tauri JSON.
2. `npm run lint` — TypeScript-aware ESLint, React rules, JSX accessibility, Node-script linting.
3. `npm run typecheck` — strict TypeScript checks.
4. `npm run test` — domain/infrastructure/state/integration/localization/platform tests.
5. `npm run test:security` — repository secret-scanner tests.
6. `npm run secret:scan` — credential-pattern scan without printing matched values.
7. `npm run test:docs` — local Markdown link-checker tests plus repository-local link validation.
8. `npm run test:native-config` — tests the cross-platform configuration validator.
9. `npm run native:config:check` — validates actual package/Cargo/Tauri/CSP/capability/icon/mobile-target configuration.
10. `npm run build` — creates the production web/PWA frontend used directly by web delivery and packaged by Tauri native builds.

The shell sequence uses `&&`, so it stops at the first failure.

The native configuration checks deliberately require no Rust/Android/Xcode toolchain; they catch static drift in the ordinary shared quality path.

## Native local gate

On a host with Rust and the appropriate Tauri system prerequisites:

```bash
npm run check:native
npm run native:build:ci
```

`check:native` verifies Rust formatting and `cargo check`.

`native:build:ci` generates TableSpark native icons, builds the shared frontend and compiles the current desktop host without installer bundling/signing.

This is compile evidence, not production signing evidence.

## Browser journey gate

Install Chromium once:

```bash
npx playwright install chromium
```

Then:

```bash
npm run test:e2e
```

Linux CI can use:

```bash
npx playwright install --with-deps chromium
```

E2E covers primary learning/settings flows, accessibility invariants, English/Hindi localization and localized failures, print behavior, unreadable-storage recovery, and visible 2.0.12 version presentation.

The real screenshot spec remains opt-in to the Release Visual Evidence workflow.

## Production dependency gate

```bash
npm audit --omit=dev --audit-level=high
```

A high-severity production finding requires investigation before release. Do not lower the threshold solely to make a release pass.

## Native Cross-Platform gate

`.github/workflows/native.yml` is a required release-candidate evidence surface for the maintained native source/build targets.

Exact-head jobs compile:

- Windows desktop application;
- macOS desktop application;
- Linux desktop application;
- Android debug APK;
- iOS simulator application.

The desktop matrix also runs Rust format/type checks.

A green native workflow proves source/toolchain compilation for those CI targets. It does **not** prove:

- Windows/macOS production signing;
- macOS notarization;
- Android release-keystore/AAB/Play publication;
- iOS physical-device provisioning/App Store publication;
- real-device screen-reader, print, speech, local-storage, upgrade or installation behavior.

Those remain release-evidence gates.

## GitHub automation

The release-candidate automation set is:

- `.github/workflows/ci.yml` — shared quality plus Chromium E2E;
- `.github/workflows/native.yml` — desktop/Android/iOS compilation;
- `.github/workflows/codeql.yml` — JavaScript/TypeScript security analysis;
- `.github/workflows/visual-evidence.yml` — real Chromium screenshots;
- `.github/workflows/release.yml` — tag-triggered canonical web ZIP/checksum/GitHub Release.

The tagged release workflow reruns `npm run check` before packaging the web artifact. Signed native artifacts are intentionally not auto-published until owner-controlled signing/release-channel credentials and protected release operations exist.

See `docs/ci-cd.md` for trigger, permission, artifact and failure-triage details.

## Native security configuration gate

`npm run native:config:check` verifies critical maintained native invariants:

- package/Cargo version synchronization;
- Tauri version sourced from `package.json`;
- native identifier `in.sanskar.tablespark`;
- Vite dev/build paths;
- production and development CSP configured;
- only `main-capability` explicitly selected;
- required bundle icons declared;
- required native/mobile scripts and dependencies present;
- Android minimum API >=24;
- iOS minimum system version >=14.0.

If this fails, correct the intended source configuration rather than loosening the validator to accept accidental divergence.

## Signing-secret gate

No production native signing credential belongs in source or untrusted PR CI.

Do not commit or expose:

```text
Android keystores/signing passwords
Apple .p8/.p12 keys/certificates
provisioning profiles/private distribution secrets
Windows/macOS signing private keys
store/developer API tokens
```

Debug APKs, iOS simulator applications and unsigned/no-bundle desktop compilation are the correct PR-safe evidence paths.

## Documentation completeness gate

The exhaustive tracked-file reference is:

```text
docs/repository-file-reference.md
```

The current cross-platform checkpoint documents **171 tracked files**: the previous 156 plus exactly 15 native/platform/configuration additions.

The Markdown link checker verifies local link targets but cannot prove every newly tracked file is represented in this manual inventory. When adding/removing/renaming a tracked file, update the inventory/count in the same change series and compare with `git ls-files`/recursive Git tree in a real checkout.

## Manual accessibility/language/platform gates

Automation does not replace:

- NVDA/Narrator review on intended Windows paths;
- VoiceOver on macOS/iOS/iPadOS;
- TalkBack on Android;
- representative Linux accessibility checks;
- fluent/native Hindi terminology/layout/print review;
- physical-device Android/iPhone/iPad testing;
- native print/speech/file-link behavior;
- installation/restart/local-persistence/upgrade checks;
- platform signing/store identity verification.

Do not mark these passed based on shared React semantics or a compile job alone.

## Release-candidate sequence

Recommended verification for 2.0.12:

```bash
npm run check
npm run test:e2e
npm audit --omit=dev --audit-level=high
```

On native development hosts where practical:

```bash
npm run check:native
npm run native:build:ci
```

Then:

1. freeze the exact candidate SHA;
2. verify exact-head CI `quality` and `e2e`;
3. verify exact-head CodeQL;
4. verify exact-head Release Visual Evidence;
5. verify exact-head Native Cross-Platform Windows/macOS/Linux/Android/iOS jobs;
6. inspect screenshot artifacts;
7. complete intended real-platform accessibility/Hindi/print/device/install/signing checks;
8. complete production web-origin checks if web deployment is being released;
9. create `v2.0.12` only for the verified immutable commit;
10. verify the downloaded web ZIP/checksum;
11. verify signed native artifacts independently before public native distribution.

## Exact-head rule

A workflow result is not a final pass when it is:

- queued;
- pending/in progress;
- skipped;
- cancelled;
- unavailable;
- attached only to an older branch SHA.

Any source/documentation fix creates a new candidate and requires affected checks to be evaluated again.

Do not commit a purported final SHA into a tracked file if that edit itself would create a newer SHA. Record the immutable final SHA/run IDs in PR/check/release metadata after the final tracked-file commit.
