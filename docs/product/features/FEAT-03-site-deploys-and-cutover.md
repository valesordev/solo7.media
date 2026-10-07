# FEAT-03 — Site deploys and valesordev.com cutover
Status: proposed
Release: R1 (must)

## Problem
`[ASSUMED]` A live valesordev.com exists, served from its old repo. Nothing in this repo deploys to
Cloudflare: `make check` runs only layout checks (`Makefile`), and the only deploying site is the legacy
solo7.media on GitHub Pages. Without a pipeline the homepage never reaches a
visitor, and Brian can't review a change at a URL before it goes live.

## Outcome
A visitor reaches the new valesordev.com at its permanent address, and every URL that worked before still
works or redirects. Brian sees any change at a preview URL before merge.

## Success signal
In the R1 demo, run by sre and watched by Brian:
1. a PR to the site gets a preview URL and merging deploys production, using only `make` targets (`CLAUDE.md` §9);
2. valesordev.com serves the new site over HTTPS;
3. every URL the old site published returns the page or a redirect (checked against the old repo's published
   sitemap or build output; sre confirms the source);
4. the rollback to the old hosting has been run once before cutover and works.

## Scope
- In: Cloudflare Workers static assets for `sites/valesordev.com`, preview on PRs, production on merge, DNS and TLS
  for valesordev.com, redirects for moved URLs, a rollback runbook.
- Out: other domains (R2, R3). The legacy solo7.media GitHub Pages deploy stays as is until its replacement exists.
- Out: observability (FEAT-04).

## Dependencies
| Need | Owner | State |
|---|---|---|
| Cloudflare API token and account ID as repo secret and variable | Brian | open item on the Notion "Sites monorepo" page |
| Workflow, `wrangler.jsonc`, `Makefile` targets, DNS/TLS | sre | needs sre stories |
| Per-site Workers build structure | architecture | needs architecture |
| Redirect scheme for moved URLs (URL permanence) | architecture | needs an ADR |
| The site to deploy | implementation | FEAT-02 |

## Decisions
- Cutover happens only after the homepage passes the FEAT-02 success signal on a preview. Reason: a visitor should
  never see the site worse than the old one.
- The old hosting stays available until the new site has run in production for a period sre sets in the runbook.
  Reason: rollback needs something to roll back to.
- One feature, not two (pipeline, then cutover). Reason: the pipeline alone gives a visitor nothing, and the
  cutover can't happen without it. Brian's go stays a separate, cheap decision below.

## Open for Brian
- The go for the production cutover (outward-facing). Recommendation: approve after the FEAT-02 preview passes and
  the rollback has been tested, because both are observable. If no: the pipeline ships and the old site stays
  live until you say.

## Sources
Notion › "Sites monorepo (solo7.media)" (hosting decision, open items); `CLAUDE.md` §5, §8, §9; `Makefile`.

## Log
- 2026-10-07: proposed
