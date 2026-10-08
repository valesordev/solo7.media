# Valesor Development: foundation

The source of truth for what Valesor Development is. Voice is in `voice.md`, look and components in
`visual-language.md`, correct and incorrect usage in `usage.md`. Where a builder's question isn't answered in
these four files, it goes to visual-designer; nothing is decided in code.

Derived from the approved audit (`../references/visual-audit.md`, core rows decided 2026-10-08) and the Notion
brief (Brand Kit Project Direction, Valesor Development).

Status marks: `[DECIDED <date>]` is Brian's. `[PROPOSED]` is visual-designer's recommendation awaiting Brian at
PR review. Nothing `[PROPOSED]` may be cited by a story as binding. Open at 2026-10-08: the Apache-2.0 default
(`voice.md#the-imprints-own-sentences`) and the footer license line that depends on it, the rewritten homepage copy
(`voice.md`), and the long-form reading font (`visual-language.md#typography`).

## Identity
Valesor Development is the engineering imprint: the banner applied to software that is complete enough to be
released publicly. It is an imprint, not a company or a consultancy. It has no clients, sells nothing, and takes
no orders. `[DECIDED 2026-10-08]` (brief; audit copy rows)

The site's own line is "The engineering imprint." The mark is the wordmark "Valesor Development" set in the
display serif; there is no symbol. `[DECIDED 2026-10-08]` (audit: Mark)

## Character
Quiet, durable, precise, independent, open, technical, field-tested. `[DECIDED 2026-10-08]` (brief)

What each word asks of a page:

| Word | Shows up as |
|---|---|
| Quiet | one accent, no motion for its own sake, space left empty |
| Durable | plain type and rules that will still read in ten years; no trend effects |
| Precise | hairlines on a constant frame; facts stated exactly (stack, license, repo) |
| Independent | no partner logos, testimonials, or platform badges |
| Open | source, license, and repository are visible wherever a project is named |
| Technical | monospace for anything that is measured or named in code |
| Field-tested | words describe what the software does, as a field manual would |

## The model: a monograph, not a homepage
A Valesor page should feel like an engineering monograph, survey drawing, field manual, or open-source technical
journal. It should not feel like a software company's homepage. When a choice isn't covered by these docs, ask
which of those two a reader would take the page for. `[DECIDED 2026-10-08]` (brief, core design principle)

The layout system, the illustration language, the technical typography, the voice rules, and the way projects
are presented are the brand. The mark stays quiet. This is not a logo, color, and typography kit.

## What the brand is made of
Everything below is decided in the audit's core rows and specified in `visual-language.md`.

1. **Ink on paper.** Neutral near-white paper, near-black ink, grey for secondary text and hairlines.
   `[DECIDED 2026-10-08]`
2. **One accent.** A single vermilion, used only for primary action and direction. `[DECIDED 2026-10-08]`
3. **Serif and mono.** Serif names things (brand, headings, project names); mono explains and measures (body,
   metadata, links). No sans-serif. `[DECIDED 2026-10-08]`
4. **Rules do the layout.** 1px hairlines on a constant column; no cards, shadows, radii, fills, or bands.
   `[DECIDED 2026-10-08]`
5. **The engraving.** Pure black pen-and-ink illustration, heavy contour with hatch and stipple, in the empty
   zone beside the type. Written up in `art-direction/illustration-system.md` (separate story).
   `[DECIDED 2026-10-08]`
6. **The project row.** Name, tagline, description, technical metadata, and an arrow, between hairlines. The
   brand's signature component. `[DECIDED 2026-10-08]`
7. **Plain voice.** First person singular, nouns for things that exist, no sales language. See `voice.md`.
   `[DECIDED 2026-10-08]`

## Not Valesor
Never, unless Brian asks for it in the session: `[DECIDED 2026-10-08]` (brief)

- Startup branding
- SaaS marketing
- Cyberpunk UI
- Glossy product renders
- Corporate consulting language
- Conversion funnels
- Gradients
- Glassmorphism
- Excessive animation
- Decorative Norse motifs

Consequences the audit adds, each decided:

- No cards, drop shadows, rounded corners, filled panels, or background bands.
- No grain, noise, or paper texture on the page; the only texture is the engraving.
- No second accent color, no hover color, no tinted ground.
- No newsletter signup, social feed, comments, or engagement analytics (`CLAUDE.md` §10).

## Brand family boundary
Valesor shares an owner and a repo with four other properties (`CLAUDE.md` §1). It does not share their look.

| Property | Relation | Boundary |
|---|---|---|
| System 9 Studios | creates the world Valesor's tooling serves | its look is not Valesor's; Valesor never borrows its visual components (`CLAUDE.md` §5) |
| Solo7 Productions | produces the work | same |
| solo7.media | publishes the work | same |
| bashburn.com | Brian's personal blog | first-person voice there is Brian's; Valesor's first person is also Brian but speaks about released software only |

Shared between imprints: only non-visual code (`packages/`). The serif plus mono pairing, the vermilion accent,
and the engraving language stay Valesor's alone. `[DECIDED 2026-10-08]` (audit, Distinctness; revisit when the second
imprint's audit exists)

## Scope of the kit
The R1 kit covers the homepage and the `/privacy` page (FEAT-01); a 404 recipe is visual-designer's addition for
the route `docs/adr/0001-site-structure.md` lists. Project detail pages, README template, and
social card are later (FEAT-01). The brief's `Callout` component is not in R1: nothing on the specimen uses it.
`[DECIDED 2026-10-08]` (specify it when a page needs it; the audit shows no instance)

## Differences from the Notion brief
Where the brief and the decided audit disagree, the audit wins and the difference is recorded here.

| Brief says | Kit says | Decided |
|---|---|---|
| paper `#FAFAF7`, rule `#CFCFC8` (warm) | neutral paper and rules | 2026-10-08, Q1 |
| ink `#111111` everywhere | `#111111` for type; `#000000` only inside the engraving | 2026-10-08, item 7 |
| "Body serif or restrained sans" | mono for body and metadata | 2026-10-08, Q2 |
| CTAs end with `→` | typed `->` | 2026-10-08, item 6 |
| `View source →`, `Read the documentation →`, `Open the repository →`, `See how it works →` | same vocabulary, typed arrow; see `voice.md#cta-vocabulary` | 2026-10-08, item 6 |
| file names `brand-foundation.md`, `voice-and-copy.md` | `foundation.md`, `voice.md` (repo layout, `CLAUDE.md` §3) | repo convention |
| a separate `design/` folder for tokens, typography, layout | tokens in `tokens/`; type and layout rules in `visual-language.md` | repo convention |
