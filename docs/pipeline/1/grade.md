# Grade — 1

**Verdict:** `small-gaps`

## Why

- 2 assumption(s) to record

## Checklist

| Criterion | Value |
|---|---|
| Estimated files | 2 (limit 6) |
| Estimated lines | 14 (limit 250) |
| Estimated plan tasks | 1 (limit 8) |
| Independent subsystems | no |
| Changes user-visible behaviour not in the issue | no |
| Changes data model, API, auth or dependencies | no |
| Acceptance criteria derivable | yes |
| Needs workflow changes | no |
| Waits for (runs ahead) | none |
| Missing values | none |
| pipeline-go | no |

## Assumptions

A1. Assume the displayed month is read in UTC, matching how `addedAt` is stored (an ISO string) and how `formatAdded` already reads it.
A2. Assume the format stays `<day> <Mon> <year>` with no zero-padding on the day, as in the issue's `3 Dec 2026` example.

## Research summary

- Cause: `formatAdded` in `src/list.ts:23` indexes `MONTHS[date.getUTCMonth() + 1]`; `getUTCMonth()` is already 0-based, so every month shows one late and December reads `undefined`.
- Change: drop the `+ 1` and add a `formatAdded` test block in `src/list.test.ts` covering the three acceptance dates. About 2 files, 14 lines, 1 task.
- Main risk: low. `src/storage.ts` (protected) is not touched, stored timestamps are correct, and no schema, API or dependency changes.
