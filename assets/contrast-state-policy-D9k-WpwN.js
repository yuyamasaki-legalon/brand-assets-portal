var e=`# Palette Lab コントラストチェック: state background の扱い

## 前提

Palette Lab では、Aegis の semantic token / component state を前提に、foreground と background のコントラストを確認する。
このドキュメントは Aegis の既存 token および background 層の定義（contrast-definition.md）を周知の上で記述する。

主なリスクは、brand-bold や neutral-bold のような不透明な濃色背景ではない。これらは基本的に inverse foreground、つまり白文字・白アイコンを載せる前提で設計されているため、確認リスクは比較的低い。

主なリスクは、PageLayout fill や DataTable selected / checked row のような背景上に、transparent 系 background が重なるケースである。

## 達成目標

WCAG AA 準拠を目標とする。

| 対象 | 基準比 | 根拠 |
|------|--------|------|
| テキスト（通常サイズ） | 4.5:1 以上 | WCAG 2.1 1.4.3 |
| テキスト（大きいサイズ） | 3:1 以上 | WCAG 2.1 1.4.3 |
| UI コンポーネント / グラフィック | 3:1 以上 | WCAG 2.1 1.4.11 Non-text Contrast |
| focus indicator | 3:1 以上 | WCAG 2.1 1.4.11 Non-text Contrast |
| input の outline / border | 3:1 以上 | WCAG 2.1 1.4.11 Non-text Contrast |

## 重要な背景

### PageLayout fill

PageLayout fill のページ背景は \`--aegis-color-background-neutral-xSubtle-opaque\`。

### DataTable selected / checked row

DataTable の selected / checked row 背景は \`--aegis-color-background-neutral-subtlest-opaque-pressed\`。

DataTable selected / checked row は PageLayout fill より濃いため、この上に transparent 系 state が重なるケースは重要。

## 標準チェック対象

以下は恒久的、または継続的に表示される可能性があるため、標準チェック対象に含める。

- default
- hovered
- selected
- checked
- current
- focus-visible

> **disabled について**: WCAG 2.1 の 1.4.3 では disabled な UI コンポーネントはコントラスト要件の例外とされる。Palette Lab では disabled を標準チェック対象に含めない。ただし、入力不可であることが識別できる最低限の視認性を別途任意確認する。

> **focus-visible について**: focus-visible はテキストコントラスト（4.5:1）ではなく、Non-text Contrast（3:1）で評価する。

## pressed state の扱い

pressed はクリック中またはキー押下中に表示される、通常は一時的な state である。マウス操作では瞬間的だが、Space / Enter キーを押し続ける場合は継続して表示される。

アクセシビリティ上は確認対象に含めるべきだが、通常のエラー一覧に常時含めるとノイズになりやすい。キーボード操作において重要なのはフォーカス時（hovered 相当のスタイル）であり、pressed での僅かな基準未達は許容する選択肢を設ける。

そのため、pressed を通常エラーとして扱うか optional issue として扱うかを、チェックボックスで切り替えられるようにする。

## 推奨オプション

\`Treat pressed state as optional\`

日本語表示の場合は「pressed state を optional として扱う」。

初期値は ON を推奨する。

## ON のとき

\`Treat pressed state as optional\` が ON の場合、pressed に起因するコントラスト不足は optional issue として扱う。

標準のエラー一覧には含めない。

## OFF のとき

\`Treat pressed state as optional\` が OFF の場合、pressed に起因するコントラスト不足を通常のエラー一覧に含める。

対象例:

- Button pressed
- IconButton pressed
- ActionList item pressed
- clickable Tag pressed
- Card pressed
- Table / DataTable row pressed 相当

## Input 系 UI の outline / border コントラスト

TextField、Textarea、Select、Combobox、DatePicker、DateField、TimeField などの input 系 UI では、入力領域そのものを識別できる必要がある。

そのため、foreground / background のコントラストだけでなく、input の outline / border と隣接背景とのコントラストも確認対象に含める。

確認対象:

- default border
- hovered border
- focused border
- disabled border（任意確認）
- invalid / error border
- input background と Page Background の境界
- input background と Surface Background の境界

input 系 UI の枠線やアウトラインは、隣接する背景に対して 3:1 以上のコントラストを満たす必要がある（WCAG 2.1 1.4.11）。

特に以下の組み合わせを確認する。

- PageLayout fill 上の input border
- DataTable selected / checked row 上の input border
- Card / Dialog / Sidebar 内の input border
- disabled input の border（任意確認）
- invalid / error state の border
- focus-visible の outline / focus ring

focus-visible はキーボード操作時に現在位置を示すため、3:1 の確認対象として優先度が高い。

disabled input は WCAG のコントラスト要件の例外だが、入力不可であることが識別できる視認性を任意確認する。

## 重要なチェックケース

### PageLayout fill 上の transparent state

PageLayout fill: \`--aegis-color-background-neutral-xSubtle-opaque\`

Button subtle hovered: \`--aegis-color-background-neutral-subtle-hovered\`

### DataTable selected / checked row 上の transparent state

DataTable selected / checked row: \`--aegis-color-background-neutral-subtlest-opaque-pressed\`

Button subtle hovered: \`--aegis-color-background-neutral-subtle-hovered\`

Tag fill hovered: \`--aegis-color-background-neutral-subtle-hovered\`

### DataTable selected / checked row 上の pressed state

DataTable selected / checked row: \`--aegis-color-background-neutral-subtlest-opaque-pressed\`

Button subtle pressed: \`--aegis-color-background-neutral-subtle-pressed\`

Tag fill pressed: \`--aegis-color-background-neutral-subtle-pressed\`

この pressed ケースは、チェックボックスの設定に応じて扱いを切り替える。

## まとめ

Palette Lab のコントラストチェックでは、不透明な bold / solid 系背景よりも、transparent 系 background が複数レイヤーで重なるケースを重視する。

特に重要なのは以下。

- PageLayout fill 上の transparent component state
- DataTable selected / checked row 上の transparent component state
- hovered / selected / checked / focus-visible のように継続表示される state
- input 系 UI の outline / border と隣接背景のコントラスト

pressed は確認対象だが、標準エラーとして扱うか optional issue として扱うかをチェックボックスで切り替える。
`;export{e as default};