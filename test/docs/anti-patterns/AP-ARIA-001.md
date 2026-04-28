---
id: AP-ARIA-001
component: General
category: accessibility
severity: error
---
# 操作可能な要素に aria-hidden="true" を設定してはいけない

## Bad

```tsx
<Button aria-hidden="true" onClick={handleClick}>送信</Button>
```

## Good

```tsx
<Button onClick={handleClick}>送信</Button>

// 装飾的なアイコンには aria-hidden を使用
<Icon aria-hidden="true"><LfStar /></Icon>
```

## Why

`aria-hidden="true"` は要素をスクリーンリーダーから隠す。操作可能な要素（Button, Link, Input 等）に設定するとキーボードユーザーがフォーカスできるのにスクリーンリーダーで認識できない状態になる。
