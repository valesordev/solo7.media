# CLAUDE.md — solo7.media monorepo

Agents are vendored from automate.bashburn.com (target `solo7-media`) into `.claude/`; don't edit them here.
Start every session with `/role <name>`. Section numbers are cited by the role charters and sprint skills;
keep them stable.

## §1 What this repo is
The brand kits and websites for Brian's imprints and blog, built and planned by the Valesor Development roles.

| Property | What it is | Brand | Site |
|---|---|---|---|
| Valesor Development | Engineering imprint: publicly released software | `brands/valesordev/` | `sites/valesordev.com/` |
| System 9 Studios | Creative studio: world-building, content development, visual production | `brands/system9studios/` | `sites/system9studios.com/` |
| Solo7 Productions | Producer org; production is carried out with System 9 Studios | `brands/solo7productions/` | `sites/solo7productions.com/` |
| solo7.media | Imprint for all published work | `brands/solo7media/` | `sites/solo7.media/` |
| bashburn.com | Brian's blog, a personal field journal | `brands/bashburn/` | `sites/bashburn.com/` |

Credit line: "Soft Disclosure — produced by Solo7 Productions. Written and animated by System 9 Studios.
Tooling by Valesor Development."

The brand kits start from scratch (2026-10-07). Each brand's brief is its Notion direction page, and its
homepage image is the v1 design target. Valesor Development goes first. Sites deploy to Cloudflare Workers
static assets. Until a site is rebuilt here, it's served from its old repo; the legacy solo7.media site is in
`sites/solo7.media/` and still deploys to GitHub Pages.

## §2 Ownership
Roles and the paths they write are in `.claude/roles/` (`_repo.md` first). A hook enforces them. One role per
session; `/clear` before switching. Paths no role owns (`CLAUDE.md`, `README.md`, `.gitignore`, `.claude/`)
need Brian. Generated paths (`dist/`, `.astro/`, `package-lock.json`) are never hand-edited.

Sprint cycle: PM activates a sprint → SRE observability review → architecture contract review →
visual-designer answers brand questions and works its lane → implementation and SRE build → merges move
stories to `review` → architecture's §8 review moves them to `done` → PM closes out.

## §3 Layout
```
brands/<slug>/
  brand/             foundation.md, voice.md, visual-language.md, usage.md (+ brand extras)
  references/        target-homepage.png (frozen), visual-audit.md
  tokens/tokens.json → dist/tokens.css
  art-direction/     illustration-system.md, prompt-template.md, negative-examples.md
  assets/            marks/, illustration/<composition>/, icons/, slots.md; candidates/ is gitignored
  components/        Astro components (implementation)
  qa.md              brand QA checklist
  brand.mk           this brand's make rules, included by the root Makefile
  dist/              generated
brands/_tools/       shared treatment scripts
sites/<domain>/      one Astro app per site; wrangler.jsonc (sre)
packages/            shared non-visual code (Faro bootstrap, /privacy text, credit line)
docs/                product/, adr/, specs/ (slo/ is sre's), sprints/, runbooks/, roadmap.md, glossary.md
```

## §4 Conventions
- Branches: `<role prefix>/<story-id>-<slug>` (`design/`, `impl/`, `sre/`, `arch/`, `pm/`, `product/`).
  Commits are signed. PRs carry `role:<role>` and `Story: <ID>`; `/pre-pr` runs before every push.
- Story IDs: `S7M-<comp>-NNN` (components in `_repo.md`). Stories are issues on the org Project; change them
  only with `.claude/bin/story`.
- Story contract (the issue body):

  ```markdown
  ## Why
  The release and feature it serves (`R<n>`, `FEAT-NN`), in one or two sentences.
  ## Acceptance criteria
  Numbered, observable checks.
  ## Brand citation
  `brands/<slug>/brand/<file>.md#<section>` for every look this story implements, or "none: no visual change".
  ## Interface contract
  Files, components, props, routes, or build outputs other stories rely on.
  ## Out of scope
  ## Observability requirements
  What sre needs instrumented or verified, or "none".
  ## Test plan
  How the builder proves the criteria: tests, `make` targets, preview URL checks, `/brand-qa`.
  ```

## §5 Structure rules
- Static output. Every page is readable with JavaScript off.
- Permanent URLs: a moved page gets a redirect in the same change.
- Tokens only: no hex, font name, or spacing literal in a component.
- Branding is decided in brand docs, never in code (`_repo.md`). A visual story without a brand citation isn't
  `ready`.
- Imprints never share visual components. Shared non-visual code goes in `packages/`.
- WCAG 2.1 AA on every page.

## §6 Grooming
PM drafts stories from `docs/product/` and the roadmap. SRE reviews observability, then architecture reviews
the contract. Questions for Brian are batched at the sprint checkpoint, at most 3 per sprint; brand questions
go to visual-designer on the story.

## §7 Observability
Grafana Faro instruments the site, never the reader: Session Replay off, volatile sessions, no user
identification, no PII in attributes, explicit sampling, a no-op when config is absent, app keys injected at
build time from repo variables. Web vitals, performance, and frontend errors only. SLO before alert. The
published "instrumented, not tracked" claim and `/privacy` text change only with Brian.

## §8 Definition of done
1. Acceptance criteria met; out-of-scope untouched.
2. `make check` green.
3. Visual change: `/brand-qa` passes against `brands/<slug>/qa.md`, light and dark if the brand has both,
   mobile and desktop, JavaScript off.
4. Preview deploy verified at its URL (once the Cloudflare pipeline exists).
5. Instrumentation verified by sre where the story has observability requirements
   (`§8 instrumentation (sre)` record).
6. Architecture's `§8` record on the story.

## §9 Automation contract
Every step is a `make` target; `make help` lists them. A documented shell sequence that isn't a target is a
defect, and a demo step that needs one is marked `§9 defect → S7M-INF-NNN`.

## §10 Voice and refusals common to every site
No marketing funnels, newsletter signups, social feeds, comments, or engagement analytics. Each brand's
`voice.md` adds its own rules.

## §11 Session start
1. `git fetch origin`; work from `origin/main` on a fresh branch.
2. Read this file, `.claude/roles/_repo.md`, and your role (`/role <name>` loads it).
3. Read the brand docs your story cites, and the brand's Notion direction page for a brand's first story.
