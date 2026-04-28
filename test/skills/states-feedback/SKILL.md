---
name: states-feedback
description: "状態表示・フィードバック（error / loading / empty / feedback）の実装パターンを提供。WHEN: Skeleton・EmptyState・Toast・Alert 等の使い分けに迷ったとき、データ取得の状態ハンドリング実装時。NOT WHEN: 静的 UI の実装や、既にパターンが決まっている場合。"
user_invocable: true
arguments:
  - name: category
    description: "カテゴリ（error / loading / empty / feedback）を指定。省略時は判断フローチャートを表示"
    required: false
---

# States & Feedback Patterns

UI の状態表示とフィードバックのテンプレートパターン集。

## 判断フローチャート

```
何を実装する？
├── データ未取得 → loading カテゴリ
│   ├── 初回ページ読込 → Skeleton
│   ├── 後続操作 → ProgressBar / ProgressCircle
│   ├── ボタン送信中 → Button loading prop
│   └── ブロッキング操作 → ProgressOverlay
├── データ取得失敗 → error カテゴリ
│   ├── ページ全体 → EmptyState large + ErrorCat + retry
│   ├── セクション → Banner color="danger"
│   └── コンポーネント → ErrorBoundary + Suspense
├── フォームエラー → error カテゴリ
│   ├── フィールドバリデーション → FormControl error + Caption
│   ├── 送信エラー → Banner + retry
│   └── Dialog 内エラー → Banner + DialogStickyContainer
├── データが空 → empty カテゴリ
│   ├── ページ → EmptyState large
│   ├── リスト/メイン → EmptyState medium
│   └── ペイン/Dialog → EmptyState small (Icon only)
└── 操作結果通知 → feedback カテゴリ
    ├── 成功/失敗通知 → snackbar.show()
    └── ボタン無効理由 → Popover trigger="hover"
```

## クイックリファレンス

### Error パターン

| シナリオ | コンポーネント | キー Props | テンプレート |
|---------|--------------|-----------|------------|
| API 取得失敗 | EmptyState + ErrorCat | `size="medium"`, action={retry} | `states/error/FetchError.tsx` |
| セクションエラー | Banner | `color="danger"`, `size="small"` | `states/error/FetchError.tsx` |
| フォームバリデーション | FormControl + Caption | `error`, `required` | `states/error/FormValidation.tsx` |
| フォーム送信失敗 | Banner + Button | `loading`, `color="danger"` | `states/error/FormSubmission.tsx` |
| Dialog 内エラー | DialogStickyContainer + Banner | `position="bottom"` | `states/error/DialogError.tsx` |
| コンポーネントエラー | ErrorBoundary + Suspense | `renderFallback` | `states/error/ErrorBoundaryDemo.tsx` |

### Loading パターン

| シナリオ | コンポーネント | キー Props | テンプレート |
|---------|--------------|-----------|------------|
| リスト初回読込 | Skeleton.Table | `numberOfRows` | `states/loading/SkeletonPatterns.tsx` |
| 詳細初回読込 | Skeleton + Skeleton.Text | `width`, `height` | `states/loading/SkeletonPatterns.tsx` |
| フォーム初回読込 | Skeleton | width/height 指定 | `states/loading/SkeletonPatterns.tsx` |
| 進捗表示 | ProgressBar / ProgressCircle | `size`, `value` | `states/loading/ProgressIndicators.tsx` |
| ブロッキング | ProgressOverlay | `open`, `root` | `states/loading/ProgressIndicators.tsx` |
| ボタン送信中 | Button | `loading` | `states/loading/ButtonAndComboboxLoading.tsx` |
| Combobox 読込 | Combobox | `loading` | `states/loading/ButtonAndComboboxLoading.tsx` |

### Empty パターン

| シナリオ | コンポーネント | キー Props | テンプレート |
|---------|--------------|-----------|------------|
| ページ全体エラー | EmptyState | `size="large"`, visual={illustration} | `states/empty/EmptyStatePatterns.tsx` |
| リスト空 / 検索結果なし | EmptyState | `size="medium"`, visual={illustration/Icon} | `states/empty/EmptyStatePatterns.tsx` |
| ペイン/Combobox/Popover | EmptyState | `size="small"`, visual={Icon only} | `states/empty/EmptyStatePatterns.tsx` |

### Feedback パターン

| シナリオ | コンポーネント | キー Props | テンプレート |
|---------|--------------|-----------|------------|
| 成功通知 | snackbar.show() | `message` | `states/feedback/SnackbarPatterns.tsx` |
| エラー通知 | snackbar.show() | `message`, `color="danger"` | `states/feedback/SnackbarPatterns.tsx` |
| アクション付き | snackbar.show() | `action={<Button>}` | `states/feedback/SnackbarPatterns.tsx` |
| 処理中通知 | snackbar.show() | `action={<ProgressCircle>}` | `states/feedback/SnackbarPatterns.tsx` |
| ボタン無効理由 | Popover + Button | `trigger="hover"`, `disabled` | `states/feedback/DisabledWithPopover.tsx` |

## 詳細リファレンス

カテゴリごとの詳細は以下を参照:

- [Error パターン詳細](./references/error-patterns.md)
- [Loading パターン詳細](./references/loading-patterns.md)
- [Empty パターン詳細](./references/empty-patterns.md)
- [Feedback パターン詳細](./references/feedback-patterns.md)

## テンプレートパス

すべてのテンプレートは `src/pages/template/states/` 配下:

```
states/
├── _hooks/useSimulatedAsync.ts
├── error/
│   ├── FetchError.tsx
│   ├── FormValidation.tsx
│   ├── FormSubmission.tsx
│   ├── DialogError.tsx
│   └── ErrorBoundaryDemo.tsx
├── loading/
│   ├── SkeletonPatterns.tsx
│   ├── ProgressIndicators.tsx
│   └── ButtonAndComboboxLoading.tsx
├── empty/
│   └── EmptyStatePatterns.tsx
└── feedback/
    ├── SnackbarPatterns.tsx
    └── DisabledWithPopover.tsx
```

## 使用方法

```
/states-feedback           # 判断フローチャートを表示
/states-feedback error     # Error パターン詳細
/states-feedback loading   # Loading パターン詳細
/states-feedback empty     # Empty パターン詳細
/states-feedback feedback  # Feedback パターン詳細
```
