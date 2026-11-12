# Research: issue #9, show the number of books in the heading

## Relevant code
- `index.html:10` holds the heading today: static `<h1>Reading list</h1>`. Nothing in TS touches it.
- `index.html:6` is `<title>Reading list</title>` (the tab title, separate from the h1).
- `src/main.ts:26` loads `items`; `src/main.ts:30-33` `refresh()` is the single place that re-renders after any change (called at `:45` add, `:52` remove, `:56` initial load). It is the natural hook to update the heading, so the count stays correct on add, remove and load.
- `src/main.ts:27-28` DOM lookups (`#list`, `#add-form`); a heading lookup would go here.
- `src/list.ts:1-6` `Item`; `:10-14` `addItem`; `:16-18` `removeItem`. The count is just `items.length`; no data model change.
- `src/render.ts:9-20` `renderList(items)` renders only the list body (`#list`), not the heading.
- `src/storage.ts` (protected, not touched): persistence only.

## Existing tests and seams
- `src/title.test.ts:5-8` reads `index.html?raw` and asserts only the `<title>` text is "Reading list". It does not look at the h1, so it stays green and must stay so (document title is not changed).
- `src/render.test.ts` and `src/list.test.ts` cover the pure logic (empty state, escaping, add/remove, formatAdded).
- No test covers `main.ts` (DOM wiring only, per CLAUDE.md).
- Seam for a new test: add a small pure function (e.g. `formatHeading(count: number): string` returning `Reading list (N)`) in `src/render.ts` (or `src/list.ts`) with unit tests in `src/render.test.ts` for 0, 1 and many. Optionally extend `src/title.test.ts` pattern with an h1 check that the static fallback in `index.html` is still `Reading list`.

## Proposed change
- `src/render.ts` (+~3 lines): export `renderHeading(count)` / `formatHeading(count)` returning `` `Reading list (${count})` ``.
- `src/main.ts` (+~3 lines): `const headingEl = document.querySelector<HTMLHeadingElement>('h1')!;` (or give the h1 an id in `index.html`, +1 line changed), and in `refresh()` set `headingEl.textContent = formatHeading(items.length)`. Use `textContent`, not innerHTML.
- `src/render.test.ts` (+~8 lines): tests for 0, 1, N.
- Leave `index.html` h1 text as `Reading list` (pre-JS fallback; shows "(0)" only after JS runs, so a stored list shows the right count on first refresh at `main.ts:56`).
- Total: ~3 files, ~15-20 lines. Plan tasks: (1) pure formatter plus unit tests; (2) wire in `refresh()`; (3) run `npm test`, `npm run typecheck`, `npm run build`, and check in the dev server that add/remove updates the count.
- Decision: show "(0)" for an empty list, since the issue says N is the number of items.

## Risks
- Data model/schema: none; count derived from `items.length`. localStorage format untouched; `src/storage.ts` not modified.
- Public API: new exported helper only; no signature changes.
- Auth/security: none. Use `textContent` for the heading; count is a number so no escaping concern.
- Dependencies: none. `.github/workflows`: none.
- Heading text lives in HTML (`index.html:10`), not TS, today. The change moves ownership of the visible text to TS at runtime; the HTML stays as a no-JS fallback.
- `src/title.test.ts` relates only to `<title>` in `index.html:6`; it does not check the h1. Changing `<title>` to include the count would break it and is not asked for by the issue, so `document.title` stays "Reading list" (the issue says "heading").
- Accessibility: the h1 text changes dynamically but is not a live region; screen readers will not announce updates, which is acceptable for a heading (a `aria-live` is not requested and would be noisy). Heading remains an h1 with an accessible name "Reading list (N)".
- Anything user-visible beyond the issue: none intended. The count appears in the h1 only.

## In-flight overlap
- Run 2 (PR #28, sort by title): `none`. It changes `src/list.ts` (adds `sortByTitle`, diff hunk `@@ -18,6 +18,10 @@`) and `src/render.ts:1,11` (`renderList` sorts rows, hunk `@@ -8,7 +8,7 @@`) plus tests. This change adds a separate helper and a `refresh()` line in `src/main.ts:30-33`, which run 2 does not touch; the count does not depend on order. Shared files only (`render.ts`, `render.test.ts`), no same function. Minor textual merge adjacency in `render.ts` is possible if the helper is added near `renderList`; place it above it or in a different spot to avoid conflicts.
- Run 5 (PR #29, empty state): `none`. It changes the string in `src/render.ts:10` (`renderList` empty branch, hunk `@@ -7,7 +7,7 @@`), `src/render.test.ts` and `src/style.css` (`.empty`). This change does not alter `renderList` or the empty-state text; heading is separate from the list body. Shared file only.

## Context
No external context fetched.
