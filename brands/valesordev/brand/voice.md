# Valesor Development: voice

How Valesor words are written. Identity and "not Valesor" are in `foundation.md`. Everything here applies to
every Valesor surface: the site, READMEs, project pages, alt text, and metadata.

Status marks as in `foundation.md`.

## Principle
Describe what the software is and does, plainly, the way a field manual would. Don't sell it.
`[DECIDED 2026-10-08]` (brief; brand QA: "describe what the software is rather than sell its benefits")

## First person singular
When a person is needed, it is "I". Never "we", "our team", or "us". There is no team to speak for.
`[DECIDED 2026-10-08]` (brief: "preserve the existing voice rules")

| Write | Not |
|---|---|
| I built this to run offline. | We built this to run offline. |
| <Project> stores notes as plain files. | Our platform stores your notes. |
| I release it under <license>. | We're proud to open-source it. |

Prefer the project as subject ("<Project> does X") over "I" when the sentence is about the software.
Use "I" only when a decision, a reason, or an opinion needs an owner. `[DECIDED 2026-10-08]`

Valesor Development is always an imprint, never "a company", "a studio", "a team", "a firm", or "a brand".
It may say what it is not: "Not a company. No clients. No products." `[DECIDED 2026-10-08]`

## Never
`[DECIDED 2026-10-08]` (brief: "No clients. No products. No sales language. No value propositions.")

- No clients, customers, or services.
- No sales language: no "powerful", "seamless", "robust", "best-in-class", "revolutionary", "solution",
  "leverage", "empower", "unlock", "supercharge".
- No value propositions or benefit lists.
- No urgency, scarcity, or social proof.
- No exclamation marks.
- No questions to the reader as a hook. (A heading may be a plain question where the answer follows, as in
  "What is Valesor Development?".)
- No second-person promises ("you will love", "you'll be up and running in minutes").

## Preferred vocabulary
`[DECIDED 2026-10-08]` (brief)

| Use | Not |
|---|---|
| projects | products |
| users, contributors | customers |
| source, repository | platform |
| released | launched |
| project site | product site |

Also: "license" (US spelling, as in the target), "open source" as an adjective phrase, "imprint".
`[DECIDED 2026-10-08]` (the brief's list doesn't cover these; spelling follows the target)

## Characters
Copy uses only characters typed on a standard keyboard. `[DECIDED 2026-10-08]` (audit Decisions, item 5)

- No em dash or en dash. Use a period, a comma, or a colon; rewrite if the sentence needs a dash.
- Straight quotes and apostrophes only: `Andara's World`, not `Andara’s World`.
- No ellipsis character; write the sentence so it doesn't trail off.
- No arrow glyph. The arrow is typed `->` (see below).
- No middle dot as a separator. Lists in running text and in `TechnicalMetadata` use commas.
- No emoji.

The target image breaks these rules (its subhead has a spaced em dash, its arrows are `→`, its stack lists use a
middle dot). The image is evidence, not a spec; this section governs.

## Case and punctuation
`[DECIDED 2026-10-08]` (derived from the target's copy)

- Sentence case for headings, subheads, and links: "The engineering imprint.", "Read the license ->".
- Title case for names only: Valesor Development, Andara's World.
- The H1 and subhead end with a period when they are statements. Navigation labels and metadata labels carry
  none.
- Metadata labels (`STACK`, `LICENSE`, `REPO`) are uppercase, set by style, written in sentence case in the
  source.

## CTA vocabulary
A call to action says what happens and where it goes. It ends with a typed `->`. The arrow appears on CTAs and
action links only, not on navigation. `[DECIDED 2026-10-08]` (audit Decisions, item 6; brief)

Prefer:

- `View source ->`
- `Browse the source ->`
- `Read the documentation ->`
- `Read the license ->`
- `Open the repository ->`
- `See how it works ->`
- `View all projects ->`

All of these are in the target or the brief. Others follow the same shape: a verb that is
literally what the link does, then the object. New CTAs not on this list are proposed to visual-designer on the
story.

Avoid: `Get started`, `Learn more`, `Start building`, `Contact us`, `Sign up`, `Subscribe`, `Download now`,
`Try it`, and any CTA that doesn't say its object. `[DECIDED 2026-10-08]` (brief)

The brief writes `View source →` and the rest with the `→` glyph. The kit uses `->` (audit item 6).

## Describing a project
Each project is described by what it is made of and what it does. `[DECIDED 2026-10-08]` (derived from the brief and the
`ProjectRow` decision)

- **Name:** the project's own name, exactly as the repository spells it.
- **Tagline:** one short sentence of what it is, no verbs of marketing ("A personal knowledge system, built for
  movement.").
- **Description:** one or two sentences of what it does, in plain nouns.
- **Metadata:** status, stack, license, and repository. Status, license (`spdx`), and repository (`url`) come
  from the project list (ADR 0001 section 6), which is checked against the repository before a PR. Nothing in them
  is invented. A repository URL that doesn't resolve is a defect, not a placeholder. A project with no repository
  has no license or repository line. `[PROPOSED]`
- **Gap:** the project list has no tagline or stack field, so until it does, a row shows neither. Whether to add
  them is a schema question for architecture (#39 amendment), raised on the story. `[PROPOSED]`

### Status words
`[PROPOSED]` Exactly two, in sentence case, as the STATUS value: "In progress" and "Concept". The data values
`in-progress` and `concept` (ADR 0001 §6) are never displayed. No other word stands in for them ("Alpha", "Beta",
"Coming soon", "Soon", "Early access", "WIP"), and nothing on a row says or implies a release, a launch date, or
availability: describe, don't sell. A third status needs Brian and an amendment here.

### The three launch rows
`[PROPOSED]` Draft descriptions, each limited to what a source states. Brian replaces them with the project's own
README text where it exists. The voice rules here are mine; the facts are his. Names are the repository's spelling.

| Name | Status | Description | Source of the facts |
|---|---|---|---|
| Andara's World | In progress | Tools, generators, and systems for building and exploring a coherent fictional world. | Mockup copy from the target image's row (`references/target-homepage.png`), not a verified fact. Brian confirms it or replaces it with the repository's README text |
| Vagabond | In progress | An app for trips and maps. | Inferred from Notion planning notes (trip and map work; "the Vagabond app is a Valesor Development project"). Not a stated description. Brian confirms or replaces it |
| System 9 Studios Pipeline | Concept | Software in development here for System 9 Studios to use. It has no repository yet. | FEAT-02 decisions, 2026-10-09 |

- The Pipeline is listed under Valesor because Brian develops it here for the studio. Its row says so in one
  plain sentence and doesn't describe the studio's work.
- Never "launching", "coming", "soon", "powerful", "seamless", or a feature list.

Never write a feature list, a benefit, or a comparison with a named product.

## The imprint's own sentences
Reference lines. The first two are decided in the audit (copy rows; the characters rule above applies):

- "The engineering imprint."
- "Not a company. No clients. No products. Just work in the open."

- "Released under Apache-2.0 by default." `[DECIDED 2026-10-08]` Apache-2.0 is the imprint's stated default
  license; a project that differs says so on its own row.

The subhead and the "What belongs here?" column of the target lose their dashes under the characters rule.
`[DECIDED 2026-10-08]` The rewritten sentences:

- Subhead: `[PROPOSED]` "Software, tools, and systems, in development." Was "Software, tools, and systems,
  released in the open." (`[DECIDED 2026-10-08]`), which says released work exists while nothing is released.
  Revert to the original in the amendment that adds the first "released" row. The imprint's definition
  ("publicly released software") is unchanged.
- What belongs here?: "If the primary artifact is software (code, tools, systems, or infrastructure), it belongs
  in Valesor. Everything else lives elsewhere."

## Errors, empty states, and the 404
Say what happened and what is available, in one or two plain sentences, then give one link. `[DECIDED 2026-10-08]`

> That page doesn't exist. The projects are listed on the home page. Return to the home page ->

No jokes, no apology, no "Oops".

## Credit and legal lines
The `/privacy` text changes only with Brian (`CLAUDE.md` §7). This file governs its tone when Brian or a role
drafts it for him: plain, specific, first person singular ("I measure page performance and errors. I don't
identify visitors."). The credit line in `CLAUDE.md` §1 belongs to the Soft Disclosure title, not to Valesor's
site.
