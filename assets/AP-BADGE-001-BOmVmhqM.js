var e=`---
id: AP-BADGE-001
component: Badge
category: usage
severity: error
---
# Badge をテキストラベルとして使用してはいけない

## Bad

\`\`\`tsx
<Badge color="information" style={latestBadgeStyle}>
  最新
</Badge>

<Badge color="information">Updated 4 min ago</Badge>

<Badge color="danger">{blockedCount}</Badge>
\`\`\`

## Good

\`\`\`tsx
// 件数・通知数 → count prop を使用
<Badge color="danger" count={blockedCount} />

// 状態を示すラベル → Tag を使用
<Tag size="small" color="blue">最新</Tag>

// ステータス表示 → StatusLabel を使用
<StatusLabel variant="fill" size="small" color="blue">最新</StatusLabel>

// 補足テキスト → Text を使用
<Text variant="body.small" color="subtle">Updated 4 min ago</Text>
\`\`\`

## Why

Badge は件数・通知のアイキャッチ用コンポーネントであり、数値は \`count\` prop で渡して使う。テキストラベルや式を children として渡す用途には設計されていない。状態を表す場合は StatusLabel、オブジェクトの分類を表す場合は Tag、補足文は Text を使用する。
`;export{e as default};