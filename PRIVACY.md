# TableSpark Privacy

Last updated: 2026-08-19

## Summary

TableSpark is designed to work without an online account. Core learning data is stored locally in the browser. The application code in this repository does not send profile names, mastery data, mistakes, session summaries, goals, answers, or settings to a TableSpark server because no TableSpark backend is required for the core product.

## Data stored locally

The current application may store:

- offline profile identifiers and profile names;
- profile creation timestamps;
- multiplication fact mastery counts and streaks;
- recent incorrect practice attempts;
- bounded practice-session summaries containing completion time, session kind/mode, question count, correct count, elapsed time, and the replay seed for generated drills;
- an optional per-profile mastered-facts goal with no deadline or streak requirement;
- settings such as theme, text size, reduced motion, speech preference, drill defaults, and session-history retention;
- a small first-run onboarding dismissal flag;
- a small interface-language preference such as `en` or `hi`.

Persisted learning state is stored under the existing versioned `localStorage` key in the browser. The key remains stable so older valid data can be migrated. The internal persisted schema is currently version 2. Schema-1 learning data is migrated locally by adding empty session history, no mastery goal, and the default retention setting before validation; the migration does not upload the old or new data.

The interface-language preference is stored separately under `tablespark.locale.v1`. It is not included in exported learner-state JSON, does not contain mastery/answer data, and can be removed with other site data.

The application limits serialized learning state to a 2 MB byte budget, limits the number of offline profiles to the supported application capacity, and caps session history at supported retention values. Reducing the retention setting immediately removes older session summaries from local application state.

If a browser refuses a storage write, TableSpark keeps the current in-memory state usable for the tab and displays a warning that local saving is unavailable. Do not assume new progress is durable while that warning is visible.

## Session history scope

Session history is intentionally summary-only. It does not duplicate every submitted answer. Per-question mastery statistics and recent incorrect attempts continue to serve the learning/review features, while a session summary records only the fields needed to understand recent practice volume and outcome.

Generated-drill summaries retain the visible deterministic seed so a learner can identify the seed associated with that session. Mistake-review summaries do not claim a generated replay seed.

Users can choose from supported retention limits in Settings. Lowering the limit trims older summaries immediately. Resetting the active profile’s progress clears its mastery statistics, recent mistakes, and session summaries while leaving the optional goal setting available for the learner to reuse or clear separately.

## Optional mastery goal

A profile can store an optional target number of mastered facts. The goal:

- is local to that profile;
- has no deadline;
- does not create a daily streak requirement;
- does not trigger punishment or loss for inactivity;
- can be cleared at any time.

It is a progress reference only, not an account, ranking, or behavioral-scoring system.

## Interface language

TableSpark can remember the selected English/Hindi interface language in browser storage. This setting is deliberately outside learner backup data so exporting a learning backup does not implicitly copy the browser’s UI-language choice.

If there is no valid stored language preference, TableSpark can use the browser language as a local fallback signal. This check is performed by the application in the browser; the current product does not send the browser-language value to a TableSpark backend.

Changing language updates interface messages and the document language attribute. It does not change profile identity, mastery scores, session history, goals, or practice answers.

## Unreadable local-data recovery

If a stored TableSpark value exists but cannot be parsed, migrated, or validated, TableSpark treats it differently from an empty installation.

The application:

- preserves the unreadable stored value instead of automatically overwriting it with defaults;
- starts a temporary in-memory default state so the interface remains usable;
- pauses automatic state persistence while recovery is pending;
- displays a prominent recovery warning;
- lets the user download the exact raw stored value as a text recovery artifact;
- lets the user replace it by importing a valid backup;
- lets the user explicitly discard it after confirmation.

The raw recovery artifact can contain profile names, learning history, settings, and any other text that existed in the local stored value. Treat it as personal data and do not post it publicly without reviewing/redacting it first.

Ordinary **Export backup** is disabled while unreadable data is being preserved because the currently displayed state is temporary and would not represent the unreadable stored value.

## Backups

The **Export backup** action creates a JSON file containing validated local application state. That file can include profile names, mastery records, recent mistakes, session summaries, optional mastery goals, and learning preferences. The separate interface-language preference is not included. Treat the backup as a personal file.

The **Import backup** action reads a selected JSON file locally. Before replacement, TableSpark:

- applies the same 2 MB byte budget used for current persisted state;
- checks or migrates the persisted schema version when a supported migration exists;
- validates required objects and numeric bounds;
- verifies unique profile identities and a valid active-profile reference;
- verifies canonical mastery fact keys;
- verifies mastery counters are internally consistent;
- verifies stored multiplication answers match their operands;
- verifies recorded correctness matches the saved response;
- verifies saved mistake history contains only incorrect attempts;
- validates session-summary count/correctness bounds, replay-seed semantics, and supported retention;
- validates optional goal bounds;
- asks for confirmation before replacing current data.

A successfully imported valid backup also resolves an unreadable-data recovery state because the user has explicitly chosen a valid replacement.

TableSpark does not automatically upload backup or recovery files.

## Printed worksheets

Printed learner-facing worksheet headers provide blank Name and Date lines. TableSpark does not automatically insert the active offline profile name into printed worksheet metadata. Answer-key output omits learner Name/Date metadata. This reduces accidental disclosure when a worksheet is printed or shared.

## Browser and platform behavior

Browsers and operating systems may independently collect telemetry, crash reports, sync data, or browsing information according to their own settings and privacy policies. Those platform behaviors are outside this repository’s control.

If browser sync is enabled, browser-managed storage behavior may differ by vendor. Do not assume local storage is a secure vault for highly sensitive information.

## Speech synthesis

When text-to-speech is enabled, TableSpark calls the browser’s Web Speech synthesis interface. The exact voice implementation is controlled by the browser/operating system and may vary by platform. TableSpark does not intentionally transmit speech text to its own server.

If the browser does not provide a usable synthesis API, the control is disabled. If a platform synthesis call fails unexpectedly, TableSpark treats the failure as non-fatal.

## Progressive Web App lifecycle

The production service worker can cache the app shell for offline use. When a new app version is ready, TableSpark surfaces a non-blocking update notice and lets the user choose when to reload rather than forcing an update during an active task. Service-worker caching is controlled by the browser and can be removed by clearing site data.

When a supporting browser provides an install-prompt event, TableSpark can display an optional install action. Dismissing or ignoring that action does not limit core learning features and does not create an account.

## Logging

Application logging is intended for technical events only. The structured logger redacts fields whose names suggest tokens, secrets, passwords, authorization information, cookies, email addresses, or names. It also redacts recognizable sensitive values such as email addresses and several common credential formats even when the field name is generic.

Contributors should still avoid logging personal data in the first place. Redaction is defense in depth, not a reason to include learner content in logs.

Recovery data itself is not written to structured logs.

## Repository secret scanning

The source repository includes a local credential-pattern scanner that runs in CI. It reports finding metadata without echoing the matched credential value. This protects the repository, not end-user learning data, and cannot recognize every possible secret format.

## Deleting local data

You can reset the active profile’s learning progress from Settings. This clears its mastery statistics, recent mistakes, and session summaries. You can clear the optional mastery goal separately. You can also delete individual profiles when more than one exists. Deleting a browser profile or clearing TableSpark site storage can remove all locally stored application data, including the separate interface-language preference. Export a backup first if you want to keep learner-state data.

When TableSpark reports unreadable local data, use the dedicated recovery download before choosing **Discard unreadable local data** if there is any chance you may need the original value. Discarding is irreversible within TableSpark.

## Accounts, advertising, and payments

The current TableSpark application:

- does not require an account;
- does not contain advertising code;
- does not process payments;
- does not require a donation;
- does not contain a remote analytics integration.

Optional Buy Me a Coffee links open an external website only when the user chooses them.

## Contact

Privacy questions can be sent to:

- `sanskarin@outlook.in`
- `supportramsandesh@gmail.com`
