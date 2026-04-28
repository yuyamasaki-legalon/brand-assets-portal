# Memo: Aegis 本体への改善要望

---

## buildPageLayoutJsxText 生成コード 監査メモ（2026-04-24）

`buildPageLayoutJsxText.ts` が出力する PageLayout JSX を Aegis 公式 API と照合した結果と、実施した修正を記録する。

### Finding 1: `PageLayoutContent` — `style` prop → `maxWidth` / `align` prop に修正 ✅ 修正済み

**問題**: 旧実装は `style={{ maxWidth: "var(--aegis-layout-width-medium)" }}` のように生 CSS を付与していた。  
**公式 API**: `<PageLayoutContent maxWidth="medium" align="start">` のようにトークンキーを文字列で渡す。  
**修正**: `buildContentStyleProp` を `buildContentProps` に置き換え、CSS 変数文字列からトークンキー（`"medium"` 等）を抽出して `maxWidth` prop に渡すよう変更。`align` は `"center"` がデフォルトのため省略。

### Finding 2: `PageLayoutPane` — `maxWidth` は `resizable` のときのみ出力すべき ✅ 修正済み

**問題**: 旧実装は `if (settings.maxWidth)` の条件のみで `maxWidth` を出力しており、non-resizable pane でも `maxWidth="xxLarge"` などが出力されていた。  
**根拠**:
- `PageLayoutPane.d.ts` の JSDoc に "Maximum width of the `PageLayout.Pane` **when resizable**" と明記
- `PageLayoutPane.js` の実装を読むと `ResizableResizer`（ドラッグハンドル）は `resizable && open` のときのみ描画。non-resizable では `maxWidth` は `Resizable` 内部に渡されるが UI 上の効果はゼロ
- TypeScript 型は discriminated union ではないため型エラーにはならないが、公式サンプルでは `maxWidth` は `resizable` とセットのみ使用
**修正**: `buildPaneOpenTag` を修正し、`maxWidth` 出力を `if (settings.resizable)` ブロック内に移動。`"xLarge"` (Aegis デフォルト) の場合は省略。  
**追記**: `PaneSettings` に `minWidth` フィールドが存在しないため、`minWidth` の生成コードへの影響はなし（生成コードに出力されていない）。

### Finding 3: `PageLayout` variant — `"plain"` は公式デフォルト、省略で OK ✅ 確認済み・問題なし

**確認**: `if (globalStyling.pageLayout !== "plain")` で非デフォルト時のみ `variant` を出力している。正しい実装。

### Finding 4: `Sidebar` — `behavior="overlay"` / `collapsible="icon"` / `width="medium"` は省略で OK ✅ 確認済み・問題なし

**確認**: `buildOuterSidebarOpenTag` は既に非デフォルト値のみ出力する条件付きロジックになっていた。

### Finding 5: `Sidebar` start — `side="inline-start"` は公式デフォルト、省略すべき ✅ 修正済み

**問題**: `buildOuterSidebarOpenTag` が start/end 両方の Sidebar で常に `side` prop を出力していた。  
**公式 API**: `side` の省略時デフォルトは `"inline-start"` であり、start sidebar では指定不要。  
**修正**: `if (isEnd) parts.push('side="inline-end"')` に変更し、start sidebar では `side` を省略するよう修正。

### Finding 6: `Header bordered` — boolean prop、`bordered` のみで OK ✅ 確認済み・問題なし

**確認**: `const bordered = globalStyling.headerBorder ? " bordered" : ""` で boolean prop として出力している。正しい実装。

---

## スクロールバーカラーの分離

### 問題

Aegis の ScrollArea コンポーネントがスクロールバーの色に foreground トークンを直接使用している。

```css
/* default */
background-color: var(--aegis-color-foreground-xSubtle);

/* hovered */
background-color: var(--aegis-color-foreground-subtle);
```

`foreground-subtle` はテキストの subtle カラーと共通トークンのため、
テーマカスタマイズ（BaseForeground.subtle）でスクロールバー hover 色も意図せず変わってしまう。

### 対応方針（Aegis 本体で修正すべき）

スクロールバー専用のトークンを定義し、foreground トークンから切り離す。

```css
/* 理想的な実装 */
--aegis-scrollbar-thumb-color: var(--aegis-color-foreground-xSubtle);
--aegis-scrollbar-thumb-color-hovered: var(--aegis-color-foreground-xSubtle); /* or dedicated token */

.thumb {
  background-color: var(--aegis-scrollbar-thumb-color);
}
.thumb:hover {
  background-color: var(--aegis-scrollbar-thumb-color-hovered);
}
```

### 暫定対応（sandbox-builder 側）

`foreground-subtle` 自体は上書きせず、runtime 注入 CSS と export 用 CSS の両方で
ScrollArea / DataTable の scrollbar thumb hover のみ `foreground-xSubtle` に固定。
→ [tokens.ts](./token-overrides/tokens.ts) の `buildScrollAreaWorkaroundCss` 参照。
