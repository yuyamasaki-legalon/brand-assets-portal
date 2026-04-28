---
name: map-generator
description: "SPEC.md から FlowMap 用の map-data.ts を自動生成。画面構成・インタラクションセクションを解析し、画面ノード・遷移エッジ・自動レイアウトを生成する。プロトタイプの画面遷移フロー可視化時に使用。引数: ページパス（例: /map-generator sandbox/loc/case-detail）"
disable-model-invocation: true
---

# マップデータジェネレーター

SPEC.md を解析して FlowMap 用の `map-data.ts` を自動生成する。

## 使用方法

```bash
# 単一ページモード
/map-generator sandbox/loc/case-detail
/map-generator src/pages/sandbox/users/wataryooou/loc-case-claude

# サービスレベル集約モード
/map-generator --service loc
/map-generator --service dealon
```

引数なしの場合はカレントディレクトリの SPEC.md を探す。
`--service` フラグ付きの場合はサービス内の全 SPEC.md を集約して1つの `map-data.ts` を生成する。

---

## 実行手順

### Step 0: SPEC Discovery（`--service` モード時のみ）

`--service {name}` が指定された場合、以下のディレクトリから SPEC.md を自動収集する:

```
src/pages/sandbox/**/SPEC.md       → サービス名でフィルタ（パスに {name} を含む）
src/pages/template/{name}/**/SPEC.md → すべて対象
```

収集した各 SPEC.md に対して Step 2–4 を個別に実行し、結果を1つの `map-data.ts` に集約する。

ページ間接続の検出ルールは `references/cross-page-connections.md` を参照。
レイアウトルールは `references/service-layout.md` を参照。

出力先: `src/pages/sandbox/users/{current-user}/loc-overview-map/map-data.ts`（サービス名が loc の場合）

### Step 1: SPEC.md の特定

引数 `$ARGUMENTS` からパスを解析:

| 入力パターン | 解決先 |
|---|---|
| `sandbox/xxx` | `src/pages/sandbox/xxx/SPEC.md` |
| `src/pages/sandbox/xxx` | `src/pages/sandbox/xxx/SPEC.md` |
| `src/pages/sandbox/xxx/SPEC.md` | そのまま使用 |

SPEC.md が見つからない場合はエラーを出力して終了。

### Step 2: ノード抽出

`references/node-extraction.md` のルールに従い、SPEC.md から画面ノードを抽出する。

**入力**: SPEC.md の「主要コンポーネント（Key Components）」表 + 「インタラクション（Interactions）」節
**出力**: `FlowMapNode[]` の配列

### Step 3: エッジ抽出

`references/edge-extraction.md` のルールに従い、SPEC.md からエッジを抽出する。

**入力**: SPEC.md の「インタラクション（Interactions）」節
**出力**: `FlowMapEdge[]` の配列

### Step 4: 自動レイアウト

グリッドベースの決定的アルゴリズムで各ノードの position を計算する。

```
定数:
  CARD_WIDTH  = 220  (ScreenNode の幅)
  CARD_HEIGHT = 280  (ScreenNode の高さ)
  H_GAP       = 200  (水平方向の間隔)
  V_GAP       = 150  (垂直方向の間隔)

レイアウトルール:
  1. page ノード → 中央列 (x = CARD_WIDTH + H_GAP)
     上から順に y = 0, CARD_HEIGHT + V_GAP, (CARD_HEIGHT + V_GAP) * 2, ...
  2. drawer ノード → 右列 (x = (CARD_WIDTH + H_GAP) * 2)
     ソースページの y に揃える（エッジのソースノードから決定）
  3. dialog ノード → 左列 (x = 0)
     ソースページの y に揃える
  4. external ノード → 最下段中央
```

position が計算できたら各ノードに `position: { x, y }` を設定する。

### Step 5: map-data.ts 生成

SPEC.md と同じディレクトリに `map-data.ts` を出力する。

#### 出力フォーマット

```typescript
import type { FlowMapEdge, FlowMapNode } from "{relative-path}/components/prototype";

export const mapNodes: FlowMapNode[] = [
  {
    id: "node-id",
    position: { x: 420, y: 0 },
    data: {
      label: "画面ラベル",
      description: "画面の説明",
      // states があれば stateCount を設定
    },
  },
  // ...
];

export const mapEdges: FlowMapEdge[] = [
  {
    id: "e-source-target",
    source: "source-id",
    target: "target-id",
    label: "アクション名",
  },
  // ...
];
```

#### import パスの計算

SPEC.md のディレクトリ深度から `src/components/prototype` への相対パスを自動計算する:

| SPEC.md の位置 | import パス |
|---|---|
| `src/pages/sandbox/xxx/` | `../../../components/prototype` |
| `src/pages/sandbox/loc/xxx/` | `../../../../components/prototype` |
| `src/pages/sandbox/users/user/xxx/` | `../../../../../components/prototype` |

### Step 6: 使用方法の案内

生成完了後、以下を表示:

```
map-data.ts を生成しました: {出力パス}

PrototypeShell に組み込むには index.tsx で以下のように使用してください:

import { FlowMap, PrototypeShell } from "{relative-path}/components/prototype";
import { mapEdges, mapNodes } from "./map-data";

// PrototypeShell の flowMap prop に渡す
<PrototypeShell
  title="..."
  flowMap={<FlowMap nodes={mapNodes} edges={mapEdges} />}
>
  {/* ページコンテンツ */}
</PrototypeShell>
```

---

## ノードの data プロパティ

生成する各ノードの `data` には以下を設定:

| プロパティ | 設定方法 |
|---|---|
| `label` | エリア名（Main → SPEC の目的から。Drawer/Dialog → 括弧内の名称） |
| `path` | page ノードの場合、ルートパスを推定（省略可） |
| `stateCount` | 状態管理表の boolean 変数数 + 暗黙の状態（empty/loading/error）を推定 |
| `badges` | `{要実装}` マーカーがあれば `{ label: "要実装", color: "warning" }` |

`preview` と `patternGroups` は手動で後から追加する想定のため、自動生成しない。

---

## 参照ドキュメント

| ドキュメント | 内容 |
|---|---|
| `skills/map-generator/references/node-extraction.md` | ノード抽出ルール |
| `skills/map-generator/references/edge-extraction.md` | エッジ抽出ルール |
| `src/components/prototype/FlowMap.tsx` | FlowMapNode / FlowMapEdge の型定義 |
| `src/components/prototype/types.ts` | ScreenNodeData の型定義 |
| `src/pages/sandbox/prototype-demo/map-data.tsx` | 出力フォーマットの参考 |

---

## 関連スキル

- `/prototype-generator` - SPEC.md からプロトタイプコードを生成
- `/spec-generator` - 既存コードから SPEC.md を生成
- `/qa-checklist` - SPEC.md から QA チェックリストを生成
