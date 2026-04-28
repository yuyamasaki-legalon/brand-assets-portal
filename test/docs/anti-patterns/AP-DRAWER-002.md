---
id: AP-DRAWER-002
component: Drawer
category: composition
severity: error
---
# Drawer.Header 内に閉じるボタンを二重実装してはいけない

## Bad

```tsx
<Drawer.Header>
  <ContentHeader
    trailing={
      <Tooltip title="閉じる">
        <IconButton aria-label="閉じる" onClick={close}>
          <Icon><LfCloseLarge /></Icon>
        </IconButton>
      </Tooltip>
    }
  >
    <ContentHeader.Title>詳細</ContentHeader.Title>
  </ContentHeader>
</Drawer.Header>
```

## Good

```tsx
<Drawer.Header>
  <ContentHeader>
    <ContentHeader.Title>詳細</ContentHeader.Title>
  </ContentHeader>
</Drawer.Header>
```

## Why

`Drawer.Header` は閉じるボタンを自動提供する。`ContentHeader` の `trailing` に閉じるボタンを追加すると二重表示になり、ユーザー混乱とアクセシビリティ問題を引き起こす。
