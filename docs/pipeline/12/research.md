## Relevant code
- `src/render.ts:14` builds each row; the author is `<span class="author">${escapeHtml(item.author)}</span>`. This is the only place to change.
- `src/render.ts:5-7` `escapeHtml` already escapes & < > " '.
- `src/main.ts:11` only assigns `renderList(items)` to innerHTML; no change needed.
- `src/list.ts` (Item type, formatAdded) is untouched. No CSS selector on `.author` is involved (nothing else wraps it).

## Existing tests and seams
- `src/render.test.ts:4-13` has two tests (empty state, title escaping). The seam is `renderList()` returning a string.
- New test goes in this file: render an item with author `<i>&` and expect `<span class="author"><em>&lt;i&gt;&amp;</em></span>`.

## Proposed change
- `src/render.ts`: line 14 becomes `<span class="author"><em>${escapeHtml(item.author)}</em></span>` (1 line).
- `src/render.test.ts`: add 1 test (~6 lines), covering the `<em>` wrap and escaping.
- Plan: 2 tasks (change + test), 2 files, ~8 lines.

## Risks
- No data model, storage (`src/storage.ts` untouched), public API, auth or dependency change. No `.github/**` or `.claude/**` touched.
- User-visible: the author is italic only; escaping is preserved inside `<em>`. Nothing else in the row changes.

## In-flight overlap
- Run 1 (PR #21): `none`. It changes `formatAdded` in `src/list.ts` (diff hunk `@@ -20,5 +20,5 @@`) and `src/list.test.ts`. This change edits `src/render.ts:14`, which only calls `formatAdded`; its signature and output format are unchanged.
- Run 8 (PR #23): `none`. It changes the `<title>` in `index.html` and adds `src/title.test.ts`; no shared code or decision.

## Context
No external context was fetched.
