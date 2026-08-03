var e=`---
id: AP-SEGMENTEDCONTROL-001
component: SegmentedControl
category: usage
severity: warning
---
# SegmentedControl の選択肢は 5 以下にすべき

## Bad

\`\`\`tsx
<SegmentedControl>
  <SegmentedControl.Button value="1">項目1</SegmentedControl.Button>
  <SegmentedControl.Button value="2">項目2</SegmentedControl.Button>
  <SegmentedControl.Button value="3">項目3</SegmentedControl.Button>
  <SegmentedControl.Button value="4">項目4</SegmentedControl.Button>
  <SegmentedControl.Button value="5">項目5</SegmentedControl.Button>
  <SegmentedControl.Button value="6">項目6</SegmentedControl.Button>
</SegmentedControl>
\`\`\`

## Good

\`\`\`tsx
<SegmentedControl>
  <SegmentedControl.Button value="all">すべて</SegmentedControl.Button>
  <SegmentedControl.Button value="active">有効</SegmentedControl.Button>
  <SegmentedControl.Button value="inactive">無効</SegmentedControl.Button>
</SegmentedControl>
\`\`\`

## Why

選択肢が多すぎるとコンポーネントが横に広がり視認性が低下する。5 つ以下に収め、多い場合は Select や Tabs を検討する。
`;export{e as default};