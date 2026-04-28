---
id: AP-COMBOBOX-001
component: Combobox
category: composition
severity: error
wcag: "3.3.2"
---
# Combobox を FormControl 外で単独使用してはいけない

## Bad

```tsx
<Combobox options={options} />
```

## Good

```tsx
<FormControl>
  <FormControl.Label>部署</FormControl.Label>
  <Combobox options={options} />
</FormControl>
```

```tsx
// FormControl 外の場合は aria-label が必須
<Combobox aria-label="部署を選択" options={options} />
```

## Why

Combobox は FormControl 内で使用し、FormControl.Label でラベルを提供する。FormControl 外で使用する場合は `aria-label` が必須。
