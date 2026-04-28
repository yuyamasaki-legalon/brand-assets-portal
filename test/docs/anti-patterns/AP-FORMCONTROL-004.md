---
id: AP-FORMCONTROL-004
component: FormControl
category: accessibility
severity: info
---
# required の表示には prop を使用すべき

## Bad

```tsx
<FormControl>
  <FormControl.Label>メール *</FormControl.Label>
  <TextField />
</FormControl>
```

## Good

```tsx
<FormControl required>
  <FormControl.Label>メール</FormControl.Label>
  <TextField />
</FormControl>
```

## Why

必須マークは Aegis の `required` prop を使用する。`*` のみの手動表示ではスクリーンリーダーに必須情報が伝わらない。
