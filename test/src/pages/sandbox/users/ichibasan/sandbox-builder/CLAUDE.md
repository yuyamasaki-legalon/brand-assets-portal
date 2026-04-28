# Sandbox Builder: AI Agent Rules

## コンテンツビューは Aegis 公式 API に厳密に従う

`editMode === null`（プレビュー表示）のレンダリングは Aegis 公式の使用方法から逸脱しない。
Storybook のサンプルコードを正として扱い、sandbox-builder の都合による独自 wrapper・構造変更を加えない。

Edit Page Layout モード内の UI は多少の逸脱を許容するが、コンテンツビューは許容しない。

## buildPageLayoutJsxText の出力はコンテンツビューの実装と一致させる

ダウンロードコードが出力するコンポーネント構造 ＝ コンテンツビューが実際に render する構造であること。

乖離が生じた場合は放置せず、Aegis 公式に合わせてどちらかを修正する。

## 新規コンポーネント追加・構造変更時は MCP で props を確認する

以下の場合に `mcp__aegis__get_component_detail("ComponentName")` を呼び出す:

- `views/AddContentView/fieldConfig/` に新しいコンポーネントを追加するとき
- PageLayout 系コンポーネント（`PageLayout`, `PageLayoutSidebar`, `PageLayoutPane` 等）の構造を変更するとき

ラベル変更・スタイル微調整など軽微な修正は確認不要。

## Aegis 公式に沿えない場合は MEMO.md に記録する

技術的な理由で Aegis 公式パターンから逸脱せざるを得ない場合は、その理由と暫定対応を `MEMO.md` に残す。
