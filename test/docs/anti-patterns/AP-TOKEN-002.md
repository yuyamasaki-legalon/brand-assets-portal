---
id: AP-TOKEN-002
component: General
category: styling
severity: error
---
# spacing に size トークンを使用してはいけない

## Bad

```css
/* gap/padding/margin に size トークンを使用 */
gap: var(--aegis-size-medium);
padding: var(--aegis-size-xSmall);
```

## Good

```css
gap: var(--aegis-space-medium);
padding: var(--aegis-space-xSmall);
```

## Why

`--aegis-size-*` はアイコンやボタンの寸法用、`--aegis-space-*` は余白（gap, padding, margin）用。用途を混同するとデザイントークンの意味が失われる。
