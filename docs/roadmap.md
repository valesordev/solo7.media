# Roadmap

PM's milestones, each targeting a release in `docs/product/releases.md`. Release scope and feature definitions are
product's; a gate that can't hold without changing them opens a `product` issue. R2 and R3 get milestones at their
sprint boundary.

## R1 — Valesor Development, end to end

#### M1 — Valesor kit decided *(gate: audit, brand docs, tokens, illustration system, hero art, and `qa.md` merged, no `[PROPOSED]` left)*
Release: R1 — FEAT-01
Visitor-visible: none: enables FEAT-02

#### M2 — Preview pipeline *(gate: a PR to `sites/valesordev.com` gets a Cloudflare preview URL using only `make` targets)*
Release: R1 — FEAT-03
Visitor-visible: none: enables FEAT-03's cutover; Brian sees the stub at a preview URL

#### M3 — Homepage on preview *(gate: FEAT-02's success signal passes on a preview URL, `/brand-qa` included)*
Release: R1 — FEAT-02
Visitor-visible: none: enables FEAT-03's cutover; Brian sees the target homepage at a preview URL

#### M4 — Instrumented, not tracked *(gate: Faro per `CLAUDE.md` §7 and an approved `/privacy` page on the preview; SLO before alert)*
Release: R1 — FEAT-04
Visitor-visible: `/privacy` states what is and isn't measured

#### M5 — Production cutover *(gate: apex and `www` serve the new site with valid TLS; old URLs return the page or a redirect; rollback rehearsed before and drilled after Brian's go)*
Release: R1 — FEAT-03
Visitor-visible: valesordev.com is the new site

## Log
- 2026-10-07: first roadmap, answering the `release-change` issue #7. SPRINT-01 targets M2 and the start of M1.
