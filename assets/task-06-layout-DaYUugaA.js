var e=`# Task 6 — Page Layout: index.tsx

## Objective
Update the existing \`index.tsx\` to render the full 3-panel page layout: header with project controls and action buttons, a 240px sidebar, and a main content area. Wire all panels to placeholder components that will be filled in subsequent tasks.

## Input (what exists before this task)
- \`index.tsx\` — existing file (already registered in sandbox routing)
- \`store/context.tsx\` from Task 4 (\`PaletteLabProvider\`, \`usePaletteLabContext\`)
- \`store/types.ts\` from Task 2
- \`components/FamilyList/index.tsx\` stub from Task 1
- \`components/ToneEditor/index.tsx\` stub from Task 1
- \`components/ExportButton/index.tsx\` stub from Task 1
- \`components/ProjectSelector/index.tsx\` stub from Task 1
- \`assets/palette-initial.json\` from Task 1

## Output (what to create / modify)
- \`index.tsx\` — fully updated with layout structure and provider wiring

## Acceptance Criteria
- [ ] \`PaletteLabProvider\` wraps the entire page content
- [ ] \`PageLayout\` is used as the top-level layout wrapper
- [ ] A header exists with the title "Palette Lab", a \`ProjectSelector\` component, and two buttons: "Import seed" and "Export" (Export can be the \`ExportButton\` component stub)
- [ ] A sidebar (visual width approximately 240px) renders \`FamilyList\`
- [ ] The main content area renders \`ToneEditor\`
- [ ] Page renders without runtime errors even when component stubs return \`null\` or \`<></>\`
- [ ] No TypeScript errors; \`pnpm build\` passes

## Implementation Notes

### Checking PageLayout API

Before writing layout code, use \`mcp__aegis__get_component_detail("PageLayout")\` to verify the current props for \`PageLayout\`, \`PageLayoutHeader\`, \`PageLayoutBody\`, \`PageLayoutSidebar\`, and \`PageLayoutContent\`. The exact prop names (e.g. \`sidebarWidth\` vs \`width\`, \`title\` vs a child slot) may differ from assumptions in this document.

### Minimum viable structure

\`\`\`tsx
import { PaletteLabProvider } from "./store/context";
import { FamilyList } from "./components/FamilyList";
import { ToneEditor } from "./components/ToneEditor";
import { ExportButton } from "./components/ExportButton";
import { ProjectSelector } from "./components/ProjectSelector";
// Aegis imports — verify exact names with MCP
import { PageLayout, PageLayoutHeader, PageLayoutBody, PageLayoutSidebar, PageLayoutContent } from "@legalforce/aegis-react";

const PaletteLabContent = () => (
  <PageLayout>
    <PageLayoutHeader>
      {/* Title, ProjectSelector, Import button, ExportButton */}
    </PageLayoutHeader>
    <PageLayoutBody>
      <PageLayoutSidebar>
        <FamilyList />
      </PageLayoutSidebar>
      <PageLayoutContent>
        <ToneEditor />
      </PageLayoutContent>
    </PageLayoutBody>
  </PageLayout>
);

const PaletteLabPage = () => (
  <PaletteLabProvider>
    <PaletteLabContent />
  </PaletteLabProvider>
);

export default PaletteLabPage;
\`\`\`

### Import seed button

For Phase 1, the "Import seed" button resets the active project back to the Aegis default palette. Implement a simple \`onClick\` handler that calls \`importFromPaletteJson(paletteInitial)\` and dispatches \`IMPORT_PALETTE\`. Import \`usePaletteLabContext\`, \`importFromPaletteJson\`, and \`paletteInitial\` in \`PaletteLabContent\`.

\`\`\`tsx
import { importFromPaletteJson } from "./seed/seed";
import paletteInitial from "./assets/palette-initial.json";

// inside PaletteLabContent:
const { dispatch } = usePaletteLabContext();

const handleImportSeed = () => {
  const project = importFromPaletteJson(
    paletteInitial as Record<string, Record<string, string>>,
    "Aegis Default (imported)",
  );
  dispatch({ type: "IMPORT_PALETTE", payload: { project } });
};
\`\`\`

Use an Aegis \`Button\` with appropriate variant for the Import button. Check \`mcp__aegis__get_component_detail("Button")\` for correct props.

### Sidebar width

If \`PageLayoutSidebar\` accepts a width prop, pass \`240\`. If it does not accept a width (fixed by design), use the default and note this in a comment. Do NOT use inline style on the sidebar to override width without checking whether that breaks the layout system.

### Rendering stubs gracefully

Components that return \`null\` from stubs will leave blank panels — this is acceptable. Do NOT add \`|| <span>Loading…</span>\` guards at this stage. The panels will be populated in Tasks 7–10.
`;export{e as default};