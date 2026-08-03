var e=`---
id: AP-COLOR-001
component: General
category: styling
severity: warning
---
# インラインスタイルで色を直接指定してはいけない

## Bad

\`\`\`tsx
<div style={{ color: "#333333", backgroundColor: "#f5f5f5" }}>
  内容
</div>
\`\`\`

## Good

\`\`\`tsx
<div style={{
  color: "var(--aegis-color-text-default)",
  backgroundColor: "var(--aegis-color-background-subtle)"
}}>
  内容
</div>
\`\`\`

## Why

ハードコードされた色ではなく Aegis カラートークンを使用する。トークンを使うことでダークモード対応やブランドカラー変更に自動追従できる。Aegis のカラートークンは WCAG AA（コントラスト比 4.5:1 以上）を満たすよう値が設計されているが、\`text-subtle\` × \`background-subtle\` のような薄い文字 × 薄い背景の組み合わせは基準を下回る可能性があるため、トークン同士の組み合わせは個別に確認すること。
`;export{e as default};