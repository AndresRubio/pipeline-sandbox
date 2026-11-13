# Grade — 14

**Verdict:** `small-gaps`

## Why

- 3 assumption(s) to record.

## Checklist

| Criterion | Value |
|---|---|
| Estimated files | 2 (limit 6) |
| Estimated lines | 35 (limit 250) |
| Estimated plan tasks | 3 (limit 8) |
| Independent subsystems | no |
| Changes user-visible behaviour not in the issue | no |
| Changes data model, API, auth or dependencies | no |
| Acceptance criteria derivable | yes |
| Needs workflow changes | no |
| Waits for (runs ahead) | none |
| Missing values | none |
| pipeline-go | no |

## Assumptions

A1. Assume author names that match `Object.prototype` keys ("__proto__", "constructor", "toString") are counted as ordinary authors, so the result is built via a `Map` and `Object.fromEntries` rather than a plain-object accumulator.
A2. Assume the return value is an ordinary object (not null-prototype), so it equals `{}` for empty input under both `toEqual` and `toStrictEqual`.
A3. Assume key order in the result is not specified, and tests compare with `toEqual`, which ignores order.

## Research summary

Add one named export `countByAuthor` to `src/list.ts` and extend `src/list.test.ts` (2 files, about 35 lines). Nothing else is touched; `src/storage.ts` is untouched. Main risk: a plain `{}` accumulator mishandles author names like "constructor" and "__proto__", so use a `Map` and `Object.fromEntries`.
