---
id: AP-POPOVER-001
component: Popover
category: accessibility
severity: warning
---
# Popover のトリガーにはインタラクティブ要素を使用すべき

## Bad

```tsx
<Popover>
  <Popover.Trigger>
    <div>クリックで開く</div>
  </Popover.Trigger>
  <Popover.Content>内容</Popover.Content>
</Popover>
```

## Good

```tsx
<Popover>
  <Popover.Trigger>
    <Button variant="plain">詳細を表示</Button>
  </Popover.Trigger>
  <Popover.Content>内容</Popover.Content>
</Popover>
```

## Why

Popover のトリガーにはキーボード操作可能な要素（Button, IconButton 等）を使用する。div や span をトリガーにするとキーボードユーザーがアクセスできない。
