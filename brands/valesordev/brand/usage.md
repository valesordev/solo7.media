# Valesor Development: usage

Correct and incorrect usage, component by component, and how components combine into pages. The rules and
anatomy are in `visual-language.md`; this file shows them applied. Where an example conflicts with a rule there,
the rule governs and this file is the defect.

Status marks as in `foundation.md`. Examples are specimens of structure and copy, not final copy for any page.
Each section is a stable anchor: cite `usage.md#<section>`.

## Before building anything
1. Read `foundation.md`, `visual-language.md`, `voice.md`, and this file.
2. Use a token or ask. A hex value, font name, or spacing literal in a component is a defect.
3. If a thing isn't covered, ask visual-designer on the story (`story comment <ID> --to visual-designer`) and
   move on. Don't pick a value.

Never introduce, unless Brian asks in the session: new colors, new font families, rounded or card-heavy UI,
gradients, shadows, marketing copy, decorative diagrams, or additional illustration styles. `[DECIDED 2026-10-08]`
(brief, the "never introduce" example in the brief's section 6)

## brandheader

`[DECIDED 2026-10-08]` (`visual-language.md#brandheader`). Nav lists only destinations that ship; there is no About
link.

**Correct**
- Serif "Valesor Development" at left, linking to `/`; serif Projects and GitHub at right; a 1px rule under.
- Narrow: wordmark on one line, links on the next, rule below; nothing collapses behind an icon.

**Incorrect**
- A logo image, glyph, or tagline beside the wordmark.
- A filled "Get started" or "Contact" button in the header.
- Arrows, pills, or hover colors on nav links.
- A hamburger menu or drawer.
- A sticky or shrinking header; a header shadow.
- Sans-serif nav.

## hero

**Correct**
- H1 "The engineering imprint.", a one-line subhead, a two-line mono blurb, and one vermilion CTA ("Browse the
  source ->"), all in the clear sky of a full-bleed engraving.
- Type left aligned to the content column; art ragged at the bottom, sitting above the rule that follows.
- Narrow: type, CTA, then the art as a band below.

**Incorrect**
- Type over the engraved ground, with a scrim or gradient to make it legible.
- Two CTAs, or a ghost button beside the primary.
- A badge, counter, "new" flag, or announcement bar.
- Text baked into the image.
- A stock photo, a 3D render, a screenshot, or any art outside `illustration-system.md`.
- A carousel, video, or animated art.
- "Welcome to Valesor!" or any greeting.

## sectionrule

**Correct**
- A hairline across the column, then a serif title "Projects" at left and "View all projects ->" in vermilion at
  right.
- A rule above every band, including the footer.

**Incorrect**
- A heading with no rule above it.
- A filled bar, band, or tinted section background.
- A kicker or number above the title ("01 / Projects").
- A right link that isn't an action, or two links on the right.
- A rule heavier or lighter than the rest, or in vermilion.

## projectrow

**Correct** (structure specimen; the data is placeholder, not content)
```
Andara's World          Tools, generators, and systems     STACK    Python, TypeScript         ->
A living world for      for building and exploring a       LICENSE  Apache-2.0
fiction, built with     coherent fictional world.          REPO     github.com/<org>/<repo>
code.
-------------------------------------------------------------------------------------------------
```
- Serif name, mono tagline under it, mono description, `TechnicalMetadata`, vermilion `->` at the right.
- One link for the whole row, to the source repository, named by the project.
- Same four parts in the same columns in every row, in a list.
- Data from the repository itself.

**Incorrect**
- A card with a border, shadow, radius, or fill.
- A thumbnail, icon, language dot, star count, or status badge.
- Tag chips instead of comma-separated stack.
- A hover card or reveal.
- Placeholder or invented data (the target's repository URLs and the typo "fction" are tells, not content).
- An arrow in ink, or a glyph `→` instead of the typed `->`.
- Rows with different parts, or a missing LICENSE shown as a blank.
- A "Learn more" link inside the row.

## technicalmetadata

**Correct** (structure specimen; the values are placeholders)
```
STACK    Python, TypeScript
LICENSE  Apache-2.0
REPO     github.com/<org>/<repo>
```
- Uppercase mono labels in `ink-muted`; values in mono; comma-separated stack; SPDX license; repository path
  without scheme.
- Always the three fields in this order.

**Incorrect**
- A middle dot as the separator ("TypeScript · SQLite").
- "Apache 2" or "Open source" in place of the identifier.
- A full `https://` URL, or a repository that doesn't resolve.
- Colored badges, shields, or icons for the license or language.
- Reordering fields per project, or hiding a field with no value.
- Metadata in a table with borders or filled header cells.

## textlink

**Correct**
- Primary: `Browse the source ->` in vermilion with a 1px vermilion underline, once per band.
- Secondary: `Read the license ->` in ink with a 1px grey underline.
- Inline in a sentence: underlined ink, no arrow.
- Hover: underline thickens to 2px. Focus: a 2px ink outline.

**Incorrect**
- `Learn more`, `Get started`, `Click here`, or any link whose text doesn't name the action.
- A glyph arrow `→` or an icon in place of `->`.
- An arrow on nav links, the wordmark, or inline prose links.
- Vermilion for anything but a primary action or direction (decoration, emphasis, headings).
- Button styling: fill, border, radius, or padding that makes the link a box.
- A hover color or a removed focus outline.
- A second primary CTA in the same band (a `ProjectRow` arrow isn't a CTA).

## footer

`[DECIDED 2026-10-08]` (see `visual-language.md#footer`)

**Correct**
- A rule, then "Valesor Development" with a one-line license statement (text `[PROPOSED]`, Brian approves) at left; GitHub and
  Privacy at right, as plain mono links.
- The Privacy link on every page.
- Narrow: stacked, left aligned.

**Incorrect**
- A copyright symbol, year, or "All rights reserved".
- Social icons, a newsletter field, a sitemap, or a back-to-top control.
- A tinted or dark footer band.
- A link to a page that doesn't exist.
- Arrows on footer links.

## privacy-page

`[DECIDED 2026-10-08]` (see `visual-language.md#privacy-page-template`). Text is Brian's.

**Correct**
- `BrandHeader`, a rule, "Privacy" as the H1, a one-line subhead, titled sections of mono text at a 72 character
  measure, `Footer`. Reads with JavaScript off at both layouts.
- Plain first person singular statements of what is and isn't measured.

**Incorrect**
- A cookie banner, consent dialog, or "manage preferences" control.
- A hero or illustration on the page.
- Tables, accordions, callouts, icons, or checkmark lists.
- A legal tone: "the Company", "Services", "Users agree".
- Any claim the page's text doesn't make: the look adds none.

## Page recipes
How the components combine. `[DECIDED 2026-10-08]`: the homepage is the specimen, and the other recipes follow from it.

### homepage
`BrandHeader`, `Hero` over the engraving, a rule, then a `SectionRule` "Projects" with its link, `ProjectRow`s,
and the `Footer`. The target's three-column info band (What is Valesor Development? / License / What belongs
here?) is the audit's candidate. It is not specified here. If the homepage story needs it, visual-designer
specifies it on the story with this file's rules (serif column titles, mono text, a secondary `TextLink`,
hairline dividers, stacking when narrow). `[DECIDED 2026-10-08]`

### text page
`BrandHeader`, `SectionRule`, H1, subhead, sections at the reading measure, `Footer`. For `/privacy` and the 404.

### 404
`BrandHeader`, the H1 "Not found.", the sentence from `voice.md#errors-empty-states-and-the-404`, one
secondary `TextLink` home, `Footer`. `[DECIDED 2026-10-08]`

## Self-check
Before a PR, ask the brief's questions: Does it look editorial or technical rather than commercial? Is the
palette still ink, paper, and one accent? Are rules and type doing the layout? Was whitespace preserved? Did
any gradient, shadow, or card appear? Does the copy say what the software is? Is Valesor an imprint? Is "I" used
when a person is needed? Are source and license visible? The full checklist is `qa.md` (later story).
