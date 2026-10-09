# 0001. Site structure: how a site consumes its brand, and how it deploys

Status: accepted (Brian, 2026-10-08)
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

One root `package-lock.json` (generated). `tsconfig.base.json` (new in this change) is the shared TypeScript base; each site and
package extends it. It extends Astro's `strict` preset, so the first site must depend on `astro`.

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
one spelling. This spelling (for example `/privacy/`, which the legacy site serves as `/privacy`) is provisional
until the redirect ADR. Redirects for moved URLs are out of scope here and get their own ADR before cutover.

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

### 6. The project list: a curated committed file, checked offline, verified online
Amended 2026-10-09 (issue #39): nothing is released yet, so the R1 list is the three projects in development
(FEAT-02), one with no repository. The legacy approach (`gh repo list --topic released`, drop unlicensed) cannot
produce that list, so R1 does not use it. The `released` topic selection is dropped until a project is released.

- Source: `sites/valesordev.com/src/data/projects.json`, committed and **hand-curated** (implementation's). Array
  order is display order. The build reads the file and never calls `gh`, so builds stay offline and reproducible.
- Schema, one object per project:

  | Field | Required | Rule |
  |---|---|---|
  | `name` | yes | non-empty string |
  | `status` | yes | `"in-progress"` or `"concept"`. `"released"` is added by an ADR amendment with the first release |
  | `description` | yes | non-empty string |
  | `url` | no | the public repository, `https://github.com/valesordev/<repo>`. Absent when no repository exists; never a placeholder, empty string, or `null` |
  | `spdx` | no | the repository's SPDX license id. Absent when `url` is absent; may be absent with a `url` if the repo has no license |

  Which fields a row shows, the status words, and how a linkless row looks are the brand docs' call. A future
  `"released"` entry must have `url` and `spdx`.
- The first three entries, in order: Andara's World (`in-progress`, `url`), Vagabond (`in-progress`, `url`),
  System 9 Studios Pipeline (`concept`, no `url`, no `spdx`). The `status` value is stored as data; the words a
  visitor reads are the voice doc's, so `"in-progress"` is a data value, not display text. The two repositories
  are `https://github.com/valesordev/andara.valesordev.com` and `https://github.com/valesordev/vagabond.valesordev.com`
  (public; `andara.solo7.media` is private and must never be linked). The `released` topic is not an R1 input.
- Offline check (`make check`, sre's target `check-projects-valesordev`): the file parses; is a non-empty array; every
  entry meets the schema, with no unknown fields; names are unique; an entry with `spdx` has `url`; every `url`
  matches the pattern above.
- The offline check is structural by design. Which projects appear, and in what order, is Brian's call at PR review
  (FEAT-02 signal 2), so adding a project needs no ADR change.
- Online verification, `make projects-valesordev` (sre's; not part of `make check`, since it needs network and
  `gh`): for each entry with a `url`, confirms the repository exists and is public, and prints any difference
  between the repository's license and the entry's `spdx`. It writes nothing. A person updates the file and
  opens a PR. The author runs it before opening the PR and pastes its output into the PR; no gate checks that it ran.
  This is what keeps the list from inventing links: a link enters only through a PR that passed
  verification, and the offline check fails the gate on a malformed one.
- Refresh is manual. A scheduled verification is a later sre decision.

### 7. Page and route conventions
`src/pages/` holds routes only, with one `.astro` file per URL. Routes: `/`, `/privacy/`, and a `404.astro`.
Content that is data (the project list) lives in `src/data/`. R1 has no content collections.

## Open for the builder
Astro compiling `.astro` files from a linked workspace package may need config (for example
`vite.ssr.noExternal`). The skeleton story proves it in its build and records what was needed here by amendment.

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
- **Keeping the generator and adding non-released entries to its output** (#39): rejected. The Pipeline has no
  repository, so the generator would need a second, hand-written source anyway; one curated file with an offline
  check and an online verify is simpler.

## Follow-on stories (for PM to cut)
1. **brand package contract (visual-designer), ordered before or with S7M-VAL-004 (the site's workspace dependency
   and `build-site-valesordev` need it; PM adds it as a blocker):** `brands/valesordev/package.json` (`@solo7/brand-valesordev`
   with the `exports` map above) and `brand.mk` targets `build-brand-valesordev`. Needs the audit and brand docs
   first for anything visual; the package shell does not.
2. **`site-core`, two stories because ownership is split:** (a) implementation creates the `@solo7/site-core`
   package shell and exports; (b) sre writes `packages/site-core/instrumentation/` (`initFaro`) with tests for the
   no-op and the fixed posture. FEAT-04.
3. **Site skeleton (S7M-VAL-004), amended:** `@solo7/site-valesordev-com`, workspace entry, `tsconfig`
   extending the base, `build-site-valesordev`, wired into `make check`.
4. **Brand-import lint, two stories:** (a) implementation adds the ESLint rule in the site package; (b) sre
   hooks it into `make check`. The rule is in decision 2.
5. **Project list (amended 2026-10-09, see decision 6; sre owns the Makefile, implementation owns the site data):**
   implementation writes `projects.json` with the three entries; sre writes `check-projects-valesordev` (in
   `make check`) and `projects-valesordev` (online verification). FEAT-02.
6. **Preview and production deploy (S7M-INF-001, then a production story, sre):** `preview-site-valesordev`,
   `deploy-site-valesordev`, `wrangler.jsonc`.
7. **Redirect scheme / URL permanence ADR (architecture), before cutover.** Not blocked by this ADR; it needs the
   old site's published URL list.
8. **Site-specific `/privacy` page (implementation), after the brand docs cite its template.** FEAT-04.
