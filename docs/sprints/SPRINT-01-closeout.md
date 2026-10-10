# SPRINT-01 close-out — Preview pipeline and the Valesor audit

Sprint issue: #15. Closed 2026-10-10 from `origin/main` at `ec1d013`.

## Stories

All 8 stories are `done`. No PR is open.

| Story | Lane | Final status | Merging PR(s) |
|---|---|---|---|
| S7M-VAL-001 ADR: site structure for valesordev.com | architecture | done | #19 (ADR), #24 (accepted) |
| S7M-VAL-002 Freeze the Valesor target and audit it | visual-designer | done | #20 |
| S7M-VAL-003 Valesor brand docs | visual-designer | done | #21, #22, #23 |
| S7M-VAL-005 Brand package shell | visual-designer | done | #48 (lockfile: #49) |
| S7M-VAL-004 valesordev.com Astro site skeleton | implementation | done | #45 |
| S7M-INF-002 `build-site-valesordev` target and `make check` wiring | sre | done | #53 |
| S7M-INF-001 Cloudflare preview deploy for the stub | sre | done | #56 |
| S7M-VAL-013 ProjectRow for work in development | visual-designer | done | #50, #52 (ADR amendment: #51) |

## Carryover

None. Every story reached `done`.

The sprint did not plan S7M-VAL-013, S7M-VAL-005, or S7M-INF-002; they were added in-sprint
(S7M-INF-002 and S7M-VAL-005 from architecture's contract review of S7M-VAL-004 and S7M-INF-001, S7M-VAL-013
from `release-change` #40).

## Status defects

None. Every merged PR's story is `done`, and every `story-merge` run in the sprint is green or skipped
(`gh run list --workflow story-merge.yml`; the one skip is the lockfile PR #49, which carries no story).

One oddity, not a defect: S7M-VAL-006 (tokens) is `in-progress` with no Sprint. A lane started it before it was
planned. SPRINT-02 plans it.

## Demo

`docs/sprints/SPRINT-01-demo.md`. The demo goal was met: the preview pipeline works through `make` targets and
the approved audit and brand docs are on `main`. Details and what was run are in the demo file.

## Triage

Issues opened during the sprint, `--to pm` comments, and `release-change` issues. "Owes" is the role that acts.

| Item | Owes | Into SPRINT-02? |
|---|---|---|
| `release-change` #7, #40, #54: answered (roadmap PRs #16, #42, #47) | pm: close | Yes, with the roadmap change below |
| `release-change` #58 (R1 review 01, no-go): story mapping for M3 to M5 | pm: roadmap edit | Yes, the mapping; the M3 page stories and M5 stories are cut at SPRINT-03, once tokens exist, as #58 asks |
| #58: clear S7M-VAL-004 from S7M-VAL-012's blockers | architecture | Not actionable by pm: `story create --depends` is creation-time only, and the blocker is `done`, so it is harmless |
| #57 delete the Cloudflare preview when its PR closes | sre (not yet a story) | No. Needs the retirement method confirmed first (its To do). Leave as an issue |
| S7M-INF-002 comment `--to pm`: no workflow runs `make check` on PRs | sre | Yes: new story S7M-INF-006 |
| S7M-VAL-012 comment `--to pm`: component stories | pm | Done on 2026-10-10: S7M-VAL-015 to S7M-VAL-018. Architecture adds the blocked-by links |
| S7M-VAL-001 comment `--to pm`: ADR follow-ons | pm | All on the board: brand shell (VAL-005), site-core (VAL-010, INF-005), brand-import lint (VAL-011, INF-003), project list (INF-004, VAL-014), preview (INF-001). The production-deploy and redirect-scheme follow-ons (ADR follow-ons 6 and 7, production half) are M5 and are not cut yet |
| S7M-VAL-004 and S7M-INF-004 comments `--to pm` | pm | Answered earlier (INF-002, VAL-005; INF-004 rewritten) |
| SRE note on S7M-INF-001: the stub is not served on the Worker's workers.dev hostname; only `pr-<n>` aliases resolve | sre | Informational. `workers_dev: false` by design until the production story |
