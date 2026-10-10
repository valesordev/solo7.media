# Valesor Development: tokens

`tokens.json` is the source. `make build-brand-valesordev` runs `build.mjs`, which writes `dist/tokens.css` and
copies the self-hosted fonts to `dist/assets/fonts/` (both untracked). A site imports
`@solo7/brand-valesordev/tokens.css` once; `tokens.css` refers to its fonts by relative URL, so they ship through
the `./assets/*` export. Roles and rules are in `../brand/visual-language.md`; this file records values and names.

Light theme only. There is no dark theme, no radius, no shadow, and no fill token, because the brand has none.

Status marks as in `../brand/foundation.md`. Everything below is `[PROPOSED]` until Brian approves the PR.

## Typefaces `[PROPOSED]`
Both OFL-1.1, Latin subset, regular weight only (the brand uses no other weight and no italic), as WOFF2 from
`@fontsource/*@5.3.0`. The licence text sits beside each font in `../assets/fonts/` and is copied into `dist/`.
OFL allows self-hosting and embedding; it requires the copyright notice and licence to travel with the files, which
the build does. Source Serif 4 carries Adobe's Reserved Font Name "Source": the files are used as published in
`@fontsource/source-serif-4@5.3.0` (a Latin subset of the upstream release) and are not renamed or edited, which the
licence allows; do not rename or edit them. The licence text is upstream's. Whether the licence text is published beside the fonts on the deployed site is the site story's call.

| Role | Recommended | Licence | Why | Rejected |
|---|---|---|---|---|
| Display serif | Source Serif 4 | OFL-1.1 | Transitional with sharp serifs, close to the target's Times-like serif; a quiet, durable colour at 4x | Newsreader (OFL-1.1): softer, old-style; Libre Caslon Text (OFL-1.1): only 400 and 700, display-heavy colour; Tinos (Apache-2.0): a Times clone, reads as a default |
| Monospace | Source Code Pro | OFL-1.1 | Humanist, dotted zero, as the audit describes the target's mono; drawn by the same foundry as Source Serif 4, so the pair shares proportions and stroke contrast | JetBrains Mono (OFL-1.1): tall x-height, reads as an IDE; Commit Mono (OFL-1.1): not fetched or compared; any IBM-sourced face (IBM Plex Mono and the rest): excluded by rule, see below |

**No IBM-sourced typefaces, in any role.** `[DECIDED 2026-10-10]` (Brian) A hard rule, though they are open source:
the audit's first mono candidate was dropped for it. The rule is in `../brand/visual-language.md#typography`.

To take a different pick: replace the font file and licence under `../assets/fonts/`, then change that family's
`family`, `fallback`, `files`, and `licenseFile` in `tokens.json`. Nothing else moves.

The 400 weight and `latin` subset cover every character the copy may use (`voice.md#characters` allows only
keyboard characters). Fallbacks are system fonts, so the page stays readable if a file fails.

## Custom properties
The names components cite. A component uses these and nothing else (`CLAUDE.md` §5).

| Group | Names | Notes |
|---|---|---|
| Color | `--color-paper` `--color-ink` `--color-ink-muted` `--color-rule` `--color-accent` | five roles; no `ink-faint`, no `rule-strong` |
| Aliases | `--link-underline-secondary` `--focus-ring` | the secondary `TextLink` underline is `ink-muted`; the focus outline is `ink` |
| Font | `--font-serif` `--font-mono` | stacks, with system fallbacks |
| Type | `--type-base`, and for each role `--type-<role>-family` `-size` `-line-height` `-tracking` (label also `-transform`) | roles: `wordmark` `display` `subhead` `section` `row-title` `column-title` `body` `label` `value` `nav` `link` |
| Space | `--space-3xs` `2xs` `xs` `s` `m` `l` `xl` `2xl` `3xl` | 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4.5, 6 rem |
| Layout | `--layout-max-width` `--layout-measure` `--layout-inset` `--layout-breakpoint-wide` | `--layout-inset` is 1.5rem, and 3.75rem at 48rem and up |
| Line | `--line-rule-width` `--line-underline-width` `--line-underline-width-hover` `--line-focus-width` `--line-focus-offset` `--line-target-min` | 1px, 1px, 2px, 2px, 2px, 1.5rem |

Type sizes are multiples of `--type-base` (0.9375rem, the target's body at about 15px): wordmark 1.6, display 4,
subhead 1.7, section 2.4, row title 1.7, column title 1.2, body 1, label 0.85, value 0.85, nav 1, link 1.
Case is copy, not CSS, except `label`, which is uppercase.

`--layout-breakpoint-wide` documents the 48rem breakpoint. A media query cannot read a custom property, so a
component's own `@media (min-width: 48rem)` repeats the number; it is the one literal allowed outside the tokens.

## Contrast
Checked by the build, which fails on a miss. WCAG 2.1 relative luminance, against `paper` `#FEFEFE`.

| Pair | Ratio | Needs | Use |
|---|---|---|---|
| `ink` `#111111` | 18.72:1 | 4.5:1 | display and body type |
| `ink-muted` `#545454` | 7.51:1 | 4.5:1 | descriptions, and metadata labels and values at the smallest size (0.85x) |
| `accent` `#C8202A` | 5.63:1 | 4.5:1 | primary `TextLink` text and arrow |
| `--link-underline-secondary` `#545454` | 7.51:1 | 3:1 | secondary link underline |
| `--focus-ring` `#111111` | 18.72:1 | 3:1 | focus outline |

`rule` `#D0D0D0` is about 1.5:1 against `paper`. It is a decorative hairline and carries no information on its own
(`visual-language.md#color`), so it has no contrast requirement; a link's underline is its own token.

## Values the docs left to this story `[PROPOSED]`
- `paper` `#FEFEFE`: the target's median. Not pure white, so the engraving's treatment maps its whites to this value.
- `rule` `#D0D0D0`: inside the audit's sampled `#CCCCCC` to `#D6D6D6`, neutral.
- Line height: 1.6 for body, 1.5 for every other role except `display` at 1.2. The rule is body at least 1.5
  (`visual-language.md#typography`); a 4x headline at 1.5 leaves gaps wider than its own cap height when it wraps.
- `value` size 0.85x, the low end of the audit's 0.85x to 1x range, so labels and values sit on one size.
- Tracking: `wordmark` and `display` -0.01em, `label` 0.08em, others 0.
- Display stays 4x below 48rem. The docs decide no separate narrow size; `/brand-qa` checks that the H1 wraps well at
  320px, and a narrow size becomes a brand-doc change if it does not.
