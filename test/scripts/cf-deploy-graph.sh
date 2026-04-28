#!/bin/bash

# Cloudflare Pages & Workers デプロイ数を週単位でグラフ表示
# Usage: ./scripts/cf-deploy-graph.sh

ACCOUNT_ID="${CF_ACCOUNT_ID:-}"
PROJECT_NAME="${CF_PROJECT_NAME:-aegis-lab}"

if [ -z "$CF_ACCOUNT_ID" ]; then
  echo "Error: CF_ACCOUNT_ID is not set"
  echo "Run: export CF_ACCOUNT_ID='your_account_id'"
  exit 1
fi

if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo "Error: CLOUDFLARE_API_TOKEN is not set"
  echo "Run: export CLOUDFLARE_API_TOKEN='your_token'"
  exit 1
fi

echo "Fetching deployments..."
echo ""

# ========== Pages Deployments ==========
echo "=== Cloudflare Pages Deployments (Weekly) ==="
echo ""

pages_response=$(curl -s "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects/$PROJECT_NAME/deployments?per_page=25" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN")

if [ "$(echo "$pages_response" | jq -r '.success')" == "true" ]; then
  # jq で週ごとに集計してグラフ表示 (YYYY-MM-WNN 形式)
  echo "$pages_response" | jq -r '
    .result
    | map(.created_on[0:10])
    | map(select(. != null))
    | map(strptime("%Y-%m-%d") | mktime as $t |
        { key: (($t | strftime("%Y-%m")) + "-W" + (($t | strftime("%d") | tonumber - 1) / 7 | floor + 1 | tostring | if length == 1 then "0" + . else . end)) })
    | group_by(.key)
    | map({week: .[0].key, count: length})
    | sort_by(.week)
    | .[-12:]
    | (map(.count) | max) as $max
    | .[]
    | "\(.week)  \(.count | tostring | (" " * (4 - length)) + .)  \(reduce range(.count * 40 / $max | floor) as $i (""; . + "█"))"
  ' 2>/dev/null || echo "$pages_response" | jq -r '
    .result
    | map(select(.created_on != null))
    | map(.created_on[0:10] | strptime("%Y-%m-%d") | mktime as $t |
        { key: (($t | strftime("%Y-%m")) + "-W" + (($t | strftime("%d") | tonumber - 1) / 7 | floor + 1 | tostring | if length == 1 then "0" + . else . end)) })
    | group_by(.key)
    | map({week: .[0].key, count: length})
    | sort_by(.week)
    | .[-12:]
    | (map(.count) | max) as $max
    | .[]
    | "\(.week)  \(.count | tostring | (" " * (4 - length)) + .)  \(reduce range(.count * 40 / $max | floor) as $i (""; . + "█"))"
  '

  echo ""
  pages_total=$(echo "$pages_response" | jq '.result | length')
  echo "Total Pages deployments: $pages_total"

  preview_count=$(echo "$pages_response" | jq '[.result[] | select(.environment == "preview")] | length')
  prod_count=$(echo "$pages_response" | jq '[.result[] | select(.environment == "production")] | length')
  echo "  - Preview: $preview_count"
  echo "  - Production: $prod_count"
else
  echo "Pages API Error (project may not exist):"
  echo "$pages_response" | jq -r '.errors[0].message // "Unknown error"'
fi

echo ""
echo ""

# ========== Workers Versions ==========
echo "=== Cloudflare Workers Versions (Weekly) ==="
echo ""

# Workers versions API - ページネーションで全件取得
all_items="[]"
page=1
per_page=100

while true; do
  response=$(curl -s "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/scripts/$PROJECT_NAME/versions?per_page=$per_page&page=$page" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN")

  if [ "$(echo "$response" | jq -r '.success')" != "true" ]; then
    echo "API Error:"
    echo "$response" | jq -r '.errors[0].message // .'
    break
  fi

  # .result が配列か .result.items があるか確認
  items=$(echo "$response" | jq 'if .result | type == "array" then .result else (.result.items // []) end')
  item_count=$(echo "$items" | jq 'length')
  total_count=$(echo "$response" | jq -r '.result_info.total_count // 0')

  if [ "$item_count" -eq 0 ]; then
    break
  fi

  all_items=$(echo "$all_items" "$items" | jq -s 'add')
  fetch_count=$(echo "$all_items" | jq 'length')
  echo "  Fetched $fetch_count / $total_count items..."

  # 全件取得したら終了
  if [ "$fetch_count" -ge "$total_count" ]; then
    break
  fi

  page=$((page + 1))

  # 安全のため最大50ページで打ち切り
  if [ $page -gt 50 ]; then
    break
  fi
done

workers_total=$(echo "$all_items" | jq 'length')
echo ""

if [ "$workers_total" -gt 0 ]; then
  # PR デプロイのみをフィルタ (workers/alias があるもの)
  pr_items=$(echo "$all_items" | jq '[.[] | select(.annotations["workers/alias"] != null)]')
  pr_count=$(echo "$pr_items" | jq 'length')
  manual_count=$((workers_total - pr_count))

  echo "--- PR Deployments Only (excluding manual) ---"
  echo ""

  # jq で週ごとに集計してグラフ表示 (YYYY-MM-WNN 形式)
  echo "$pr_items" | jq -r '
    map({date: (.metadata.created_on // .created_on // empty)[0:10]})
    | map(select(.date != null and .date != ""))
    | map(.date |= (strptime("%Y-%m-%d") | mktime as $t |
        ($t | strftime("%Y-%m")) + "-W" +
        (($t | strftime("%d") | tonumber - 1) / 7 | floor + 1 |
         tostring | if length == 1 then "0" + . else . end)))
    | group_by(.date)
    | map({week: .[0].date, count: length})
    | sort_by(.week)
    | .[-12:]
    | (map(.count) | max) as $max
    | .[]
    | "\(.week)  \(.count | tostring | (" " * (4 - length)) + .)  \(reduce range(.count * 40 / $max | floor) as $i (""; . + "█"))"
  '

  echo ""
  echo "=== Summary ==="
  echo "Total Workers versions: $workers_total"
  echo "  - PR Deployments:     $pr_count"
  echo "  - Manual Deployments: $manual_count"
else
  echo "No Workers versions found or API error"
fi
