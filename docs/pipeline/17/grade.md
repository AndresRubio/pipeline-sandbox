# Grade for 17

**Verdict:** `small-gaps`

## Why

- 1 assumption(s) to record

## Checklist

| Criterion | Value |
|---|---|
| Estimated files | 1 (limit 6) |
| Estimated lines | 8 (limit 250) |
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

A1. Assume the JSDoc also says the month name follows the `lang` argument (English by default), because `formatAdded` gained that parameter after the issue's permalink was taken and a comment that ignored it would be wrong.

## Research summary

Add one JSDoc block above `formatAdded` at `src/list.ts:25`; no code changes. The issue's permalink is stale: the function now takes `lang` and reads `STRINGS[lang].months`. Existing tests (`src/list.test.ts`, `src/i18n.test.ts`) already cover the behaviour. Main risk: a comment that describes only the English output would be inaccurate.
