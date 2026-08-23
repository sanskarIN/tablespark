# TableSpark Repository File Reference

This is the exhaustive tracked-file map for the TableSpark 2.0.12 cross-platform release-candidate branch after the release-gate and reproducibility hardening completed on 2026-08-23.

The inventory below contains **174 explicitly listed tracked files**. Directories are not counted separately. The previous published reference listed 171 files; one already-tracked E2E TypeScript configuration had not yet been incorporated into that reference, and this continuation adds two committed dependency lockfiles. All three are included here.

Generated/untracked directories such as `node_modules/`, `dist/`, `coverage/`, `playwright-report/`, `test-results/`, `src-tauri/target/`, `src-tauri/gen/`, and `src-tauri/icons/` are intentionally excluded from the tracked-file count.

## Maintenance rule

Whenever a tracked file is added, removed, or renamed, update this reference in the same change series. Every entry below names the file and its primary purpose so the repository can be audited without silently skipping configuration, policy, documentation, tests, application source, or native source.

# 1. Root configuration and repository metadata — 18 files

1. `.editorconfig` — editor-independent UTF-8/LF/basic whitespace policy.
2. `.env.example` — non-secret environment placeholder/documentation; real local secrets stay untracked.
3. `.gitattributes` — Git text normalization and binary-asset classification.
4. `.gitignore` — excludes dependency/build/test output plus Tauri generated projects/icons/targets and common native signing artifacts.
5. `.nvmrc` — preferred Node version for version managers; synchronize with package/workflows/docs.
6. `.prettierignore` — paths excluded from Prettier.
7. `.prettierrc.json` — Prettier formatting policy.
8. `eslint.config.js` — JavaScript/TypeScript/React/JSX-accessibility lint configuration.
9. `index.html` — Vite HTML entry and React mount host.
10. `package.json` — product version 2.0.12, pinned npm toolchain metadata/dependencies, shared quality scripts, and Tauri/native/mobile commands.
11. `package-lock.json` — committed npm dependency resolution consumed by `npm ci` in setup, CI, CodeQL, visual evidence, native builds, and release automation.
12. `playwright.config.ts` — Chromium E2E and production-preview configuration.
13. `tsconfig.app.json` — strict application TypeScript project.
14. `tsconfig.e2e.json` — dedicated Playwright/E2E TypeScript project so browser-test globals and Node tooling do not leak into application compilation.
15. `tsconfig.json` — root TypeScript project-reference coordinator.
16. `tsconfig.node.json` — strict Node/tooling TypeScript project.
17. `vite.config.ts` — shared Vite/PWA build plus Tauri platform defines and `TAURI_DEV_HOST` mobile-development handling.
18. `vitest.config.ts` — jsdom/Vitest/coverage configuration.

# 2. Root public/project/policy documents — 10 files

19. `README.md` — public cross-platform product overview, supported-platform matrix, web/native/mobile quick starts, security/privacy/testing links.
20. `CHANGELOG.md` — notable changes including the 2.0.12 cross-platform release candidate.
21. `ROADMAP.md` — completed source/build scope and intentionally pending exact-head/device/signing/release gates.
22. `PRIVACY.md` — local-data behavior across browser/PWA/native installations, backup portability, native permissions, no-account/ads/analytics claims.
23. `SECURITY.md` — vulnerability reporting plus browser/native trust, capability, CSP, signing-secret, CI and artifact security policy.
24. `SUPPORT.md` — support routes and safe-information-sharing guidance.
25. `CONTRIBUTING.md` — contribution/review/quality/security expectations.
26. `CODE_OF_CONDUCT.md` — community participation policy.
27. `LICENSE` — MIT license.
28. `what_changed.md` — detailed continuation/release-candidate handoff ledger; must keep pending verification explicit.

# 3. GitHub repository configuration — 7 files

29. `.github/FUNDING.yml` — optional repository funding UI.
30. `.github/dependabot.yml` — npm/GitHub Actions dependency update policy.
31. `.github/pull_request_template.md` — PR author/reviewer checklist.
32. `.github/release.yml` — generated release-note category configuration; distinct from Actions release workflow.
33. `.github/ISSUE_TEMPLATE/bug_report.md` — structured redacted/synthetic bug-report guidance.
34. `.github/ISSUE_TEMPLATE/config.yml` — issue chooser/contact routing configuration.
35. `.github/ISSUE_TEMPLATE/feature_request.md` — feature-request guidance without collecting private learner data.

# 4. GitHub Actions workflows — 5 files

36. `.github/workflows/ci.yml` — shared quality/E2E/build/audit web CI using locked npm installation; package `check` includes native-config consistency gates.
37. `.github/workflows/codeql.yml` — JavaScript/TypeScript CodeQL analysis with explicit locked dependency install and application build.
38. `.github/workflows/native.yml` — Windows/macOS/Linux Tauri compile matrix plus Android debug APK and iOS simulator compilation using locked JavaScript dependencies.
39. `.github/workflows/release.yml` — tag-triggered locked web build/ZIP/SHA-256/GitHub Release automation.
40. `.github/workflows/visual-evidence.yml` — real Chromium light/dark compact/wide screenshot artifact capture using locked dependencies.

# 5. VS Code workspace files — 2 files

41. `.vscode/extensions.json` — recommended editor extensions.
42. `.vscode/settings.json` — workspace formatting/lint/local-TypeScript settings.

# 6. Architecture Decision Records — 4 files

43. `docs/adr/0001-typescript-react-pwa.md` — historical foundation decision for TypeScript/React/PWA; current architecture adds Tauri native packaging without replacing the shared product.
44. `docs/adr/0002-local-first-persistence.md` — local-first learner-state decision.
45. `docs/adr/0003-deterministic-practice.md` — deterministic seeded-practice decision.
46. `docs/adr/0004-preserve-unreadable-local-state.md` — anti-data-loss decision preserving invalid returned local data until explicit recovery.

# 7. Main engineering/product documentation — 20 files

47. `docs/accessibility.md` — accessibility implementation and manual NVDA/Narrator/VoiceOver/TalkBack/print/zoom matrix.
48. `docs/architecture.md` — shared React web/PWA/Tauri architecture, four storage startup states, native permission/CSP/build boundaries.
49. `docs/data-schema-v2.md` — persisted schema-2 field/invariant reference and schema-1 migration context.
50. `docs/deployment-evaluation.md` — web static-host evaluation and owner-approval/production-origin gate.
51. `docs/development.md` — daily development workflow/conventions.
52. `docs/git-workflow.md` — Git branch/status/diff/commit/push/PR guidance.
53. `docs/hindi-review-checklist.md` — fluent/native Hindi terminology/layout/print/assistive-technology review.
54. `docs/localization.md` — locale provider/catalog/preference/testing architecture.
55. `docs/native-packaging-evaluation.md` — implemented Tauri 2 Windows/macOS/Linux/Android/iOS architecture, commands, storage isolation, generated output, signing boundary.
56. `docs/performance.md` — performance budgets/measurement/optimization guidance.
57. `docs/quality-gates.md` — merge/release verification expectations.
58. `docs/release-evidence.md` — exact-head web/native/manual/signing evidence matrix for 2.0.12.
59. `docs/release-notes-template.md` — release-note drafting template.
60. `docs/release.md` — cross-platform candidate verification, web tag/package/checksum, native signing/device/store release process and rollback.
61. `docs/repository-settings.md` — recommended branch/ruleset/check configuration.
62. `docs/setup.md` — locked web setup plus Rust/Tauri/Windows/macOS/Linux/Android/iOS setup and troubleshooting.
63. `docs/testing.md` — domain/integration/E2E/native-config/native compile/manual-device verification strategy.
64. `docs/troubleshooting.md` — common setup/runtime/storage/PWA/build diagnosis.
65. `docs/user-guide.md` — end-user Tables/worksheet/Practice/Progress/Settings/backup/offline/keyboard guide.
66. `docs/verification-plan.md` — candidate verification sequence.

# 8. Deep documentation references — 10 files

67. `docs/commands-reference.md` — exhaustive locked web/native/mobile/security/docs/Git/release command reference.
68. `docs/configuration-reference.md` — package/TypeScript/Vite/Tauri/CSP/capability/mobile/CI configuration and synchronization rules.
69. `docs/ci-cd.md` — five workflow descriptions including Native Cross-Platform compilation, permissions and failure triage.
70. `docs/domain-model.md` — multiplication/practice/mastery/review/session/worksheet types and invariants.
71. `docs/state-and-persistence.md` — AppState actions, four startup storage classifications, migrations, transactional import, recovery and save-failure lifecycle.
72. `docs/security-model.md` — detailed browser/native threat boundaries, CSP/capability/signing/generated-output/update/CI rules.
73. `docs/maintenance.md` — recurring dependency/toolchain/schema/i18n/accessibility/PWA/docs/release/incident maintenance handbook.
74. `docs/glossary.md` — project-specific product/engineering/security/release terminology.
75. `docs/documentation-index.md` — audience/task navigation and source-of-truth hierarchy including native development/release paths.
76. `docs/repository-file-reference.md` — this exhaustive 174-file map.

# 9. Documentation asset — 1 file

77. `docs/assets/interface-preview.svg` — repository UI preview illustration; not real release screenshot evidence.

# 10. Browser end-to-end tests — 6 files

78. `e2e/accessibility.spec.ts` — stable browser semantic/keyboard accessibility invariants.
79. `e2e/localization.spec.ts` — Hindi switching/persistence/document-language plus visible 2.0.12 About-version assertions.
80. `e2e/localized-errors.spec.ts` — Hindi table/practice/backup failure localization checks.
81. `e2e/print.spec.ts` — worksheet/answer-key print-media semantics.
82. `e2e/release-evidence.spec.ts` — opt-in real browser screenshot capture.
83. `e2e/smoke.spec.ts` — primary table/practice/profile/accessibility/recovery browser journey.

# 11. Public static asset — 1 file

84. `public/logo.svg` — TableSpark runtime/PWA identity asset and source image for generated native platform icons.

# 12. Repository utility/configuration scripts — 9 files

85. `scripts/link-check.mjs` — CLI for repository-local Markdown link verification.
86. `scripts/link-checker.mjs` — dependency-free Markdown local-link extraction/validation implementation.
87. `scripts/link-checker.test.mjs` — Node tests for link-checker behavior.
88. `scripts/secret-scan.mjs` — CLI for repository credential-pattern scanning.
89. `scripts/secret-scanner.mjs` — dependency-free secret-pattern/redacted-finding implementation.
90. `scripts/secret-scanner.test.mjs` — synthetic Node tests for scanner detections/redaction.
91. `scripts/native-config.mjs` — static cross-platform invariant validator for versions, npm/Cargo toolchain locking, identifier, paths, CSP, capability, icons, scripts/dependencies and mobile minimums.
92. `scripts/native-config-check.mjs` — executable repository-config checker loading package/Cargo/Tauri/Android/iOS files.
93. `scripts/native-config.test.mjs` — Node regression tests for valid config plus version/toolchain/CSP/capability/icon/mobile-target drift.

# 13. Application shell/top-level integration — 3 files

94. `src/App.tsx` — shared app shell/navigation/theme/shortcuts/features/footer; native support link uses platform-safe external handoff.
95. `src/App.test.tsx` — broad React integration coverage including shifted-slash shortcut fallback.
96. `src/main.tsx` — shared bootstrap/providers/CSS plus runtime-aware PWA registration disabled in native shells.

# 14. Shared cross-cutting React components — 3 files

97. `src/components/ErrorBoundary.tsx` — localized fatal UI boundary with redacted technical logging.
98. `src/components/StatusBanners.tsx` — storage/recovery/offline/PWA/install/onboarding status UI.
99. `src/components/StatusBanners.test.tsx` — PWA update/offline/install banner lifecycle regression coverage.

# 15. Domain: answers — 2 files

100. `src/domain/answers.ts` — bounded integer practice response validation.
101. `src/domain/answers.test.ts` — response-bound tests.

# 16. Domain: difficulty — 2 files

102. `src/domain/difficulty.ts` — Starter/Foundation/Builder/Fluency/Challenge preset metadata.
103. `src/domain/difficulty.test.ts` — preset bounds/progression tests.

# 17. Domain: mastery — 2 files

104. `src/domain/mastery.ts` — canonical fact attempt/correct/streak/mistake/accuracy updates.
105. `src/domain/mastery.test.ts` — mastery counter/streak/mistake/schema-metadata tests.

# 18. Domain: progress — 2 files

106. `src/domain/progress.ts` — transparent mastered rule plus search/filter/order logic.
107. `src/domain/progress.test.ts` — mastery classification/search/filter/order tests.

# 19. Domain: questions — 2 files

108. `src/domain/questions.ts` — deterministic seeded question generation/settings validation/canonical keys.
109. `src/domain/questions.test.ts` — deterministic/bounds/property/mathematics tests.

# 20. Domain: mistake review — 2 files

110. `src/domain/review.ts` — newest-first deduplicated commutative mistake-review question selection.
111. `src/domain/review.test.ts` — review count/deduplication tests.

# 21. Domain: session history/goals — 2 files

112. `src/domain/sessions.ts` — retention options/default/max, goal max, trim/prepend helpers.
113. `src/domain/sessions.test.ts` — retention/prepend/trim tests.

# 22. Domain: multiplication tables — 2 files

114. `src/domain/tables.ts` — range/step/5,000-row budget validation, row generation, equation formatting.
115. `src/domain/tables.test.ts` — range/order/step/invalid/budget tests.

# 23. Domain types — 1 file

116. `src/domain/types.ts` — immutable shared table/question/attempt/mastery/session/profile/settings/persisted schema-2 types.

# 24. Domain worksheet model — 2 files

117. `src/domain/worksheet.ts` — worksheet prompt/answer/solved model and line/box/space blanks.
118. `src/domain/worksheet.test.ts` — worksheet presentation-model tests.

# 25. Feature: About — 1 file

119. `src/features/about/AboutPage.tsx` — localized version/license/privacy/contact/source/funding information; native links use OS handoff.

# 26. Feature: Practice — 1 file

120. `src/features/practice/PracticeDrill.tsx` — setup/presets/seeds/timing/questions/answers/speech/review/session completion.

# 27. Feature: Progress — 1 file

121. `src/features/progress/ProgressDashboard.tsx` — mastery metrics/search/filter/goals/recent sessions/mistakes.

# 28. Feature: Settings — 1 file

122. `src/features/settings/SettingsPage.tsx` — locale/theme/accessibility/defaults/history/goals/profiles/backup/recovery/reset/about controls.

# 29. Feature: Tables/print — 1 file

123. `src/features/tables/TableGenerator.tsx` — table controls/worksheet composer/study/practice/answer-key/print/speech rendering.

# 30. Internationalization core — 9 files

124. `src/i18n/LocaleContext.tsx` — runtime locale provider, persistence and document language updates.
125. `src/i18n/messages.ts` — English catalog composition and structural `MessageCatalog` type.
126. `src/i18n/types.ts` — type utilities that widen English literal catalog shapes.
127. `src/i18n/en.ts` — platform-neutral English shell/status/feature/settings/about copy for 2.0.12.
128. `src/i18n/hi.ts` — platform-neutral complete Hindi catalog for 2.0.12.
129. `src/i18n/learning.ts` — English session-history/goal copy.
130. `src/i18n/pwa.ts` — English optional browser PWA install copy.
131. `src/i18n/shortcuts.ts` — English keyboard-shortcut copy/functions.
132. `src/i18n/localePreference.ts` — supported locale list and resilient local preference/browser-language fallback.

# 31. Internationalization tests — 3 files

133. `src/i18n/catalogParity.test.ts` — Hindi/English structural parity, nonblank messages and package/UI version consistency.
134. `src/i18n/localePreference.test.ts` — supported/stored/browser fallback and storage-failure tests.
135. `src/localization.test.tsx` — runtime English/Hindi integration, document language, persistence, backup separation.

# 32. Browser-preference infrastructure — 2 files

136. `src/infrastructure/browserPreferences.ts` — safe non-critical local preference helpers.
137. `src/infrastructure/browserPreferences.test.ts` — preference/storage-failure tests.

# 33. Install-prompt infrastructure — 2 files

138. `src/infrastructure/installPrompt.ts` — optional browser PWA install-event type guard/model.
139. `src/infrastructure/installPrompt.test.ts` — install-prompt event recognition tests.

# 34. Logging infrastructure — 2 files

140. `src/infrastructure/logger.ts` — structured technical logger with sensitive key/value redaction.
141. `src/infrastructure/logger.test.ts` — logger redaction tests.

# 35. Migration infrastructure — 2 files

142. `src/infrastructure/migrations.ts` — current schema version and schema-1-to-schema-2 transformation.
143. `src/infrastructure/migrations.test.ts` — passthrough/migration/unsupported-version tests.

# 36. PWA lifecycle infrastructure — 2 files

144. `src/infrastructure/pwaEvents.ts` — decoupled update-ready/offline-ready events for web/PWA service-worker callbacks.
145. `src/infrastructure/pwaEvents.test.ts` — PWA event/non-forced-update tests.

# 37. Practice seed infrastructure — 2 files

146. `src/infrastructure/random.ts` — valid random seed helper for generated practice.
147. `src/infrastructure/random.test.ts` — deterministic injected-randomness seed tests.

# 38. Speech infrastructure — 2 files

148. `src/infrastructure/speech.ts` — safe speech-synthesis feature detection/invocation.
149. `src/infrastructure/speech.test.ts` — available/unavailable/failure speech tests.

# 39. Storage/import infrastructure — 2 files

150. `src/infrastructure/storage.ts` — structural/semantic state validation, byte/profile bounds, four-state load classification, save/import/export/raw recovery/clear.
151. `src/infrastructure/storage.test.ts` — comprehensive persistence/migration/semantic/blocking/corruption/write/clear tests.

# 40. App-wide integration tests — 2 files

152. `src/keyboardShortcuts.test.tsx` — shortcut dialog/open/close/editable-control guard tests.
153. `src/learningRecords.test.tsx` — session/goal/retention plus atomic profile capacity and transactional backup/storage integration regressions.

# 41. Application state layer — 3 files

154. `src/state/AppStateContext.ts` — typed state/action context contract including storage-read state and transactional backup result.
155. `src/state/AppStateProvider.tsx` — load/classify/default/save/profile/settings/attempt/session/goal/import/recovery/reset coordinator.
156. `src/state/useAppState.ts` — safe typed context hook.

# 42. Stylesheets — 4 files

157. `src/styles.css` — main tokens/layout/themes/responsive/print/worksheet styling.
158. `src/status.css` — status/recovery/PWA/fatal UI styling.
159. `src/shortcuts.css` — keyboard-shortcut dialog/list styling.
160. `src/learning.css` — goals/session/learning-record responsive styling.

# 43. Test setup/type declarations — 2 files

161. `src/test/setup.ts` — shared Vitest/jsdom setup/polyfills/matchers.
162. `src/vite-env.d.ts` — Vite/PWA declarations plus `__TABLESPARK_NATIVE__` and `__TABLESPARK_PLATFORM__` build constants.

# 44. Shared web/native platform layer — 3 files

163. `src/platform/runtime.ts` — runtime platform/native detection with safe web fallback and PWA-registration decision.
164. `src/platform/runtime.test.ts` — regression proving non-Vite/test contexts resolve safely to web/PWA behavior.
165. `src/platform/openExternalUrl.ts` — web/native external-navigation bridge using scoped Tauri opener in packaged apps.

# 45. Tauri native source/configuration — 9 files

166. `src-tauri/Cargo.toml` — Rust/Tauri package manifest synchronized to product version 2.0.12.
167. `src-tauri/Cargo.lock` — committed Rust/Tauri dependency resolution enforced by locked native verification.
168. `src-tauri/build.rs` — Tauri Cargo build integration.
169. `src-tauri/capabilities/default.json` — `main-capability` allowing only core defaults and exact maintained external URLs.
170. `src-tauri/src/lib.rs` — shared desktop/mobile Tauri application entrypoint with opener plugin.
171. `src-tauri/src/main.rs` — desktop executable entrypoint and Windows release console suppression.
172. `src-tauri/tauri.conf.json` — shared native identity/version/frontend/window/CSP/capability/icon/bundle configuration.
173. `src-tauri/tauri.android.conf.json` — Android minimum API 24 and `.debug` application-ID suffix configuration.
174. `src-tauri/tauri.ios.conf.json` — iOS/iPadOS minimum system version 14.0 configuration.

# Cross-file synchronization checklist

## Product/app version

Review together:

- `package.json`;
- `src-tauri/Cargo.toml`;
- `src-tauri/tauri.conf.json` version source;
- visible English/Hindi Settings/About copy/tests;
- changelog/release docs/native config fixtures.

## Node/npm/Cargo toolchain and dependency resolution

Review together:

- `.nvmrc`;
- `package.json` engines and `packageManager`;
- `package-lock.json`;
- `src-tauri/Cargo.toml` and `src-tauri/Cargo.lock`;
- all Actions Node/npm installation steps;
- `native:check` locked behavior;
- setup/configuration/command docs and native/mobile requirements.

Ordinary verification must not regenerate dependency resolution implicitly.

## Native permission/CSP changes

Review:

- `src-tauri/tauri.conf.json`;
- `src-tauri/capabilities/default.json`;
- `src/platform/` adapter;
- native-config tests;
- `SECURITY.md`, `PRIVACY.md`, `docs/security-model.md`;
- native CI and release evidence.

## Native platform minimums/identifier

Review platform Tauri configs, validator/tests, README/setup/native-packaging/release docs, signing/store identity records and actual platform upgrade behavior.

## Persistence schema

Review domain types, migration/storage/provider, tests, schema/state/privacy/security/user docs and changelog/handoff. Native packaging does not create a second learner schema.

## PWA/native lifecycle

Review Vite, `main.tsx`, platform runtime, PWA events/install/status copy/tests, Tauri package/update decision, deployment/release docs.

## Locale

Review preference/provider/catalogs/tests/E2E/document language and platform-neutral copy. Native narrow-layout/assistive-technology review remains manual.

## Workflows/check names

Review workflow YAML, CI/testing/quality/repository-settings docs and branch protection using actual successful GitHub check names.

# Files intentionally not tracked

Normal generated/local paths include:

```text
node_modules/
dist/
coverage/
.vite/
playwright-report/
test-results/
*.tsbuildinfo
.env
.env.local
.env.*.local
*.log
src-tauri/target/
src-tauri/gen/
src-tauri/icons/
```

`package-lock.json`, `src-tauri/Cargo.lock`, and `tsconfig.e2e.json` are intentionally tracked and must not be treated as generated cleanup output.

Common native signing artifacts are also intentionally excluded from source:

```text
*.jks
*.keystore
*.p12
*.p8
*.mobileprovision
keystore.properties
```

Ignoring signing material is defense in depth; production private keys/passwords belong in protected release systems/local signing environments, never source or pull-request logs.

# Completeness verification procedure

When maintaining this file:

1. obtain `git ls-files` or an equivalent recursive Git blob list for the intended branch/commit;
2. compare every tracked path with this inventory;
3. update purposes/count for additions/removals/renames;
4. update documentation navigation for new public/deep docs;
5. run `npm run test:docs` in an actual checkout;
6. record the completeness change in `what_changed.md`.

Local count examples:

```bash
git ls-files | wc -l
```

PowerShell:

```powershell
(git ls-files).Count
```

At this release-gate/reproducibility checkpoint this reference lists **174 tracked files**: the prior 171-file reference plus the previously omitted `tsconfig.e2e.json`, committed `package-lock.json`, and committed `src-tauri/Cargo.lock`. Generated Tauri/mobile/icon/build output is deliberately not included.
