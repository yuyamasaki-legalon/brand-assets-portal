---
id: AP-BUTTON-002
component: Button
category: styling
severity: error
eslint_rule: aegis-custom/no-button-inline-width
---
# Button に style.width を指定してはいけない

## Bad

```tsx
<Button style={{ width: "200px" }}>Submit</Button>
```

## Good

```tsx
<Button width="full">Submit</Button>
```

## Why

Button の横幅は `width` prop（`"full"` 等）で制御する。`style.width` を使うと Aegis の幅制御メカニズムをバイパスし、レスポンシブ対応が壊れる。
