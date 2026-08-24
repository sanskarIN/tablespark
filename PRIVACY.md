# TableSpark Privacy

Last updated: 2026-08-20

## Summary

TableSpark is designed to work without an online account. Core learning data stays in local runtime storage on the device by default.

TableSpark 2.0.12 shares one local-first product across:

- web browsers;
- installable PWA environments;
- Windows native packages;
- macOS native packages;
- Linux native packages;
- Android native packages;
- iOS/iPadOS native packages.

The application code in this repository does not send profile names, mastery data, mistakes, session summaries, goals, answers, or settings to a TableSpark server because no TableSpark backend is required for the core product.

## Data stored locally

The current application may store:

- offline profile identifiers and profile names;
- profile creation timestamps;
- multiplication fact mastery counts and streaks;
- recent incorrect practice attempts;
- bounded practice-session summaries containing completion time, session kind/mode, question count, correct count, elapsed time, and replay seed for generated drills;
- optional per-profile mastered-facts goals;
- theme, text size, reduced motion, speech preference, drill defaults, and session-history retention;
- a small first-run onboarding dismissal flag;
- a small interface-language preference such as `en` or `hi`.

Persisted learner state uses the stable storage key:

```text
tablespark.state.v1
```

The current learner-data schema is version 2. The storage key intentionally remains stable so valid schema-1 data can be discovered and migrated locally.

The interface language is stored separately under:

```text
tablespark.locale.v1
```

It is not included in learner-state backup JSON.

## Browser/PWA and native installation isolation

A browser/PWA origin and a packaged native application do not automatically share the same local-storage sandbox. Different native installations/devices are also separate platform-managed storage contexts.

TableSpark does not request broad filesystem/native-storage permissions to search other installations for learner data.

To move learner data between:

- browser and native app;
- Windows and macOS/Linux;
- desktop and Android/iOS;
- old and new devices;

use the validated **Export backup** / **Import backup** flow.

This explicit portability boundary avoids silently copying private runtime storage and keeps the same schema validation rules on every platform.

## Local storage limits and retention

TableSpark limits serialized learner state/import input to a 2 MB byte budget, limits local profiles to the supported application capacity, and caps session history at supported retention values.

Reducing the retention setting immediately removes older session summaries from current local application state.

Session history is summary-only. It does not duplicate every submitted answer.

## Storage write failure

If the current runtime refuses a storage write after valid state has loaded/been created, TableSpark keeps in-memory state usable for the current session and shows that local saving is unavailable.

Do not assume new progress is durable while that warning is visible.

## Startup storage-read unavailable

If the **initial storage read itself** throws, TableSpark cannot know whether learner data already exists.

It therefore:

- uses temporary in-memory defaults only so the interface remains usable;
- pauses automatic learner-state writes;
- does not claim inaccessible data is empty or corrupted;
- disables normal validated backup import/export actions that could overwrite or misrepresent inaccessible data;
- asks the user to restore local app/site-storage access and reload/restart before relying on persistence.

This behavior applies to the shared application semantics regardless of whether the storage provider is a normal browser/PWA environment or a native application webview.

## Optional mastery goal

A profile can store an optional target number of mastered facts. The goal:

- is local to that profile;
- has no deadline;
- does not create a daily streak requirement;
- does not punish inactivity;
- is not a ranking against another learner;
- can be cleared at any time.

## Interface language

TableSpark can remember the selected English/Hindi interface language locally.

If there is no valid stored language preference, the application can use the active runtime/browser language as a local fallback signal. The current product does not send that value to a TableSpark backend.

Changing language does not change profile identity, mastery scores, history, goals, or answers.

## Known-invalid local-data recovery

If a stored TableSpark value is successfully read but cannot be parsed, migrated, or validated, TableSpark treats it differently from empty storage and differently from a storage API that could not be read.

The application:

- preserves the exact unreadable value rather than overwriting it automatically;
- starts a temporary in-memory default state;
- pauses automatic learner-state persistence;
- shows recovery status/actions;
- can let the user download the raw value for private recovery/inspection;
- accepts a valid backup as explicit durable replacement;
- allows explicit confirmed discard.

Raw recovery data can contain profile names, learning history, settings, and any other text present in the stored value. Treat it as personal data and do not post it publicly without reviewing/redacting it.

Ordinary validated backup export is disabled while known-invalid stored data is being preserved because the temporary visible state is not the preserved source value.

## Backups

**Export backup** creates JSON containing validated local learner/application state. It can include profile names, mastery, recent mistakes, session summaries, goals, and learning preferences. The separate locale preference is not included.

**Import backup** reads the selected JSON locally and validates it before replacement.

The import path:

1. applies the 2 MB byte budget;
2. checks/migrates a supported schema version;
3. validates required structures and numeric bounds;
4. verifies profile identity/active-profile integrity;
5. verifies canonical mastery keys/counters;
6. verifies multiplication answer/correctness semantics;
7. verifies mistake/session/retention/goal semantics;
8. asks for confirmation before destructive replacement;
9. refuses replacement if startup storage could not be read;
10. writes the validated replacement to local runtime storage;
11. updates in-memory state/reports success only after that write succeeds.

If validation or the durable replacement write fails, current state remains unchanged and import reports failure.

TableSpark does not automatically upload backup or recovery files.

## Native package permissions

The native Tauri shell is deliberately narrow.

The current package uses Tauri core defaults plus a scoped permission to hand specific maintained support/project/funding/email destinations to the operating system.

TableSpark does not currently request broad native filesystem, process/shell, arbitrary URL, background upload, or credential-store access for core learning.

If a future feature adds native permissions, its privacy consequences must be documented before release.

## Native signing/store credentials

Native code-signing credentials belong to the repository owner/platform release process, not to learner data and not to application source.

The project intentionally ignores common Android/Apple signing artifacts and does not expose production signing credentials to pull-request CI.

Signing credentials must never be placed in learner backups, logs, source files, public issues, or release screenshots.

## Printed worksheets

Learner-facing printable worksheet headers provide blank Name and Date lines. TableSpark does not automatically insert the active offline profile name into printed worksheet metadata. Answer keys omit learner Name/Date metadata.

## Platform behavior

Browsers, operating systems, system webviews, app stores, and device vendors may independently collect telemetry, crash reports, sync data, installation data, or usage information according to their own settings/policies. Those platform behaviors are outside this repository’s control.

Do not assume local runtime storage is a secure vault for highly sensitive information.

## Speech synthesis

When text-to-speech is enabled, TableSpark calls the speech-synthesis capability exposed by the active browser/system webview environment.

Voice implementation may differ across Windows, macOS, Linux, Android, iOS/iPadOS, and browsers. The current TableSpark product does not intentionally transmit speech text to its own server.

If no usable synthesis API exists, speech controls are disabled. Runtime speech failures are non-fatal.

## Web/PWA lifecycle

Only web/PWA builds register TableSpark’s service worker.

The service worker can cache the web app shell and surface non-blocking offline-ready/update-ready behavior. Browser PWA installation is optional.

Packaged native builds deliberately skip the PWA service-worker registration and instead rely on their installed package/store lifecycle. The repository does not currently enable a native automatic updater plugin.

## External links

On the web, support/project/funding/email links use normal browser behavior.

Inside packaged native applications, maintained destinations are handed to the operating system through the scoped Tauri opener capability. This prevents a normal support link from replacing the TableSpark application UI with an external site.

The project does not allow arbitrary native URL opening through that capability.

## Logging

Structured application logging is intended for technical events. The logger redacts sensitive-looking field names and recognizable sensitive values.

Contributors should avoid logging learner content in the first place. Redaction is defense in depth.

Raw recovery data is not written to structured logs.

## Repository secret scanning

The repository includes a credential-pattern scanner that runs in CI and does not echo matched secret values.

The scanner protects repository hygiene; it is not an end-user privacy system and cannot recognize every possible secret format.

## Deleting local data

Settings can reset active-profile learning progress. Profiles can be deleted when more than one exists. Optional goals can be cleared separately.

Clearing browser/PWA site data removes that origin’s TableSpark data. Uninstalling/clearing a native app may remove that app’s platform-managed storage depending on platform behavior.

Export a validated backup first if you need to preserve learner state and TableSpark can safely read the current store.

When TableSpark reports known-invalid local data, download the recovery value before discard if you might need it later.

When initial local storage access is unavailable, do not treat temporary visible defaults as a backup. Restore access and reload/restart first.

## Accounts, advertising, payments, analytics

The current TableSpark core product:

- does not require an account;
- does not contain advertising code;
- does not process payments;
- does not require a donation;
- does not contain a TableSpark remote analytics integration.

Optional Buy Me a Coffee links open an external service only when the user chooses them.

## Contact

Privacy questions can be sent to:

- `sanskarin@outlook.in`
- `supportramsandesh@gmail.com`
