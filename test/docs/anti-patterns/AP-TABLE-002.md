---
id: AP-TABLE-002
component: Table
category: composition
severity: error
---
# Table.Cell にボタンを直接配置してはいけない

## Bad

```tsx
<Table.Row>
  <Table.Cell>田中太郎</Table.Cell>
  <Table.Cell>
    <Button size="xSmall">編集</Button>
  </Table.Cell>
</Table.Row>
```

## Good

```tsx
<Table.Row>
  <Table.Cell>田中太郎</Table.Cell>
  <Table.ActionCell>
    <Tooltip title="編集">
      <IconButton aria-label="編集" size="xSmall">
        <Icon><LfEdit /></Icon>
      </IconButton>
    </Tooltip>
  </Table.ActionCell>
</Table.Row>
```

## Why

テーブル内のアクションは `Table.ActionCell` に配置する。通常の `Table.Cell` にボタンを配置するとセルのレイアウトやアクセシビリティに問題が生じる。
