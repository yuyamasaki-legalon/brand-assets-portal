# LOC Overview Map - Auto-Generated PRD

## Overview
LegalOn の画面遷移フロー（ダッシュボード→案件一覧→詳細→契約書一覧→詳細→レビュー→電子契約）を ReactFlow で可視化し、1つの URL で全体像を把握できる Bird's Eye View プロトタイプ。

## Requirements

### Confirmed
- [x] ReactFlow を直接使用（FlowMap ラッパーではなく）
- [x] 11 画面ノード + 2 グループノード（Core Workflow / Knowledge & Tools）
- [x] 12 エッジ（ラベル付き遷移）
- [x] MiniMap + Background（ドットグリッド）
- [x] カスタムアニメーションエッジ（stroke-dashoffset）
- [x] グループ背景ノード（半透明矩形）
- [x] ノードホバーでエッジハイライト
- [x] ノードクリックで右パネル表示（NodeDetailPanel 再利用）
- [x] 各ノードにミニプレビュー表示
- [x] フル画面（100vh）レイアウト
- [x] fitView で初期表示時に全体俯瞰

### Inferred
- [x] 既存 ScreenNode / NodeDetailPanel コンポーネント再利用
- [x] パターングループ定義（案件一覧・案件詳細・レビューの 3 画面）
- [x] タイトルオーバーレイ（Panel コンポーネント）
- [x] ペインクリックでパネル閉じ

## Technical Stack
- ReactFlow v12 (direct usage)
- Aegis Design System components for previews
- Existing prototype components (ScreenNode, NodeDetailPanel)
