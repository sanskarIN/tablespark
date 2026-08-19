# Git Workflow

## Repository identity

Repository: `https://github.com/sanskarIN/tablespark`

For local Git CLI work on this repository, configure the requested commit email at repository scope:

```bash
git config user.email "sanskarin@outlook.in"
```

This writes `user.email` into the repository's local `.git/config` rather than changing every repository on the computer.

Confirm it with:

```bash
git config --get user.email
```

Set the local author name if needed:

```bash
git config user.name "Sanskar"
```

## Branch workflow

Recommended for normal feature work:

```bash
git switch main
git pull --ff-only
git switch -c feat/short-description
```

Command meaning:

- `git switch main` moves to the default branch.
- `git pull --ff-only` downloads remote changes and updates only when Git can fast-forward, avoiding an accidental merge commit.
- `git switch -c ...` creates and switches to a new feature branch.

## Atomic commits

Stage only related changes:

```bash
git status
git add path/to/file
git diff --cached
git commit -m "feat: describe the completed change"
```

Review `git diff --cached` before committing. Do not create empty commits or split inseparable code/test changes solely to inflate commit count.

## Verification before push

For a milestone-level change:

```bash
npm run check
npm run test:e2e
```

Then push the branch:

```bash
git push -u origin feat/short-description
```

`-u` records the upstream branch so future `git push`/`git pull` commands can omit the remote branch name.

## Conventional Commit examples

```text
feat: add worksheet answer key mode
fix: preserve active profile during backup restore
test: cover maximum table range
docs: explain PWA update lifecycle
refactor: isolate practice session reducer
perf: reduce large worksheet render work
ci: verify browser accessibility smoke checks
chore: update development dependencies
```

## Keeping `main` safe

Prefer protected-branch pull requests once repository rules are enabled. Required checks should pass before merge. Avoid force-pushing `main` or moving published release tags.

See `docs/repository-settings.md` for recommended branch rules.
