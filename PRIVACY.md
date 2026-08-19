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

Persisted learning state is stored under a versioned `localStorage` key in the browser.

## Backups

The **Export backup** action creates a JSON file containing local application state. That file can include profile names and learning history. Treat it as a personal file.

The **Import backup** action reads a selected JSON file locally, applies a file-size limit in the UI, validates the schema, checks the schema version, and replaces application state only after validation succeeds.

TableSpark does not automatically upload backup files.

## Browser and platform behavior

Browsers and operating systems may independently collect telemetry, crash reports, sync data, or browsing information according to their own settings and privacy policies. Those platform behaviors are outside this repository’s control.

If browser sync is enabled, browser-managed storage behavior may differ by vendor. Do not assume local storage is a secure vault for highly sensitive information.

## Speech synthesis

When text-to-speech is enabled, TableSpark calls the browser’s Web Speech synthesis interface. The exact voice implementation is controlled by the browser/operating system and may vary by platform. TableSpark does not intentionally transmit speech text to its own server.

## Logging

Application logging is intended for technical events only. The logger redacts fields whose names suggest tokens, secrets, passwords, authorization information, cookies, email addresses, or names. Contributors should still avoid logging personal data in the first place.

## Deleting local data

You can reset the active profile’s learning progress from Settings. Deleting a browser profile or clearing TableSpark site storage can remove all locally stored application data. Export a backup first if you want to keep it.

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
