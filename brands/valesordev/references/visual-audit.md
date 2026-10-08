# Valesor Development — visual audit

**Target:** references/target-homepage.png (sha256 b67f5adac546) · frozen 2026-10-08 from https://app.notion.com/p/3f26a339c86181249193d3b987def934
**Status:** core rows approved 2026-10-08 (PR #20); candidate and hero rows still `[PROPOSED]`

Classes: **core** (persists across the brand) · **candidate** (test before adopting) · **hero** (this composition only).
Every line is `[PROPOSED]` until Brian decides it, then `[DECIDED <date>]`; Decisions lists what he has decided so far.

Measurements are in target pixels (1586 × 992, one frame, no responsive evidence). Colours were sampled from named
regions; text colours are anti-aliased at small sizes, so they are estimates of the intended value, not exact.
Brief: the Notion page's character (quiet, durable, precise, independent, open, technical, field-tested) and its
"Not Valesor" list (startup/SaaS, cyberpunk, glossy renders, gradients, glassmorphism, heavy animation, decorative Norse).

## Palette
| Role (observed) | Hex | Area ≈ | Where | Class | Status | Why |
|---|---|---|---|---|---|---|
| paper | ≈ #FEFEFE median (range #FCFCFC–#FFFFFF) | ~83% of pixels at L ≥ 240 | page ground, whole page | core | [DECIDED 2026-10-08]| neutral, not warm (Q1); the surface is near-white; everything else sits on it |
| ink (illustration) | #000000 | ~6% of pixels at L < 100 (mostly the illustration) | engraving line | core | [DECIDED 2026-10-08] | the engraving is pure black, as the brief's "pure black ink on pure white" asks |
| ink (display type) | #000000 as sampled | small | wordmark, H1, section/row titles | core: #111111 for type, #000000 only in the engraving | [DECIDED 2026-10-08]| the target renders it pure black; the brief says #111111 |
| ink-muted | ≈ #555555 | small text | mono body, descriptions, metadata values | core | [DECIDED 2026-10-08] | a single mid grey carries all secondary text; matches the brief's `ink-muted #545454` |
| ink-faint | ≈ #808080 | tiny | metadata labels (STACK / LICENSE / REPO) | candidate | [PROPOSED] | could be ink-muted at a smaller size; anti-aliasing makes it unclear whether it is a third grey |
| rule (light) | ≈ #CCCCCC–#D6D6D6 | 1px lines | row dividers, vertical column dividers, header rule's first pixel | core | [DECIDED 2026-10-08]| hairlines carry the layout; the hex is a sample, the token set fixes the value |
| rule (strong) | ≈ #A6A6A8–#B1B2B3 | 1px lines | header rule, section rules above/below "Projects" block | candidate | [PROPOSED] | two rule weights may be intended (structure vs. row) or one rule rendered unevenly; it is a decision for the token set |
| accent | ≈ #C8202A (darkest sampled #CA0F18; mid-stroke #C62A24) | ~0.03% | primary CTA text and underline, "View all projects ->" (target shows →; see Decisions item 6), row arrows | core | [DECIDED 2026-10-08]| the only chroma in the page (about 0.1–0.15% of pixels have a channel spread above 15); direction and primary action only |

Artefacts (not colours): the "white" ground varies #FCFCFC–#FFFFFF with a faint, even grain (generator noise, not
a warm paper tone); text edges carry grey fringing and some JPEG-like softness; link underlines read #AEAEAF only
because they are 1px anti-aliased.

**Drift from the brief:** the Notion page lists `paper #FAFAF7` (warm) and `rule #CFCFC8` (warm), `ink #111111`.
The target is neutral: no warm cast in the ground or rules, and its ink is pure #000. Q1 answered 2026-10-08: neutral paper and rules (see Decisions); the ink value for type is still to confirm.

## Typography

Arrow glyphs (`→`) in this section are observations of the target. The kit uses a typed `->` (Decisions item 6).
| Role | Sample | Class/family guess | Size vs body | Weight · case · tracking | Class | Status |
|---|---|---|---|---|---|---|
| Wordmark | "Valesor Development" | serif, Times-like transitional/old-style with sharp serifs | ≈ 1.6× | regular · title case · slightly tight | core | [DECIDED 2026-10-08] |
| Display (H1) | "The engineering imprint." | same serif, large | ≈ 4× (cap-to-descender ≈ 56px) | regular · sentence case · tight (≈ −1%) | core | [DECIDED 2026-10-08] |
| Subhead | "Software, tools, and systems — released in the open." | same serif | ≈ 1.7× | regular · sentence case | core | [DECIDED 2026-10-08] |
| Section title | "Projects" | same serif | ≈ 2.4× | regular · sentence case | core | [DECIDED 2026-10-08] |
| Column / row title | "License", "Andara's World" | same serif | ≈ 1.2× (column) / ≈ 1.7× (row) | regular · title case | core | [DECIDED 2026-10-08] |
| Body / descriptions | hero blurb, column text, row descriptions | monospace, humanist, dotted-or-slashed zero (IBM Plex Mono–like) | 1× (≈ 14–15px) | regular · sentence case · normal | core | [DECIDED 2026-10-08] |
| Metadata | STACK / LICENSE / REPO + values | same mono, labels uppercase | ≈ 0.85× | regular · labels uppercase, spaced · values as written | core | [DECIDED 2026-10-08] |
| Nav | Projects, GitHub, About | serif, small | ≈ 1× | regular | candidate | [PROPOSED] |
| Links / CTAs | "Browse the source →", "Read the license →" | mono, underlined, trailing arrow (CTAs and action links only, not nav) | 1× | regular · sentence case | core | [DECIDED 2026-10-08] |

Pairing: serif for names and headings, mono for everything that explains or measures. No sans-serif appears. The
Notion page allows "body serif or restrained sans"; the target chose mono for body, which is a stronger and less
common choice than the brief assumed (Q2).

Font candidates (OSS, self-hostable), licence to be confirmed by Brian's pick:
- Display serif: Newsreader (OFL), Source Serif 4 (OFL), Libre Caslon Text (OFL), Tinos (Apache-2.0, Times metric clone).
- Mono: IBM Plex Mono (OFL), JetBrains Mono (OFL), Commit Mono (OFL).
Choosing is Brian's.

## Layout
| Observation | Class | Status | Why |
|---|---|---|---|
| Single content column inset ≈ 60px each side (x 60–1528 of 1586, ≈ 3.8%; the header rule and "View all projects" run ≈ 3px past it, probably generator slop), full-bleed only for the illustration | core | [DECIDED 2026-10-08] | a constant frame the rules hang from |
| 1px horizontal rules separate every band: under header (y 60), under hero (y 511), above "Projects" (y 682), under its title (y 745), between rows (y 824, 907). Rules do the layout, not boxes or fills | core | [DECIDED 2026-10-08] | the brief: "rules and typography doing most of the layout work" |
| Three-column info band with 1px vertical dividers at x 531 and 1052 (columns ≈ 471 / 520 / 476), text inset ≈ 60px from each divider | candidate | [PROPOSED] | strong component, but column widths are uneven and may be generator rounding |
| ProjectRow is a 4-part grid: title+tagline (x ≈ 67), description (x ≈ 572), metadata block (x ≈ 1102), arrow (x ≈ 1517); row pitch ≈ 80px | core | [DECIDED 2026-10-08] | the brief's signature component |
| Generous vertical space: header 60px; ≈ 70px above the H1; ≈ 30px between hero and info band | candidate | [PROPOSED] | rhythm is clear but only one frame shows it |
| No cards, no shadows, no radii, no filled panels, no background bands | core | [DECIDED 2026-10-08] | direct match to "Not Valesor" |

## Composition and image behavior
| Observation | Class | Status | Why |
|---|---|---|---|
| Hero art is full-bleed left to right, bottom edge ragged and sitting ≈ 20px above the rule at y 511 | core | [DECIDED 2026-10-08] | the illustration is the brief's "primary recognizable element" |
| Aspect ≈ 3.7:1 as cropped here (1586 × ≈ 355 of art); the brief names `hero-wide` as 2.4:1 | candidate | [PROPOSED] | the target is shorter than the brief's ratio; the slot spec resolves it |
| H1, subhead, blurb, CTA sit in the upper-left empty sky; the tree crown (≈ x 650–870) rises beside the right end of the subhead (ends ≈ x 602) | core | [DECIDED 2026-10-08] | "large intentional negative-space zones": type lives in the art's empty zone |
| Subject: wind-shaped juniper on a rocky crest, scrub, a layered ridge falling to a basin, mountains at right, a large moon at upper right (≈ x 1290–1395, y 135–235) | hero | [PROPOSED] | this subject belongs to this slot; the *language* is core, below |
| Moon: stippled disc with a thin dotted outline, no fill | candidate | [PROPOSED] | recurring "large moon" is in the brief; test it in other compositions before making it a mark |

## Navigation, mark, components

Arrow glyphs (`→`) in this section are observations of the target. The kit uses a typed `->` (Decisions item 6).
| Pattern | Parts | Class | Status | Why |
|---|---|---|---|---|
| `BrandHeader` | serif wordmark left, three serif text links right, 1px rule below; no button, no logo glyph. Nav links carry no arrow. | core | [DECIDED 2026-10-08] | every page frame starts here; a plain text header fits the brief's "Not Valesor" ban on startup and SaaS branding |
| Mark | the wordmark is the only mark; no symbol is visible | core | [DECIDED 2026-10-08] | the brief says the mark "can remain relatively quiet"; the target shows no glyph |
| `Hero` | H1, subhead, mono blurb, red CTA over the illustration | core | [DECIDED 2026-10-08] | the brief makes the hero art the primary recognizable element, with type in its empty zone |
| `TextLink` (primary) | mono, vermilion, 1px vermilion underline, trailing `->` (target shows `→`) | core | [DECIDED 2026-10-08] | colour appears only on primary actions |
| `TextLink` (secondary) | mono, ink, 1px grey underline, trailing `->` (target shows `→`; "Read the license →") | core | [DECIDED 2026-10-08] | quiet counterpart so only the main action is red |
| `SectionRule` | 1px full-width rule, optionally with a serif title and a right-aligned red link ("Projects" / "View all projects ->") | core | [DECIDED 2026-10-08] | rules carry the layout, per the brief's QA list |
| Info column | serif title, mono text, optional secondary link, vertical hairline divider | candidate | [PROPOSED] | appears once, with uneven widths; test on a second page before adopting |
| `ProjectRow` | serif name, mono tagline under it, mono description, `TechnicalMetadata`, vermilion arrow (`->` in the kit) | core | [DECIDED 2026-10-08] | the brief calls it a strong candidate for the signature component |
| `TechnicalMetadata` | uppercase mono label, two-column label/value list: STACK (comma-separated, Decisions item 7), LICENSE, REPO | core | [DECIDED 2026-10-08] | source, license and repo visible is a brand QA item and the brief's "technical metadata in mono" |

## Line, texture, hierarchy, motifs
- Line weights: UI rules and underlines are 1px hairlines; the illustration uses heavy contour with fine hatching and stipple. **core** `[DECIDED 2026-10-08]`: the contrast between hairline UI and engraved art is the look.
- Texture: none on the page; the only texture is the engraving. No grain, noise, or paper effect was added deliberately. **core** `[DECIDED 2026-10-08]` (matches "no gradients").
- Hierarchy and read order: wordmark → H1 → subhead → blurb → red CTA → art → three facts → "Projects" → rows. Black serif carries rank; the only colour is the action. **core** `[DECIDED 2026-10-08]`.
- Motifs: a trailing arrow on call-to-action and action links (typed `->` in the kit; the target shows `→`); navigation links in the header carry no arrow. The arrow appears in vermilion for primary actions and in ink for secondary. **core** `[DECIDED 2026-10-08]`. Stack separator: a comma, not `·` (`[DECIDED 2026-10-08]`, Decisions item 7).
- Illustration language (not this subject): pure black on white, no grey wash, no gradients, flat light, heavy contours with hatch and stipple. **core** `[DECIDED 2026-10-08]`, to be written up in `art-direction/illustration-system.md`.

## Copy and voice signals
- H1 "The engineering imprint." and the line "Not a company. No clients. No products. Just work in the open." match the brief's voice. **core** `[DECIDED 2026-10-08]`.
- CTA wording "Browse the source →", "Read the license →", "About this project →", "View all projects →": all on the brief's preferred list or its style. **core** `[DECIDED 2026-10-08]`.
- Subhead uses a spaced em dash ("— released in the open"); the "What belongs here?" column also uses one. `[DECIDED 2026-10-08]` no em dashes, and no characters off a standard keyboard, in copy (Decisions).

## Not evidenced by the target
No class applies; these need a brand decision, not an observation. Mobile crop and stacking (Q4); max content width (Q4); `Callout` and `Footer` components, which the brief lists but the image does not show; first-person voice, since nothing in the frame says "I" or "we".

## Tells (never core)
- **Typo:** "A living world for fction, built with code." Row 1's tagline drops the "i" in "fiction". The same row's description spells it correctly.
- **Invented URLs:** `github.com/valesor/andaras-world`, `…/vagabond`, `…/project-sites`. The GitHub organisation here is `valesordev`; nothing confirms these repos or a `valesor` org.
- **Invented stack and project data:** stack lists (e.g. "TypeScript · SQLite · Tauri") and the "Project Sites" project are placeholder content unless Brian confirms them.
- **Image softness:** low-resolution, slightly blurred text edges and faint speckle on the paper, so letterforms cannot be read as a font specimen.
- **Apparent apostrophe style:** "Andara’s World" uses a typographic apostrophe in the row title but straight quotes appear nowhere else to compare; not a tell, noted for the type spec.

## Distinctness
No sibling imprint has an approved audit yet (Valesor goes first), so there is nothing to compare against. Flag
for the next audit: the paper, ink, and hairline-rule items are core here and will probably recur in other imprints;
the serif + mono pairing, the vermilion accent, and the engraving language should stay Valesor's alone.

## Open questions for Brian (answered 2026-10-08, see Decisions)
1. Paper and ink: the target is neutral (≈ #FEFEFE ground, #000 ink, grey rules) but the brief says warm (#FAFAF7 paper, #111 ink, #CFCFC8 rule). Recommend the target's neutral values for paper and rules, because the hero is "pure black ink on pure white" and a warm ground would tint the engraving's whites; keep ink at #111 on UI text and use #000 only in the illustration, because pure black type at this weight is harsh on a bright ground. Rejected: adopting the brief's warm paper (the illustration would sit on a visible tint).
2. Body typeface class: the target sets all running text in monospace. Recommend keeping mono as body for the home page and metadata but leaving long-form reading (project pages, README-style content) to a decision when the docs are written, because the image only proves it works for short passages.
3. Accent: the target's red is ≈ #C8202A. Recommend a single vermilion near that value, derived at token time against 4.5:1 on paper (it is ≈ 5.5:1 as sampled), and used only for primary action and direction. Rejected: a second, muted red for hover.
4. Reading measure, mobile crop, and breakpoints: the target is one 1586px frame. Recommend I specify a max content width and the mobile stacking order in `visual-language.md` once the audit is decided, rather than inferring them here.
5. Em dashes in copy (subhead, "What belongs here?"): allow, or avoid in the voice doc? Recommend avoid, because the brief's copy rules are plain and short and a spaced dash reads as generated.

## Decisions
- 2026-10-08 Brian, on the open questions (core rows are decided; candidate and hero rows are still proposed):
  1. "Neutral". Decided: neutral paper and rules from the target, not the brief's warm values (paper and light-rule rows are `[DECIDED 2026-10-08]`). Type ink is #111111 and #000000 is only for the engraving (item 7).
  2. "Mono is good". Mono stays as the body and metadata face (body and metadata rows `[DECIDED 2026-10-08]`). Whether long-form reading also uses it is still open; the recommendation (decide when the docs are written) stands. I read "Mono is good" as covering the home page and metadata.
  3. "agree". One vermilion near #C8202A, action and direction only; accent row `[DECIDED 2026-10-08]`.
  4. "agree". I specify max content width, mobile crop, and breakpoints in `brand/visual-language.md` after the audit is decided.
  5. "avoid em dashes and other characters not on a human keyboard". Voice rule for `brand/voice.md`. My reading of "other characters": copy uses only characters typed on a standard keyboard, so no em or en dashes, no curly quotes or apostrophes, no ellipsis character. This changes the target copy: the subhead and "What belongs here?" lose their dashes, "Andara's World" uses a straight apostrophe, and the `→` arrow on links and rows becomes a typed `->` (item 6).
  6. "use the typed ->". Decided: link and row arrows are typed `->` in copy and CTAs, not the `→` glyph the target shows. The target's `→` is an observation; the kit's arrow is `->`. Primary and row arrows are vermilion per item 3; the ink secondary link arrow is decided with the core TextLink row (item 8).
  7. "#111 for type, comma for the separator". Decided: type ink #111111, #000000 only in the engraving; stack lists use a comma ("TypeScript, SQLite, Tauri"), not `·`.
  8. All 18 core checkboxes on PR #20 checked, so every core row is `[DECIDED 2026-10-08]`. One checkbox still reads "trailing `→` on every link"; the audit row governs: arrows on call-to-action and action links only (Codex review, e46d97c), typed `->` (item 6). Candidate and hero rows were not on the checklist and stay `[PROPOSED]`.
