var e=`# Task 8 — Swatch Row: components/SwatchRow/index.tsx

## Objective
Implement a pure presentational component that renders a horizontal row of color chips for a given list of tone entries. Used inside \`FamilyList\` as a compact visual summary of a color family.

## Input (what exists before this task)
- \`components/SwatchRow/index.tsx\` stub from Task 1
- \`store/types.ts\` from Task 2 (\`ToneEntry\`)

## Output (what to create / modify)
- \`components/SwatchRow/index.tsx\` — full implementation replacing the stub

## Acceptance Criteria
- [ ] Component accepts \`tones: ToneEntry[]\` as its only required prop
- [ ] Renders a horizontal flex row of color chips
- [ ] Each chip is 20×20px with \`background-color: tone.hex\`
- [ ] Each chip has a border-radius using the Aegis small radius token
- [ ] The tone value number is displayed below each chip in \`Text variant="label.xSmall"\` (or the equivalent smallest Aegis text variant)
- [ ] Component has no side effects and does not read from context
- [ ] Renders correctly when \`tones\` is an empty array (renders nothing or an empty container)
- [ ] \`pnpm build\` passes with no TypeScript errors

## Implementation Notes

### Props interface

\`\`\`typescript
import type { ToneEntry } from "../../store/types";

interface SwatchRowProps {
  tones: ToneEntry[];
}
\`\`\`

### Chip element

Use a plain \`<div>\` for each chip — no Aegis wrapper is needed here since these are raw color preview blocks. The chip must not be interactive (no onClick, no hover state for Phase 1).

\`\`\`tsx
<div
  style={{
    width: 20,
    height: 20,
    backgroundColor: tone.hex,
    borderRadius: "var(--aegis-radius-small)",  // verify token name with mcp__aegis__list_tokens
    flexShrink: 0,
  }}
/>
\`\`\`

Check the correct Aegis radius token name using \`mcp__aegis__list_tokens\` filtered to radius tokens. If \`--aegis-radius-small\` does not exist, look for an equivalent (e.g. \`--aegis-border-radius-small\` or a spacing-based value like \`2px\`).

### Label below chip

Use an Aegis \`Text\` component for the tone value number. Check \`mcp__aegis__get_component_detail("Text")\` for the available \`variant\` prop values. Use the smallest available variant (likely \`"label.xSmall"\` or \`"caption"\`).

\`\`\`tsx
<Text variant="label.xSmall" style={{ textAlign: "center", display: "block" }}>
  {tone.value}
</Text>
\`\`\`

### Full component structure

\`\`\`tsx
export const SwatchRow = ({ tones }: SwatchRowProps) => (
  <div style={{ display: "flex", flexDirection: "row", gap: 2, alignItems: "flex-start" }}>
    {tones.map((tone) => (
      <div key={tone.value} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            width: 20,
            height: 20,
            backgroundColor: tone.hex,
            borderRadius: "var(--aegis-radius-small)",
            flexShrink: 0,
          }}
        />
        <Text variant="label.xSmall">{tone.value}</Text>
      </div>
    ))}
  </div>
);
\`\`\`

### Ordering

Tones are expected to already be sorted ascending by \`value\` (the reducer guarantees this). Do not sort inside \`SwatchRow\` — it is a pure display component and should not have knowledge of business rules.

### Imports

\`\`\`typescript
import type { ToneEntry } from "../../store/types";
import { Text } from "@legalforce/aegis-react";
\`\`\`
`;export{e as default};