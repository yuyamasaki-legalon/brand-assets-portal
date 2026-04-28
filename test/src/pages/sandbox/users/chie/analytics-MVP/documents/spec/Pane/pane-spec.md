# Pane Spec

## 機能仕様
### ユーザー詳細Pane（共通）

- 目的: メインコンテンツで選択したユーザーの詳細情報を、右側 Pane で確認する。
- 表示位置: 画面右側に Pane を表示する。
- タブ構成: `パフォーマンス` / `進行中の案件` の 2 タブを表示する。
- 対象ユーザー: Pane で選択中の 1 ユーザーを対象に表示する。
- 初期状態の引き継ぎ:
   - Pane を開く操作元（メインコンテンツ）のタブ・フィルター条件を引き継ぐ。
   - パフォーマンスタブでは、メインコンテンツの集計期間設定を引き継ぐ。
- データ対象:
   - 閲覧権限のある案件のみ表示する。
   - 削除済み案件は集計対象に含めない。
- 権限: `common-functional-spec.md`「権限・認可ルール」参照。

### 仕様ファイルの責務分割

- 進行中タブの仕様: `Pane/tab-ongoing-matters.md`
- パフォーマンスタブ（完了案件カード）の仕様: `Pane/card-overview-completed.md`
- パフォーマンスタブ（案件の対応時間カード）の仕様: `Pane/card-overview-lead-time.md`
- 用語・集計定義: `terms-and-definitions.md`
- 画面レイアウトの対応関係: `layout-and-component-map.md`
- 共通UIルール: `common-functional-spec.md`「画面・UI共通仕様 / カード共通UI」

### 検証観点

- `PANE-COMMON-VAL-001` メインコンテンツから対象ユーザーを選択したとき、右側 Pane が開く。
- `PANE-COMMON-VAL-002` Pane 内で `パフォーマンス` / `進行中の案件` タブを切り替えできる。
- `PANE-COMMON-VAL-003` Pane 起動時に、操作元のタブ・フィルター条件を引き継ぐ。
- `PANE-COMMON-VAL-004` 閲覧権限のない案件は表示されない。
- `PANE-COMMON-VAL-005` 削除済み案件は表示・集計対象に含まれない。
