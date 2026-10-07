# FEAT-04 — Instrumented, not tracked
Status: proposed
Release: R1 (must)

## Problem
Nothing measures how the sites perform or fail for a real visitor, and no `/privacy` page states what is
measured. Brian has to find out about slow pages and errors from visitors, and a visitor can't check the claim
that they aren't tracked.

## Outcome
A visitor can read a `/privacy` page that says what is and isn't measured. The site's web vitals, performance, and
frontend errors are measured without identifying the visitor.

## Success signal
In the R1 demo, sre shows, and Brian approves:
1. the browser's network requests for a page view carry no user identifier and no personal data, with Session
   Replay off (a captured request, checked against `CLAUDE.md` §7);
2. a build without Faro config still works and sends nothing;
3. an SLO exists for the page before any alert is defined;
4. a page view and a forced error appear in Grafana as web vitals and an error event, with no user attributes
   (sre);
5. `/privacy` is live with text Brian approved, linked from the footer.

## Scope
- In: Faro per `CLAUDE.md` §7 (volatile sessions, explicit sampling, keys injected at build time) and the `/privacy`
  page.
- Out: any analytics about visitors: engagement, funnels, identification (`CLAUDE.md` §10).
- In: the `/privacy` page and the footer link to it. The look is FEAT-01's brand docs.
- Out: one shared `packages/` source for the `/privacy` text across imprints (R2). Where R1's Faro bootstrap
  lives is architecture's call.

## Dependencies
| Need | Owner | State |
|---|---|---|
| Faro bootstrap, repo variables for app keys, SLO | sre | needs sre stories; salvage from the old setup per the Notion monorepo page |
| `/privacy` text | Brian | changes only with Brian (`CLAUDE.md` §7) |
| SLO target | Brian | sre proposes, Brian sets (`.claude/roles/sre.md`) |
| `/privacy` page look | visual-designer | needs a brand citation in FEAT-01's docs |
| Page and Faro wiring in the site | implementation | after FEAT-02 |

## Decisions
- `/privacy` ships in R1 with the first site. Reason: the claim is published from the first visitor.

## Open for Brian
- The `/privacy` wording. Recommendation: you write it, or name the role that drafts it from the `CLAUDE.md` §7
  list (what is measured, what isn't, no replay, no identification) for your approval in the PR, because the claim
  is published in your name. Product doesn't write user-facing copy. If no: the page ships with whatever text you
  give.

## Sources
`CLAUDE.md` §7, §10; Notion › "Sites monorepo (solo7.media)".

## Log
- 2026-10-07: proposed
