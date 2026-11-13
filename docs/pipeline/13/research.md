# Research — #13 Add a meta description to the page

## Relevant code

- `index.html:3-7` — the `<head>`: charset, viewport, `<title>Reading list</title>`. No `<meta name="description">` exists. The new tag goes in the `<head>`.
- `src/title.test.ts:1-9` — an existing test that imports `../index.html?raw` and asserts on the `<title>` with a regex. A description test follows the same pattern.

## Existing tests and seams

- `src/title.test.ts` already loads `index.html` as a raw string; a new `it(...)` in the same `describe('index.html')` block can assert there is exactly one `<meta name="description" content="A small reading list.">`.
- No other test touches `index.html`.

## Proposed change

- `index.html`: add one line `<meta name="description" content="A small reading list." />` in `<head>`, after `<title>`, matching the file's existing self-closing meta style. Nothing else changes.
- `src/title.test.ts`: add one test counting the matching tags (exactly one).
- Estimate: 2 files, ~8 lines, 2 plan tasks (or 1).

## Risks

- Data model or schema: none.
- Public API: none.
- Auth or security: none.
- New dependencies: none.
- `.github/workflows`: untouched.
- Protected paths (`src/storage.ts`): untouched.
- User-visible beyond the issue: none. The description is invisible in the page; it shows only in the document head and to search engines.

## In-flight overlap

No runs are ahead of this one (`ahead` is empty).

## Context

| # | Reference | Kind | Found in | Result | Used for |
|---|---|---|---|---|---|
| - | none | - | - | no references found | - |
