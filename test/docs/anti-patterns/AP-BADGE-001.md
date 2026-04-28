---
id: AP-BADGE-001
component: Badge
category: usage
severity: error
---
# Badge をテキストラベルとして使用してはいけない

## Bad

```tsx
<Badge color="information" style={latestBadgeStyle}>
  最新
</Badge>
```

## Good

```tsx
// 状態を示すラベル → Tag を使用
<Tag size="small" color="blue">最新</Tag>

// ステータス表示 → StatusLabel を使用
<StatusLabel variant="fill" size="small" color="blue">最新</StatusLabel>
```

## Why

Badge は件数・通知のアイキャッチ用コンポーネントであり、`count` prop で数値を渡して使う。テキストラベルを children として渡す用途には設計されていない。状態を表す場合は StatusLabel、オブジェクトの分類を表す場合は Tag を使用する。
