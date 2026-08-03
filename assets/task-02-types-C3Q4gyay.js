var e=`# Task 2 — Type Definitions: store/types.ts

## Objective
Implement all shared TypeScript interfaces and constants in \`store/types.ts\`. This file is the single source of truth for data shapes used across the entire palette-lab module.

## Input (what exists before this task)
- \`store/types.ts\` stub from Task 1
- \`docs/design.md\` (data model section)

## Output (what to create / modify)
- \`store/types.ts\` — full implementation replacing the stub

## Acceptance Criteria
- [ ] All five interfaces are exported: \`OklchChannels\`, \`ToneEntry\`, \`ColorFamily\`, \`PaletteProject\`, \`PaletteLabState\`
- [ ] \`ToneEntry.alphaMode\` is typed as the union \`"none" | "transparent" | "primary"\` (not \`string\`)
- [ ] \`AEGIS_FIXED_LIGHTNESS\` is exported as \`Readonly<Record<string, number>>\` with all 11 keys
- [ ] \`DEFAULT_TONE_VALUES\` is exported as \`readonly number[]\` (or \`readonly [50, 100, 200, ...]\` tuple)
- [ ] File has no \`any\` types
- [ ] \`pnpm build\` (or \`tsc --noEmit\`) passes with no errors in this file

## Implementation Notes

### Interface definitions

Implement exactly these interfaces (no extra fields):

\`\`\`typescript
export interface OklchChannels {
  l: number; // 0–100 (percentage, Aegis convention)
  c: number; // 0–0.4 (culori native unit)
  h: number; // 0–360 (degrees)
}

export interface ToneEntry {
  value: number;
  lightness: number;   // OKLCH L, 0–100
  chroma: number;      // OKLCH C, 0–0.4
  hue: number;         // OKLCH H, 0–360
  alphaMode: "none" | "transparent" | "primary";
  hex: string;
}

export interface ColorFamily {
  id: string;
  name: string;
  tones: ToneEntry[];
}

export interface PaletteProject {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  colorFamilies: ColorFamily[];
}

export interface PaletteLabState {
  projects: PaletteProject[];
  activeProjectId: string | null;
  activeFamilyId: string | null;
}
\`\`\`

### AEGIS_FIXED_LIGHTNESS

Copy these exact values from \`sandbox-builder/token-overrides/color-utils.ts\` FIXED_LIGHTNESS. Do NOT import from sandbox-builder — replicate the values here as a constant:

\`\`\`typescript
export const AEGIS_FIXED_LIGHTNESS: Readonly<Record<string, number>> = {
  "900": 21.3,
  "800": 29,
  "700": 38,
  "600": 47.8,
  "500": 59.1,
  "alt500": 67,
  "400": 78.1,
  "300": 91,
  "200": 94.5,
  "100": 96.5,
  "50": 98.21,
};
\`\`\`

Note: the key \`"alt500"\` is present for completeness but \`DEFAULT_TONE_VALUES\` does not include it (it is a variant, not a standard scale step).

### DEFAULT_TONE_VALUES

\`\`\`typescript
export const DEFAULT_TONE_VALUES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
\`\`\`

Using \`as const\` makes the array \`readonly\` and gives each element a literal type, which is useful for tone-value exhaustiveness checks later.

### Import discipline

This file must have zero imports — it contains only interfaces and constants. No React, no culori, no cross-module dependencies. This keeps it safe to import from any other file without circular dependency risk.
`;export{e as default};