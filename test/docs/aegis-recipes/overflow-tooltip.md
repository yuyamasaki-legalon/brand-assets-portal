# 省略テキスト + Tooltip

テキストが省略される場合に、`Tooltip` で全文を見せるレシピ。

## 使うコンポーネント

- `Tooltip`
- `Text`

## スニペット

```tsx
<Tooltip onlyOnOverflow title={value}>
  <Text numberOfLines={1}>{value}</Text>
</Tooltip>
```

## ポイント

- `onlyOnOverflow` を使って必要時のみ表示
- `Text` 側で `numberOfLines` を指定する

## NG例

- 常時表示の Tooltip を乱用しない
- 省略せずに `div` で幅固定しない
