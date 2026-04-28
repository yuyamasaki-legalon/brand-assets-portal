---
id: AP-TOOLTIP-001
component: Tooltip
category: accessibility
severity: warning
---
# テキスト省略時に Tooltip でフルテキストを表示すべき

## Bad

```tsx
<Text numberOfLines={1}>{longText}</Text>
```

## Good

```tsx
<Tooltip title={longText} onlyOnOverflow>
  <Text numberOfLines={1}>{longText}</Text>
</Tooltip>
```

## Why

`numberOfLines` や CSS によるテキスト省略を使用している場合、切り詰められたテキスト全文をユーザーが確認できるよう `Tooltip` の `onlyOnOverflow` でフルテキストを表示する。
