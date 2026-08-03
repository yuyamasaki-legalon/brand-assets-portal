var e=`import type { PaletteLabState, PaletteProject } from "./types";

const STORAGE_KEY = "palette-lab:v1";

const toFiniteNumber = (value: unknown, fallback: number): number => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const toNullableFiniteNumber = (value: unknown): number | null => {
  if (value === null || value === undefined) return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

const migrateState = (state: PaletteLabState): PaletteLabState => ({
  ...state,
  activeToneValue: toNullableFiniteNumber(state.activeToneValue),
  projects: state.projects.map((project) => {
    // Support loading old localStorage data that had themes.light / themes.dark structure
    const p = project as PaletteProject & {
      themes?: {
        light?: { appBgLightness?: number; tokenOverrides?: Record<string, string>; paneBackgroundRef?: string };
      };
      activeTheme?: string;
    };
    return {
      ...project,
      colorFamilies: project.colorFamilies.map((family) => ({
        ...family,
        primaryBaseTone: toNullableFiniteNumber(family.primaryBaseTone),
        isBuiltIn: family.isBuiltIn ?? (family.name.toLowerCase() === "neutral" ? true : undefined),
        tones: family.tones.map((tone) => ({
          ...tone,
          chroma: toFiniteNumber(tone.chroma, 0),
          hue: toFiniteNumber(tone.hue, 0),
          lightness: toFiniteNumber(tone.lightness, 50),
          value: toFiniteNumber(tone.value, 0),
        })),
      })),
      appBgLightness: toFiniteNumber(project.appBgLightness ?? p.themes?.light?.appBgLightness, 100),
      paneBackgroundRef: project.paneBackgroundRef ?? p.themes?.light?.paneBackgroundRef ?? "default",
      tokenOverrides: project.tokenOverrides ?? p.themes?.light?.tokenOverrides ?? {},
    };
  }),
});

export const loadState = (): PaletteLabState | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    return migrateState(JSON.parse(raw) as PaletteLabState);
  } catch {
    return null;
  }
};

export const saveState = (state: PaletteLabState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore localStorage errors in sandbox mode.
  }
};
`;export{e as default};