# Spec — 1: Added dates show the wrong month

**Source:** https://github.com/AndresRubio/pipeline-sandbox/issues/1

## Problem Statement

Every item in the reading list shows the month after the one it was added in (an item added on 2026-09-25 shows `25 Oct 2026`), and items added in December show `undefined` in place of the month.

## Solution

The date next to each item shows the month it was actually added in, for every month of the year, in the existing `<day> <Mon> <year>` format.

## User Stories

1. As a reader, I want the date next to a book to show the month I added it, so that I can trust when I added it.
2. As a reader who adds a book in December, I want to see `Dec` rather than `undefined`, so that the list never shows a broken date.

## Acceptance Criteria

1. AC1: An item added on 2026-09-25 shows `25 Sep 2026`. Checked by a unit test on the date formatter.
2. AC2: An item added on 2026-12-03 shows `3 Dec 2026`. Checked by a unit test on the date formatter.
3. AC3: An item added on 2026-01-15 shows `15 Jan 2026`. Checked by a unit test on the date formatter.
4. AC4: A unit test covers the date format. Checked by the test suite containing and passing the tests behind AC1 to AC3.
5. AC5: The list rendered in the app shows the corrected date next to a newly added book. Checked by running the app, adding a book and reading the date.

## Assumptions

A1. Assume the displayed month is read in UTC, matching how `addedAt` is stored (an ISO string) and how `formatAdded` already reads it.
A2. Assume the format stays `<day> <Mon> <year>` with no zero-padding on the day, as in the issue's `3 Dec 2026` example.

## Implementation Decisions

- The fault is in the date formatter: it picks the month name one position too far along the list of month names. The fix corrects that selection so each month maps to its own name.
- No change to how a date is stored, to the item shape or to any caller of the formatter.
- The protected storage module is not touched.

## Testing Decisions

- Test the formatter's external behaviour: an ISO timestamp in, the display string out, for the three dates in the acceptance criteria.
- Tests go beside the existing list tests. Existing tests build dates from ISO strings with a `Z` suffix, so the new ones do too, which keeps them independent of the machine's timezone.

## Out of Scope

- Changing the date format, adding zero-padding or localising month names.
- Timezone handling beyond the existing UTC behaviour.
- Migrating stored items: their timestamps are correct, only the display was wrong.

## Further Notes

None.
