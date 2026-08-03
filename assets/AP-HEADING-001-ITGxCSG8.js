var e=`---
id: AP-HEADING-001
component: General
category: accessibility
severity: warning
wcag: "1.3.1"
---
# 見出しレベルを飛ばしてはいけない

## Bad

\`\`\`tsx
<ContentHeaderTitle as="h1">ページタイトル</ContentHeaderTitle>
<ContentHeaderTitle as="h3">セクション</ContentHeaderTitle>  {/* h2 を飛ばしている */}
\`\`\`

## Good

\`\`\`tsx
<ContentHeaderTitle as="h1">ページタイトル</ContentHeaderTitle>
<ContentHeaderTitle as="h2">セクション</ContentHeaderTitle>
<ContentHeaderTitle as="h3">サブセクション</ContentHeaderTitle>
\`\`\`

## Why

見出しレベルの飛ばし（例: h1 → h3）はスクリーンリーダーのナビゲーションを混乱させる。常に順番通りの見出し階層を維持する。

Aegis では \`ContentHeaderTitle\` の \`as\` prop（\`h1\`〜\`h6\`）でセマンティックレベルを指定する。\`Title\` というコンポーネントは存在しないので注意。
`;export{e as default};