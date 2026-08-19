# TableSpark Roadmap

The roadmap prioritizes coherent learning value, accessibility, reliability, and maintainability. Items are not promises or fixed release dates.

## 0.1 — Foundation

- [x] Custom multiplication table generator with a bounded render budget.
- [x] Responsive offline-first PWA shell.
- [x] Timed and untimed practice.
- [x] Random-by-default practice with deterministic replay seeds.
- [x] Validated unsigned seed range and deterministic generator tests.
- [x] Bounded practice-response validation aligned with current product limits.
- [x] Deduplicated mistake review and mastery tracking.
- [x] Searchable/filterable mastery progress with a transparent mastery rule.
- [x] Offline profiles with explicit capacity and local persistence.
- [x] User-visible browser-storage write-failure state.
- [x] Preserved unreadable local state with download/import/discard recovery workflow.
- [x] Validated backup export/import with shared persistence-size budget and semantic integrity checks.
- [x] Light/dark/system appearance.
- [x] Large-text and reduced-motion settings.
- [x] Print-friendly solved/blank worksheet layout with paper-only Name/Date metadata.
- [x] Progressive speech synthesis with unsupported/failure fallback.
- [x] Fully externalized English product copy ready for a locale provider.
- [x] Structured logging with sensitive-key and sensitive-value redaction.
- [x] Unit/property/integration/browser testing.
- [x] Repository secret scanner plus scanner tests in the quality gate.
- [x] CI, dependency auditing, CodeQL, Dependabot, and release workflow.

## 0.2 — Classroom refinement

- [x] Dedicated worksheet composer with answer-key mode and configurable blank-answer layout.
- [x] More difficulty presets that map cleanly to number ranges and question counts.
- [x] Session history summaries stored locally with retention controls.
- [x] Optional per-profile goals without streak pressure or punitive mechanics.
- [x] Improved print pagination controls for common paper sizes.
- [ ] Real release screenshots captured across light/dark and compact/wide layouts. This remains a release-candidate task so screenshots represent a verified real browser build rather than a fabricated preview.

## 0.3 — Internationalization and accessibility expansion

- [x] Introduce a central locale provider around the externalized copy structure.
- [x] Add a typed Hindi (`hi`) translated interface with persisted language switching and browser smoke coverage. Native-speaker terminology review remains recommended before a public release claims translation quality.
- [x] Browser-assisted automated accessibility checks in CI where stable.
- [x] Additional screen-reader manual testing notes across major browser/platform combinations.
- [x] More keyboard shortcuts with an in-app shortcut reference.

## 0.4 — Installability and packaging

- [x] Evaluate Trusted Web Activity or native wrapper options only if a real distribution need exists; the current decision keeps the PWA canonical.
- [x] Improve PWA install/update messaging without interrupting practice.
- [x] Add release artifact integrity metadata.
- [ ] Activate or automate a production static deployment only after repository-owner approval. Candidate hosts and the approval/verification gate are documented in `docs/deployment-evaluation.md`.

## External/manual release gates

These are deliberately not marked complete by source-code changes alone:

- real light/dark and compact/wide screenshots from a verified browser build;
- manual assistive-technology passes recorded against the matrix in `docs/accessibility.md`;
- selection/approval of a production HTTPS host and origin;
- production-origin PWA installability and offline-reload verification;
- a release tag and post-release artifact verification;
- native-speaker review of Hindi terminology before making strong translation-quality claims.

## Long-term ideas

- Optional local classroom roster import/export formats.
- Teacher-print packs generated entirely client-side.
- More practice formats such as missing-factor questions.
- Optional local-only achievements focused on learning progress rather than engagement pressure.
- Accessibility-reviewed sound cues with a fully silent default path available.

## Non-goals unless requirements change

- Mandatory accounts for core learning.
- Advertising or paywalls around core functionality.
- Cloud collection of learner answers by default.
- Custom cryptography.
- Microservices for a client-only learning tool.
- Intrusive donation prompts.
