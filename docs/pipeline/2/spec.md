# Spec — 2: Sort the reading list alphabetically by title

**Source:** https://github.com/AndresRubio/pipeline-sandbox/issues/2

## Problem Statement

The reading list is shown in the order items were added. Once there are more than a few books, it is hard to find a particular one.

## Solution

Show the reading list sorted alphabetically by title. Books with the same title stay in the order they were added. Only what is displayed changes; the order in which the list is saved stays as it is.

## User Stories

1. As a reader with a long list, I want the books shown alphabetically by title, so that I can find a book quickly.
2. As a reader who owns two copies of the same title, I want them to stay in the order I added them, so that the list doesn't shuffle them arbitrarily.
3. As a reader, I want my saved list left untouched by the display order, so that nothing about my stored data changes.

## Acceptance Criteria

1. **AC1.** Given items added in the order "Zebra", "apple", "Mango", the rendered list shows them in the order apple, Mango, Zebra. Checked by a render unit test that asserts the order of titles in the output (using plain ASCII titles).
2. **AC2.** Given two items with the same title and different authors, the one added first is shown first. Checked by a unit test on the sort function and a render test that asserts the authors' order.
3. **AC3.** Sorting does not mutate its input: after sorting, the original array still has its added order. Checked by a unit test that compares the input array before and after.
4. **AC4.** The array that is saved to storage keeps the added order; nothing is sorted before saving, and the storage module is unchanged. Checked by code review of the diff (the storage module has no changes, and the wiring still saves the unsorted array) and by the build and existing tests passing.
5. **AC5.** In a rendered list shown out of added order, each Remove button's `data-id` is the id of the item in its own row. Checked by a render test that pairs each row's title with its `data-id`.
6. **AC6.** An empty list still shows the existing empty state, and the existing escaping, author and date rendering are unchanged. Checked by the existing render tests continuing to pass.
7. **AC7.** `npm run typecheck`, `npm test` and `npm run build` all pass.

## Assumptions

A1. Assume titles are compared case-insensitively using `localeCompare` with `sensitivity: 'base'`, so "apple" sorts before "Zebra" and titles differing only in case count as equal (and then keep added order).
A2. Assume leading articles such as "The" are not stripped and numbers are not collated numerically; titles are sorted exactly as written.
A3. Assume a newly added book appears at its alphabetical position in the displayed list rather than at the bottom.

## Implementation Decisions

- A new pure function takes a list of items and returns a new, sorted list by title. It never changes its input.
- Sorting relies on the language's stable sort, so items with equal titles keep the relative order of the input, which is the added order.
- The list display applies the sort to a copy at render time. The stored list, and what is saved, are not sorted.
- Items stay identified by id, so Remove keeps acting on the right item whatever the displayed order.
- No change to the item shape, the storage format or the storage module, and no new dependencies.

## Testing Decisions

- Test external behaviour: the order of titles in the rendered output and the pairing of each row with its id, rather than internals.
- The sort function is covered in the existing list tests; the display order is covered in the existing render tests. Both follow the existing vitest style of building small item literals and asserting on output.
- Use plain ASCII titles so results don't depend on the runtime locale.

## Out of Scope

- A sort control or a choice of sort order.
- Stripping leading articles, numeric-aware collation or locale selection.
- Sorting by author or date.
- Any change to the stored order or storage format.

## Further Notes

None.
