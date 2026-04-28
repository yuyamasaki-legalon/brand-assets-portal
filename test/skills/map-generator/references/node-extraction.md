# ノード抽出ルール

SPEC.md から FlowMap 用のノード（`FlowMapNode`）を抽出するルール。

## ソース1: 主要コンポーネント表の「エリア」列

SPEC.md の「主要コンポーネント（Key Components）」テーブルの「エリア」列を解析する。

### エリアパターンとノードタイプのマッピング

| エリアパターン | ノードタイプ | 処理 |
|---|---|---|
| `Main` | `page` | メイン画面ノード。SPEC の「目的」からラベルを取得 |
| `Drawer (xxx)` | `drawer` | 括弧内の名称をラベルに使用 |
| `Dialog (xxx)` | `dialog` | 括弧内の名称をラベルに使用 |
| `Pane (xxx)` | `page` | サブビューとして page ノードに |
| `Sidebar` | — | **スキップ**（UI クロム） |
| `Header` | — | **スキップ**（UI クロム） |
| `Toolbar` | — | **スキップ**（UI クロム） |
| `Footer` | — | **スキップ**（UI クロム） |

### 同一エリアの行は統合

同じエリア名を持つ複数の行は1つのノードに統合する。各行の「用途」列を結合して `description` に設定する。

**例**:
```
| Drawer (Detail) | ContentHeader | 案件タイトル表示 |
| Drawer (Detail) | Tab.Group    | 案件情報/タイムライン切替 |
| Drawer (Detail) | Form         | 案件情報編集 |
```
→ 1つの drawer ノード: `{ id: "detail-drawer", label: "Detail", description: "案件タイトル表示、案件情報/タイムライン切替、案件情報編集" }`

## ソース2: インタラクション節の暗黙画面

「インタラクション（Interactions）」節の `→` 右辺に登場する画面名で、ソース1 で未登録のものをノードとして追加する。

### 検出パターン

| 右辺のパターン | ノードタイプ | 例 |
|---|---|---|
| `〜Drawerを開く` | `drawer` | 「フィルターDrawerを開く」→ filter-drawer |
| `〜Dialogを表示` | `dialog` | 「確認Dialogを表示」→ confirm-dialog |
| `〜に遷移` | `page` | 「案件詳細に遷移」→ case-detail |
| `〜を開く`（Drawer/Dialog 以外） | `page` | 「設定画面を開く」→ settings |
| `〜フロー` | `page` | 「案件作成フロー」→ case-create |

### {要実装} マーカーの扱い

`{要実装}` が付いたインタラクションの右辺でも、画面ノードは抽出する。ノードの `badges` に `{ label: "要実装", color: "warning" }` を設定する。

## ノード ID の生成

ラベルを kebab-case に変換してノード ID とする。

### 変換ルール

1. 日本語ラベルは意味ベースの英語に翻訳
2. スペース・記号をハイフンに置換
3. 小文字に統一

| ラベル | ID |
|---|---|
| 案件一覧 | `case-list` |
| 案件詳細 | `case-detail` |
| Filter | `filter-drawer` |
| Detail | `detail-drawer` |
| 案件作成 | `case-create` |
| 確認ダイアログ | `confirm-dialog` |

Drawer / Dialog ノードの ID にはサフィックスとして `-drawer` / `-dialog` を付ける（同名の page ノードとの衝突を防ぐ）。

## ノード description の生成

主要コンポーネント表の同一エリア行の「用途」列を読点（、）で結合する。

ソース2（インタラクション節）から追加したノードは、対応するインタラクション行の右辺テキストを description にする。

## ノード stateCount の推定

以下の情報源から状態数を推定:

1. **状態管理表**: 該当画面に関連する boolean 変数の数
2. **暗黙の状態**: データ取得がある画面には loading / error / empty の 3 状態を加算
3. **{要実装} 項目**: 要実装のインタラクションがある場合は未確定として加算しない
