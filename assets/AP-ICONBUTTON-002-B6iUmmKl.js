var e=`---
id: AP-ICONBUTTON-002
component: IconButton
category: accessibility
severity: error
eslint_rule: aegis-custom/require-iconbutton-aria-label
wcag: "4.1.2"
---
# IconButton に aria-label を付けないといけない

## Bad

\`\`\`tsx
<IconButton>
  <Icon><LfTrash /></Icon>
</IconButton>
\`\`\`

## Good

\`\`\`tsx
<Tooltip title="削除">
  <IconButton aria-label="削除">
    <Icon><LfTrash /></Icon>
  </IconButton>
</Tooltip>
\`\`\`

## Why

IconButton はテキストラベルを持たないため、スクリーンリーダー向けに \`aria-label\` が必須。WCAG 4.1.2 Name, Role, Value に違反する。
`;export{e as default};