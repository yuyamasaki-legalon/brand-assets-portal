---
id: AP-FORMCONTROL-001
component: FormControl
category: composition
severity: error
eslint_rule: aegis-custom/no-textfield-without-formcontrol
wcag: "3.3.2"
---
# TextField / Select / Textarea を FormControl 外で単独使用してはいけない

## Bad

```tsx
<TextField placeholder="検索" />
<Select options={options} />
<Textarea placeholder="内容を入力" />
```

## Good

```tsx
<FormControl>
  <FormControl.Label>検索キーワード</FormControl.Label>
  <TextField placeholder="検索" />
</FormControl>
```

```tsx
// FormControl 外で使う場合は aria-label が必須
<TextField aria-label="検索キーワード" placeholder="検索" />
```

## Why

入力コンポーネント（TextField, Select, Textarea, Combobox, TagInput, TagPicker, DateField, DatePicker, RangeDatePicker, TimeField）は FormControl 内で使用し、FormControl.Label でラベルを提供する。FormControl 外で使用する場合は `aria-label` または `aria-labelledby` が必須。WCAG 3.3.2 に違反する。
