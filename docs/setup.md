# Setup Guide

This guide explains how to prepare a development machine for TableSpark and how to upgrade the required tools when an installed version is out of support.

## Required tools

TableSpark development requires:

- Git
- Node.js 22.12.0 or newer
- npm 10 or newer
- a modern browser

Recommended editor:

- Visual Studio Code with the built-in TypeScript support plus optional ESLint and Prettier extensions

The project itself does not require a database server, Python, Java, Docker, Android Studio, or platform-specific SDK.

## Check what is already installed

Open a terminal and run:

```bash
git --version
node --version
npm --version
```

What the commands mean:

- `git --version` asks Git to print the installed Git version.
- `node --version` asks the Node.js runtime to print its version.
- `npm --version` asks the Node package manager to print its version.

For this repository, Node.js must be at least `22.12.0` and npm must be at least major version 10.

## Windows 11

### Install Git

A straightforward option is Windows Package Manager:

```powershell
winget install --id Git.Git -e
```

`winget install` installs a package. `--id Git.Git` selects the Git package by its exact identifier, and `-e` means exact matching.

Close and reopen the terminal, then verify:

```powershell
git --version
```

### Install Node.js

Install a supported Node.js LTS/current line using your preferred trusted package source. With `winget`, first inspect available Node packages:

```powershell
winget search Node.js
```

After installation, open a new terminal and verify:

```powershell
node --version
npm --version
```

If your package source provides Node older than `22.12.0`, update that package source or install a newer supported Node release before continuing.

### Optional Visual Studio Code

```powershell
winget install --id Microsoft.VisualStudioCode -e
```

Useful VS Code extensions:

- ESLint (`dbaeumer.vscode-eslint`)
- Prettier - Code formatter (`esbenp.prettier-vscode`)

The repository already contains `.editorconfig` and formatter/linter configuration, so editor extensions should follow repository rules rather than inventing separate ones.

## macOS

### Homebrew route

If Homebrew is already installed:

```bash
brew update
brew install git
brew install node
```

Then verify:

```bash
git --version
node --version
npm --version
```

If `brew install` reports that a formula is already installed, use the upgrade process below instead of installing a duplicate copy.

## Linux

Package names and versions vary by distribution. Distribution repositories sometimes lag behind active Node.js releases, so always verify the resulting version.

After installing Git and Node.js from your trusted distribution/package source, run:

```bash
git --version
node --version
npm --version
```

If Node is older than `22.12.0`, use a supported Node version manager or an official Node package source appropriate for your distribution rather than forcing TableSpark to run on an unsupported runtime.

## Clone TableSpark

Choose a development folder and run:

```bash
git clone https://github.com/sanskarIN/tablespark.git
cd tablespark
```

Command meaning:

- `git clone <url>` downloads a working copy and Git history from the repository URL.
- `cd tablespark` changes the terminal's current directory into the cloned project folder.

## Configure repository commit identity

For this repository, configure the requested project email locally:

```bash
git config user.email "sanskarin@outlook.in"
```

This writes `user.email` into the current repository's `.git/config`. Omitting `--global` avoids changing unrelated repositories.

Check it with:

```bash
git config user.email
```

## Install project dependencies

```bash
npm install
```

`npm install` reads `package.json`, resolves the pinned direct dependencies and their transitive dependencies, installs them under `node_modules/`, and creates/updates a local package lock for that installation.

Do not commit unrelated dependency changes without reviewing them. When a lockfile is introduced/updated, inspect the diff and run the full quality suite before committing it.

## Start development mode

```bash
npm run dev
```

`npm run dev` executes the repository's `dev` script, which starts Vite's development server. By default this project uses port `5173` and requires that port to be available.

Open:

```text
http://localhost:5173
```

Stop the server with `Ctrl+C` in the terminal where it is running.

## Install Playwright browser support

Unit and integration tests do not need a downloaded browser, but end-to-end tests do.

```bash
npx playwright install chromium
```

`npx` executes a command from the project's installed packages. `playwright install chromium` downloads the Chromium browser build used by Playwright.

On a minimal Linux environment, install the browser and required operating-system libraries together:

```bash
npx playwright install --with-deps chromium
```

## Verify the complete local setup

Run:

```bash
npm run check
```

This sequentially checks formatting, lint rules, strict TypeScript types, application tests, security-scanner tests, repository credential-pattern scanning, and the production build.

Then, for browser-level verification:

```bash
npm run test:e2e
```

For the production dependency security gate:

```bash
npm audit --omit=dev --audit-level=high
```

## Run security checks individually

Test the repository scanner itself:

```bash
npm run test:security
```

Scan the repository working tree:

```bash
npm run secret:scan
```

A successful pattern scan does not prove no secret has ever appeared in Git history. If a real credential is exposed, revoke/rotate it immediately and then remediate repository history as appropriate.

## Upgrade an unsupported tool

### Git

Check:

```bash
git --version
```

On Windows with `winget`:

```powershell
winget upgrade --id Git.Git -e
```

On Homebrew:

```bash
brew update
brew upgrade git
```

### Node.js

Check:

```bash
node --version
```

If Node is below `22.12.0`, upgrade through the same trusted package manager or version manager used to install it. After upgrading, reopen the terminal and run:

```bash
node --version
npm --version
```

Then remove and reinstall dependencies only if you encounter native-module or resolution problems after a major runtime change:

```bash
rm -rf node_modules
npm install
```

On PowerShell, the equivalent folder removal is:

```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

Do not delete application source files or exported TableSpark backup files when cleaning dependencies.

### Project dependencies

See outdated direct dependencies:

```bash
npm outdated
```

Review updates rather than blindly applying them. Dependabot is configured to propose dependency updates in GitHub so CI can validate them.

## Install TableSpark as a PWA

After a production deployment is served over a secure origin, supported browsers can offer an install action. The exact button differs by browser. Installation creates a standalone app-like window while still using the web application package.

Development on `localhost` can exercise service-worker behavior, but release installability should be verified from the final secure deployment origin.

## Common setup problems

### `node` or `npm` is not recognized

Close and reopen the terminal after installation. If the command still cannot be found, confirm the tool's installation directory is on your `PATH`.

### Node is installed but `npm run check` rejects the version

Compare `node --version` with `package.json` and `.nvmrc`. Use Node `22.12.0` or newer within the supported major line rather than relying on a system package that only reports `22.0.0`–`22.11.x`.

### Port 5173 is already in use

TableSpark deliberately uses `strictPort`, so Vite will report the conflict instead of silently switching ports. Stop the process using port 5173, then run `npm run dev` again.

### Playwright cannot launch Chromium

Run:

```bash
npx playwright install chromium
```

On Linux CI/minimal environments use:

```bash
npx playwright install --with-deps chromium
```

For more help, see `docs/troubleshooting.md`.
