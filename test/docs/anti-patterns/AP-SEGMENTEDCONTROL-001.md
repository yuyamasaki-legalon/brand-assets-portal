---
id: AP-SEGMENTEDCONTROL-001
component: SegmentedControl
category: usage
severity: warning
---
# SegmentedControl の選択肢は 5 以下にすべき

## Bad

```tsx
<SegmentedControl>
  <SegmentedControl.Item value="1">項目1</SegmentedControl.Item>
  <SegmentedControl.Item value="2">項目2</SegmentedControl.Item>
  <SegmentedControl.Item value="3">項目3</SegmentedControl.Item>
  <SegmentedControl.Item value="4">項目4</SegmentedControl.Item>
  <SegmentedControl.Item value="5">項目5</SegmentedControl.Item>
  <SegmentedControl.Item value="6">項目6</SegmentedControl.Item>
</SegmentedControl>
```

## Good

```tsx
<SegmentedControl>
  <SegmentedControl.Item value="all">すべて</SegmentedControl.Item>
  <SegmentedControl.Item value="active">有効</SegmentedControl.Item>
  <SegmentedControl.Item value="inactive">無効</SegmentedControl.Item>
</SegmentedControl>
```

## Why

選択肢が多すぎるとコンポーネントが横に広がり視認性が低下する。5 つ以下に収め、多い場合は Select や Tabs を検討する。
