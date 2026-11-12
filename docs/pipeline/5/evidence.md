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

None. `diff-risk` reported no hits against the base.

## Self-review

### Standards

Reviewed against CLAUDE.md: the change keeps pure logic in `src/render.ts` and tests it in `src/render.test.ts`; `src/main.ts` is untouched and the protected `src/storage.ts` is not touched. The diff is 3 files and 12 lines, inside `maxPrSize`. Only baseline smell: `#777` now appears in two rules (`.added` and `.empty`); a shared variable would be more change than this issue warrants.

### Spec

- AC1: met. `renderList([])` returns exactly the issue's message (unit test, and the screenshot).
- AC2: met under the recorded assumption A2: the message is centred in the form's box (the 40rem column). The form's controls only fill the left part of that box, so the text looks shifted right of the inputs (see Screenshots). A reading of "centred under the visible inputs" would need a layout change the issue doesn't ask for.
- AC3: met. Unit test `hides the empty state when there are items`.
- AC4: met. `color: #777`, matching the existing muted text (A1).
- No behaviour beyond the issue was added.

### Confession

No skipped or weakened tests, no suppressed errors or type checks, no swallowed exceptions, no `--no-verify`. The exact message string appears in the test and in the code, but it is the text the issue specifies, not a value hardcoded to pass a test. The revert check confirms the new test fails against the base.

### Classification

| # | Finding | Axis | Severity | Resolution |
|---|---|---|---|---|
| 1 | Message is centred in the form's box, not under the visible inputs; looks right-shifted | Spec (AC2, interpretation) | Minor | Kept per assumption A2, which was posted on the issue for correction. My own judgement call: the owner may rate it higher, and the fix is a form layout change. |
| 2 | `#777` repeated in two rules | Standards | Minor | Left as is |

### Rounds

0 fix rounds. No Critical or Important findings.

## Known issues

None (Important or above). Finding 1 above is a Minor interpretation question about AC2, flagged for the owner.

## Cost

Unknown.
