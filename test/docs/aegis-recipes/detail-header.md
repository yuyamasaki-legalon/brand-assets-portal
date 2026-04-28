# 詳細ヘッダー（ステータス + アクション）

詳細画面のヘッダーに、ステータス表示と主要アクションを並べるレシピ。
`Header` を使って一行にまとめます。

## 使うコンポーネント

- `Header`, `Header.Item`, `Header.Spacer`, `Header.Title`
- `StatusLabel`, `Text`
- `Button`, `ButtonGroup`
- `Icon`, `IconButton`, `Tooltip`

## スニペット

```tsx
<Header>
  <Header.Item>
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xxSmall)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
        <StatusLabel color={statusColors[status]}>{statusLabels[status]}</StatusLabel>
        <Header.Title>
          <Text variant="title.xxSmall">{title}</Text>
        </Header.Title>
      </div>
      <Text variant="body.small" color="subtle">{documentId}</Text>
    </div>
  </Header.Item>
  <Header.Spacer />
  <Header.Item>
    <ButtonGroup>
      <Button variant="plain" leading={<Icon><LfPen /></Icon>}>編集</Button>
      <Button variant="solid">保存</Button>
    </ButtonGroup>
    <Tooltip title="その他" placement="bottom">
      <IconButton variant="plain" aria-label="その他">
        <Icon>
          <LfEllipsisDot />
        </Icon>
      </IconButton>
    </Tooltip>
  </Header.Item>
</Header>
```

## ポイント

- `StatusLabel` は `Header.Title` の左に並べる
- 主要アクションは `ButtonGroup` に集約する

## NG例

- ステータスを `Text` の色だけで表現しない
- アクションをバラバラに配置しない
