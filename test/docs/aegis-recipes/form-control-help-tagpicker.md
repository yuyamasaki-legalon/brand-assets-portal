# フォームラベル + ヘルプ + TagPicker

フィルターや設定画面で、ラベルにヘルプを付けつつ複数選択するレシピ。
`FormControl` と `Popover` を組み合わせ、説明を補足します。

## 使うコンポーネント

- `FormControl`
- `TagPicker`
- `Popover`, `Icon`, `IconButton`, `ContentHeader`, `ContentHeaderDescription`

## スニペット

```tsx
<FormControl>
  <FormControl.Label>
    <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xxSmall)" }}>
      ステータス
      <Popover arrow placement="top-start">
        <Popover.Anchor>
          <IconButton variant="plain" size="xSmall" aria-label="ヘルプ"><Icon><LfQuestionCircle /></Icon></IconButton>
        </Popover.Anchor>
        <Popover.Content width="small">
          <Popover.Header>
            <ContentHeader size="xSmall">
              <ContentHeaderDescription>選択中のステータスが検索条件になります。</ContentHeaderDescription>
            </ContentHeader>
          </Popover.Header>
        </Popover.Content>
      </Popover>
    </div>
  </FormControl.Label>
  <TagPicker
    value={value}
    options={options}
    onChange={onChange}
    placeholder="ステータスを選択"
  />
</FormControl>
```

## ポイント

- ヘルプ説明は `Popover` にまとめる
- 複数選択は `TagPicker` を使う

## NG例

- ラベル付近に独自ツールチップを実装しない
- 複数選択を `Select` の独自拡張で再実装しない
