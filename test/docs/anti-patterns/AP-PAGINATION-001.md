---
id: AP-PAGINATION-001
component: Pagination
category: usage
severity: warning
---
# Pagination をカスタム実装してはいけない

## Bad

```tsx
<div className="pagination">
  <button onClick={() => setPage(page - 1)}>前へ</button>
  <span>{page} / {totalPages}</span>
  <button onClick={() => setPage(page + 1)}>次へ</button>
</div>
```

## Good

```tsx
<Pagination
  page={page}
  total={totalPages}
  onChange={setPage}
/>
```

## Why

ページネーションは Aegis の Pagination コンポーネントを使用する。カスタム実装ではキーボード操作やスクリーンリーダー対応が不十分になりやすい。
