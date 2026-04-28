---
id: AP-BUTTON-004
component: Button
category: composition
severity: warning
---
# Button の leading/trailing にインタラクティブ要素を入れてはいけない

## Bad

```tsx
<Button leading={<IconButton aria-label="info"><Icon><LfInfo /></Icon></IconButton>}>
  Submit
</Button>
```

## Good

```tsx
<Button leading={<Icon><LfSend /></Icon>}>
  Submit
</Button>
```

## Why

`leading` / `trailing` にインタラクティブ要素（ボタン、リムーバブルタグ等）を含めてはいけない。操作可能な要素をネストすると、キーボードフォーカスやスクリーンリーダーの操作に問題が生じる。
