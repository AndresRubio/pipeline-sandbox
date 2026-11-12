# Plan — 12: Show the author's name in italics

**Goal:** Each list row shows the author's name inside `<em>`, still HTML-escaped. Spec: `docs/pipeline/12/spec.md`.

## Global Constraints

- Hard rules from ship: never push to the base branch, never force-push or `git reset --hard`, never merge a PR, never edit `.github/workflows/**`, no completion claim without fresh evidence, never invent values.
- Protected paths are not touched: `src/storage.ts`, `.github/**`, `.claude/**`.
- Keep the change small (limit: 6 files, 250 lines). Pure logic stays in `src/render.ts`; `src/main.ts` is not touched.
- Every commit message ends with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Checks that must pass (from `checks.txt`):
  - `npm run typecheck`
  - `npm test`
  - `npm run build`

## File map

- Modify `src/render.ts` (the author span in `renderList`).
- Modify `src/render.test.ts` (add one test).

### Task 1: Render the author inside `<em>`

**Satisfies:** AC1, AC2, AC3, AC4.

**Files:** `src/render.ts`, `src/render.test.ts`.

- [ ] **Step 1: Write the failing test.** In `src/render.test.ts`, inside the `describe('renderList', …)` block after the "escapes titles" test, add:

  ```ts
  it('shows the author in italics, escaped', () => {
    const html = renderList([{ id: '1', title: 'T', author: '<i>&', addedAt: '2026-03-01T10:00:00.000Z' }]);
    expect(html).toContain('<span class="author"><em>&lt;i&gt;&amp;</em></span>');
  });
  ```

- [ ] **Step 2: Run it and see it fail.** `npm test -- --reporter=dot`. Expected: the new test fails because the author is not wrapped in `<em>`.

- [ ] **Step 3: Implement.** In `src/render.ts`, change the author span in the row template from
  `<span class="author">${escapeHtml(item.author)}</span>` to
  `<span class="author"><em>${escapeHtml(item.author)}</em></span>`.

- [ ] **Step 4: Run all checks.** `npm run typecheck`, `npm test -- --reporter=dot`, `npm run build`. Expected: all pass, including the two existing `renderList` tests (AC3).

- [ ] **Step 5: Commit.** `git add src/render.ts src/render.test.ts` and commit `feat: show the author's name in italics (#12)` with the Co-Authored-By trailer.
