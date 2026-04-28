---
id: AP-BANNER-001
component: Banner
category: composition
severity: error
eslint_rule: aegis-custom/no-banner-icon-children
---
# Banner にアイコンを子要素として追加してはいけない

## Bad

```tsx
<Banner color="danger">
  <Icon><LfAlertTriangle /></Icon>
  エラーが発生しました
</Banner>
```

## Good

```tsx
<Banner color="danger">エラーが発生しました</Banner>
```

## Why

Banner は `color` prop に応じてアイコンを自動表示する。手動でアイコンを追加するとアイコンが二重表示される。
