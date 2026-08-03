var e=`# Task 7 — Family List: components/FamilyList/index.tsx

## Objective
Implement the left sidebar's color family list. Each row shows the family name, a compact swatch strip, and a delete button. An "Add family" button at the bottom creates a new family. Clicking a row selects it as the active family.

## Input (what exists before this task)
- \`components/FamilyList/index.tsx\` stub from Task 1
- \`store/context.tsx\` from Task 4 (\`usePaletteLabContext\`)
- \`store/types.ts\` from Task 2 (\`ColorFamily\`, \`ToneEntry\`)
- \`components/SwatchRow/index.tsx\` stub from Task 1 (will be implemented in Task 8; FamilyList imports it regardless — it will render nothing until Task 8 is done)
- \`color/oklch.ts\` from Task 3 (\`AEGIS_FIXED_LIGHTNESS\`)

## Output (what to create / modify)
- \`components/FamilyList/index.tsx\` — full implementation replacing the stub

## Acceptance Criteria
- [ ] All color families from the active project are listed
- [ ] Clicking a family row dispatches \`SELECT_FAMILY\` and visually highlights the active row
- [ ] Each row contains the family name and a \`SwatchRow\` (passes \`family.tones\` as prop)
- [ ] "Add family" button at bottom dispatches \`ADD_FAMILY\` with name \`"New family"\` and 10 default tones
- [ ] Each row has an icon delete button that dispatches \`DELETE_FAMILY\`
- [ ] All interactive elements use \`@legalforce/aegis-react\` components
- [ ] Component renders correctly when there are 0 families (shows only "Add family" button)
- [ ] No \`any\` types; \`pnpm build\` passes

## Implementation Notes

### State reading

\`\`\`tsx
const { state, dispatch } = usePaletteLabContext();
const activeProject = state.projects.find((p) => p.id === state.activeProjectId);
const families = activeProject?.colorFamilies ?? [];
\`\`\`

### ADD_FAMILY dispatch

The reducer handles building the 10 default tones — \`FamilyList\` just dispatches with a name:

\`\`\`tsx
dispatch({ type: "ADD_FAMILY", payload: { name: "New family" } });
\`\`\`

### Row highlight

Use Aegis design tokens for selected-state styling. Do NOT hardcode hex colors. Look up a background token (e.g. \`var(--aegis-color-background-neutral-xSubtle)\` or similar) using \`mcp__aegis__list_tokens\` to find the correct token name for a selected/active row background.

For the visual highlight, apply a CSS class or inline style with the token when \`family.id === state.activeFamilyId\`. Use Aegis \`Text\` with the appropriate style for the family name.

### Delete button

Check \`mcp__aegis__get_component_detail("IconButton")\` for the correct props. Use an appropriate delete/trash icon — check \`mcp__aegis__list_icons\` for an icon matching "delete" or "trash". Do NOT delete the last remaining family without confirmation (for Phase 1, it is acceptable to allow deleting all families — an empty list is a valid state).

Prevent the delete click from also triggering the row's \`SELECT_FAMILY\` dispatch using \`event.stopPropagation()\`.

### Layout structure

\`\`\`tsx
<div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
  <div style={{ flex: 1, overflowY: "auto" }}>
    {families.map((family) => (
      <FamilyRow
        key={family.id}
        family={family}
        isActive={family.id === state.activeFamilyId}
        onSelect={() => dispatch({ type: "SELECT_FAMILY", payload: { familyId: family.id } })}
        onDelete={() => dispatch({ type: "DELETE_FAMILY", payload: { familyId: family.id } })}
      />
    ))}
  </div>
  <div style={{ padding: "8px" }}>
    <Button onClick={handleAddFamily} /* Aegis Button, check props */ >
      + Add family
    </Button>
  </div>
</div>
\`\`\`

Consider extracting a \`FamilyRow\` sub-component within the same file (not a separate file) for readability.

### Imports

\`\`\`typescript
import type { ColorFamily } from "../../store/types";
import { usePaletteLabContext } from "../../store/context";
import { SwatchRow } from "../SwatchRow";
// Aegis components — verify props with MCP:
import { Button, IconButton, Text } from "@legalforce/aegis-react";
\`\`\`
`;export{e as default};