var e=`export interface OklchChannels {
  l: number;
  c: number;
  h: number;
}

export interface ToneEntry {
  value: number;
  lightness: number;
  chroma: number;
  hue: number;
  alphaMode: "none" | "transparent" | "primary";
  hex: string;
}

export interface ColorFamily {
  id: string;
  name: string;
  tones: ToneEntry[];
  primaryBaseTone: number | null;
  isBuiltIn?: boolean;
}

export interface PaletteProject {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  colorFamilies: ColorFamily[];
  appBgLightness: number;
  paneBackgroundRef: string;
  tokenOverrides: Record<string, string>;
}

export type Gamut = "sRGB" | "Display P3";

export interface PaletteLabState {
  projects: PaletteProject[];
  activeProjectId: string | null;
  activeFamilyId: string | null;
  activeToneValue: number | null;
  gamut: Gamut;
}

export const AEGIS_FIXED_LIGHTNESS: Readonly<Record<string, number>> = {
  "950": 22,
  "900": 31.71,
  "800": 40.91,
  "700": 50.68,
  "600": 55.55,
  "500": 61.7,
  "400": 79.5,
  "300": 88,
  "200": 93.5,
  "100": 96.5,
  "50": 98.2,
};

export const DEFAULT_TONE_VALUES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

// Sentinel numeric value for the v2 "alt500" JSON key (v2-only legacy concept).
// Used in seed.ts to parse legacy "alt500" JSON keys → internal tone value 450.
export const ALT_TONE_SENTINEL = 450;

// Returns the display label for a tone value.
export const toneLabel = (value: number): string => String(value);

// Anchor-only tones (0 = pure white, 1000 = pure black) used for export calculations; not shown in UI
export const isDisplayTone = (value: number): boolean => value !== 0 && value !== 1000;
`;export{e as default};