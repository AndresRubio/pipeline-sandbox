# Grade — 12

**Verdict:** `ready`

## Why

No blocking criteria.

## Checklist

| Criterion | Value |
|---|---|
| Estimated files | 2 (limit 6) |
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

None.

## Research summary

The author is rendered at `src/render.ts:14` as `<span class="author">${escapeHtml(item.author)}</span>`; wrapping the escaped text in `<em>` is a one-line change. A new test goes in `src/render.test.ts`, next to the two existing `renderList` tests. The main risk is minimal: the author text becomes italic and escaping is preserved. Runs #1 and #8 in flight touch other code (`formatAdded`, the page title), so there is no overlap.
