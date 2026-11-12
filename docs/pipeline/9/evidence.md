# Evidence — 9

## Commands

| Command | Exit | Last lines |
|---|---|---|
| `npm run typecheck` | 0 | log: `$RUN_DIR/logs/verify-1.log` |
| `npm test` | 0 | log: `$RUN_DIR/logs/verify-2.log` (13 tests passed) |
| `npm run build` | 0 | log: `$RUN_DIR/logs/verify-3.log` |

## Visible change

Yes. The `<h1>` text changes from "Reading list" to "Reading list (N)" at runtime.

## Screenshots

- `screenshots/1-empty-heading.png` — the page with an empty list, heading "Reading list (0)" — demonstrates AC1 and A1.
- `screenshots/2-two-items-heading.png` — the page after adding two books, heading "Reading list (2)" — demonstrates AC1 and AC2.

Running-app checks, driven over the Chrome DevTools Protocol against the dev server (log: `$RUN_DIR/logs/verify-drive.log`), reading the h1 after each step:

| Step | h1 text | AC |
|---|---|---|
| Load with cleared storage | Reading list (0) | AC1, A1 |
| Add "Dune" | Reading list (1) | AC2 |
| Add "Emma" | Reading list (2) | AC2 |
| Remove the first row (1 row left) | Reading list (1) | AC3 |
| Reload with one stored item | Reading list (1) | AC4 |

The tab title (`document.title`) stayed "Reading list" (A2).

## Departures from spec

None.

## Revert check

`revert-check` with `npm test`: test file `src/render.test.ts`, exit code 1, failed: true. The new tests fail against the base's source, as they should.

## Diff risk

Not run yet (stage 8).

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
