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
