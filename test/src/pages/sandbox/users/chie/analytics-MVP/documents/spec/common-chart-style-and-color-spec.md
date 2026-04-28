# Common Chart Style And Color Spec

このドキュメントは、analytics-MVPの全画面・全タブ・全カードで使用するグラフ（rechartsベース）の共通スタイル・色仕様・コンポーネント利用ルールをまとめたものです。
プロトタイプ現物（http://localhost:5173/sandbox/chie/analytics-MVP）と完全に一致するUI・配色・ラベル・レイアウトをAI実装や自動生成で再現するための仕様書です。
適用範囲：全グラフ種別（横棒・縦棒・円・折れ線）、凡例・ツールチップ・ラベル・色トークン、Aegisデザインシステム準拠のスタイリング。


## スタイリング仕様（共通）
### グラフスタイリング仕様（recharts）

- レポート機能で使っているグラフの recharts スタイリング仕様をまとめたドキュメントです。AI に渡して「同じスタイルのグラフ」を recharts で再現するための仕様として利用します。

- **ライブラリ**: recharts を前提とします。
- **共通コンポーネント**: CustomXAxisTick, CustomYAxisTick, renderCustomLegend, VerticalBarWithDivider, HorizontalBarWithDivider, BadgeLabel, RightLabel, TopLabel を共通チャートコンポーネントとして利用します。

---

## 共通ルール

- **ResponsiveContainer**
   - `width="100%"`
   - 高さは用途別に指定（後述の各グラフ種別を参照）
- **CartesianGrid**
   - `vertical={false} horizontal={false} stroke="#e2e8f0"`
- **ツールチップ**
   - 基本設定: `wrapperStyle={{ outline: "none", transition: "none" }}`, `animationDuration={0}`
   - 外枠 border: `1px solid rgba(0, 0, 0, 0.116)`（Aegis token: border/default）
   - border-radius: `4px`（Aegis token: round-medium）
   - box-shadow: `inset 0 0 0 1px var(--aegis-color-border-default), var(--aegis-depth-medium)`（border 1px、Aegis token: shadow-middle）
   - テキスト色: `#2E2E2E`（Aegis token: foreground/default）
   - フォントサイズ: `var(--aegis-font-size-body-small)`（実装値: `12px`）
   - 区切り線（divider）: `var(--aegis-border-width-thinPlus) solid rgba(0, 0, 0, 0.116)`（実装値: `1px solid rgba(0, 0, 0, 0.116)`）
   - 色インジケーター: 凡例と同じ四角（`10x10`、borderRadius: `var(--aegis-radius-small)`（実装値: `2px`））。ひし形の場合は `transform: rotate(45deg)`
- **ツールチップ内の表示形式**
   - 行レイアウト: 左（ラベル）・右（値）、`justifyContent: "space-between"` で右寄せ
   - 主・副表示: 「名前 主:x 副:y」
     - 左: ラベルのみ
     - 右: 「主:x 副:y」（数値は太字）
   - 今年・昨年表示: 「名前 今年:x 昨年:y」
     - 左: ラベルのみ
     - 右: 「今年:x 昨年:y」（数値はノーマル。表記は「昨年」を使用）
   - 合計数（主・副表示）
     - 「合計数」のみの行は非表示
     - 1行で「合計数 主:x 副:x」を表示
     - 左: 「合計数」（太字）
     - 右: 「主:x 副:x」（数値は太字）
   - 合計数（今年・昨年表示）
     - 左: 「合計数」（太字）
     - 右: 「今年:x 昨年:y」（数値はノーマル）
- **凡例**
   - `Legend content={renderCustomLegend(...)}`
   - 凡例コンテナ（`renderCustomLegend` 内）
     - `display: "flex"`
     - `flexWrap: "wrap"`
     - `justifyContent: "center"`
     - `columnGap: "var(--aegis-space-medium)"`
     - `rowGap: "var(--aegis-space-xSmall)"`
     - `paddingTop: "var(--aegis-space-medium)"`（実装値: `16px`）
   - 各項目: アイコン（10x10、四角/円/ひし形） + `marginRight: "var(--aegis-size-x4Small)"`（実装値: `6px`） + テキスト（`variant="body.small"`, color `#000`）
   - 一部カード: `Legend` に `wrapperStyle={{ marginBottom: 0 }}` を指定

---

## 横棒グラフ（BarChart layout="vertical"）

- **使用箇所**: 進行中の案件状況、リードタイム構成、パフォーマンス概要カード。

### スタイル値

- **margin**: `{ right: 16 }`（`right: var(--aegis-space-medium)`、他は未指定で 0）。
- **barCategoryGap**: `var(--aegis-space-medium)`（実装値: 16px）
- **barSize**: `var(--aegis-size-xxLarge)`（実装値: 32px）
- **barGap**: `var(--aegis-space-xxSmall)`（実装値: 4px、主担当・副担当の間）
- **XAxis**: `type="number"`, `domain={[0, maxValue]}`, `hide`
- **YAxis**: `type="category"`, `dataKey="name"`, `width={160}`, `axisLine={false}`, `tickLine={false}`, `tickMargin={0}`, `tick={<CustomYAxisTick ... />}`, `interval={0}`
- **CartesianGrid**: `horizontal={false} vertical={false} stroke="#e2e8f0"`
- **高さ**: 親に `style={{ height: calculatedHeight }}` を設定し、`ResponsiveContainer height="100%"` とする。

### グラフエリアの高さ（凡例を加味）

- `marginHeight = 24 + 24`（`top/bottom: var(--aegis-space-large)`）
- `xAxisHeight = 22`（tickMargin + tick の高さ）
- `legendHeight`: 初期値 25px、または `.recharts-legend-wrapper` を ResizeObserver で計測して動的取得
- `fixedElementsHeight = marginHeight + xAxisHeight + legendHeight`
- `baseRowHeight`: 主担当のみ `var(--aegis-size-xxLarge)`（32px）、主担当+副担当のとき `32*2 + 4 = 68` px
- `gapHeight = barCategoryGap`（`var(--aegis-space-medium)` / 16px）
- `calculatedHeight = rowCount * baseRowHeight + Math.max(0, rowCount - 1) * gapHeight + fixedElementsHeight`
- 親: `style={{ height: Math.max(240, calculatedHeight), maxHeight: "640px", overflowY: "auto", ... }}`

### 積み上げのセグメント間 1px

- Bar の `shape` に `HorizontalBarWithDivider` を使用。
- `gap={1}`（`barSegmentGap = var(--aegis-border-width-thinPlus)` / 1px）。`hasValueBefore` / `hasValueAfter` で隣セグメントの有無を渡す。上側（または左側）に隣があるときのみ高さ（または幅）を 1px 減らし、白線は描かず余白のみで区切る。

### Bar の角丸

- 横棒では `radius={[leftTop, rightTop, rightBottom, leftBottom]}`。左端のみ丸め: `[8, 0, 0, 8]`（`var(--aegis-radius-large)`）または `[4, 0, 0, 4]`（`var(--aegis-radius-medium)`）、右端のみ: `[0, 8, 8, 0]` または `[0, 4, 4, 0]`、両端: `[8, 8, 8, 8]` または `[4, 4, 4, 4]`、中間: `[0, 0, 0, 0]`。カードにより 4 または 8 を使用（進行中の案件状況は 8、パフォーマンス概要は 4）。

### セグメント上の数字

- 各 `Bar` に `<LabelList dataKey="..." content={...} />` で BadgeLabel を渡す。セグメント中央に数値（fontSize 11、bold、badgeVariant で白/黒・背景の有無）。値が 0 のときは表示しない。

### 合計値をバーの外側に配置

- 横棒ではバーの**右外側**に合計。各 stack の**最後の** Bar に、`isLast` のときだけ `<LabelList content={...} />` を追加し、`RightLabel` に `value={total}`, `dataKey="案件数"`, `offset={8}`（`var(--aegis-space-xSmall)`）を渡す。RightLabel は `rightX = x + width + offset`、fontSize 12、fontWeight bold。

### recharts での実装例（横棒）

```tsx
// 高さ計算（親コンポーネント内）
const barCategoryGap = 16;
const barSize = 32;
const barGap = 4;
const barSegmentGap = 1;
const baseRowHeight = assigneeFilterMode === "both" ? barSize * 2 + barGap : barSize;
const gapHeight = barCategoryGap;
const marginHeight = 24 + 24;
const xAxisHeight = 22;
const fixedElementsHeight = marginHeight + xAxisHeight + legendHeight;
const rowCount = chartData?.length ?? 0;
const calculatedHeight =
  rowCount * baseRowHeight + Math.max(0, rowCount - 1) * gapHeight + fixedElementsHeight;

<div style={{ height: Math.max(240, calculatedHeight), maxHeight: "640px", overflowY: "auto" }}>
  <ResponsiveContainer width="100%" height="100%">
    <BarChart
      data={chartData}
      layout="vertical"
      margin={{ right: 16 }}
      barCategoryGap={barCategoryGap}
      barSize={32}
      barGap={4}
    >
      <CartesianGrid horizontal={false} vertical={false} stroke="#e2e8f0" />
      <XAxis type="number" domain={[0, actualMaxCaseCount]} hide />
      <YAxis
        type="category"
        dataKey="name"
        width={160}
        interval={0}
        axisLine={false}
        tickLine={false}
        tickMargin={0}
        tick={(tickProps) => <CustomYAxisTick {...tickProps} /* ... */ />}
      />
      <RechartsTooltip
        wrapperStyle={{ outline: "none", transition: "none" }}
        animationDuration={0}
        cursor={{ fill: "#f1f5f9" }}
      />
      <Legend content={renderCustomLegend({ /* caseStatusView, locale, ... */ })} />
      {/* 各 Bar: shape=HorizontalBarWithDivider, gap={barSegmentGap}, hasValueBefore, hasValueAfter, radius */}
      <Bar
        dataKey="category_main"
        stackId="0"
        fill={/* 配色は本ファイルの「色仕様（共通）」を参照 */}
        shape={(barProps) => {
          const hasValueBefore = /* ... */;
          const hasValueAfter = /* ... */;
          return (
            <HorizontalBarWithDivider
              {...barProps}
              gap={barSegmentGap}
              hasValueBefore={hasValueBefore}
              hasValueAfter={hasValueAfter}
              radius={[
                !hasValueBefore ? 4 : 0,
                !hasValueAfter ? 4 : 0,
                !hasValueAfter ? 4 : 0,
                !hasValueBefore ? 4 : 0,
              ]}
              barBorder={/* ... */}
            />
          );
        }}
      >
        <LabelList
          dataKey="category_main"
          content={(props) => (
            <BadgeLabel {...props} dataKey="category_main" badgeVariant="no-bg-black-text" />
          )}
        />
        {isLast && (
          <LabelList
            content={(props) => {
              if (props.index === undefined) return null;
              const rowData = chartData?.[props.index];
              const total = /* rowData から合計を計算 */;
              if (total === 0) return null;
              return <RightLabel {...props} value={total} dataKey="案件数" offset={8} />;
            }}
          />
        )}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
</div>
```

- CustomYAxisTick, HorizontalBarWithDivider, BadgeLabel, RightLabel, renderCustomLegend は共通チャートコンポーネントとして利用。

---

## 縦棒グラフ（BarChart 月次）

- **使用箇所**: 新規案件数・完了案件数（月次）、パーソナル納期別・案件タイプ別など。

### スタイル値

- **ResponsiveContainer**: `height={360}`（Pane 内は 360 の定数を使用する場合あり）
- **margin**: `{ top: 16, right: 24, bottom: 0 }`（`top: var(--aegis-space-medium)`, `right: var(--aegis-space-large)`）または `{ top: 28, right: 24, left: 24, bottom: 16 }`（カード・Pane により異なる）
- **XAxis**: `allowDecimals={false}`, `dataKey="name"`, `axisLine={false}`, `tickLine={false}`, `tickMargin={10}`, `tick={<CustomXAxisTick ... />}`
- **YAxis**: `hide`
- **CartesianGrid**: `vertical={false} horizontal={false} stroke="#e2e8f0"`
- **Bar**: `shape` に `VerticalBarWithDivider` を使用

### 積み上げのセグメント間 1px

- Bar の `shape` に `VerticalBarWithDivider` を使い、`gap={1}`、`hasValueBefore` / `hasValueAfter` で隣セグメントの有無を渡す。

### Bar の角丸（四隅）

- `radius={[tl, tr, br, bl]}`（上左・上右・下右・下左）。積み位置に応じて:
   - 上端のみ: `[4, 4, 0, 0]`（`var(--aegis-radius-medium)`）
   - 下端のみ: `[0, 0, 4, 4]`（`var(--aegis-radius-medium)`）
   - 1本のみ: `[4, 4, 4, 4]`（`var(--aegis-radius-medium)`）
   - 中間: `[0, 0, 0, 0]`

### セグメント上の数字

- 各 Bar に `<LabelList dataKey="..." content={(props) => <BadgeLabel {...props} dataKey="..." badgeVariant="..." />} />`。セグメント中央に数値（fontSize 11、bold）。値が 0 のときは非表示。

### 合計値をバーの外側に配置

- 縦棒ではバーの**上**に合計。`stackId` を合わせた**ダミー Bar**（`dataKey="dummy"`, `fill="transparent"`, `opacity={0}`, `legendType="none"`）を置き、その Bar に `<LabelList position="top" offset={12} content={...} />`（`offset: var(--aegis-space-small)` / 12px）で合計を渡す。content 内で `total > 0` のときだけ `<TopLabel {...props} value={total} dataKey="完了案件数" />` を返す。TopLabel はバー中央上、fontSize 12、fontWeight bold。

### recharts での実装例（縦棒）

```tsx
<ResponsiveContainer width="100%" height={360}>
  <BarChart
    data={monthlyData}
    margin={{ top: 16, right: 24, bottom: 0 }}
  >
    <XAxis
      allowDecimals={false}
      dataKey="name"
      axisLine={false}
      tickLine={false}
      tickMargin={10}
      tick={(tickProps) => <CustomXAxisTick {...tickProps} showPreviousYearComparison={false} locale={locale} />}
    />
    <YAxis hide />
    <RechartsTooltip
      wrapperStyle={{ outline: "none", transition: "none" }}
      animationDuration={0}
      cursor={{ fill: "#f1f5f9" }}
    />
    <Legend content={renderCustomLegend({ locale })} />
    <Bar
      dataKey="onTimeCompletionCount"
      stackId="completed"
      fill={/* 配色は本ファイルの「色仕様（共通）」を参照 */}
      shape={(props) => {
        const hasValueBelow = /* ... */;
        const hasValueAbove = /* ... */;
        return (
          <VerticalBarWithDivider
            {...props}
            hideDivider={true}
            gap={1}
            hasValueBefore={hasValueBelow}
            hasValueAfter={hasValueAbove}
            radius={
              hasValueBelow && hasValueAbove
                ? [0, 0, 0, 0]
                : hasValueBelow && !hasValueAbove
                  ? [4, 4, 0, 0]
                  : !hasValueBelow && hasValueAbove
                    ? [0, 0, 4, 4]
                    : [4, 4, 4, 4]
            }
            barBorder={style.barBorder}
          />
        );
      }}
    >
      <LabelList
        dataKey="onTimeCompletionCount"
        content={(props) => (
          <BadgeLabel {...props} dataKey="onTimeCompletionCount" badgeVariant="no-bg-white-text" />
        )}
      />
    </Bar>
    {/* 合計用ダミー Bar */}
    <Bar key="完了案件数_合計" dataKey="dummy" stackId="completed" fill="transparent" opacity={0} legendType="none">
      <LabelList
        position="top"
        offset={12}
        content={(props) => {
          if (props.index === undefined) return null;
          const rowData = data[props.index];
          const total = /* 合計計算 */;
          if (total === 0) return null;
          return <TopLabel {...props} value={total} dataKey="完了案件数" />;
        }}
      />
    </Bar>
    <CartesianGrid vertical={false} horizontal={false} stroke="#e2e8f0" />
  </BarChart>
</ResponsiveContainer>
```

- VerticalBarWithDivider, BadgeLabel, TopLabel, CustomXAxisTick, renderCustomLegend は共通チャートコンポーネントとして利用。

---

## 円グラフ（PieChart）

- **使用箇所**: 新規/完了の全期間円グラフ、パーソナル内の円グラフ。

### スタイル値

- **ResponsiveContainer**: `height={300}` または `height={360}`（Pane 内）
- **Pie**: `cx="50%"`, `cy="50%"`, `outerRadius={100}`, `innerRadius={60}`（ドーナツ）または `innerRadius={0}`（フル円・1系列）
- **labelLine**: ドーナツのとき `true`、フル円のとき `false`
- **label**: カスタム関数でラベル位置・テキストを指定。ドーナツでは `radius = outerRadius + 20` で外側に配置。フォント: 名前は `var(--aegis-font-size-body-small)`（12px）、百分率は `var(--aegis-font-size-small)`（14px）bold（フル円では白文字の場合あり）

### recharts での実装例（円・ドーナツ）

```tsx
<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={pieData}
      cx="50%"
      cy="50%"
      labelLine={true}
      innerRadius={60}
      outerRadius={100}
      dataKey="value"
      nameKey="name"
      label={({ cx, cy, midAngle, innerRadius, outerRadius, name, percent }) => {
        if (cx == null || cy == null || midAngle == null || outerRadius == null || percent == null) return null;
        const RADIAN = Math.PI / 180;
        const radius = outerRadius + 20;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        return (
          <text
            x={x}
            y={y}
            fill="var(--aegis-color-font-default)"
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
            fontSize="12"
          >
            {`${name} (${(percent * 100).toFixed(0)}%)`}
          </text>
        );
      }}
    >
      {pieData.map((entry) => (
        <Cell key={entry.name} fill={/* 配色は本ファイルの「色仕様（共通）」を参照 */} />
      ))}
    </Pie>
    <RechartsTooltip wrapperStyle={{ outline: "none", transition: "none" }} animationDuration={0} />
  </PieChart>
</ResponsiveContainer>
```

- Cell の fill は本ファイルの「色仕様（共通）」を参照。

---

## 折れ線グラフ（ComposedChart / Line）

- **使用箇所**: リードタイムカード、パーソナルリードタイム。

### スタイル値

- **ResponsiveContainer**: `height={300}` または `height={360}`（Pane）
- **margin**: `{ top: 16, right: 40, left: 40, bottom: 16 }`（`top/bottom: var(--aegis-space-medium)`、Pane では right/left 32 の場合あり）
- **XAxis**: `allowDecimals={false}`, `dataKey="name"`, `axisLine={true}`, `tickLine={false}`, `tickMargin={10}`, `tick={<CustomXAxisTick ... />}`
- **YAxis**: `yAxisId="right"`, `orientation="right"`, `hide`, `domain={[0, maxValue]}`
- **CartesianGrid**: `vertical={false} horizontal={false} stroke="#e2e8f0"`
- **Line**: `strokeWidth={2}`（`var(--aegis-border-width-thin)`）、`dot`: r 4 またはカスタム（CustomDiamondDot / CustomSquareDot）、`activeDot`: r 8 など
- **LabelList**: `position="top"`, `offset={12}`（`var(--aegis-space-small)`）。ラベル文字: `fill="#2E2E2E"`, `fontSize={12}`（`var(--aegis-font-size-body-small)`）, `textAnchor="middle"`, `dy={-12}`

### recharts での実装例（折れ線）

```tsx
<ResponsiveContainer width="100%" height={300}>
  <ComposedChart
    data={leadTimeData}
    margin={{ top: 16, right: 40, left: 40, bottom: 16 }}
  >
    <XAxis
      allowDecimals={false}
      dataKey="name"
      axisLine={true}
      tickLine={false}
      tickMargin={10}
      tick={(tickProps) => <CustomXAxisTick {...tickProps} showPreviousYearComparison={false} locale={locale} />}
    />
    <YAxis yAxisId="right" orientation="right" hide domain={[0, leadTimeMaxValue]} />
    <RechartsTooltip wrapperStyle={{ outline: "none", transition: "none" }} animationDuration={0} cursor={false} />
    <Legend content={renderCustomLegend({ locale })} />
    <Line
      yAxisId="right"
      type="linear"
      dataKey="リードタイム中央値"
      stroke={/* 配色は本ファイルの「色仕様（共通）」を参照 */}
      strokeWidth={2}
      dot={/* r: 4 または CustomDiamondDot */}
      activeDot={/* r: 8, strokeWidth: 3, fill: "#fff" */}
      name={t("leadTimeMedianShort")}
      legendType="diamond"
    >
      <LabelList
        position="top"
        offset={12}
        dataKey="リードタイム中央値"
        content={(props) => {
          const { value, x, y } = props;
          if (value == null || typeof value !== "number" || Number.isNaN(value)) return null;
          return (
            <text x={x} y={y} dy={-12} fill="#2E2E2E" fontSize={12} textAnchor="middle">
              {value.toFixed(1)}
            </text>
          );
        }}
      />
    </Line>
    <CartesianGrid vertical={false} horizontal={false} stroke="#e2e8f0" />
  </ComposedChart>
</ResponsiveContainer>
```

- stroke / fill は本ファイルの「色仕様（共通）」を参照。CustomXAxisTick, renderCustomLegend は共通チャートコンポーネントとして利用。

---

## 軸ラベル・目盛りのスタイル

- **CustomXAxisTick**: 月名は `var(--aegis-font-size-small)`（14px）。リンクあり時は `color: "var(--aegis-color-font-link)"`、通常は `var(--aegis-color-font-default)`。昨年/今年ラベルは `var(--aegis-font-size-body-small)`（12px）、`color: "var(--aegis-color-font-subtle)"`。foreignObject 内ボタンまたは `text` の `fontSize` は `var(--aegis-font-size-small)`（14px）。
- **CustomYAxisTick**: ユーザー名は `var(--aegis-font-size-small)`（14px）。通常時 foreground `#2E2E2E`、超過時 `#AE352A`。tick 幅 160px。主・副ラベル用スロット幅はロケールにより 30（日本語）または 40（英語）。

---

## 凡例の行間・レイアウト

- コンテナ: `display: "flex"`, `flexWrap: "wrap"`, `justifyContent: "center"`, `columnGap: "var(--aegis-space-medium)"`, `rowGap: "var(--aegis-space-xSmall)"`, `paddingTop: "var(--aegis-space-medium)"`（16px）。
- 各項目: アイコン 10x10（四角/円/ひし形）、`marginRight: "var(--aegis-size-x4Small)"`（6px）、テキスト `variant="body.small"` color `#000`。
- 一部カードで `Legend` に `wrapperStyle={{ marginBottom: 0 }}` を指定。

---

## 値の早見表（実装時の推奨値）

| 適用箇所 | 値 | 使い方 |
|----------|----|--------|
| Pane 内の Pie / Bar / ComposedChart の高さ | `360` | 右Pane内のチャート高さとして統一 |
| 横棒グラフのカテゴリ間ギャップ | `var(--aegis-space-medium)`（16px） | ユーザー行間の余白 |
| 横棒・縦棒のバーサイズ | `var(--aegis-size-xxLarge)`（32px） | 棒の太さを統一 |
| 横棒（主担当/副担当）のバー間隔 | `var(--aegis-space-xxSmall)`（4px） | 2系列表示時の行内ギャップ |
| 積み上げセグメント間の余白 | `var(--aegis-border-width-thinPlus)`（1px） | 縦棒/横棒の分割境界 |
| 横棒グラフのマージン | `right: var(--aegis-space-medium)`（16） | `BarChart layout="vertical"` |
| 縦棒（月次）のマージン | `top: var(--aegis-space-medium), right: var(--aegis-space-large), bottom: 0`（実装値: `16, 24, 0`。必要時 `left` を追加） | カード幅に応じて調整 |
| ComposedChart（リードタイム系）のマージン | `top/bottom: var(--aegis-space-medium)`（16）、`right/left: 40` | 折れ線＋ラベル表示向け |
| CartesianGrid の色 | `#e2e8f0` | 全グラフ共通 |
| セグメント内ラベル文字サイズ | `11px`（token未定義） | BadgeLabel の数値 |
| 合計ラベル文字サイズ | `var(--aegis-font-size-body-small)`（12px） | TopLabel / RightLabel |
| 横棒の合計ラベルオフセット | `var(--aegis-space-xSmall)`（8px） | バー右端からの距離 |

- **実装参照（論理）**: 共通チャートコンポーネント（CustomXAxisTick, CustomYAxisTick, renderCustomLegend, VerticalBarWithDivider, HorizontalBarWithDivider, BadgeLabel, RightLabel, TopLabel）。

## 色仕様（共通）
### レポート画面のグラフで使用する色

- レポート機能で使っているグラフの色を、表示軸別（納期別 / ステータス別 / 案件タイプ別 / 依頼部署別）にまとめたドキュメントです。

- 色の実体はチャートパレット定義（chartPalette）を参照しています。

- **Aegis token 列について**: 色は Aegis token 名で記載します（例: `orange`, `orange.bold`, `orange.xBold`, `orange.subtle`, `orange.xSubtle`）。`fill` / `stroke` に対応する token がないパターン・透明表現は `—` とします。実装では chartPalette を参照します。Aegis の色トークン（chart）の公式一覧は [Chromatic: tokens-color–chart](https://www.chromatic.com/component?appId=634618c98b322242afd2ae10&csfId=tokens-color--chart&buildNumber=5739&k=6976f887ec0020e8afd664af-1200px-interactive-true&h=1&b=-1) を参照。

- **SVGパターン（未入力など）**: `@legalforce/aegis-textures` の `stripes-fill.svg` を利用。参考: [stripes-fill.svg](https://github.com/legalforce/aegis/blob/main/packages/textures/public/stripes-fill.svg)。パターンの色（fill）は neutral 600 相当 → Aegis token: `neutral`。SVG使用時のボーダー（stroke）色: `stroke: var(--aegis-color-chart-stroke-neutral)`。その他のボーダー色も本文中で Aegis token で記載する。

---

## 納期別

| 区分 | Aegis token | 16進コード |
|------|-------------|------------|
| 超過 | orange | `#bb5504` |
| 今日 | azure.xxBold | `#01334a` |
| 2日以内 | azure.bold | `#035b80` |
| 3-6日以内 | neutral.subtle | `#ababab` |
| 7日以降 | neutral.xxSubtle | `#e3e3e3` |
| 未入力 | fill: `neutral`、stroke: `var(--aegis-color-chart-stroke-neutral)` | `#747474` |

### 完了案件の納期別（納期内・納期超過・納期未入力）

| 区分 | Aegis token | 16進コード |
|------|-------------|------------|
| 納期内 | azure.bold | `#035b80` |
| 納期超過 | orange | `#bb5504` |
| 納期未入力 | fill: `neutral`、stroke: `var(--aegis-color-chart-stroke-neutral)` | `#747474` |

## ステータス別

- **未着手** は固定
- それ以降のステータス = 進行中区分のステータス（ユーザーが10個まで自由に作成可能）は、順番1~10の色を割り当てる。

| 順番 | Aegis token | 16進コード | 備考 |
|------|-------------|------------|------|
| 0（未着手） | neutral.subtle | `#ababab` | 未着手のみ固定 |
| 1 | azure.xxBold | `#01334a` | |
| 2 | azure.bold | `#035b80` | |
| 3 | azure.xSubtle | `#97d9ff` | ボーダーあり（`#029fd9`） |
| 4 | azure.x3Subtle | `#e1f3ff` | ボーダーあり（`#029fd9`） |
| 5 | orange.xBold | `#6a2900` | |
| 6 | orange | `#bb5504` | |
| 7 | orange.subtle | `#ff8948` | ボーダーあり（`#e27130`） |
| 8 | indigo.xxBold | `#342561` | |
| 9 | indigo.bold | `#472f83` | |
| 10 | indigo.subtle | `#a7a3f9` | ボーダーあり（`#8a89f4`） |

## 案件タイプ別

| 区分（案件タイプ） | Aegis token | 16進コード |
|-------------------|-------------|------------|
| 契約書審査 | indigo.xxBold | `#342561` |
| 契約書起案 | purple.xSubtle | `#dfc7f2` |
| 法務相談 | red | `#c94630` |
| その他 | neutral.xxSubtle | `#e3e3e3` |

## 依頼部署別

- **blue → blue.subtle → azure → azure.subtle → …** の順に 2 色ずつ割り当て。「その他」は `neutral.subtle` 固定。

- 使用する色系統（index に応じて「色名トークン」と「色名.subtle」を交互に使用）:

| 区分（色系統） | Aegis token | 16進コード（色名トークン） | 16進コード（色名.subtle） |
|----------------|-------------|-------------------------|-------------------|
| blue | blue, blue.subtle | `#0178d4` | `#78aeff` |
| azure | azure, azure.subtle | `#017eaf` | `#24b8f8` |
| teal | teal, teal.subtle | `#098568` | `#12c299` |
| grass | grass, grass.subtle | `#478241` | `#6abd64` |
| lime | lime, lime.subtle | `#6d7b1d` | `#a0b439` |
| yellow | yellow, yellow.subtle | `#976c0d` | `#d9a02c` |
| amber | amber, amber.subtle | `#a56400` | `#e99730` |
| orange | orange, orange.subtle | `#bb5504` | `#ff8948` |
| red | red, red.subtle | `#c94630` | `#f58d78` |
| magenta | magenta, magenta.subtle | `#c34677` | `#fe82ad` |
| purple | purple, purple.subtle | `#985ac2` | `#c998ef` |
| indigo | indigo, indigo.subtle | `#7467d2` | `#a7a3f9` |
| その他 | neutral.subtle | — | `#ababab` |
