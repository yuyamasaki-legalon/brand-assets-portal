var e=`# Task 10 — Export and Project Management

## Objective
Implement the \`exportToPaletteJson\` utility, the \`ExportButton\` component that downloads the output JSON, and the \`ProjectSelector\` dropdown that lets users switch between projects and create new ones.

## Input (what exists before this task)
- \`utils/export.ts\` stub from Task 1
- \`components/ExportButton/index.tsx\` stub from Task 1
- \`components/ProjectSelector/index.tsx\` stub from Task 1
- \`store/context.tsx\` from Task 4
- \`store/types.ts\` from Task 2 (\`PaletteProject\`, \`PaletteLabState\`)
- \`index.tsx\` layout from Task 6

## Output (what to create / modify)
- \`utils/export.ts\` — full implementation
- \`components/ExportButton/index.tsx\` — full implementation
- \`components/ProjectSelector/index.tsx\` — full implementation
- \`index.tsx\` — wire \`ExportButton\` and \`ProjectSelector\` into the header (if not already done in Task 6)

## Acceptance Criteria
- [ ] \`exportToPaletteJson(project)\` returns an object matching \`{ familyName: { "50": "#hex", "100": "#hex", ... } }\`
- [ ] Exported JSON structure is identical in shape to \`assets/palette-initial.json\`
- [ ] Clicking \`ExportButton\` triggers a file download named \`palette.json\` (or \`{projectName}-palette.json\`)
- [ ] \`ProjectSelector\` lists all projects in a dropdown; selecting one dispatches \`SELECT_PROJECT\`
- [ ] \`ProjectSelector\` has a "新規プロジェクト..." option that dispatches \`ADD_PROJECT\` with a default name
- [ ] All interactive elements use \`@legalforce/aegis-react\` components
- [ ] \`pnpm build\` passes with no TypeScript errors

## Implementation Notes

### utils/export.ts

\`\`\`typescript
import type { PaletteProject } from "../store/types";

export const exportToPaletteJson = (
  project: PaletteProject,
): Record<string, Record<string, string>> => {
  const result: Record<string, Record<string, string>> = {};

  for (const family of project.colorFamilies) {
    const toneMap: Record<string, string> = {};
    // tones are already sorted ascending by value (guaranteed by reducer)
    for (const tone of family.tones) {
      toneMap[String(tone.value)] = tone.hex;
    }
    result[family.name] = toneMap;
  }

  return result;
};
\`\`\`

No dependencies on culori or context — pure data transformation.

### components/ExportButton/index.tsx

The component reads the active project from context, calls \`exportToPaletteJson\`, and triggers a browser download:

\`\`\`typescript
import { usePaletteLabContext } from "../../store/context";
import { exportToPaletteJson } from "../../utils/export";
import { Button } from "@legalforce/aegis-react";

export const ExportButton = () => {
  const { state } = usePaletteLabContext();
  const activeProject = state.projects.find((p) => p.id === state.activeProjectId);

  const handleExport = () => {
    if (!activeProject) return;
    const data = exportToPaletteJson(activeProject);
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = \`\${activeProject.name.replace(/\\s+/g, "-").toLowerCase()}-palette.json\`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={handleExport} disabled={!activeProject}>
      Export palette.json
    </Button>
  );
};
\`\`\`

Check \`mcp__aegis__get_component_detail("Button")\` for correct props (\`variant\`, \`size\`, etc.). Use a secondary/outline variant to distinguish it from a primary CTA.

### components/ProjectSelector/index.tsx

Use Aegis \`Select\` (check \`mcp__aegis__get_component_detail("Select")\` for props). The options list is derived from \`state.projects\`. A special sentinel option with value \`"__new__"\` triggers project creation.

\`\`\`typescript
import { usePaletteLabContext } from "../../store/context";
import { Select } from "@legalforce/aegis-react";  // verify component name with MCP

const NEW_PROJECT_SENTINEL = "__new__";

export const ProjectSelector = () => {
  const { state, dispatch } = usePaletteLabContext();

  const options = [
    ...state.projects.map((p) => ({ label: p.name, value: p.id })),
    { label: "新規プロジェクト...", value: NEW_PROJECT_SENTINEL },
  ];

  const handleChange = (value: string) => {
    if (value === NEW_PROJECT_SENTINEL) {
      dispatch({ type: "ADD_PROJECT", payload: { name: "New project" } });
    } else {
      dispatch({ type: "SELECT_PROJECT", payload: { projectId: value } });
    }
  };

  return (
    <Select
      options={options}
      value={state.activeProjectId ?? ""}
      onChange={handleChange}
    />
  );
};
\`\`\`

**Important**: Check \`mcp__aegis__get_component_detail("Select")\` before writing — the Aegis \`Select\` API may use \`onChange\` with an event object rather than a value string, or may have a different option shape (e.g. \`{ children, value }\` rather than \`{ label, value }\`). Adapt accordingly.

If the Aegis \`Select\` component does not support \`onChange\` receiving the value directly, use a native \`<select>\` as a fallback — this is a sandbox prototype.

### Wiring into index.tsx

If Task 6 already added \`ExportButton\` and \`ProjectSelector\` as stubs in the header, they will now render correctly after this task. No changes to \`index.tsx\` are required unless the components were not imported.

If \`index.tsx\` still has placeholder \`<div>\` elements in the header for these components, replace them with the actual imports and component JSX.

### Imports summary

\`\`\`typescript
// utils/export.ts
import type { PaletteProject } from "../store/types";

// components/ExportButton/index.tsx
import type { ... } from "../../store/types";
import { usePaletteLabContext } from "../../store/context";
import { exportToPaletteJson } from "../../utils/export";
import { Button } from "@legalforce/aegis-react";

// components/ProjectSelector/index.tsx
import { usePaletteLabContext } from "../../store/context";
import { Select } from "@legalforce/aegis-react";
\`\`\`
`;export{e as default};