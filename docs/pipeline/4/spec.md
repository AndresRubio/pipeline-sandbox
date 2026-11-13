<!-- Adapted from mattpocock/skills (MIT License, Copyright (c) 2026 Matt Pocock): the to-spec template. -->
# Spec — 4: Make the whole app bilingual (English and Spanish)

**Source:** https://github.com/AndresRubio/pipeline-sandbox/issues/4

## Problem Statement

Everything the reading list shows is in English only. A Spanish-speaking user cannot read the heading, the form, the empty state, the "by" and Remove text on each book, or the dates, and cannot choose another language.

## Solution

The app is available in English and Spanish. A language switcher in the header lets the user pick either language; the choice is remembered between visits. On a first visit the app uses the browser's language. Every piece of text the app shows (heading, form placeholders and button, empty state, "by", Remove, dates with month names) changes with the language.

## User Stories

1. As a Spanish speaker, I want the whole app in Spanish, so that I can use it in my own language.
2. As a user, I want a language switcher in the header, so that I can change language at any time.
3. As a returning user, I want the app to remember my language, so that I don't have to choose it on every visit.
4. As a first-time user, I want the app to start in my browser's language, so that it is readable straight away.
5. As a user, I want the books I added and the text I am typing to stay as they are when I switch language, so that switching is harmless.

## Acceptance Criteria

1. AC1. In English the app shows exactly the text it shows today. Checked by the existing English tests (render, list, title) passing unchanged.
2. AC2. In Spanish the heading reads "Lista de lectura" (with the book count appended in the same format as English, for example "Lista de lectura (2)"), the placeholders read "Título" and "Autor", the add button reads "Añadir", each book shows "de" between title and author, and each Remove button reads "Quitar". Checked by unit tests on the render functions and the dictionary.
3. AC3. In Spanish the empty state reads "No hay libros.". Checked by a unit test on the render function with an empty list.
4. AC4. Dates are shown with the language's month abbreviations: English as today, Spanish as `D mon YYYY` with ene, feb, mar, abr, may, jun, jul, ago, sep, oct, nov, dic (for example "25 sep 2026", no "de", no period). Checked by a unit test for every month in both languages.
5. AC5. The header contains a language switcher with two buttons labelled "English" and "Español" (the same labels in both languages); the button of the active language has `aria-pressed="true"` and the other `aria-pressed="false"`. Checked in the running app and by a screenshot.
6. AC6. Clicking a switcher button changes all visible text (heading, placeholders, add button, empty state or list text, dates, Remove buttons) immediately without a reload, and keeps the books and any text typed in the form. Checked in the running app with a screenshot of each language.
7. AC7. The chosen language is remembered under its own storage key, separate from the books' key, so the books' stored data and the existing storage module are unchanged. Reloading the page keeps the chosen language. Checked by unit tests for load and save and by reloading the running app.
8. AC8. With nothing stored, the language is Spanish when the browser language starts with "es" (any case) and English otherwise; a stored valid choice wins over the browser language; an unknown stored value is ignored. Checked by unit tests on the language resolution.
9. AC9. The page's `lang` attribute and the document title follow the chosen language at runtime; the static page title in the HTML stays "Reading list". Checked in the running app and by the existing title test passing.
10. AC10. Saving or reading the language never breaks the app when browser storage is unavailable. Checked by a unit test with a storage that throws.
11. AC11. User-supplied text (title, author) is still escaped when rendered in either language. Checked by the existing escaping test passing and a Spanish render test with markup in a title.
12. AC12. `npm run typecheck`, `npm test` and `npm run build` pass.

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

## Implementation Decisions

- A new pure language module holds the language type (`'en' | 'es'`), one dictionary of texts per language (heading, placeholders, add button, empty state, "by", Remove, document title) including each language's month abbreviations, a function that resolves the language from a stored value and the browser language, and load and save functions over a storage object that tolerate failures.
- The date formatter and the render functions (list rendering and heading) take an optional language argument that defaults to English, so existing callers and tests keep working.
- The page markup puts the heading and the two switcher buttons in a header; the wiring code reads the language at start, applies it to the static text and the page's `lang` and title, re-renders the list when it changes, and saves the choice on each click.
- Switching language only changes text attributes of the form controls; it never rebuilds the form, so typed text survives.
- The language value is never put into HTML as text; it is validated against the two known languages first.

## Testing Decisions

- Test external behaviour of pure functions: language resolution, load and save with a fake storage (including one that throws), every Spanish string, every month in both languages, the heading, the empty state and the escaping, all in one new test file next to the new module. Prior art: `src/render.test.ts` and `src/list.test.ts`, which test pure functions with plain assertions.
- The DOM wiring has no unit tests (per CLAUDE.md, `src/main.ts` only wires the DOM); it is checked by running the app and by screenshots in both languages.

## Out of Scope

- Languages other than English and Spanish.
- Translating the static page `<title>` and meta description, and the "title and author are required" error message.
- Any CSS change or restyling of the header.
- Changing how books are stored, sorted or validated.

## Further Notes

None.
