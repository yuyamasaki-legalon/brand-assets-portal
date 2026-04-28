---
id: AP-TOKEN-003
component: General
category: styling
severity: error
---
# 廃止されたトークン命名を使用してはいけない

## Bad

```css
margin: var(--spacing-4);
color: var(--color-background-primary);
```

## Good

```css
margin: var(--aegis-space-medium);
color: var(--aegis-color-background-default);
```

## Why

Aegis の現在のトークン命名規則は `--aegis-{category}-{variant}` 形式。旧命名（`--spacing-*`, `--color-*`）は廃止されており、将来のバージョンで削除される。
