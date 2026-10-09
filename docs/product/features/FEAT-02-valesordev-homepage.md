# FEAT-02 — valesordev.com homepage
Status: proposed
Release: R1 (must)

## Problem
A visitor can't learn from valesordev.com, built from this repo, what Valesor Development is or what it is working
on: no site exists in `sites/` for it. `[ASSUMED]` The live site is served from its old repo (`CLAUDE.md` §1).
Brian has no released projects yet, so a list of released work would be empty.

## Outcome
A visitor lands on valesordev.com, sees plainly that Valesor Development is the imprint for publicly released
software, sees the projects it is developing now with each one's status (in progress or concept), and follows a
link to the source where one exists. It reads the same with JavaScript off.

## Success signal
Checked first on a preview URL (this gates FEAT-03's cutover), then confirmed on production in the R1 demo. Brian
opens the site on mobile and desktop, JavaScript off, and:
1. sees the target homepage layout with the three rows below, built from the kit's tokens and components, light and dark if the kit has both
   (`/brand-qa` passes; visual-designer);
2. sees exactly three project rows, in this order: Andara's World (in progress), Vagabond (in progress), System 9
   Studios Pipeline (concept), each with its status in words, none missing, none extra;
3. follows the Andara's World and Vagabond rows to their public repositories, each of which resolves; the System 9
   Studios Pipeline row has no link and no placeholder, because it has no repository yet (Brian);
4. passes a WCAG 2.1 AA check on the page (implementation, recorded on the story).

## Scope
- In: the homepage from the target image, with the project list as rows, each row stating its status. The brand
  docs decide the row's other parts, including for a row with no repository.
- In: a row for a project with no repository, which has no link.
- Out: project detail pages, README template, documentation landing page (not planned yet, per the vision).
- Out: contact forms, newsletter, "get started" calls to action (`CLAUDE.md` §10).
- Out: the link-preview card (cut-first in R1).
- Out: any status beyond "in progress" and "concept", and any "released" row, until a project is released.

## Dependencies
| Need | Owner | State |
|---|---|---|
| Brand docs, tokens, components spec for the homepage | visual-designer | FEAT-01 |
| `ProjectRow` for in-development work: a status part, and a row with no link or repository data. `brands/valesordev/brand/usage.md` today forbids a status badge, rows with different parts, and a missing value shown as a blank, and says one link per row to the source repository | visual-designer | needs visual-designer: amend the brand docs before the row is built; the look is theirs. The amendment reopens M1's gate in `docs/roadmap.md` and holds M3, so pm re-cuts both |
| Whether the homepage copy that says "released" ("Software, tools, and systems, released in the open." `voice.md`, `visual-language.md`) still holds while nothing is released | visual-designer | needs visual-designer; see Decisions |
| Site structure: how `sites/valesordev.com` consumes `brands/valesordev`, workspaces | architecture | needs architecture (ADR or spec; none in `docs/adr/` yet) |
| Components and page | implementation | needs stories citing FEAT-01's brand docs |
| Project list and statuses | Brian | decided 2026-10-09, see Decisions |

## Decisions
- The launch list is Andara's World, Vagabond, and System 9 Studios Pipeline, in that order. Reason: Brian's list
  (2026-10-09); he has no released projects yet.
- Statuses are "in progress" and "concept", shown in words. Reason: Brian's terms; the page must not suggest
  released work (vision principle 4, describe, don't sell). Color is never the only signal (`visual-language.md`).
- A row links to a repository only if a public one exists. Reason: Brian (2026-10-09), "a row with no link is fine";
  a made-up or placeholder link would be invented data.
- Andara's World and Vagabond rows link to their public repositories, not to a Valesor-hosted page. Reason: the
  vision ("next step is always a link to the thing itself") and no project pages in R1.
- The System 9 Studios Pipeline is listed under Valesor because Brian develops it here for the studio to use.
  Reason: Brian (2026-10-09). The wording of its row is the voice doc's.
- The imprint's definition does not change. Valesor is still the imprint for publicly released software; the page
  shows what is in development until the first release. Reason: the definition is Brian's and the brand's, and
  nothing here needs it moved. If the "released" wording on the page reads as untrue, that is a copy decision for
  visual-designer, not a change to the vision.
- The legacy valesordev projects generator is a candidate to reuse, not a requirement. Reason: the Notion
  monorepo page says to salvage what's worth keeping; architecture decides.

## Open for Brian
- None. Replaced the question "which projects appear at launch" with the list above.

## Sources
Notion › Valesor Development › "Brand Kit Project Direction"; Notion › "Sites monorepo (solo7.media)"; vision.md;
`brands/valesordev/brand/usage.md` (project row), `voice.md`, `visual-language.md`; `CLAUDE.md` §5, §10;
Brian in session, 2026-10-09.

## Log
- 2026-10-07: proposed
- 2026-10-09: revised per Brian: the homepage lists three projects in development (two with public repositories,
  one concept with no link), not released projects. Success signal, scope, dependencies, and decisions changed;
  the open question on the launch list is closed.
