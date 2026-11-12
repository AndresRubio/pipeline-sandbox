## Relevant code
- `src/list.ts:23` `formatAdded(iso)` is the bug: `MONTHS[date.getUTCMonth() + 1]` is off by one. getUTCMonth() is already 0-based, so Sep shows Oct and Dec (index 11) gives MONTHS[12], which is undefined.
- `src/list.ts:8` `MONTHS` is a correct 12-entry array (Jan..Dec).
- `src/list.ts:14` `addItem` stores `addedAt: now.toISOString()`, a UTC ISO string. `formatAdded` reads it with UTC getters, so the stored value and the formatter agree on timezone. Timezone is not the cause. Day and year are correct.
- `src/render.ts:15` `renderList` calls `formatAdded(item.addedAt)` for the `.added` span. `src/main.ts:21` passes `new Date()` to `addItem`. Neither needs changes.

## Existing tests and seams
- `src/list.test.ts` covers `addItem` and `removeItem` only. `formatAdded` has no test, which is why the bug was not caught. `src/render.test.ts` does not assert on the date text.
- Tests build dates as ISO strings with a Z suffix, e.g. `new Date('2026-03-01T10:00:00Z')` (`src/list.test.ts:4`) and `addedAt: '2026-03-01T10:00:00.000Z'` (`src/render.test.ts:10`). These are timezone-safe.
- A new `describe('formatAdded')` goes in `src/list.test.ts`. Import `formatAdded` and test the three acceptance dates through ISO strings, e.g. `'2026-09-25T10:00:00.000Z'` gives `25 Sep 2026`, `'2026-12-03T...'` gives `3 Dec 2026`, `'2026-01-15T...'` gives `15 Jan 2026`. Optionally add one render assertion.

## Proposed change
- Edit `src/list.ts:23`: change `MONTHS[date.getUTCMonth() + 1]` to `MONTHS[date.getUTCMonth()]`. This is 1 line.
- Edit `src/list.test.ts`: add the `formatAdded` import and a describe block with 3 cases, about 10 lines.
- Estimate: 2 files, about 12 lines.
- Plan tasks: (1) add the failing test and confirm it fails; (2) fix the index; (3) run `npm test`, `npm run typecheck` and `npm run build`.

## Risks
- Data model/schema: none. `addedAt` stays a UTC ISO string.
- Public API: none. The signature of `formatAdded` is unchanged.
- Auth/security: none.
- New dependencies: none.
- .github/workflows: not touched.
- User-visible changes beyond the issue: none. Only the month label changes.
- `src/storage.ts` (protected): does not need to be touched.
- Existing stored data: not affected. The stored ISO timestamps are correct and only the display was wrong, so existing items show the correct month after the fix.

## In-flight overlap
none: no runs ahead.

## Context
| # | Reference | Kind | Found in | Result | Used for |
|---|-----------|------|----------|--------|----------|
| - | none | - | - | no references found | - |
