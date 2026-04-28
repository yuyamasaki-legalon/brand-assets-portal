---
id: AP-TABINDEX-001
component: General
category: accessibility
severity: warning
---
# 正の tabIndex を使用してはいけない

## Bad

```tsx
<Button tabIndex={5}>先にフォーカス</Button>
<TextField tabIndex={1} />
```

## Good

```tsx
<Button tabIndex={0}>フォーカス可能</Button>
<Button tabIndex={-1}>プログラムでのみフォーカス</Button>
```

## Why

`tabIndex` に正の値（1 以上）を使用すると自然な DOM 順序でのフォーカス移動が乱れ、アクセシビリティが低下する。`0`（通常のフォーカス順序）か `-1`（プログラム制御用）のみを使用する。
