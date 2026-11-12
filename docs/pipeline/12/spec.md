# Spec — 12: Show the author's name in italics

**Source:** https://github.com/AndresRubio/pipeline-sandbox/issues/12

## Problem Statement

In the reading list, the author's name after "by" looks the same as the surrounding text. The owner wants it in italics so it stands apart from the title.

## Solution

Each list row shows the author's name in italics. Nothing else in the row changes.

## User Stories

1. As a reader of the list, I want the author's name in italics, so that I can tell it apart from the title at a glance.

## Acceptance Criteria

- AC1. Each list row renders the author's name inside an `<em>` element within the author span. Checked by a unit test on the rendered HTML.
- AC2. The author text inside `<em>` is still HTML-escaped (for example `<i>&` appears as `&lt;i&gt;&amp;`). Checked by the same unit test.
- AC3. Nothing else in the row changes: the title, "by", the added date and the Remove button render as before. Checked by the existing `renderList` tests continuing to pass.
- AC4. A test in `src/render.test.ts` covers AC1 and AC2. Checked by running `npm test`.

## Assumptions

None.

## Implementation Decisions

- The list renderer wraps the escaped author text in `<em>`, inside the existing author span. The span and its class stay.
- No other rendering, styling or storage changes.

## Testing Decisions

- Test external behaviour: the string `renderList` returns for an item whose author contains HTML special characters.
- The new test sits next to the two existing `renderList` tests in `src/render.test.ts`.

## Out of Scope

- Any CSS change.
- Changes to the title, date or Remove button.
- Changes to storage or the data model.

## Further Notes

None.
