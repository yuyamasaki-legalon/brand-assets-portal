# 非活性アクション + 理由の Popover

権限不足などでアクションを無効化する際、理由を `Popover` で補足するレシピ。

## 使うコンポーネント

- `Popover`
- `MenuItem`, `Icon`
- `Text`

## スニペット

```tsx
<Popover placement="bottom" arrow trigger="hover" closeButton={false}>
  <Popover.Anchor>
    <MenuItem disabled leading={<Icon><LfPen /></Icon>}>編集</MenuItem>
  </Popover.Anchor>
  <Popover.Content width="small">
    <Popover.Body>
      <Text>権限がないため編集できません。</Text>
    </Popover.Body>
  </Popover.Content>
</Popover>
```

## ポイント

- 非活性の理由は必ず説明する
- `Popover` は hover を基本にする

## NG例

- 無効化だけして理由を出さない
- `title` 属性だけで済ませない
