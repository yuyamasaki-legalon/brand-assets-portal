# Table.ActionCell + メニュー

一覧の行アクションを `Table.ActionCell` に集約するレシピ。
主ボタン + メニューを `ButtonGroup` にまとめて行内に配置します。

## 使うコンポーネント

- `Table`, `Table.ActionCell`
- `Button`, `ButtonGroup`
- `Menu`, `MenuTrigger`, `MenuContent`, `MenuGroup`, `MenuItem`
- `IconButton`, `Tooltip`, `Icon`

## スニペット

```tsx
<Table.ActionCell>
  <ButtonGroup>
    <Button onClick={handlePrimary}>作成</Button>
    <Menu>
      <MenuTrigger>
        <Tooltip title="その他">
          <IconButton variant="plain" aria-label="その他"><Icon><LfEllipsisDot /></Icon></IconButton>
        </Tooltip>
      </MenuTrigger>
      <MenuContent side="bottom" align="end">
        <MenuGroup>
          <MenuItem onClick={handleEdit} leading={<Icon><LfPen /></Icon>}>編集</MenuItem>
        </MenuGroup>
        <MenuGroup>
          <MenuItem color="danger" onClick={handleDelete} leading={<Icon><LfTrash /></Icon>}>削除</MenuItem>
        </MenuGroup>
      </MenuContent>
    </Menu>
  </ButtonGroup>
</Table.ActionCell>
```

## ポイント

- 行クリックがある場合はボタンの `onClick` で伝播停止を検討する
- メニューは `Menu*` 系で統一する

## NG例

- 行アクションを行外に分離しない
- `div` でメニューを再実装しない
