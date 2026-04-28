---
name: design-token-resolver
description: Aegis デザイントークン（spacing、color、size、radius など）の検索と適用を支援。余白、色、サイズの指定時に使用。
---

# デザイントークン リゾルバー

Aegis デザインシステムのデザイントークンを検索し、適切な値を提案する。

## トークンカテゴリ

### 1. Space（余白）

余白用のトークン。`gap`, `padding`, `margin` などに使用。

| トークン | 値 |
|---------|-----|
| `--aegis-space-x3Small` | 2px |
| `--aegis-space-xxSmall` | 4px |
| `--aegis-space-xSmall` | 8px |
| `--aegis-space-small` | 12px |
| `--aegis-space-medium` | 16px |
| `--aegis-space-large` | 24px |
| `--aegis-space-xLarge` | 32px |
| `--aegis-space-xxLarge` | 40px |
| `--aegis-space-x3Large` | 56px |
| `--aegis-space-x4Large` | 64px |
| `--aegis-space-x5Large` | 80px |

**ルール**: 独自の px 値は使用禁止。必ずトークンを使用する。

### 2. Size（サイズ）

アイコン、アバターなどのサイズ用。

| トークン | 値 |
|---------|-----|
| `--aegis-size-x4Small` | 6px |
| `--aegis-size-x3Small` | 8px |
| `--aegis-size-xxSmall` | 12px |
| `--aegis-size-xSmall` | 16px |
| `--aegis-size-small` | 18px |
| `--aegis-size-medium` | 20px |
| `--aegis-size-large` | 24px |
| `--aegis-size-xLarge` | 28px |
| `--aegis-size-xxLarge` | 32px |
| `--aegis-size-x3Large` | 40px |
| `--aegis-size-x4Large` | 48px |
| ... | (最大 120px) |

### 3. Layout Width（レイアウト幅）

コンテナ、ペインなどの幅用。

| トークン | 値 |
|---------|-----|
| `--aegis-layout-width-x7Small` | 80px |
| `--aegis-layout-width-x6Small` | 160px |
| `--aegis-layout-width-x5Small` | 240px |
| `--aegis-layout-width-x4Small` | 320px |
| `--aegis-layout-width-small` | 640px |
| `--aegis-layout-width-medium` | 720px |
| `--aegis-layout-width-large` | 800px |
| `--aegis-layout-width-x6Large` | 1440px |
| `--aegis-layout-width-x8Large` | 1920px |

### 4. Z-Index（重なり順）

| トークン | 値 | 用途 |
|---------|-----|------|
| `--aegis-zIndex-docked` | 10 | 固定要素 |
| `--aegis-zIndex-pane` | 20 | ペイン |
| `--aegis-zIndex-sidebar` | 30 | サイドバー |
| `--aegis-zIndex-header` | 50 | ヘッダー |
| `--aegis-zIndex-drawer` | 100 | ドロワー |
| `--aegis-zIndex-dialog` | 200 | ダイアログ |
| `--aegis-zIndex-dropdown` | 1000 | ドロップダウン |
| `--aegis-zIndex-snackbar` | 10000 | スナックバー |
| `--aegis-zIndex-tooltip` | 10100 | ツールチップ |

### 5. Border Radius（角丸）

| トークン | 値 |
|---------|-----|
| `--aegis-radius-small` | 2px |
| `--aegis-radius-medium` | 4px |
| `--aegis-radius-large` | 8px |
| `--aegis-radius-full` | 1000vh |

### 6. Border Width（線の太さ）

| トークン | 値 |
|---------|-----|
| `--aegis-border-width-thinPlus` | 1px |
| `--aegis-border-width-thin` | 2px |
| `--aegis-border-width-thick` | 4px |
| `--aegis-border-width-thickPlus` | 8px |

### 7. Motion（アニメーション）

| トークン | 値 |
|---------|-----|
| `--aegis-motion-duration-fast` | 320ms |
| `--aegis-motion-duration-normal` | 640ms |
| `--aegis-motion-duration-slow` | 960ms |
| `--aegis-motion-easing-default` | cubic-bezier(0.64, 0, 0, 1) |

## よくある変換

| カスタム値 | → | トークン |
|-----------|---|----------|
| `padding: 8px` | → | `padding: var(--aegis-space-xSmall)` |
| `padding: 16px` | → | `padding: var(--aegis-space-medium)` |
| `gap: 12px` | → | `gap: var(--aegis-space-small)` |
| `gap: 24px` | → | `gap: var(--aegis-space-large)` |
| `margin: 32px` | → | `margin: var(--aegis-space-xLarge)` |
| `border-radius: 4px` | → | `border-radius: var(--aegis-radius-medium)` |
| `width: 320px` | → | `width: var(--aegis-layout-width-x4Small)` |

## MCP ツール

最新のトークン一覧を取得:
```
mcp__aegis__list_tokens
```

## 使用例

```tsx
// CSS-in-JS
<Box style={{
  padding: "var(--aegis-space-medium)",
  gap: "var(--aegis-space-small)",
  borderRadius: "var(--aegis-radius-medium)"
}}>

// Aegis コンポーネントの場合は props で指定
<Stack gap="medium">
<Button size="medium">
```

## 参照ドキュメント

- `docs/rules/ui/02_foundations.md` - デザイン基盤の詳細
