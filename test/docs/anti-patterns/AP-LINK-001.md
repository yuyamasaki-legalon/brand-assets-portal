---
id: AP-LINK-001
component: Link
category: composition
severity: error
eslint_rule: aegis-custom/no-link-icon-children
---
# Link にアイコンを子要素として直接配置してはいけない

## Bad

```tsx
<Link href="/settings">
  <Icon><LfSettings /></Icon>
  設定
</Link>
```

## Good

```tsx
<Link href="/settings" leading={<Icon><LfSettings /></Icon>}>
  設定
</Link>
```

## Why

Link にアイコンを配置する場合は `trailing` または `leading` prop を使用する。子要素として直接配置するとレイアウトが崩れる。
