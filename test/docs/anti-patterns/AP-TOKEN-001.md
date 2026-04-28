---
id: AP-TOKEN-001
component: General
category: styling
severity: error
eslint_rule: aegis-custom/no-raw-pixel-values
---
# インラインスタイルに生の px 値を使用してはいけない

## Bad

```tsx
<div style={{ padding: "16px", borderRadius: "8px" }}>
  内容
</div>
```

## Good

```tsx
<div style={{
  padding: "var(--aegis-space-medium)",
  borderRadius: "var(--aegis-radius-large)"
}}>
  内容
</div>
```

## Why

ハードコードされた px 値ではなく Aegis デザイントークンを使用する。トークンを使うことでデザインの一貫性が保たれ、テーマ変更にも自動追従できる。
