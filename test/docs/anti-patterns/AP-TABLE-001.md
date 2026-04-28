---
id: AP-TABLE-001
component: Table
category: accessibility
severity: error
wcag: "1.3.1"
---
# Table に Table.Head を含めなければならない

## Bad

```tsx
<Table>
  <Table.Body>
    <Table.Row>
      <Table.Cell>田中太郎</Table.Cell>
      <Table.Cell>tanaka@example.com</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

## Good

```tsx
<Table>
  <Table.Head>
    <Table.Row>
      <Table.Cell>名前</Table.Cell>
      <Table.Cell>メール</Table.Cell>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Cell>田中太郎</Table.Cell>
      <Table.Cell>tanaka@example.com</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

## Why

データテーブルには列の見出しが必要。`Table.Head` がないとスクリーンリーダーがデータの構造を伝えられない。WCAG 1.3.1 Info and Relationships に違反する。
