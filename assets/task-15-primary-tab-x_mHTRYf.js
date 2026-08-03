var e=`# Task 15 — Primary Tab: Transparent Scale + Base Tone Selector

## Objective

Implement the Primary tab sidebar content. Add color/primary.ts for alpha calculation, PrimaryTab component for preview, utils/exportTokens.ts for palette.tokens.js export. Replace the Task 12 stub.

## Files to Create/Modify

- \`color/primary.ts\` — NEW: calcAlpha, buildPrimaryScale, DEFAULT_BASE_TONE
- \`utils/exportTokens.ts\` — NEW: exportToPaletteTokensJs
- \`components/PrimaryTab/index.tsx\` — NEW: Primary scale preview + base tone selector
- \`components/FamilyList/index.tsx\` — replace Primary tab stub with <PrimaryTab />

## color/primary.ts

\`\`\`ts
export const DEFAULT_BASE_TONE = 500;

// Alpha formula: on white background: baseChannel * alpha + 255 * (1-alpha) = targetChannel
// → alpha = (255 - targetChannel) / (255 - baseChannel)
export const calcAlpha = (baseHex: string, targetHex: string): number => { ... };

export const buildPrimaryScale = (family: ColorFamily): Array<{
  value: number;
  hex: string;
  rgba: string;
}> => {
  // Tones ABOVE base (smaller value = lighter = above) → use rgba
  // Tones AT OR BELOW base → use original hex (opaque)
  // neutral family: exclude
};
\`\`\`

Key detail: In Aegis palette, smaller tone value = lighter color.
So "above base" = tone.value < baseToneValue → transparent rendering.

## utils/exportTokens.ts

\`\`\`ts
export const exportToPaletteTokensJs = (project: PaletteProject): string => {
  // Output format:
  // export const primaryScale = {
  //   red: { 50: "rgba(255, 0, 0, 0.05)", ... },
  // };
  // Skip "neutral" family
};
\`\`\`

## PrimaryTab Component

For each non-neutral family:
1. Family name + "[familyName baseTone]" button (Button variant="plain")
2. Swatch row showing rgba values on white background container
3. Clicking button → inline Select or small dialog to change base tone → dispatch SET_PRIMARY_BASE_TONE

## Acceptance Criteria

- calcAlpha produces correct alpha for transparent rendering
- buildPrimaryScale: tones above base get rgba, others get original hex
- neutral excluded from Primary tab
- Base tone button dispatches SET_PRIMARY_BASE_TONE
- exportToPaletteTokensJs outputs valid JS with primaryScale export
- pnpm build passes
`;export{e as default};