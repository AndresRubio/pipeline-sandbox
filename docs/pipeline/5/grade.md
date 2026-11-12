# Grade — 5

**Verdict:** `small-gaps`

## Why

- 2 assumption(s) to record.

## Checklist

| Criterion | Value |
|---|---|
| Estimated files | 3 (limit 6) |
| Estimated lines | 15 (limit 250) |
| Estimated plan tasks | 1 (limit 8) |
| Independent subsystems | no |
| Changes user-visible behaviour not in the issue | no |
| Changes data model, API, auth or dependencies | no |
| Acceptance criteria derivable | yes |
| Needs workflow changes | no |
| Waits for (runs ahead) | none (run #2 is ahead but overlap is `none`) |
| Missing values | none |
| pipeline-go | no |

## Assumptions

A1. Assume "muted colour" means `#777`, the grey the app already uses for the `.added` text in `src/style.css`.
A2. Assume centring is done with `text-align: center` on the `.empty` paragraph, which sits under the form inside `main` and takes its full width.

## Research summary

The only place the message is produced is `renderList` in `src/render.ts:10`, and `src/style.css` has no `.empty` rule. The change is the new copy there, a `.empty` CSS rule, and an updated test in `src/render.test.ts` plus a new test for a non-empty list. The main risk is a trivial textual conflict with run #2 (PR #28), which edits the adjacent line of `renderList`; it has no code dependency on it.
