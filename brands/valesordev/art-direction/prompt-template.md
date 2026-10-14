# Valesor Development: slot prompt template

The skeleton every Valesor candidate prompt fills (`/art-slot`). The style is in the ChatGPT project
instructions (`../references/chatgpt-project.md`, rendered from `illustration-system.md`); a prompt carries only
the slot and the candidate's variation. Write for the ink treatment: clean black line on plain white, no tone.

**Status:** AD v1, with `illustration-system.md` (approved 2026-10-12, PR #84).

## Block

````text
```text
<slot> · candidate <letter> · AD v<n>
Format: <composition type>, generate at 3:2 landscape; final crop <aspect from the slot spec>. Keep <empty zone from illustration-system.md#composition-types> as open white paper, nothing drawn in it. Terrain runs off both side edges; the bottom edge thins out into white, no border.
Subject: <concrete nouns first, then position and scale, near to far>
Variation: <the candidate's one-line thesis, in visual terms>
Keep: <file> — <features>
Not: <at most three slot-specific exclusions>
```
Save as: brands/valesordev/assets/candidates/<slot>-<letter>.png · Attach: <files or "none">
````

Omit `Keep:` when nothing is attached.

## Filling it
- **Composition type:** one from `illustration-system.md#composition-types`. In R1 that is `hero-wide` only.
- **Subject:** terrain from `illustration-system.md#subject-matter`. The juniper is named only in the hero slot's
  prompts. The moon is named only when the slot spec tests it as the candidate motif, and the prompt says where:
  "a large stippled moon, upper right, outside the empty zone".
- **Variation axes** that suit this system: where the subject mass sits along the width; how high it rises; how far
  the land falls away behind it; the density of hatch on the near forms. Never vary the style, the values, or the
  light: those are the system's.
- **Not:** slot-specific only. The project instructions already exclude text, colour, wash, people, and the
  rest of `illustration-system.md#exclusions`.

## Example (shape only, not a slot)

```text
hero · candidate A · AD v1
Format: hero-wide, generate at 3:2 landscape; final crop 3:1. Keep the upper-left 40% as open white paper, nothing drawn in it. Terrain runs off both side edges; the bottom edge thins out into white, no border.
Subject: a rocky crest rising from the bottom edge at center-left, low scrub along it; behind, a basin falling to layered ridges and a distant range at right.
Variation: the crest sits low and long, so the land behind reads wide and open.
Not: no trees on the far ridges; no path or trail.
```

The aspect, empty zone, and subject in the example are placeholders. The hero slot spec sets them.
