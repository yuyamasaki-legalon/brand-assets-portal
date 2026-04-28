---
id: AP-DATEFIELD-001
component: DateField
category: composition
severity: error
wcag: "3.3.2"
---
# DateField を FormControl 外で単独使用してはいけない

## Bad

```tsx
<DateField />
```

## Good

```tsx
<FormControl>
  <FormControl.Label>開始日</FormControl.Label>
  <DateField />
</FormControl>
```

## Why

DateField は FormControl 内で使用し、FormControl.Label でラベルを提供する。FormControl 外で使用する場合は `aria-label` が必須。
