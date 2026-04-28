---
id: AP-TABLE-003
component: Table
category: accessibility
severity: warning
wcag: "4.1.2"
---
# CheckboxCell に aria-labelledby を付けるべき

## Bad

```tsx
<Table.CheckboxCell
  checked={selected}
  onChange={handleChange}
/>
```

## Good

```tsx
<Table.CheckboxCell
  aria-labelledby={nameId}
  checked={selected}
  onChange={handleChange}
/>
// 対応する名前セルに id を設定
<Table.Cell id={nameId} as="th">{user.name}</Table.Cell>
```

## Why

行ごとのチェックボックスは、どの行のチェックボックスかをスクリーンリーダーが判別できるようにする。`aria-labelledby` で名前セルと関連付ける。
