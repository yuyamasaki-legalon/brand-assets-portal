# Download code

Customize theme で生成したトークンや CSS、Override Design Token の変更内容をファイルとしてダウンロードする機能。

---

## 起動方法

ツールバーの `</>`（コードアイコン）ボタンを押すと Generated Files ダイアログが開く。

---

## ダイアログの構成

4タブ構成。タブを切り替えるとその内容が表示される。
Design Tokens タブは直接編集可能で、内容を変更するとリアルタイムでプレビューとトークン生成に反映される。

| タブ | ファイル名 | MIME | 内容 |
|-----|----------|------|------|
| Page Layout | `page-layout.tsx` | text/plain | 現在のレイアウト設定から生成した React JSX コード |
| Theme CSS | `theme.css` | text/css | CSS カスタムプロパティとして展開したトークン |
| Design Tokens | `design-tokens.json` | application/json | ブランドトークンのオーバーライド定義 |
| Override Design Token | `override-design-token.css` | text/css | セマンティックトークンのパレット参照変更（差分のみ） |

ダウンロードボタンを押すと、現在表示中のタブの内容がファイルとして保存される。

---

## 各タブの詳細

### Page Layout（page-layout.tsx）

現在の Edit layout / Add content の状態から、コピペ即使用できる React JSX を生成する。

- `layout` レコードの ON/OFF に応じて各コンポーネント（`PageLayoutPane`・`PageLayoutSidebar` 等）を含む/省く
- `paneStartSettings` / `paneEndSettings` → `width` / `maxWidth` / `resizable` / `variant` に変換
- `sidebarStartSettings.sidebarWidth` → CSS カスタムプロパティ `--aegis-sidebar-content-inline-size` に変換
- `contentColumnSettings.sizing.contentWidth` → `style={{ maxWidth: "..." }}` に変換
- Add content で追加したコンポーネントは各エリアに `{/* ComponentName, ... */}` コメントとして列挙される

`buildPageLayoutJsxText()` が `useMemo` で生成するため自動更新される（直接編集は不可）。

---

### Theme CSS（theme.css）

`design-tokens.json` の内容を CSS カスタムプロパティに変換したもの。

```css
:root {
  --aegis-color-background-brand-bold: #1a3b8f;
  --aegis-color-background-brand-bold-hovered: #2b4a78;
  ...
}
```

`buildThemeCssText()` が `paletteText` と `designTokenText` から `useMemo` で生成するため、Design Tokens タブを編集すると自動更新される（直接編集は不可）。

---

### Design Tokens（design-tokens.json）

消費者が上書きするブランド関連トークンのみを収録。これが本番適用の成果物。

```json
{
  "BrandBackground": {
    "bold": "#1a3b8f",
    "bold.hovered": "#2b4a78",
    "bold.pressed": "#3f5b96"
  },
  "BrandForeground": {
    "default": "#ffffff"
  },
  "ThemeAccent": { ... },
  "BaseBackground": { ... },
  "BaseForeground": { ... }
}
```

Textarea を直接編集すると `designTokenText` ステートが更新され、プレビューにも即時反映される。

---

### Override Design Token（override-design-token.css）

セマンティックトークンがどのパレットスロットを参照するかの変更内容。
**変更があったトークンのみ**出力される。

カテゴリごとに 3つの Textarea で表示される:

```
background
--aegis-color-background-default: var(--aegis-palette-neutral-800);

foreground
（変更なし → 空）

border
--aegis-color-border-neutral: var(--aegis-palette-neutral-600);
```

Customize theme との合成については [override-design-token.md](./override-design-token.md) を参照。

---

## 編集可否まとめ

| タブ | 直接編集 | 備考 |
|-----|---------|------|
| Page Layout | 不可 | レイアウト設定・コンテンツ配置から自動生成 |
| Theme CSS | 不可 | `design-tokens.json` から自動生成 |
| Design Tokens | 可 | 編集すると Theme CSS・プレビューに即時反映 |
| Override Design Token | 不可 | Override Design Token ダイアログの変更内容を表示 |

---

## トークン生成の全体フロー

```
カラーエディタ操作
  ↓
updateBrandDesignTokenText()
  ↓ designTokenText を更新
buildThemeCssText(paletteText, designTokenText)
  ↓ useMemo で Theme CSS を再生成
buildTokenOverrideStyle(paletteText, designTokenText)
  ↓ CSS カスタムプロパティをリアルタイムで document.body に適用
```

Override Design Token の変更は別ルートで CSS 注入され、Theme CSS とは独立して合成される。

ダウンロード時は各ステートの最新値を Blob に変換してブラウザのダウンロードを発火させる（`URL.createObjectURL` + `<a>` クリック）。

---

## 補足

### design-tokens.json に含まれるもの

- ランタイム適用用の最終オーバーライドトークン
- `BrandBackground` や条件付きの `BrandForeground` など、計算済みの出力値

### design-tokens.json に含まれないもの

- 編集意図そのもの（Base Tone 選択、Chroma スライダー値など）
- Override Design Token の変更内容（こちらは Override Design Token タブに出力）

### 既知のギャップ

- `BrandForeground` を適用すべき対象コンポーネントはまだ完全には定義されていない
- 明るい BrandColor（400 / 500 など）のコントラスト条件はコンポーネント単位で検証が必要
- スクロールバー色はスコープ外で、生成トークンには含めていない
