---
id: AP-ICONBUTTON-001
component: IconButton
category: accessibility
severity: error
eslint_rule: aegis-custom/no-icon-button-without-popper
---
# IconButton を Tooltip または Popover なしで使用してはいけない

## Bad

```tsx
<IconButton aria-label="削除">
  <Icon><LfTrash /></Icon>
</IconButton>
```

## Good

```tsx
<Tooltip title="削除">
  <IconButton aria-label="削除">
    <Icon><LfTrash /></Icon>
  </IconButton>
</Tooltip>
```

## Why

IconButton はテキストラベルを持たないため、視覚的にボタンの目的を伝えるために Tooltip（または `trigger="hover"` の Popover）でラップする必要がある。
