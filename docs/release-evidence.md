# Release Evidence

Use this document as the release-candidate evidence checklist. Do not mark an item complete merely because source code exists; record evidence only after the relevant automated run or manual check actually succeeds.

## Candidate identity

| Field | Value |
| --- | --- |
| Candidate version | Not yet assigned |
| Commit SHA | Record at release-candidate freeze |
| Pull request | Record current verified PR |
| Verification date | Not yet recorded |
| Tester/reviewer | Not yet recorded |
| Production origin | Not yet selected |

## Automated repository gates

Record the exact workflow run or check URL/result after the candidate commit stops changing.

| Gate | Required result | Evidence |
| --- | --- | --- |
| CI `quality` | Pass | Not yet recorded for frozen candidate |
| CI `e2e` | Pass | Not yet recorded for frozen candidate |
| CodeQL | Pass | Not yet recorded for frozen candidate |
| Release Visual Evidence | Pass | Not yet recorded for frozen candidate |
| Production dependency audit | No blocking high-severity finding | Covered by CI; final run not yet recorded |
| Repository secret scan | Clean | Covered by CI; final run not yet recorded |

## Real browser screenshots

`.github/workflows/visual-evidence.yml` runs Playwright against the built application and uploads `tablespark-release-visual-evidence` containing real browser screenshots. The workflow deliberately uses the actual application UI rather than drawing mock screenshots.

Expected files:

- `tables-light-wide.png`
- `tables-dark-wide.png`
- `tables-light-compact.png`
- `tables-dark-compact.png`

Before using screenshots as release evidence:

1. Verify the workflow ran against the exact candidate commit.
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

Automated tests verify catalog completeness, runtime switching, persistence, and browser rendering. They do not prove natural translation quality.

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

After an approved release tag is published:

| Check | Result | Evidence/notes |
| --- | --- | --- |
| GitHub release points to intended tag/commit | Not run | — |
| `tablespark-web.zip` attached | Not run | — |
| `tablespark-web.zip.sha256` attached | Not run | — |
| Downloaded ZIP passes SHA-256 verification | Not run | — |
| Packaged files inspected | Not run | — |
| Rollback artifact/commit identified | Not run | — |

## Evidence rules

- Never replace `Not run` with `Pass` based on source inspection alone.
- Never use repository preview illustrations as real release screenshots.
- Never publish private learner data, backup JSON, or unreadable recovery files as evidence.
- Keep evidence tied to an immutable commit SHA whenever possible.
- If the candidate changes after a failure/fix, rerun the affected gates and record the new candidate SHA.
