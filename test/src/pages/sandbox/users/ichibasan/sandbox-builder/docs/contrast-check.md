# Contrast Check

現在の override 状態で WCAG 2.2 の考え方に基づくコントラスト比を一括チェックする機能。
Token Editor とは独立した Dialog として提供される。

---

## 起動方法

2 つのトリガーから開くことができる。

| トリガー | 表示条件 | アイコン |
|---------|---------|---------|
| CommandBar（グローバルツールバー右から2番目） | 常時表示 | `LfSetting` |
| ModeBar（テーマ編集モード） | `Customize theme` モード中のみ表示。Token Editor ボタンの右隣 | `LfSetting` |

> CommandBar はテーマ編集モードに入ると非表示になるため、テーマ編集中も Contrast Check にアクセスできるよう ModeBar にも配置している。

---

## ダイアログの構成

`Dialog` コンポーネント（`width="full"`、高さ 80vh）で表示される。テーブルが横長になるため Drawer ではなく Dialog を採用。

---

## コンポーネント切り替え

SegmentedControl (solid) でコンポーネントを絞り込む:

```
[ All | Accordion | ActionList | Avatar | Badge | Banner | ... ]
```

選択中のコンポーネントに関連するトークンペアのみテーブルに表示される。`All` は全ペアの明細ではなく、コンポーネント別の Pass / Fail / Total / Fail rate サマリーを表示する。

### 現在のグルーピングルール

- `TextField` と `TagPicker` は `Input` として 1 つのタブに統合する
- `Markdown Content` は markdown / rich text 領域の本文系テキストをまとめて扱う便宜的なグルーピング名とする
- `IconButton` は一覧対象から外す
  `Button` のほうが使用バリエーションが多く、実運用上のチェック観点を包含するため

---

## Pass / Fail サマリー

テーブル上部に現在の絞り込み結果における合否件数を表示する。

```
Pass: 42　Fail: 3
```

Fail が 1 件以上ある場合、**「Fail only」ボタン**が表示される。クリックすると不合格行のみに絞り込む（再度クリックで解除）。

`Fail only` は個別コンポーネントの詳細表示で使う。`All` サマリー表示では件数集計のみを示す。

---

## チェックケースマトリクス

各コンポーネントのコントラストチェックは以下の 3 次元の組み合わせで展開される。

```
pageBg × containerBg × componentState
```

### pageBg（ページ背景）

コンポーネントが置かれるページ全体の背景。

| pageBg | 用途 |
|--------|------|
| `background-default` | 通常ページ |
| `background-neutral-xSubtle-opaque` | ペインフィル（サイドペイン・セクション背景など） |

### containerBg（コンテナ背景）

コンポーネントの直接の親要素の背景。下記の「コンテナ背景一覧」を参照。

### componentState（コンポーネント状態）

コンポーネント自身のインタラクション状態。コンポーネントごとに定義する。

**例: Button の場合**

```
default / hovered / pressed
```

**例: Badge などインタラクションのないコンポーネント**

```
default（1種のみ）
```

---

## container state とコンポーネント state の関係

containerBg が state variant（`-hovered` / `-pressed` / `-selected` suffix あり）の場合、
その上のコンポーネントは **default 状態のみ** チェックする。

**理由**: 親コンテナがホバー・プレス状態にあるとき、その上のコンポーネントは操作対象ではなく
デフォルト外観を維持するため。

```
例: neutral-xSubtle-hovered → button default     ← チェック対象
例: neutral-xSubtle-hovered → button hovered     ← 発生しないケース（除外）
```

containerBg が base state（suffix なし）の場合は componentState を全種展開する。

```
例: neutral-xSubtle → button default / hovered / pressed（全展開）
```

---

## コンテナ背景一覧

Button など各コンポーネントが実際に置かれうる containerBg の全リスト。

| containerBg | 透過 | state variant | button state 展開 |
|---|---|---|---|
| `default` | なし（不透明） | なし | 全状態 |
| `neutral-xSubtle` | あり | なし | 全状態 |
| `neutral-xSubtle-hovered` | あり | -hovered | default のみ |
| `neutral-xSubtle-pressed` | あり | -pressed | default のみ |
| `neutral-xSubtle-selected` | あり | -selected | default のみ |
| `neutral-subtlest-opaque` | なし | なし | 全状態 |
| `neutral-subtlest-opaque-hovered` | なし | -hovered | default のみ |
| `neutral-subtlest-opaque-pressed` | なし | -pressed | default のみ |
| `neutral-subtlest-opaque-selected` | なし | -selected | default のみ |
| `neutral-xSubtle-opaque` | なし | なし | 全状態 |
| `neutral-subtle-opaque` | なし | なし | 全状態 |
| `danger-subtle` | なし | なし | 全状態 |

### pageBg 展開ルール

| containerBg の種別 | pageBg |
|---|---|
| `default`（不透明） | `default` のみ（1ケース） |
| それ以外の全コンテナ | `default` + `neutral-xSubtle-opaque`（2ケース） |

透過コンテナ（`neutral-xSubtle` 系）は pageBg によって合成後の色が変わるため両方確認する。
不透明コンテナも pageBg 差異の影響は出ないが、マトリクスの網羅性のため両方展開する。

> `neutral-xSubtle-opaque-hovered` / `-pressed` / `-selected` は Aegis に存在しないトークンのため除外。

> `Switch` は実運用上 `button in button` を避けるため card / action 系 UI に含めず、通常ページまたは pane fill に単独配置する前提とする。そのため containerBg は `default` と `neutral-xSubtle-opaque` の 2 ケースだけを使う。内部コントラストのチェックはそのまま残す。

> `CheckboxCard` の checked 状態は `surface + border` の複合表現として扱う。card 内の foreground は selected surface に対して確認し、環境背景に対する識別は selected border で確認する。`Input` の「内部は field surface、外側は border」で見る考え方にそろえる。

> `Calendar` の selected day は generic な `selected-bold` ではなく、Aegis 実装に合わせて `information-bold` の active cell として確認する。

> `Button` は variant ごとに識別責務を分けて扱う。`solid` は面が識別の主役なので label と own background に加えて surface と環境背景の non-text contrast も確認する。`subtle` は文字ラベルが識別の主役で、面は補助的な階層表現として扱うため、label と own background だけを確認し、surface と環境背景の non-text contrast は見ない。`plain` は文字のみ、`gutterless` は文字中心で確認する。`inverse` は internal pair も含めて `INVERSE_PLACEMENT_BGS` 上で評価する。

> `FileDrop` は surface の淡い fill を補助表現として扱う。環境背景に対する識別は default / drag-active の border を代表要素として確認し、surface 単体の container contrast は見ない。

> `ProgressBar` は loading / status indication の bar 本体を主要要素として扱う。補助的な track の container contrast は見ず、information / danger / disabled の bar 本体だけを確認する。

> `ProgressCircle` は determinate な進捗表示ではなく loading spinner として扱う。状態を伝える主要要素は回転する indicator のみとし、補助的な track の container contrast は見ない。

> `StatusLabel` は status text を読むためのコンポーネントとして扱う。実務上の判定は foreground text を環境背景に対して確認することを優先し、fill の面色や outline の border は見ない。

> `Mark` は本文中のハイライト装飾として扱う。`background` / `underline` の全 variant を foreground text 中心で確認し、`withText` のように内包 `Text` が `accent.*.subtle` に変わるパターンも含める。補助的なハイライト背景や下線の container contrast は見ない。環境ケースは `default` と `neutral-xSubtle-opaque` の 2 つだけを使う。

> `Tag` は `icon` / `text` / `closebutton` が同一 foreground で設計される前提で扱う。実務上の判定は foreground の 4.5:1 を優先し、fill / outline の border や surface の non-text contrast は見ない。`inverse` だけは背景が transparent 系のため、`INVERSE_PLACEMENT_BGS` 上で評価する。

> `ActionList` は text によって内容が識別されるコンポーネントとして扱う。行の background は補助的なフィードバックに留まる前提で、実務上の判定は foreground text を優先する。環境ケースは `default` と `neutral-xSubtle-opaque` の 2 つだけを使い、default 行面や hover / pressed surface の non-text contrast は見ない。

> `Stepper` はステップ名の text で内容が識別されるコンポーネントとして扱う。丸いマーカーの surface は補助的な表現に留まる前提で、実務上の判定はステップ名 text と丸の中の icon / number を優先する。`icon-container` の surface と環境背景の non-text contrast は見ない。

### inverse 配置の制限

inverse 系のケースは使用環境を限定してチェックする。現在の実装では、inverse を持つコンポーネントの配置先 containerBg は以下のケースのみ。

- `background-brand-bold`
- `background-neutral-bold`
- `Banner large` の背景
  `background-information-bold` / `background-success-bold` / `background-danger-bold`

`warning` は `Banner large` でも inverse を使わないため、この環境ケースには含めない。

`Banner large` は token 直接指定ではなく、「Banner large 背景」という意味単位の環境ケースとして扱う。将来的に背景 token が変わっても、この環境定義を更新する前提とする。

このルールは、`Button` / `Link` / `Badge` / `Tag` / `Text` / `Icon` など、foreground や surface に inverse を持つコンポーネントへ適用する。

これは実 UI で inverse を使う場面が限定的であり、想定外の配置で母集団を膨らませないため。

---

## 透過背景の合成ルール

透過トークンが複数重なる場合、実際のレンダリングに合わせて全層を順に合成してからコントラスト比を計算する。

```
pageBg（不透明）
  → containerBg（透過の場合は pageBg の上に合成）
    → UI 要素の色（透過の場合は合成済み containerBg の上に合成）
```

**例: default → neutral-xSubtle（透過） → background-brand-bold（不透明）**

1. `background-default`（白）を基底として確定
2. `neutral-xSubtle`（`neutral-transparent.50`）を白の上に合成 → 実効 RGB を得る
3. `background-brand-bold`（不透明）を合成済み RGB と比較

**例: default → neutral-xSubtle（透過） → background-neutral-subtle（透過）**

1. `background-default`（白）を基底として確定
2. `neutral-xSubtle` を白の上に合成 → 合成済み containerBg RGB
3. `neutral-subtle`（`neutral-transparent.100`）を合成済み containerBg の上に合成 → 実効 RGB を得る
4. その値と前景色を比較

この合成は `resolvePaletteRef(ref, overBg)` により各ステップで行われる。

---

## チェック対象の WCAG 基準

| 基準 | 要件 |
|-----|------|
| SC 1.4.3（通常テキスト） | 4.5:1 以上 |
| SC 1.4.11（非テキスト） | 3:1 以上 |

現在の Contrast Check では `text-normal` と `non-text` の 2 種を使用する。`large text` の 3:1 判定は現行 spec では使っていない。

### 運用ルール

- `Button` の label は `text-normal` として 4.5:1 で判定する
- `IconButton` の foreground も運用上は `Button` と同じ 4.5:1 で扱う
  ただし一覧 UI では `IconButton` を独立表示しない

---

## ペアの種類（Type A / Type B）

### Type A — internal pair（コンポーネント内部）

コンポーネント自身の fg と bg のコントラスト。コンテナに依存しない。

```
例: foreground-inverse / background-brand-bold（Button solid の label vs 背景）
```

`ContrastPairDef.previewKind = "internal"` で識別。
プレビューの外層は常に `background-default`（ページ背景として固定）。

### Type B — container pair（コンテナに対する可視性）

コンポーネントの fg / bg / border がコンテナ背景に対して十分に見えるかを確認。
containerBg × pageBg × componentState のマトリクスで展開される。

```
例: background-brand-bold（button 面） / background-neutral-xSubtle（コンテナ）
```

---

## override の反映優先順位

コントラスト計算はトークン値を以下の優先順位で解決する:

```
componentOverrides[component][category][key]
  → overrides[category][key]（global override）
    → DEFAULT_TOKEN_REFS[category][key]（Aegis デフォルト）
```

Token Editor の Token map で設定したコンポーネント専用値がコントラスト計算に正確に反映される。

---

## テーブル列

| 列 | 内容 |
|----|------|
| Preview | pageBg → containerBg → UI 要素の 3 層サムネイル |
| Layers | チェック対象のトークンペア（前景 / 背景 / ページ背景） |
| Variant / State | バリアントや状態（hovered, focused, error 等） |
| Criterion | 適用する WCAG 基準 |
| Contrast ratio | 算出されたコントラスト比と Pass / Fail |

### Preview サムネイル（80×48px）

Preview は token swatch ではなく、以下の 3 層でコンポーネントを疑似再現する。

```text
<background page>
  <background>
    <UI>
      <label>
      </label>
    </UI>
  </background>
</background page>
```

Preview 全体に共通の装飾枠線は持たせない。本来のコンポーネントに存在しない border や outline を足さず、UI 要素自身が持つ surface / border / label だけを表示する。

| 条件 | UI 要素の表示 |
|-----|-------------|
| Type A (internal) | 外層 = background-default、内層 = 自身の bg、「Aa」ラベル |
| Type B text | 角丸レクト（uiBg）+ 「Aa」ラベル（前景色） |
| Type B non-text × border fg | 2px ボーダーの角丸レクト |
| Type B non-text × background fg | 前景色で塗りつぶしたピル |
| Type B non-text × foreground fg | 小さな円形グラフィック |

3 層構成（pageBg あり）の場合:

```
[外層: pageBg] → [中層レクト: containerBg] → [UI 要素]
```

#### コンポーネント別ルール

- `Input` は入力面の background と border を表示する。label は font color を表示する。
- `Button` は button surface と label を表示する。button 自身に border がない variant では border を足さない。
- `Switch` は button 系と同様に border を持たないため、surface と label だけを表示する。
- その他のコンポーネントも同様に、本来ない border は追加しない。

---

## Token Editor との連携フロー

1. Token Editor → Token map タブでコンポーネントの override を設定
2. Contrast Check を開いてそのコンポーネントを選択
3. 変更後の値でコントラスト比を確認
4. 必要に応じて Token Editor に戻して値を調整

---

## 実装メモ

### ContrastPairDef

```ts
interface ContrastPairDef {
  id: string;
  label: string;
  criterion: ContrastCriterion;
  fg: { category: DesignTokenOverrideCategory; key: string };
  bg: { category: "background"; key: string };
  pageBg?: { category: "background"; key: string };  // 3層プレビュー用
  stateLabel?: string;
  component?: string;
  previewKind?: "internal" | "container";
}
```

### ContainerPairSpec（Type B 定義）

```ts
interface ContainerPairSpec {
  stateLabel?: string;
  fg: { category: DesignTokenOverrideCategory; key: string };
  criterion: ContrastCriterion;
  containerBgs?: readonly string[];
  /**
   * コンポーネント state ごとの fg token list。
   * 定義した場合、containerBg に state suffix があれば state="default" のみ展開。
   * 未定義の場合は従来通り 1 ペアのみ生成。
   */
  componentStates?: ReadonlyArray<{
    state: string;
    fg: { category: DesignTokenOverrideCategory; key: string };
  }>;
}
```

### generateContrastPairs の展開ロジック

```
for each containerPairSpec:
  for each containerBg in containerBgs:
    hasStateSuffix = containerBg ends with -hovered/-pressed/-selected
    states = hasStateSuffix ? ["default"] : componentStates（全 state）
    for each state:
      for each pageBg in PAGE_CONTEXT[containerBg]:
        → emit 1 ContrastPairDef
```
