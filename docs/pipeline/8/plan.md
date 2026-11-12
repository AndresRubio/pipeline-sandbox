# Plan — 8: Typo in the page title

**Spec:** `docs/pipeline/8/spec.md`

## Global Constraints

- Hard rules from ship: never push to the base branch, never force-push or merge; push only `pipeline/*` branches; never edit `.github/workflows/**`; no completion claim without fresh evidence; keep tool output short; commits end with the `Co-Authored-By` trailer.
- Protected paths are not touched (`src/storage.ts`, `.github/**`, `.claude/**`).
- No new dependencies. `@types/node` is not installed, so the test reads the HTML with Vite's `?raw` import (typed by `vite/client`), not `node:fs`.
- Check commands that must pass, in order:
  1. `npm run typecheck`
  2. `npm test`
  3. `npm run build`
- Size limits: at most 6 files and 250 lines (this plan: 2 source files).

## Tasks

### Task 1: Fix the page title, test-first

**Satisfies:** AC1, AC2

**Files:**
- Create: `src/title.test.ts`
- Modify: `index.html` (line 6)

- [ ] **Step 1: Write the failing test.** Create `src/title.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import html from '../index.html?raw';

describe('index.html', () => {
  it('has the page title "Reading list"', () => {
    const match = html.match(/<title>([^<]*)<\/title>/);
    expect(match?.[1]).toBe('Reading list');
  });
});
```

- [ ] **Step 2: Run it and see it fail.** `npm test` fails with expected `Reading list`, received `Readng List`.

- [ ] **Step 3: Fix the title.** In `index.html`, change `<title>Readng List</title>` to `<title>Reading list</title>`. Change nothing else.

- [ ] **Step 4: Run every check.** `npm run typecheck`, `npm test`, `npm run build` all exit 0. Then confirm `dist/index.html` contains `<title>Reading list</title>`.

- [ ] **Step 5: Commit.** `git add index.html src/title.test.ts && git commit -m "fix: correct the page title typo (#8)"`, with the `Co-Authored-By` trailer.

## Coverage

| AC | Task |
|---|---|
| AC1 | Task 1 (test in step 1, built output in step 4) |
| AC2 | Task 1 (diff limited to the title line plus the new test; checks in step 4) |
