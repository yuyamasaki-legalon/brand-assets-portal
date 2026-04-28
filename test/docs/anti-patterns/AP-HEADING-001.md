---
id: AP-HEADING-001
component: General
category: accessibility
severity: warning
wcag: "1.3.1"
---
# 見出しレベルを飛ばしてはいけない

## Bad

```tsx
<Title level={1}>ページタイトル</Title>
<Title level={3}>セクション</Title>  {/* h2 を飛ばしている */}
```

## Good

```tsx
<Title level={1}>ページタイトル</Title>
<Title level={2}>セクション</Title>
<Title level={3}>サブセクション</Title>
```

## Why

見出しレベルの飛ばし（例: h1 → h3）はスクリーンリーダーのナビゲーションを混乱させる。常に順番通りの見出し階層を維持する。
