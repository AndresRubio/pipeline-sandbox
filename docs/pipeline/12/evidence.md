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

None.

## Self-review

### Standards

The change follows CLAUDE.md: the logic stays in `src/render.ts`, it is unit-tested in `src/render.test.ts`, and `src/main.ts` is untouched. The author is still passed through `escapeHtml` before being wrapped, so escaping is intact. No findings.

### Spec

- AC1: met. `renderList` renders the author inside `<em>` within the author span (`src/render.ts:14`).
- AC2: met. The test uses the author `<i>&` and expects `&lt;i&gt;&amp;` inside the `<em>`.
- AC3: met. Only the author span's content changed; the two existing `renderList` tests still pass.
- AC4: met. The new test is in `src/render.test.ts`, and the revert check shows it fails without the change.

No scope creep: no CSS, storage or other files changed.

### Confession

No skipped or weakened tests, no suppressed errors or type checks, no hardcoded values, no swallowed exceptions, no `--no-verify`. One limitation: no screenshot was taken, because the list is empty on load and no browser tool was available (see Screenshots).

### Classification

| # | Finding | Axis | Severity | Resolution |
|---|---|---|---|---|
| - | No findings | - | - | - |

### Rounds

0 fix rounds; nothing to fix.

## Known issues

None.

## Cost

Unknown.
