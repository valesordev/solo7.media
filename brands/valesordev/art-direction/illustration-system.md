# Valesor Development: illustration system

**Status:** draft. Becomes AD v1 when Brian approves it (S7M-VAL-007 PR review).
**Direction:** an engineering monograph, survey drawing, or field manual, not a software company's homepage
(`../brand/foundation.md#the-model-a-monograph-not-a-homepage`).
**Basis:** `../references/visual-audit.md` @ 8c9f3cf (illustration language and composition rows, all decided
2026-10-08); `../brand/visual-language.md#illustration`; `../brand/foundation.md#what-the-brand-is-made-of` item 5.
**ChatGPT project:** Valesor Development — Art (instructions: `../references/chatgpt-project.md`)

Status marks as in `../brand/foundation.md`: `[DECIDED <date>]` is Brian's and cites where he decided it;
`[PROPOSED]` is visual-designer's recommendation, awaiting Brian at PR review. Each `[PROPOSED]` item names one
rejected alternative.

These rules hold for every Valesor image. What belongs to one image (this tree, this moon, this ridge line) goes in
that slot's prompt (`/art-slot`), never here.

## Subject matter
- **The ground:** high-desert terrain seen as a surveyor would draw it: rock outcrops and crests, low ridges, sparse
  scrub, a basin falling away, distant ranges. `[DECIDED 2026-10-08]` (`visual-language.md#illustration`: rock,
  low ridge, sparse scrub)
- **Wind-shaped juniper:** the hero slot's subject only. It is not a recurring motif, and no other composition
  uses it. `[DECIDED 2026-10-08]` (audit Decisions item 11: "the juniper subject belongs to the hero slot only")
- **Large moon:** a candidate motif only, not a mark. A slot uses it only when its spec says so and names it as a
  test of the motif. It becomes part of this system (or a mark) only by a revision Brian approves after a second
  composition has used it. `[DECIDED 2026-10-08]` (audit Decisions item 11)
- **Never:** people or figures, animals, buildings, roads, vehicles, machines, screens, circuitry, or any literal
  picture of software. The land is the subject; the software is in the type beside it. `[PROPOSED]` Reason: the
  brief's "Not Valesor" list rules out cyberpunk and glossy product renders, and a monograph plate shows terrain,
  not a product. Rejected: a small human figure for scale (it makes the plate a story, and figures drift most in
  generation).

## Rendering
Pen-and-ink survey or engraving line: heavy contours, fine hatching and cross-hatching for form, stipple for
texture and distance. `[DECIDED 2026-10-08]` (audit: Illustration language; `visual-language.md#illustration`)

- Every value is made by line density, never by tone. No grey wash, no airbrush, no blended shading.
  `[DECIDED 2026-10-08]`
- Detail is concentrated in the subject mass and thins toward its edges, so the plate dissolves into the paper
  rather than stopping at a frame. `[PROPOSED]` Reason: the target's ragged bottom edge and open sky
  (audit: Composition, core). Rejected: a ruled plate border (a box, which `visual-language.md#layout` forbids).

Generator reliability: a ChatGPT image model holds the engraving look well across a series but softens the finest
hatching into grey. Treatment thresholds that grey back to ink or paper (below), and candidates are judged treated
at display size (`/art-slot`), so a hatch that only survives as grey fails review. `[PROPOSED]` Rejected: a flat
black silhouette style, which repeats more reliably but drops the engraving, the brand's decided texture.

## Value and colour
- **Two values: ink and paper.** Pure black `#000000` ink on white, nothing between. `[DECIDED 2026-10-08]`
  (audit: ink (illustration), core; foundation "Differences from the Notion brief": `#000000` only inside the
  engraving)
- `#000000` is the only colour value in the kit that isn't a UI token. It lives in the treated asset, never in a
  component, and is not used for type (`color.ink`, `#111111`, is). `[DECIDED 2026-10-08]` (audit Decisions
  item 7)
- **Paper is the page, not the image.** The treated asset is ink on transparency, so the page's `color.paper`
  shows through and the engraving's whites match it exactly. `[PROPOSED]` Reason: `visual-language.md#color`
  requires the engraving's whites to match `paper`; a baked white would sit as a slightly brighter block on
  `#FEFEFE`. Rejected: an opaque white ground matched to `color.paper` (it breaks whenever the token moves).
- No gradient, no colour, no accent. Vermilion (`color.accent`) never appears in art. `[DECIDED 2026-10-08]`
  (`visual-language.md#color`: no gradients; accent is action and direction only)
- **Themes:** light only. There is no dark theme, so there is no inverted engraving. `[DECIDED 2026-10-08]`
  (`visual-language.md#color`)

## Line
- Three weights, in order: heavy contour on near forms and the silhouette against the sky; medium line for
  secondary forms; fine hatch and stipple for shade, texture, and distance. `[DECIDED 2026-10-08]` for heavy
  contour with fine hatch and stipple (audit: Line weights); `[PROPOSED]` for the three-step order.
- Distance is drawn with lighter, sparser line and more stipple, not with grey. `[PROPOSED]` Reason: grey is
  ruled out, and the target's far ranges already do this. Rejected: atmospheric grey (a wash).
- At display size the finest surviving line is at least one device pixel after treatment; anything finer is
  removed, not greyed. `[PROPOSED]`
- The art's line is heavier and busier than the UI's 1px hairlines on purpose: hairline UI against engraved art is
  the look. `[DECIDED 2026-10-08]` (`visual-language.md#principles` 5)

## Light
- Flat, even daylight. Form comes from hatch density, not from cast shadow or contrast. `[DECIDED 2026-10-08]`
  for flat light (audit: Illustration language)
- Implied from the upper left, so shaded sides fall right and away from the type zone. `[PROPOSED]` Reason: keeps
  the heaviest hatching off the empty zone's edge where the type sits. Rejected: overhead light (forms lose their
  side planes and read flat).
- The sky is open paper: no night sky, no black ground, no glow, no rays, even where a moon appears.
  `[PROPOSED]` Reason: a filled sky would put tone where type must sit. Rejected: a night scene for the moon.

## Composition
Rules for every composition type:

- **Empty zone:** each type states one zone left as open paper for type. Nothing engraved enters it: no branch,
  no bird, no stipple drift. Type is never set on the engraved area. `[DECIDED 2026-10-08]`
  (`visual-language.md#illustration`, `visual-language.md#hero`)
- **No text in art:** no lettering, numbers, labels, signatures, map annotation, or scale bars. Type is set from
  the kit's fonts, never generated. `[DECIDED 2026-10-08]` (`visual-language.md#illustration`;
  `.claude/roles/visual-designer.md`)
- **Edges:** the terrain runs off both side edges (full-bleed). The bottom edge is ragged, the drawing thinning
  out into paper, never a straight cut or a frame. `[DECIDED 2026-10-08]` (audit: Composition, core)
- **Horizon and scale:** a low eye level; one near subject mass rising from the bottom edge, with land falling
  away behind it to distant ranges. `[PROPOSED]` Reason: the target's structure, and it keeps the upper part of
  the frame empty for type. Rejected: an aerial or map view (it fills the whole frame).
- **Crop survival:** the subject mass reads whole when the slot's narrow-layout crop removes up to a third of the
  width (`visual-language.md#narrow-layout-mobile` puts the art in a band under the type). The slot spec sets the
  crop. `[PROPOSED]`

## Composition types
Only what the R1 homepage needs. `[DECIDED 2026-10-08]` for one hero composition (S7M-VAL-007 acceptance
criterion 4; `foundation.md#scope-of-the-kit`).

| Type | Aspect | Empty zone | Used for |
|---|---|---|---|
| `hero-wide` | wide landscape; the slot spec fixes the crop between 2.4:1 (brief) and about 3.7:1 (target as cropped) | upper left: about the left 40% of the width, above the subject mass, open paper | the homepage `Hero`, full-bleed under the type block |

- `hero-wide`'s aspect is resolved in the hero slot spec, not here. `[DECIDED 2026-10-08]` (audit Decisions
  item 9; `visual-language.md#illustration`)
- The empty zone's extent: `[PROPOSED]`, from the target, where the type block ends at about x 602 of 1586 (38%)
  and the subject mass starts beside it (audit: Composition). Rejected: the left third (the subhead would run
  into the crown).
- The generator makes a 3:2 landscape at most, so candidates are generated at 3:2 with extra empty sky and ground,
  and the slot's treatment crops to the spec's aspect. `[PROPOSED]`

A slot names exactly one type. A new type (a social card, a README banner, a project plate) is a revision of
this file, made when a story needs it.

## Treatment
Every image goes through the ink treatment before review and before it ships: `[PROPOSED]` for the steps; the
script is its own story (`brands/_tools/treat/`, out of scope here).

1. Greyscale, then remove generator grain and paper speckle (isolated specks below the finest line weight).
2. Threshold to two values: ink `#000000` at full opacity, everything else transparent. No dither: a grey that
   isn't line is noise, and it goes.
3. Crop to the slot spec's aspect, keeping the empty zone's position.
4. Output PNG with alpha at twice the widest display width; the build makes the smaller sizes.

Parameters (threshold level, speck size) are set in each slot's build rule, not here.

## Exclusions
Always: no text, lettering, numbers, logos, watermarks, signatures, or UI; no named artists, studios, or
franchises; no real people or real organisations' marks. `[DECIDED 2026-10-08]` (role rules)

Valesor-specific: `[DECIDED 2026-10-08]` (`foundation.md#not-valesor`) unless marked
- no gradient, glow, colour, or grey wash
- no glossy or 3D-rendered look, no photographic texture
- no cyberpunk or technology imagery
- no decorative Norse motifs: knotwork, runes, longships, dragon heads
- no paper texture, grain, or aged-paper tint (the page has none; `foundation.md#not-valesor`)
- no Andara's World imagery: Valesor makes tools for that world; its look is System 9's (`foundation.md#brand-family-boundary`). `[PROPOSED]`

Sibling imprints: none has an illustration system yet. Each sibling's first `/art-direction` checks itself against
this file; the engraving language stays Valesor's alone (`foundation.md#brand-family-boundary`).

## Changelog
- draft 2026-10-12: first draft, from the audit's decided illustration rows and `visual-language.md#illustration`
  (S7M-VAL-007). No images generated yet; evidence is the frozen target.
