# Evidence — 14

## Commands

| Command | Exit | Last lines |
|---|---|---|
| `npm run typecheck` | 0 | log: `$RUN_DIR/logs/verify-1.log` |
| `npm test -- --reporter=dot` | 0 | log: `$RUN_DIR/logs/verify-2.log`; 3 files, 28 tests passed |
| `npm run build` | 0 | log: `$RUN_DIR/logs/verify-3.log` |

## Visible change

No. The change adds one exported function to `src/list.ts` and tests. Nothing calls it, and `src/main.ts`, `src/render.ts` and the markup are unchanged.

## Screenshots

Not applicable.

## Departures from spec

None.

## Revert check

Ran `npm test` with `src/list.test.ts` from HEAD against the base's source (`$RUN_DIR/revert.json`). Exit code 1, `failed` true: the new tests fail without the change, as they should.

## Diff risk

None.

## Self-review

### Standards

The function is pure, lives in `src/list.ts`, and is unit-tested in the existing `src/list.test.ts`, as CLAUDE.md asks. It follows the style of its neighbours, and the diff is 2 files and 42 lines, well under `maxPrSize`. One Minor note: the `byAuthor` test helper (`src/list.test.ts:65`) is close to the `book` helper in the `sortByTitle` block (`src/list.test.ts:26`). Each `describe` block keeps its own helper, so this follows the file's style.

### Spec

AC1 (`src/list.test.ts:72-74`), AC2 (`:76-79`), AC3 (`:81-84`) and AC4 (`:86-93`) are met and tested. The AC4 test asserts on `Object.keys`, `Object.hasOwn` and the property descriptor, so it can't pass vacuously. It fails on a plain-object accumulator, shown in Task 2 and by the revert check. AC5: a named export with the exact signature, no callers outside the tests, typecheck passes. AC6: `npm test`, `npm run typecheck` and `npm run build` pass (see Commands). No scope creep and no departures from the spec.

### Confession

No skipped or weakened tests, no suppressed errors or type checks, no values hardcoded to pass a test, no swallowed exceptions and no `--no-verify`. `diff-risk` reports no hits. One temporary edit was made and reverted during Task 2: swapping in a plain-object accumulator to prove the new tests fail. It was never committed.

### Classification

| # | Finding | Axis | Severity | Resolution |
|---|---|---|---|---|
| 1 | `byAuthor` test helper nearly duplicates the `book` helper | Standards | Minor | Left as is: each `describe` block in the file keeps its own helper |

### Rounds

0 fix rounds. No Critical or Important findings.

## Known issues

None.

## Cost

Unknown.
