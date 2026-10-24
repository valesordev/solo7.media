#!/usr/bin/env bash
# approve-deploy.sh <pr-number> [comment]
# Approves the PR's pending deployment to the `preview` environment only, matched by name.
# Any other environment (a future gated production one) is named and left for the GitHub UI.
set -euo pipefail

PR="${1:-}"
[[ "$PR" =~ ^[0-9]+$ ]] || { echo "usage: approve-deploy.sh <pr-number> [comment]" >&2; exit 1; }
COMMENT="${2:-Approved via gh}"
ENVIRONMENT=preview
command -v jq >/dev/null || { echo "approve-deploy.sh needs jq on PATH" >&2; exit 1; }
REPO="$(gh repo view --json nameWithOwner -q .nameWithOwner)"

HEAD="$(gh pr view "$PR" --json headRefOid,title -q '.headRefOid + " " + .title')"
SHA="${HEAD%% *}"

RUN="$(gh run list --commit "$SHA" --status waiting \
        --json databaseId -q '.[0].databaseId')"
[[ -n "$RUN" ]] || { echo "no waiting run for PR #$PR ($SHA)" >&2; exit 1; }

PENDING="$(gh api "repos/$REPO/actions/runs/$RUN/pending_deployments")"

jq -r --arg env "$ENVIRONMENT" \
   '.[] | select(.environment.name != $env) | "left for the GitHub UI: \(.environment.name) (run '"$RUN"')"' \
   <<<"$PENDING" >&2

ENV_IDS="$(jq -c --arg env "$ENVIRONMENT" \
            '[.[] | select(.environment.name == $env and .current_user_can_approve) | .environment.id]' \
            <<<"$PENDING")"
[[ "$ENV_IDS" != "[]" ]] || { echo "no pending $ENVIRONMENT deployment you can approve on run $RUN" >&2; exit 1; }

echo "approving $ENVIRONMENT for PR #$PR at $HEAD (run $RUN)"
jq -n --argjson ids "$ENV_IDS" --arg c "$COMMENT" \
   '{environment_ids: $ids, state: "approved", comment: $c}' |
gh api -X POST "repos/$REPO/actions/runs/$RUN/pending_deployments" --input - \
   --jq '.[] | "\(.environment) → \(.statuses_url)"'
