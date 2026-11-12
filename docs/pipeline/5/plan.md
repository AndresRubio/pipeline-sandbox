# Plan — 5: Friendlier empty state

**Goal:** Show "Your reading list is empty — add your first book above." centred and muted when the list is empty, and not otherwise.

**Spec:** `docs/pipeline/5/spec.md`

## Global Constraints

- Keep changes small (CLAUDE.md). Pure logic stays in `src/render.ts`; `src/main.ts` is not touched.
- Never touch `src/storage.ts` (protected path), `.github/**` or `.claude/**`.
- Never invent values: the message text comes verbatim from the issue (em dash U+2014); the colour is `#777` as recorded in assumption A1.
- Never push to the base branch, force-push, reset --hard or merge a PR. Push only `pipeline/*` branches.
- Every commit message ends with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- No completion claim without fresh evidence. Checks, all of which must pass:
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
- Size limit: at most 6 files and 250 lines.

## File Map

- Modify `src/render.ts`: new empty-state copy.
- Modify `src/render.test.ts`: update the empty test, add a non-empty test.
- Modify `src/style.css`: add the `.empty` rule.

### Task 1: Empty-state message, centred and muted

**Satisfies:** AC1, AC2, AC3, AC4

- [ ] **Step 1: Write the failing tests** in `src/render.test.ts`. Replace the `shows the empty state` test with one asserting `renderList([])` contains `Your reading list is empty — add your first book above.` and does not contain `No items.`. Add a test `hides the empty state when there are items` asserting that `renderList` of one item does not contain `Your reading list is empty`.
- [ ] **Step 2: Run `npm test`** and confirm the empty-state test fails (old copy) and the non-empty test passes.
- [ ] **Step 3: Change the copy** in `src/render.ts`: the empty branch returns `<p class="empty">Your reading list is empty — add your first book above.</p>`.
- [ ] **Step 4: Add the CSS** to `src/style.css`: `.empty { text-align: center; color: #777; }`.
- [ ] **Step 5: Run the checks** (`npm run typecheck`, `npm test`, `npm run build`) and confirm all pass.
- [ ] **Step 6: Commit** `feat: friendlier empty state (#5)` with the trailer.
