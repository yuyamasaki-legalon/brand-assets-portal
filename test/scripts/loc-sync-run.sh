#!/usr/bin/env bash
# LOC Sync Run — One-command semi-automated sync
#
# Runs drift detection, and if drift is found, launches a Claude Code session
# that automatically syncs all drifted entries and creates PRs.
#
# Usage:
#   pnpm loc-sync:run                  # Full pipeline (sync + visual compare)
#   pnpm loc-sync:run --drift-only     # Just show drift report, don't sync
#   pnpm loc-sync:run --no-visual      # Sync without visual comparison
#   pnpm loc-sync:run --service esign-f # Filter by service

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

DRIFT_ONLY=false
NO_VISUAL=false
SERVICE_FILTER=""

for arg in "$@"; do
  case "$arg" in
    --drift-only) DRIFT_ONLY=true ;;
    --no-visual) NO_VISUAL=true ;;
    --service=*) SERVICE_FILTER="${arg#--service=}" ;;
    --service) ;; # next arg is the value, handled below
  esac
done

# Handle --service VALUE (two-arg form)
prev=""
for arg in "$@"; do
  if [ "$prev" = "--service" ]; then
    SERVICE_FILTER="$arg"
  fi
  prev="$arg"
done

cd "$PROJECT_DIR"

# ---- Step 1: Drift Detection ----
#
# We intentionally DO NOT run `git fetch / merge` directly here. Delegating to
# `pnpm loc-sync:auto` means the safety checks inside updateLocApp() (main branch
# required, clean tree required, fail-fast on merge error) apply to this entry
# point too. Previously we ran git here then passed --skip-pull, which silently
# bypassed every guard and could sync from a feature branch / dirty tree.

echo "=== LOC Sync Run ==="
echo ""

AUTO_ARGS=()
if [ -n "$SERVICE_FILTER" ]; then
  AUTO_ARGS+=(--service "$SERVICE_FILTER")
fi

echo "[1/2] Updating lib/loc-app and detecting drift..."
# Capture stdout (JSON) and stream stderr (progress + any abort reason) to user.
# Bash 3.2 (macOS default) treats "${empty_array[@]}" as unbound under set -u,
# so we branch on array length to avoid a crash when no filters are set.
set +e
if [ "${#AUTO_ARGS[@]}" -eq 0 ]; then
  PLAN_JSON=$(pnpm --silent loc-sync:auto)
else
  PLAN_JSON=$(pnpm --silent loc-sync:auto -- "${AUTO_ARGS[@]}")
fi
AUTO_EXIT=$?
set -e
if [ "$AUTO_EXIT" != "0" ]; then
  echo ""
  echo "  loc-sync:auto aborted (exit $AUTO_EXIT). See messages above."
  exit "$AUTO_EXIT"
fi

TOTAL_DRIFTED=$(echo "$PLAN_JSON" | node -e "
  const data = JSON.parse(require('fs').readFileSync('/dev/stdin', 'utf-8'));
  console.log(data.totalDrifted);
")

if [ "$TOTAL_DRIFTED" = "0" ]; then
  echo "  No drift detected. All templates are up to date."
  exit 0
fi

# Show summary
echo "$PLAN_JSON" | node -e "
  const data = JSON.parse(require('fs').readFileSync('/dev/stdin', 'utf-8'));
  console.log('  Drifted entries: ' + data.totalDrifted);
  for (const sp of data.servicePlans) {
    const entries = sp.entries.map(e => e.entryKey + '(' + e.mode + ')').join(', ');
    console.log('  ' + sp.service + ': ' + entries);
  }
"
echo ""

if [ "$DRIFT_ONLY" = true ]; then
  echo "[Done] Drift-only mode. Run without --drift-only to sync."
  exit 0
fi

# ---- Step 2: Build Claude prompt ----

VISUAL_INSTRUCTION=""
if [ "$NO_VISUAL" = false ]; then
  VISUAL_INSTRUCTION="
## Step 3: Visual Comparison (per entry)

For each synced entry:
1. Run \`/loc-sync visual-compare {entry.entryKey}\`
2. If differences found and fixed, make additional commit
3. If LOC Dev unreachable, skip and note in PR body"
fi

SYNC_PROMPT="You are running as an automated LOC sync agent. The sync plan has already been generated.

## Sync Plan

\`\`\`json
$PLAN_JSON
\`\`\`

## Step 1: Verify State

1. Confirm you are on the \`main\` branch with a clean working tree (use \`git status\` and \`git branch --show-current\`)
2. If not clean, stop and report the issue
3. Remember the starting commit: run \`git rev-parse main\` and save as MAIN_SHA

## Step 2: Code Sync (per service)

For each service plan in the JSON above, perform the following in order. IMPORTANT: each service's branch MUST be created from main, not from the previous service's branch.

For each service plan:
1. **Reset to main first**: run \`git checkout main\` then verify \`git rev-parse HEAD\` equals MAIN_SHA. This ensures the new branch is cut from main, not from a sibling service's branch.
2. \`git checkout -b {plan.branch}\`
3. For each entry: run \`/loc-sync {entry.mode} {entry.locService} {entry.locPagePath}\`
4. On failure: skip the entry and note it in the PR body
5. After all entries are processed, stage ALL changes including new files: \`git add -A\` (NOT \`git add -u\` — that misses untracked files created by \`full\` mode)
6. Commit with message:
   \`\`\`
   auto(loc-sync): sync {service} templates

   Entries synced:
   - {entryKey} ({mode})
   ...
   \`\`\`
$VISUAL_INSTRUCTION

## Step 4: PR Creation or Update (per service)

After each service's commit, publish the work — never drop a local-only branch on the floor.

1. Check for an existing open PR: \`gh pr list --label auto-loc-sync --search \"{service}\" --state open --json number,headRefName\`
2. **If no existing PR**:
   a. \`git push -u origin {plan.branch}\`
   b. \`gh pr create --title \"auto(loc-sync): sync {service} templates\" --label auto-loc-sync\` with the drift details in the body
3. **If an existing PR exists** (same \`auto-loc-sync\` label, same service):
   a. Read its head branch name (\`{existing-head}\`) from the \`gh pr list\` JSON
   b. Save the full sync commit range before any branch operations:
      \`\`\`
      SYNC_COMMITS=\$(git rev-list --reverse \"\${MAIN_SHA}..HEAD\")
      test -n \"\$SYNC_COMMITS\"
      \`\`\`
   c. Fetch the remote PR branch: \`git fetch origin {existing-head}\`
   d. Switch to the existing PR branch: \`git checkout {existing-head}\` (create from remote if not local: \`git checkout -b {existing-head} origin/{existing-head}\`)
   e. Delete the now-orphaned plan branch: \`git branch -D {plan.branch}\`
   f. Cherry-pick the full sync range in order: \`git cherry-pick \$SYNC_COMMITS\` (resolve conflicts if any, or report a hard failure)
   g. Push: \`git push origin {existing-head}\`
   h. Post a PR comment summarizing what this run added
   i. **Do NOT silently skip the push** — losing the sync work is worse than a noisy PR update. If you genuinely cannot push (conflicts, auth), report a hard failure for this service and move on to the next one.
4. **Then return to main before the next service**: \`git checkout main\` (critical — prevents next service's branch from being cut off this one)

## Step 5: Cleanup

End on main: \`git checkout main\`

Report summary of all actions taken, including:
- Services processed, with their branch names and PR URLs
- Entries synced per service (with mode)
- Entries skipped (with reason)
- Visual comparison results per entry"

# ---- Step 3: Launch Claude Code ----

echo "[2/2] Launching Claude Code session..."
echo "  Claude will sync drifted entries and create PRs."
echo "  You can continue other work — this runs in the background."
echo ""

exec claude -p "$SYNC_PROMPT"
