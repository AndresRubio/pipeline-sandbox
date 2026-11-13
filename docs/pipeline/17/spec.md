# Spec for 17: Document what formatAdded returns

**Source:** https://github.com/AndresRubio/pipeline-sandbox/issues/17

## Problem Statement

`formatAdded` has no doc comment. Its output is easy to get wrong (issue #1 shipped an off-by-one month), so a reader has to work out the format and the time zone from the body.

## Solution

A JSDoc comment above `formatAdded` states what it returns: the day of the month, the short month name and the four-digit year, separated by spaces, read in UTC. No code changes.

## User Stories

1. As a maintainer reading `src/list.ts`, I want `formatAdded` to document its output format and time zone, so that I don't have to infer them from the implementation.

## Acceptance Criteria

1. AC1: `formatAdded` has a JSDoc comment directly above it that names the format (day of the month, short month name, four-digit year, separated by spaces) and says the date is read in UTC. Checked by reading the diff.
2. AC2: The JSDoc says the month name follows the `lang` argument and is English by default (assumption A1). Checked by reading the diff.
3. AC3: No other line of `src/list.ts` changes: the diff is additions only, all inside the new comment. Checked with `git diff --stat` and `git diff` against the base.
4. AC4: No file other than `src/list.ts` and `docs/pipeline/17/` changes. Checked with `git diff --name-only`.
5. AC5: `npm test` passes. Checked by running it.

## Assumptions

A1. Assume the JSDoc also says the month name follows the `lang` argument (English by default), because `formatAdded` gained that parameter after the issue's permalink was taken and a comment that ignored it would be wrong.

## Implementation Decisions

- Add a single JSDoc block above `formatAdded`; leave the signature and body untouched.
- The comment describes the output format, the UTC reading and the month-name language, with one example of the output (the issue's own `25 Sep 2026`, taken from the existing tests).

## Testing Decisions

No new test: the change is a comment. The existing tests for `formatAdded` (`src/list.test.ts`, `src/i18n.test.ts`) plus typecheck and build must stay green.

## Out of Scope

- Any change to code, behaviour or tests.
- Doc comments on other functions in `src/list.ts`.

## Further Notes

The issue's permalink points at an older version of the function (pre-bilingual); the function is now at `src/list.ts:25`.
