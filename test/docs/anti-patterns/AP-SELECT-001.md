---
id: AP-SELECT-001
component: Select
category: composition
severity: error
wcag: "3.3.2"
---
# Select を FormControl 外で単独使用してはいけない

## Bad

```tsx
<Select options={options} />
```

## Good

```tsx
<FormControl>
  <FormControl.Label>通貨</FormControl.Label>
  <Select options={options} />
</FormControl>
```

```tsx
// FormControl 外の場合は aria-label が必須
<Select aria-label="通貨" options={options} />
```

## Why

Select は FormControl 内で使用し、FormControl.Label でラベルを提供する。FormControl 外で使用する場合は `aria-label` が必須。WCAG 3.3.2 に違反する。
