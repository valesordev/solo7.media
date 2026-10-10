# SPRINT-01 demo — Preview pipeline and the Valesor audit

Demo goal (sprint issue #15): Brian opens a Cloudflare preview URL for a PR to the stub `sites/valesordev.com`,
built and deployed through `make` targets only, and opens the approved Valesor visual audit and brand docs on
`main`. Proves M1 (kit decided) in part and M2 (preview pipeline).

Run on 2026-10-10 against `origin/main` at `ec1d013`, in a clean `git worktree`.

## Preconditions

- A clone of the repo at `origin/main`, Node and npm installed.
- Steps 3 and 4 need nothing from Cloudflare. Step 5 does not need a token either.
- Producing a new preview (`make preview-site-valesordev`) needs `CLOUDFLARE_API_TOKEN` and
  `CLOUDFLARE_ACCOUNT_ID` in the environment. They are set as repo secret and variable, so a PR gets one from the
  workflow; this demo uses the one from PR #56 rather than a new upload.

## Steps

| # | Step | Expected | Result |
|---|---|---|---|
| 1 | Open `brands/valesordev/references/visual-audit.md` | Core rows are `[DECIDED <date>]`; the only `[PROPOSED]` text is in explanations, not on any row | Pass: `[PROPOSED]` appears only in prose (lines 4, 7, 134 to 137) |
| 2 | Open `brands/valesordev/brand/` (`foundation.md`, `voice.md`, `visual-language.md`, `usage.md`) | Four brand docs, with no `[PROPOSED]` item | Pass: zero `[PROPOSED]` in `visual-language.md`, `usage.md`, `voice.md`; `foundation.md` mentions it only to explain the marks |
| 3 | `make check` | Exit 0; builds `sites/valesordev.com/dist/` (2 pages) | Pass, exit 0: `/index.html` and `/404.html` built |
| 4 | `make build-brand-valesordev` | Exit 0 | Pass, exit 0 |
| 5 | Open the preview URL on PR #56: https://pr-56-valesordev-com.ashburn-brian.workers.dev | The stub page: "Valesor Development", "This site is being rebuilt." | Pass: HTTP 200 with that text; `/nope` returns 404 |
| 6 | `make verify-preview-valesordev PREVIEW_URL=https://pr-56-valesordev-com.ashburn-brian.workers.dev` | Exit 0 | Pass: `verified … (200, found "This site is being rebuilt.")` |
| 7 | Open PR #56's conversation | One sticky comment from the `preview-valesordev` workflow carrying the URL | Pass: the URL in step 5 is the workflow's (SRE's §8 instrumentation record on S7M-INF-001) |

## §9 defects

None. Every step is a `make` target, a URL, or a page to open.

## Limits

- The demo did not create a new preview. It used PR #56's, and `make verify-preview-valesordev` against it. The
  workflow's run on `454d019` is recorded in S7M-INF-001's SRE and architecture §8 comments.
- `valesordev.com` itself is still the old site on GitHub Pages; production cutover is M5.
- No workflow runs `make check` on PRs yet; step 3 holds locally only (S7M-INF-006).
