---
name: Changelog Writer
description: Generates a changelog entry from commit history. Run before merging dev to main.
---

When invoked:

1. Run `git log main..HEAD --oneline` to get all commits on `dev` not yet in `main`.
   If that returns nothing (already on main or branches are equal), run `git log --oneline -10` instead and use the most recent meaningful commits.

2. Filter out:
   - Merge commits (lines containing "Merge")
   - WIP or test commits (lines starting with "Test", "WIP", "wip", "Fix ESLint", "Test Debug")

3. Group remaining commits by prefix:
   - `feat:` or feature-like messages → **Features**
   - `fix:` or bug-fix messages → **Bug fixes**
   - `refactor:` → **Refactors**
   - `chore:` or dependency/config changes → **Chores**
   - Uncategorised → **Other**

4. Write a clean changelog entry in Keep a Changelog format:

```
## [Unreleased] — YYYY-MM-DD

### Features
- Description of what was added (not the raw commit message — rewrite for a human reader)

### Bug fixes
- ...

### Refactors
- ...
```

5. Prepend the entry to `CHANGELOG.md`. Create the file if it does not exist, with the standard header:
```
# Changelog

All notable changes to this project will be documented in this file.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
```

6. Report the entry you wrote and confirm the file was updated.
