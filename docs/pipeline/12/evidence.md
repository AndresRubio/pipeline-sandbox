# Evidence — 12

## Commands

| Command | Exit | Last lines |
|---|---|---|
| `npm run typecheck` | 0 | log: `$RUN_DIR/logs/verify-1.log` |
| `npm test -- --reporter=dot` | 0 | log: `$RUN_DIR/logs/verify-2.log` (2 files, 6 tests passed) |
| `npm run build` | 0 | log: `$RUN_DIR/logs/verify-3.log` |

## Visible change

Yes. The markup of every list row changes: the author's name is now wrapped in `<em>`, so it renders in italics.

## Screenshots

Visual check needed: the app loads with an empty list (items come from localStorage and appear only after one is added through the form), so a screenshot by URL shows only the empty state and cannot demonstrate AC1. No browser tool was available to add an item. AC1 and AC2 are covered by the unit test instead.

## Departures from spec

None.

## Revert check

`src/render.test.ts` run against the base's source: exit code 1, failed: true (the new test "shows the author in italics, escaped" fails without the change, as it should).

## Diff risk

## Self-review

### Standards

### Spec

### Confession

### Classification

| # | Finding | Axis | Severity | Resolution |
|---|---|---|---|---|

### Rounds

## Known issues

None so far.

## Cost

Unknown.
