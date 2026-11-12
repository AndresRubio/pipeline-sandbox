# Spec — 9: Show the number of books in the heading

**Source:** https://github.com/AndresRubio/pipeline-sandbox/issues/9

## Problem Statement

The page heading reads "Reading list" and says nothing about how many books are on the list. The reader has to count the rows.

## Solution

The heading reads "Reading list (N)", where N is the number of items on the list. It updates when items are added or removed.

## User Stories

1. As a reader, I want the heading to show how many books are on my list, so that I can see the size of the list at a glance.
2. As a reader, I want that number to change when I add or remove a book, so that it never goes stale.

## Acceptance Criteria

- AC1. The heading text is "Reading list (N)", where N is the number of items. Checked by a unit test on the heading formatter for several counts, and by loading the app with a stored list and reading the h1.
- AC2. Adding an item raises N by one without a page reload. Checked in the running app: add a book, read the h1.
- AC3. Removing an item lowers N by one without a page reload. Checked in the running app: remove a book, read the h1.
- AC4. The count is correct on first load from stored items. Checked in the running app: reload with items stored, read the h1.
- AC5. The existing tests, typecheck and build still pass, including the test on the tab title. Checked by `npm test`, `npm run typecheck` and `npm run build`.

## Assumptions

A1. Assume an empty list shows the heading "Reading list (0)", since the issue defines N as the number of items.
A2. Assume the browser tab title in `index.html` stays "Reading list", because the issue only asks about the heading.
A3. Assume the static `<h1>` in `index.html` stays "Reading list" as a fallback before the script runs, and the count is set at runtime.

## Implementation Decisions

- A pure formatter takes a count and returns the heading text "Reading list (N)". It lives with the other pure rendering logic.
- The DOM wiring sets the heading from the item count in the one place that already re-renders after load, add and remove, so the three cases share one code path.
- The heading is set as plain text, not as markup.
- No change to the stored data, the storage module or the item shape.

## Testing Decisions

- Test the formatter's external behaviour for a count of zero, one and many, in the existing render tests, following their style.
- The DOM wiring has no unit tests in this codebase (it is covered by running the app), so AC2 to AC4 are checked in the running app.

## Out of Scope

- Changing the browser tab title.
- Announcing count changes to screen readers (no live region).
- Pluralisation or any other wording around the count.
- Any change to the list rendering, sorting or empty state.

## Further Notes

Runs for #2 (sorting) and #5 (empty state) change `src/render.ts` too; research found no overlap in the same function. The new formatter is placed away from `renderList` to keep merges clean.
