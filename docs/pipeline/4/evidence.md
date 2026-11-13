# Evidence — 4

## Commands

| Command | Exit | Last lines |
|---|---|---|
| `npm run typecheck` (log: `$RUN_DIR/logs/verify-1.log`) | 0 | clean |
| `npm test -- --reporter=dot` (log: `$RUN_DIR/logs/verify-2.log`) | 0 | 4 files, 32 tests passed |
| `npm run build` (log: `$RUN_DIR/logs/verify-3.log`) | 0 | built in 135ms |
| Browser check: headless Chrome driven over the DevTools protocol by a script kept outside the repo (log: `$RUN_DIR/logs/verify-cdp.log`, results: `$RUN_DIR/cdp-results.json`) | 0 | see Screenshots |

## Visible change

Yes. The page gets a language switcher in a new header, and the heading, placeholders, add button, empty state, "by", Remove button and dates all change with the language.

## Screenshots

- `screenshots/1-default-english.png` — fresh browser with an English locale and no stored choice: English page, English button pressed — AC1, AC5, AC8.
- `screenshots/2-browser-es-default-empty.png` — fresh browser reporting `es-ES`, nothing stored: Spanish page, "No hay libros.", "Español" pressed, `<html lang="es">`, document title "Lista de lectura" — AC3, AC5, AC8, AC9.
- `screenshots/3-spanish-with-book.png` — Spanish with one book: "Lista de lectura (1)", "Título" and "Autor" placeholders, "Añadir", "de" between title and author, date "13 nov 2026", "Quitar" — AC2, AC4.
- `screenshots/4-switched-to-english.png` — the same page after clicking "English": all text back in English, the book and its date kept ("13 Nov 2026") — AC6.

What the browser script observed (also in `$RUN_DIR/cdp-results.json`):

- Browser locale `es-ES`, nothing stored: Spanish, "Español" `aria-pressed=true`, "English" `aria-pressed=false`, nothing stored yet (AC8, AC5).
- Text typed in the title field and a click on "English": every text switched, the typed text `half typed` stayed in the field, and `reading-list.lang` became `en` (AC6, AC7).
- Reload with `es-ES` still reported and `en` stored: the page stays English, so the stored choice wins over the browser language (AC7, AC8).
- Click on "Español", then reload: Spanish, `<html lang="es">`, title "Lista de lectura", "Cien años de soledad de Gabriel García Márquez 13 nov 2026 Quitar" (AC4, AC7, AC9).
- The books were still under their own key throughout; the language never touched them (AC7).

Not exercised in a browser: storage that throws (covered by a unit test, AC10) and markup in a title (covered by a unit test, AC11).

## Departures from spec

- The switcher is inside the header next to the heading in the markup (A2), but with no CSS change (A7) it renders on its own line under the heading, not beside it (see screenshot 3). The spec's assumption A7 chose default styling, so this follows it; styling the header would be a follow-up.

## Revert check

Test file `src/i18n.test.ts` run against the base's source: exit code 1, `failed` true (it cannot import `./i18n`). The tests fail without the change, as they should. Log: `$RUN_DIR/revert.json`.

## Diff risk

Not run yet (stage 8).

## Self-review

### Standards

### Spec

### Confession

### Classification

| # | Finding | Axis | Severity | Resolution |
|---|---|---|---|---|

### Rounds

## Known issues

None.

## Cost

Unknown.
