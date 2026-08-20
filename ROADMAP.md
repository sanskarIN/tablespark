# TableSpark Roadmap

The roadmap prioritizes coherent learning value, accessibility, reliability, maintainability, and one shared cross-platform product. Items are not promises or fixed release dates.

## 0.1 — Foundation

- [x] Custom multiplication table generator with a bounded render budget.
- [x] Responsive offline-first web/PWA shell.
- [x] Timed and untimed practice.
- [x] Random-by-default practice with deterministic replay seeds.
- [x] Validated unsigned seed range and deterministic generator tests.
- [x] Bounded practice-response validation aligned with current product limits.
- [x] Deduplicated mistake review and mastery tracking.
- [x] Searchable/filterable mastery progress with a transparent mastery rule.
- [x] Offline profiles with explicit capacity and local persistence.
- [x] User-visible local-storage write-failure state.
- [x] Preserved unreadable local state with download/import/discard recovery workflow.
- [x] Validated backup export/import with shared persistence-size budget and semantic integrity checks.
- [x] Light/dark/system appearance.
- [x] Large-text and reduced-motion settings.
- [x] Print-friendly solved/blank worksheet layout with paper-only Name/Date metadata.
- [x] Progressive speech synthesis with unsupported/failure fallback.
- [x] Typed runtime locale provider with English and Hindi interface catalogs plus persisted language switching.
- [x] Structured logging with sensitive-key and sensitive-value redaction.
- [x] Unit/property/integration/browser testing.
- [x] Repository secret scanner plus scanner tests in the quality gate.
- [x] Web CI, dependency auditing, CodeQL, Dependabot, and tagged web-release workflow.

## 0.2 — Classroom refinement

- [x] Dedicated worksheet composer with answer-key mode and configurable blank-answer layout.
- [x] More difficulty presets that map cleanly to number ranges and question counts.
- [x] Session history summaries stored locally with retention controls.
- [x] Optional per-profile goals without streak pressure or punitive mechanics.
- [x] Improved print pagination controls for common paper sizes.
- [ ] Human review of real release screenshots across light/dark and compact/wide layouts.

## 0.3 — Internationalization and accessibility expansion

- [x] Central runtime locale provider.
- [x] Typed Hindi (`hi`) interface with persisted language switching and browser smoke coverage.
- [x] Browser-assisted automated accessibility checks where stable.
- [x] Screen-reader manual-test matrix covering major desktop/mobile platform combinations.
- [x] Keyboard shortcuts with an in-app reference.
- [ ] Fluent/native Hindi terminology, narrow-layout, print, and assistive-technology review before making strong public translation-quality claims.

## 2.0.12 — Cross-platform application architecture

The earlier “native packaging deferred” decision has been superseded by the explicit cross-platform requirement.

- [x] Keep the React/TypeScript learning product, domain rules, localization, persistence schema, and backup format shared across every target.
- [x] Add a Tauri 2 Rust shell for packaged applications.
- [x] Add native source/build support for Windows.
- [x] Add native source/build support for macOS.
- [x] Add native source/build support for Linux.
- [x] Add native source/build support for Android.
- [x] Add native source/build support for iOS/iPadOS.
- [x] Preserve normal browser/PWA delivery in parallel with native delivery.
- [x] Disable PWA service-worker registration inside packaged native builds.
- [x] Add web/native runtime detection with safe test fallback.
- [x] Open support/project/funding destinations through a narrowly scoped native opener permission.
- [x] Generate native platform icons from the maintained TableSpark SVG logo.
- [x] Ignore generated mobile projects, Rust target output, generated icon sets, and signing credentials.
- [x] Add native configuration consistency tests/gate.
- [x] Add Windows/macOS/Linux native compile verification in GitHub Actions.
- [x] Add Android debug APK compilation in GitHub Actions.
- [x] Add iOS simulator compilation in GitHub Actions.
- [x] Configure Android minimum API 24.
- [x] Configure iOS minimum version 14.0.
- [x] Support Tauri-provided mobile development host behavior for physical iOS development.
- [x] Document per-install storage isolation and validated backup transfer between platforms.
- [ ] Verify the exact final 2.0.12 head passes all web, security, visual-evidence, and native workflow jobs.
- [ ] Perform real-device Android and iOS/iPadOS functional/accessibility/print/speech review.
- [ ] Perform installed Windows/macOS/Linux application review on actual target machines.
- [ ] Configure repository-owner production signing identities for each native distribution channel.
- [ ] Verify signed Windows package identity and installation/upgrade behavior before public release.
- [ ] Verify macOS signing/notarization and installation/upgrade behavior before public release.
- [ ] Verify Android release signing and APK/AAB installation/upgrade behavior before public release/store upload.
- [ ] Verify Apple signing/provisioning and iOS/iPadOS device/App Store package behavior before public release/store upload.

## Web deployment and release integrity

- [x] PWA install/update messaging without interrupting practice.
- [x] Web release ZIP integrity metadata.
- [x] Release-evidence screenshot workflow.
- [ ] Activate or automate a production static deployment only after repository-owner approval.
- [ ] Verify production-origin manifest/service-worker scope, installability, offline reload, and update behavior.
- [ ] Create the final `v2.0.12` tag only after the exact candidate and intended manual gates are satisfied.
- [ ] Download and verify the release ZIP/checksum after publication.

## External/manual release gates

These are deliberately not marked complete by source-code changes alone:

- human inspection of real light/dark and compact/wide screenshots;
- manual NVDA, Narrator, VoiceOver, and TalkBack passes;
- fluent/native Hindi review;
- production HTTPS web-origin approval/verification;
- signed native package identities and signing-key ownership;
- real installed-app/device tests on Windows, macOS, Linux, Android, iOS, and iPadOS;
- app-store/developer-account ownership where store distribution is intended;
- release tag and post-release artifact verification.

## Long-term ideas

- Optional local classroom roster import/export formats.
- Teacher-print packs generated entirely client-side.
- More practice formats such as missing-factor questions.
- Optional local-only achievements focused on learning progress rather than engagement pressure.
- Accessibility-reviewed sound cues with a fully silent default path available.
- Signed native auto-update strategy only after package signing and distribution ownership are established.

## Non-goals unless requirements change

- Separate feature implementations for each operating system.
- Mandatory accounts for core learning.
- Advertising or paywalls around core functionality.
- Cloud collection of learner answers by default.
- Custom cryptography.
- Microservices for a local-first learning tool.
- General shell/process/filesystem access in the native wrapper without an explicit product requirement and security review.
- Intrusive donation prompts.
