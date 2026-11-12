<!-- Adapted from mattpocock/skills (MIT License, Copyright (c) 2026 Matt Pocock): the to-spec template. -->
# Spec — 5: Friendlier empty state

**Source:** https://github.com/AndresRubio/pipeline-sandbox/issues/5

## Problem Statement

When the reading list is empty the page says only "No items." at the left edge, which looks like a leftover and doesn't tell a new reader what to do.

## Solution

When the list has no items, show the message "Your reading list is empty — add your first book above." in a muted colour, centred horizontally under the form. When there is at least one item, the message is not shown.

## User Stories

1. As a first-time reader, I want a friendly message when my list is empty, so that I know to add my first book with the form above.
2. As a reader with books on the list, I want the message to disappear, so that the list isn't cluttered.

## Acceptance Criteria

1. AC1: With no items, the page shows exactly: Your reading list is empty — add your first book above. Checked by a unit test on `renderList([])` asserting the exact text, and by a screenshot of the running app with an empty list.
2. AC2: The message is centred horizontally under the form. Checked by a screenshot of the empty page, and by the stylesheet's centring rule for the message.
3. AC3: With at least one item, the message is not shown. Checked by a unit test on `renderList` with one item asserting the message text is absent.
4. AC4: The message is in a muted colour. Checked by the screenshot and the stylesheet's colour rule for the message.

## Assumptions

A1. Assume "muted colour" means `#777`, the grey the app already uses for the `.added` text in `src/style.css`.
A2. Assume centring is done with `text-align: center` on the `.empty` paragraph, which sits under the form inside `main` and takes its full width.

## Implementation Decisions

- The empty-list branch of the list renderer returns the new message text instead of "No items.", keeping its existing `empty` paragraph class.
- The stylesheet gains a rule for that class that centres its text and sets the muted colour.
- The renderer's signature and the DOM wiring are unchanged; the message reappears on its own if the last item is removed because the list is re-rendered after every change.

## Testing Decisions

- Test external behaviour: the HTML string that `renderList` returns for an empty and a non-empty list.
- Update the existing empty-list test in the render tests (it asserts the old text) and add one test for the non-empty case, following the style already used there.
- Centring and colour are CSS only and are checked visually, not in a unit test.

## Out of Scope

- Any change to how items are stored, sorted, added or removed.
- Any change to the form, page layout or other styling.
- Making the message an element other than the existing paragraph, or adding icons or links.

## Further Notes

Run #2 (PR #28) edits the adjacent line of `renderList` to sort items. There is no dependency between the two changes; whichever lands second may need a trivial textual rebase.
