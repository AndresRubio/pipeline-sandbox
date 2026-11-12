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

AC5 says "Checked by running the app, adding a book and reading the date." It was not checked that way (see Screenshots). It was checked at the render level instead; see Self-review, Spec.

## Revert check

`src/list.test.ts` from HEAD run against the base's source: exit code 1, failed = true, as it should. The three new `formatAdded` tests fail on the base (`25 Oct 2026`, `3 undefined 2026`, `15 Feb 2026`) and pass with the change.

## Diff risk

None.

## Self-review

The `mattpocock-skills:code-review` and confession-box skills are not installed in this session, so Claude reviewed the 18-line diff itself and listed the confession items directly. This is Claude checking its own work, not the merge gate.

### Standards

CLAUDE.md asks for small changes, pure logic in `src/list.ts` and `src/render.ts` with unit tests, and `src/main.ts` only wiring the DOM. The change is one expression in `src/list.ts` plus tests in `src/list.test.ts`; `src/main.ts`, `src/render.ts` and the protected `src/storage.ts` are untouched. Size is 2 files, 18 lines (limits 6 and 250). The new tests follow the existing style (vitest, `Z`-suffixed ISO strings, no timezone dependence). Nothing breaks a documented standard.

### Spec

- AC1 to AC3: met. Three unit tests give `25 Sep 2026`, `3 Dec 2026` and `15 Jan 2026`; they fail on the base and pass with the change (revert check).
- AC4: met. The tests above are in `src/list.test.ts` and pass (8 of 8).
- AC5 (date shown in the running app): partly met. Not confirmed by a screenshot or a click-through of the form. As a substitute, `renderList` was run on items added on the three acceptance dates and its HTML contains `25 Sep 2026`, `3 Dec 2026` and `15 Jan 2026` in the `added` span (a throwaway script run through `vite-node`, since deleted; log `$RUN_DIR/logs/review-render-check.log`). That covers `formatAdded` and `renderList` but not the form submit and DOM update in `src/main.ts`, which this diff does not touch.
- No scope creep: no format, locale or timezone change.

### Confession

No test is skipped or weakened, no assertion removed, no error or type check suppressed, no value hardcoded to pass a test, no exception swallowed, no `--no-verify`. The test command was scoped with `--dir src --exclude '.issue-pipeline-plugin/**'` to get past the runner's untracked plugin checkout; this changes which files run, not what the repo's tests assert, and it is disclosed under Commands and in progress.md. One duplicate `lock` comment was posted at stage 0. A scratch script was created and deleted during review and never committed.

### Classification

| # | Finding | Axis | Severity | Resolution |
|---|---|---|---|---|
| 1 | AC5 not confirmed in the running app (no browser tool; preview start was denied permission). The spec's own AC5 wording says "checked by running the app". | Spec | Important | Partly mitigated: render path checked via `vite-node`. The running-app check is left to a human. Rated Important rather than Critical because AC5 is Claude's addition to the spec, the issue's own criteria (AC1 to AC4) are fully met, and the unchecked part is unchanged wiring. A reviewer may re-rate it. |

### Rounds

1 round. Round 1 found finding 1 and mitigated it as described. No code change followed, so no further round was needed. Critical findings left: none.

## Known issues

- AC5: the corrected date has not been seen in the running app. Open the preview, add a book and read the date next to it; it should show the current month in `<day> <Mon> <year>` form.

## Cost

Unknown.
