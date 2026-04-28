# Error Patterns 詳細リファレンス

## 1. FetchError — API 取得失敗

**いつ使うか**: API からのデータ取得が失敗した場合

**コンポーネント構成**:
- `EmptyState` + `ErrorCat1` illustration: ページ/セクション全体のエラー表示
- `Banner color="danger"`: セクション内の部分的エラー表示

**重要ルール**:
- EmptyState の action に「再試行」ボタンを必ず配置
- 状態遷移: idle → loading → error → retry → success
- Banner は `size="small"` を使用し、`onClose` で非表示可能にする
- ポーリング失敗は `EmptyState size="small"` + retry で対応

**テンプレート**: `src/pages/template/states/error/FetchError.tsx`

---

## 2. FormValidation — フォームバリデーション

**いつ使うか**: フォーム入力値のバリデーションエラーを表示する場合

**コンポーネント構成**:
- `FormControl` の `error` prop + `required` prop
- `FormControl.Caption` でエラーメッセージ表示
- `Banner color="danger"` でエラー件数サマリー表示

**重要ルール**:
- `FormControl error={submitted && !!errors.fieldName}` でバリデーション実行後のみ表示
- 必須項目は `FormControl required` で必須マークを表示
- 文字数制限は通常時カウンタ表示、超過時にエラー切り替え
- エラーサマリー Banner は `closeButton={false}` で閉じれないようにする

**テンプレート**: `src/pages/template/states/error/FormValidation.tsx`

---

## 3. FormSubmission — フォーム送信エラー

**いつ使うか**: フォーム送信（API コール）が失敗した場合

**コンポーネント構成**:
- `Banner color="danger" size="small" closeButton={false}`: 送信エラーメッセージ
- `Button loading={isPending}`: 送信中状態
- `ButtonGroup`: 送信ボタン + 戻るボタン

**重要ルール**:
- 送信中は `Button loading` で表示し、他のボタンは `disabled`
- エラー時はフォームを保持してリトライ可能にする
- 送信エラーの Banner は確認画面のボタン上に配置
- `beforeunload` でフォーム離脱防止（input/confirm モード時）

**テンプレート**: `src/pages/template/states/error/FormSubmission.tsx`

---

## 4. DialogError — Dialog 内エラー

**いつ使うか**: Dialog 内のフォーム送信が失敗した場合

**コンポーネント構成**:
- `Dialog` + `DialogContent` + `DialogHeader` + `DialogBody` + `DialogFooter`
- `DialogStickyContainer position="bottom"` + `Banner color="danger"`
- `Button loading={isSubmitting}` + `ButtonGroup`

**重要ルール**:
- **エラー時は Dialog を閉じない** — ユーザー入力を保持してリトライ可能にする
- `DialogStickyContainer` で Banner を固定表示（スクロールしても見える）
- 送信中は `onOpenChange` をブロック（閉じられないようにする）
- キャンセルボタンも送信中は `disabled`

**テンプレート**: `src/pages/template/states/error/DialogError.tsx`

---

## 5. ErrorBoundary — コンポーネントエラー

**いつ使うか**: React コンポーネントの render 中にエラーが throw された場合

**コンポーネント構成**:
- `ErrorBoundary` (class component) + `renderFallback` prop
- `Suspense` + `fallback={<Skeleton loading>}`
- `EmptyState` + `ErrorCat1` でエラーフォールバック表示

**重要ルール**:
- ErrorBoundary は **Suspense の外側** に配置する
- `renderFallback` で error と reset を受け取り、EmptyState で表示
- Suspense の fallback には Skeleton を使用（`role="alert" aria-busy="true" aria-live="polite"`）
- `key` prop でコンポーネントをリセット可能にする

**テンプレート**: `src/pages/template/states/error/ErrorBoundaryDemo.tsx`
