# Research — #4 Make the whole app bilingual (English and Spanish)

## Relevant code

All user-visible text is hard-coded English in four places:

- `index.html:2` `<html lang="en">`; `index.html:6` `<title>Reading list</title>`; `index.html:7` meta description "A small reading list."; `index.html:11` `<h1>Reading list</h1>`; `index.html:13-15` placeholders "Title"/"Author" and the "Add" button. The `<h1>` and form strings are static markup, not rendered from code, so they need a DOM-wiring step to be translated.
- `src/render.ts:10` empty-state text ("Your reading list is empty — add your first book above."). Note the issue's table gives "No items." / "No hay libros." for the empty state, but the current text is longer (changed by #5). Needs a decision, see Risks.
- `src/render.ts:14` the literal ` by ` between title and author; `src/render.ts:16` the "Remove" button label.
- `src/render.ts:22-24` `formatHeading(count)` returns `Reading list (${count})`.
- `src/render.ts:15` calls `formatAdded` from `src/list.ts`.
- `src/list.ts:8` `MONTHS` (English abbreviations) and `src/list.ts:25-28` `formatAdded(iso)`, format `D Mon YYYY` using UTC getters.
- `src/main.ts:6-15` `refresh()` sets the heading with `formatHeading` and the list with `renderList`; it is the only place to wire a language switcher, set `document.documentElement.lang`, and re-render on change. `src/main.ts:8` selects `h1` by tag; if the switcher lives in a header with its own elements, this selector must stay unambiguous (use an id or keep the switcher outside the `h1`).
- `src/storage.ts:3` `KEY = 'reading-list.v1'`; protected path. Not to be touched (A3: language goes under `reading-list.lang`). The language preference needs its own small load/save, e.g. in the new `src/i18n.ts`, taking a `Storage` argument like `load`/`save` do.
- `src/style.css` has no header/switcher styles (8 lines); a few lines needed for the header layout and pressed state.
- Not translated by the issue but related: `<title>` and meta description are pinned by `src/title.test.ts:6-14` to the English strings. The issue lists "the heading, form placeholders and button, the empty state, by, Remove, dates", not the page title or meta description, so leave them English.

## Existing tests and seams

- `src/render.test.ts` covers `formatHeading` (lines 4-16) and `renderList` (empty state at line 19-21, escaping, order, remove-button pairing, italics author at 74-77) with exact-string assertions on English output. These must keep passing, so new parameters should default to English (`lang = 'en'`), or the tests are updated in the same PR.
- `src/list.test.ts:50-62` covers `formatAdded` for Sep, Dec, Jan in English (`'25 Sep 2026'`); same default-`'en'` approach keeps them green.
- `src/title.test.ts` reads `index.html?raw` and asserts title and meta description. It is the existing pattern for testing static HTML, so a new assertion could check the switcher markup and that `lang="en"` is the static default.
- No tests for `src/main.ts` or `src/storage.ts` (DOM wiring only, by project convention). No jsdom dependency; vitest runs in node, so `navigator` and `localStorage` must be injected as arguments (a fake `Storage` object with `getItem`/`setItem`, and a plain string for the browser language) to stay unit-testable.
- Where new tests go: `src/i18n.test.ts` (new) for the dictionary, `resolveLang(stored, browserLang)`, `loadLang`/`saveLang` with a fake Storage (including invalid stored value falling back, and `setItem` throwing); extra cases in `src/render.test.ts` for Spanish heading, empty state, "de", "Quitar"; extra cases in `src/list.test.ts` for Spanish months (`ene`...`dic`, all 12 via `it.each`).

## Proposed change

Design: a pure `src/i18n.ts` holds the type `Lang = 'en' | 'es'`, a `STRINGS` dictionary per language (heading, titlePlaceholder, authorPlaceholder, add, empty, by, remove, plus `months` arrays), `resolveLang(stored: string | null, browserLang: string | undefined): Lang` (A4: valid stored `en`/`es` wins, else `es` if `browserLang` lower-cased starts with `es`, else `en`), and `loadLang`/`saveLang(storage, lang)` using key `reading-list.lang` (wrapped in try/catch so a blocked or full storage does not break the app). `src/list.ts` and `src/render.ts` stay pure and take an optional `lang: Lang = 'en'` parameter.

Files and estimated lines (6 files max, 250 lines max):

| File | Change | Est. lines |
|---|---|---|
| `src/i18n.ts` (new) | `Lang`, dictionary, months, `resolveLang`, `loadLang`, `saveLang` | ~45 |
| `src/i18n.test.ts` (new) | dictionary completeness, resolveLang, load/save with fake Storage | ~50 |
| `src/list.ts` | `formatAdded(iso, lang = 'en')` reading months from i18n (replace `MONTHS` at line 8); Spanish output `D mon YYYY` (A1) | ~6 |
| `src/render.ts` | `renderList(items, lang = 'en')`, `formatHeading(count, lang = 'en')` use dictionary for empty/by/Remove/heading | ~12 |
| `src/main.ts` | read language at start, `applyLang()` sets `document.documentElement.lang`, placeholders, Add button text, switcher `aria-pressed`; click handler on switcher saves and calls `refresh()`; pass `lang` to render calls | ~25 |
| `index.html` | wrap `<h1>` in `<header>` with two buttons `English` / `Español` (`data-lang`, `type="button"`), ids/hooks for the form controls | ~8 |
| `src/style.css` | header flex layout, pressed-state style | ~4 |
| tests: `src/render.test.ts`, `src/list.test.ts` additions | Spanish cases | ~30 |

That is 9 files if counted separately, over the limit of 6. To stay within `maxPrSize` (6 files / 250 lines), plan options:

1. Put the Spanish cases for render and months in `src/i18n.test.ts` instead of editing `render.test.ts` and `list.test.ts` (it can import `renderList`, `formatHeading`, `formatAdded`). Then files are: `src/i18n.ts`, `src/i18n.test.ts`, `src/render.ts`, `src/list.ts`, `src/main.ts`, `index.html` = 6 files, ~150 lines. `style.css` is the seventh; to fit, either inline-free style by reusing existing styles (switcher as plain buttons, no CSS change; the header can use `display:flex` only if CSS changes) or move `formatAdded` months to a `months` lookup in i18n and leave `list.ts` untouched by having `render.ts` call a new `formatAddedLocalized` in `i18n.ts`... Simplest: skip `list.ts` edit by implementing localized month formatting in `i18n.ts` (`formatDate(iso, lang)`) and have `render.ts` use it for `es` and `formatAdded` for `en`. That is less clean (two date formatters). Preferred: edit `list.ts` and drop the `style.css` change (minimal styling via inline layout is not available), or merge CSS into the 6-file budget by dropping `index.html`'s need to change: have `main.ts` build the header. Recommended final set of 6: `src/i18n.ts`, `src/i18n.test.ts`, `src/list.ts`, `src/render.ts`, `src/main.ts`, `index.html` (switcher markup, with the heading wrapper), and no CSS change (buttons side by side with the heading using the default inline layout is acceptable, or wrap in one `<header style>`-free structure; if the owner wants styling, that is a follow-up).
2. If the grade/spec stage decides CSS is required, split into two PRs: PR 1 i18n core (`i18n.ts`, test, `list.ts`, `render.ts`), PR 2 UI (`main.ts`, `index.html`, `style.css`).

Plan tasks:
1. `src/i18n.ts` + `src/i18n.test.ts`: types, dictionary, `resolveLang`, `loadLang`/`saveLang` (tests first).
2. `src/list.ts` `formatAdded(iso, lang)` and `src/render.ts` `renderList`/`formatHeading` with `lang`; Spanish tests in `src/i18n.test.ts`; confirm existing English tests unchanged.
3. `index.html` + `src/main.ts`: switcher buttons, `applyLang`, persistence, `document.documentElement.lang`, re-render on switch (A2, A3, A4, A5).
4. Verify: `npm run typecheck`, `npm test`, `npm run build`, run dev server and check both languages, persistence after reload, and `navigator.language = es-*` default via a screenshot.

## Risks

- Data model / schema: none if `reading-list.v1` and `src/storage.ts` are untouched (A3). Stored `addedAt` is ISO and language-neutral, so dates re-render when the language changes. New key `reading-list.lang` is read defensively: an unknown value is ignored.
- Public API: `formatAdded`, `renderList`, `formatHeading` gain an optional trailing parameter with an English default; existing callers and tests stay valid.
- Auth/security: none. `renderList` builds HTML strings; dictionary strings are trusted constants, but user text must keep passing through `escapeHtml` (`src/render.ts:5`). Do not interpolate the stored language into HTML; validate it against `'en' | 'es'`.
- New dependencies: none; use hand-written dictionary and not `Intl`/an i18n library (the issue prescribes exact month abbreviations that `Intl` would format differently, e.g. "sept"/"ene.").
- `.github/workflows`: none.
- User-visible beyond the issue or ambiguous:
  - Empty-state text: the issue table says "No items." / "No hay libros." but the app now shows "Your reading list is empty — add your first book above." (#5). Recommend keeping the current English string and providing a Spanish equivalent, e.g. "Tu lista de lectura está vacía — añade tu primer libro arriba."; the spec stage should confirm, since the issue's Spanish table text contradicts the existing English. Existing test `src/render.test.ts:20` pins the current English text.
  - Heading count: `Reading list (N)` becomes `Lista de lectura (N)`.
  - `<title>` and meta description stay English (pinned by `src/title.test.ts`, not listed by the issue).
  - Input values already typed in the form should survive a language switch (only `placeholder` changes; do not rebuild the form).
  - Sorting still uses `localeCompare(..., undefined)` in `src/list.ts:22`; Spanish collation could differ slightly by browser locale, no change recommended.
  - Switcher labels are the same in both languages (A2); accessibility: buttons are in a labelled `<header>`/group and the active one has `aria-pressed="true"`.
  - Blocked `localStorage` (private mode) would throw in `main.ts:6` already for items; language load/save should still catch to avoid making this worse.
  - Spanish dates are `D mon YYYY` lowercase, no "de", no period (A1).

## In-flight overlap

Run 14 (PR #34, "Add countByAuthor to the list module (#14)"): classification `none`.

- Evidence: its source diff only appends `countByAuthor` after `formatAdded` in `src/list.ts` (hunk `@@ -26,3 +26,11 @@`, diff lines 522-535 of `inflight/14/pr.diff`) and adds an import plus a new `describe('countByAuthor')` block in `src/list.test.ts` (hunks `@@ -1,5 +1,5 @@` and `@@ -60,3 +60,35 @@`, diff lines 475-520).
- Here, this change edits `src/list.ts:8` (`MONTHS`) and `src/list.ts:25-28` (`formatAdded`) and does not touch the code that run adds. The two share `src/list.ts` and possibly `src/list.test.ts`, but that alone is `none`: no dependency (the new function is not used by the UI in that PR), no same-function edit, and no shared decision (author counting vs localisation). Adjacent hunks at the end of `src/list.ts` might need a trivial textual rebase, nothing semantic. docs/pipeline/** files are ignored.

## Context

No external references fetched.
