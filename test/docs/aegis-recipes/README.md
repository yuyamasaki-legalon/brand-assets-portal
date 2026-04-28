# Aegis Recipes

Aegis コンポーネントだけで UI を組むためのレシピ集です。

## 使い方

1. 目的に近いレシピを選ぶ
2. スニペットをベースに組み立てる
3. 仕上げはテンプレート実装を確認して調整する

## レシピ一覧

- [一覧ツールバー + 検索/フィルター](./list-toolbar-and-search.md)
- [フィルタードロワー（フォーム）](./filter-drawer.md)
- [空状態 (EmptyState)](./empty-state.md)
- [詳細ヘッダー（ステータス + アクション）](./detail-header.md)
- [DataTable + Pagination](./data-table-pagination.md)
- [ステータス表示 + タグ](./status-and-tags.md)
- [フォームラベル + ヘルプ + TagPicker](./form-control-help-tagpicker.md)
- [TableContainer + Table](./table-container-basic.md)
- [メンテナンス/エラーページの EmptyState](./maintenance-empty-state.md)
- [バナー付きフォーム（エラー/注意）](./form-with-banner.md)
- [サイドバー付きレイアウト](./sidebar-layout.md)
- [アイコンメニュー](./action-menu.md)
- [TagPicker カスタム候補 + EmptyState](./tagpicker-custom-options.md)
- [Table.ActionCell + メニュー](./table-action-cell-menu.md)
- [非活性アクション + 理由の Popover](./disabled-action-popover.md)
- [省略テキスト + Tooltip](./overflow-tooltip.md)

## 利用ルール

- UI は必ず `@legalforce/aegis-react` のコンポーネントのみで構成する
- 迷ったら `docs/rules/ui/` を先に確認する
