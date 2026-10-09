# Automation contract (CLAUDE.md §9): every step is a target, `make check` is
# the PR gate. sre owns this file; R1 adds the brand builds, per-site builds,
# and Cloudflare deploys.

BRANDS := valesordev system9studios solo7productions solo7media bashburn

.PHONY: help check check-layout build-site-valesordev legacy-solo7-media

help: ## List targets
	@grep -hE '^[a-zA-Z0-9_%-]+:.*## ' $(MAKEFILE_LIST) | sort | \
	  awk 'BEGIN {FS = ":.*## "} {printf "  %-22s %s\n", $$1, $$2}'

check: check-layout ## PR gate: layout checks and site builds; lint and tests are added per site in R1
	@if [ -d sites/valesordev.com ]; then $(MAKE) build-site-valesordev; fi

check-layout: ## Every brand has its folder and README; package.json parses
	@for b in $(BRANDS); do test -f brands/$$b/README.md || { echo "missing brands/$$b/README.md"; exit 1; }; done
	@node -e 'JSON.parse(require("fs").readFileSync("package.json"))'
	@echo "layout ok"

build-site-valesordev: build-brand-valesordev ## Build sites/valesordev.com/dist/ (installs workspace packages first)
	npm ci
	ASTRO_TELEMETRY_DISABLED=1 DO_NOT_TRACK=1 npm run build --workspace sites/valesordev.com

legacy-solo7-media: ## Build the legacy solo7.media site (needs NODE_AUTH_TOKEN for GitHub Packages)
	cd sites/solo7.media && npm ci && npm run build

# Brand build rules (visual-designer's, one per brand).
-include brands/*/brand.mk
