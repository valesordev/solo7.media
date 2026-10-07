# Releases — solo7.media sites

Today: a visitor can use only the legacy solo7.media site, served from `sites/solo7.media/` on GitHub Pages.
valesordev.com, system9studios.com, solo7productions.com and bashburn.com are served from their old repos. The
monorepo has the skeleton and `make check-layout`; no brand kit, site build or Cloudflare deploy exists yet
(repo state at `origin/main` 8199926; no sprint demo exists yet; no `docs/roadmap.md` yet).

Sources: `docs/product/vision.md`; `.claude/roles/product.md` (sequencing, Brian 2026-10-07); Notion › "Sites
monorepo (solo7.media)" (phases, R1 = pipeline + Valesor end to end); Notion › Valesor Development › "Brand Kit
Project Direction" (first milestone, build sequence, component list). Lines marked `[ASSUMED]` are my inference.

## R1 — Valesor Development, end to end *(status: proposed)*
For: visitors to valesordev.com (developers reading the code and licenses). Brian, as publisher: R1 also proves
the workflow every later release reuses.
Promise: a visitor lands on valesordev.com, sees plainly that Valesor Development is the imprint for publicly
released software, sees each released project with its stack and license, and follows a link to the source.
The page is the one in the Valesor target image, built from the new brand kit, readable with JavaScript off, and
the site measures itself, never the reader.
Bet: one imprint can go from Notion brief to a live Cloudflare site through the roles and `make` targets alone,
with no branding decided in code. If that holds, the same workflow serves the other imprints; if it doesn't, the
process gets fixed before R2 starts.
Features:
- FEAT-?? — Valesor brand kit v1 (must): foundation, voice, visual language, tokens, illustration system, hero
  art and marks, `qa.md`; the target homepage is the specimen.
- FEAT-?? — valesordev.com homepage (must): the target homepage, with the project list drawn from released
  projects and every project row linking to its source.
- FEAT-?? — Site deploys and cutover (must): preview on every PR, production on merge, valesordev.com DNS
  moved from the old repo's hosting. Visitor-visible effect: the site is up and fast at its permanent address.
- FEAT-?? — Instrumented, not tracked (must): Faro per `CLAUDE.md` §7 and the `/privacy` page, which changes only
  with Brian.
- FEAT-?? — Link-preview card (cut-first): an Open Graph image for valesordev.com. `[ASSUMED]` Visitors often
  arrive from a shared link.
Cut line: no project detail pages, README template, or documentation landing page (the Notion brief lists them as
later reference implementations; the vision says project pages aren't planned yet). No other imprint's work. No
new copy beyond what the homepage target shows. Why: R1 must prove the workflow, not widen the site.
Success signals:
- Brian opens valesordev.com on the production Cloudflare URL and sees the target homepage, light and dark if
  the kit has both, mobile and desktop, JavaScript off (demo step, run by Brian).
- `/brand-qa` passes against `brands/valesordev/qa.md` on that page (visual-designer).
- A PR to the site gets a preview URL, and merging deploys production, using only `make` targets (sre).
- Faro shows web vitals and errors for the site with no user identification, and `/privacy` matches
  `CLAUDE.md` §7 (sre verifies; Brian approves the text).
- A short process-fixes list from R1 exists in the sprint closeout, with each item fixed or ticketed before R2
  starts (pm).
Delivered by: not yet planned.

## R2 — System 9 Studios and Solo7 Productions *(status: proposed)*
For: visitors who want to know what the creative studio and the producer org are, and what they have made.
Promise: system9studios.com and solo7productions.com are live from their own brand kits and target homepages,
each recognizable on its own, with the credit line ("Soft Disclosure — produced by Solo7 Productions. Written and
animated by System 9 Studios. Tooling by Valesor Development.") shown the same way on both.
Bet: the R1 workflow repeats for a different imprint at a fraction of the effort, and two related brands can ship
side by side without converging (Solo7 Productions' brief asks that the three organizations not converge).
Features:
- FEAT-?? — System 9 Studios brand kit and homepage (must)
- FEAT-?? — Solo7 Productions brand kit and homepage (must)
- FEAT-?? — Shared credit line and `/privacy` text from `packages/` (must): one non-visual source, imprints
  keep their own look.
- FEAT-?? — Site deploys and cutover for both domains (must)
Cut line: no new page types beyond each homepage unless a brand brief demands it. No bashburn.com or solo7.media.
Why: two homepages are enough to test repetition and divergence.
Success signals:
- Both homepages are live on Cloudflare and pass `/brand-qa` against their own `qa.md` (visual-designer).
- Brian can tell the two apart and the Valesor site from either with the brand marks hidden (Brian's review at the
  R2 go/no-go). `[ASSUMED]` This is the observable form of "don't converge".
- The credit line text appears identically on both from the one `packages/` source (architecture).
- Net effort per site is below R1's, from the sprint closeouts (pm).
Delivered by: not yet planned.

## R3 — bashburn.com *(status: proposed)*
For: readers of Brian's field journal, and RSS-reading peers.
Promise: bashburn.com is live from the monorepo with its existing posts and talks, readable with JavaScript off,
with a working feed, and every existing URL still resolves (`CLAUDE.md` §5, permanent URLs).
Bet: the workflow also carries a content-heavy site where the content, not the layout, is the point.
Features:
- FEAT-?? — bashburn.com brand kit and site (must)
- FEAT-?? — Posts and talks carried over with their URLs, or redirected (must)
- FEAT-?? — Feed (must) `[ASSUMED]` since the visitors are RSS readers
- FEAT-?? — Site deploys and cutover (must)
Cut line: no comments, newsletter, social feeds or analytics (`CLAUDE.md` §10). No new writing; carrying over what
exists is the job.
Success signals:
- Every pre-cutover URL returns the page or a redirect (check against the old site's sitemap; sre).
- The feed validates and an RSS reader shows the latest post (demo step, Brian).
- `/brand-qa` passes against `brands/bashburn/qa.md` (visual-designer).
Delivered by: not yet planned.

## Not scheduled
- **solo7.media**: waits for Brian's homepage design (Brian, 2026-10-07). The legacy site keeps deploying from
  `sites/solo7.media/` and retires when its replacement is on Cloudflare. It joins a release when the design
  exists; that is Brian's call, so no release names it yet.
- Project detail pages, a README template, and a documentation landing page for Valesor. Revisit after R1's
  review.

## Log
- 2026-10-07: first plan, three releases in Brian's sequence (Valesor, then System 9 and Solo7 Productions, then
  bashburn.com; solo7.media waits). R2 pairs System 9 and Solo7 Productions because they credit each other and
  must not converge, so one release tests both. Awaiting Brian's review in the PR.
