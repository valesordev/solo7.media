# Valesor Development: visual language

The look of Valesor, as rules. Identity is in `foundation.md`, words in `voice.md`, and correct and incorrect
usage of each component in `usage.md`. This file does not hold token values: color, type, and spacing values live in
`tokens/tokens.json` (a later story); the numbers here are the audit's measurements or decided limits. It names roles and states the rules those tokens must satisfy. A component
uses a token or asks visual-designer; it never carries a hex, font name, or spacing literal (`CLAUDE.md` §5).

Status marks as in `foundation.md`. The audit's decided rows are cited by name (`audit: <section>`).

## Principles
1. Ink, paper, and one accent. `[DECIDED 2026-10-08]`
2. Rules and type do the layout; nothing is boxed, filled, or shadowed. `[DECIDED 2026-10-08]`
3. Space is left empty, not filled. `[DECIDED 2026-10-08]` (brief, brand QA)
4. The illustration is the primary recognizable element; type lives in its empty zone. `[DECIDED 2026-10-08]`
5. Hairline UI against engraved art is the look. `[DECIDED 2026-10-08]` (audit: Line)

## Color
Roles only. Values are set at token time against the contrast rules below.

| Role | Used for | Decided | Notes |
|---|---|---|---|
| `paper` | page ground | neutral near-white, `[DECIDED 2026-10-08]` | not warm; the engraving's whites must match it |
| `ink` | display and body type, wordmark, secondary link underline text | `#111111`, `[DECIDED 2026-10-08]` | `#000000` appears only inside the engraving |
| `ink-muted` | descriptions, taglines, metadata values, footer text | mid grey near `#545454`, `[DECIDED 2026-10-08]` | the single secondary grey |
| `rule` | every 1px hairline and divider | light neutral grey, `[DECIDED 2026-10-08]` | not warm |
| `accent` | primary action text and underline, row arrows, "View all projects" | one vermilion near `#C8202A`, `[DECIDED 2026-10-08]` | direction and primary action only |

Not roles `[DECIDED 2026-10-08]` (audit Decisions item 9): the audit's `ink-faint` is `ink-muted` at the label size, not a
third grey, and its `rule (strong)` is `rule`, one weight everywhere. The tokens story creates neither.

Rules:
- Contrast: text on `paper` is at least 4.5:1 (WCAG 2.1 AA), including `ink-muted` at the smallest size and
  `accent`. Hairlines and decorative rules carry no information on their own. `[DECIDED 2026-10-08]` (`CLAUDE.md` §5)
- Color is never the only signal: a link has an underline, an arrow has its row context. `[DECIDED 2026-10-08]`
- No other colors: no hover color, no state colors, no second accent. An error or success state is stated in
  words, in `ink`. `[DECIDED 2026-10-08]` (brief: avoid secondary colors)
- No gradients, no opacity tints standing in for a new color, no shadows. `[DECIDED 2026-10-08]`
- Themes: light only in R1. There is no dark theme; the target shows none, and the engraving is black on white.
  `/brand-qa` runs light only until Brian asks for a dark theme. `[DECIDED 2026-10-08]`

## Typography
Two families, one job each. `[DECIDED 2026-10-08]` (audit: Typography; Q2)

- **Display serif** names things: wordmark, H1, subhead, section titles, project names, column titles. Nav is
  serif too, but that is `[DECIDED 2026-10-08]` (below).
- **Monospace** explains and measures: body text, descriptions, taglines, metadata, links and CTAs, footer.
- No sans-serif, anywhere. No third family, no italic display, no bold display. Weight is regular throughout.
  `[DECIDED 2026-10-08]`
- Families are open-source and self-hosted, chosen and licensed in the type-and-palette story; the audit lists
  candidates and Brian picks. Not decided here.

Roles. Sizes are relative to body (`1x`) as measured in the audit; the token story sets the scale.
`[DECIDED 2026-10-08]` for role, family, and relative size; the scale itself is tokens.

| Role | Family | Size vs body | Case | Tracking | Example |
|---|---|---|---|---|---|
| Wordmark | serif | 1.6x | title case | slightly tight | Valesor Development |
| Display (H1) | serif | 4x | sentence case | tight, about -1% | The engineering imprint. |
| Subhead | serif | 1.7x | sentence case | normal | (placeholder: the target's subhead, rewritten without its dash) |
| Section title | serif | 2.4x | sentence case | normal | Projects |
| Row title | serif | 1.7x | title case | normal | Andara's World |
| Column title | serif | 1.2x | title case | normal | License |
| Body, descriptions, taglines | mono | 1x (about 14 to 15px in the target) | sentence case | normal | Tools and systems for building a fictional world. |
| Metadata label | mono | 0.85x | uppercase | spaced | STACK |
| Metadata value | mono | 0.85x to 1x | as written | normal | Apache-2.0 |
| Nav `[DECIDED 2026-10-08]` | serif | 1x | as written | normal | Projects, GitHub |
| Link, CTA | mono | 1x | sentence case | normal | Browse the source -> |

Notes:
- Nav `[DECIDED 2026-10-08]`: serif at body size, no arrow. The alternative, mono, would make the header read as a
  toolbar.
- The subhead line in the target contains a spaced em dash; the copy is rewritten under `voice.md#characters`.
- Line height and measure are set at token time. Rules: body line height at least 1.5; running text measure at
  most 72 characters in a text page (`/privacy`). `[DECIDED 2026-10-08]`
- Long-form reading (project pages, README-style content): not decided. The audit shows mono carrying short
  passages only. Decide with the first long-form story; until then, text pages use the body role at the measure
  above. `[PROPOSED]`
- Text is always real text, never part of an image. `[DECIDED 2026-10-08]` (art rules)

## Layout
`[DECIDED 2026-10-08]` for the frame, rules, absence of boxes, and the numbers below; the audit measured one 1586px frame and no responsive evidence.

- **One content column**, centered, inset from both edges by a constant margin. The header rule, section rules,
  and row rules hang from that column. Only the hero illustration runs full-bleed. `[DECIDED 2026-10-08]`
- **Max content width:** `[DECIDED 2026-10-08]` the column stops growing at a width where the four-part `ProjectRow` still
  reads as one line, at 1200px (75rem); the tokens story records the value. Reason: the target's 1468px
  column on a 1586px frame is a generator crop; a fixed ceiling keeps the lines short and the rows legible on
  wide screens. Rejected: fluid to any width (rows lose their grouping), 960px (the metadata block crowds the
  description).
- **Reading measure** for `/privacy` and other text pages: single column, at most 72 characters, left aligned to
  the same column edge. `[DECIDED 2026-10-08]`
- **Rules:** 1px, full column width unless a component says otherwise. A band is a rule, space, content, a rule.
  `[DECIDED 2026-10-08]`
- **Space:** generous and consistent: a small, named scale (the tokens), with the largest steps above the H1 and
  between bands. No component invents a spacing value. `[DECIDED 2026-10-08]` for generous; the scale is tokens.
- **Radius:** none. **Shadow:** none. **Fill:** none. **Border:** hairline rules only, never a box.
  `[DECIDED 2026-10-08]`
- **Breakpoints** `[DECIDED 2026-10-08]`: two layouts. Wide at or above 48rem (768px): as in the target. Narrow below it:
  one column. No intermediate layout. Reason: the target's densest part is the row, and it needs about 48rem to
  hold name, description, and metadata side by side. Rejected: three breakpoints (more states than the homepage
  has parts).

### Narrow layout (mobile)
`[DECIDED 2026-10-08]`
Everything stacks in reading order, left aligned, the same column inset, the same rules.

1. `BrandHeader`: wordmark on the first line, nav links on the second, rule below. Nav stays visible; no menu
   icon, no drawer.
2. `Hero`: H1, subhead, blurb, then the primary `TextLink`, then the illustration full-bleed beneath. The type
   no longer sits over the art's empty zone because the zone is too small; the art is a separate band below.
3. Info columns (an audit candidate, not in the decided kit) stack with a horizontal rule between them.
4. `SectionRule` title and its link: title above, link below, both left aligned.
5. `ProjectRow`: name and tagline; description; `TechnicalMetadata`; the arrow stays on the right of the name
   line. Row rules stay.
6. `Footer`: links stack, left aligned.

## Illustration
Pure black ink on white, pen-and-ink survey or engraving rendering, heavy contours with fine hatch and stipple,
no grey wash, no gradient, flat light, large negative-space zones. Subjects: wind-shaped juniper, rock, low
ridge, sparse scrub, a large moon. `[DECIDED 2026-10-08]` (audit: Illustration language; brief)

The full system, compositions, and treatment are in `art-direction/illustration-system.md` (separate story).
Rules that bind layout:

- The hero illustration runs full-bleed, left to right. Its bottom edge is ragged, not cut, and sits just above
  the rule beneath. `[DECIDED 2026-10-08]`
- Type is never set on the engraved area. It sits in the empty sky. `[DECIDED 2026-10-08]`
- Art never carries text. `[DECIDED 2026-10-08]` (`.claude/roles/visual-designer.md`: no text in rasters)
- A hero has alt text only if it carries information; the homepage hero is decorative (`alt=""`).
  `[DECIDED 2026-10-08]` (the engraving adds mood, not facts)
- Hero aspect ratio: the audit saw about 3.7:1 as cropped; the brief names `hero-wide` as 2.4:1. Resolved in the
  hero slot spec, not here. `[DECIDED 2026-10-08]`

## Motion
Almost none. `[DECIDED 2026-10-08]` (brief: no excessive animation)

- No entrance animation, parallax, scroll effects, or autoplay.
- State changes are instant. `[DECIDED 2026-10-08]`
- Respect `prefers-reduced-motion`; with nothing animated, there is nothing to turn off.

## Interaction states
`[DECIDED 2026-10-08]`
The target shows only rest states. Decided, with the alternatives rejected:

- **Hover** on a link: the 1px underline becomes 2px. No color change. Rejected: a second red (the audit and
  Brian's Q3 answer reject a hover red), underline removal (loses the affordance).
- **Focus-visible** on any interactive element: a 2px `ink` outline with a 2px offset. It is visible on `paper`
  and over vermilion text. Never removed. Rejected: a vermilion ring (low contrast against the vermilion links).
- **Visited:** no change. A project list is not a reading history.
- **Active:** the same as hover.
- **Target size:** at least 24 by 24 CSS pixels for every link and arrow (WCAG 2.2 AA, stricter than the 2.1 AA
  the repo requires); the `ProjectRow` link area is the whole row.

## Components
The canonical set for R1. Each states its anatomy, rules, and tokens-by-role. Usage in context, with correct and
incorrect examples, is in `usage.md#<component>`. `Callout` is out of R1 (`foundation.md#scope-of-the-kit`).

### BrandHeader
`[DECIDED 2026-10-08]` (audit: BrandHeader, Mark)
Rules the audit doesn't state (counts, markup, limits, data format) are decided with the anatomy.

- The first element of every page. Serif wordmark "Valesor Development" at left; serif text links at
  right (the target shows Projects, GitHub, About; the kit drops About, see below; the nav row itself is `[DECIDED 2026-10-08]`); a 1px `rule` below, on the content column.
- The wordmark is the only mark: no glyph, no logo image, no tagline (decided). It is plain text and links to `/`
  `[DECIDED 2026-10-08]`.
- Nav links carry no arrow, `[DECIDED 2026-10-08]`; no button, pill, or underline at rest `[DECIDED 2026-10-08]`.
- Current page: a 1px underline on the current link. `[DECIDED 2026-10-08]` (the audit shows no current-page state.
  Rejected: bold, because regular is the only weight; a color change, because the accent is for action.)
- Nav labels: Projects, GitHub. `Projects` goes to the project list on the home page; `GitHub` is an external link
  to the `valesordev` organization. `[DECIDED 2026-10-08]` labels and destinations.
- No About page or link. `[DECIDED 2026-10-08]` (Brian: it is described on the homepage; the target's About nav
  link and "About this project ->" link are dropped)
- Tokens: `ink`, `rule`, display serif, wordmark and nav roles.

### Hero
`[DECIDED 2026-10-08]` (audit: Hero)
Rules the audit doesn't state (counts, markup, limits, data format) are decided with the anatomy.

- A block over the illustration's empty zone: H1, subhead, a two-line mono blurb, and one primary `TextLink`.
  Type is left aligned to the content column edge and stays in the left part of the frame.
- One H1 per page. The subhead is a single line. The blurb is at most two short lines. One CTA, vermilion.
- The illustration is full-bleed; the type sits in its empty sky, never on engraved ground.
- No second CTA, no badge, no counter, no scroll cue, no overlay or gradient scrim.
- Tokens: `ink` (H1, subhead), `ink-muted` (blurb), `accent` (CTA), display serif and mono roles.

### SectionRule
`[DECIDED 2026-10-08]` (audit: SectionRule)
Rules the audit doesn't state (counts, markup, limits, data format) are decided with the anatomy.

- A full-column 1px `rule`, with optional content under it: a serif section title at left and a right aligned
  `TextLink` (the target: "Projects" and "View all projects ->").
- A rule introduces every band; there is no heading without a rule above it.
- The right link, if present, is a primary `TextLink` and says where it goes.
- No fill, no icon, no number, no kicker above the title.
- Tokens: `rule`, `ink`, `accent`, section title role.

### ProjectRow
The signature component. `[DECIDED 2026-10-08]` (audit: ProjectRow)
Rules the audit doesn't state (counts, markup, limits, data format) are decided with the anatomy.

- A four-part row between two 1px `rule`s: (1) serif name with the mono tagline beneath; (2) mono description;
  (3) `TechnicalMetadata`; (4) a vermilion `->` at the far right. Row pitch is constant: every row has the same
  parts in the same columns.
- The row is one link to the project's source repository. `[DECIDED 2026-10-08]` (FEAT-02: rows link to the repository, not
  to a Valesor-hosted page). Its accessible name is the project name. The arrow is decoration inside the link.
- Name is the project's own spelling. Tagline is one sentence. Description is one or two.
- No icon, thumbnail, status badge, tag chips, star count, or hover card.
- Rows are a list: `<ul>` of rows, so a screen reader announces the count.
- Tokens: `ink`, `ink-muted`, `rule`, `accent`, row title role, body role.

### TechnicalMetadata
`[DECIDED 2026-10-08]` (audit: TechnicalMetadata; items 7)
Rules the audit doesn't state (counts, markup, limits, data format) are decided with the anatomy.

- A two-column label and value list. Labels uppercase mono, spaced, `ink-muted` at the label size. Values mono.
- Three fields, in this order: STACK, LICENSE, REPO. STACK values are separated by commas
  ("Python, TypeScript"). LICENSE is an SPDX identifier ("Apache-2.0"). REPO is the repository path
  without scheme ("github.com/<org>/<repo>").
- A `dl` in markup. Values are real text, selectable.
- Order and labels never vary between rows. A missing field is a data defect to fix, not a blank to hide.
  `[DECIDED 2026-10-08]`
- Appears wherever a project is named with a claim about its source (the row; later, a project page).
- Tokens: `ink-muted`, `ink`, metadata label and value roles.

### TextLink
`[DECIDED 2026-10-08]` (audit: TextLink, both rows)
Rules the audit doesn't state (counts, markup, limits, data format) are decided with the anatomy.

- Mono, 1px underline, trailing typed `->`.
- **Primary:** `accent` text, underline, and arrow. At most one primary CTA per band (the Hero CTA, or a
  `SectionRule`'s link). The vermilion `->` on a `ProjectRow` is that row's direction mark, not a `TextLink`, so
  a list of rows doesn't break the rule.
- **Secondary:** `ink` text, 1px grey underline (token chosen in the tokens story; at least 3:1 on `paper` so the link is findable without color; the sampled grey is lighter than that, so the token is not the sample), `ink` arrow. For an action that isn't the main one
  ("Read the license ->"). `[DECIDED 2026-10-08]`
- The arrow is part of the link text and typed. It appears on CTAs and action links only: not on nav links, not
  on the wordmark, and not on inline links in prose (which are underlined `ink`, no arrow). `[DECIDED 2026-10-08]`
- Link text follows `voice.md#cta-vocabulary`. External destinations are not marked with an icon.
  `[DECIDED 2026-10-08]`
- Tokens: `accent`, `ink`, `rule`, link role.

### Footer
Not in the target. `[DECIDED 2026-10-08]` (the brief lists a Footer; the audit has no instance; FEAT-04 requires a link to
`/privacy` from the footer.)

- A `SectionRule` above, then one row in two groups: at left, "Valesor Development" in serif and a one-line mono
  statement in `ink-muted` (license line, text `[PROPOSED]`, Brian approves); at right, two mono links: GitHub,
  Privacy. No arrow on footer links (they are navigation).
- Link order: GitHub, Privacy. Privacy is present on every page.
- No copyright symbol or year (a published "(c)" line implies a company; the license is stated instead). No
  social icons, no sitemap, no newsletter, no back-to-top.
- Narrow: stacks, left aligned.
- Tokens: `rule`, `ink`, `ink-muted`, wordmark role at the small end, nav role.

## `/privacy` page template
`[DECIDED 2026-10-08]`
Built under FEAT-04. The text is Brian's and changes only with him (`CLAUDE.md` §7); this specifies the frame.

- The standard frame: `BrandHeader`, then a text page, then `Footer`. No hero, no illustration.
- Text page: a `SectionRule`; one H1 in the display role ("Privacy"); a one-line subhead in `ink-muted` mono;
  then sections. Each section: a serif title in the column-title role, then mono body at a measure of at most 72
  characters. Left aligned to the content column.
- Lists use plain bullets in body type. No tables, no callouts, no accordions, no icons, no checkmarks.
- Links in the text are underlined `ink`, no arrow. The page ends with a secondary `TextLink` to the home page.
- The page states in its first screen what is and isn't measured, as the text provides. The look makes no claim
  of its own.
- Reads fully with JavaScript off, at both layouts.

## Dependencies on later stories
Tokens and fonts, the illustration system and hero art, and `qa.md` follow this file (out of scope here). Where
this file says "set at token time" it points at the tokens story.
