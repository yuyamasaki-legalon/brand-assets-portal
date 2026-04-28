---
id: AP-MENU-001
component: Menu
category: composition
severity: warning
---
# Menu のトリガーには Button か IconButton を使用すべき

## Bad

```tsx
<Menu>
  <Menu.Trigger>
    <div>メニューを開く</div>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.Item>項目1</Menu.Item>
  </Menu.Content>
</Menu>
```

## Good

```tsx
<Menu>
  <Menu.Trigger>
    <IconButton aria-label="メニューを開く">
      <Icon><LfDotVertical /></Icon>
    </IconButton>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.Item>項目1</Menu.Item>
  </Menu.Content>
</Menu>
```

## Why

Menu のトリガーにはキーボード操作可能な Button または IconButton を使用する。div をトリガーにするとキーボードユーザーがメニューを開けない。
