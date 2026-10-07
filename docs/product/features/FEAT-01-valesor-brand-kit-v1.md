# FEAT-01 — Valesor brand kit v1
Status: proposed
Release: R1 (must)

## Problem
Brian can't publish valesordev.com without redesigning it, because the brand kit starts from scratch
(`CLAUDE.md` §1): `brands/valesordev/` holds only a README. No brand doc, token, or art exists for a builder to
cite, and a visual story without a brand citation isn't `ready` (`CLAUDE.md` §5). No visitor sees this feature
directly; it enables FEAT-02 and sets the pattern R2 and R3 reuse.

## Outcome
Brian can hand any builder the Valesor kit and get a page that is recognizably Valesor without anyone choosing a
colour, font, or spacing value in code.

## Success signal
In the R1 demo, Brian opens the kit and finds: the brand docs, tokens built to `dist/tokens.css` by `make`, the
illustration system, the hero art with provenance, and `qa.md`. `/brand-qa` passes the homepage against `qa.md`
(visual-designer runs it; Brian approves the kit by merging its PRs).

## Scope
- In: the kit named in the Valesor Notion "Brand Kit Project Direction" first milestone: foundation, voice,
  visual language, tokens, illustration system, hero art and marks, and `qa.md`; the frozen target homepage and
  its approved visual audit as the specimen.
- Out: project detail page, README template, social card, documentation landing page (later reference
  implementations; the vision says project pages aren't planned yet).
- Out: anything carried over from `valesordev/brand-kit` or solo7-theme (the kits start from scratch).
- Out: how the kit looks. That is visual-designer's, approved by Brian.

## Dependencies
| Need | Owner | State |
|---|---|---|
| Brand docs, audit, tokens, art direction, `qa.md`, `brand.mk` | visual-designer | needs visual-designer stories; target brief is the Valesor Notion page below |
| Frozen `references/target-homepage.png` | visual-designer | `/brand-audit` freezes it from Notion |
| Audit classifications (core / candidate / hero-specific) | Brian | decided at the audit's PR review; no tokens until it merges |
| Typeface licences | visual-designer | needs visual-designer; the Notion brief says confirm before locking tokens |
| Generated hero art with provenance | visual-designer, Brian (ChatGPT project) | needs `/art-slot` |
| `make` build of tokens | sre | `brands/*/brand.mk` is included by the root `Makefile` |

## Decisions
- The homepage is the specimen, not a style guide on its own. Reason: the Notion brief calls the layout system and
  illustration language the brand; a quiet mark is fine.
- Only the homepage's needs are in R1. Reason: R1 proves the workflow, not the whole kit surface.

## Open for Brian
- None. The audit classifications are his, but they arrive in visual-designer's PR, not here.

## Sources
Notion › Valesor Development › "Brand Kit Project Direction"; `CLAUDE.md` §1, §3, §5; `docs/product/releases.md` R1.

## Log
- 2026-10-07: proposed
