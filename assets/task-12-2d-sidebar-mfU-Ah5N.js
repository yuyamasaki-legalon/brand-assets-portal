var e=`# Task 12 — 2D Sidebar: Base/Primary Tabs + Interactive Swatches

## Objective

Add Base/Primary tabs to the sidebar pane. In the Base tab, make swatches interactive for 2D selection:
- Row click → SELECT_FAMILY (existing)
- Tone column header click → SELECT_TONE
- Swatch chip click → SELECT_FAMILY + SELECT_TONE

Primary tab shows a stub EmptyState for now (Task 15 will fill it).

## Files to Modify

- \`components/SwatchRow/index.tsx\` — add optional \`activeToneValue\`, \`onSwatchClick\` props
- \`components/FamilyList/index.tsx\` — add Base/Primary Tabs, tone column headers, column highlight
- \`index.tsx\` — add Background Color selector state; pass bg color to PageLayoutContent

## SwatchRow Props Addition

\`\`\`ts
interface SwatchRowProps {
  tones: ToneEntry[];
  activeToneValue?: number | null;      // highlight active tone column
  onSwatchClick?: (toneValue: number) => void;  // makes chips interactive
}
\`\`\`

Active swatch gets: \`outline: "2px solid var(--aegis-color-border-information)"\`, \`outlineOffset: "1px"\`

Interactive chips get: \`role="button"\`, \`tabIndex={0}\`, \`onKeyDown\` for Enter/Space

## FamilyList Structure

\`\`\`
Tabs (base/primary)
  TabList: [Base | Primary]
  TabPanel base:
    - Tone column header row (tone values 50…900, each clickable → SELECT_TONE)
    - Scrollable family list (existing FamilyRow, but SwatchRow now has onSwatchClick)
    - Add family button
  TabPanel primary:
    - EmptyState "Primary は Task 15 で実装します"
\`\`\`

## Column Header Row

- One button per tone value, same width as swatch chip (--aegis-size-medium)
- gap: --aegis-space-x3Small (same as SwatchRow)
- Click → dispatch SELECT_TONE

## Background Color Selector

Local state in index.tsx (NOT in reducer):
\`\`\`ts
const [bgColor, setBgColor] = useState("var(--aegis-color-background-default)");
\`\`\`
Options: White (default), neutral-xSubtle, neutral-subtle
Apply as inline style to the PageLayoutContent div wrapper.

Place Select below the Tabs, outside the scroll area, at the bottom of the pane.

## Acceptance Criteria

- Base tab: existing family list with interactive swatches
- Primary tab: EmptyState stub
- Clicking chip: SELECT_FAMILY + SELECT_TONE dispatched
- Clicking column header: only SELECT_TONE dispatched
- Active tone column chips have info border outline
- Background color selector changes PageLayoutContent background
- pnpm build passes
`;export{e as default};