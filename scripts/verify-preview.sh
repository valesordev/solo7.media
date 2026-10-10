#!/usr/bin/env bash
# Fail unless the URL answers 200 and its body contains the marker text.
# usage: verify-preview.sh <url> <marker>
set -euo pipefail

url=${1:?usage: verify-preview.sh <url> <marker>}
marker=${2:?usage: verify-preview.sh <url> <marker>}

# A fresh version can take a few seconds to propagate.
for attempt in 1 2 3 4 5 6; do
  body=$(mktemp)
  code=$(curl -sS -o "$body" -w '%{http_code}' --max-time 20 "$url" || echo 000)
  if [ "$code" = 200 ] && grep -qF -- "$marker" "$body"; then
    rm -f "$body"
    echo "verified $url (200, found \"$marker\")"
    exit 0
  fi
  rm -f "$body"
  echo "attempt $attempt: $url -> $code, marker not confirmed" >&2
  sleep 5
done
echo "preview verification failed for $url" >&2
exit 1
