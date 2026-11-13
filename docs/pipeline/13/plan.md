# Plan — 13: Add a meta description to the page

**Goal:** `index.html` carries exactly one `<meta name="description" content="A small reading list.">` in its `<head>`, and nothing else in it changes.

**Architecture:** One static line in `index.html`; one unit test in the existing `src/title.test.ts`, which already loads `index.html?raw`.

## Global Constraints

- Never push to the base branch, force-push, `git reset --hard` or merge a PR. Push only `pipeline/*` branches.
- Never edit `.github/workflows/**`. Never touch `src/storage.ts` (protected path).
- Never invent values: the description text is exactly "A small reading list." from the issue.
- No completion claim without fresh evidence (run the checks below and read the result).
- Every commit message ends with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Keep the diff small: 2 files.
- Checks (all must pass), from `checks.txt`:
  - `npm run typecheck`
  - `npm test`
  - `npm run build`

## Tasks

### Task 1: Add the meta description (satisfies AC1, AC2)

**Files:** modify `src/title.test.ts`, modify `index.html`.

- [ ] **Step 1: Write the failing test.** In `src/title.test.ts`, inside `describe('index.html', …)`, add after the title test:

  ```ts
  it('has exactly one meta description "A small reading list."', () => {
    const tags = html.match(/<meta\s+name="description"[^>]*>/g) ?? [];
    expect(tags).toHaveLength(1);
    expect(tags[0]).toContain('content="A small reading list."');
  });
  ```

- [ ] **Step 2: Run it and see it fail.** `npm test -- --reporter=dot` fails: expected length 1, received 0.
- [ ] **Step 3: Implement.** In `index.html`, add `    <meta name="description" content="A small reading list." />` as a new line directly after the `<title>` line (A1). Change nothing else.
- [ ] **Step 4: Run the checks.** `npm run typecheck`, `npm test -- --reporter=dot`, `npm run build` all pass. `git diff --stat` shows only the two files; the `index.html` diff is the single added line (AC2).
- [ ] **Step 5: Commit.** `feat: add a meta description to the page (#13)` with the trailer.
