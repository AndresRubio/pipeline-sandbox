# Plan for 17: Document what formatAdded returns

Spec: `docs/pipeline/17/spec.md`. One comment-only task.

## Global Constraints

- Hard rules: never push to the base branch, never force-push or `git reset --hard`, never merge a PR, push only `pipeline/*` branches, never edit `.github/workflows/**`, no completion claim without fresh evidence, every commit ends with a `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` trailer, keep tool output short.
- Don't touch `src/storage.ts` (protected path).
- Checks (from `checks.txt`), all must pass: `npm run typecheck`, `npm test`, `npm run build`.
- Change no code: the diff to `src/list.ts` is additions only, all inside one JSDoc block.

## Tasks

### Task 1: JSDoc for `formatAdded`

Satisfies AC1, AC2, AC3, AC4, AC5. No behaviour changes, so no new test; the existing `formatAdded` tests are the regression check.

- [ ] Insert this block directly above `export function formatAdded(` in `src/list.ts` (no other line changes):

```ts
/**
 * Formats an ISO timestamp as the day of the month, the short month name and
 * the four-digit year, separated by spaces, e.g. `25 Sep 2026`. The date is
 * read in UTC, so the result doesn't depend on the local time zone. The month
 * name is in the language given by `lang` (English by default).
 */
```

- [ ] Check the diff: `git diff --stat` shows `src/list.ts` only, and `git diff src/list.ts | grep -E '^-[^-]'` prints nothing.
- [ ] Run `npm run typecheck`, `npm test`, `npm run build` (output to logs); all exit 0.
- [ ] Commit: `docs: document what formatAdded returns (#17)` with the trailer.
