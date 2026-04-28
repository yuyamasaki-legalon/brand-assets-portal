# TagPicker カスタム候補 + EmptyState

検索候補にアバターや補足情報を表示しつつ、候補がない場合は `EmptyState` を出すレシピ。

## 使うコンポーネント

- `TagPicker`
- `FormControl`
- `ActionListBody`
- `Avatar`
- `EmptyState`
- `Text`

## スニペット

```tsx
<FormControl>
  <FormControl.Label>担当者</FormControl.Label>
  <TagPicker
    placeholder="担当者を検索"
    options={options}
    value={selectedIds}
    loading={isSearching}
    emptyNode={<EmptyState title="候補がありません" />}
    onChange={handleChange}
    textValue={searchKeyword}
    onTextChange={setSearchKeyword}
    filter={false}
  />
</FormControl>
```

```tsx
const option = {
  value: person.id,
  label: person.name,
  body: (
    <ActionListBody leading={<Avatar name={person.name} size="xSmall" as="span" />} alignItems="start">
      <Text variant="body.medium.bold">{person.name}</Text>
      <Text variant="body.small" color="subtle">{person.department}</Text>
    </ActionListBody>
  ),
};
```

## ポイント

- 候補がないときは `EmptyState` を出す
- 候補表示は `ActionListBody` で整える

## NG例

- 候補を `div` で自作しない
- 空状態を `Text` だけで済ませない
