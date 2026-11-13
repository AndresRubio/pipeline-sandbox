# Plan — 14: Add countByAuthor to the list module

**Spec:** `docs/pipeline/14/spec.md`

## Global Constraints

- Keep the change small: two files (`src/list.ts`, `src/list.test.ts`), about 35 lines. Limit is 6 files / 250 lines.
- Never touch `src/storage.ts` (protected path), `.github/**` or `.claude/**`.
- Pure logic stays in `src/list.ts`; do not change `src/main.ts` or `src/render.ts`. Nothing calls `countByAuthor`.
- Every task that changes behaviour is test-first (write the failing test, see it fail, then implement).
- Ship's hard rules apply: never invent values, no push to the base branch, no force-push, no workflow edits, no completion claim without fresh evidence. Every commit message ends with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Checks, in order (from `checks.txt`):
  - `npm run typecheck`
  - `npm test`
  - `npm run build`

## Tasks

### Task 1: Count items per author (AC1, AC2, AC3, AC5, AC6)

Files: `src/list.test.ts`, `src/list.ts`

1. In `src/list.test.ts`, add `countByAuthor` to the import from `./list`, and add a `describe('countByAuthor', …)` block after `describe('sortByTitle', …)`. Add a small `book(id, author)` helper that returns an `Item` with a fixed title and `addedAt`. Tests:
   - `countByAuthor([])` equals `{}` (AC1).
   - Two items by "Le Guin" and one by "Tolkien" give `{ 'Le Guin': 2, Tolkien: 1 }` (AC2).
   - "Le Guin", "le guin" and "Le Guin " are three separate keys, each with a count of 1 (AC3).
2. Run `npm test`. The new tests must fail because `countByAuthor` isn't exported yet.
3. In `src/list.ts`, add after `formatAdded`:

   ```ts
   export function countByAuthor(items: Item[]): Record<string, number> {
     const counts = new Map<string, number>();
     for (const { author } of items) {
       counts.set(author, (counts.get(author) ?? 0) + 1);
     }
     return Object.fromEntries(counts);
   }
   ```

4. Run `npm test` and `npm run typecheck`. Both must pass (AC5, AC6).
5. Commit: `feat(list): add countByAuthor (#14)`.

### Task 2: Prototype-key authors (AC4)

Files: `src/list.test.ts`

1. Add tests in the same `describe` for authors "__proto__", "constructor" and "toString". Count two items by each name and one by "Tolkien". Assert with `Object.hasOwn(result, name)` and `result[name]` equal to 2, and `Object.keys(result)` containing the name, not with an object literal containing `__proto__`.
2. Run `npm test`. They pass at once, because Task 1's `Map` already handles this. To prove the tests can fail, temporarily switch the implementation to a plain-object accumulator (`counts[author] = (counts[author] ?? 0) + 1`), see the new tests fail, then restore the `Map` version. Don't commit the temporary change.
3. Run `npm test` and `npm run typecheck` again.
4. Commit: `test(list): cover prototype-key authors in countByAuthor (#14)`.

### Task 3: Full checks (AC5, AC6)

1. Run `npm run typecheck`, `npm test` and `npm run build`, each to a log file under `$RUN_DIR/logs`. All must exit 0.
2. Check `grep -rn countByAuthor src` shows only `src/list.ts` and `src/list.test.ts` (nothing calls it).
3. Check `git diff --stat origin/main...HEAD -- src` touches only the two files and stays under `maxPrSize`.
