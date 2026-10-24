# Valesor Development: visual language

The look of Valesor, as rules. Identity is in `foundation.md`, words in `voice.md`, and correct and incorrect
usage of each component in `usage.md`. This file does not hold token values: color, type, and spacing values live in
`tokens/tokens.json` (names and contrast record: `tokens/README.md`); the numbers here are the audit's measurements or decided limits. It names roles and states the rules those tokens must satisfy. A component
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
| `ink-muted` | descriptions, taglines, metadata values, the footer's license statement (`[DECIDED 2026-10-24]` Brian on PR #118; was: footer text) | mid grey near `#545454`, `[DECIDED 2026-10-08]` | the single secondary grey |
| `rule` | every 1px hairline and divider | light neutral grey, `[DECIDED 2026-10-08]` | not warm |
| `accent` | primary action text and underline, row arrows, "View all projects" | one vermilion near `#C8202A`, `[DECIDED 2026-10-08]` | direction and primary action only |

Not roles `[DECIDED 2026-10-08]` (audit Decisions item 9): the audit's `ink-faint` is `ink-muted` at the label size, not a
third grey, and its `rule (strong)` is `rule`, one weight everywhere. The tokens story creates neither.

Rules:
- Contrast: text on `paper` is at least 4.5:1 (WCAG 2.1 AA), including `ink-muted` at the smallest size and
  `accent`. Hairlines and decorative rules carry no information on their own. `[DECIDED 2026-10-08]` (`CLAUDE.md` §5)
- Color is never the only signal: a link has an underline, an arrow has its row context. `[DECIDED 2026-10-08]`
  Nav links, the wordmark, and footer links have no underline at rest; their place in the header or footer
  marks them as links (`#brandheader`, `#footer`). `[DECIDED 2026-10-14]`
- No other colors: no hover color, no state colors, no second accent. An error or success state is stated in
  words, in `ink`. `[DECIDED 2026-10-08]` (brief: avoid secondary colors)
- No gradients, no opacity tints standing in for a new color, no shadows. `[DECIDED 2026-10-08]`
- Themes: light only in R1. There is no dark theme; the target shows none, and the engraving is black on white.
  `/brand-qa` runs light only until Brian asks for a dark theme. `[DECIDED 2026-10-08]`

## Typography
Two families, one job each. `[DECIDED 2026-10-08]` (audit: Typography; Q2)

- **Display serif** names things: wordmark, H1, subhead, section titles, project names, column titles. Nav is
  serif too, but that is `[DECIDED 2026-10-08]` (below).
- **Monospace** explains and measures: body text, descriptions, taglines, metadata, links and CTAs, the footer's
  statement and links (`#footer`; was: footer).
- No sans-serif, anywhere. No third family, no italic display, no bold display. Weight is regular throughout.
  `[DECIDED 2026-10-08]`
- Families are open-source and self-hosted: Source Serif 4 for the display serif and Source Code Pro for the
  monospace, both OFL-1.1. `[DECIDED 2026-10-10]` (`tokens/README.md`, S7M-VAL-006)
- No typeface sourced from IBM, in any role, even though open source. `[DECIDED 2026-10-10]` (Brian: a hard rule)

Roles. Sizes are relative to body (`1x`) as measured in the audit; the token story sets the scale.
`[DECIDED 2026-10-08]` for role, family, and relative size; the scale itself is tokens.

| Role | Family | Size vs body | Case | Tracking | Example |
|---|---|---|---|---|---|
| Wordmark | serif | 1.6x | title case | slightly tight | Valesor Development |
| Display (H1) | serif | 4x | sentence case | tight, about -1% | The engineering imprint. |
| Subhead | serif | 1.7x | sentence case | normal | Software, tools, and systems, developed in the open. `[DECIDED 2026-10-09]` |
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
- Column titles, including `/privacy` section titles (`#privacy-page-template`), are title case as the table
  says, an exception to sentence case for headings (`voice.md#case-and-punctuation`). `[DECIDED 2026-10-14]`
  (Brian on S7M-VAL-009)
- The subhead line in the target contains a spaced em dash; the copy is rewritten under `voice.md#characters`.
- Line height and measure are set at token time. Rules: body line height at least 1.5; running text measure at
  most 72 characters in a text page (`/privacy`). `[DECIDED 2026-10-08]`
- Long-form reading (project pages, README-style content, text pages): the body role (mono) at the measure above.
  No third family. `[DECIDED 2026-10-08]` Revisit only if a real long-form page fails readability in `/brand-qa`.
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
5. `ProjectRow`: name and tagline (if the list carries one); description; `TechnicalMetadata`; the arrow stays on
   the right of the name line, and a row with no repository has no arrow. Row rules stay. `[DECIDED 2026-10-09]`
6. `Footer`: the link group stacks below the name and statement, left aligned; GitHub and Privacy share one line
   (`#footer`, Arrangement, `[DECIDED 2026-10-24]` Brian on PR #118; was: links stack, left aligned).

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
  `[DECIDED 2026-10-08]`. Like the nav links, it has no underline at rest; hover, active, and focus-visible are as
  in `#interaction-states`, the hover underline appearing at 2px. `[DECIDED 2026-10-14]` (Brian on S7M-VAL-009)
  Reason: an underlined wordmark reads as a link in prose, not a name. Rejected: a rest underline on the wordmark.
- Nav links carry no arrow, `[DECIDED 2026-10-08]`; no button, pill, or underline at rest `[DECIDED 2026-10-08]`.
- Current page: a 1px underline on the current link. `[DECIDED 2026-10-08]` (the audit shows no current-page state.
  Rejected: bold, because regular is the only weight; a color change, because the accent is for action.)
- Nav labels: Projects, GitHub. `Projects` goes to the project list on the home page; `GitHub` is an external link
  to the `valesordev` organization. `[DECIDED 2026-10-08]` labels and destinations.
- No About page or link. `[DECIDED 2026-10-08]` (Brian: it is described on the homepage; the target's About nav
  link and "About this project ->" link are dropped)
- **Spacing** (issue #111). The header's vertical space and its gaps are the `space` steps below and nothing
  else. `[DECIDED 2026-10-24]` (Brian on PR #113) The column inset is `#layout`'s (`layout.inset-*`), and the
  links' minimum box is the target size (`#interaction-states`); neither is header spacing.
  - Above and below the wordmark and nav, inside the rule: `space.xs`, top and bottom. `[DECIDED 2026-10-24]`
    Reason: with the wordmark role's line box this puts the rule 60px below the top of the page when wide, the
    target's header height (audit: Layout, "header 60px"), without adopting the measurement as a rule. Rejected:
    `space.s` (a deeper header than the target with no gain), `space.2xs` (the wordmark crowds the rule).
  - Between nav links: `space.xl`. `[DECIDED 2026-10-24]` (Brian on issue #111) Reason: the target sets its nav
    links about 55px apart; `space.xl` is the nearest step, and it keeps Projects and GitHub reading as two
    destinations rather than one phrase. It applies at both widths; the two links still share one line at 320px.
    Rejected: `space.m`, as first shipped (half the target's gap), `space.l` (still tighter than the target).
  - Wide, between the wordmark and the nav: at least `space.m`. `[DECIDED 2026-10-24]` The two groups sit at
    opposite ends of the column, so this minimum only shows if the column is narrow enough to bring them together.
    Reason: it holds them apart as two groups just above the breakpoint. Rejected: no minimum (they could touch).
  - Narrow, between the wordmark line and the nav line: no added space; the two line boxes separate them.
    `[DECIDED 2026-10-24]` Reason: added space would make the nav look like a separate band without a rule.
- Tokens: `ink`, `rule`, display serif, wordmark and nav roles, `space.xs`, `space.m`, `space.xl`.

### Hero
`[DECIDED 2026-10-08]` (audit: Hero)
Rules the audit doesn't state (counts, markup, limits, data format) are decided with the anatomy.

- A block over the illustration's empty zone: H1, subhead, a mono blurb, and one primary `TextLink`.
  Type is left aligned to the content column edge and stays in the left part of the frame.
- One H1 per page. One CTA, vermilion. Wide: the subhead is a single line and the blurb at most two short lines.
  Narrow: the subhead wraps and the blurb rewraps at the narrow measure, in the same roles, with no new type step.
  `[DECIDED 2026-10-14]` (Brian on S7M-VAL-009) Reason: the 1.7x subhead can't fit one line at 390px. Rejected: a
  smaller narrow subhead size (a type step the scale doesn't have).
- The illustration is full-bleed; the type sits in its empty sky, never on engraved ground.
- No second CTA, no badge, no counter, no scroll cue, no overlay or gradient scrim.
- Tokens: `ink` (H1, subhead), `ink-muted` (blurb), `accent` (CTA), display serif and mono roles.

### SectionRule
`[DECIDED 2026-10-08]` (audit: SectionRule)
Rules the audit doesn't state (counts, markup, limits, data format) are decided with the anatomy.

- A full-column 1px `rule`, with optional content under it: a serif section title at left and a right aligned
  `TextLink` (the target: "Projects" and "View all projects ->").
- A rule introduces every band; there is no band heading without a rule above it. A heading inside a band (a
  text page's section titles, `#privacy-page-template`) sits under the band's rule and takes none of its own.
  `[DECIDED 2026-10-14]` (S7M-VAL-018; Brian on S7M-VAL-009) Reason: a text page is one band; a rule per section would cut the
  reading text into bands. Rejected: a rule above every section title.
- The right link, if present, is a primary `TextLink` and says where it goes.
- No fill, no icon, no number, no kicker above the title.
- **Spacing** (issue #111). The component's vertical space and its gaps are the `space` steps below and nothing
  else. `[DECIDED 2026-10-24]` (Brian on PR #113)
  - Between the rule and the content under it (the title, the link, or both): `space.2xs`. `[DECIDED 2026-10-24]`
    Reason: the target's "Projects" band runs 63px rule to rule (y 682 to 745), which is the 1px rule, 8px, and
    the section role's 54px line box, so the title reads as hanging from its rule. Rejected: `space.3xs` (the
    title's line box nearly touches the rule), `space.xs` and larger (the title floats free of its rule, and the
    two rules start to read as a box).
  - Wide, between the title and the link: at least `space.m`. `[DECIDED 2026-10-24]` The link sits at the right
    end of the column, so this minimum only shows if the title is long. Reason: as for the header's two groups.
  - Narrow, between the title and the link below it: no added space; the two line boxes separate them.
    `[DECIDED 2026-10-24]`
  - The space below the content, before the band's next element, belongs to the band, not to `SectionRule`.
- Tokens: `rule`, `ink`, `accent`, section title role, `space.2xs`, `space.m`.

### ProjectRow
The signature component. `[DECIDED 2026-10-08]` (audit: ProjectRow)
Rules the audit doesn't state (counts, markup, limits, data format) are decided with the anatomy.

- A row of up to four parts between two 1px `rule`s: (1) serif name with the mono tagline beneath; (2) mono description;
  (3) `TechnicalMetadata`; (4) a vermilion `->` at the far right. Row pitch is constant: every row has the same
  parts in the same columns, except as the next two bullets say. The tagline is shown when the project list
  carries one (it does not yet; see `voice.md#describing-a-project`). `[DECIDED 2026-10-09]`
- **Status.** Every row states its status in words as the first `TechnicalMetadata` field: "In progress" or
  "Concept". No other status is defined. The words are mono `ink-muted` text, like every metadata value; colour, weight, and position never carry the
  status alone. `[DECIDED 2026-10-09]` Reason: Brian's terms (FEAT-02), the brand's refusal of badges, and WCAG 1.4.1.
  Rejected: a badge or pill (a second visual idiom the target doesn't have); a vermilion status (vermilion marks
  direction, not state).
- **A row with no repository.** It has no link and no arrow. Parts 1 to 3 remain; `TechnicalMetadata` shows STATUS,
  plus STACK when the list carries it, and no LICENSE or REPO, because LICENSE and REPO belong to a repository. Part 4 draws nothing, and the column keeps its width so
  the other rows stay aligned. The row is not dimmed, not marked "unavailable", and carries no placeholder.
  `[DECIDED 2026-10-09]` Reason: Brian, "a row with no link is fine"; an invented link or a blank would be invented data.
  Rejected: an ink or muted `->` (it would still promise a destination); collapsing the column (rows would
  jump). When the layout stacks on a narrow screen there is no arrow to keep on the name line, and the name line
  is the name alone. The row is plain list-item text: no `<a>` without `href`, no `aria-disabled`, nothing for
  assistive technology to announce as a control.
- A row with a repository is one link to it. `[DECIDED 2026-10-08]` (FEAT-02: rows link to the repository, not
  to a Valesor-hosted page). Its accessible name is the project name. The arrow is decoration inside the link.
  A row with no repository has no link. `[DECIDED 2026-10-09]`
- Name is the project's own spelling. Tagline is one sentence. Description is one or two.
- No icon, thumbnail, status badge (status is the STATUS field, in words), tag chips, star count, or hover card.
  `[DECIDED 2026-10-09]`
- Rows are a list: `<ul>` of rows, so a screen reader announces the count.
- Tokens: `ink`, `ink-muted`, `rule`, `accent`, row title role, body role.

### TechnicalMetadata
`[DECIDED 2026-10-08]` (audit: TechnicalMetadata; items 7)
Rules the audit doesn't state (counts, markup, limits, data format) are decided with the anatomy.

- A two-column label and value list. Labels uppercase mono, spaced, `ink-muted` at the label size. Values mono.
- Up to four fields, in this order: STATUS, STACK, LICENSE, REPO. STATUS is "In progress" or "Concept".
  `[DECIDED 2026-10-09]` STACK values are separated by commas
  ("Python, TypeScript"). LICENSE is an SPDX identifier ("Apache-2.0"). REPO is the repository path
  without scheme ("github.com/<org>/<repo>").
- A `dl` in markup. Values are real text, selectable.
- Order and labels never vary between rows. STATUS is on every row. REPO is on a row exactly when the project has a
  repository; for a project that has one, a missing REPO is a data defect to fix, not a blank to hide. LICENSE is on every row that has a repository: every project has a license, Apache-2.0 by default
  (`voice.md#the-imprints-own-sentences`), so an entry with a repository and no `spdx` is a data defect to bring to
  Brian, not a blank to hide. A project with no repository leaves REPO and LICENSE out. `[DECIDED 2026-10-09]` (was `[DECIDED 2026-10-08]`:
  "a missing field is a data defect")
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
  statement in `ink-muted` (license line: "Released under Apache-2.0 by default." `[DECIDED 2026-10-08]`); at right, two mono links: GitHub,
  Privacy. No arrow on footer links (they are navigation). No underline at rest, as nav links; hover, active, and
  focus-visible are as in `#interaction-states`, the hover underline appearing at 2px. `[DECIDED 2026-10-14]`
  (Brian on S7M-VAL-009)
- Link order: GitHub, Privacy. Privacy is present on every page.
- No copyright symbol or year (a published "(c)" line implies a company; the license is stated instead). No
  social icons, no sitemap, no newsletter, no back-to-top.
- Narrow: stacks, left aligned.
- **Type and colour** (S7M-VAL-017). Each part takes an existing role; the footer adds no type step.
  `[DECIDED 2026-10-24]` (Brian on PR #118)
  - "Valesor Development": the `nav` role (serif, 1x), in `ink`. Plain text, not a link. Reason: it's the
    smallest serif role in the scale, so the name stays serif and the footer reads as a sign-off under the page,
    not a second header. Rejected: the `wordmark` role (1.6x repeats the header at full size), `column-title`
    (a heading role, and the name is not a heading).
  - The license statement: the `body` role (mono, 1x), in `ink-muted`. Reason: it's a sentence, and at body size
    it reads as a plain statement. Rejected: the `value` role (0.85x makes the license read as fine print, which is
    the legal-footer look the brand refuses).
    Narrow: below about 24rem (384px) the statement wraps to a second line, in the same role, with no new type
    step, as `#hero` lets the subhead wrap. It is one line from 24rem up. "One-line" above means one sentence on
    its own line, not a line that never wraps. Reason: it is 333px at body size, wider than the 272px column at
    320px; holding it to one line would need a smaller size or `nowrap`, and `nowrap` fails reflow (WCAG 1.4.10).
    Rejected: the `value` role to make it fit (it still wraps at 320px).
  - GitHub and Privacy: the `link` role (mono, 1x), in `ink`. Reason: links are mono (`#typography`), and `ink`
    sets them apart from the `ink-muted` statement, as the header's nav links are `ink`. Rejected: the `nav` role
    (serif, which contradicts "mono links" above), `ink-muted` links (they would read as part of the statement).
  - This replaces the earlier tokens line, "wordmark role at the small end, nav role", which named a size the
    scale doesn't have and a serif role for the mono links.
- **Arrangement** (S7M-VAL-017). `[DECIDED 2026-10-24]` (Brian on PR #118)
  - The left group is two lines at both widths: the name, then the statement on the line below it. Reason: a
    colophon reads as a name with a note under it; and on one line, the name, statement, and links overrun the
    column just above the breakpoint (about 700px of type and gaps in the 648px column at 768px). Rejected: name and
    statement side by side when wide (it wraps near the breakpoint and looks different at each width).
  - Wide: the links share the name's baseline (the first line). Reason: as in `BrandHeader`, the name and the
    destinations sit on one line, and the statement is a note beneath the name. Rejected: the last line's baseline
    (it would pair the links with the license sentence, as if they belonged to it).
  - Narrow: the link group goes below the left group, left aligned. GitHub and Privacy stay on one line, as the
    header's nav does; the two links fit at 320px. Reason: consistent with `BrandHeader`. Rejected: one link per
    line (a list of two that reads like a menu).
- **Spacing** (S7M-VAL-017). The footer's vertical space and gaps are the `space` steps below and nothing else.
  The column inset is `#layout`'s, and the links' minimum box is the target size (`#interaction-states`).
  `[DECIDED 2026-10-24]` (Brian on PR #118)
  - Between the footer's rule and the row: `space.m`. Reason: the row is not a title, so it doesn't hang from its
    rule as `SectionRule`'s `space.2xs` title does. The extra space marks it as the page's close. Rejected:
    `space.2xs` (the name would read as a section title), `space.l` and larger (the row floats free of its rule).
  - Below the row, at the end of the page: `space.xl`. Reason: it keeps the last line clear of the viewport's
    bottom edge, including under a mobile browser's toolbar, without a blank screen to scroll through. Rejected:
    `space.m` (the page stops short), `space.2xl` (empty scroll after the content ends).
  - Between the name and the statement: no added space; the two line boxes separate them. Reason: they are one
    group, as the header's narrow wordmark and nav lines are.
  - Between GitHub and Privacy: `space.xl`, at both widths. Reason: the header's nav gap (`#brandheader`,
    `[DECIDED 2026-10-24]`), for the same two destinations.
  - Wide, between the two groups: at least `space.m`. Reason: as for `BrandHeader`'s two groups.
  - Narrow, between the left group and the links: `space.s`. Reason: both are mono at 1x, so without a gap the
    links read as a third line of the statement. Rejected: no added space (that reason), `space.m` (as much space
    as the rule above the footer, so the footer would read as two bands without a rule).
  - The space above the footer's rule belongs to the band before it, not to `Footer` (as in `#sectionrule`).
- Tokens: `rule`, `ink`, `ink-muted`, `nav`, `body`, and `link` roles, `space.s`, `space.m`, `space.xl`.
  `[DECIDED 2026-10-24]` (Brian on PR #118; was: `rule`, `ink`, `ink-muted`, wordmark role at the small end, nav role)

## `/privacy` page template
`[DECIDED 2026-10-08]`
Built under FEAT-04. The text is Brian's and changes only with him (`CLAUDE.md` §7); this specifies the frame.

- The standard frame: `BrandHeader`, then a text page, then `Footer`. No hero, no illustration.
- Text page: one H1 in the display role ("Privacy"); a one-line subhead in `ink-muted` mono; then sections. Each
  section: a serif title in the column-title role, then mono body at a measure of at most 72 characters. Left
  aligned to the content column. Section titles have no rule of their own, and space alone separates the
  sections: `space.l` above each section title after the first (`#sectionrule`); the first takes the `space.xl`
  below the subhead (Spacing, below). Section titles are in the column-title role's title case (`#typography`).
  `[DECIDED 2026-10-14]` ("after the first" `[PROPOSED]`, S7M-VAL-018; was: "`space.l` above each section
  title")
- The text page has no `SectionRule` of its own: `BrandHeader`'s rule is the rule that opens its one band.
  `[DECIDED 2026-10-24]` (Brian, in session on S7M-VAL-018; was: "a `SectionRule`" first, and "the page's one
  `SectionRule` introduces the band") Reason: a `SectionRule` directly under `BrandHeader` puts two full-column
  hairlines in a row: meeting, they read as a double rule the kit has nowhere else; apart, they frame an empty
  stripe, the box `#sectionrule` rejects. Rejected: both of those.
- **Type** (S7M-VAL-018). The subhead is the `body` role (mono, 1x) in `ink-muted`. `[PROPOSED]` Reason: as the
  footer's statement (`#footer`): a sentence at body size reads as a plain statement. Rejected: the `value` role
  (0.85x reads as fine print).
- **Spacing** (S7M-VAL-018). The text page's vertical space and gaps are the `space` steps below and nothing else,
  at both widths. The column, inset, and measure are `#layout`'s. `[PROPOSED]` The reasons compare positions of
  glyphs, computed from the kit's fonts and line heights (`tokens/tokens.json`) at the 15px body size.
  - `BrandHeader`'s rule to the H1: `space.2xl`. Reason: `#layout` puts the largest steps above the H1. This
    sets the H1's cap tops about 89px below the rule's bottom edge (about 90px below its line); the target's
    are 83px below its header rule's line. Rejected: `space.3xl` (about 113px, a gap the target doesn't show),
    `space.xl` (less than the `space.2xl` this page puts between bands, below).
  - The H1 to the subhead: no added space; the two line boxes separate them. Reason: the H1's baseline is then
    about 22px above the subhead's cap tops; the target sets its subhead's cap tops 23px below its H1's baseline.
    The H1 and subhead read as one heading.
  - The subhead to the first section title: `space.xl`. Reason: the page's head ends here, so this gap is wider
    than the `space.l` between sections, and the subhead doesn't read as the first section's lead. Rejected:
    `space.l` (that reason), `space.2xl` (as much as above the H1, which would split the head from its text).
  - A section title to its body: no added space; the line boxes separate them. Reason: a title sits with its own
    text. Its baseline is then about 15px above the body's cap tops, under the paragraph gap below.
  - Between paragraphs and lists, in either order (paragraph, list, or list after list): `space.s`. Where a
    title or the home link follows, its own step applies instead. Reason: it puts about 30px between a line's
    baseline and the next paragraph's cap tops, between the 15px of a title to its body and the 46px of a
    paragraph to the next section's title, so the three steps read apart. Rejected: `space.m` (a blank body line,
    38px, too close to the 46px section break), no space (paragraphs merge in mono, which has no indent).
  - Lists: the item text is indented `space.m` from the column edge, and the bullet hangs in that indent, inside
    the column. Items are `space.2xs` apart. Reason: the bullet and the space after it are about two mono
    characters (18px), so `space.m` keeps the bullet inside the column edge everything else aligns to; and the
    item gap, under the paragraph gap, keeps a wrapped item's lines together while separating it from the next.
    Rejected: `space.s` indent (the bullet would cross the column edge), bullets outside the column, no item gap
    (two wrapped items read as one).
  - The last section to "Return to the home page ->": `space.xl`. Reason: the link closes the page and is not
    part of the last section. Rejected: `space.l` (it would read as the last section's link).
  - Below the link, before the `Footer`'s rule: `space.2xl`. This space is the text page's, not the `Footer`'s
    (`#footer`). Reason: `#layout` puts the largest steps between bands. Rejected: `space.xl` (no more than the
    gap above the link, so the link would float between the text and the footer).
- Tokens (S7M-VAL-018): `ink`, `ink-muted`, display, `body`, column-title, and `link` roles, `space.2xs`, `space.s`,
  `space.m`, `space.l`, `space.xl`, `space.2xl`, `layout.measure`. `[PROPOSED]`
- Lists use plain bullets in body type. No tables, no callouts, no accordions, no icons, no checkmarks.
- Links in the text are underlined `ink`, no arrow. The page ends with a secondary `TextLink` to the home page,
  reading "Return to the home page ->" (`voice.md#cta-vocabulary`). `[DECIDED 2026-10-14]`
- The page states in its first screen what is and isn't measured, as the text provides. The look makes no claim
  of its own.
- Reads fully with JavaScript off, at both layouts.

## Dependencies on later stories
Tokens and fonts, the illustration system and hero art, and `qa.md` follow this file (out of scope here). Where
this file says "set at token time" it points at the tokens story.
