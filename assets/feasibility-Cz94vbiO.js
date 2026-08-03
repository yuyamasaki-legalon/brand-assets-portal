var e=`# Palette Lab — Feasibility Study

> Step 1 of the Claude/Codex workflow.
> Author: Claude Sonnet (acting as Opus role)
> Date: 2026-05-06

---

## 1. Goal

OKLCH ベースのカラーパレット生成・管理・検証ツールを sandbox として構築する。
最終的なアウトプットは Aegis 本体の \`palette.json\` と差し替え可能な形式で出力することを前提とする。

参考 UI: [Atmos Playground](https://atmos.style/playground)

---

## 2. 既存資産の棚卸し（sandbox-builder から流用可能）

### 2-1. 流用確定

| ファイル | 流用内容 |
|---|---|
| \`token-overrides/color-utils.ts\` | \`OklchColor\` 型・\`hexToOklch\`・\`rgbToOklch\`・\`FIXED_LIGHTNESS\` マップ |
| \`token-overrides/palette.json\` | Aegis 現行パレットの初期データ（16 色族 × 10 トーン） |
| \`token-overrides/palette-config.json\` | 透過スケール alpha 値・primary 色族マッピング |
| \`token-overrides/palette-computer.ts\` | 透過スケール計算・primary スケール生成ロジック |
| \`token-overrides/contrast-utils.ts\` | WCAG コントラスト計算・\`ContrastPairDef\` 型 |

### 2-2. 部分流用（再利用するが独立コピーとして持つ）

- \`color-utils.ts\` の OKLCH 変換は逆方向（OKLCH → hex）が欠けているため拡張が必要
- \`contrast-utils.ts\` のコンポーネントリスト定義はそのまま使えるが、依存する token JSON をそぎ落として利用

### 2-3. 流用しない

- \`views/\` 配下の UI コンポーネント（sandbox-builder 固有の設計思想）
- \`design-token-overrides.ts\`（セマンティックトークン管理は今回スコープ外）

---

## 3. 新規に実装が必要なもの

### 3-1. 色変換（コア）

| 機能 | 状況 | 備考 |
|---|---|---|
| hex → OKLCH | **既存** | \`color-utils.ts\` に実装済み |
| OKLCH → hex | **未実装** | 逆変換 + sRGB gamut clamping が必要 |
| CSS \`oklch()\` 文字列 parse | **未実装** | インプット受付に必要 |

**OKLCH → hex の gamut 問題**
OKLCH は sRGB を超える色を表現できる。Chroma を下げながら sRGB 範囲内に収める「gamut clamping」が必要。
実装方法は二択：

| アプローチ | Pros | Cons |
|---|---|---|
| A. \`culori\` ライブラリ導入 | gamut mapping 含め battle-tested, 25 KB gzip | 新規 dependency |
| B. 自前実装（binary search on chroma） | 依存なし | 実装コスト + エッジケースリスク |

**推奨: A（culori 導入）**
理由: 既存の \`color-utils.ts\` は hex→OKLCH の片道のみ。逆変換の gamut handling は数値的に繊細で、自前実装のバグは「微妙にずれた色が出る」という発見しづらい種類のバグになる。sandbox での学習コストより品質を優先する。

### 3-2. データモデル

\`\`\`
PaletteProject
  id, name, createdAt, updatedAt
  colorFamilies: ColorFamily[]

ColorFamily
  id, name
  hueBase: number          // OKLCH H の基準値（0–360）
  chromaBase: number       // OKLCH C の基準値
  tones: ToneEntry[]

ToneEntry
  value: number            // 50, 100, 200, … (スケール番号)
  lightness: number        // OKLCH L (Aegis 仕様固定値 or 手動上書き)
  chroma: number           // ColorFamily の chromaBase から自動派生 or 手動
  hue: number              // ColorFamily の hueBase から自動派生 or 手動
  hex: string              // 計算済みキャッシュ（OKLCH→hex 変換結果）
\`\`\`

### 3-3. UI コンポーネント

| コンポーネント | 複雑度 | 備考 |
|---|---|---|
| パレット一覧（左サイドバー） | 低 | カラーファミリー名 + スウォッチ行 |
| トーンカーブエディタ | **高** | SVG ドラッグハンドル、Lightness/Chroma/Hue の 3 チャンネル |
| スウォッチ詳細パネル | 中 | OKLCH 値の直接編集 + hex 表示 |
| コントラストチェックパネル | 中 | WCAG ペアリスト + 合否バッジ |
| プロジェクト管理 | 低 | 作成・削除・切替 |
| Export ボタン | 低 | \`palette.json\` ダウンロード |

### 3-4. 状態管理

- React Context + useReducer で十分（外部状態管理ライブラリは不要）
- 自動保存先: \`localStorage\`（キー: \`palette-lab:projects\`）
- 容量上限: localStorage は ~5 MB。16 色族 × 10 トーン × プロジェクト数十個は問題ない

---

## 4. 技術トレードオフまとめ

### T-1: culori 導入の判断

**採用する。**

- OKLCH → sRGB gamut clamping の正確な実装が難しい
- \`culori\` は [CSS Color 4 spec](https://www.w3.org/TR/css-color-4/) 準拠、テスト済み
- bundle size: ~25 KB gzip（sandbox なので許容）
- 将来 Aegis 本体に取り込む際の実装参考にもなる

### T-2: カーブエディタのレンダリング

**SVG を採用する。**

- React の宣言的レンダリングとの相性が良い
- drag イベントは \`onPointerDown/Move/Up\` で十分実装可能
- アクセシビリティ（keyboard 操作）も付けやすい
- Canvas に比べてデバッグが容易

### T-3: Chroma の扱い

要件では「ChromaBase から自動派生 or 手動」という設計。
Atmos の UI を見ると、Chroma もトーンカーブで制御している。

**採用設計:**
- 各チャンネル（L/C/H）を「スケール全体の制御曲線」として保持
- 個別トーンの overwrite を別途持つ（\`overrides: Partial<ToneEntry>[]\`）
- override が存在しない場合はカーブから自動補間

### T-4: alpha（透過）システム

要件では「primary color 的な概念」として alpha を管理。
既存の \`palette-config.json\` に \`transparentScales\` と \`primaryScales\` の定義がある。

**採用設計:**
- Color Family に \`alphaMode: "none" | "transparent" | "primary"\` を持たせる
- "transparent": \`palette-computer.ts\` の \`computeTransparentScalesFromNeutral\` ロジックを流用
- "primary": \`buildSemanticPrimaryScaleForColor\` を流用

---

## 5. リスク評価

| リスク | 影響 | 対策 |
|---|---|---|
| culori の型定義が aegis-lab の TypeScript strict と合わない | 中 | 導入時に \`@types\` 確認。必要なら薄い wrapper を書く |
| トーンカーブ SVG の実装工数が膨らむ | 高 | MVP は「直接数値入力 + スウォッチプレビュー」のみで先行リリース。カーブ UI は Phase 2 |
| WCAG コントラストチェックの token 解決ロジックが複雑 | 中 | 既存 \`contrast-utils.ts\` を流用するが、 palette-lab 独自の簡易版（hex ペア直接計算）に留める |
| palette.json 出力形式が Aegis 本体と非互換 | 低 | 出力時に現行 \`palette.json\` のキー構造と完全一致させるテストを書く |

---

## 6. スコープ定義（推奨フェーズ分け）

### Phase 1 — MVP（Codex に渡すスコープ）

- カラーファミリー追加・削除
- トーン追加・削除
- Lightness スライダー（Aegis \`FIXED_LIGHTNESS\` をデフォルト値として使用）
- Chroma・Hue の直接数値入力
- スウォッチ一覧表示
- \`palette.json\` エクスポート
- localStorage 自動保存
- プロジェクト管理（作成・削除・切替）

### Phase 2 — カーブエディタ

- SVG トーンカーブ UI（Lightness / Chroma / Hue）
- ドラッグハンドルによる制御点操作

### Phase 3 — コントラストチェック

- WCAG AA/AAA 基準チェック
- Aegis コンポーネントとのペアリングビュー

---

## 7. 結論

**Phase 1 は実装可能。主な根拠:**

1. OKLCH 変換数学は既存コードに 70% 存在している（逆変換のみ culori で補完）
2. データモデルはシンプル（深いネストなし、Redux 不要）
3. UI の最重要パーツはスウォッチグリッドと数値スライダー（Aegis コンポーネントで組める）
4. 既存の palette.json が初期データとして使えるため「空白から作る」フェーズが不要

Phase 2 のカーブ UI は独立した複雑さを持つため、Phase 1 動作確認後に着手する。
`;export{e as default};