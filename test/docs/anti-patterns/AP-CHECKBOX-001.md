---
id: AP-CHECKBOX-001
component: Checkbox
category: composition
severity: warning
---
# Checkbox を FormControl 外で単独使用すべきではない

## Bad

```tsx
<Checkbox>利用規約に同意する</Checkbox>
```

## Good

```tsx
<FormControl>
  <Checkbox>利用規約に同意する</Checkbox>
</FormControl>
```

## Why

Checkbox も FormControl 内で使用することで、エラー表示やラベル管理が統一される。FormControl 外で使用する場合は適切な aria 属性が必要。
