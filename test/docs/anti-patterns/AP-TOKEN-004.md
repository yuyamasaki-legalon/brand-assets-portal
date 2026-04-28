---
id: AP-TOKEN-004
component: General
category: styling
severity: error
---
# コンテナ幅に size トークンを使用してはいけない

## Bad

```css
max-width: var(--aegis-size-x8Large);
```

## Good

```css
max-width: var(--aegis-layout-width-medium);
```

## Why

コンテナの `max-width` やグリッドカラム幅には `--aegis-layout-width-*` トークンを使用する。`--aegis-size-*` はアイコンやボタンなど小さい要素の寸法用。
