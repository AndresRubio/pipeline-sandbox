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

None.

## Self-review

Reviewed inline by the session model: the diff is 3 source files and 24 lines.

### Standards

- Pure logic (`formatHeading`) is in `src/render.ts` and unit-tested; `src/main.ts` only wires the DOM, as CLAUDE.md asks.
- No protected path (`src/storage.ts`, `.github/**`, `.claude/**`) is touched and no dependency is added.
- The heading is set with `textContent`, not markup.
- Baseline smell: the h1 is found with the bare selector `h1`. It is the only h1 on the page, so this works, and an id would be a larger edit to `index.html` than the issue needs.

### Spec

- AC1: met. Three unit tests on `formatHeading` and the h1 read in the running app.
- AC2, AC3: met. The h1 went 0 → 1 → 2 on add and 2 → 1 on remove without a reload.
- AC4: met. Reload with one stored item showed "Reading list (1)".
- AC5: met. Typecheck, tests (13) and build pass; the tab title test is unchanged and green.
- Assumptions A1 to A3 hold: empty shows "(0)", the tab title is unchanged, the static h1 is the fallback.
- No behaviour beyond the issue was added.

### Confession

No skipped or weakened test, suppressed error or type check, hardcoded value, swallowed exception or `--no-verify`. `diff-risk` found no hits. The revert check failed against the base, as it should.

Merge note, not a finding: open PRs #28 and #29 also edit `src/render.ts` and `src/render.test.ts`. The new function is at the end of `render.ts`, away from `renderList`, but the import line in `render.test.ts` may need a trivial merge.

### Classification

| # | Finding | Axis | Severity | Resolution |
|---|---|---|---|---|
| 1 | The h1 is looked up with the bare selector `h1` | Standards | Minor | Left as is: one h1 on the page |

### Rounds

0 fix rounds. No Critical or Important findings.

## Known issues

None.

## Cost

Unknown.
