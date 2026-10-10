#!/usr/bin/env bash
# Upload a preview version of one site's Worker and print its URL on stdout.
# usage: preview-site.sh <domain> <alias>
# Needs CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID in the environment.
set -euo pipefail

domain=${1:?usage: preview-site.sh <domain> <alias>}
alias=${2:?usage: preview-site.sh <domain> <alias>}
: "${CLOUDFLARE_API_TOKEN:?CLOUDFLARE_API_TOKEN is not set}"
: "${CLOUDFLARE_ACCOUNT_ID:?CLOUDFLARE_ACCOUNT_ID is not set}"

out=$(mktemp)
log=$(mktemp)
trap 'rm -f "$out" "$log"' EXIT

if ! WRANGLER_SEND_METRICS=false WRANGLER_OUTPUT_FILE_PATH="$out" \
  npx --yes wrangler@4.149.0 versions upload \
    --config "sites/$domain/wrangler.jsonc" \
    --preview-alias "$alias" >"$log" 2>&1; then
  cat "$log" >&2
  if grep -q "does not yet exist" "$log"; then
    echo "The Worker for $domain has never been deployed. A person must run the one-time bootstrap (make bootstrap-site-*) first." >&2
  fi
  exit 1
fi
cat "$log" >&2

node -e '
  const lines = require("fs").readFileSync(process.argv[1], "utf8").split("\n").filter(Boolean);
  const v = lines.map((l) => JSON.parse(l)).find((e) => e.type === "version-upload");
  const url = v && (v.preview_alias_url || v.preview_url);
  if (!url) { console.error("wrangler reported no preview URL"); process.exit(1); }
  console.log(url);
' "$out"
