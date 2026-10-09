# Vision — solo7.media sites

Sources: repo `CLAUDE.md` §1/§5/§7/§10 and `.claude/roles/product.md`; Notion › "Sites monorepo (solo7.media)";
the "Brand Kit Project Direction" pages for Valesor Development, System 9 Studios, and Solo7 Productions;
the "Website Redesign Project Plan" for bashburn.com; Brian's hosting decision in session, 2026-10-07. Lines
marked `[ASSUMED]` are my inference, not something a source states. Brian confirms or corrects each in review.

## For
- **Visitors** who want to know what an imprint is, what it has released or is working on, and where the source, writing, or
  work lives: people reading the code, the fiction, the production credits, or the blog. `[ASSUMED]` They arrive
  from a link, a repository, an RSS reader, or a search, read, follow a link out, and leave. The
  likeliest visitors are developers (Valesor), readers and viewers of the worlds (System 9, Solo7), and
  RSS-reading peers (bashburn.com).
- **Brian**, as publisher. The brand kits and agents exist so he can release work without redesigning a site
  each time.
- Not for: customers, leads, subscribers, or an audience to grow. No site here is a funnel.

## The experience
A visitor lands on a page that tells them plainly what this is, in the imprint's own voice, and shows the
work itself: a project, a release, a post. How each site lays that out, and what its links say, is decided in
its brand docs, not here. Every page reads with JavaScript off and has a permanent URL (`CLAUDE.md` §5). The
next step is always a link to the thing itself, never a form. `[ASSUMED]` The sites should load fast. Five
sites share one workflow but not one look. `[ASSUMED]` Each imprint should be recognizable on its own and
plainly related to the others; Solo7 Productions' brand page asks that the three organizations not converge.

## Is / isn't
- Is: five static sites (valesordev.com, system9studios.com, solo7productions.com, solo7.media,
  bashburn.com), each built from its own brand kit in one monorepo and deployed to Cloudflare. The legacy
  solo7.media site on GitHub Pages will be retired (Brian, 2026-10-07). `[ASSUMED]` It retires when its
  replacement deploys to Cloudflare; until then it stays up.
- Is: a record of published work and, until the first release, of work in development, labelled with its status. `[ASSUMED]` The imprint is the byline; voice rules (for example whether
  first-person singular is used) are each brand's `voice.md`.
- Is: observed, not tracking. Grafana Faro measures the site (web vitals, performance, frontend errors), never
  the reader. The "instrumented, not tracked" claim and `/privacy` text change only with Brian.
- Isn't: marketing funnels, newsletter signups, social feeds, comments, or engagement analytics (any site,
  ever).
- Isn't: a shared component library. Imprints never share visual components; only non-visual code is shared.
- `[ASSUMED]` Isn't (yet): a home for individual products' own sites (for example Andara's World), or
  project pages for released work or work in development. Those come after each imprint's homepage and aren't planned here.
- Isn't: carried over from the old brand-kit or solo7-theme. The kits start from scratch
  (`.claude/roles/product.md`, sequencing).

## Principles
Ordered tie-breakers for product calls.
1. `[ASSUMED]` **Visitor first, then Brian.** If a feature serves only Brian's workflow, it ships only as the means to a
   visitor-facing release.
2. **Brand decisions live in brand docs.** A look not cited in a brand doc doesn't ship (`CLAUDE.md` §5).
3. **One imprint, finished, beats five imprints begun.** Prove the workflow on Valesor Development, fix the
   process, then repeat.
4. `[ASSUMED]` **Describe, don't sell.** Copy says what the software or work is, its source and license; it does not
   persuade.
5. **Permanent and readable.** The floor is `CLAUDE.md` §5: permanent URLs, no JavaScript required, WCAG 2.1 AA.
6. `[ASSUMED]` **Fewer things, done in the brand's grammar** over many variants.

## Log
- 2026-10-07: drafted from the sources above (awaiting Brian's approval in PR).
- 2026-10-07: all sites deploy to Cloudflare; the legacy solo7.media site will be retired (decided by Brian in
  session; confirmation in PR #5).
- 2026-10-09: nothing is released yet, so valesordev.com lists projects in development with their status (Brian, in
  session). The imprint's definition (publicly released software) is unchanged.
