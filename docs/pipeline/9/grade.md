# Grade — 9

**Verdict:** `small-gaps`

## Why

- 3 assumption(s) to record

## Checklist

| Criterion | Value |
|---|---|
| Estimated files | 3 (limit 6) |
| Estimated lines | 20 (limit 250) |
| Estimated plan tasks | 2 (limit 8) |
| Independent subsystems | no |
| Changes user-visible behaviour not in the issue | no |
| Changes data model, API, auth or dependencies | no |
| Acceptance criteria derivable | yes |
| Needs workflow changes | no |
| Waits for (runs ahead) | none (#2 and #5 judged `none`) |
| Missing values | none |
| pipeline-go | no |

## Assumptions

A1. Assume an empty list shows the heading "Reading list (0)", since the issue defines N as the number of items.
A2. Assume the browser tab title in `index.html` stays "Reading list", because the issue only asks about the heading.
A3. Assume the static `<h1>` in `index.html` stays "Reading list" as a fallback before the script runs, and the count is set at runtime.

## Research summary

The heading is a static `<h1>` at `index.html:10`; nothing in TypeScript touches it. `refresh()` in `src/main.ts` already runs on load, add and remove, so it is the one place to set the heading from `items.length`. The change adds a pure `formatHeading(count)` in `src/render.ts` with unit tests, plus one wiring line in `main.ts`. Main risk: low, since there is no data model or storage change and no overlap with in-flight runs #2 and #5 beyond shared files.
