var e=`# Palette Lab におけるコントラストチェックの定義

Palette Lab のコントラストチェックは、Aegis を使用する前提で、foreground と background の組み合わせが適切なコントラストを満たしているかを確認するためのものです。

ここで扱う background は、単なる色の実数値ではなく、Aegis の semantic token と component state を基準に定義します。テーマ変更やダークモードでは実際の色値が変化するため、判定では token 名と、その token が最終的に描画される実効背景色の両方を考慮します。

## Background の種類

Palette Lab では background を大きく4種類に分けて扱います。

1. 環境背景（App Background）
2. ページ背景（Page Background）
3. UI背景（Surface Background）
4. UI in UI 背景（Nested Background）

## 環境背景（App Background）

環境背景は、アプリケーション全体の最背面にある背景です。

ライトモードでは基本的に白、つまり \`oklch(1 0 0)\` 相当です。Aegis token としては \`--aegis-color-background-default\` に近い扱いになります。

ダークモードでは黒系、たとえば \`oklch(0.2134 0 0)\` のような値に変化します。

この環境背景をどこで設定し、どの範囲に適用するかはダークモード実装時に重要になります。ただし、現時点の Palette Lab ではライトモードを前提とし、環境背景の切り替えは対象外とします。

## ページ背景（Page Background）

ページ背景は、PageLayout が提供する領域背景です。

Aegis では \`PageLayoutContent\`、\`PageLayoutPane\`、\`Sidebar\` などの領域に variant があり、それぞれの variant に応じて背景 token が決まります。

たとえば fill 系の領域では、\`neutral-xSubtle-opaque\` 系の背景が使われます。実値としては neutral-50 相当の見え方になりますが、コントラストチェック上は実数値ではなく、Aegis token として扱います。

ページ背景は、コンポーネントがまだ配置されていない状態のベース背景です。Surface Background や Nested Background は、このページ背景の上に重なります。

## UI背景（Surface Background）

UI背景は、Aegis コンポーネント自体が持つ背景です。

対象には、Button、ActionList、Card、Menu、Dialog、Sidebar、DataTable row などが含まれます。

これらの背景は、基本的にコンポーネントの \`variant\`、\`color\`、\`selected\`、\`disabled\`、\`pressed\` などの state によって決まります。Palette Lab では、任意の CSS 上書きではなく、Aegis が定義する component state の結果として描画される背景をチェック対象とします。

例として、neutral 系では以下のような state の変化があります。

- \`neutral.subtlest\`
- \`neutral.subtlest.hovered\`
- \`neutral.subtlest.pressed\`
- \`neutral.subtlest.selected\`
- \`neutral.subtle\`
- \`neutral.subtle.hovered\`
- \`neutral.subtle.pressed\`

UI背景のコントラストチェックでは、その背景上に載る text、icon、border、focus indicator などが十分なコントラストを持つかを確認します。

## UI in UI 背景（Nested Background）

UI in UI 背景は、Surface Background の中にさらに別の UI が配置されるケースです。

たとえば、Card の中に Button がある場合、Button の背景はページ背景の上ではなく、Card の背景の上に描画されます。同様に、ActionList の item、Menu item、Dialog 内の Button なども Nested Background として扱います。

ここで重要なのは、Aegis の background token には transparent 系と opaque 系があることです。

transparent 系の token は、親背景の影響を受けます。そのため、コントラストチェックでは token 単体の色ではなく、親背景と合成された実効背景色を基準に判定します。

つまり、同じ \`neutral.subtle\` でも、白背景の上にある場合と、\`neutral-xSubtle-opaque\` の上にある場合では、実際の見え方とコントラストが変わる可能性があります。

## コントラストチェックの判定対象

Palette Lab では、以下の組み合わせをコントラストチェックの対象とします。

- App Background 上の Page Background
- Page Background 上の text / icon / border
- Page Background 上の Surface Background
- Surface Background 上の text / icon / border
- Surface Background 上の nested component background
- Nested Background 上の text / icon / border
- selected / hovered / pressed / disabled など state 変化時の foreground と background

特に、state を持つ UI では通常時だけでなく、hovered、pressed、selected、disabled の各状態も確認対象とします。

## 判定時の前提

Palette Lab のコントラストチェックでは、以下を前提にします。

- 色の基準は raw color ではなく Aegis semantic token とする
- 実値が必要な場合は、最終的に描画される computed color を参照する
- transparent 系 background は親背景と合成した実効背景色で判定する
- component の背景は Aegis の variant / color / state によって決まるものとして扱う
- 独自 CSS による背景色の上書きは、原則として Aegis の正式な使用範囲外として扱う
- ダークモードは将来的な拡張対象とし、現時点ではライトモードを主対象とする

## まとめ

Palette Lab のコントラストチェックは、単純に「foreground と単一の背景色」を比較するものではありません。

Aegis の PageLayout、component variant、component state、transparent / opaque token、親背景との合成を踏まえ、最終的にユーザーが見る実効背景色に対して foreground が十分なコントラストを持つかを確認するものです。
`;export{e as default};