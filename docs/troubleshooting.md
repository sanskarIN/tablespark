# Troubleshooting

## Development server does not start

Run:

```bash
node --version
npm --version
```

TableSpark requires Node.js 22+ and npm 10+.

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

The first command rewrites formatting. The second verifies that formatting is now stable.

## Unit tests fail

```bash
npm run test
```

For repeated debugging:

```bash
npm run test:watch
```

Tests are deterministic and should not require network access or production credentials.

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

## Local profile/progress disappeared

TableSpark stores learning state in browser local storage. It can disappear if:

- site storage was manually cleared;
- the browser profile was removed;
- private/incognito storage was discarded;
- browser cleanup software deleted site data.

If you exported a backup, restore it through **Settings → Data & privacy → Import backup**.

If local data was deleted and no backup exists, the application has no remote server copy from which to restore it.

## Backup import fails

Possible reasons:

- invalid JSON;
- unsupported schema version;
- missing required profile/settings fields;
- an active profile identifier that does not exist in the profile array;
- backup file over the UI size limit.

Use a backup created by TableSpark whenever possible. Do not hand-edit a backup unless you understand the versioned schema.

## Text-to-speech button does nothing

Speech synthesis is a progressive enhancement and depends on browser/platform support.

Check that:

- speech controls are enabled in Settings;
- the browser exposes speech synthesis;
- an operating-system voice is available;
- browser/site audio is not blocked.

Core learning functionality does not depend on speech support.

## Printing includes unexpected browser headers/footers

TableSpark supplies print CSS, but the browser controls print-dialog options such as headers, footers, margins, paper size, and scale. Disable browser headers/footers in the print dialog if you want a cleaner worksheet.

## Dark/system theme appears wrong

For `system` theme, TableSpark follows `prefers-color-scheme`. Check your operating-system/browser theme setting. You can override it by selecting Light or Dark explicitly in TableSpark Settings.

## CI is failing but local checks pass

Compare:

- Node version (CI uses Node 22);
- whether Chromium is installed for local E2E;
- case sensitivity of filenames (Linux CI is case-sensitive);
- committed files versus local uncommitted files;
- production dependency audit output.

Use GitHub Actions job logs to identify the exact failing step before changing code.

## Need more help?

See `SUPPORT.md` and open a GitHub issue with reproducible steps after removing any private learner data or secrets.
