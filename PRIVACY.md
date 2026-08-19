# TableSpark Privacy

Last updated: 2026-08-19

## Summary

TableSpark is designed to work without an online account. Core learning data is stored locally in the browser. The application code in this repository does not send profile names, mastery data, mistakes, answers, or settings to a TableSpark server because no TableSpark backend is required for the core product.

## Data stored locally

The current application may store:

- offline profile identifiers and profile names;
- profile creation timestamps;
- multiplication fact mastery counts and streaks;
- recent incorrect practice attempts;
- settings such as theme, text size, reduced motion, speech preference, and drill defaults;
- a small first-run onboarding dismissal flag.

Persisted learning state is stored under a versioned `localStorage` key in the browser. The application limits serialized learning state to a 2 MB byte budget and limits the number of offline profiles to the supported application capacity.

If a browser refuses a storage write, TableSpark keeps the current in-memory state usable for the tab and displays a warning that local saving is unavailable. Do not assume new progress is durable while that warning is visible.

## Backups

The **Export backup** action creates a JSON file containing local application state. That file can include profile names and learning history. Treat it as a personal file.

The **Import backup** action reads a selected JSON file locally. Before replacement, TableSpark:

- applies the same 2 MB byte budget used for current persisted state;
- checks the persisted schema version;
- validates required objects and numeric bounds;
- verifies unique profile identities and a valid active-profile reference;
- verifies mastery counters are internally consistent;
- verifies stored multiplication answers match their operands;
- verifies recorded correctness matches the saved response;
- asks for confirmation before replacing current data.

TableSpark does not automatically upload backup files.

## Printed worksheets

Printed worksheet headers provide blank Name and Date lines. TableSpark does not automatically insert the active offline profile name into printed worksheet metadata. This reduces accidental disclosure when a worksheet is printed or shared.

## Browser and platform behavior

Browsers and operating systems may independently collect telemetry, crash reports, sync data, or browsing information according to their own settings and privacy policies. Those platform behaviors are outside this repository’s control.

If browser sync is enabled, browser-managed storage behavior may differ by vendor. Do not assume local storage is a secure vault for highly sensitive information.

## Speech synthesis

When text-to-speech is enabled, TableSpark calls the browser’s Web Speech synthesis interface. The exact voice implementation is controlled by the browser/operating system and may vary by platform. TableSpark does not intentionally transmit speech text to its own server.

If the browser does not provide a usable synthesis API, the control is disabled. If a platform synthesis call fails unexpectedly, TableSpark treats the failure as non-fatal.

## Logging

Application logging is intended for technical events only. The structured logger redacts fields whose names suggest tokens, secrets, passwords, authorization information, cookies, email addresses, or names. It also redacts recognizable sensitive values such as email addresses and several common credential formats even when the field name is generic.

Contributors should still avoid logging personal data in the first place. Redaction is defense in depth, not a reason to include learner content in logs.

## Repository secret scanning

The source repository includes a local credential-pattern scanner that runs in CI. It reports finding metadata without echoing the matched credential value. This protects the repository, not end-user learning data, and cannot recognize every possible secret format.

## Deleting local data

You can reset the active profile’s learning progress from Settings. You can also delete individual profiles when more than one exists. Deleting a browser profile or clearing TableSpark site storage can remove all locally stored application data. Export a backup first if you want to keep it.

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
