# Plan — 9: Show the number of books in the heading

**Goal:** the page heading reads "Reading list (N)" and tracks the item count on load, add and remove.

**Spec:** `docs/pipeline/9/spec.md`

## Global Constraints

- Never push to the base branch, force-push, `git reset --hard` or merge a PR. Push only `pipeline/*` branches.
- Never edit `.github/workflows/**`, `.claude/**` or `src/storage.ts` (protected paths).
- Never invent values: the heading text is "Reading list (N)", taken from the issue.
- No completion claim without fresh evidence.
- Keep the diff under 6 files and 250 lines.
- Every commit message ends with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Pure logic lives in `src/render.ts` and is unit-tested; `src/main.ts` only wires the DOM.
- Add the new function at the end of `src/render.ts`, away from `renderList`, so merges with the in-flight runs that edit `renderList` stay clean.
- Commands that must pass (from `$RUN_DIR/checks.txt`):
  - `npm run typecheck`
  - `npm test`
  - `npm run build`

## File map

- Modify `src/render.ts`: add `formatHeading`.
- Modify `src/render.test.ts`: tests for `formatHeading`.
- Modify `src/main.ts`: look up the h1 and set it in `refresh()`.
- `index.html` stays as is (A3).

### Task 1: Heading formatter (test first)

Satisfies: AC1.

- [ ] Add a `describe('formatHeading', …)` block to `src/render.test.ts`, importing `formatHeading` from `./render`. Tests: `formatHeading(0)` is `'Reading list (0)'`, `formatHeading(1)` is `'Reading list (1)'`, `formatHeading(12)` is `'Reading list (12)'`.
- [ ] Run `npm test` and confirm the new tests fail (`formatHeading` is not exported).
- [ ] Add to the end of `src/render.ts`:

  ```ts
  export function formatHeading(count: number): string {
    return `Reading list (${count})`;
  }
  ```

- [ ] Run `npm test` and `npm run typecheck`; both pass.
- [ ] Commit: `feat: add formatHeading` with the trailer.

### Task 2: Wire the heading into refresh()

Satisfies: AC2, AC3, AC4 (and AC5 with Task 1).

There is no unit test for DOM wiring in this codebase; it is verified in the running app at stage 7.

- [ ] In `src/main.ts`, import `formatHeading` alongside `renderList`.
- [ ] Add `const headingEl = document.querySelector<HTMLHeadingElement>('h1')!;` next to the other element lookups.
- [ ] In `refresh()`, before the existing lines, add `headingEl.textContent = formatHeading(items.length);` (plain text, not markup).
- [ ] Run `npm run typecheck`, `npm test` and `npm run build`; all pass.
- [ ] Commit: `feat: show the item count in the heading` with the trailer.

## Coverage

| AC | Task |
|---|---|
| AC1 | 1 |
| AC2 | 2 |
| AC3 | 2 |
| AC4 | 2 |
| AC5 | 1, 2 |
