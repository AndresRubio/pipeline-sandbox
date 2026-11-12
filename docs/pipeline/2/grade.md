# Grade — 2

**Verdict:** `small-gaps`

## Why

- 3 assumption(s) to record.

## Checklist

| Criterion | Value |
|---|---|
| Estimated files | 4 (limit 6) |
| Estimated lines | 40 (limit 250) |
| Estimated plan tasks | 2 (limit 8) |
| Independent subsystems | no |
| Changes user-visible behaviour not in the issue | no |
| Changes data model, API, auth or dependencies | no |
| Acceptance criteria derivable | yes |
| Needs workflow changes | no |
| Waits for (runs ahead) | none |
| Missing values | none |
| pipeline-go | no |

## Assumptions

A1. Assume titles are compared case-insensitively using `localeCompare` with `sensitivity: 'base'`, so "apple" sorts before "Zebra" and titles differing only in case count as equal (and then keep added order).
A2. Assume leading articles such as "The" are not stripped and numbers are not collated numerically; titles are sorted exactly as written.
A3. Assume a newly added book appears at its alphabetical position in the displayed list rather than at the bottom.

## Research summary

Add a pure `sortByTitle` to `src/list.ts` that sorts a copy (stable, so equal titles keep added order) and apply it inside `renderList` in `src/render.ts`. `main.ts` keeps saving the unsorted `items`, so the saved order and `src/storage.ts` (a protected path) are untouched. Items are identified by id, not index, so Remove still hits the right item. Main risk: locale-dependent comparison, so tests use plain ASCII titles.
