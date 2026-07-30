var e=`# Task 4 — State Management: store/reducer.ts, store/context.tsx, store/storage.ts

## Objective
Implement the complete Redux-style state management layer: a pure reducer, a React context/provider, and localStorage persistence utilities. When no saved state exists, the provider initializes with the Aegis seed palette.

## Input (what exists before this task)
- \`store/types.ts\` from Task 2
- \`store/actions.ts\` stub from Task 1 (will be fully implemented here)
- \`store/reducer.ts\` stub from Task 1
- \`store/context.tsx\` stub from Task 1
- \`store/storage.ts\` stub from Task 1
- \`seed/seed.ts\` stub (NOTE: the actual \`importFromPaletteJson\` is implemented in Task 5, but \`context.tsx\` will call it — ensure Task 5 is complete before wiring the Provider, or use a lazy import pattern)
- \`assets/palette-initial.json\` from Task 1

## Output (what to create / modify)
- \`store/actions.ts\` — full discriminated union of all action types
- \`store/reducer.ts\` — pure reducer function
- \`store/context.tsx\` — context, provider, and hook
- \`store/storage.ts\` — \`loadState\` / \`saveState\`

## Acceptance Criteria
- [ ] \`store/actions.ts\` exports \`PaletteLabAction\` as a discriminated union covering all 10 action types
- [ ] \`reducer\` is a pure function: same input always produces same output, no side effects
- [ ] All 10 action types are handled; unmatched actions return state unchanged
- [ ] \`PaletteLabProvider\` loads from \`loadState()\` on mount; falls back to seed if null
- [ ] \`usePaletteLabContext()\` throws a descriptive error when called outside a Provider
- [ ] State is saved to localStorage after every dispatch
- [ ] \`pnpm build\` passes with no errors

## Implementation Notes

### store/actions.ts

Define the discriminated union. Use \`type\` (not \`interface\`) for each action variant, then union them:

\`\`\`typescript
import type { ToneEntry, PaletteProject } from "./types";

export type PaletteLabAction =
  | { type: "ADD_PROJECT"; payload: { name: string } }
  | { type: "DELETE_PROJECT"; payload: { projectId: string } }
  | { type: "SELECT_PROJECT"; payload: { projectId: string } }
  | { type: "ADD_FAMILY"; payload: { name: string } }
  | { type: "DELETE_FAMILY"; payload: { familyId: string } }
  | { type: "SELECT_FAMILY"; payload: { familyId: string } }
  | { type: "RENAME_FAMILY"; payload: { familyId: string; name: string } }
  | { type: "ADD_TONE"; payload: { familyId: string; toneValue: number } }
  | { type: "DELETE_TONE"; payload: { familyId: string; toneValue: number } }
  | {
      type: "UPDATE_TONE";
      payload: {
        familyId: string;
        toneValue: number;
        patch: Partial<Pick<ToneEntry, "lightness" | "chroma" | "hue" | "hex" | "alphaMode">>;
      };
    }
  | { type: "IMPORT_PALETTE"; payload: { project: PaletteProject } };
\`\`\`

### store/reducer.ts

Key implementation details for each action:

**ADD_PROJECT**: Create a new \`PaletteProject\` with \`crypto.randomUUID()\`, an empty \`colorFamilies: []\`, current ISO timestamp for both \`createdAt\` and \`updatedAt\`. Append to \`projects\`. Set \`activeProjectId\` to the new project's id. Set \`activeFamilyId\` to null.

**DELETE_PROJECT**: Filter out the project by id. If \`activeProjectId === projectId\`, set \`activeProjectId\` to \`projects[0]?.id ?? null\` (first remaining project) and reset \`activeFamilyId\` to null.

**SELECT_PROJECT**: Set \`activeProjectId\`. Set \`activeFamilyId\` to the first family of the newly selected project (\`projects.find(p => p.id === projectId)?.colorFamilies[0]?.id ?? null\`).

**ADD_FAMILY**: Only acts on the active project (guard: if \`activeProjectId === null\`, return state unchanged). Create a \`ColorFamily\` with \`crypto.randomUUID()\`, the provided name, and 10 default tones built from \`DEFAULT_TONE_VALUES\`. Each tone: \`{ value, lightness: AEGIS_FIXED_LIGHTNESS[String(value)] ?? 50, chroma: 0.1, hue: 0, alphaMode: "none", hex: computeHex({...}) }\`. Append family to the active project's \`colorFamilies\`. Set \`activeFamilyId\` to the new family's id.

**ADD_TONE**: Find the family by \`familyId\` in the active project. Append a new \`ToneEntry\` with \`value: toneValue\`, default lightness from \`AEGIS_FIXED_LIGHTNESS[String(toneValue)] ?? 50\`, \`chroma: 0.1\`, \`hue: 0\`, \`alphaMode: "none"\`, \`hex: computeHex(...)\`. Re-sort \`tones\` by \`value\` ascending after appending.

**UPDATE_TONE**: Find the matching tone by \`familyId\` + \`toneValue\`. Merge \`patch\` into the tone. If \`patch.lightness\`, \`patch.chroma\`, or \`patch.hue\` is present (and \`patch.hex\` is NOT explicitly provided), recompute \`hex\` via \`computeHex\` with the updated L/C/H values. Update \`updatedAt\` on the parent project.

**IMPORT_PALETTE**: Check if a project with the same \`id\` already exists in \`projects\`. If yes, replace it (map over array). If no, append it. Set \`activeProjectId\` to the imported project's id. Set \`activeFamilyId\` to the first family's id.

For all family/tone mutations, remember to update \`updatedAt: new Date().toISOString()\` on the active project.

Use immutable update patterns throughout (spread operators, \`map\`, \`filter\`). Never mutate the state object directly.

### store/storage.ts

\`\`\`typescript
import type { PaletteLabState } from "./types";

const STORAGE_KEY = "palette-lab:v1";

export const loadState = (): PaletteLabState | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PaletteLabState;
  } catch {
    return null;
  }
};

export const saveState = (state: PaletteLabState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota errors in sandbox context
  }
};
\`\`\`

The \`JSON.parse(raw) as PaletteLabState\` cast is acceptable here since we control the schema and a corrupt entry returns null. Do not add runtime validation — it is out of scope for Phase 1.

### store/context.tsx

\`\`\`typescript
import { createContext, useContext, useReducer, useEffect } from "react";
import type { ReactNode } from "react";
import type { PaletteLabState } from "./types";
import type { PaletteLabAction } from "./actions";
import { reducer } from "./reducer";
import { loadState, saveState } from "./storage";
// import { importFromPaletteJson } from "../seed/seed";  ← add after Task 5
// import paletteInitial from "../assets/palette-initial.json";  ← add after Task 5

type PaletteLabContextValue = {
  state: PaletteLabState;
  dispatch: React.Dispatch<PaletteLabAction>;
};

const PaletteLabContext = createContext<PaletteLabContextValue | null>(null);

const INITIAL_STATE: PaletteLabState = {
  projects: [],
  activeProjectId: null,
  activeFamilyId: null,
};

export const PaletteLabProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(
    reducer,
    null,
    () => loadState() ?? INITIAL_STATE,
  );

  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <PaletteLabContext.Provider value={{ state, dispatch }}>
      {children}
    </PaletteLabContext.Provider>
  );
};

export const usePaletteLabContext = (): PaletteLabContextValue => {
  const ctx = useContext(PaletteLabContext);
  if (!ctx) {
    throw new Error("usePaletteLabContext must be used inside PaletteLabProvider");
  }
  return ctx;
};
\`\`\`

**Seed initialization**: After Task 5 is complete, update the initializer lazy function:

\`\`\`typescript
() => {
  const saved = loadState();
  if (saved && saved.projects.length > 0) return saved;
  const seedProject = importFromPaletteJson(paletteInitial as Record<string, Record<string, string>>);
  return {
    projects: [seedProject],
    activeProjectId: seedProject.id,
    activeFamilyId: seedProject.colorFamilies[0]?.id ?? null,
  };
}
\`\`\`

This means Task 4 can be implemented partially (with \`INITIAL_STATE\` fallback) and completed after Task 5.
`;export{e as default};