var e=`# Task 14 — Tone Curve Editor: SVG drag interface

## Objective

Implement a ToneCurve SVG component with draggable control points (one per tone). Wire into FamilyAxisPanel (left, dispatches UPDATE_TONE) and ToneAxisPanel (right, dispatches UPDATE_TONE_BULK). Add All/Lightness/Chroma/Hue tabs to both panels.

## Files to Create/Modify

- \`components/ToneCurve/index.tsx\` — NEW: SVG curve editor
- \`components/FamilyAxisPanel/index.tsx\` — add tabs + ToneCurve below sliders
- \`components/ToneAxisPanel/index.tsx\` — add tabs + ToneCurve (multi-family coloring)

## ToneCurve Props

\`\`\`ts
interface CurvePoint {
  toneValue: number;       // x-axis position (tone value or family index)
  channelValue: number;    // y-axis (L/C/H value)
  color?: string;          // fill color for the dot (right column: family color)
}

interface ToneCurveProps {
  channel: "lightness" | "chroma" | "hue";
  points: CurvePoint[];
  onPointDrag: (toneValue: number, newChannelValue: number) => void;
  columnHeader?: string;
  width?: number;   // default 320
  height?: number;  // default 200
}
\`\`\`

## SVG Layout

- GRAPH_PADDING: top=32 (for tick labels), right=16, bottom=16, left=8
- x-axis: maps toneValue range to graph width
- y-axis: inverted (SVG y increases downward)
  - L: 0–100, C: 0–0.4, H: 0–360
- Axis tick labels: \`<text>\` elements above each point (GRAPH_PADDING.top area)
  - L: 1 decimal, C: 3 decimals, H: 0 decimals
- Polyline connecting all points (sorted by toneValue)
- Circle radius: 6 for interactive points

## Drag Interaction

\`\`\`ts
// Use pointer events on SVG element + pointer capture on circles
// onPointerDown on circle: setPointerCapture, record dragging toneValue
// onPointerMove on SVG: compute new channelValue from clientY, clamp, call onPointDrag
// onPointerUp: clear dragging ref
\`\`\`

## Tabs Structure (both panels)

\`\`\`tsx
<Tabs defaultValue="all">
  <TabList>
    <Tab value="all">All</Tab>
    <Tab value="lightness">Lightness</Tab>
    <Tab value="chroma">Chroma</Tab>
    <Tab value="hue">Hue</Tab>
  </TabList>
  <TabPanels>
    <TabPanel value="all">
      // Lightness graph + "Hue shift" labeled Hue graph stacked
    </TabPanel>
    <TabPanel value="lightness"><ToneCurve channel="lightness" .../></TabPanel>
    <TabPanel value="chroma"><ToneCurve channel="chroma" .../></TabPanel>
    <TabPanel value="hue"><ToneCurve channel="hue" .../></TabPanel>
  </TabPanels>
</Tabs>
\`\`\`

## Right Column (ToneAxisPanel)

Points array: one point per family, x = array index, y = family's channel value at activeToneValue
Each point gets the family's representative color (tone 500 hex).

Drag handler: dispatch UPDATE_TONE_BULK for activeToneValue with the new channel value.

## Column Header

Above each ToneCurve, show the label (family name or tone value) as a Text variant="label.small".

## Acceptance Criteria

- Dragging a point updates the corresponding tone value
- Values clamp to valid channel range
- Tick labels show current channel value above each point
- All tab shows 3 stacked graphs (L, Chroma, Hue)
- Right column points are colored per family
- "Hue shift" label appears before Hue graph
- pnpm build passes
`;export{e as default};