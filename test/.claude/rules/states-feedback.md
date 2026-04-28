---
paths: src/**/*.tsx
---

# States & Feedback Patterns

`src/pages/template/states/` に状態表示・フィードバックのテンプレートがある。UI 実装時に必ず参照すること。

## Loading
- 初回ページ読込 → `Skeleton`（`role="alert" aria-busy="true" aria-live="polite"` 必須）
- 後続操作 → `ProgressBar` / `ProgressCircle`
- ボタン送信中 → `Button loading` prop + 他要素 `disabled`
- ブロッキング操作 → `ProgressOverlay`（root でスコープ限定可）

## Error
- ページ全体 → `EmptyState size="large"` + ErrorCat illustration + retry
- セクション → `Banner color="danger"`
- フォーム → `FormControl error` + `FormControl.Caption`
- Dialog 内 → `DialogStickyContainer` + `Banner`（エラー時 Dialog を閉じない）

## Empty
- サイズ選択: large（ページ）/ medium（リスト）/ small（ペイン/Dialog）
- **small では illustration 禁止**（Icon のみ使用可）

## Feedback
- 操作結果 → `snackbar.show()`: success / `color="danger"` / action 付き
- ボタン無効理由 → `Popover trigger="hover"` + disabled Button

## 詳細
`/states-feedback` スキルで判断フローチャート・詳細リファレンスを参照。
