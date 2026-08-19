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
- [x] Fully externalized English product copy ready for a future locale provider.
- [x] Structured logging with sensitive-key and sensitive-value redaction.
- [x] Unit/property/integration/browser testing.
- [x] Repository secret scanner plus scanner tests in the quality gate.
- [x] CI, dependency auditing, CodeQL, Dependabot, and release workflow.

## 0.2 — Classroom refinement

- [ ] Dedicated worksheet composer with answer-key mode and configurable blank-answer layout.
- [ ] More difficulty presets that map cleanly to number ranges and question counts.
- [ ] Session history summaries stored locally with retention controls.
- [ ] Optional per-profile goals without streak pressure or punitive mechanics.
- [ ] Improved print pagination controls for common paper sizes.
- [ ] Real release screenshots captured across light/dark and compact/wide layouts.

## 0.3 — Internationalization and accessibility expansion

- [ ] Introduce a locale provider around the externalized English copy structure.
- [ ] Add at least one translated locale after terminology review.
- [ ] Browser-assisted automated accessibility checks in CI where stable.
- [ ] Additional screen-reader manual testing notes across major browser/platform combinations.
- [ ] More keyboard shortcuts with an in-app shortcut reference.

## 0.4 — Installability and packaging

- [ ] Evaluate Trusted Web Activity or native wrapper options only if a real distribution need exists.
- [ ] Improve PWA install/update messaging without interrupting practice.
- [ ] Add release artifact integrity metadata.
- [ ] Evaluate automated deployment to a static host after repository-owner approval.

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
