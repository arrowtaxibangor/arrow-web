# /ship — Merge dev to main

Automates the full release flow from `dev` → `main`. Run this when `dev` is ready to ship.

## Steps

### 1. Preflight check

```bash
git status
git branch --show-current
```

- Confirm you are on `dev`. If not, stop and tell the user.
- If there are uncommitted changes, stage and commit them with a conventional commit message derived from the changed files (e.g. `feat: add blog comment moderation`).

### 2. Type check and lint

```bash
npx tsc --noEmit
npm run lint
```

- If either fails, stop, show the exact error output, and do not proceed.
- Do not auto-fix lint errors — report them and ask the user to fix manually.

### 3. Push dev to remote

```bash
git push origin dev
```

- If `dev` does not exist on the remote yet, push with `-u origin dev`.

### 4. Open PR: dev → main

```bash
gh pr create --base main --head dev --title "Release: dev → main $(date +%Y-%m-%d)" --body "$(cat <<'EOF'
## Release summary

[Auto-generated — edit before merging if needed]

## Changes
$(git log main..dev --oneline)

## Checklist
- [ ] Lint passes
- [ ] Type check passes
- [ ] Tested locally on cms.arrow.taxi domain
EOF
)"
```

- If `gh` is not on PATH, skip this step and instruct the user to open the PR manually at GitHub.

### 5. Poll CI checks (if gh is available)

```bash
gh pr checks --watch
```

- Poll until all checks pass or one fails.
- If any check fails, stop and show the failed check name and logs URL.
- Do not merge on failure.

### 6. Merge on green

```bash
gh pr merge --merge --delete-branch=false
```

- Use `--merge` (not squash or rebase) to preserve commit history.
- Do not delete `dev` — it is the permanent working branch.

### 7. Run the changelog agent

Invoke the Changelog Writer agent to prepend a new entry to `CHANGELOG.md`.

### 8. Report completion

```bash
git log main --oneline -3
```

Print: "Shipped. Latest main commit: [hash]"
