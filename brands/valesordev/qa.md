# Valesor Development: brand QA

**Status:** approved 2026-10-14 (S7M-VAL-009: PR #72, approved 2026-10-12; its open marks decided by Brian
2026-10-14, "agree" on the story)
**Sources:** brand/foundation.md, brand/visual-language.md, brand/usage.md, brand/voice.md, tokens/tokens.json,
tokens/README.md, all @ 26d2d0e, with the 2026-10-14 decisions

The checklist `/brand-qa valesordev` runs, and the visual check of `CLAUDE.md` §8 item 3. Every item is a yes/no
question answered by looking at the rendered page (or, for the token check, its component and site style source), and each names the
section it enforces. A "no" is a fail. The docs govern: where an item and its cited section disagree, the section
wins and this file is the defect. This file adds no rule of its own.

Status marks as in `foundation.md`. An item with no mark restates a `[DECIDED]` rule in the section it cites.
A `[DECIDED 2026-10-14]` mark on an item is how the check is run, or a rule decided that day, recorded in the
section it cites. No item is `[PROPOSED]`.

## How to run it
- **Theme:** light only. There is no dark theme. (`visual-language.md#color`, Themes)
- **Widths:** two, one per layout: desktop at 1440 CSS px (wide layout) and mobile at 390 CSS px (narrow layout,
  below the 48rem breakpoint). `[DECIDED 2026-10-14]` (the docs fix the breakpoint, `visual-language.md#layout`,
  not the test widths; these are the widths in the `/brand-qa` examples). Plus one reflow check at 320 CSS px
  (item 80).
- An item marked "Wide" is answered at desktop width only; at mobile width the narrow-layout item that follows it
  governs. (`visual-language.md#narrow-layout-mobile`)
- **JavaScript off** at both widths: every item below is answered with JavaScript disabled. (`CLAUDE.md` §5)
- **Evidence:** each result names a screenshot region, a selector, or a CSS line. Never judge a page from its
  source alone.
- **Scope:** run the sections for the components the page has. Identity, Palette and type, Characters,
  Anti-patterns, Tokens, and Accessibility apply to every page.

## Identity
1. Would a reader take the page for an engineering monograph, survey drawing, field manual, or technical journal,
   rather than a software company's homepage? (`foundation.md#the-model-a-monograph-not-a-homepage`)
2. Does it read as quiet, durable, precise, independent, open, technical, and field-tested, as the character table
   describes each word? (`foundation.md#character`)
3. Is Valesor Development named as an imprint, never a company, studio, team, firm, or brand? Saying what it is
   not ("Not a company.") passes. (`foundation.md#identity`, `voice.md#first-person-singular`)
4. Is the mark the serif wordmark "Valesor Development" alone, with no symbol, glyph, or logo image?
   (`foundation.md#identity`, `visual-language.md#brandheader`)
5. Is the page free of anything borrowed from a sibling imprint's look (System 9 Studios, Solo7 Productions,
   solo7.media, bashburn.com)? (`foundation.md#brand-family-boundary`)

## Palette and type
### Colour roles
6. Is every colour on the page one of `paper`, `ink`, `ink-muted`, `rule`, or `accent`, plus `#000000` inside the
   engraving only? (`visual-language.md#color`, `foundation.md#what-the-brand-is-made-of` item 1)
7. Is `ink` on display and body type and the wordmark; `ink-muted` on descriptions, taglines, metadata, and footer
   text; `rule` on hairlines only? (`visual-language.md#color`, role table)
8. Is vermilion (`accent`) used only for primary action text and underline, `ProjectRow` arrows, and the
   `SectionRule` link, and never for a heading, decoration, emphasis, status, or a rule? (`visual-language.md#color`,
   `usage.md#textlink`, `usage.md#sectionrule`)
9. Is there no hover colour, state colour, second accent, opacity tint, or tinted ground?
   (`visual-language.md#color` Rules, `foundation.md#not-valesor`)

### Type roles
10. Do serif things name (wordmark, H1, subhead, section titles, project names, column titles, nav) and mono
    things explain and measure (body, descriptions, taglines, metadata, links and CTAs, footer text)?
    (`visual-language.md#typography`, role table)
11. **No sans-serif:** is every glyph on the page set in Source Serif 4 or Source Code Pro, with no sans-serif and no
    third family anywhere, including fallbacks that actually rendered? (`visual-language.md#typography`,
    `foundation.md#what-the-brand-is-made-of` item 3)
12. Is the weight regular throughout: no bold, no italic display? (`visual-language.md#typography`)
13. Is no typeface from IBM present, in any role? (`visual-language.md#typography`)
14. Are metadata labels uppercase mono, spaced, in `ink-muted`? Is each text role listed here in the case the role
    table gives it (sentence case for H1, subhead, section titles, body, and links; title case for the wordmark, row
    titles, and column titles, including `/privacy` section titles, item 54)? (`visual-language.md#typography`,
    `voice.md#case-and-punctuation`) `[DECIDED 2026-10-14]`
15. Does running text on a text page stay within 72 characters a line, with body line height at least 1.5?
    (`visual-language.md#typography` Notes, `visual-language.md#layout`)
16. Is all text real, selectable text, with none set inside an image? (`visual-language.md#typography` Notes,
    `visual-language.md#illustration`)

## Layout and hairlines
17. Is there one centered content column, inset by a constant margin, no wider than 75rem, with every header,
    section, and row rule hanging from it? Is the hero illustration the only full-bleed element?
    (`visual-language.md#layout`)
18. **Hairline weights:** is every rule and divider 1px, in `rule`, at one weight everywhere, with no heavier,
    lighter, or vermilion rule? (`visual-language.md#layout`, `visual-language.md#color` Not roles,
    `usage.md#sectionrule`)
19. Does every band open with a rule (a rule, space, content, a rule), including the footer, and is there no
    band heading without a rule above it? (`visual-language.md#layout`, `visual-language.md#sectionrule`,
    `usage.md#sectionrule`, `visual-language.md#footer`) A heading inside a band (a text page's section titles)
    takes no rule of its own and passes. `[DECIDED 2026-10-14]`
20. Are rules and type doing the layout: no box, border other than a hairline rule, fill, radius, or shadow?
    (`visual-language.md#layout`, `foundation.md#what-the-brand-is-made-of` item 4)
21. Is whitespace left empty rather than filled, with the largest space above the H1 and between bands?
    (`visual-language.md#principles` 3, `visual-language.md#layout`)
22. At mobile width, does everything stack in reading order, left aligned, with the same inset and rules, and no
    intermediate layout? (`visual-language.md#narrow-layout-mobile`)

## Hero
23. Wide: are the H1, subhead, blurb, and CTA set in the illustration's empty sky, never on engraved ground?
    At both widths: is there no scrim, overlay, or gradient behind any type? (`visual-language.md#hero`,
    `visual-language.md#illustration`, `usage.md#hero`)
24. Is there exactly one H1, a mono blurb, and exactly one vermilion CTA? Wide: is the subhead a single line and
    the blurb at most two short lines? At mobile width, do the subhead and blurb wrap in their own roles, with no
    other type size? (`visual-language.md#hero`) `[DECIDED 2026-10-14]`
25. Wide: is the type left aligned to the content column, in the left part of the frame?
    (`visual-language.md#hero`)
26. Does the illustration run full-bleed, its bottom edge ragged, sitting just above the rule beneath?
    (`visual-language.md#illustration`)
27. Is the hero free of a second CTA, ghost button, badge, counter, "new" flag, announcement bar, scroll cue,
    carousel, video, animated art, and greeting? (`usage.md#hero`, `visual-language.md#hero`)
28. At mobile width, is the order H1, subhead, blurb, CTA, then the art as a full-bleed band below?
    (`visual-language.md#narrow-layout-mobile` item 2)
29. Is the illustration pure black pen-and-ink on white (heavy contour, hatch and stipple, no grey wash or
    gradient), and free of text? (`visual-language.md#illustration`, `foundation.md#what-the-brand-is-made-of`
    item 5) Is it from an installed art slot with provenance? `[DECIDED 2026-10-14]` (the role's rule for
    generated art, `.claude/roles/visual-designer.md`, and `art-direction/illustration-system.md`, AD v1)
30. Is the decorative homepage hero marked `alt=""`? (`visual-language.md#illustration`)

## Component usage
### BrandHeader
31. Is it the first element: the serif wordmark linking to `/`, serif Projects and GitHub links, a 1px rule under
    it, and no About link? Wide: is the wordmark at left and the links at right? (`visual-language.md#brandheader`, `usage.md#brandheader`)
32. Is it free of arrows, pills, buttons, rest underlines, and hover colours on nav links, with the current page
    shown only by a 1px underline? Is the wordmark free of a rest underline too? (`visual-language.md#brandheader`)
33. Is it neither sticky nor shrinking, with no shadow, hamburger, or drawer, and at mobile width are the wordmark
    and links on two lines, all visible? (`usage.md#brandheader`, `visual-language.md#narrow-layout-mobile` item 1)

### SectionRule
34. Is it a full-column hairline, then a serif title at left and, if present, one primary `TextLink` that names
    where it goes? Wide: is that link right aligned? (`visual-language.md#sectionrule`, `usage.md#sectionrule`)
35. Is it free of a fill, icon, number, or kicker above the title? At mobile width, is the link below the title,
    both left aligned? (`usage.md#sectionrule`, `visual-language.md#narrow-layout-mobile` item 4)

### ProjectRow
36. Is the row up to four parts between two 1px rules: serif name (tagline beneath only if the project list
    carries one), mono description, `TechnicalMetadata`, and, on a row with a repository, a vermilion `->` at the
    far right? (`usage.md#projectrow`, `visual-language.md#projectrow`)
37. Does every row have the same parts, differing only where a row has no repository? Wide: are they in the same
    columns? (`usage.md#projectrow`, `visual-language.md#projectrow`)
38. Does each row state its status in words, "In progress" or "Concept", as the first `TechnicalMetadata` field,
    with colour, weight, and position never carrying it alone? (`usage.md#projectrow`, `voice.md#status-words`)
39. Is a row with a repository one link to it, whose accessible name is the project name? (`usage.md#projectrow`,
    `visual-language.md#projectrow`)
40. Does a row with no repository have no link, no `->`, no placeholder, no blank, and no "coming soon"; leave
    LICENSE and REPO out; and stay undimmed in `ink` and `ink-muted`? Wide: does it keep the arrow column's width
    so columns stay aligned? (`usage.md#projectrow`, Correct: a row with no repository;
    `visual-language.md#projectrow`)
41. Is a row with no repository plain list-item text, with no `<a>` without `href`, `role="link"`,
    `aria-disabled`, or `tabindex`? (`usage.md#projectrow`)
42. Are the rows a `<ul>`, and free of cards, borders, shadows, radii, fills, thumbnails, icons, language dots,
    star counts, status badges, tag chips, hover cards, and "Learn more" links? (`visual-language.md#projectrow`,
    `usage.md#projectrow`)
43. Is the row data real: no placeholder or invented data, no target-image repository URLs, no "fction"?
    (`usage.md#projectrow`, `voice.md#describing-a-project`)
44. At mobile width, do name, description, and metadata stack, with the arrow on the right of the name line, and
    on a row with no repository no arrow and a name line that is the name alone?
    (`visual-language.md#narrow-layout-mobile` item 5, `visual-language.md#projectrow`)

### TechnicalMetadata
45. Is it a `dl` of uppercase mono labels in `ink-muted` and mono values, fields in the order STATUS, STACK,
    LICENSE, REPO, with no field shown blank or as a dash? (`visual-language.md#technicalmetadata`,
    `usage.md#technicalmetadata`)
46. Is STACK comma-separated, LICENSE an SPDX identifier, and REPO a path with no scheme that resolves? Are LICENSE
    and REPO present on every row with a repository, and absent on a row without one?
    (`visual-language.md#technicalmetadata`, `usage.md#technicalmetadata`)
47. Is it free of a middle dot, "Apache 2" or "Open source" for the license, a full `https://` URL, badges,
    shields, icons, and a bordered table? (`usage.md#technicalmetadata`)

### TextLink
48. Does every CTA and action link end with a typed `->`, and do nav links, the wordmark, footer links, and inline
    prose links carry no arrow? (`visual-language.md#textlink`, `voice.md#cta-vocabulary`)
49. Is a primary link `accent` text, underline, and arrow, at most one per band; a secondary link `ink` with a 1px
    grey underline; an inline link underlined `ink`? (`visual-language.md#textlink`, `usage.md#textlink`)
50. Is no link styled as a button (fill, border, radius, or box padding)? (`usage.md#textlink`)

### Footer
51. Is it a rule, then "Valesor Development" in serif with "Released under Apache-2.0 by default." in `ink-muted`
    mono, and GitHub then Privacy as plain mono links with no underline at rest? Wide: is the name and line at left and the links at right?
    (`visual-language.md#footer`, `usage.md#footer`)
52. Is it free of a copyright symbol, year, "All rights reserved", social icons, newsletter field, sitemap,
    back-to-top, tinted band, arrows, and links to pages that don't exist? At mobile width, does it stack left
    aligned? (`usage.md#footer`)

### 404
53. Does the 404 have `BrandHeader`, the H1 "Not found.", the sentence from the voice doc, one secondary
    `TextLink` home, and `Footer`, with no joke, apology, or "Oops"? (`usage.md#404`,
    `voice.md#errors-empty-states-and-the-404`)

## `/privacy` template
For `/privacy` only. The text is Brian's (`CLAUDE.md` §7); these items check the frame, never the wording of a claim.

54. Is it `BrandHeader`, a `SectionRule`, the H1 "Privacy" in the display role, a one-line `ink-muted` mono
    subhead, titled sections (serif column-title role, mono body at most 72 characters), and `Footer`? Do the
    section titles have no rule of their own, with space alone, `space.l`, above each section title?
    (`visual-language.md#privacy-page-template`, `visual-language.md#sectionrule`, `usage.md#privacy-page`)
    `[DECIDED 2026-10-14]`
55. Is it free of a hero, illustration, cookie banner, consent dialog, "manage preferences" control, table,
    accordion, callout, icon, and checkmark list, with lists as plain bullets in body type?
    (`visual-language.md#privacy-page-template`, `usage.md#privacy-page`)
56. Are links in the text underlined `ink` with no arrow, and does the page end with a secondary `TextLink` home
    reading "Return to the home page ->"? (`visual-language.md#privacy-page-template`, `voice.md#cta-vocabulary`)
    `[DECIDED 2026-10-14]`
57. Does the first screen state what is and isn't measured, as the text provides, with the look adding no claim
    of its own? (`visual-language.md#privacy-page-template`, `usage.md#privacy-page`)
58. Is the Privacy link in the footer of every page? (`usage.md#footer`)

## Characters
59. **No non-keyboard characters:** is the copy free of em and en dashes, curly quotes and apostrophes, the
    ellipsis character, arrow glyphs (`→`), middle dots, and emoji? (`voice.md#characters`)
60. **Typed `->`:** is every arrow on the page the two typed characters `->`, never the glyph `→` or an icon?
    (`voice.md#characters`, `usage.md#textlink`, `usage.md#projectrow`)

## Copy
61. Does the copy describe what the software is and does, with no sales language, value proposition, benefit
    list, urgency, social proof, exclamation mark, reader-hook question, or second-person promise?
    (`voice.md#principle`, `voice.md#never`)
62. Is "I" used where a person is needed, and never "we", "our team", or "us"? (`voice.md#first-person-singular`)
63. Is the preferred vocabulary used (projects, users, source, repository, released, project site), never
    products, customers, platform, or launched as names for the work? The decided negative line "Not a company.
    No clients. No products." passes. (`voice.md#preferred-vocabulary`, `voice.md#the-imprints-own-sentences`)
64. Is every CTA from the CTA vocabulary or the same verb-then-object shape, never "Get started", "Learn more",
    "Contact us", or another avoided CTA? (`voice.md#cta-vocabulary`)
65. Are source, license, and repository visible wherever a project with a repository is named, and does a
    project with none state its status instead? (`foundation.md#character`, Open)
66. Are the homepage lines the decided ones: "The engineering imprint." and the subhead "Software, tools, and
    systems, developed in the open."? (`voice.md#the-imprints-own-sentences`)

## Not Valesor (one hit fails)
67. Is the page free of startup branding, SaaS marketing, cyberpunk UI, glossy product renders, corporate
    consulting language, conversion funnels, gradients, glassmorphism, excessive animation, and decorative Norse
    motifs? (`foundation.md#not-valesor`)
68. Is it free of cards, drop shadows, rounded corners, filled panels, background bands, grain, noise, and paper
    texture outside the engraving? (`foundation.md#not-valesor`)
69. Is it free of a newsletter signup, social feed, comments, engagement analytics, partner logos, testimonials,
    and platform badges? (`foundation.md#not-valesor`, `foundation.md#character`, `CLAUDE.md` §10)
70. Is nothing animated: no entrance animation, parallax, scroll effect, or autoplay, with state changes instant?
    (`visual-language.md#motion`)

## Tokens
71. **No off-token values:** do the components under `brands/valesordev/components/` (when it exists), the styles under
    `sites/valesordev.com/src/`, and the component specimens under `sites/valesordev.com/specimens/` (ADR 0001 §9)
    reference tokens only, with no literal colour (hex, `rgb()`, `hsl()`, named
    colour), font family name, or spacing value? Scan source, not the built bundle: the bundle carries the token
    package's own `--*` definitions and `@font-face` blocks, which are the tokens, not uses of them. The one
    allowed literal is a component's `@media (min-width: 48rem)`. Every other literal is a defect. (`usage.md#before-building-anything`,
    `tokens/README.md`, Custom properties, `CLAUDE.md` §5)
72. Is every token used one that `tokens/tokens.json` defines, with no new token introduced without a brand-doc
    reason? (`visual-language.md`, `tokens/README.md`)

## Accessibility (WCAG 2.1 AA)
73. Does every text and background pair on the page meet 4.5:1, including `ink-muted` at the label size and
    `accent`, and every non-text indicator (secondary underline, focus outline) meet 3:1? Check against the
    `contrast` entries in `tokens/tokens.json`. (`visual-language.md#color` Rules)
74. Is colour never the only signal: links underlined (except nav links, the wordmark, and footer links, which
    have no underline at rest, item 32), status in words, arrows with their row context? (`visual-language.md#color`
    Rules, `visual-language.md#brandheader`, `visual-language.md#footer`, WCAG 1.4.1) `[DECIDED 2026-10-14]`
75. Does every interactive element show a 2px `ink` outline with a 2px offset on keyboard focus, never removed?
    Does hover only thicken the underline to 2px (on a link with no rest underline, draw it at 2px), with no colour
    change and no change on visited?
    (`visual-language.md#interaction-states`)
76. Is every link and arrow target at least 24 by 24 CSS px, and is the whole `ProjectRow` its link area?
    (`visual-language.md#interaction-states`)
77. Are there real headings (one H1) and landmarks (`header`, `main`, `footer`), and lists marked up as lists?
    (`visual-language.md#hero`, `visual-language.md#projectrow`, WCAG 1.3.1)
78. Is `prefers-reduced-motion` respected (nothing animates either way)? (`visual-language.md#motion`)
79. Is the page fully readable and every link usable with JavaScript off, at both widths? (`CLAUDE.md` §5,
    `visual-language.md#privacy-page-template`)
80. At 320 CSS px, does the whole page reflow with no horizontal scroll and no content clipped or overflowing
    (WCAG 1.4.10), and does the H1 (display 4x) wrap on whole words? An H1 fail is a brand-doc change (a narrow
    display size), routed to visual-designer; any other overflow is routed to implementation. (`tokens/README.md`,
    Values the docs left to this story; `CLAUDE.md` §5)

## Self-check
`usage.md#self-check` asks the brief's questions before a PR. Each one maps to items above: editorial, not
commercial (1, 67); ink, paper, one accent (6 to 9); rules and type doing the layout (18 to 20); whitespace (21);
no gradient, shadow, or card (67, 68); copy says what the software is (61); Valesor an imprint (3); "I" for a
person (62); source and license visible (65).
