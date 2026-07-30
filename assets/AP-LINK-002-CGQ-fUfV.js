var e=`---
id: AP-LINK-002
component: Link
category: accessibility
severity: warning
wcag: "4.1.2"
---
# 遷移しない操作に Link を使用してはいけない

## Bad

\`\`\`tsx
<Link onClick={handleClick}>設定を変更</Link>
\`\`\`

## Good

\`\`\`tsx
// 遷移する場合: href 付きの Link
<Link href="/settings">設定を変更</Link>

// 遷移しない場合: Button variant="plain" を使用（Link 風の見た目）
<Button variant="plain" onClick={handleClick}>設定を変更</Button>
\`\`\`

## Why

Link は遷移用途のコンポーネント。\`href\` なしで \`onClick\` のみの場合、スクリーンリーダーは「リンク」として読み上げるが、実際の挙動はボタンになり、ユーザーに誤解を与える（WAI-ARIA "First rule of ARIA": ネイティブ要素を優先）。

「リンクの見た目だが動作はボタン」という UI が必要な場合は \`<Link role="button">\` で上書きするのではなく、\`<Button variant="plain">\` を使うこと。Aegis Button は \`variant="plain"\` でテキストリンク風に表示できる。
`;export{e as default};