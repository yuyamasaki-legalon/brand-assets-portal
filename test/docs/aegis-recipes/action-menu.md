# アイコンメニュー

行の「…」ボタンなどから操作を出すレシピ。
`Menu` に `MenuItem` を入れて、アクションを整理します。

## 使うコンポーネント

- `Menu`, `MenuTrigger`, `MenuContent`
- `MenuItem`, `MenuGroup`, `MenuSeparator`
- `Icon`, `IconButton`
- `Tooltip`

## スニペット

```tsx
<Menu>
  <MenuTrigger>
    <Tooltip title="その他" placement="left">
      <IconButton aria-label="その他" variant="plain">
        <Icon><LfEllipsisDot /></Icon>
      </IconButton>
    </Tooltip>
  </MenuTrigger>
  <MenuContent side="bottom" align="end">
    <MenuGroup>
      <MenuItem onClick={handleEdit}>編集</MenuItem>
    </MenuGroup>
    <MenuSeparator />
    <MenuGroup>
      <MenuItem color="danger" onClick={handleDelete}>削除</MenuItem>
    </MenuGroup>
  </MenuContent>
</Menu>
```

## ポイント

- ボタンには `aria-label` を必ず付ける
- 危険操作は `color="danger"` にする

## NG例

- 独自のドロップダウンを実装しない
- アクションを横並びに並べすぎない
