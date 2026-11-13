# Grade — 4

**Verdict:** `small-gaps`

## Why

- 9 assumption(s) to record

The owner accepted the earlier recommendations (A1 to A7) with `pipeline-go`; A8 and A9 are new and follow from the research. No missing values: every Spanish string and month abbreviation the change needs is in the issue.

## Checklist

| Criterion | Value |
|---|---|
| Estimated files | 6 (limit 6) |
| Estimated lines | 150 (limit 250) |
| Estimated plan tasks | 4 (limit 8) |
| Independent subsystems | no |
| Changes user-visible behaviour not in the issue | no |
| Changes data model, API, auth or dependencies | no |
| Acceptance criteria derivable | yes |
| Needs workflow changes | no |
| Waits for (runs ahead) | none (#14 overlaps only on the shared file src/list.ts: `none`) |
| Missing values | none |
| pipeline-go | yes |

## Decisions

- Q1 (accept the seven assumptions A1 to A7 as written?): the owner replied `pipeline-go`, which accepts the recommendation: accept all seven.

## Assumptions

A1. Assume the Spanish date format is `D mon YYYY` using the lowercase abbreviations from the issue (for example "25 sep 2026"), with no "de" and no trailing period.
A2. Assume the language switcher is two buttons labelled "English" and "Español" in a header next to the heading, the same in both languages, with the active one marked with aria-pressed.
A3. Assume the chosen language is stored under a separate localStorage key `reading-list.lang`, leaving `reading-list.v1`, the item format and src/storage.ts untouched.
A4. Assume the default language is Spanish when navigator.language starts with "es" and English otherwise, and that a valid stored choice wins over the browser language.
A5. Assume document.documentElement.lang and document.title follow the chosen language at runtime, while the static `<title>` in index.html stays "Reading list" (src/title.test.ts requires it).
A6. Assume the "title and author are required" error from addItem is not translated, because the HTML required attributes stop it from ever being shown.
A7. Assume no CSS change: the switcher uses default styling inside the header, and the new tests go in a single new src/i18n.test.ts, to stay within the 6-file limit.
A8. Assume the English empty state keeps the text the app shows today (from #5, pinned by src/render.test.ts) and the Spanish empty state is the issue's "No hay libros.", because the issue's "No items." row is stale for English.
A9. Assume the heading count keeps its format in both languages ("Reading list (N)" and "Lista de lectura (N)"), and that text already typed in the form survives a language switch because only the placeholders and button text change.

## Research summary

- A new pure module `src/i18n.ts` holds the strings, the two month tables and language load/save/resolve; `formatAdded`, `renderList` and `formatHeading` gain an optional `lang` parameter defaulting to `'en'`, so the existing English tests keep passing.
- `index.html` gets a header with the heading and the switcher; `src/main.ts` applies the language to the static text, persists it, and re-renders the list.
- The protected `src/storage.ts` is not touched: the language uses its own localStorage key.
- Main risk: the change is exactly at the 6-file limit, so it fits only without a CSS change and with the new tests in one new file. The run ahead (#14, `countByAuthor`) only shares `src/list.ts`, so there is no semantic overlap.
