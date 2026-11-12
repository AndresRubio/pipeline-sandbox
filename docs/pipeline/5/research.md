# Research — issue #5: Friendlier empty state

## Relevant code

- `src/render.ts:9-10` — `renderList(items)` is the only place the empty state is produced: `if (items.length === 0) return '<p class="empty">No items.</p>';`. Pure function returning an HTML string. This is the line to change (text only; the `class="empty"` hook already exists).
- `src/render.ts:11-19` — the non-empty branch returns `<ul class="items">…</ul>`. It never emits the `.empty` element, so "message not shown with at least one item" already holds structurally.
- `src/main.ts:54-57` — `refresh()` sets `listEl.innerHTML = renderList(items)` on `#list`, and runs on load (`src/main.ts:80`), after add (`:69`) and after remove (`:76`). Removing the last item therefore re-renders the empty message with no extra wiring. `main.ts` needs no change.
- `index.html:91-96` — `<main>` contains `<h1>`, `<form id="add-form">`, then `<div id="list">`. The empty message is rendered inside `#list`, directly below the form, within `main`.
- `src/style.css:2` — `main { max-width: 40rem; }`; `src/style.css:3` — `form { display: flex; gap: 0.5rem; margin-bottom: 1rem; }`. The form is a block-level flex container filling `main`'s width, so centring text across `main`'s width centres it under the form.
- `src/style.css:6` — `.added { color: #777; font-size: 0.9em; }` is the existing muted colour in the app. There is NO rule for `.empty` today (grep: `empty` appears only in `src/render.ts:10`), which is why the message sits at the left edge.
- `src/storage.ts` — persistence only; protected path in `.claude/pipeline.json` (`protectedPaths`). Not relevant and not to be touched.

## Existing tests and seams

- `src/render.test.ts:5-7` — `it('shows the empty state', …)` asserts `renderList([])` `toContain('No items.')`. This test pins the old copy and must be updated to the new text.
- `src/render.test.ts:9-12` (escaping) and `:14-17` (author italics) cover the non-empty branch only; none asserts the absence of the empty message.
- Seam: `renderList()` returns a string, so both acceptance criteria about content are unit-testable in `src/render.test.ts`: (a) empty -> contains exactly the new sentence (with the em dash, U+2014) inside `class="empty"`; (b) with one item -> `not.toContain('empty')`/the sentence. A new test for (b) goes in the same `describe('renderList')` block.
- Centring and muted colour are CSS only (`src/style.css`); there is no CSS test harness. They are verifiable by a screenshot of the empty page (list is empty on a fresh load, so the empty state is visible by URL) and optionally by reading the rule.
- Commands: `npm test`, `npm run typecheck`, `npm run build`.

## Proposed change

Small, about 2 source files plus 1 test file, roughly 10 lines total.

1. `src/render.ts:10` — change the string to `'<p class="empty">Your reading list is empty — add your first book above.</p>'` (literal em dash; no HTML escaping needed, no user data involved).
2. `src/style.css` — add one rule, e.g. `.empty { text-align: center; color: #777; }` (reuse the existing muted grey from `.added`; `#777` on white is about 4.5:1 contrast, the same as the rest of the app). Optionally a little top margin for spacing; keep it minimal.
3. `src/render.test.ts` — update `:5-7` to expect the new exact sentence, and add a test that a non-empty list does not contain it (and has no `class="empty"`).

Plan tasks: (1) update tests first (red), (2) change the copy in `render.ts`, (3) add the `.empty` CSS rule, (4) run test/typecheck/build and take a screenshot of the empty page for the centred, muted message. Well within `maxPrSize` (6 files / 250 lines).

## Risks

- Data model/schema: none. No change to `Item`, `list.ts`, or the localStorage format.
- Public API: `renderList(items): string` signature unchanged; only the returned string for the empty case changes. Any consumer asserting `No items.` (only `src/render.test.ts:6`) must be updated.
- Auth/security: none. Static string, no user input; the existing `escapeHtml` path is untouched.
- Dependencies: none added.
- `.github/workflows`: not touched.
- Protected path: `src/storage.ts` must not be touched; the change does not need it.
- User-visible beyond the issue: only the `.empty` rule, which affects no other element (the class is used only by this message). Do not alter `.items`, `.added`, `form` or `main` rules. Em dash is a non-ASCII character in a TS source file and a test; the files are UTF-8, and `index.html` declares `charset="UTF-8"`, so this is safe. Match the issue's exact punctuation (em dash U+2014, final period).
- Screenshot caveat: AC "with at least one item, the message is not shown" cannot be shown by URL alone (items need the form), so it is covered by the unit test.

## In-flight overlap

Run "2" (issue #2, PR #28, "Sort the reading list alphabetically by title"): **none**.

Evidence:
- Run 2 changes `src/render.ts` at the import line (`@@ -1,4 +1,4 @@`) and at `@@ -8,7 +8,7 @@` replaces only `const rows = items` with `const rows = sortByTitle(items)` (line 11 here). The empty-state line (`src/render.ts:10`) appears in that hunk only as unchanged context. Our change (the string on line 10) is a different statement from the sort change in the non-empty branch.
- Run 2 adds `sortByTitle` to `src/list.ts` (`@@ -18,6 +18,10 @@`), and adds tests to `src/list.test.ts` and a new `describe('order')` in `src/render.test.ts` (`@@ -11,6 +11,45 @@`, after the escaping test). It does not touch `src/main.ts`, `index.html`, or `src/style.css`, and does not edit the empty-state test at `src/render.test.ts:5-7`.
- Our change does not need `sortByTitle` (not builds-on), does not change the same function body logic (the non-empty branch vs the early-return branch; not same-code), and depends on no shared API shape or data format (not same-decision).
- Mechanical note only: line 10 (ours) and line 11 (theirs) are adjacent lines in `src/render.ts`, so whichever PR lands second may need a trivial textual rebase of that hunk. That is a shared-file/merge matter, not an overlap of code or decision.

## Context

No external context fetched.
