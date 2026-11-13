# Research for #17

## Relevant code

- `src/list.ts:25-28` — `formatAdded(iso: string, lang: Lang = 'en'): string`. Builds `` `${getUTCDate()} ${STRINGS[lang].months[getUTCMonth()]} ${getUTCFullYear()}` ``: day of month (no zero padding), short month name, four-digit year, space-separated, all read through the `getUTC*` accessors.
- The issue's permalink (`72d6aeb`, lines 21-24) is stale. At that commit the function had one parameter and read a module-level `MONTHS` array (with the #1 off-by-one). Since #35 (bilingual app) it takes `lang` and reads `STRINGS[lang].months` (`src/i18n.ts:23` English `Jan`..`Dec`, `src/i18n.ts:33` Spanish `ene`..`dic`). The function is now at lines 25-28, so the comment goes above line 25.
- `src/render.ts:17` is the only non-test caller (`formatAdded(item.addedAt, lang)`).

## Existing tests and seams

- `src/list.test.ts:50-60` covers English output (`25 Sep 2026`, `3 Dec 2026`, `15 Jan 2026`).
- `src/i18n.test.ts:87-94` covers every month in `en` and `es` and the default language.
- No new test is needed: the change is a comment and the issue says to change no code.

## Proposed change

- Add one JSDoc block immediately above `export function formatAdded` in `src/list.ts` (about 6-8 lines added, 1 file, 1 plan task).
- Wording: the day of the month, the short month name and the four-digit year, separated by spaces (e.g. `25 Sep 2026`), read in UTC. Because `lang` now exists, the comment also says the month name is in the given language (English by default) so it isn't wrong for the current signature.
- No existing line is modified.

## Risks

- Data model / schema: none.
- Public API: none; signature and behaviour are unchanged.
- Auth / security: none.
- New dependencies: none.
- `.github/workflows`: untouched.
- Beyond the issue: the stale permalink means the issue describes the pre-#35 function. Mentioning `lang` in the JSDoc is the only departure from the issue's wording, and it is needed for accuracy. It touches no code.
- `src/storage.ts` (protected path) is not involved.

## In-flight overlap

`ahead` is empty: no other run is in progress, so there is nothing to compare.

## Context

| # | Reference | Kind | Found in | Result | Used for |
|---|---|---|---|---|---|
| 1 | `#1` | issue | body | fetched: `01-issue-1.md` | Relevant code (history of the month bug), Existing tests |
| 2 | permalink `72d6aeb…/src/list.ts#L21-L24` | permalink | body | fetched: `02-permalink-list.ts-21-24.md` | Relevant code (stale lines) |
| 3 | actions run `42252762039` | run | body | fetched: `03-run-42252762039.md` | - (CI green, nothing to act on) |
