# Evidence for 17

## Commands

| Command | Exit | Last lines |
|---|---|---|
| `npm run typecheck` (log: `$RUN_DIR/logs/verify-1.log`) | 0 | clean |
| `npm test -- --reporter=dot` (log: `$RUN_DIR/logs/verify-2.log`) | 0 | 4 files, 42 tests passed |
| `npm run build` (log: `$RUN_DIR/logs/verify-3.log`) | 0 | build succeeded |

`git diff --stat` against the base for `src/list.ts`: 1 file, 6 insertions, 0 deletions (`diff-size`: files 1, lines 6).

## Visible change

No. The change is a doc comment in `src/list.ts`; markup, styles, text and rendered data are untouched.

## Screenshots

Not applicable.

## Departures from spec

None.

## Revert check

Skipped: no test files changed between the base and HEAD (the change adds a comment only, so no test was added).

## Diff risk

None.

## Self-review

### Standards

CLAUDE.md asks for small changes, with pure logic in `src/list.ts`; the change is one 6-line comment there. The comment is in the same plain style as the rest of the repo, and nothing else is touched. No findings.

### Spec

- AC1: met. The JSDoc names the format (day of the month, short month name, four-digit year, separated by spaces, with the example `25 Sep 2026`) and the UTC reading.
- AC2: met. The last sentence says the month name follows `lang`, English by default (A1).
- AC3: met. `git diff` for `src/list.ts` shows 6 insertions, 0 deletions, all inside the new block.
- AC4: met. Outside `docs/pipeline/17/`, only `src/list.ts` changed.
- AC5: met. `npm test` exits 0 (42 tests), as do typecheck and build.
- Checked the comment against the code: the day is not zero-padded, which "the day of the month" doesn't contradict; the UTC accessors are used throughout. No scope creep.

### Confession

No tests were added, skipped or weakened. Nothing was suppressed or hardcoded, no exceptions were swallowed, and no `--no-verify` was used. Two pushes were blocked by the run guard because I put other commands in the same call; I split them and no hook was bypassed. The revert check was skipped (no tests changed), which fits a comment-only change.

### Classification

| # | Finding | Axis | Severity | Resolution |
|---|---|---|---|---|
| - | None | - | - | - |

### Rounds

0 fix rounds; nothing was left over.

## Known issues

None.

## Cost

Unknown.
