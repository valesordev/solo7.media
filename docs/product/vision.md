# Vision — solo7.media sites

Sources: repo `CLAUDE.md` §1/§5/§7/§10; Notion › Sites monorepo (solo7.media); the four brand direction pages
(Valesor Development, System 9 Studios, Solo7 Productions) and the bashburn.com Website Redesign Project Plan.
Lines marked `[ASSUMED]` are my inference, not something a source states. Brian confirms or corrects each in
review.

## For
- **Visitors** who want to know what an imprint is, what it has released, and where the source, writing, or
  work lives: people reading the code, the fiction, the production credits, or the blog. They arrive from a
  link, a repository, an RSS reader, or a search. They read, follow a link out, and leave. `[ASSUMED]` The
  likeliest visitors are developers (Valesor), readers and viewers of the worlds (System 9, Solo7), and
  RSS-reading peers (bashburn.com).
- **Brian**, as publisher. The brand kits and agents exist so he can release work without redesigning a site
  each time.
- Not for: customers, leads, subscribers, or an audience to grow. No site here is a funnel.

## The experience
A visitor lands on a page that tells them plainly what this is, in the imprint's own voice, and shows the
work: a project row with its name, one-line purpose, stack, and license; a release; a post. Rules,
typography, and whitespace carry the layout; one illustration or photograph sets the mood. Every page reads
with JavaScript off, loads fast, and has a permanent URL. The next step is always an outbound or in-site
link to the thing itself (`View source →`), never a form. Five sites share one workflow but not one look:
each imprint is recognizable on its own and plainly related to the others.

## Is / isn't
- Is: five static sites (valesordev.com, system9studios.com, solo7productions.com, solo7.media,
  bashburn.com), each built from its own brand kit, deployed from one monorepo to Cloudflare Workers.
- Is: a record of published work. The imprint is the byline; first-person singular where a person speaks.
- Is: observed, not tracking. Grafana Faro measures the site (web vitals, performance, frontend errors), never
  the reader. The "instrumented, not tracked" claim and `/privacy` text change only with Brian.
- Isn't: marketing funnels, newsletter signups, social feeds, comments, or engagement analytics (any site,
  ever).
- Isn't: a shared component library. Imprints never share visual components; only non-visual code is shared.
- Isn't (yet): a place for Andara's World or other products' own sites. `[ASSUMED]` Project pages for
  released work arrive after each imprint's homepage, and are not planned here.
- Isn't: carried over from the old brand-kit or solo7-theme. The kits start from scratch.

## Principles
Ordered tie-breakers for product calls.
1. **Visitor first, then Brian.** If a feature serves only Brian's workflow, it ships only as the means to a
   visitor-facing release.
2. **Brand decisions live in brand docs.** A look not cited in a brand doc doesn't ship.
3. **One imprint, finished, beats five imprints begun.** Prove the workflow on Valesor Development, fix the
   process, then repeat.
4. **Describe, don't sell.** Copy says what the software or work is, its source and license; it does not
   persuade.
5. **Permanent and readable.** URLs don't break, pages work without JavaScript, and WCAG 2.1 AA is the floor.
6. **Fewer things, done in the brand's grammar.** A small set of components applied consistently over many
   variants.

## Log
- 2026-10-07: drafted from the sources above (awaiting Brian's approval in PR).
