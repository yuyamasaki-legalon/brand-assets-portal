var e=`import { computeHex, oklchToHex } from "../color/oklch";
import type { PaletteLabAction } from "./actions";
import {
  AEGIS_FIXED_LIGHTNESS,
  type ColorFamily,
  DEFAULT_TONE_VALUES,
  type PaletteLabState,
  type PaletteProject,
  type ToneEntry,
  toneLabel,
} from "./types";

const createTimestamp = (): string => new Date().toISOString();

const createDefaultTone = (toneValue: number): ToneEntry => {
  const baseTone = {
    value: toneValue,
    lightness: AEGIS_FIXED_LIGHTNESS[toneLabel(toneValue)] ?? 50,
    chroma: 0.1,
    hue: 0,
    alphaMode: "none" as const,
  };

  return {
    ...baseTone,
    hex: oklchToHex(baseTone.lightness, baseTone.chroma, baseTone.hue),
  };
};

const sortTones = (tones: ToneEntry[]): ToneEntry[] => [...tones].sort((left, right) => left.value - right.value);

const createNeutralFamily = (): ColorFamily => ({
  id: crypto.randomUUID(),
  name: "neutral",
  isBuiltIn: true,
  primaryBaseTone: null,
  tones: DEFAULT_TONE_VALUES.map((v) => {
    const base = {
      value: v,
      lightness: AEGIS_FIXED_LIGHTNESS[toneLabel(v)] ?? 50,
      chroma: 0,
      hue: 0,
      alphaMode: "none" as const,
    };
    return { ...base, hex: oklchToHex(base.lightness, base.chroma, base.hue) };
  }),
});

const updateProjectTimestamp = (project: PaletteProject): PaletteProject => ({
  ...project,
  updatedAt: createTimestamp(),
});

const getProjectById = (state: PaletteLabState, projectId: string | null): PaletteProject | undefined =>
  state.projects.find((project) => project.id === projectId);

const getNextActiveProjectId = (projects: PaletteProject[]): string | null => projects[0]?.id ?? null;

const getFirstFamilyId = (project: PaletteProject | undefined): string | null => project?.colorFamilies[0]?.id ?? null;

export const reducer = (state: PaletteLabState, action: PaletteLabAction): PaletteLabState => {
  switch (action.type) {
    case "ADD_PROJECT": {
      const timestamp = createTimestamp();
      const neutral = createNeutralFamily();
      const project: PaletteProject = {
        id: crypto.randomUUID(),
        name: action.payload.name,
        createdAt: timestamp,
        updatedAt: timestamp,
        colorFamilies: [neutral],
        appBgLightness: 100,
        paneBackgroundRef: "default",
        tokenOverrides: {},
      };

      return {
        ...state,
        projects: [...state.projects, project],
        activeProjectId: project.id,
        activeFamilyId: neutral.id,
      };
    }
    case "DELETE_PROJECT": {
      const projects = state.projects.filter((project) => project.id !== action.payload.projectId);

      if (state.activeProjectId !== action.payload.projectId) {
        return {
          ...state,
          projects,
        };
      }

      const nextActiveProjectId = getNextActiveProjectId(projects);
      const nextActiveProject = getProjectById({ ...state, projects }, nextActiveProjectId);

      return {
        ...state,
        projects,
        activeProjectId: nextActiveProjectId,
        activeFamilyId: getFirstFamilyId(nextActiveProject),
      };
    }
    case "SELECT_PROJECT": {
      const project = getProjectById(state, action.payload.projectId);

      return {
        ...state,
        activeProjectId: action.payload.projectId,
        activeFamilyId: getFirstFamilyId(project),
      };
    }
    case "ADD_FAMILY": {
      if (!state.activeProjectId) {
        return state;
      }

      const family: ColorFamily = {
        id: crypto.randomUUID(),
        name: action.payload.name,
        tones: DEFAULT_TONE_VALUES.map((toneValue) => createDefaultTone(toneValue)),
        primaryBaseTone: null,
      };

      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === state.activeProjectId
            ? updateProjectTimestamp({
                ...project,
                colorFamilies: [...project.colorFamilies, family],
              })
            : project,
        ),
        activeFamilyId: family.id,
      };
    }
    case "DELETE_FAMILY": {
      if (!state.activeProjectId) {
        return state;
      }

      let nextActiveFamilyId = state.activeFamilyId;

      const projects = state.projects.map((project) => {
        if (project.id !== state.activeProjectId) {
          return project;
        }

        const colorFamilies = project.colorFamilies.filter(
          (family) => family.id !== action.payload.familyId || family.isBuiltIn,
        );

        if (state.activeFamilyId === action.payload.familyId) {
          nextActiveFamilyId = colorFamilies[0]?.id ?? null;
        }

        return updateProjectTimestamp({
          ...project,
          colorFamilies,
        });
      });

      return {
        ...state,
        projects,
        activeFamilyId: nextActiveFamilyId,
      };
    }
    case "SELECT_FAMILY":
      return {
        ...state,
        activeFamilyId: action.payload.familyId,
      };
    case "RENAME_FAMILY": {
      if (!state.activeProjectId) {
        return state;
      }

      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === state.activeProjectId
            ? updateProjectTimestamp({
                ...project,
                colorFamilies: project.colorFamilies.map((family) =>
                  family.id === action.payload.familyId ? { ...family, name: action.payload.name } : family,
                ),
              })
            : project,
        ),
      };
    }
    case "ADD_TONE": {
      if (!state.activeProjectId) {
        return state;
      }

      const newTone = createDefaultTone(action.payload.toneValue);

      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === state.activeProjectId
            ? updateProjectTimestamp({
                ...project,
                colorFamilies: project.colorFamilies.map((family) =>
                  family.id === action.payload.familyId
                    ? { ...family, tones: sortTones([...family.tones, newTone]) }
                    : family,
                ),
              })
            : project,
        ),
      };
    }
    case "DELETE_TONE": {
      if (!state.activeProjectId) {
        return state;
      }

      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === state.activeProjectId
            ? updateProjectTimestamp({
                ...project,
                colorFamilies: project.colorFamilies.map((family) =>
                  family.id === action.payload.familyId
                    ? { ...family, tones: family.tones.filter((tone) => tone.value !== action.payload.toneValue) }
                    : family,
                ),
              })
            : project,
        ),
      };
    }
    case "UPDATE_TONE": {
      if (!state.activeProjectId) {
        return state;
      }

      const shouldRecomputeHex =
        action.payload.patch.hex === undefined &&
        (action.payload.patch.lightness !== undefined ||
          action.payload.patch.chroma !== undefined ||
          action.payload.patch.hue !== undefined);

      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === state.activeProjectId
            ? updateProjectTimestamp({
                ...project,
                colorFamilies: project.colorFamilies.map((family) =>
                  family.id === action.payload.familyId
                    ? {
                        ...family,
                        tones: family.tones.map((tone) => {
                          if (tone.value !== action.payload.toneValue) {
                            return tone;
                          }

                          const nextTone: ToneEntry = {
                            ...tone,
                            ...action.payload.patch,
                          };

                          return shouldRecomputeHex
                            ? {
                                ...nextTone,
                                hex: computeHex(nextTone),
                              }
                            : nextTone;
                        }),
                      }
                    : family,
                ),
              })
            : project,
        ),
      };
    }
    case "IMPORT_PALETTE": {
      // Support backward-compat import of old projects that had themes.light structure
      const raw = action.payload.project as PaletteProject & {
        themes?: {
          light?: { appBgLightness?: number; tokenOverrides?: Record<string, string>; paneBackgroundRef?: string };
        };
        activeTheme?: string;
      };
      const importedProject: PaletteProject = {
        ...action.payload.project,
        appBgLightness: raw.appBgLightness ?? raw.themes?.light?.appBgLightness ?? 100,
        paneBackgroundRef: raw.paneBackgroundRef ?? raw.themes?.light?.paneBackgroundRef ?? "default",
        tokenOverrides: raw.tokenOverrides ?? raw.themes?.light?.tokenOverrides ?? {},
      };
      const existingProject = state.projects.find((project) => project.id === importedProject.id);
      const projects = existingProject
        ? state.projects.map((project) => (project.id === importedProject.id ? importedProject : project))
        : [...state.projects, importedProject];

      return {
        ...state,
        projects,
        activeProjectId: importedProject.id,
        activeFamilyId: getFirstFamilyId(importedProject),
      };
    }
    case "SELECT_TONE":
      return {
        ...state,
        activeToneValue: action.payload.toneValue,
      };
    case "UPDATE_TONE_BULK": {
      if (!state.activeProjectId) {
        return state;
      }

      const { toneValue, patch } = action.payload;
      const shouldRecomputeHex =
        patch.hex === undefined &&
        (patch.lightness !== undefined || patch.chroma !== undefined || patch.hue !== undefined);

      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id !== state.activeProjectId
            ? project
            : updateProjectTimestamp({
                ...project,
                colorFamilies: project.colorFamilies.map((family) => ({
                  ...family,
                  tones: family.tones.map((tone) => {
                    if (tone.value !== toneValue) {
                      return tone;
                    }

                    const nextTone: ToneEntry = { ...tone, ...patch };

                    return shouldRecomputeHex ? { ...nextTone, hex: computeHex(nextTone) } : nextTone;
                  }),
                })),
              }),
        ),
      };
    }
    case "SET_PRIMARY_BASE_TONE": {
      if (!state.activeProjectId) {
        return state;
      }

      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id !== state.activeProjectId
            ? project
            : updateProjectTimestamp({
                ...project,
                colorFamilies: project.colorFamilies.map((family) =>
                  family.id === action.payload.familyId
                    ? { ...family, primaryBaseTone: action.payload.baseTone }
                    : family,
                ),
              }),
        ),
      };
    }
    case "RENAME_PROJECT": {
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === action.payload.projectId
            ? updateProjectTimestamp({ ...project, name: action.payload.name })
            : project,
        ),
      };
    }
    case "DUPLICATE_PROJECT": {
      const source = getProjectById(state, action.payload.projectId);
      if (!source) return state;
      const timestamp = createTimestamp();
      const duplicated: PaletteProject = {
        ...source,
        id: crypto.randomUUID(),
        name: \`\${source.name} copy\`,
        createdAt: timestamp,
        updatedAt: timestamp,
        colorFamilies: source.colorFamilies.map((f) => ({ ...f, id: crypto.randomUUID() })),
        tokenOverrides: { ...source.tokenOverrides },
      };
      return { ...state, projects: [...state.projects, duplicated] };
    }
    case "PUSH_UNDO_SNAPSHOT":
      return state;
    case "UPDATE_TONE_DRAG": {
      if (!state.activeProjectId) return state;
      const shouldRecomputeHex =
        action.payload.patch.hex === undefined &&
        (action.payload.patch.lightness !== undefined ||
          action.payload.patch.chroma !== undefined ||
          action.payload.patch.hue !== undefined);
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === state.activeProjectId
            ? updateProjectTimestamp({
                ...project,
                colorFamilies: project.colorFamilies.map((family) =>
                  family.id === action.payload.familyId
                    ? {
                        ...family,
                        tones: family.tones.map((tone) => {
                          if (tone.value !== action.payload.toneValue) return tone;
                          const nextTone: ToneEntry = { ...tone, ...action.payload.patch };
                          return shouldRecomputeHex ? { ...nextTone, hex: computeHex(nextTone) } : nextTone;
                        }),
                      }
                    : family,
                ),
              })
            : project,
        ),
      };
    }
    case "UPDATE_TONE_BULK_DRAG": {
      if (!state.activeProjectId) return state;
      const { toneValue, patch } = action.payload;
      const shouldRecomputeHex =
        patch.hex === undefined &&
        (patch.lightness !== undefined || patch.chroma !== undefined || patch.hue !== undefined);
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id !== state.activeProjectId
            ? project
            : updateProjectTimestamp({
                ...project,
                colorFamilies: project.colorFamilies.map((family) => ({
                  ...family,
                  tones: family.tones.map((tone) => {
                    if (tone.value !== toneValue) return tone;
                    const nextTone: ToneEntry = { ...tone, ...patch };
                    return shouldRecomputeHex ? { ...nextTone, hex: computeHex(nextTone) } : nextTone;
                  }),
                })),
              }),
        ),
      };
    }
    case "DUPLICATE_FAMILY": {
      if (!state.activeProjectId) return state;

      const sourceProject = getProjectById(state, state.activeProjectId);
      const sourceFamily = sourceProject?.colorFamilies.find((f) => f.id === action.payload.familyId);
      if (!sourceFamily) return state;

      const duplicated: ColorFamily = {
        ...sourceFamily,
        id: crypto.randomUUID(),
        name: \`\${sourceFamily.name} copy\`,
        isBuiltIn: false,
      };

      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === state.activeProjectId
            ? updateProjectTimestamp({
                ...project,
                colorFamilies: [...project.colorFamilies, duplicated],
              })
            : project,
        ),
        activeFamilyId: duplicated.id,
      };
    }
    case "SET_GAMUT":
      return { ...state, gamut: action.payload };
    case "SET_APP_BG_LIGHTNESS": {
      if (!state.activeProjectId) return state;
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id !== state.activeProjectId
            ? project
            : updateProjectTimestamp({ ...project, appBgLightness: action.payload.lightness }),
        ),
      };
    }
    case "SET_TOKEN_OVERRIDE": {
      if (!state.activeProjectId) return state;
      return {
        ...state,
        projects: state.projects.map((project) => {
          if (project.id !== state.activeProjectId) return project;
          const next = { ...project.tokenOverrides };
          if (action.payload.value === null) {
            delete next[action.payload.tokenName];
          } else {
            next[action.payload.tokenName] = action.payload.value;
          }
          return updateProjectTimestamp({ ...project, tokenOverrides: next });
        }),
      };
    }
    case "SET_PANE_BACKGROUND_REF": {
      if (!state.activeProjectId) return state;
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id !== state.activeProjectId
            ? project
            : updateProjectTimestamp({ ...project, paneBackgroundRef: action.payload.ref }),
        ),
      };
    }
    default:
      return state;
  }
};
`;export{e as default};