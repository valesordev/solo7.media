# solo7.media — Look & Feel Brief

Working doc for brainstorming and developing the visual direction of this site. Written to be handed to a design tool
(Claude Design or similar) as grounding context. Everything under **Current State** is verbatim from the codebase —
keep it accurate as the site changes. Everything under **Open Questions** is deliberately unresolved.

---

## What this site is

Solo7 Media — Brian's personal art and image portfolio. Photography, drawing, and generative art.

Positioning copy currently live on the homepage:

> **Art & Images**
> Photography, drawing, and generative art. Work made between everything else.

That last clause is the whole brand in five words. This is not a professional portfolio chasing commissions — it's
a body of work made in the margins of a full-time job and everything else. The design should not oversell it.

Three categories: Photography · Drawing · Generative Art.

---

## Current State

### Colors

From `src/styles/global.css` — warm, dark, gold-accented. The most developed palette of the five sites:

| Token | Value | Role |
|---|---|---|
| `--color-bg` | `#0c0c0c` | Near-black background |
| `--color-text` | `#f0ece6` | Warm off-white — not pure white, slightly cream |
| `--color-accent` | `#c9a96e` | Muted gold / brass |
| `--color-accent-hover` | `#b8924f` | Darker gold |
| `--color-surface` | `#161412` | Raised surface, warm-shifted |
| `--color-border` | `#2a2623` | Warm dark border |
| `--color-muted` | `#7a7570` | Warm grey secondary text |
| `--color-header-bg` | `#0c0c0cee` | Header with alpha (`ee` ≈ 93%) — implies a sticky translucent header |

The warmth is deliberate and consistent: every neutral is shifted toward brown/amber rather than blue. This is a
gallery palette — dark walls, warm picture light. It works.

### Typography

```css
font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
```

Inter, with a system fallback chain. Note: **Inter is named but not actually loaded** — there's no webfont link
or `@font-face`, so most visitors get Helvetica Neue or Arial. Either load it or stop naming it.

### Utility classes

This site hand-rolls four utilities to bridge its custom properties into markup:

```css
.text-accent  { color: var(--color-accent); }
.text-muted   { color: var(--color-muted); }
.border-border { border-color: var(--color-border); }
.bg-surface   { background: var(--color-surface); }
```

### Pages

- `src/pages/index.astro` — hero + "Selected Work" featured grid
- `src/pages/work/index.astro` — full work grid
- `src/pages/work/[slug].astro` — individual piece page

### Content model

Astro content collection `artwork` (`src/content/config.ts`). Each piece has `title`, `category`, `date`,
`image`, `featured`. Six pieces currently: `desert-light`, `ink-landscape`, `still-water`, `figure-study-01`,
`flow-field-01`, `recursive-growth`.

Categories are keyed `photos` / `drawings` / `generative`, labeled Photography / Drawing / Generative Art.

---

## The Shared-UI Constraint

Read this before proposing anything. It determines whether a change is cheap or expensive.

**`@valesordev/ui` provides:**

| Export | What it is |
|---|---|
| `BaseLayout.astro` | Page shell — head, meta, slots |
| `SiteHeader.astro` | Nav wrapper |
| `SiteFooter.astro` | Footer wrapper |
| `styles/base.css` | Tailwind import + `--color-bg` / `--color-text` + a `body` rule |

**The shared base defines only two variables:** `--color-bg` and `--color-text`. Everything else in the table
above (`--color-accent`, `--color-surface`, `--color-border`, `--color-muted`, `--color-header-bg`) is invented
locally in this repo. There is no shared contract for them — the naming is convention across sites, nothing enforces it.

**So a look-and-feel change is one of two very different things:**

- **Token override** — edit `:root` in `src/styles/global.css`. Site-local, safe, affects nothing else.
- **Component change** — edit `@valesordev/ui`. Hits all five sites at once, requires an npm publish
  (`npm.pkg.github.com`) and a dependency bump in each consumer.

Default to token overrides. Reach for the shared package only when a structural change genuinely belongs to
every property.

**Specific tension for this site:** an image portfolio has layout needs the shared `SiteHeader`/`SiteFooter` may
not serve — full-bleed images, a lightbox, a header that disappears on scroll. If a proposal needs those,
say explicitly whether it's a local override or a shared-component change.

---

## Open Questions

Genuinely unresolved — these are prompts for brainstorming, not decisions already made.

1. **Does the work get to be big?** Currently a grid of thumbnails. An art site could go full-bleed,
   one-piece-per-screen, scroll-driven. What serves the images better?
2. **Three categories or one stream?** Photography, drawing, and generative art are technically different but
   might be one body of work. Splitting them is an assertion that they're separate practices — is that true?
3. **Load Inter, or pick something with more character?** A serif for a gallery feel? The current warm palette
   would carry a serif well. Inter is a safe non-choice.
4. **Is the gold accent right?** `#c9a96e` reads as brass/frame/gallery-label. Confident choice — but it also
   reads slightly luxury-brand. Alternative: no accent color at all, let the work supply all the color.
5. **What does a piece page look like?** `work/[slug].astro` exists but the design of a single-piece view is
   the most important screen on the site and the least defined.
6. **Metadata visibility.** Titles and categories currently overlay/accompany thumbnails. Should the work be
   presented bare — no titles until you ask for them?
7. **"Work made between everything else."** Should that line be visible on the site as an organizing principle,
   or is it just internal framing? It's the most honest thing in the copy.

---

## Assets

No `design/` source files (XCF/AI) in this repo yet — this doc is the first thing here. Artwork images live in
`public/`, referenced from the content collection frontmatter.

`solo7productions.com/design/` and `system9studios.com/design/` hold logo sources as XCF + exported PNG; follow
that pattern if branding work happens here.

---

## Working Notes

- Stack: Astro 5 + Tailwind 4, deployed to GitHub Pages via a reusable workflow in `@valesordev/ui`
- Local dev: `npm install && npm run dev`
- Related planning: `valesor/web-infrastructure.md` in `life.solo7.media`
- Setup checklist: `SITE_CONFIG.md`
