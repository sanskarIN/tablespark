# Release Evidence

Use this document as the TableSpark **2.0.12** release-candidate evidence checklist. Do not mark an item complete merely because source code/configuration exists; record evidence only after the relevant automated run or manual/platform check actually succeeds.

## Candidate identity

| Field | Value |
| --- | --- |
| Candidate version | `2.0.12` |
| Commit SHA | Record externally after the final tracked-file commit |
| Pull request | PR `#4` — current TableSpark 2.0.12 cross-platform release-candidate work |
| Verification date | Not yet recorded for final 2.0.12 head |
| Tester/reviewer | Not yet recorded |
| Production web origin | Not yet selected |
| Native signing identities | Not yet recorded/configured for public distribution |

The source/package/UI/native-project version is prepared as `2.0.12`, but the `v2.0.12` tag must not be created until the exact immutable candidate passes the required repository and intended manual/platform gates.

### Why the SHA is not hard-coded here

Editing this tracked document creates a new commit. A SHA written into this file as “the final candidate SHA” would therefore become stale immediately. Record the immutable final SHA and exact workflow run identifiers in PR/check/release metadata **after the last tracked-file change**, without another source/documentation commit.

## Automated repository gates

Record results only for the exact final candidate.

| Gate | Required result | Evidence |
| --- | --- | --- |
| CI `quality` | Pass | Await exact final 2.0.12 candidate run |
| CI `e2e` | Pass | Await exact final 2.0.12 candidate run |
| CodeQL | Pass | Await exact final 2.0.12 candidate run |
| Release Visual Evidence | Pass | Await exact final 2.0.12 candidate run |
| Native Cross-Platform / Windows desktop | Pass | Await exact final candidate run |
| Native Cross-Platform / macOS desktop | Pass | Await exact final candidate run |
| Native Cross-Platform / Linux desktop | Pass | Await exact final candidate run |
| Native Cross-Platform / Android debug APK | Pass | Await exact final candidate run |
| Native Cross-Platform / iOS simulator | Pass | Await exact final candidate run |
| Production dependency audit | No blocking high-severity finding | Covered by CI; final result pending |
| Repository secret scan | Clean | Covered by CI; final result pending |
| Native configuration gate | Pass | Covered by `npm run check`; final result pending |
| Visible version consistency | Package + English UI + Hindi UI all `2.0.12` | Assertions added; final result pending |

A queued, pending, cancelled, skipped, or older-SHA run is not a pass for the final candidate.

## Cross-platform build evidence boundary

The Native Cross-Platform workflow is designed to establish source/build portability without exposing production signing credentials to pull-request code.

Automated native evidence covers:

- Rust/Tauri formatting/type/build checks;
- Windows native application compilation;
- macOS native application compilation;
- Linux native application compilation;
- Android project generation and debug APK compilation;
- iOS project generation and simulator compilation;
- generated TableSpark native icon path;
- shared frontend build integration.

Automated CI does **not** by itself prove:

- Windows installer code signing;
- macOS signing/notarization;
- Android production release signing or Play acceptance;
- iOS/iPadOS signing/provisioning or App Store acceptance;
- correct behavior on every physical device/distribution;
- store-owner/developer-account ownership.

Those remain separate evidence below.

## Real browser screenshots

`.github/workflows/visual-evidence.yml` runs Playwright against the built web application and uploads `tablespark-release-visual-evidence` containing real browser screenshots.

Expected files:

- `tables-light-wide.png`
- `tables-dark-wide.png`
- `tables-light-compact.png`
- `tables-dark-compact.png`

Before using screenshots as release evidence:

1. Verify the workflow ran against the exact final 2.0.12 candidate.
2. Download the artifact.
3. Inspect every image for clipping, overlap, unexpected banners, broken fonts, and incorrect theme state.
4. Record the workflow/reviewer result below.

| Capture | Reviewed | Notes |
| --- | --- | --- |
| Light / wide | No | Not yet manually reviewed |
| Dark / wide | No | Not yet manually reviewed |
| Light / compact | No | Not yet manually reviewed |
| Dark / compact | No | Not yet manually reviewed |

These browser screenshots do not prove native packaging or a later production host is correct.

## Manual accessibility evidence

Use `docs/accessibility.md`. Record a pass only after human-assisted execution.

| Platform / runtime / assistive technology | Result | Evidence/notes |
| --- | --- | --- |
| Windows browser / Chrome / NVDA | Not run | — |
| Windows browser / Edge / Narrator | Not run | — |
| Windows installed native app / NVDA or Narrator | Not run | — |
| macOS browser / Safari / VoiceOver | Not run | — |
| macOS installed native app / VoiceOver | Not run | — |
| Linux installed native app / representative accessibility stack | Not run | — |
| Android browser / Chrome / TalkBack | Not run | — |
| Android installed native app / TalkBack | Not run | — |
| iOS/iPadOS browser / Safari / VoiceOver | Not run | — |
| iOS/iPadOS installed native app / VoiceOver | Not run | — |

## Hindi interface review

Automated tests verify catalog completeness, runtime switching, persistence, browser rendering, localized failure paths, and version synchronization. They do not prove natural translation quality across every host webview.

| Review | Result | Evidence/notes |
| --- | --- | --- |
| Native/fluent terminology review | Not run | — |
| Narrow-layout Hindi browser review | Not run | — |
| Hindi print preview | Not run | — |
| Hindi installed Android layout review | Not run | — |
| Hindi installed iOS/iPadOS layout review | Not run | — |
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

## Windows native release evidence

| Check | Result | Evidence/notes |
| --- | --- | --- |
| Exact-head Windows compile CI | Pending | Await workflow |
| TableSpark native icons present in package | Not run | — |
| Signed publisher identity configured | Not configured | Owner-controlled signing required |
| Install on representative Windows machine | Not run | — |
| Restart preserves local data | Not run | — |
| Backup export/import works | Not run | — |
| Printing works | Not run | — |
| External links open through OS | Not run | — |
| Upgrade/reinstall behavior | Not run | — |

## macOS native release evidence

| Check | Result | Evidence/notes |
| --- | --- | --- |
| Exact-head macOS compile CI | Pending | Await workflow |
| TableSpark native icons present in bundle | Not run | — |
| Apple signing identity configured | Not configured | Owner-controlled signing required |
| Notarization/App Store path verified if used | Not run | — |
| Install on representative macOS machine | Not run | — |
| Restart preserves local data | Not run | — |
| Backup export/import works | Not run | — |
| Printing/speech/external links | Not run | — |
| Upgrade/replacement behavior | Not run | — |

## Linux native release evidence

| Check | Result | Evidence/notes |
| --- | --- | --- |
| Exact-head Linux compile CI | Pending | Await workflow |
| Intended native package format produced | Not run | — |
| Install on representative target distro | Not run | — |
| Restart preserves local data | Not run | — |
| Backup export/import works | Not run | — |
| Printing/speech/external links | Not run | — |
| Upgrade/removal behavior | Not run | — |

## Android native release evidence

| Check | Result | Evidence/notes |
| --- | --- | --- |
| Exact-head Android debug APK compile CI | Pending | Await workflow |
| `in.sanskar.tablespark` package identity reviewed | Source configured | Ownership/release identity not yet verified |
| Release keystore ownership/backup | Not configured | Must remain outside repository |
| Signed release APK/AAB produced | Not run | — |
| Install on representative Android device | Not run | — |
| Restart preserves local data | Not run | — |
| Backup export/import works | Not run | — |
| Printing/file handling | Not run | — |
| TalkBack/touch/speech | Not run | — |
| External links/email handoff | Not run | — |
| Upgrade from prior package | Not run | — |
| Play Store submission/ownership if intended | Not run | — |

## iOS/iPadOS native release evidence

| Check | Result | Evidence/notes |
| --- | --- | --- |
| Exact-head iOS simulator compile CI | Pending | Await workflow |
| Bundle identifier reviewed | Source configured | Ownership/release identity not yet verified |
| Apple Developer/team ownership | Not configured | Owner action required |
| Signing/provisioning configured | Not configured | Must remain outside repository |
| Physical iPhone install | Not run | — |
| Physical iPad install | Not run | — |
| Restart preserves local data | Not run | — |
| Backup export/import works | Not run | — |
| Printing/file handling | Not run | — |
| VoiceOver/touch/speech | Not run | — |
| External links/email handoff | Not run | — |
| Upgrade/replacement behavior | Not run | — |
| App Store submission if intended | Not run | — |

## Web release artifact evidence

After the approved `v2.0.12` tag is published:

| Check | Result | Evidence/notes |
| --- | --- | --- |
| GitHub release points to intended tag/commit | Not run | — |
| `tablespark-web.zip` attached | Not run | — |
| `tablespark-web.zip.sha256` attached | Not run | — |
| Downloaded ZIP passes SHA-256 verification | Not run | — |
| Packaged files inspected | Not run | — |
| Rollback artifact/commit identified | Not run | — |

## Native distribution artifact evidence

Do not mark native distribution complete merely because debug/unsigned CI output exists.

| Artifact/channel | Result | Evidence/notes |
| --- | --- | --- |
| Windows signed installer/package | Not produced as a public release | — |
| macOS signed/notarized package | Not produced as a public release | — |
| Linux intended public package(s) | Not produced as a public release | — |
| Android signed APK/AAB | Not produced as a public release | — |
| iOS/iPadOS signed/App Store package | Not produced as a public release | — |

## Evidence rules

- Never replace `Not run`, `Pending`, or `Not configured` with `Pass` based on source inspection alone.
- Never use checks from an older candidate SHA as evidence for the final 2.0.12 head.
- Never hard-code a purported final SHA into a tracked file if that edit itself would create a newer candidate.
- Never treat debug/unsigned/simulator output as a signed production store release.
- Never expose signing private keys or credentials as release evidence.
- Never use repository preview illustrations as real release screenshots.
- Never publish private learner data, backup JSON, or unreadable recovery files as evidence.
- Keep final evidence tied to the immutable candidate SHA in PR/check/release metadata.
- If the candidate changes after a failure/fix, rerun affected gates and replace the external candidate record.
- Do not create or move the `v2.0.12` tag merely to make a workflow start or pass.
