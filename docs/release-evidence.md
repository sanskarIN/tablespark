# Release Evidence

Use this document as the release-candidate evidence checklist. Do not mark an item complete merely because source code exists; record evidence only after the relevant automated run or manual check actually succeeds.

## Candidate identity

| Field | Value |
| --- | --- |
| Candidate version | `2.0.12` |
| Commit SHA | `215386197a059d5e0922cdc7f622919a2e8b65a0` |
| Pull request | PR `#4` — `feat: continue TableSpark roadmap refinement` |
| Verification date | Not yet recorded for final 2.0.12 head |
| Tester/reviewer | Not yet recorded |
| Production origin | Not yet selected |

The source/package/UI version is prepared as `2.0.12`, but the `v2.0.12` tag must not be created until the exact candidate passes the required automated and manual gates below.

## Automated repository gates

Record the exact workflow run or check URL/result after the candidate commit stops changing.

| Gate | Required result | Evidence |
| --- | --- | --- |
| CI `quality` | Pass | Exact-head CI run created; currently queued |
| CI `e2e` | Pass | Exact-head CI run created; currently queued |
| CodeQL | Pass | Exact-head CodeQL run created; currently queued |
| Release Visual Evidence | Pass | Exact-head visual-evidence run created; currently queued |
| Production dependency audit | No blocking high-severity finding | Covered by CI; final result pending |
| Repository secret scan | Clean | Covered by CI; final result pending |
| Visible version consistency | Package + English UI + Hindi UI all `2.0.12` | Unit/catalog and Playwright assertions added; final result pending |

Exact-head workflow run IDs at candidate freeze:

- CI: `32269505578`
- CodeQL: `32269505330`
- Release Visual Evidence: `32269505337`

A queued run is not a pass. If any source or documentation file changes after this evidence record, the commit SHA and workflow evidence above become stale and must be replaced with the new candidate.

## Real browser screenshots

`.github/workflows/visual-evidence.yml` runs Playwright against the built application and uploads `tablespark-release-visual-evidence` containing real browser screenshots. The workflow deliberately uses the actual application UI rather than drawing mock screenshots.

Expected files:

- `tables-light-wide.png`
- `tables-dark-wide.png`
- `tables-light-compact.png`
- `tables-dark-compact.png`

Before using screenshots as release evidence:

1. Verify the workflow ran against the exact final 2.0.12 candidate commit.
2. Download the artifact from that workflow run.
3. Inspect every image for clipping, overlap, unexpected banners, broken fonts, and incorrect theme state.
4. Record the workflow run and reviewer result below.

| Capture | Reviewed | Notes |
| --- | --- | --- |
| Light / wide | No | Not yet manually reviewed |
| Dark / wide | No | Not yet manually reviewed |
| Light / compact | No | Not yet manually reviewed |
| Dark / compact | No | Not yet manually reviewed |

The screenshot workflow proves the layouts rendered in the CI browser. It does not prove a later production host is configured correctly.

## Manual accessibility evidence

Use the matrix in `docs/accessibility.md`. Record completed combinations only after a human-assisted pass.

| Platform / assistive technology | Result | Evidence/notes |
| --- | --- | --- |
| Windows / Chrome / NVDA | Not run | — |
| Windows / Edge / Narrator | Not run | — |
| macOS / Safari / VoiceOver | Not run | — |
| iOS/iPadOS / Safari / VoiceOver | Not run | — |
| Android / Chrome / TalkBack | Not run | — |

## Hindi interface review

Automated tests verify catalog completeness, runtime switching, persistence, browser rendering, localized failure paths, and version synchronization. They do not prove natural translation quality.

Use `docs/hindi-review-checklist.md` with a fluent/native Hindi reviewer before making a strong public translation-quality claim.

| Review | Result | Evidence/notes |
| --- | --- | --- |
| Native/fluent terminology review | Not run | — |
| Narrow-layout Hindi review | Not run | — |
| Hindi print preview | Not run | — |
| Hindi assistive-technology pronunciation/labels | Not run | — |

## Production-origin PWA evidence

Complete only after the repository owner approves a production host/origin.

| Check | Result | Evidence/notes |
| --- | --- | --- |
| HTTPS origin selected | Not approved | See `docs/deployment-evaluation.md` |
| First production load | Not run | — |
| Manifest discoverable | Not run | — |
| Service worker active in intended scope | Not run | — |
| Installability behavior | Not run | — |
| Online load followed by offline reload | Not run | — |
| Update deployment shows non-blocking update notice | Not run | — |
| Core learning flows on production origin | Not run | — |

## Release artifact evidence

After the approved `v2.0.12` release tag is published:

| Check | Result | Evidence/notes |
| --- | --- | --- |
| GitHub release points to intended `v2.0.12` tag/commit | Not run | — |
| `tablespark-web.zip` attached | Not run | — |
| `tablespark-web.zip.sha256` attached | Not run | — |
| Downloaded ZIP passes SHA-256 verification | Not run | — |
| Packaged files inspected | Not run | — |
| Rollback artifact/commit identified | Not run | — |

## Evidence rules

- Never replace `Not run` with `Pass` based on source inspection alone.
- Never use checks from an older candidate SHA as evidence for the final 2.0.12 head.
- Never use repository preview illustrations as real release screenshots.
- Never publish private learner data, backup JSON, or unreadable recovery files as evidence.
- Keep evidence tied to an immutable commit SHA whenever possible.
- If the candidate changes after a failure/fix, rerun the affected gates and record the new candidate SHA.
- Do not create or move the `v2.0.12` tag merely to make a workflow start or pass.
