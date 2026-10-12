# Valesor Development: negative examples

What drifted from `illustration-system.md`, why, and the rule that catches it. Each entry cites the image it came
from. Rejected candidates are not committed (`assets/candidates/` is gitignored), so an entry describes the image
and names its slot and candidate letter; a committed source is linked.

**Status:** draft, with `illustration-system.md`. No Valesor image has been generated yet, so the only evidence is
the frozen target. The second list is the drift to look for first, from the rules most likely to break; each item
moves to the first list, with its image, when a candidate shows it.

## Observed

| Image | Drift | Why it fails | Rule | Caught by |
|---|---|---|---|---|
| `../references/target-homepage.png` (paper) | faint, even grain and speckle across the white ground, `#FCFCFC` to `#FFFFFF` | generator noise reads as paper texture, which the page refuses | `illustration-system.md#value-and-colour`, `illustration-system.md#exclusions` (no paper texture) | treatment step 1 (despeckle), then threshold |
| `../references/target-homepage.png` (far ranges) | the finest hatching on the distant mountains renders as soft grey | grey is a wash by another name | `illustration-system.md#rendering` | treatment threshold; review at display size |

## Expected drift (no image yet)

| Drift | Why it fails | Rule |
|---|---|---|
| Grey wash or soft shading under the hatching | values must come from line density only | `illustration-system.md#rendering`, `illustration-system.md#value-and-colour` |
| Sepia, cream, or aged-paper tint; a coloured moon | two values only; the paper is the page's | `illustration-system.md#value-and-colour` |
| Drawing or stipple drifting into the empty zone (a branch, birds, clouds) | type sits there | `illustration-system.md#composition` |
| A ruled border, vignette box, or straight cut at the bottom | the bottom edge thins out; nothing is boxed | `illustration-system.md#composition` |
| Lettering: a signature, a title cartouche, map labels, a scale bar | no text in art | `illustration-system.md#composition`, `illustration-system.md#exclusions` |
| Night sky, black fill behind the moon, glow or rays | the sky is open paper | `illustration-system.md#light` |
| The juniper appearing in a non-hero slot, or the moon in a slot whose spec doesn't test it | the juniper is the hero's; the moon is a candidate motif | `illustration-system.md#subject-matter` |
| Knotwork, runes, or carved-wood ornament in the rock or tree | decorative Norse motifs | `illustration-system.md#exclusions` |
| A glossy, painted, or 3D-rendered look | not an engraving | `illustration-system.md#rendering`, `illustration-system.md#exclusions` |
