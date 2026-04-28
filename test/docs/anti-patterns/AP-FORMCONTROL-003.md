---
id: AP-FORMCONTROL-003
component: FormControl
category: accessibility
severity: warning
wcag: "3.3.1"
---
# error 状態の FormControl にエラーキャプションを含めるべき

## Bad

```tsx
<FormControl error>
  <FormControl.Label>メール</FormControl.Label>
  <TextField />
</FormControl>
```

## Good

```tsx
<FormControl error>
  <FormControl.Label>メール</FormControl.Label>
  <TextField />
  <FormControl.Caption>メールアドレスの形式が正しくありません</FormControl.Caption>
</FormControl>
```

## Why

`error` prop が設定されている場合、エラー内容を伝える `FormControl.Caption` を含めることでユーザーが何を修正すべきかを理解できる。WCAG 3.3.1 Error Identification。
