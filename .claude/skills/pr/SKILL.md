---
name: pr
description: Validate the branch (lint, unit tests, Playwright e2e, npm audit) then push and open a pull request into main (or a specified target). Same 3-iteration fix loop as safe-commit before the PR is created.
user-invocable: true
---

# pr

Run all quality gates, then push the branch and open a pull request. Default target is `main` unless the user specifies otherwise.

## When to invoke

Invoke when the user asks to open or create a PR, push for review, or merge a branch. Also invoke this instead of `safe-commit` when the end goal is a PR rather than a direct commit.

## Steps

### 1. Confirm branch state

- If currently on `main` (or the target branch), stop and tell the user: "You're on main — check out a feature branch first."
- If there are uncommitted changes, run `safe-commit` first to gate and commit them before proceeding.
- Determine the target branch: use what the user specified, or default to `main`.

### 2. Run all checks (counts as attempt 1)

Run these four in sequence. Stop at the first failure and enter the fix loop.

```
npm run lint
npm test -- --run
npx playwright test
npm audit --omit=dev --audit-level=critical
```

**Audit note:** `npm audit` runs at `--audit-level=critical` here (not `high`) because high-severity CVEs in framework dependencies (e.g. Next.js) may be unfixable within supported version constraints. Critical severity always blocks. If the audit flags criticals that cannot be fixed without breaking version constraints, stop at iteration 1 and escalate immediately rather than burning all 3 attempts on an unfixable issue — explain the constraint clearly.

### 3. If all pass → push and open PR

1. Push the branch: `git push -u origin <branch>` (or plain `git push` if already tracking).
2. Draft a PR using the commit log since the branch diverged from the target:
   - Title: short, imperative, under 70 chars
   - Body: Summary (bullet points of what changed and why), Test plan (checklist of what to verify)
3. Create the PR with `gh pr create`.
4. Return the PR URL.

### 4. If any check fails → fix loop

Same rules as `safe-commit`:

1. Read the full error output.
2. Apply the minimal fix targeting only what the error requires.
3. Commit the fix (using `safe-commit` to gate the fix commit itself).
4. Re-run all four checks from the top.
5. Increment attempt count.

### 5. Escalate after 3 failed iterations

Stop. Do not push. Do not open a PR. Present this summary:

```
## pr: needs your input

**Branch:** <branch> → <target>

**What I was trying to PR:**
<brief description>

**Iteration 1**
- Check that failed: <lint | unit | playwright | audit>
- Error: <concise error>
- Fix attempted: <what changed and why>
- Result: <passed / still failing>

**Iteration 2**
...

**Iteration 3**
...

**Current state:**
<which checks pass, which still fail>

**What I need from you:**
<specific question>
```

Wait for the user before taking any further action.

## Rules

- Never use `--no-verify` or skip any check.
- Never open a PR from main into main.
- Always run Playwright — if no dev server is running, start one in the background before tests, stop it after.
- Count iterations honestly.
- If audit flags a critical that is structurally unfixable (e.g. locked by a peer dep ceiling), escalate immediately at iteration 1 with a clear explanation of the constraint.
- PR title and body must reflect the actual changes — no generic templates.
