---
id: AP-BUTTON-001
component: Button
category: styling
severity: error
eslint_rule: aegis-custom/no-button-inline-margin
---
# Button にインライン margin を付けてはいけない

## Bad

```tsx
<Button style={{ marginTop: "16px" }}>Submit</Button>
```

## Good

```tsx
<Stack gap="medium">
  <TextField />
  <Button>Submit</Button>
</Stack>
```

## Why

余白は親レイアウトコンポーネント（Stack, ButtonGroup 等）の gap やデザイントークンを使って制御する。Button に直接 margin を指定すると、レイアウト変更時に一貫性が崩れる。
