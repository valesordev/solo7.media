# FEAT-02 — valesordev.com homepage
Status: proposed
Release: R1 (must)

## Problem
A visitor can't learn from valesordev.com, built from this repo, what Valesor Development is or what it has
released: no site exists in `sites/` for it. `[ASSUMED]` The live site is served from its old repo (`CLAUDE.md` §1).

## Outcome
A visitor lands on valesordev.com, sees plainly that Valesor Development is the imprint for publicly released
software, sees each released project, and follows a link to its source. It reads the same with JavaScript off.

## Success signal
Checked first on a preview URL (this gates FEAT-03's cutover), then confirmed on production in the R1 demo. Brian
opens the site on mobile and desktop, JavaScript off, and:
1. sees the target homepage, built from the kit's tokens and components, light and dark if the kit has both
   (`/brand-qa` passes; visual-designer);
2. compares the rendered rows with the project list Brian approved: the same projects, none missing, none extra;
3. follows every project row to its source repository, each of which resolves (Brian);
4. passes a WCAG 2.1 AA check on the page (implementation, recorded on the story).

## Scope
- In: the homepage from the target image, with the project list as rows. `[ASSUMED]` Stack and license appear on
  each row; the brand docs decide the row's contents.
- Out: project detail pages, README template, documentation landing page (not planned yet, per the vision).
- Out: contact forms, newsletter, "get started" calls to action (`CLAUDE.md` §10).
- Out: the link-preview card (cut-first in R1).

## Dependencies
| Need | Owner | State |
|---|---|---|
| Brand docs, tokens, components spec for the homepage | visual-designer | FEAT-01 |
| Site structure: how `sites/valesordev.com` consumes `brands/valesordev`, workspaces | architecture | needs architecture (ADR or spec; none in `docs/adr/` yet) |
| Components and page | implementation | needs stories citing FEAT-01's brand docs |
| Which projects are listed, and the list's source | Brian | see Open |

## Decisions
- Project rows link to the source repository, not to a Valesor-hosted project page. Reason: the vision ("next step
  is always a link to the thing itself") and no project pages in R1.
- The legacy valesordev projects generator is a candidate to reuse, not a requirement. Reason: the Notion
  monorepo page says to salvage what's worth keeping; architecture decides.

## Open for Brian
- Which projects appear at launch. Recommendation: every project with a public repository and a license at the
  time of cutover, because the brand is "publicly released software" and that is checkable. If no: you give the
  list and it ships as written.

## Sources
Notion › Valesor Development › "Brand Kit Project Direction"; Notion › "Sites monorepo (solo7.media)"; vision.md;
`CLAUDE.md` §5, §10.

## Log
- 2026-10-07: proposed
