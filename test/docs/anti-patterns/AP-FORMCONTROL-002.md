---
id: AP-FORMCONTROL-002
component: FormControl
category: accessibility
severity: error
wcag: "3.3.2"
---
# FormControl に FormControl.Label を含めなければならない

## Bad

```tsx
<FormControl>
  <TextField />
</FormControl>
```

## Good

```tsx
<FormControl>
  <FormControl.Label>メールアドレス</FormControl.Label>
  <TextField />
</FormControl>
```

## Why

フォームコントロールにはラベルが必要。`FormControl.Label` がないとスクリーンリーダーがフィールドの目的を伝えられない。WCAG 3.3.2 Labels or Instructions に違反する。
