---
id: AP-SNACKBAR-001
component: Snackbar
category: usage
severity: warning
---
# Snackbar を重要な情報の表示に使用してはいけない

## Bad

```tsx
// エラーメッセージを Snackbar で表示
showSnackbar({ message: "保存に失敗しました", color: "danger" });
```

## Good

```tsx
// エラーは Banner で表示
<Banner color="danger">保存に失敗しました。再度お試しください。</Banner>

// Snackbar は一時的な確認メッセージに使用
showSnackbar({ message: "保存しました", color: "success" });
```

## Why

Snackbar は一定時間後に自動で消えるため、重要なエラーや操作結果には使用しない。重要な情報は Banner や Dialog で表示する。
