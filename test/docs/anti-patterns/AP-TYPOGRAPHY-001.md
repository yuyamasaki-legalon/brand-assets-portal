---
id: AP-TYPOGRAPHY-001
component: Typography
category: styling
severity: error
eslint_rule: aegis-custom/no-aegis-typography-inline-style
---
# Typography コンポーネントに style で whiteSpace を指定してはいけない

## Bad

```tsx
<Text style={{ whiteSpace: "nowrap" }}>長いテキスト</Text>
```

## Good

```tsx
<Text whiteSpace="nowrap">長いテキスト</Text>
```

## Why

Text / Body / Heading コンポーネントには `whiteSpace` prop が用意されている。`style` で指定するとコンポーネントの型安全性が失われ、将来の変更にも追従できない。
