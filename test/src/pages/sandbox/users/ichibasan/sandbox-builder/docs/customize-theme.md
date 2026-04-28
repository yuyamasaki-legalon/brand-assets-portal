# Customize theme

Aegis のブランドカラートークンを GUI で編集し、CSS / JSON ファイルとしてエクスポートする機能。
**Hue（色相・彩度）** を担当する。Lightness（明度ベース）の調整は [Override Design Token](./override-design-token.md) が担当する。

---

## 起動方法

ツールバーの `Customize theme`（パレットアイコン）ボタンを押すと Customize theme モードになる。
End Pane 内に 4 枚のカラーカスタマイズカードが表示される。

---

## 4枚のカード構成

| カード | ID | 対象トークン |
|-------|-----|------------|
| BrandColor | `brandColor` | `BrandBackground` / `BrandForeground` |
| BrandAccentColor | `brandAccentColor` | `ThemeAccent`（background / foreground / border） |
| BaseColor Background | `baseColorBackground` | `BaseBackground`（neutral 系 20+ トークン） |
| BaseColor Foreground | `baseColorForeground` | `BaseForeground`（default / bold / subtle など） |

各カードにはトーンの色見本（スウォッチ）が横並びで表示され、現在の設定を視覚的に確認できる。

---

## カラーエディタ（ThemeCustomizationPopover）

各カードのスウォッチをクリックするとカラーエディタが開く。

### 共通フィールド

| フィールド | 内容 |
|-----------|------|
| HEX | 6桁の HEX カラー入力。入力した色が算出の起点になる |
| Base Tone | 入力した HEX がパレットのどのトーン（明度段）に相当するかを指定。HEX 入力時に自動推定される |
| Chroma | `All \| Custom` モード切り替え + 値入力 |

---

## HEX 入力後の算出フロー

### Step 1 — HEX を OKLCH に変換

入力された HEX を sRGB → Linear RGB → OKLab → OKLCH の順に変換し、`{ l, c, h }` を得る。

```
HEX → [R, G, B] → linear [rl, gl, bl]
  → OKLab [L, a, b]
  → OKLCH { l, c, h }
```

得られた `h`（Hue）が以降の全トーンで共有される。

### Step 2 — Base Tone の自動推定

変換で得た `l` に最も近い固定 Lightness のトーンを Base Tone として自動選択する。

| カード | 候補トーン |
|-------|----------|
| BrandColor | 900 / 800 / 700 / 600 / 500 / 400 |
| BrandAccentColor / BaseColor 系 | 900 / 800 / 700 / 600 |

BaseColor Background は例外で、その Hue で最も高い Chroma が出るトーンを自動選択する（`findMostColorSelectableLightness`）。

### Step 3 — Chroma の上限を計算

選択トーンの固定 Lightness と入力 Hue の組み合わせで sRGB ガマット内に収まる最大 Chroma を二分探索（24 回）で求める。

```
maxChroma = bisection(l_fixed, h) → sRGB ガマット内の上限値
```

これがスライダーの最大値になる。

### Step 4 — 参照カーブから各トーンの Chroma 比率を補間

Base Tone × 入力色の彩度の強さを元に、低彩度／高彩度の参照カーブ（`REFERENCE_CURVE_HEX`）から各トーンの Chroma 比率を線形補間する。

```
strength = clamp(maxChroma - lowTopChroma, 0, range) / range

chromaRatio[tone] = lowRatio[tone] + (highRatio[tone] - lowRatio[tone]) * strength
```

これにより、彩度が低い色（グレー寄り）はフラットなカーブ、彩度が高い色はメリハリのあるカーブになる。

### Step 5 — 全トーンの OKLCH 値を算出

```
color[tone] = oklch(
  l: lightnessCurve[tone],     // 参照カーブから補間した Lightness
  c: sliderValue × chromaRatio[tone] / 1000,  // Chroma モードで決まる値 × 比率
  h: baseColor.h               // 入力 HEX の Hue（全トーン共通）
)
```

#### Chroma モード別の `sliderValue`

| モード | c の決まり方 |
|-------|------------|
| All | スライダー値（全トーン共通）× そのトーンの chromaRatio |
| Custom | トーンごとに個別入力した値（上限は各トーンの maxChroma に clamp） |

### Step 6 — CSS 文字列化してスウォッチに反映

```
oklch(21.30% 0.1234 256.78)
```

形式で各トーンを文字列化し、スウォッチ表示とトークン生成に渡す。

---

## Lightness（固定値）

トーンごとの L 値は固定で変わらない。

| トーン | L (%) |
|-------|-------|
| 900 | 21.3 |
| 800 | 29.0 |
| 700 | 38.0 |
| 600 | 47.8 |
| 500 | 59.1 |
| 400 | 78.1 |
| 300 | 91.0 |
| 200 | 94.5 |
| 100 | 96.5 |
| 50 | 98.21 |

---

## カード別の算出の違い

### BrandColor

- モード: `brand`
- Base Tone 候補: 900〜400（6段）
- パレット生成後、`BRAND_LIGHTNESS_MAP` に従い `bold / hovered / pressed` の 3 値を抽出してトークンに渡す

```
// Base Tone = 800 の場合
bold        → tone 800
bold.hovered → tone 700
bold.pressed → tone 600

// Base Tone = 500 の場合（明るい色）
bold        → tone alt500（L=67%）
bold.hovered → tone 400
bold.pressed → tone 300
```

BrandForeground は Base Tone が 500 / 400 のとき `default` が白系に切り替わる（高明度背景に合わせたコントラスト確保）。

### BrandAccentColor

- モード: `base`
- Base Tone 候補: 900〜600（4段）
- 全トーン（900〜50）のパレットから `ThemeAccent` の background / foreground / border 系トークン 20+ を自動生成する

### BaseColor Background

- モード: `base`
- Base Tone は自動（その Hue で最も高い Chroma が出るトーンを自動選択）
- 選択ソース（Neutral / BrandColor 系 / Custom）に応じたパレットを使い、各トークンを transparent（alpha 値）または solid（50 / 100 / 200）で生成する

```
例）neutral.xSubtle → rgba(パレット900の RGB, 0.04)
    neutral.subtle.opaque → パレット100の solid カラー
```

### BaseColor Foreground

- モード: `base`
- Base Tone 候補: 900〜600（4段）
- パレットの上位 5 トーン（900〜500）を `default / bold / pressed / subtle` などの foreground トークンにマッピングする

---

### Preview

エディタ内には編集中のカラーを使った UI プレビューが表示される。

| カード | プレビュー内容 |
|-------|--------------|
| BrandColor | ブランドカラーのみ適用したボタン・バッジ等 |
| BrandAccentColor | 全体のアクセントカラーを適用した UI |
| BaseColor Background | 背景色系トークンの適用例 |
| BaseColor Foreground | テキスト・アイコン色の適用例 |

---

## BaseColor の選択ソース

BaseColor Background / Foreground カードでは、色のソースを選択できる。

| 選択肢 | 内容 |
|-------|------|
| Neutral | Aegis デフォルト（グレー系固定値） |
| None | トークンを生成しない |
| Use BrandColor | BrandColor パレットをベースにする |
| Use BrandColor xSubtle | BrandColor の薄い版をベースにする |
| Use BrandAccentColor | BrandAccentColor パレットをベースにする |
| Use BrandAccentColor xSubtle | BrandAccentColor の薄い版をベースにする |
| Custom | 独自の HEX で作成したカスタムパレットをベースにする |

選択ソースを変更するとトークン値がリアルタイムで再計算される。

---

## トークン生成ルール

### BrandBackground

BrandColor の Base Tone 選択から 3 値を生成:

```
bold        → 選択トーンの solid カラー
bold.hovered → 1段明るいトーン
bold.pressed → 2段明るいトーン
```

### BrandForeground

Base Tone が 500 / 400 のとき `default` が白系（inverse）に切り替わる。それ以外は暗色。

### ThemeAccent（BrandAccentColor）

BrandAccentColor のパレットから background / foreground / border の 20+ トークンを自動生成。
`internal.color.palette.scale.themeAccent` → 各意味トークンへ参照で展開される。

### BaseBackground / BaseForeground

選択したソースパレットから transparent（alpha 指定）または solid（50 / 100 / 200 の特定トーン）でトークンを生成。

---

## 状態の永続化

テーマカスタマイズの編集状態は `sessionStorage` に自動保存される。

- キー: `sandbox-builder-theme-customization-state`
- ページリロード後も編集内容が復元される
- ブラウザタブを閉じるとリセットされる

---

## スクロールバー色の既知問題

`foreground-subtle` をスクロールバーの hover 色に使用しているため、`BaseForeground.subtle` を変更するとスクロールバーの色も意図せず変わる。

**sandbox-builder 側の暫定対応:** `foreground-subtle` 自体は上書きせず、runtime 注入 CSS と export 用 `theme.css` の両方で ScrollArea / DataTable の scrollbar thumb hover だけを `foreground-xSubtle` に固定している（[token-overrides/tokens.ts](../token-overrides/tokens.ts) 参照）。

**根本対応:** Aegis 本体でスクロールバー専用トークンを分離する必要がある（[MEMO.md](../MEMO.md) 参照）。

---

## Lint 例外の扱い

`token-overrides/color-scheme-neutral-light.module.css` は auto-generated file であり、sandbox-builder のテーマ基盤を `body` の scope class として適用するための生成物である。

このファイルでは semantic token を palette ベースで再配線する都合上、`--aegis-internal-*` を意図的に参照している。そのため stylelint の `aegis/no-internal-tokens` はこのファイルに限って例外扱いとする。

重要なのは、warning を消すために手で public token へ書き換えないこと。ここを手修正すると、次の整合が壊れる可能性がある。

- Customize theme の preview 反映
- Override Design Token との優先関係
- Contrast Check の runtime 表示との一致
- export される `theme.css` との一致

運用ルール:

- このファイルは手編集しない
- Aegis 更新時は生成元ロジックと出力結果を確認し、必要ならファイル全体を再生成・差し替えする
- 例外理由を変えるときは、このドキュメントとファイル先頭の stylelint コメントをセットで更新する
