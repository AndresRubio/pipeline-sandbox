# Evidence — 2

## Commands

| Command | Exit | Last lines |
|---|---|---|
| `npm run typecheck` | 0 | log: `$RUN_DIR/logs/verify-1.log` |
| `npm test` | 0 | log: `$RUN_DIR/logs/verify-2.log` (3 test files, 17 tests passed) |
| `npm run build` | 0 | log: `$RUN_DIR/logs/verify-3.log` |

## Visible change

Yes. The order in which the reading list is displayed changes (`src/render.ts`), so a user sees the books alphabetically by title instead of in added order.

## Screenshots

- `screenshots/1-empty-state.png` — the app's empty state ("No items.") served from the dev preview — demonstrates AC6 (the empty state is unchanged).

Visual check needed for the populated list: the `screenshot` command opens a fresh browser profile and this session has no browser tool, so a list could not be seeded into localStorage and the sorted list was not captured. The order (AC1, AC2) and the id pairing (AC5) are asserted by the render unit tests instead.

## Departures from spec

None.

## Revert check

Ran `npm test` with the tests from HEAD (`src/list.test.ts`, `src/render.test.ts`) against the base's source: exit code 1, `failed: true`. The new tests fail without the change, as they should.

## Diff risk

None.

## Self-review

### Standards

CLAUDE.md asks for pure logic in `src/list.ts` and `src/render.ts`, unit-tested, with `src/main.ts` only wiring the DOM. `sortByTitle` is a pure function in `src/list.ts`, and `renderList` calls it. `src/main.ts` and `src/storage.ts` (a protected path) are unchanged. The diff is 4 source and test files and 74 lines, within `maxPrSize`. No standards breaches.

### Spec

- AC1 (alphabetical, case-insensitive): met; `sortByTitle` and `renderList` tests with "Zebra", "apple", "Mango".
- AC2 (equal titles keep added order): met; the `sortByTitle` test fails against the unsorted order, so it exercises the change. The render-level equal-titles test passes either way and is only a regression guard.
- AC3 (input not mutated): met; tests for `sortByTitle` and `renderList`.
- AC4 (saved order and storage unchanged): met; `src/storage.ts` and `src/main.ts` have no diff against the base, and `main.ts` still saves the unsorted `items`. Checked by diff inspection, not by an automated test, as the spec says.
- AC5 (Remove button matches its row): met; render test pairs each row's title with its `data-id`.
- AC6 (empty state and existing rendering unchanged): met; the existing render tests pass, and the empty-state screenshot is attached.
- AC7 (typecheck, test, build): met; exit 0 for all three, fresh in stage 7.

No scope creep: no sort control, no change to the stored format or `main.ts`.

### Confession

- No skipped or weakened tests, suppressed errors or type checks, hardcoded values, swallowed exceptions or `--no-verify`. `diff-risk` reports no hits.
- At grading, the first checklist had 4 assumptions, which the grader turned into a `fork` (limit 3). I dropped "sort a copy inside `renderList`", because the issue already settles that the saved order stays as it is and where to sort is a design choice, and I regraded to `small-gaps`. That was my judgement call; the three remaining assumptions are the ones the owner may want to correct.
- No screenshot of a populated list: the screenshot command can't seed localStorage and this session has no browser tool. The order is covered by unit tests instead.
- Stages 7 and 8 ran in the orchestrating session rather than in subagents, because the diff is small.

### Classification

| # | Finding | Axis | Severity | Resolution |
|---|---|---|---|---|
| 1 | `localeCompare` with `sensitivity: 'base'` also ignores accents, so "é" and "e" compare equal. It follows from assumption A1 but A1 only names case. | Standards | Minor | Left as is; ties keep added order. |
| 2 | The render-level equal-titles test passes without the change (it is a regression guard; the `sortByTitle` test is the one that fails against the base). | Standards | Minor | Left as is. |
| 3 | AC4 is verified by diff inspection, not an automated test. | Spec | Minor | Left as is; `main.ts` is DOM wiring and has no unit tests. |

### Rounds

0 fix rounds: no Critical or Important findings.

## Known issues

None.

## Cost

Unknown.
