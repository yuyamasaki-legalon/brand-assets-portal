# Feedback Patterns 詳細リファレンス

## 1. Snackbar — 操作結果通知

**いつ使うか**: 保存・削除・更新などの操作結果をユーザーに通知する場合

**API**: `snackbar.show()` を直接呼び出す（コンポーネントではなく関数）

### パターン一覧

**成功通知**:
```tsx
snackbar.show({ message: "保存しました" });
snackbar.show({ message: "削除しました" });
snackbar.show({ message: "設定を更新しました" });
```

**エラー通知**:
```tsx
snackbar.show({ message: "エラーが発生しました", color: "danger" });
snackbar.show({ message: "権限がありません", color: "danger" });
```

**アクション付き**（自動で消えない）:
```tsx
snackbar.show({
  message: "案件を削除しました",
  action: (
    <Button variant="plain" size="small">
      元に戻す
    </Button>
  ),
});
```

**処理中表示**:
```tsx
snackbar.show({
  message: "処理中...",
  action: <ProgressCircle size="xSmall" />,
});
```

### テキストルール

| パターン | 例 | 正否 |
|---------|-----|------|
| 1文のみ → 句点なし | 保存しました | ○ |
| 2文 → 1文目のみ句点 | 保存しました。引き続き編集できます | ○ |
| 1文に句点 | 保存しました。 | × |

**重要ルール**:
- 成功通知はデフォルト色（color 指定なし）
- エラー通知は `color="danger"`
- action 付きの場合は自動で消えない（ユーザーが閉じる）
- `ProgressCircle` を action に渡すと処理中表示になる

**テンプレート**: `src/pages/template/states/feedback/SnackbarPatterns.tsx`

---

## 2. Disabled + Popover — ボタン無効理由の説明

**いつ使うか**: disabled ボタンの理由をユーザーに伝える場合

### パターン一覧

**必須項目未入力**:
```tsx
{isRequiredEmpty ? (
  <Popover trigger="hover" arrow placement="top-end" closeButton={false}>
    <Popover.Anchor>
      <Button disabled>保存</Button>
    </Popover.Anchor>
    <Popover.Content width="small">
      <Popover.Body>
        <Text variant="body.small">必須項目を入力してください</Text>
      </Popover.Body>
    </Popover.Content>
  </Popover>
) : (
  <Button onClick={handleSubmit}>保存</Button>
)}
```

**権限不足**:
```tsx
<Popover trigger="hover" arrow placement="top-end" closeButton={false}>
  <Popover.Anchor>
    <Button disabled>編集</Button>
  </Popover.Anchor>
  <Popover.Content width="small">
    <Popover.Body>
      <Text variant="body.small">この操作を行う権限がありません</Text>
    </Popover.Body>
  </Popover.Content>
</Popover>
```

**処理中（Popover 不要）**:
```tsx
<ButtonGroup>
  <Button variant="plain" disabled={isSubmitting}>キャンセル</Button>
  <Button loading={isSubmitting} onClick={handleSubmit}>保存</Button>
</ButtonGroup>
```

### 使い分け判断

```
ボタンが disabled な理由は？
├── 必須項目未入力 → Popover trigger="hover" で「必須項目を入力してください」
├── 権限不足 → Popover trigger="hover" で「この操作を行う権限がありません」
└── 処理中 → Popover 不要。Button loading prop を使用
```

**重要ルール**:
- Popover は `trigger="hover"` + `arrow` + `closeButton={false}` を使用
- `placement="top-end"` でボタン上部に表示
- `Popover.Content width="small"` で適切な幅を設定
- 条件によって Popover 付き disabled と通常ボタンを切り替える（条件分岐で出し分け）
- 処理中は Popover ではなく `Button loading` を使う

**テンプレート**: `src/pages/template/states/feedback/DisabledWithPopover.tsx`
