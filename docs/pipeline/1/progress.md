# Progress — 1

## Run

| Variable | Value |
|---|---|
| KEY | 1 |
| NUMBER | 1 |
| REPO | AndresRubio/pipeline-sandbox |
| REPO_ROOT | /home/runner/work/pipeline-sandbox/pipeline-sandbox |
| BRANCH | pipeline/1-added-dates-show-the-wrong-month |
| WT | /home/runner/work/pipeline-sandbox/pipeline-sandbox |
| BASE_REF | origin/main |
| BASE_SHA | 321d592d114051dc3b9ccc0e056e42a863e86a55 |
| MODE | auto |
| LANE | github |
| TASKS | |

## Stages

- [x] 0 Resolve and lock
- [x] 1 Isolate
- [x] 2 Research
- [x] 3 Grade
- [x] 4 Spec
- [ ] 5 Plan
- [ ] 6 Build
- [ ] 7 Verify
- [ ] 8 Self-review
- [ ] 9 Finish
- [ ] 10 Report

## Tasks

One line per finished task: `Task N — summary — <commit sha>`.

## Known issues

- The runner's checkout holds an untracked `.issue-pipeline-plugin/` directory containing its own test files. Plain `npm test` picks them up and fails (59 files, none from this repo). Local checks run the repo's own tests with `npx vitest run --dir src --exclude '.issue-pipeline-plugin/**'`. A clean CI checkout has no such directory, so `npm test` there is equivalent. Never commit `.issue-pipeline-plugin/`.
- A second `lock` comment was posted at stage 0: the workflow had already posted one for this same Actions run. Harmless duplicate.
