---
name: safe-commit
description: Run lint, unit tests, and Playwright e2e before every commit. Fix failures and retry up to 3 times; on the third failure summarize all attempted fixes and ask the user for direction before proceeding.
user-invocable: true
---

# safe-commit

Run all quality gates before committing. Fix failures automatically and retry. Escalate to the user after 3 failed iterations.

## When to invoke

Invoke this skill whenever you are about to create a git commit — before calling `git commit`. Do not skip it for "small" or "obvious" changes. The only exception is when the user explicitly says to skip checks (e.g. "commit without running tests").

## Steps

### 1. Run all checks (one attempt = all three in sequence)

Run these three commands. Stop at the first failure and move to the fix loop.

```
npm run lint
npm test -- --run
npx playwright test
```

### 2. If all pass → commit

Stage the files the user (or you) identified, then commit. Done.

### 3. If any check fails → fix loop

Track the attempt count (starts at 1). For each failure:

1. Read the full error output carefully.
2. Identify the root cause — do not guess or make changes beyond what the error requires.
3. Apply the minimal fix.
4. Re-run all three checks from the top.
5. Increment the attempt count.

### 4. Escalate after 3 failed iterations

If the attempt count reaches 3 and checks are still failing:

- **Stop. Do not commit. Do not make further changes.**
- Present a structured summary to the user:

```
## safe-commit: needs your input

**What I was trying to commit:**
<brief description of the original change>

**Iteration 1**
- Check that failed: <lint | unit | playwright>
- Error: <concise error>
- Fix attempted: <what was changed and why>
- Result: <passed / still failing>

**Iteration 2**
...

**Iteration 3**
...

**Current state:**
<which checks pass, which still fail>

**What I need from you:**
<specific question — e.g. "Should I skip the failing e2e test and open a follow-up issue?" or "The type error requires a schema change — do you want me to update the type or revert the feature?">
```

Wait for the user to respond before taking any further action.

## Rules

- Never use `--no-verify` or any flag that bypasses hooks.
- Never skip Playwright by omitting it or filtering to zero tests.
- If Playwright requires a running dev server and none is running, start one in the background before running tests, then stop it after.
- Count iterations honestly — do not reset the counter to avoid escalation.
- When escalating, the summary must be concrete: exact error messages, exact file names, exact lines changed. No vague descriptions.
