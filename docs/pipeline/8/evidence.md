# Evidence — 8

## Commands

| Command | Log | Exit |
|---|---|---|
| `npm run typecheck` | `$RUN_DIR/logs/verify-1.log` | 0 |
| `npm test -- --reporter=dot` | `$RUN_DIR/logs/verify-2.log` | 0 |
| `npm run build` | `$RUN_DIR/logs/verify-3.log` | 0 |

After the build, `dist/index.html` contains `<title>Reading list</title>` (AC1).

## Visible change

Yes. The text of the browser tab changes from `Readng List` to `Reading list`.

## Screenshots

- `screenshots/1-reading-list-page.png` — the app page served by the preview command at 1280x800 — shows the unchanged `Reading list` heading and form; AC2 (nothing else on the page changed). It does not show the browser tab, so it cannot demonstrate AC1; AC1 is shown by the passing `src/title.test.ts` and the built `dist/index.html` title above.

Visual check needed: the tab text itself is not visible in a viewport screenshot.

## Departures from spec

None.

## Revert check

Ran `npm test` with the test files from HEAD against the base's source. Test file: `src/title.test.ts`. Exit code 1, `failed` true: the new test fails against the base with `expected 'Readng List' to be 'Reading list'`, as it should.

## Diff risk

Not run yet (stage 8).

## Self-review

Not run yet (stage 8).

## Known issues

None so far.

## Cost

Unknown.
