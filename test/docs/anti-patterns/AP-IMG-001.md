---
id: AP-IMG-001
component: General
category: accessibility
severity: error
wcag: "1.1.1"
---
# img 要素に alt 属性を付けなければならない

## Bad

```tsx
<img src="/logo.png" />
```

## Good

```tsx
// 意味のある画像
<img src="/logo.png" alt="LegalOn Technologies ロゴ" />

// 装飾的な画像
<img src="/decoration.png" alt="" />
```

## Why

すべての `<img>` 要素に `alt` 属性が必要。意味のある画像にはその内容を説明するテキストを、装飾的な画像には空の `alt=""` を設定する。WCAG 1.1.1 Non-text Content に違反する。
