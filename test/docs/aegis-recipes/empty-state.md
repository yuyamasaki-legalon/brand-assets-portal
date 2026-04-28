# 空状態 (EmptyState)

検索結果ゼロや初期状態など、データがないときの表示レシピ。
`EmptyState` に `visual` と説明文を入れて、次の行動を促します。

## 使うコンポーネント

- `EmptyState`
- `Text`
- `Button` (必要に応じて)
- `@legalforce/aegis-illustrations/react` のビジュアル

## スニペット

```tsx
{items.length > 0 ? (
  <DataTable /* ... */ />
) : (
  <EmptyState
    title="項目がありません"
    visual={<Box />}
    action={<Button variant="solid" size="medium">新規作成</Button>}
  >
    <Text>新規作成ボタンから項目を追加してください。</Text>
  </EmptyState>
)}
```

## ポイント

- 検索条件が原因の場合は、タイトルと説明文を分けて案内する
- `visual` を必ず指定し、空状態を視覚的に伝える

## NG例

- 空状態を `Text` だけで済ませない
- `visual` を省略しない（ドロップダウン内など小さいコンテキストでは省略可）
