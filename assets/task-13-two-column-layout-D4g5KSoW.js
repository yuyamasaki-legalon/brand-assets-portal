var e=`# Task 13 — 2-Column Content Layout: FamilyAxisPanel + ToneAxisPanel

## Objective

Replace the single ToneEditor in PageLayoutContent with a 2-column grid:
- Left: FamilyAxisPanel (selected family's all tones, individual L/C/H sliders)
- Right: ToneAxisPanel (selected tone value across all families, bulk L/C/H inputs)

Both panels have a column header label.

## Files to Modify

- \`components/FamilyAxisPanel/index.tsx\` — NEW: extract from ToneEditor, add header + SwatchRow
- \`components/ToneAxisPanel/index.tsx\` — NEW: cross-family view for selected tone
- \`index.tsx\` — replace ToneEditor with 2-column layout

## FamilyAxisPanel

Essentially the existing ToneEditor moved here, with:
1. Header: ContentHeader.Title showing activeFamily.name
2. SwatchRow at top (read-only)
3. Same L/C/H range inputs + hex input per tone
4. Dispatches UPDATE_TONE (unchanged)
5. EmptyState when no family selected

## ToneAxisPanel

\`\`\`ts
// For each family, find tone at activeToneValue
// Show: family name + color chip + L/C/H TextField (type="number")
// Mixed detection: if all families agree → show value; else → show "" with placeholder "mixed"
// onChange → dispatch UPDATE_TONE_BULK
\`\`\`

Family representative color: use \`family.tones.find(t => t.value === (family.primaryBaseTone ?? 500))?.hex ?? "#888"\`

## Layout in index.tsx

\`\`\`tsx
// Replace ToneEditor with:
<div style={{
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "var(--aegis-space-large)",
  height: "100%",
  overflow: "hidden",
}}>
  <FamilyAxisPanel />
  <div style={{
    borderLeft: "1px solid var(--aegis-color-border-neutral)",
    paddingLeft: "var(--aegis-space-large)",
    overflow: "auto",
  }}>
    <ToneAxisPanel />
  </div>
</div>
\`\`\`

## Acceptance Criteria

- FamilyAxisPanel shows empty state when no family selected
- ToneAxisPanel shows empty state when no tone selected
- Left panel dispatches UPDATE_TONE; right panel dispatches UPDATE_TONE_BULK
- Mixed values show "mixed" placeholder
- Column headers show family name / tone value string
- pnpm build passes
`;export{e as default};