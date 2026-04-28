---
id: AP-LINK-002
component: Link
category: accessibility
severity: warning
wcag: "4.1.2"
---
# href なしの Link に role="button" を付けなければならない

## Bad

```tsx
<Link onClick={handleClick}>設定を変更</Link>
```

## Good

```tsx
<Link href="/settings">設定を変更</Link>

// 次善策（遷移でない場合）
<Link role="button" onClick={handleClick}>設定を変更</Link>
```

## Why

Link は遷移用途のコンポーネント。`href` なしで `onClick` のみの場合、スクリーンリーダーはリンクとして読み上げるが実際にはボタン動作をする。`role="button"` を付与するか、そもそも Button を使用する。
