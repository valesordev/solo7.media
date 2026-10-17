# Automation contract (CLAUDE.md §9): every step is a target, `make check` is
# the PR gate. sre owns this file; R1 adds the brand builds, per-site builds,
# and Cloudflare deploys.

BRANDS := valesordev system9studios solo7productions solo7media bashburn

.PHONY: help check check-layout test-scripts install build-site-valesordev qa-browser-install qa-shots-valesordev qa-serve-valesordev bootstrap-site-valesordev preview-site-valesordev verify-preview-valesordev legacy-solo7-media update-agents

help: ## List targets
	@grep -hE '^[a-zA-Z0-9_%-]+:.*## ' $(MAKEFILE_LIST) | sort | \
	  awk 'BEGIN {FS = ":.*## "} {printf "  %-22s %s\n", $$1, $$2}'

# Brands with at least one component get their tests in `make check` (ADR 0001 §8). The predicate is the
# .astro files, not the vitest config, so a brand with components and no config or no tests fails the gate.
TEST_BRANDS := $(foreach b,$(BRANDS),$(if $(wildcard brands/$(b)/components/*.astro),$(b)))

check: check-layout test-scripts $(addprefix test-brand-,$(TEST_BRANDS)) $(if $(wildcard sites/valesordev.com),build-site-valesordev) ## PR gate: layout checks, script tests, brand component tests, site builds

check-layout: ## Every brand has its folder and README; package.json parses
	@for b in $(BRANDS); do test -f brands/$$b/README.md || { echo "missing brands/$$b/README.md"; exit 1; }; done
	@node -e 'JSON.parse(require("fs").readFileSync("package.json"))'
	@echo "layout ok"

test-scripts: ## Run the tests for scripts/ (node:test, offline)
	node --test --test-timeout=60000 'scripts/*.test.mjs'

install: ## Install workspace packages from the lockfile (npm ci)
	npm ci

# One rule for every brand; `make check` runs only the brands in TEST_BRANDS. passWithNoTests is never set.
TEST_BRAND_TARGETS := $(addprefix test-brand-,$(BRANDS))
.PHONY: $(TEST_BRAND_TARGETS)
$(TEST_BRAND_TARGETS): test-brand-%: install
	npx --no-install vitest run --root brands/$*/components

# Components import the brand's generated outputs (tokens.css, dist/assets), so tests run on a fresh build.
test-brand-valesordev: build-brand-valesordev ## Run the Valesor component tests (vitest, offline, no secrets)

build-site-valesordev: build-brand-valesordev install ## Build sites/valesordev.com/dist/ (installs workspace packages first)
	ASTRO_TELEMETRY_DISABLED=1 DO_NOT_TRACK=1 npm run build --workspace sites/valesordev.com

# Preview deploy (ADR-0001 §4). PREVIEW_ALIAS names the preview (CI passes pr-<number>).
# Needs CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID in the environment.
PREVIEW_ALIAS ?= manual
# Text the preview must contain; change it when the stub is replaced by the real homepage.
PREVIEW_MARKER ?= This site is being rebuilt.

# One-time, by a person: `versions upload` cannot create a Worker. This deploys the assets-only
# Worker (workers_dev off, so nothing becomes public) and is Cloudflare account state, so it is
# never run from CI.
bootstrap-site-valesordev: build-site-valesordev ## ONE-TIME, manual: create the valesordev-com Worker so previews can upload
	WRANGLER_SEND_METRICS=false npx --yes wrangler@4.149.0 deploy --config sites/valesordev.com/wrangler.jsonc

preview-site-valesordev: build-site-valesordev ## Build, upload a preview version, print its URL (PREVIEW_ALIAS=pr-N)
	@scripts/preview-site.sh valesordev.com $(PREVIEW_ALIAS)

verify-preview-valesordev: ## Fetch PREVIEW_URL and fail unless it serves the stub page
	@scripts/verify-preview.sh "$(PREVIEW_URL)" "$(PREVIEW_MARKER)"

# Rendered screenshots for /brand-qa (ADR 0001 §9; runbook docs/runbooks/brand-qa-screenshots.md). Not in `make check`.
# Pages by route (404 means /404.html); specimens by name, built from sites/<domain>/specimens/pages/<Name>.astro.
QA_PAGES ?= /,404
QA_SPECIMENS ?=
QA_PORT ?= 4321
# Widths come from the brand's qa.md "How to run it": brands/valesordev/qa.md#how-to-run-it (desktop, mobile, 320 reflow).
QA_WIDTHS_valesordev := 1440,390,320

# After `make install`; not a prerequisite, because npm ci would wipe and reinstall node_modules each time.
qa-browser-install: ## ONE-TIME (after make install), needs network: download the Chromium the pinned Playwright drives
	npx --no-install playwright install chromium

qa-shots-valesordev: build-site-valesordev ## Screenshots, states and size report for /brand-qa (QA_PAGES=/,404 QA_SPECIMENS=Name,…)
	node scripts/qa-shots.mjs --slug valesordev --site sites/valesordev.com --widths '$(QA_WIDTHS_valesordev)' \
	  --pages '$(QA_PAGES)' --specimens '$(QA_SPECIMENS)'

qa-serve-valesordev: build-site-valesordev ## Serve sites/valesordev.com/dist/ on QA_PORT the way Cloudflare does (404-page)
	node scripts/qa-serve.mjs sites/valesordev.com/dist $(QA_PORT)

legacy-solo7-media: ## Build the legacy solo7.media site (needs NODE_AUTH_TOKEN for GitHub Packages)
	cd sites/solo7.media && npm ci && npm run build

# Brand build rules (visual-designer's, one per brand).
-include brands/*/brand.mk

update-agents: ## Update the vendored agents from a signed tag: make update-agents REF=<tag> [PR=0]
	@.claude/bin/update-agents "$(REF)" $(if $(filter 0,$(PR)),--no-pr)
