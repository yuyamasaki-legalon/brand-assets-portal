var e=`---
id: AP-MENU-001
component: Menu
category: composition
severity: warning
---
# Menu のトリガーには Button か IconButton を使用すべき

## Bad

\`\`\`tsx
<Menu>
  <MenuTrigger>
    <div>メニューを開く</div>
  </MenuTrigger>
  <MenuContent>
    <MenuItem>項目1</MenuItem>
  </MenuContent>
</Menu>
\`\`\`

## Good

\`\`\`tsx
<Menu>
  <MenuTrigger>
    <Tooltip title="メニュー">
      <IconButton aria-label="メニューを開く" variant="plain">
        <Icon><LfEllipsisDot /></Icon>
      </IconButton>
    </Tooltip>
  </MenuTrigger>
  <MenuContent>
    <MenuItem>項目1</MenuItem>
  </MenuContent>
</Menu>
\`\`\`

## Why

Menu のトリガーにはキーボード操作可能な Button または IconButton を使用する。div をトリガーにするとキーボードユーザーがメニューを開けない。
`;export{e as default};