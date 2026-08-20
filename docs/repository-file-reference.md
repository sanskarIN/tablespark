# TableSpark Repository File Reference

This is the exhaustive tracked-file map for the TableSpark 2.0.12 cross-platform release-candidate branch after the native-support implementation on 2026-08-20.

The inventory below contains **171 explicitly listed tracked files**. Directories are not counted separately. The previous documentation checkpoint contained 156 tracked files; this cross-platform phase added exactly 15 tracked files and removed none.

Generated/untracked directories such as `node_modules/`, `dist/`, `coverage/`, `playwright-report/`, `test-results/`, `src-tauri/target/`, `src-tauri/gen/`, and `src-tauri/icons/` are intentionally excluded from the tracked-file count.

## Maintenance rule

Whenever a tracked file is added, removed, or renamed, update this reference in the same change series. Every entry below names the file and its primary purpose so the repository can be audited without silently skipping configuration, policy, documentation, tests, application source, or native source.

# 1. Root configuration and repository metadata — 16 files

1. `.editorconfig` — editor-independent UTF-8/LF/basic whitespace policy.
2. `.env.example` — non-secret environment placeholder/documentation; real local secrets stay untracked.
3. `.gitattributes` — Git text normalization and binary-asset classification.
4. `.gitignore` — excludes dependency/build/test output plus Tauri generated projects/icons/targets and common native signing artifacts.
5. `.nvmrc` — preferred Node version for version managers; synchronize with package/workflows/docs.
6. `.prettierignore` — paths excluded from Prettier.
7. `.prettierrc.json` — Prettier formatting policy.
8. `eslint.config.js` — JavaScript/TypeScript/React/JSX-accessibility lint configuration.
9. `index.html` — Vite HTML entry and React mount host.
10. `package.json` — product version 2.0.12, Node metadata/dependencies, shared quality scripts, Tauri/native/mobile commands.
11. `playwright.config.ts` — Chromium E2E and production-preview configuration.
12. `tsconfig.app.json` — strict application TypeScript project.
13. `tsconfig.json` — root TypeScript project-reference coordinator.
14. `tsconfig.node.json` — strict Node/tooling/E2E TypeScript project.
15. `vite.config.ts` — shared Vite/PWA build plus Tauri platform defines and `TAURI_DEV_HOST` mobile-development handling.
16. `vitest.config.ts` — jsdom/Vitest/coverage configuration.

# 2. Root public/project/policy documents — 10 files

17. `README.md` — public cross-platform product overview, supported-platform matrix, web/native/mobile quick starts, security/privacy/testing links.
18. `CHANGELOG.md` — notable changes including the 2.0.12 cross-platform release candidate.
19. `ROADMAP.md` — completed source/build scope and intentionally pending exact-head/device/signing/release gates.
20. `PRIVACY.md` — local-data behavior across browser/PWA/native installations, backup portability, native permissions, no-account/ads/analytics claims.
21. `SECURITY.md` — vulnerability reporting plus browser/native trust, capability, CSP, signing-secret, CI and artifact security policy.
22. `SUPPORT.md` — support routes and safe-information-sharing guidance.
23. `CONTRIBUTING.md` — contribution/review/quality/security expectations.
24. `CODE_OF_CONDUCT.md` — community participation policy.
25. `LICENSE` — MIT license.
26. `what_changed.md` — detailed continuation/release-candidate handoff ledger; must keep pending verification explicit.

# 3. GitHub repository configuration — 7 files

27. `.github/FUNDING.yml` — optional repository funding UI.
28. `.github/dependabot.yml` — npm/GitHub Actions dependency update policy.
29. `.github/pull_request_template.md` — PR author/reviewer checklist.
30. `.github/release.yml` — generated release-note category configuration; distinct from Actions release workflow.
31. `.github/ISSUE_TEMPLATE/bug_report.md` — structured redacted/synthetic bug-report guidance.
32. `.github/ISSUE_TEMPLATE/config.yml` — issue chooser/contact routing configuration.
33. `.github/ISSUE_TEMPLATE/feature_request.md` — feature-request guidance without collecting private learner data.

# 4. GitHub Actions workflows — 5 files

34. `.github/workflows/ci.yml` — shared quality/E2E/build/audit web CI; package `check` now includes native-config consistency gates.
35. `.github/workflows/codeql.yml` — JavaScript/TypeScript CodeQL analysis.
36. `.github/workflows/native.yml` — **new** Windows/macOS/Linux Tauri compile matrix plus Android debug APK and iOS simulator compilation.
37. `.github/workflows/release.yml` — tag-triggered web build/ZIP/SHA-256/GitHub Release automation.
38. `.github/workflows/visual-evidence.yml` — real Chromium light/dark compact/wide screenshot artifact capture.

# 5. VS Code workspace files — 2 files

39. `.vscode/extensions.json` — recommended editor extensions.
40. `.vscode/settings.json` — workspace formatting/lint/local-TypeScript settings.

# 6. Architecture Decision Records — 4 files

41. `docs/adr/0001-typescript-react-pwa.md` — historical foundation decision for TypeScript/React/PWA; current architecture adds Tauri native packaging without replacing the shared product.
42. `docs/adr/0002-local-first-persistence.md` — local-first learner-state decision.
43. `docs/adr/0003-deterministic-practice.md` — deterministic seeded-practice decision.
44. `docs/adr/0004-preserve-unreadable-local-state.md` — anti-data-loss decision preserving invalid returned local data until explicit recovery.

# 7. Main engineering/product documentation — 20 files

45. `docs/accessibility.md` — accessibility implementation and manual NVDA/Narrator/VoiceOver/TalkBack/print/zoom matrix.
46. `docs/architecture.md` — shared React web/PWA/Tauri architecture, four storage startup states, native permission/CSP/build boundaries.
47. `docs/data-schema-v2.md` — persisted schema-2 field/invariant reference and schema-1 migration context.
48. `docs/deployment-evaluation.md` — web static-host evaluation and owner-approval/production-origin gate.
49. `docs/development.md` — daily development workflow/conventions.
50. `docs/git-workflow.md` — Git branch/status/diff/commit/push/PR guidance.
51. `docs/hindi-review-checklist.md` — fluent/native Hindi terminology/layout/print/assistive-technology review.
52. `docs/localization.md` — locale provider/catalog/preference/testing architecture.
53. `docs/native-packaging-evaluation.md` — implemented Tauri 2 Windows/macOS/Linux/Android/iOS architecture, commands, storage isolation, generated output, signing boundary.
54. `docs/performance.md` — performance budgets/measurement/optimization guidance.
55. `docs/quality-gates.md` — merge/release verification expectations.
56. `docs/release-evidence.md` — exact-head web/native/manual/signing evidence matrix for 2.0.12.
57. `docs/release-notes-template.md` — release-note drafting template.
58. `docs/release.md` — cross-platform candidate verification, web tag/package/checksum, native signing/device/store release process and rollback.
59. `docs/repository-settings.md` — recommended branch/ruleset/check configuration.
60. `docs/setup.md` — web plus Rust/Tauri/Windows/macOS/Linux/Android/iOS setup and troubleshooting.
61. `docs/testing.md` — domain/integration/E2E/native-config/native compile/manual-device verification strategy.
62. `docs/troubleshooting.md` — common setup/runtime/storage/PWA/build diagnosis.
63. `docs/user-guide.md` — end-user Tables/worksheet/Practice/Progress/Settings/backup/offline/keyboard guide.
64. `docs/verification-plan.md` — candidate verification sequence.

# 8. Deep documentation references — 10 files

65. `docs/commands-reference.md` — exhaustive web/native/mobile/security/docs/Git/release command reference.
66. `docs/configuration-reference.md` — package/TypeScript/Vite/Tauri/CSP/capability/mobile/CI configuration and synchronization rules.
67. `docs/ci-cd.md` — five workflow descriptions including Native Cross-Platform compilation, permissions and failure triage.
68. `docs/domain-model.md` — multiplication/practice/mastery/review/session/worksheet types and invariants.
69. `docs/state-and-persistence.md` — AppState actions, four startup storage classifications, migrations, transactional import, recovery and save-failure lifecycle.
70. `docs/security-model.md` — detailed browser/native threat boundaries, CSP/capability/signing/generated-output/update/CI rules.
71. `docs/maintenance.md` — recurring dependency/toolchain/schema/i18n/accessibility/PWA/docs/release/incident maintenance handbook.
72. `docs/glossary.md` — project-specific product/engineering/security/release terminology.
73. `docs/documentation-index.md` — audience/task navigation and source-of-truth hierarchy including native development/release paths.
74. `docs/repository-file-reference.md` — this exhaustive 171-file map.

# 9. Documentation asset — 1 file

75. `docs/assets/interface-preview.svg` — repository UI preview illustration; not real release screenshot evidence.

# 10. Browser end-to-end tests — 6 files

76. `e2e/accessibility.spec.ts` — stable browser semantic/keyboard accessibility invariants.
77. `e2e/localization.spec.ts` — Hindi switching/persistence/document-language plus visible 2.0.12 About-version assertions.
78. `e2e/localized-errors.spec.ts` — Hindi table/practice/backup failure localization checks.
79. `e2e/print.spec.ts` — worksheet/answer-key print-media semantics.
80. `e2e/release-evidence.spec.ts` — opt-in real browser screenshot capture.
81. `e2e/smoke.spec.ts` — primary table/practice/profile/accessibility/recovery browser journey.

# 11. Public static asset — 1 file

82. `public/logo.svg` — TableSpark runtime/PWA identity asset and **source image for generated native platform icons**.

# 12. Repository utility/configuration scripts — 9 files

83. `scripts/link-check.mjs` — CLI for repository-local Markdown link verification.
84. `scripts/link-checker.mjs` — dependency-free Markdown local-link extraction/validation implementation.
85. `scripts/link-checker.test.mjs` — Node tests for link-checker behavior.
86. `scripts/secret-scan.mjs` — CLI for repository credential-pattern scanning.
87. `scripts/secret-scanner.mjs` — dependency-free secret-pattern/redacted-finding implementation.
88. `scripts/secret-scanner.test.mjs` — synthetic Node tests for scanner detections/redaction.
89. `scripts/native-config.mjs` — **new** static cross-platform invariant validator for versions, identifier, paths, CSP, capability, icons, scripts/dependencies and mobile minimums.
90. `scripts/native-config-check.mjs` — **new** executable repository-config checker loading package/Cargo/Tauri/Android/iOS files.
91. `scripts/native-config.test.mjs` — **new** Node regression tests for valid config and version/CSP/capability/icon/mobile-target drift.

# 13. Application shell/top-level integration — 3 files

92. `src/App.tsx` — shared app shell/navigation/theme/shortcuts/features/footer; native support link uses platform-safe external handoff.
93. `src/App.test.tsx` — broad React integration coverage.
94. `src/main.tsx` — shared bootstrap/providers/CSS plus runtime-aware PWA registration disabled in native shells.

# 14. Shared cross-cutting React components — 3 files

95. `src/components/ErrorBoundary.tsx` — localized fatal UI boundary with redacted technical logging.
96. `src/components/StatusBanners.tsx` — storage/recovery/offline/PWA/install/onboarding status UI.
97. `src/components/StatusBanners.test.tsx` — PWA update/offline/install banner lifecycle regression coverage.

# 15. Domain: answers — 2 files

98. `src/domain/answers.ts` — bounded integer practice response validation.
99. `src/domain/answers.test.ts` — response-bound tests.

# 16. Domain: difficulty — 2 files

100. `src/domain/difficulty.ts` — Starter/Foundation/Builder/Fluency/Challenge preset metadata.
101. `src/domain/difficulty.test.ts` — preset bounds/progression tests.

# 17. Domain: mastery — 2 files

102. `src/domain/mastery.ts` — canonical fact attempt/correct/streak/mistake/accuracy updates.
103. `src/domain/mastery.test.ts` — mastery counter/streak/mistake/schema-metadata tests.

# 18. Domain: progress — 2 files

104. `src/domain/progress.ts` — transparent mastered rule plus search/filter/order logic.
105. `src/domain/progress.test.ts` — mastery classification/search/filter/order tests.

# 19. Domain: questions — 2 files

106. `src/domain/questions.ts` — deterministic seeded question generation/settings validation/canonical keys.
107. `src/domain/questions.test.ts` — deterministic/bounds/property/mathematics tests.

# 20. Domain: mistake review — 2 files

108. `src/domain/review.ts` — newest-first deduplicated commutative mistake-review question selection.
109. `src/domain/review.test.ts` — review count/deduplication tests.

# 21. Domain: session history/goals — 2 files

110. `src/domain/sessions.ts` — retention options/default/max, goal max, trim/prepend helpers.
111. `src/domain/sessions.test.ts` — retention/prepend/trim tests.

# 22. Domain: multiplication tables — 2 files

112. `src/domain/tables.ts` — range/step/5,000-row budget validation, row generation, equation formatting.
113. `src/domain/tables.test.ts` — range/order/step/invalid/budget tests.

# 23. Domain types — 1 file

114. `src/domain/types.ts` — immutable shared table/question/attempt/mastery/session/profile/settings/persisted schema-2 types.

# 24. Domain worksheet model — 2 files

115. `src/domain/worksheet.ts` — worksheet prompt/answer/solved model and line/box/space blanks.
116. `src/domain/worksheet.test.ts` — worksheet presentation-model tests.

# 25. Feature: About — 1 file

117. `src/features/about/AboutPage.tsx` — localized version/license/privacy/contact/source/funding information; native links use OS handoff.

# 26. Feature: Practice — 1 file

118. `src/features/practice/PracticeDrill.tsx` — setup/presets/seeds/timing/questions/answers/speech/review/session completion.

# 27. Feature: Progress — 1 file

119. `src/features/progress/ProgressDashboard.tsx` — mastery metrics/search/filter/goals/recent sessions/mistakes.

# 28. Feature: Settings — 1 file

120. `src/features/settings/SettingsPage.tsx` — locale/theme/accessibility/defaults/history/goals/profiles/backup/recovery/reset/about controls.

# 29. Feature: Tables/print — 1 file

121. `src/features/tables/TableGenerator.tsx` — table controls/worksheet composer/study/practice/answer-key/print/speech rendering.

# 30. Internationalization core — 9 files

122. `src/i18n/LocaleContext.tsx` — runtime locale provider, persistence and document language updates.
123. `src/i18n/messages.ts` — English catalog composition and structural `MessageCatalog` type.
124. `src/i18n/types.ts` — type utilities that widen English literal catalog shapes.
125. `src/i18n/en.ts` — platform-neutral English shell/status/feature/settings/about copy for 2.0.12.
126. `src/i18n/hi.ts` — platform-neutral complete Hindi catalog for 2.0.12.
127. `src/i18n/learning.ts` — English session-history/goal copy.
128. `src/i18n/pwa.ts` — English optional browser PWA install copy.
129. `src/i18n/shortcuts.ts` — English keyboard-shortcut copy/functions.
130. `src/i18n/localePreference.ts` — supported locale list and resilient local preference/browser-language fallback.

# 31. Internationalization tests — 3 files

131. `src/i18n/catalogParity.test.ts` — Hindi/English structural parity, nonblank messages and package/UI version consistency.
132. `src/i18n/localePreference.test.ts` — supported/stored/browser fallback and storage-failure tests.
133. `src/localization.test.tsx` — runtime English/Hindi integration, document language, persistence, backup separation.

# 32. Browser-preference infrastructure — 2 files

134. `src/infrastructure/browserPreferences.ts` — safe non-critical local preference helpers.
135. `src/infrastructure/browserPreferences.test.ts` — preference/storage-failure tests.

# 33. Install-prompt infrastructure — 2 files

136. `src/infrastructure/installPrompt.ts` — optional browser PWA install-event type guard/model.
137. `src/infrastructure/installPrompt.test.ts` — install-prompt event recognition tests.

# 34. Logging infrastructure — 2 files

138. `src/infrastructure/logger.ts` — structured technical logger with sensitive key/value redaction.
139. `src/infrastructure/logger.test.ts` — logger redaction tests.

# 35. Migration infrastructure — 2 files

140. `src/infrastructure/migrations.ts` — current schema version and schema-1-to-schema-2 transformation.
141. `src/infrastructure/migrations.test.ts` — passthrough/migration/unsupported-version tests.

# 36. PWA lifecycle infrastructure — 2 files

142. `src/infrastructure/pwaEvents.ts` — decoupled update-ready/offline-ready events for web/PWA service-worker callbacks.
143. `src/infrastructure/pwaEvents.test.ts` — PWA event/non-forced-update tests.

# 37. Practice seed infrastructure — 2 files

144. `src/infrastructure/random.ts` — valid random seed helper for generated practice.
145. `src/infrastructure/random.test.ts` — deterministic injected-randomness seed tests.

# 38. Speech infrastructure — 2 files

146. `src/infrastructure/speech.ts` — safe speech-synthesis feature detection/invocation.
147. `src/infrastructure/speech.test.ts` — available/unavailable/failure speech tests.

# 39. Storage/import infrastructure — 2 files

148. `src/infrastructure/storage.ts` — structural/semantic state validation, byte/profile bounds, four-state load classification, save/import/export/raw recovery/clear.
149. `src/infrastructure/storage.test.ts` — comprehensive persistence/migration/semantic/blocking/corruption/write/clear tests.

# 40. App-wide integration tests — 2 files

150. `src/keyboardShortcuts.test.tsx` — shortcut dialog/open/close/editable-control guard tests.
151. `src/learningRecords.test.tsx` — session/goal/retention plus atomic profile capacity and transactional backup/storage integration regressions.

# 41. Application state layer — 3 files

152. `src/state/AppStateContext.ts` — typed state/action context contract including storage-read state and transactional backup result.
153. `src/state/AppStateProvider.tsx` — load/classify/default/save/profile/settings/attempt/session/goal/import/recovery/reset coordinator.
154. `src/state/useAppState.ts` — safe typed context hook.

# 42. Stylesheets — 4 files

155. `src/styles.css` — main tokens/layout/themes/responsive/print/worksheet styling.
156. `src/status.css` — status/recovery/PWA/fatal UI styling.
157. `src/shortcuts.css` — keyboard-shortcut dialog/list styling.
158. `src/learning.css` — goals/session/learning-record responsive styling.

# 43. Test setup/type declarations — 2 files

159. `src/test/setup.ts` — shared Vitest/jsdom setup/polyfills/matchers.
160. `src/vite-env.d.ts` — Vite/PWA declarations plus **new** `__TABLESPARK_NATIVE__` and `__TABLESPARK_PLATFORM__` build constants.

# 44. Shared web/native platform layer — 3 new files

161. `src/platform/runtime.ts` — **new** runtime platform/native detection with safe web fallback and PWA-registration decision.
162. `src/platform/runtime.test.ts` — **new** regression proving non-Vite/test contexts resolve safely to web/PWA behavior.
163. `src/platform/openExternalUrl.ts` — **new** web/native external-navigation bridge using scoped Tauri opener in packaged apps.

# 45. Tauri native source/configuration — 8 new files

164. `src-tauri/Cargo.toml` — **new** Rust/Tauri package manifest synchronized to product version 2.0.12.
165. `src-tauri/build.rs` — **new** Tauri Cargo build integration.
166. `src-tauri/capabilities/default.json` — **new** `main-capability` allowing only core defaults and exact maintained external URLs.
167. `src-tauri/src/lib.rs` — **new** shared desktop/mobile Tauri application entrypoint with opener plugin.
168. `src-tauri/src/main.rs` — **new** desktop executable entrypoint and Windows release console suppression.
169. `src-tauri/tauri.conf.json` — **new** shared native identity/version/frontend/window/CSP/capability/icon/bundle configuration.
170. `src-tauri/tauri.android.conf.json` — **new** Android minimum API 24 and `.debug` application-ID suffix configuration.
171. `src-tauri/tauri.ios.conf.json` — **new** iOS/iPadOS minimum system version 14.0 configuration.

# Cross-file synchronization checklist

## Product/app version

Review together:

- `package.json`;
- `src-tauri/Cargo.toml`;
- `src-tauri/tauri.conf.json` version source;
- visible English/Hindi Settings/About copy/tests;
- changelog/release docs/native config fixtures.

## Node/toolchain versions

Review `.nvmrc`, package engines, all Actions Node setup, setup/configuration/command docs, and native/mobile requirements.

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

At this cross-platform documentation checkpoint this reference lists **171 tracked files: the previous 156 plus exactly 15 new cross-platform files**. Generated Tauri/mobile/icon/build output is deliberately not included.
