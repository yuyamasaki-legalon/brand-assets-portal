var e=`---
id: AP-POPOVER-001
component: Popover
category: accessibility
severity: warning
---
# Popover のトリガーにはインタラクティブ要素を使用すべき

## Bad

\`\`\`tsx
<Popover>
  <PopoverAnchor>
    <div>クリックで開く</div>
  </PopoverAnchor>
  <PopoverContent>
    <PopoverBody>内容</PopoverBody>
  </PopoverContent>
</Popover>
\`\`\`

## Good

\`\`\`tsx
<Popover>
  <PopoverAnchor>
    <Button variant="plain">詳細を表示</Button>
  </PopoverAnchor>
  <PopoverContent>
    <PopoverBody>内容</PopoverBody>
  </PopoverContent>
</Popover>
\`\`\`

## Why

Popover のトリガーにはキーボード操作可能な要素（Button, IconButton 等）を使用する。div や span をトリガーにするとキーボードユーザーがアクセスできない。
`;export{e as default};