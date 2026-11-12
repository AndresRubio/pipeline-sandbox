# Evidence — 5

## Commands

| Command | Log | Exit |
|---|---|---|
| `npm run typecheck` | `$RUN_DIR/logs/verify-1.log` | 0 |
| `npm test` (11 tests, 3 files, all passed) | `$RUN_DIR/logs/verify-2.log` | 0 |
| `npm run build` | `$RUN_DIR/logs/verify-3.log` | 0 |

## Visible change

Yes. The empty-list text and its styling change (`src/render.ts`, `src/style.css`).

## Screenshots

- `screenshots/1-empty-state.png` — the app with an empty list: the new message in grey under the form. Demonstrates AC1 (exact text), AC2 (centring) and AC4 (muted colour).

Observation on AC2: the message is centred in the form's box, which is the 40rem `main` column (text spans x=132–572, centre 352 of a column running 32–672). The form's controls only fill the left part of that box (x=32–458), so the message looks shifted to the right of the visible inputs. This follows assumption A2 (`text-align: center` on `.empty`, within the form's full width). Moving the form or narrowing the column would change layout the issue doesn't ask about, so it was left alone.

AC3 (message hidden with an item) can't be shown by screenshot without using the form; it is covered by the unit test `hides the empty state when there are items`.

## Departures from spec

None.

## Revert check

`src/render.test.ts` run against the base's source: exit code 1, `failed` true (the `shows the empty state` test fails against the old "No items." copy). Good: the tests exercise the change.

## Diff risk

(Filled in at stage 8.)

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
