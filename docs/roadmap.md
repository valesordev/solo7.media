# Roadmap

PM's milestones, each targeting a release in `docs/product/releases.md`. Release scope and feature definitions are
product's; a gate that can't hold without changing them opens a `product` issue. R2 and R3 get milestones at their
sprint boundary.

## R1 — Valesor Development, end to end

#### M1 — Valesor kit decided *(gate: audit, brand docs, tokens, illustration system, hero art, marks, and `qa.md` merged, no `[PROPOSED]` left)*
Release: R1 — FEAT-01
Needs: none
Stories: S7M-VAL-002, S7M-VAL-003 (docs), S7M-VAL-005 (package shell), S7M-VAL-013 (docs amendment: `ProjectRow` for work in development, and the "released in the open" subhead), S7M-VAL-006 (tokens), S7M-VAL-007 (illustration system), S7M-VAL-008 (hero art and marks), S7M-VAL-009 (`qa.md`)
Visitor-visible: none: enables FEAT-02

#### M2 — Preview pipeline *(gate: a PR to `sites/valesordev.com` gets a Cloudflare preview URL using only `make` targets)*
Release: R1 — FEAT-03 (pipeline)
Needs: none
Stories: S7M-VAL-001, S7M-VAL-004, S7M-INF-002, S7M-INF-001 (all done in SPRINT-01); and the CI story that runs `make check` on every PR (cut in SPRINT-02)
Visitor-visible: none: enables FEAT-03's cutover; Brian sees the stub at a preview URL

#### M3 — Homepage on preview *(gate: FEAT-02's whole success signal passes on a preview URL, `/brand-qa` included: the target homepage layout with its three rows, their statuses and links, and WCAG 2.1 AA)*
Release: R1 — FEAT-02
Needs: M1 (including S7M-VAL-013) and M2
Stories: S7M-VAL-014 (`projects.json`), S7M-INF-004 (project list check and verify), S7M-VAL-011 and S7M-INF-003 (brand-import lint in `make check`); the homepage component stories (`Hero`, `ProjectRow`, `TechnicalMetadata`) and the page story are cut at the SPRINT-03 boundary, once M1's tokens exist. `BrandHeader`, `Footer`, `SectionRule`, and `TextLink` (S7M-VAL-015 to S7M-VAL-017) are built for M4 and reused here.
Visitor-visible: none: enables FEAT-03's cutover; Brian sees the target homepage at a preview URL

#### M4 — Instrumented, not tracked *(gate: Faro per `CLAUDE.md` §7 and an approved `/privacy` page on the preview; SLO before alert; a captured page-view request shows no user identifier or personal data; a build without Faro config sends nothing; a page view and a forced error appear in Grafana with no user attributes)*
Release: R1 — FEAT-04
Needs: M3
Stories: S7M-VAL-010 (`site-core` shell), S7M-INF-005 (`initFaro`), S7M-VAL-012 (`/privacy` page) with its components S7M-VAL-015 to S7M-VAL-018; the Faro wiring and SLO stories are cut after S7M-INF-005
Visitor-visible: `/privacy` states what is and isn't measured

#### M5 — Production cutover *(gate: apex and `www` serve the new site with valid TLS; a merge to `main` deploys production through `make` targets; old URLs return the page or a redirect; rollback rehearsed before and drilled after Brian's go)*
Release: R1 — FEAT-03 (cutover)
Needs: M3, M4
Stories: none yet; cut at the SPRINT-03 boundary (production deploy, DNS and TLS, redirects, rollback runbook), after the production-deploy ADR
Visitor-visible: valesordev.com is the new site

## Log
- 2026-10-07: first roadmap, answering the `release-change` issue #7. SPRINT-01 targets M2 and the start of M1.
- 2026-10-09: answering `release-change` issue #40 (R1's homepage lists projects in development). M1 reopened: its stories
  include S7M-VAL-013, the brand-docs amendment for a status part and a linkless `ProjectRow`, with the subhead question
  for visual-designer. M3's gate keeps FEAT-02's whole success signal and names its three rows, and M3 also waits on #39. M3's visitor-visible change is
  unchanged. Added to SPRINT-01, which still targets M2 and the start of M1.
- 2026-10-09: product's PR #46 closed FEAT-02's project-list dependency (#39, ADR 0001 §6: a hand-curated
  `sites/valesordev.com/src/data/projects.json`) and the site-structure row (ADR 0001 §1-§3, §7). M3 no longer needs #39;
  it still needs M1 (S7M-VAL-013) and M2. Gates, releases, and visitor-visible changes are unchanged.
- 2026-10-10: SPRINT-01 close-out. Answering `release-change` #7, #40, #54, #58: M1 to M5 now list their stories (the board's
  mapping from the R1 review), the M3 page and M5 stories are deferred to the SPRINT-03 boundary as #58 asks, and #7, #40, #54 are
  closed. Gates, releases, and visitor-visible changes are unchanged.
