# analytics-MVP Documents Index

このディレクトリは、`analytics-MVP` の仕様・シナリオ・ヘルプ/リリースノート・資料アーカイブを管理します。

## 主要ドキュメント（優先参照）

1. `team-members-spec.md`
- 画面仕様の主ドキュメント（実装判断の基準）。
2. `team-members-spec-scenarios.md`
- 受け入れ観点・シナリオ仕様。
3. `realistic-scenarios.md`
- 現実的な利用シナリオ（プロトタイプ対応）。
4. `ideal-scenarios.md`
- 将来構想のシナリオ（MVP外を含む）。

## 補助ドキュメント

- `analytics-chart-colors.md`
- `analytics-chart-styling.md`
- `help_releasenote/`
- `format/qa_spec_format.md`

## アーカイブ

- 過去版・検討履歴は `archive/` に保管。
- 現在の主なアーカイブ:
  - `archive/analytics-dashboard-requirements.md`
  - `archive/current-prototype-structure.md`
  - `archive/tab-and-card-layout-proposals.md`
  - `archive/team-members-implementation-prd_old.md`

## メンテナンスルール

- 新規ドキュメントを追加したら、このREADMEに用途と参照優先度を追記する。
- MVPの実装判断では、`ideal-scenarios.md` 単体を根拠にしない。
- 廃止ファイルは削除せず `archive/` に移動する。

## AI実装用Spec

- `spec/` にAI駆動開発向けの分割仕様を配置。
- 元資料の完全コピーは `spec/reference/` を参照。
