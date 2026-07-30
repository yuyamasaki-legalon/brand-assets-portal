var e=`---
id: AP-CHECKBOX-001
component: Checkbox
category: composition
severity: warning
---
# Checkbox を FormControl 外で単独使用すべきではない

## Bad

\`\`\`tsx
<Checkbox>利用規約に同意する</Checkbox>
\`\`\`

## Good

\`\`\`tsx
<FormControl>
  <Checkbox>利用規約に同意する</Checkbox>
</FormControl>

// アイコンのみなど children でラベルを提供しない場合は aria-label を付与
<Checkbox aria-label="すべて選択" />
\`\`\`

## Why

Checkbox は FormControl 内で使用することで、エラー表示やラベル管理が統一される。children にテキストを渡している場合（例: \`<Checkbox>利用規約に同意する</Checkbox>\`）はそれがアクセシブルネームになるため追加の aria 属性は不要だが、アイコンのみ・空の場合などラベルを children で提供しない場合は \`aria-label\` または \`aria-labelledby\` が必須（WCAG 4.1.2）。
`;export{e as default};