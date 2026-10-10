# Valesor Development brand rules (visual-designer's). Included by the root Makefile.
# Treated assets are added by their own stories.

.PHONY: build-brand-valesordev

build-brand-valesordev: ## Build the Valesor brand kit into brands/valesordev/dist/ (tokens.css, fonts)
	@mkdir -p brands/valesordev/dist
	@node brands/valesordev/tokens/build.mjs
