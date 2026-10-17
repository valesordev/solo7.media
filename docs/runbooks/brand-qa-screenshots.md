# Brand QA screenshots (`qa-shots-<slug>`)

Renders pages and component specimens the way a visitor sees them, so `/brand-qa` judges the rendered page and
never the source (`CLAUDE.md` §8 item 3, `brands/valesordev/qa.md#how-to-run-it`). Decided in ADR 0001 §9;
built in S7M-INF-008. Only `valesordev` has a target so far.

## Once per machine

```sh
make install              # workspace packages, from the lockfile
make qa-browser-install   # after make install: downloads the Chromium that the pinned playwright (1.63.0) drives; the only step that needs network
```

The browser goes to the user cache (`~/.cache/ms-playwright/`), never into the repo. A Playwright version bump
(a PR that changes the pin) needs `make qa-browser-install` again. Without the browser, the target fails with
`Playwright's Chromium is not installed; run make qa-browser-install`.

## Run it

| What | Command |
|---|---|
| The default pages (`/` and the 404 page) | `make qa-shots-valesordev` |
| Chosen pages | `make qa-shots-valesordev QA_PAGES=/,/privacy/,404` |
| A component specimen | `make qa-shots-valesordev QA_PAGES= QA_SPECIMENS=SectionRule` |
| Pages and specimens together | `make qa-shots-valesordev QA_SPECIMENS=SectionRule,TextLink` |

- `QA_PAGES` (default `/,404`): comma-separated routes as a visitor types them (`/privacy/`). `404` requests
  `/404.html`, which Cloudflare redirects to `/404`. Set it empty to shoot only specimens.
- `QA_SPECIMENS` (default empty): comma-separated names. `<Name>` is
  `sites/valesordev.com/specimens/pages/<Name>.astro`, requested at `/<Name>/`. Specimens and
  `sites/valesordev.com/astro.specimens.config.mjs` are implementation's; each component story adds its own
  (ADR 0001 §9). When this is set and the config is missing, the target fails naming it. When it's empty, no
  specimen build runs.
- It builds the site first (`build-site-valesordev`). It runs offline and needs no secrets. It isn't part of
  `make check`.

Every requested page and specimen must answer 200 after redirects. Otherwise the run exits non-zero and names
each one that failed. A page whose own stylesheets, fonts or images answer 4xx or fail also fails. The run
still writes everything it could capture.

## What it does

1. It serves `sites/valesordev.com/dist/` (and `dist/qa/valesordev/specimens/` when asked) on `127.0.0.1`
   with `scripts/qa-serve.mjs`, which follows the Worker's rules: trailing-slash redirects, and the built
   `404.html` with status 404 for a missing route.
2. For each page or specimen, at each width `brands/valesordev/qa.md` names (1440 and 390 CSS px, plus the
   320 px reflow check), it opens a fresh browser profile with JavaScript off. It uses the light theme only,
   a viewport 900 px tall, and a device scale of 1.
3. It takes a full-page screenshot, then finds every link and button (`a[href]`, `button`, `summary`, form
   controls, `[role=button]`, `[role=link]`, `[tabindex]`) and captures each one's states:
   - **rest**: on a fresh load, with the mouse moved to a viewport corner the element doesn't cover, or
     outside the viewport. If the element still matches `:hover`, a warning says its image may show hover.
     The visited image is taken the same way.
   - **hover**: the mouse over the element.
   - **active**: the mouse button held down on the element. It's released at a viewport corner the element
     doesn't cover (outside the viewport when it covers all four), so nothing is followed. An element with
     something else over its centre isn't pressed: its active state is recorded as not captured. If a release
     outside the viewport still follows the link, the page is reloaded and a warning is recorded.
   - **focus-visible**: reached by pressing Tab from the top of a fresh load, never by programmatic focus. An
     element Tab never reaches is recorded as `not reached by Tab`.
   - **visited**: each link is followed by keyboard and the page is reloaded. Off-site links go to a local
     stub page, because nothing leaves the machine.
   Each image is the element's box plus 8 px, so a focus outline drawn outside the box is in frame.
4. It writes `report.json`.

Off-site requests from the page itself (fonts, scripts) are blocked and listed as warnings.

## Output

`dist/qa/valesordev/shots/` at the repo root. It's gitignored, it's emptied at the start of each run, and it's
never inside `sites/*/dist/` (which deploys) or `dist/qa/valesordev/specimens/` (which the specimen build
empties).

```
dist/qa/valesordev/shots/
  report.json
  <name>/<width>/page.png                  full page
  <name>/<width>/states/NN-<state>.png     NN = the element's index in the report, from 01
```

`<name>` is the route without its slashes (`/` is `index`, `/privacy/` is `privacy`), `404`, or
`specimen-<Name>`. The target prints every path when it finishes.

`report.json`, for each page or specimen at each width, gives:
- `final` (the URL after redirects), `redirects`, and `status`
- `horizontalScroll`, `scrollWidth`, `clientWidth`: whether the page scrolls sideways at that width (item 80)
- `warnings`: states not captured, Tab-focus without `:focus-visible`, blocked off-site requests
- `elements[]`: one entry per element:
  - `selector` (unique in the page), `text`, `href`
  - `width` and `height` in CSS px (the bounding box), `fragments` (one box per line when an inline link
    wraps), and `atLeast24x24`, which is true only when every fragment is at least 24 by 24 (item 76)
  - `tabOrder`
  - `states`: a path for each state, or the reason it wasn't captured

## How `/brand-qa` reads it

- Answer each `qa.md` item from the screenshots and the report, never from the source. Cite the image path or
  the element `selector` as the evidence.
- Item 75 (focus and hover): compare `NN-rest`, `NN-hover`, `NN-focus-visible` and `NN-visited` for the same
  element.
- Item 76 (24 by 24 targets): `atLeast24x24` and `fragments` per element. A target under 24 px is a fail
  unless an exception in the item applies. A link with more than one fragment has wrapped onto several lines;
  judge each line's box, not the union in `width` and `height`.
- Item 80 (320 px reflow): `horizontalScroll` at width 320, plus `<name>/320/page.png` for clipping and the H1
  wrap.
- Paste the report's per-element numbers into the PR, or attach the images, as the `/brand-qa` evidence for
  §8 item 3.

## Check the server by hand

`make qa-serve-valesordev [QA_PORT=4321]` builds the site and serves it in the foreground, the same way the
target does. `curl -i http://127.0.0.1:4321/does-not-exist/` answers 404 with the body of
`sites/valesordev.com/dist/404.html`. Stop it with Ctrl-C. `make test-scripts` (part of `make check`) tests the
routing rules.

## When it fails

| Message | Fix |
|---|---|
| `Playwright's Chromium is not installed` | `make qa-browser-install` |
| `<url> answered 404 (must be 200)` | The route doesn't exist in the build. Check the spelling and trailing slash, or the specimen name. |
| `the page did not render: 404 …/_astro/…` | A stylesheet or asset the page links is missing from the build. That's the site's bug (implementation). |
| `… would both write shots/<name>/` | Two requests map to one output name (`/a/b/` and `/a-b/`, or an entry listed twice). Request them in separate runs. |
| `astro.specimens.config.mjs does not exist` | No component story has added specimens yet. Specimens are implementation's (ADR 0001 §9). |
| `no result after 300s` | A browser call hung. Rerun it. If it repeats, open an issue for sre with the command. |
