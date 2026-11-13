## Relevant code

- `src/list.ts:1-6`: `Item` interface (`id`, `title`, `author`, `addedAt`). `author` is a plain `string`.
- `src/list.ts:10-15`: `addItem` trims the author (`:12`) and rejects blank ones (`:13`). Stored authors are therefore already trimmed. "Compared exactly as stored" means `countByAuthor` must not trim, lowercase or normalise again.
- `src/list.ts:17-28`: other pure helpers (`removeItem`, `sortByTitle`, `formatAdded`). These are the pattern to follow: named exports, no mutation of input, no side effects. The new function goes at the end of the file, after line 28.
- `src/main.ts:2`: imports only `addItem`, `removeItem`, `Item` from `./list`. The issue says "Nothing calls it yet", so main.ts and render.ts stay untouched.
- `src/render.ts:1,14`: uses `formatAdded`, `sortByTitle` and `item.author`. Not affected.
- `src/storage.ts` (18 lines): protected path. Not touched. It does not need to change, since the function takes `Item[]` and returns a plain value.
- `tsconfig.json`: target ES2022, lib ES2022. `Object.create(null)`, `Map`, `Object.fromEntries` and `Object.hasOwn` are all available.

## Existing tests and seams

- `src/list.test.ts` (62 lines) uses vitest with one `describe` per function. The import is on line 2: `import { addItem, formatAdded, removeItem, sortByTitle, type Item } from './list';`. `countByAuthor` must be added to it.
- The `book(id, title, author = 'X'): Item` factory is local to the `sortByTitle` describe (`:26-31`), so it is not in scope for a new top-level describe. The new tests either define their own small helper or build literals, so the plan is to add a local helper inside the new `describe('countByAuthor')`. Don't refactor the existing helper out (keep the change small).
- New tests go in a new `describe('countByAuthor', ...)` block, inserted between `sortByTitle` (ends `:48`) and `formatAdded` (starts `:50`), or at the end of the file:
  1. Empty input: `expect(countByAuthor([])).toEqual({})`.
  2. Two "Le Guin" and one "Tolkien": `toEqual({ 'Le Guin': 2, Tolkien: 1 })`.
  3. Recommended extras: exact comparison (`'le guin'` vs `'Le Guin'` are separate keys), and the prototype-key case below.
- Run with `npm test`, `npm run typecheck` and `npm run build`.

## Proposed change

Files: `src/list.ts` (+about 8 lines) and `src/list.test.ts` (+about 25 lines). Two files, about 35 lines. This is well inside maxPrSize (6 files / 250 lines).

Sketch (a design choice for the plan, not to be applied during research):

```ts
export function countByAuthor(items: Item[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const { author } of items) {
    counts[author] = Object.hasOwn(counts, author) ? counts[author] + 1 : 1;
  }
  return counts;
}
```

For `__proto__` safety, use `Object.fromEntries` over a `Map` instead, or define keys via `Object.defineProperty`. Details are in Risks.

Plan tasks estimate: 3 tasks.
1. Add `countByAuthor` to `src/list.ts`.
2. Add tests to `src/list.test.ts` (the two required cases plus exactness and the prototype-key cases).
3. Run `npm test`, `npm run typecheck` and `npm run build`.

## Risks

- Data model / schema: none. `Item` is unchanged and nothing is persisted. `src/storage.ts` is untouched.
- Public API: adds one new named export from `src/list.ts`. It is additive and has no callers, which matches the issue. The signature must be exactly `countByAuthor(items: Item[]): Record<string, number>`.
- Prototype-key pitfalls (main correctness risk). A plain `{}` has `Object.prototype` behind it.
  - Naive `counts[a] = (counts[a] ?? 0) + 1` with author `"constructor"` or `"toString"`: `counts['constructor']` is the inherited `Object` function, so `?? 0` does not fire. The result is `function + 1`, which gives a string and not a number. The count is wrong.
  - Author `"__proto__"`: assigning `counts['__proto__'] = 1` hits the prototype setter. A non-object value is silently ignored, so the author is dropped from the result and its count is lost. `Object.hasOwn` alone does not fix this, because the assignment itself is the problem.
  - Fix options, each compatible with `toEqual({})` and `toEqual({'Le Guin': 2, Tolkien: 1})`:
    - Accumulate in a `Map<string, number>`, then build the result with `Object.fromEntries(map)`. `fromEntries` uses CreateDataProperty, so `__proto__` becomes an own key. This is the safest and simplest option.
    - Use `Object.create(null)` as the accumulator. Do not use it as the return value: vitest `toEqual` ignores prototypes and passes, but `toStrictEqual` and prototype-less objects behave surprisingly for callers. If used, copy out with `Object.fromEntries`.
  - Return an ordinary object (with `Object.prototype`) so `countByAuthor([])` equals `{}` under both `toEqual` and `toStrictEqual`.
  - Add tests for authors `"__proto__"`, `"constructor"` and `"toString"`. For `__proto__`, assert with `Object.keys(result)` / `Object.hasOwn(result, '__proto__')` rather than a `toEqual` literal. A literal `{ __proto__: 1 }` sets the prototype and does not create a key.
- "Compared exactly as stored": no trim, no case-folding, no Unicode normalisation. `"Le Guin"`, `"le guin"` and `"Le Guin "` are three keys. Whitespace variants are unlikely, since `addItem` trims on write, but data loaded from storage was not necessarily written through `addItem`.
- Auth / security: none. No network, no secrets, no DOM or HTML output. The prototype-key point above is the only integrity concern.
- New dependencies: none. `package.json` is unchanged.
- `.github/workflows`: untouched (must never be edited).
- User-visible effects: none. Nothing calls the function and the UI is unchanged. No screenshot or visual evidence is applicable, and tests are the evidence.
- Scope note: the trusted comment ("run now it should work with new token") carries no decision and no scope change. It only concerns re-running the pipeline.

## In-flight overlap

none: no runs ahead

## Context

No external context fetched.
