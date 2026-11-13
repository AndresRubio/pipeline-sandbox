<!-- Adapted from mattpocock/skills (MIT License, Copyright (c) 2026 Matt Pocock): the to-spec template. -->
# Spec — 14: Add countByAuthor to the list module

**Source:** https://github.com/AndresRubio/pipeline-sandbox/issues/14

## Problem Statement

The list module has no way to tell how many items each author has. A caller that wants per-author totals must loop over the items itself.

## Solution

The list module exports `countByAuthor(items: Item[]): Record<string, number>`, which returns how many items each author has. Authors are compared exactly as stored. Nothing calls it yet, so the app's behaviour does not change.

## User Stories

1. As a developer of the reading list, I want a function that counts items per author, so that later features can show per-author totals without repeating the loop.

## Acceptance Criteria

1. AC1: `countByAuthor([])` returns `{}`. Checked by a unit test in `src/list.test.ts`.
2. AC2: Two items by "Le Guin" and one by "Tolkien" give `{ "Le Guin": 2, "Tolkien": 1 }`. Checked by a unit test in `src/list.test.ts`.
3. AC3: Authors are compared exactly as stored: names that differ in case or whitespace are separate keys. Checked by a unit test in `src/list.test.ts`.
4. AC4: Author names that match `Object.prototype` keys ("__proto__", "constructor", "toString") are counted like any other author. Checked by a unit test in `src/list.test.ts`.
5. AC5: `countByAuthor` is a named export of `src/list.ts` with the signature `countByAuthor(items: Item[]): Record<string, number>`, and nothing else calls it. Checked by `npm run typecheck` and a search for callers.
6. AC6: `src/list.test.ts` covers AC1 and AC2, and `npm test`, `npm run typecheck` and `npm run build` pass. Checked by running them.

## Assumptions

A1. Assume author names that match `Object.prototype` keys ("__proto__", "constructor", "toString") are counted as ordinary authors, so the result is built via a `Map` and `Object.fromEntries` rather than a plain-object accumulator.
A2. Assume the return value is an ordinary object (not null-prototype), so it equals `{}` for empty input under both `toEqual` and `toStrictEqual`.
A3. Assume key order in the result is not specified, and tests compare with `toEqual`, which ignores order.

## Implementation Decisions

- The list module gains one pure, exported function and no other change. Items are not mutated and the input array is not reordered.
- The result is an ordinary object keyed by author name, with a positive integer count for each author that appears. An author that does not appear has no key.
- No trimming, case folding or other normalisation is applied to author names.
- The data model (`Item`), the storage module, the UI and the dependencies are unchanged.

## Testing Decisions

- Tests check external behaviour only: the returned object for a given input. They go through the exported function.
- They are added to the existing `src/list.test.ts`, following the style of its existing tests.
- For the `__proto__` case, tests assert with `Object.keys` or `Object.hasOwn`, because an object literal `{ __proto__: 1 }` would set the prototype instead of creating a key.

## Out of Scope

- Calling `countByAuthor` from the UI or anywhere else.
- Normalising author names, sorting the result, or ranking authors.
- Changes to `src/storage.ts`, `src/render.ts`, `src/main.ts`, dependencies or `.github/workflows`.

## Further Notes

None.
