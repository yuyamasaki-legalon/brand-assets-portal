# DataTable + Pagination

一覧データをテーブルで表示し、ページネーションで分割するレシピ。
`DataTable` と `Pagination` を縦に積み、空状態に備えます。

## 使うコンポーネント

- `DataTable`
- `Pagination`
- `EmptyState`, `Text`
- `@legalforce/aegis-illustrations/react` のビジュアル

## スニペット

```tsx
{rows.length > 0 ? (
  <div style={{ display: "grid", gap: "var(--aegis-space-medium)" }}>
    <DataTable
      columns={columns}
      rows={rows}
      getRowId={(row) => row.id}
      stickyHeader
      defaultSorting={[{ id: "updatedAt", desc: true }]}
    />
    <Pagination
      page={page}
      pageSize={pageSize}
      totalCount={totalCount}
      onChange={handlePagination}
    />
  </div>
) : (
  <EmptyState title="項目がありません" visual={<Box />}>
    <Text>新規作成ボタンから項目を追加してください。</Text>
  </EmptyState>
)}
```

## ポイント

- `DataTable` と `Pagination` は同じコンテナに縦積み
- 空状態を必ず用意する

## NG例

- `table` タグを手書きしてレイアウトを再現しない
- ページング UI を独自実装しない（`Pagination` を使う）
