# Evidence — 1

## Commands

Run fresh in the worktree after the last code commit. Logs are run-local paths and are not committed.

| Command | Exit | Log | Last lines |
|---|---|---|---|
| `npm run typecheck` | 0 | `$RUN_DIR/logs/verify-1.log` | no errors |
| `npx vitest run --dir src --exclude '.issue-pipeline-plugin/**' --reporter=dot` | 0 | `$RUN_DIR/logs/verify-2.log` | Test Files 2 passed (2); Tests 8 passed (8) |
| `npm run build` | 0 | `$RUN_DIR/logs/verify-3.log` | built in 119ms |

The test command is the repo's `npm test` scoped past the runner's untracked `.issue-pipeline-plugin/` checkout (see progress.md, Known issues). A plain `npm test` also runs that directory's own test files and fails (59 files), none of them this repo's.

## Visible change

Yes. The date shown next to every item in the list changes (`formatAdded`, used by `renderList`).

## Screenshots

Visual check needed: the date only appears after a book is added through the form, which needs typing and submitting (the list loads empty from `localStorage`), and this session has no browser tool. A URL screenshot would show only "No items." and would not demonstrate AC5. The preview was also not started: the command to start it was denied permission in this session, and no workaround was attempted. AC1 to AC4 are covered by unit tests; AC5 (the date in the running app) is not confirmed by a screenshot.

## Departures from spec

None.

## Revert check

`src/list.test.ts` from HEAD run against the base's source: exit code 1, failed = true, as it should. The three new `formatAdded` tests fail on the base (`25 Oct 2026`, `3 undefined 2026`, `15 Feb 2026`) and pass with the change.

## Diff risk

Not yet run (stage 8).

## Self-review

### Standards

### Spec

### Confession

### Classification

| # | Finding | Axis | Severity | Resolution |
|---|---|---|---|---|

### Rounds

Not yet run (stage 8).

## Known issues

None so far.

## Cost

Unknown.
