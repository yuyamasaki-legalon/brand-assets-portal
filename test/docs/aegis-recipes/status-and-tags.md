# ステータス表示 + タグ

詳細画面や一覧の補足情報として、`StatusLabel` と `Tag` を組み合わせるレシピ。

## 使うコンポーネント

- `StatusLabel`
- `Tag`, `TagGroup`
- `Text`

## スニペット

```tsx
<div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
  <StatusLabel color={statusColors[status]}>{statusLabels[status]}</StatusLabel>
  <Text variant="body.small" color="subtle">{documentId}</Text>
</div>

<TagGroup>
  {tags.map((tag) => (
    <Tag key={tag}>{tag}</Tag>
  ))}
</TagGroup>
```

## ポイント

- ステータスは `StatusLabel` を使う
- 複数タグは `TagGroup` にまとめる

## NG例

- ステータスを `Text` の色だけで表現しない
- タグを `Badge` や独自 Pill で再実装しない
