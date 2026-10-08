# 0001. Site structure: how a site consumes its brand, and how it deploys

Status: proposed (Brian rules at PR review)
Date: 2026-10-07
Story: S7M-VAL-001
Serves: R1; FEAT-02, FEAT-03, FEAT-04

## Context
`sites/valesordev.com` is the first site built in this repo. Implementation (the site), the visual-designer (the
brand kit it consumes) and sre (Cloudflare, Faro) all start from this decision, and the other three sites repeat
it. Constraints from `CLAUDE.md`: static output, readable with JavaScript off (§5); tokens only, no literals in
components (§5); imprints never share visual components (§5); every step is a `make` target (§9); Faro
instruments the site, never the reader (§7).

The legacy `sites/solo7.media` has its own `package-lock.json` and installs from GitHub Packages. It is not part
of this structure and must stay buildable on its own until its replacement exists.

## Decisions

### 1. Workspaces and package names
The root `package.json` lists workspaces explicitly: `packages/*`, `brands/*`, and one entry per rebuilt site
(`sites/valesordev.com` now; the others are added by the story that creates the site). It does **not** use
`sites/*`, because that would pull the legacy `sites/solo7.media` into the root install and lockfile.

| Path | Package name | Contains |
|---|---|---|
| `brands/<slug>/` | `@solo7/brand-<slug>` | tokens, components, assets; its `exports` map is the only way a site reaches in |
| `sites/<domain>/` | `@solo7/site-<domain with dots as dashes>` | the Astro app, `wrangler.jsonc`, nothing visual of its own |
| `packages/site-core/` | `@solo7/site-core` | non-visual code shared by sites (Faro bootstrap, credit line, `/privacy` text in R2) |

One root `package-lock.json` (generated). `tsconfig.base.json` is the shared TypeScript base; each site and
package extends it.

### 2. How a site consumes its brand
A site depends on `@solo7/brand-<slug>` (workspace dependency) and imports only through that package's
`exports`:

| Import | Resolves to |
|---|---|
| `@solo7/brand-valesordev/tokens.css` | `brands/valesordev/dist/tokens.css` (generated from `tokens/tokens.json`) |
| `@solo7/brand-valesordev/components/<Name>.astro` | `brands/valesordev/components/<Name>.astro` |
| `@solo7/brand-valesordev/assets/<path>` | `brands/valesordev/dist/assets/<path>` (treated, built output only) |

Rules:
- A site imports tokens once, in its base layout, and components by package name. No relative path crosses from
  `sites/` into `brands/`.
- A site depends on exactly one brand. A site never imports another brand's components, and `packages/` holds no
  component with a look. This is how "imprints never share visual components" is enforced: a lint-able import
  rule (`@solo7/brand-*` other than the site's own is an error), added with the first site.
- `brands/<slug>/dist/` is built by the brand's `brand.mk` and is a prerequisite of the site build. A site build
  on a clean checkout runs the brand build first; the `Makefile` expresses that dependency.
- Pages compose brand components and pass content in as props. A page or layout in `sites/` carries no color,
  font, or spacing literal. If a page needs a look the brand doesn't have, that is a brand question for the
  visual-designer, not a site-local style.

### 3. Astro and static output
Each site is an Astro app with `output: 'static'`, no SSR adapter, and no client framework in R1. Client JS is
optional enhancement only: every page's content and navigation work with it off. `astro.config.mjs` sets `site`
to the production origin and `trailingSlash: 'always'`, so each page builds to `<route>/index.html` and a URL has
one spelling. Redirects for moved URLs are out of scope here and get their own ADR before cutover.

### 4. Cloudflare Workers static assets, per site
- Build output: `sites/<domain>/dist/`, the Astro default. Generated, never hand-edited.
- Deploy config: `sites/<domain>/wrangler.jsonc` (sre's), assets-only, with no Worker script:
  `assets.directory` is `./dist`, `assets.not_found_handling` is `404-page` (Astro emits `404.html`). The Worker
  name is the domain slug (`valesordev-com`).
- One Worker per site; no site shares a Worker or a `dist/` with another.
- `make` targets (names the stories rely on; sre owns the Makefile and may add prerequisites, not rename):

  | Target | Does |
  |---|---|
  | `build-brand-<slug>` | brand tokens and assets to `brands/<slug>/dist/` (the brand's `brand.mk`) |
  | `build-site-<slug>` | depends on `build-brand-<slug>`; writes `sites/<domain>/dist/` |
  | `preview-site-<slug>` | build, then deploy a preview version; prints the URL |
  | `deploy-site-<slug>` | build, then deploy production |

  `<slug>` is the brand slug (`valesordev`), the same key as `brands/<slug>/`. `make check` runs
  `build-site-<slug>` for every site that exists, so a broken build fails the PR gate.
- Credentials come from the environment (repo secret and variable); no target reads them from a file in the repo.

### 5. Faro bootstrap lives in `packages/site-core/instrumentation/`
This matches `packages/README.md`. `@solo7/site-core` exports an `initFaro(config)` that:
- is a no-op when config is absent, so a build without keys works and sends nothing (FEAT-04 signal 2);
- takes app keys from build-time `PUBLIC_FARO_*` variables, which the build target passes through from repo
  variables, never from committed files;
- hard-codes the §7 posture (Session Replay off, volatile sessions, no user identification, explicit sampling) so
  a site cannot override it by config.

Sites call it from one layout script. Nothing visual lives in `site-core`. The `/privacy` text moves to
`site-core` in R2 (FEAT-04); in R1 it is a page in `sites/valesordev.com`, linked from the footer component.

### 6. The legacy projects generator: reuse the approach, re-home the rule
The old `valesordev.com` repo's `make projects` runs `gh repo list valesordev --topic released --no-archived`
and writes a **committed** `src/data/projects.json`. Yes, it is reused (FEAT-02), because it is the part of that
site worth keeping: the list can't decay between bursts of work, and the committed output keeps builds offline and
reproducible. Changes:
- Target `projects-valesordev` in the root `Makefile` writes `sites/valesordev.com/src/data/projects.json`. It
  is generated, committed, and never hand-edited. The build reads the file and never calls `gh`.
- Field set carries over (`name`, `description`, `url`, `language`, `updatedAt`, `stars`, `spdx`). Which fields a
  row shows is the brand docs' call, not the data's.
- Selection stays the `released` topic. FEAT-02's open question (which projects launch) is Brian's; the
  recommendation there (public repo with a license) is a filter on this same query and does not change the
  structure. The generator must drop any repo without a license, so the data can't include a project the site
  would have to describe as unlicensed.
- Row content is checked by `make check`: the file parses, and every entry has `name`, `url`, `spdx`.
- Refresh is a manual `make projects-valesordev` plus a PR. A scheduled refresh is a later sre decision.

### 7. Page and route conventions
`src/pages/` holds routes only, with one `.astro` file per URL. Routes: `/`, `/privacy/`, and a `404.astro`.
Content that is data (the project list) lives in `src/data/`. R1 has no content collections.

## Consequences
- Implementation can build the skeleton (S7M-VAL-004) and brand components against a fixed import contract;
  visual-designer's `brand.mk` and `package.json` for `brands/valesordev` have a fixed target and export shape.
- sre has fixed target names, a `wrangler.jsonc` location and shape, and a Faro location. Renaming any of them
  is an ADR amendment.
- Adding a site is mechanical: workspace entry, `@solo7/brand-<slug>` dependency, `wrangler.jsonc`, four targets.
- One lockfile means one dependency set across sites. If a site needs a divergent Astro version it leaves the
  workspace, which this ADR does not allow in R1.
- The legacy `sites/solo7.media` stays outside the workspaces until its rebuild. That site's own root-of-site
  install still works, since it has no dependency on the root.

## Alternatives considered
- **Per-site vendored copy of the brand** (what the old repo did with `vendor-brand-kit`): rejected. Drift is
  the failure mode; the monorepo exists to land brand and site changes in one PR.
- **`sites/*` workspace glob**: rejected for now because of the legacy site (see above). Revisit when it is
  rebuilt.
- **A shared `ui` package**: rejected by §5 (imprints never share visual components).
- **Generating the project list at build time**: rejected; a GitHub or `gh` outage would be a build failure, and
  the build would not be reproducible.

## Follow-on stories (for PM to cut)
1. **brand package contract (visual-designer):** `brands/valesordev/package.json` (`@solo7/brand-valesordev`
   with the `exports` map above) and `brand.mk` targets `build-brand-valesordev`. Needs the audit and brand docs
   first for anything visual; the package shell does not.
2. **`site-core` package with the Faro bootstrap (sre or implementation; PM routes to whoever owns
   `packages/site-core/`):** `initFaro`, with tests for the no-op and the fixed posture. FEAT-04.
3. **Site skeleton (S7M-VAL-004), amended:** `@solo7/site-valesordev-com`, workspace entry, `tsconfig`
   extending the base, `build-site-valesordev`, wired into `make check`.
4. **Brand-import lint (implementation, with sre for `make check`):** the rule in decision 2.
5. **Projects generator (sre owns the Makefile, implementation owns the site data):** `projects-valesordev` and
   its `make check` validation. FEAT-02.
6. **Preview and production deploy (S7M-INF-001, then a production story, sre):** `preview-site-valesordev`,
   `deploy-site-valesordev`, `wrangler.jsonc`.
7. **Redirect scheme / URL permanence ADR (architecture), before cutover.** Not blocked by this ADR; it needs the
   old site's published URL list.
8. **Site-specific `/privacy` page (implementation), after the brand docs cite its template.** FEAT-04.
