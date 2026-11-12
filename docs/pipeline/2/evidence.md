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

(filled in stage 8)

## Self-review

### Standards

### Spec

### Confession

### Classification

| # | Finding | Axis | Severity | Resolution |
|---|---|---|---|---|

### Rounds

## Known issues

None.

## Cost

Unknown.
