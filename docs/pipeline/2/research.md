# Research: issue #2 - Sort the reading list alphabetically by title

## Relevant code

- `src/list.ts:1-6` - `Item` has `id`, `title`, `author`, `addedAt`. Items are identified by `id` (a UUID), not by array index.
- `src/list.ts:10-15` - `addItem` appends to the end (`[...items, newItem]`), so stored order is insertion order.
- `src/list.ts:17-19` - `removeItem` filters by `id`.
- `src/render.ts:9-20` - `renderList(items)` maps `items` in the given order to `<li>` rows. Each Remove button carries `data-id` (the item id, `render.ts:16`). No index is used.
- `src/main.ts:6` - `items` is loaded from storage. `main.ts:10-13` - `refresh()` renders `items` and then saves the same `items` array. This is the coupling to watch: render input and save input are the same array.
- `src/main.ts:15-26` - the submit handler calls `addItem`, then `refresh()`.
- `src/main.ts:28-34` - the click handler removes by `target.dataset.id`, so it is independent of display order.
- `src/storage.ts:5-18` - `load`/`save` serialise the array as-is under key `reading-list.v1`. It is a protected path (`.claude/pipeline.json`) and needs no change.
- `package.json` - scripts: `test` (vitest run), `typecheck`, `build`.

## Existing tests and seams

- `src/list.test.ts` covers `addItem`, `removeItem` and `formatAdded`.
- `src/render.test.ts` covers the empty state, title escaping and author italics. It only calls `renderList` with 0 or 1 items, so there is no ordering coverage today.
- `src/title.test.ts` checks the `index.html` page title (unrelated).
- Seam: `renderList(items)` is pure and tested, and `src/list.ts` holds the pure item logic. CLAUDE.md says logic lives in `list.ts`/`render.ts` and `main.ts` only wires the DOM.
- New tests:
  - Add tests for a new pure `sortByTitle` in `src/list.test.ts`. Cases: alphabetical order; equal titles keep input order; the input array is not mutated.
  - Add one test in `src/render.test.ts` showing `renderList` outputs rows in title order and that Remove `data-id`s still match the right items.

## Proposed change

Sort at display time only, in a pure function, and leave `items` and storage untouched.

1. `src/list.ts` (about +6 lines): add `export function sortByTitle(items: Item[]): Item[] { return [...items].sort((a, b) => compare(a.title, b.title)); }`. It copies first so the stored array is never mutated. `Array.prototype.sort` is stable (ES2019+), so equal titles keep their input order, which is added order because the stored array is insertion-ordered.
2. Where to call it, either:
   - (a) inside `renderList` in `src/render.ts` (`sortByTitle(items).map(...)`, about 1-2 lines), which also covers any future caller; or
   - (b) in `main.ts` `refresh()` as `renderList(sortByTitle(items))` while `save(localStorage, items)` keeps the unsorted array.
   Option (a) is preferred. It keeps `main.ts` as pure wiring, and the render test can assert the order. Either way `save` must still receive the original `items`.
3. Tests: about +20-25 lines across `src/list.test.ts` and `src/render.test.ts`.
4. Estimate: 3 files (`list.ts`, `render.ts`, plus the two test files, so 4 counting both tests), about 35-40 lines, well under the 6-file / 250-line cap. Plan tasks: (1) add `sortByTitle` with unit tests; (2) apply it in `renderList` with a render test; (3) run `npm test`, `npm run typecheck`, `npm run build`.

Index-vs-displayed-order hazard: checked and not present. Remove uses `data-id` and `removeItem` filters by id (`render.ts:16`, `main.ts:30-31`, `list.ts:17-19`). No code in `src/` uses array indices as identifiers, so displaying a different order cannot make Remove hit the wrong item. A render test with out-of-order input should pin this. Any future index-based edit or toggle would need to resolve by id.

Title comparison (assumption, flag for the issue author): the issue does not say case or locale handling. The simplest sensible choice is a case-insensitive locale compare, `a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })`. Plain `<` would put "apple" after "Zebra". `sensitivity: 'base'` also treats "Dune" and "dune" as equal, so those fall back to stable added order. Alternative: `localeCompare` with default sensitivity. This is an assumption. Not handled: leading articles ("The ...") are not stripped, and numeric collation is off.

## Risks

- Data model/schema: none. The `Item` shape and the `reading-list.v1` key are unchanged.
- Public API: none. `sortByTitle` is a new internal export. `renderList` keeps its signature.
- Auth/security: none. Titles are still escaped by `escapeHtml`.
- New dependencies: none (`localeCompare` is built in).
- `.github/workflows`: untouched.
- Protected path `src/storage.ts`: not touched. This is the intended design: sorting only for display satisfies "saved order stays as it is". Do not sort inside `refresh()` before `save`, and do not mutate `items` in place.
- User-visible beyond the issue: a newly added item will appear at its alphabetical position, not at the bottom. This follows from the request but may surprise users. `localeCompare` results can vary slightly by runtime locale. Tests should use unambiguous ASCII titles to avoid flakiness.
- Remove maps to the correct item because it uses ids (see above).

## In-flight overlap

none: no runs ahead of this one

## Context

No external context was fetched.

| Source | Status | Used for |
| --- | --- | --- |
| - | - | - |
