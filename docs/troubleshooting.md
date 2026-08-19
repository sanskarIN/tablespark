# Troubleshooting

## Development server does not start

Run:

```bash
node --version
npm --version
```

TableSpark requires Node.js 22.12.0 or newer and npm 10 or newer.

Then reinstall project dependencies:

```bash
npm install
npm run dev
```

### Port 5173 is already in use

The Vite configuration uses `strictPort`, so TableSpark reports a conflict instead of choosing another port automatically. Stop the other process using port 5173 and retry.

On Windows, you can inspect the port with:

```powershell
netstat -ano | findstr :5173
```

On macOS/Linux:

```bash
lsof -i :5173
```

Review the process before terminating it; do not kill unrelated system processes blindly.

## `npm install` fails

Check:

```bash
node --version
npm --version
```

Then try again on a stable network connection.

If you recently changed Node major versions and the installed dependency tree is inconsistent, remove only generated dependencies and reinstall.

macOS/Linux:

```bash
rm -rf node_modules
npm install
```

PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

Do not delete source files, `.git`, or exported TableSpark backups as part of dependency cleanup.

## TypeScript check fails

Run:

```bash
npm run typecheck
```

Read the first error from top to bottom. Later errors can be consequences of an earlier type mismatch.

Common causes include:

- treating an optional array item as guaranteed;
- introducing an untyped external value instead of narrowing `unknown`;
- adding an unused import or variable;
- changing a persisted shape without updating its schema/type.

## Lint fails

Run:

```bash
npm run lint
```

Do not disable a lint rule globally just to make one warning disappear. Fix the underlying accessibility, hooks, type, or style issue when possible.

## Formatting check fails

Run:

```bash
npm run format
npm run format:check
```

The first command rewrites the files covered by the repository formatter command. The second verifies that formatting is stable.

## Unit tests fail

```bash
npm run test
```

For repeated debugging:

```bash
npm run test:watch
```

Tests are deterministic and should not require network access or production credentials.

## Security scanner tests fail

Test the scanner separately:

```bash
npm run test:security
```

Do not replace a failing fixture with a real credential. Scanner tests deliberately construct fake representative values.

## Repository secret scan fails

Run:

```bash
npm run secret:scan
```

The output identifies the file, line, and finding type without printing the matched value. Inspect the referenced file carefully.

If the finding is a real secret:

1. revoke/rotate the credential immediately;
2. remove it from the working tree;
3. determine whether Git history must be cleaned;
4. coordinate disclosure if user or production security could be affected.

A later passing scan does not make a previously exposed credential safe again.

If it is a false positive, improve the scanner/test narrowly rather than globally disabling the pattern.

## Playwright browser is missing

Install Chromium:

```bash
npx playwright install chromium
```

On Linux CI/minimal distributions:

```bash
npx playwright install --with-deps chromium
```

Then run:

```bash
npm run test:e2e
```

## Production build fails

Run the stages individually:

```bash
npm run typecheck
npm run build
```

Because `build` includes TypeScript project checking before Vite, a TypeScript failure must be fixed before a production bundle can be produced.

## PWA does not update immediately

The production app uses a service worker with automatic update registration. Browsers still control service-worker lifecycle timing and cache behavior.

For development debugging:

1. close extra TableSpark tabs;
2. open browser developer tools;
3. inspect Application/Storage/Service Worker panels;
4. unregister only the TableSpark service worker if you intentionally need a clean PWA state;
5. reload the app.

Do not clear site storage if you need locally stored profiles unless you exported a backup first.

## “Local saving is unavailable” appears

This warning means the application can operate in the current tab but the latest state write was rejected. Possible causes include:

- local-storage quota exhaustion;
- restrictive browser/site storage policy;
- private browsing behavior;
- browser extension or security software interference.

Recommended steps:

1. avoid reloading until you understand whether new progress is durable;
2. check browser storage permissions/capacity for the site;
3. remove unrelated site data rather than blindly clearing TableSpark data;
4. when saving resumes, export a validated backup.

This warning is different from the unreadable-data recovery state below.

## “Stored learning data needs recovery” appears

TableSpark found an existing local value but could not validate it. The application intentionally **does not overwrite that value**.

While recovery is pending:

- the app uses a temporary in-memory default state;
- new changes are not persisted over the unreadable value;
- ordinary **Export backup** is disabled because it would export the temporary state.

Go to **Settings → Data & privacy**. You can:

1. choose **Download unreadable local data** to save the exact raw stored value as a text recovery artifact;
2. import a known-good TableSpark backup, which replaces the unreadable value after validation/confirmation;
3. choose **Discard unreadable local data** only if you no longer need it.

Download the raw value before discarding if there is any chance you may need manual recovery. The raw file may contain learner profile names and learning history, so treat it as personal data.

Do not paste unreadable learning data into public issues. If support needs a reproduction, remove personal data first.

## Local profile/progress disappeared

TableSpark stores learning state in browser local storage. It can disappear if:

- site storage was manually cleared;
- the browser profile was removed;
- private/incognito storage was discarded;
- browser cleanup software deleted site data.

If you exported a backup, restore it through **Settings → Data & privacy → Import backup**.

If local data was deleted and no backup exists, the application has no remote server copy from which to restore it.

If data still exists but is unreadable, TableSpark shows the dedicated recovery warning instead of automatically deleting it.

## Backup import fails

Possible reasons include:

- invalid JSON;
- unsupported schema version;
- file over the shared 2 MB persisted-state budget;
- too many profiles;
- duplicate profile identifiers;
- an active profile identifier that does not exist in the profile array;
- invalid settings ranges;
- non-canonical mastery fact keys;
- impossible mastery counters;
- multiplication answers that do not match their operands;
- attempt correctness that does not match the recorded response;
- correct attempts incorrectly stored in mistake history.

Use a backup created by TableSpark whenever possible. Do not hand-edit a backup unless you understand the versioned schema and semantic invariants.

## Text-to-speech is unavailable or does nothing

Speech synthesis is a progressive enhancement and depends on browser/platform support.

If the browser does not expose usable speech-synthesis functions, TableSpark disables the Settings checkbox and displays an explanation.

If controls are available but speech still fails, check that:

- speech controls are enabled in Settings;
- an operating-system voice is available;
- browser/site audio is not blocked;
- the operating system/browser speech service is functioning.

Runtime speech exceptions are handled as non-fatal failures. Core learning functionality does not depend on speech support.

## Printing includes unexpected browser headers/footers

TableSpark supplies print CSS and blank worksheet Name/Date lines, but the browser controls print-dialog options such as headers, footers, margins, paper size, and scale. Disable browser headers/footers in the print dialog if you want a cleaner worksheet.

The active offline profile name is not automatically inserted into the printable worksheet header.

## Dark/system theme appears wrong

For `system` theme, TableSpark follows `prefers-color-scheme`. Check your operating-system/browser theme setting. You can override it by selecting Light or Dark explicitly in TableSpark Settings.

## CI is failing but local checks pass

Compare:

- Node version (CI uses Node 22.12.0);
- whether Chromium is installed for local E2E;
- case sensitivity of filenames (Linux CI is case-sensitive);
- committed files versus local uncommitted files;
- secret-scan output;
- production dependency audit output.

Use GitHub Actions job logs to identify the exact failing step before changing code.

## Need more help?

See `SUPPORT.md` and open a GitHub issue with reproducible steps after removing any private learner data or secrets.
