# Release Evidence

Use this document as the release-candidate evidence checklist. Do not mark an item complete merely because source code exists; record evidence only after the relevant automated run or manual check actually succeeds.

## Candidate identity

| Field | Value |
| --- | --- |
| Candidate version | `2.0.12` |
| Commit SHA | Record externally after the final tracked-file commit |
| Pull request | PR `#4` — current TableSpark 2.0.12 release-candidate work |
| Verification date | Not yet recorded for final 2.0.12 head |
| Tester/reviewer | Not yet recorded |
| Production origin | Not yet selected |

The source/package/UI version is prepared as `2.0.12`, but the `v2.0.12` tag must not be created until the exact immutable candidate passes the required automated and manual gates below.

### Why the SHA is not hard-coded here

Editing this tracked document creates a new commit. Therefore a SHA written into this file as “the final candidate SHA” would become stale immediately when the file is committed. The immutable final SHA and exact workflow run identifiers must be recorded in PR/check/release metadata **after the last tracked-file change**, without another source/documentation commit.

## Automated repository gates

Record the exact workflow run or check URL/result after the candidate commit stops changing.

| Gate | Required result | Evidence |
| --- | --- | --- |
| CI `quality` | Pass | Await exact final 2.0.12 candidate run |
| CI `e2e` | Pass | Await exact final 2.0.12 candidate run |
| CodeQL | Pass | Await exact final 2.0.12 candidate run |
| Release Visual Evidence | Pass | Await exact final 2.0.12 candidate run |
| Production dependency audit | No blocking high-severity finding | Covered by CI; final result pending |
| Repository secret scan | Clean | Covered by CI; final result pending |
| Visible version consistency | Package + English UI + Hindi UI all `2.0.12` | Unit/catalog and Playwright assertions added; final result pending |

A queued run is not a pass. Checks attached only to an older candidate SHA are not evidence for the final 2.0.12 candidate.

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
- Never hard-code a purported final SHA into a tracked file if that edit itself would create a newer candidate.
- Never use repository preview illustrations as real release screenshots.
- Never publish private learner data, backup JSON, or unreadable recovery files as evidence.
- Keep final evidence tied to an immutable commit SHA in PR/check/release metadata whenever possible.
- If the candidate changes after a failure/fix, rerun the affected gates and replace the external candidate record.
- Do not create or move the `v2.0.12` tag merely to make a workflow start or pass.
