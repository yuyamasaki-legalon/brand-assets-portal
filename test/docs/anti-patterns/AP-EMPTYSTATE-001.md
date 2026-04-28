---
id: AP-EMPTYSTATE-001
component: EmptyState
category: accessibility
severity: warning
---
# EmptyState に title prop を設定すべき

## Bad

```tsx
<EmptyState>
  データがありません
</EmptyState>
```

## Good

```tsx
<EmptyState title="検索結果なし">
  条件に一致するデータが見つかりませんでした。
</EmptyState>
```

## Why

EmptyState には、何が空なのかを伝える `title` を設定する。title がないとスクリーンリーダーユーザーにコンテキストが伝わらない。
