var e=`# Task 9 — Tone Editor: components/ToneEditor/index.tsx

## Objective
Implement the main content panel. For each tone in the active color family, render a row with L/C/H sliders, a hex text input, and a color preview chip. Provide controls to add and delete tones.

## Input (what exists before this task)
- \`components/ToneEditor/index.tsx\` stub from Task 1
- \`store/context.tsx\` from Task 4
- \`store/types.ts\` from Task 2
- \`color/oklch.ts\` from Task 3 (\`hexToOklchChannels\`, \`computeHex\`)

## Output (what to create / modify)
- \`components/ToneEditor/index.tsx\` — full implementation replacing the stub

## Acceptance Criteria
- [ ] Renders all tones of the active color family in a table/grid layout
- [ ] Each row displays: tone value (label), L slider (0–100), C slider (0–0.4), H slider (0–360), hex text input, 40×40px color chip
- [ ] Moving any slider dispatches \`UPDATE_TONE\` with the new channel value; hex is recomputed by the reducer
- [ ] Editing the hex input (on blur or Enter) parses the hex to OKLCH via \`hexToOklchChannels\` and dispatches \`UPDATE_TONE\` with the full L/C/H+hex patch
- [ ] "Add tone" button opens a dialog or prompt asking for a tone value; dispatches \`ADD_TONE\` on confirm
- [ ] "Add tone" は既存の \`toneValue\` と重複する値を入力した場合、dispatch せずエラーメッセージを表示する（reducer に重複チェックがないため UI 側でガードする）
- [ ] Each tone row has a delete button; dispatches \`DELETE_TONE\`
- [ ] Renders an empty state message when no family is selected or the family has no tones
- [ ] No \`any\` types; \`pnpm build\` passes

## Implementation Notes

### State reading

\`\`\`tsx
const { state, dispatch } = usePaletteLabContext();
const activeProject = state.projects.find((p) => p.id === state.activeProjectId);
const activeFamily = activeProject?.colorFamilies.find((f) => f.id === state.activeFamilyId);
\`\`\`

If \`activeFamily\` is undefined, render an empty state message: "カラーファミリーを選択してください" using \`EmptyState\` or a simple \`Text\` component.

### Slider component decision

Check \`mcp__aegis__list_components\` for a "Slider" component. If found, check \`mcp__aegis__get_component_detail("Slider")\` for its props (min, max, step, value, onChange). Use it for all three channels.

If no Aegis Slider exists, use a native \`<input type="range">\` with appropriate \`min\`, \`max\`, \`step\` attributes, styled to be visually acceptable (no custom CSS needed for Phase 1 sandbox).

Slider specifications:
- L: \`min={0}\` \`max={100}\` \`step={0.1}\`
- C: \`min={0}\` \`max={0.4}\` \`step={0.001}\`
- H: \`min={0}\` \`max={360}\` \`step={1}\`

### Slider onChange handler

When a slider changes, dispatch \`UPDATE_TONE\`. The reducer recomputes hex. Do NOT call \`computeHex\` in the component — let the reducer own that logic.

\`\`\`tsx
const handleLChange = (toneValue: number, newL: number) => {
  dispatch({
    type: "UPDATE_TONE",
    payload: { familyId: activeFamily.id, toneValue, patch: { lightness: newL } },
  });
};
\`\`\`

### Hex input handler

On blur or Enter keypress, parse the current input value and dispatch a full OKLCH patch:

\`\`\`tsx
const handleHexChange = (toneValue: number, hexInput: string) => {
  const normalized = hexInput.startsWith("#") ? hexInput : \`#\${hexInput}\`;
  if (!/^#[0-9a-fA-F]{6}$/.test(normalized)) return; // ignore invalid input
  const channels = hexToOklchChannels(normalized);
  dispatch({
    type: "UPDATE_TONE",
    payload: {
      familyId: activeFamily.id,
      toneValue,
      patch: {
        lightness: channels.l,
        chroma: channels.c,
        hue: channels.h,
        hex: normalized,
      },
    },
  });
};
\`\`\`

For the hex text input, use Aegis \`TextField\` (check \`mcp__aegis__get_component_detail("TextField")\` for props). Maintain a local \`useState\` for the input value while typing, and only dispatch on blur/Enter to avoid dispatching on every keystroke.

### Add tone dialog

Check \`mcp__aegis__get_component_detail("Dialog")\` for the Aegis Dialog component. Use it to prompt for a tone value number. If Dialog is complex to wire, an acceptable Phase 1 fallback is \`window.prompt("トーン値を入力 (例: 550):") \` — but prefer Dialog.

\`\`\`tsx
const [addToneDialogOpen, setAddToneDialogOpen] = useState(false);
const [newToneValue, setNewToneValue] = useState("");

const handleAddTone = () => {
  const value = Number(newToneValue);
  if (!Number.isNaN(value) && value > 0) {
    dispatch({ type: "ADD_TONE", payload: { familyId: activeFamily.id, toneValue: value } });
    setAddToneDialogOpen(false);
    setNewToneValue("");
  }
};
\`\`\`

### Row layout

Use CSS grid or a simple table. Suggested column widths:
- Tone value label: 48px, right-aligned
- L slider: flex 1
- C slider: flex 1
- H slider: flex 1
- Hex input: 100px
- Color chip: 40px
- Delete button: 36px

\`\`\`tsx
<div
  style={{
    display: "grid",
    gridTemplateColumns: "48px 1fr 1fr 1fr 100px 40px 36px",
    gap: 8,
    alignItems: "center",
  }}
>
\`\`\`

### Color chip

\`\`\`tsx
<div
  style={{
    width: 40,
    height: 40,
    backgroundColor: tone.hex,
    borderRadius: "var(--aegis-radius-small)",
    border: "1px solid var(--aegis-color-border-neutral)",
  }}
/>
\`\`\`

Verify border token name with \`mcp__aegis__list_tokens\`.

### Imports

\`\`\`typescript
import { useState } from "react";
import type { ToneEntry } from "../../store/types";
import { usePaletteLabContext } from "../../store/context";
import { hexToOklchChannels } from "../../color/oklch";
// Aegis — verify props with MCP:
import { Button, IconButton, TextField, Text } from "@legalforce/aegis-react";
\`\`\`
`;export{e as default};