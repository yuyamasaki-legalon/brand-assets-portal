---
id: AP-SPAN-001
component: General
category: composition
severity: warning
eslint_rule: aegis-custom/no-raw-span
---
# 生の span タグを使用してはいけない

## Bad

```tsx
<span>テキスト内容</span>
```

## Good

```tsx
<Text>テキスト内容</Text>
```

## Why

`<span>` の代わりに Aegis の `<Text>` コンポーネントを使用する。Text はデザイントークンに基づくタイポグラフィスタイルを適用し、一貫性のあるテキスト表示を提供する。
