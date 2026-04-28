# TableContainer + Table

軽量な一覧表示で `TableContainer` と `Table` を使うレシピ。
DataTable が不要なシンプル一覧向けです。

## 使うコンポーネント

- `TableContainer`
- `Table`
- `Button`, `Icon`

## スニペット

```tsx
<TableContainer>
  <Table>
    <Table.Head>
      <Table.Row>
        <Table.Cell>名前</Table.Cell>
        <Table.Cell>ID</Table.Cell>
        <Table.ActionCell />
      </Table.Row>
    </Table.Head>
    <Table.Body>
      {list.map(({ id, name }) => (
        <Table.Row key={id}>
          <Table.Cell>{name}</Table.Cell>
          <Table.Cell>{id}</Table.Cell>
          <Table.ActionCell>
            <Button
              trailing={
                <Icon size="large">
                  <LfAngleRightMiddle />
                </Icon>
              }
              variant="solid"
              size="small"
            >
              詳細へ
            </Button>
          </Table.ActionCell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
</TableContainer>
```

## ポイント

- DataTable ほど機能が要らない場合は `Table` を使う
- 操作ボタンは `Table.ActionCell` に配置し `Button` + `Icon` で揃える

## NG例

- `div` で擬似テーブルを作らない
- 行クリックを独自実装する前に `Table` の構造を優先する
