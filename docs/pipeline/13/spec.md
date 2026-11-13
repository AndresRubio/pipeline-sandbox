<!-- Adapted from mattpocock/skills (MIT License, Copyright (c) 2026 Matt Pocock): the to-spec template. -->
# Spec — 13: Add a meta description to the page

**Source:** https://github.com/AndresRubio/pipeline-sandbox/issues/13

## Problem Statement

The page has no meta description, so search engines and link previews have no short summary of what the reading list is.

## Solution

The page's head carries a meta description reading "A small reading list."

## User Stories

1. As a site owner, I want the page to declare a meta description, so that search engines and link previews can show a short summary.

## Acceptance Criteria

1. AC1: The page markup contains exactly one `<meta name="description" content="A small reading list.">` element, inside `<head>`. Checked by a unit test that loads the page markup and counts matching tags, and by inspecting the built output.
2. AC2: Nothing else in the page markup changes. Checked by reviewing the diff of the markup file: the only change is the one added line.

## Assumptions

A1. Assume the new meta tag goes in the head right after the title, in the file's existing self-closing style (`/>`).

## Implementation Decisions

- Add the description tag to the page's head, after the title, in the same self-closing style as the other meta tags.
- Content is exactly "A small reading list.", taken from the issue.

## Testing Decisions

- Test external behaviour: the page markup, loaded as a raw string, contains exactly one description meta tag with the expected content.
- Prior art: the existing page-title test, which loads the markup as raw text and matches with a regex. Add the new test beside it.

## Out of Scope

Other meta tags (Open Graph, theme colour, etc.), changes to the title or the body, any styling.

## Further Notes

None.
