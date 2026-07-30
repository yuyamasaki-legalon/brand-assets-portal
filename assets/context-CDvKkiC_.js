var e=`import type { Dispatch, ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import paletteInitial from "../assets/palette-initial.json";
import { oklchToHex } from "../color/oklch";
import { createLinearProject } from "../seed/linear-seed";
import { importFromPaletteJson } from "../seed/seed";
import { createShadcnProject } from "../seed/shadcn-seed";
import { createTailwindProject } from "../seed/tailwind-seed";
import type { PaletteLabAction } from "./actions";
import { reducer } from "./reducer";
import { loadState, saveState } from "./storage";
import { AEGIS_FIXED_LIGHTNESS, type PaletteLabState } from "./types";

export type PaletteLabContextValue = {
  state: PaletteLabState;
  dispatch: Dispatch<PaletteLabAction>;
};

const PaletteLabContext = createContext<PaletteLabContextValue | null>(null);

// Actions that mutate palette data — these push a snapshot to the undo stack.
// Selection/navigation actions are excluded intentionally.
const UNDOABLE_ACTIONS = new Set<PaletteLabAction["type"]>([
  "ADD_PROJECT",
  "DELETE_PROJECT",
  "RENAME_PROJECT",
  "ADD_FAMILY",
  "DELETE_FAMILY",
  "RENAME_FAMILY",
  "ADD_TONE",
  "DELETE_TONE",
  "UPDATE_TONE",
  "UPDATE_TONE_BULK",
  "SET_PRIMARY_BASE_TONE",
  "SET_APP_BG_LIGHTNESS",
  "SET_TOKEN_OVERRIDE",
  "SET_PANE_BACKGROUND_REF",
  "IMPORT_PALETTE",
  "PUSH_UNDO_SNAPSHOT",
]);

const MAX_UNDO = 30;

export const PaletteLabProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<PaletteLabState>(() => {
    const saved = loadState();
    let initialState: PaletteLabState;

    if (saved && saved.projects.length > 0) {
      initialState = { ...saved, activeToneValue: saved.activeToneValue ?? null, gamut: saved.gamut ?? "Display P3" };
    } else {
      const seedProject = importFromPaletteJson(paletteInitial as Record<string, Record<string, string>>);
      initialState = {
        projects: [seedProject],
        activeProjectId: seedProject.id,
        activeFamilyId: seedProject.colorFamilies[0]?.id ?? null,
        activeToneValue: null,
        gamut: "Display P3",
      };
    }

    // One-time migration: move legacy global token-overrides into the active project's tokenOverrides
    const legacyRaw = localStorage.getItem("palette-lab:token-overrides");
    if (legacyRaw && initialState.activeProjectId) {
      try {
        const legacy = JSON.parse(legacyRaw) as Record<string, string>;
        if (Object.keys(legacy).length > 0) {
          initialState = {
            ...initialState,
            projects: initialState.projects.map((project) => {
              if (project.id !== initialState.activeProjectId) return project;
              return {
                ...project,
                tokenOverrides: { ...legacy, ...project.tokenOverrides },
              };
            }),
          };
          localStorage.removeItem("palette-lab:token-overrides");
        }
      } catch {
        // ignore malformed data
      }
    }

    // One-time migration: apply Aegis v3 neutral L-value redesign to all existing projects.
    // Updates every tone's lightness to AEGIS_FIXED_LIGHTNESS values and recomputes hex.
    // Also adds missing tones 450 and 950 to the neutral family.
    if (!localStorage.getItem("palette-lab:neutral-l-v3-migrated")) {
      initialState = {
        ...initialState,
        projects: initialState.projects.map((project) => ({
          ...project,
          colorFamilies: project.colorFamilies.map((family) => {
            const isNeutral = family.name.toLowerCase() === "neutral";
            const existingValues = new Set(family.tones.map((t) => t.value));

            const updatedTones = family.tones.map((tone) => {
              const newL = AEGIS_FIXED_LIGHTNESS[String(tone.value)];
              if (newL === undefined) return tone;
              return { ...tone, lightness: newL, hex: oklchToHex(newL, tone.chroma, tone.hue) };
            });

            if (isNeutral && !existingValues.has(450)) {
              const l = AEGIS_FIXED_LIGHTNESS["450"];
              updatedTones.push({
                value: 450,
                lightness: l,
                chroma: 0,
                hue: 0,
                alphaMode: "none" as const,
                hex: oklchToHex(l, 0, 0),
              });
            }

            return { ...family, tones: [...updatedTones].sort((a, b) => a.value - b.value) };
          }),
        })),
      };
      localStorage.setItem("palette-lab:neutral-l-v3-migrated", "1");
    }

    // One-time migration: remove tone 950 and re-apply v3.1 L-values (700=38.7, 800=30.3, 900=22).
    if (!localStorage.getItem("palette-lab:neutral-l-v3-1-migrated")) {
      initialState = {
        ...initialState,
        projects: initialState.projects.map((project) => ({
          ...project,
          colorFamilies: project.colorFamilies.map((family) => {
            const filtered = family.tones.filter((t) => t.value !== 950);
            const updated = filtered.map((tone) => {
              const newL = AEGIS_FIXED_LIGHTNESS[String(tone.value)];
              if (newL === undefined) return tone;
              return { ...tone, lightness: newL, hex: oklchToHex(newL, tone.chroma, tone.hue) };
            });
            return { ...family, tones: updated.sort((a, b) => a.value - b.value) };
          }),
        })),
      };
      localStorage.setItem("palette-lab:neutral-l-v3-1-migrated", "1");
    }

    // One-time migration: remove tone 950 and apply v3.2 L-values (500=51.5, 600=42.4, 700=34.5, 800=27.8).
    if (!localStorage.getItem("palette-lab:neutral-l-v3-2-migrated")) {
      initialState = {
        ...initialState,
        projects: initialState.projects.map((project) => ({
          ...project,
          colorFamilies: project.colorFamilies.map((family) => ({
            ...family,
            tones: family.tones
              .filter((t) => t.value !== 950)
              .map((tone) => {
                const newL = AEGIS_FIXED_LIGHTNESS[String(tone.value)];
                if (newL === undefined) return tone;
                return { ...tone, lightness: newL, hex: oklchToHex(newL, tone.chroma, tone.hue) };
              })
              .sort((a, b) => a.value - b.value),
          })),
        })),
      };
      localStorage.setItem("palette-lab:neutral-l-v3-2-migrated", "1");
    }

    // One-time migration: add the "shadcn" project if it doesn't exist yet.
    if (!localStorage.getItem("palette-lab:shadcn-created")) {
      const alreadyExists = initialState.projects.some((p) => p.name === "shadcn");
      if (!alreadyExists) {
        initialState = {
          ...initialState,
          projects: [...initialState.projects, createShadcnProject()],
        };
      }
      localStorage.setItem("palette-lab:shadcn-created", "1");
    }

    // One-time migration: replace shadcn project with the full 20-family hex-based palette.
    if (!localStorage.getItem("palette-lab:shadcn-v2-updated")) {
      initialState = {
        ...initialState,
        projects: [...initialState.projects.filter((p) => p.name !== "shadcn"), createShadcnProject()],
      };
      localStorage.setItem("palette-lab:shadcn-v2-updated", "1");
    }

    // One-time migration: add the "tailwind" project if it doesn't exist yet.
    if (!localStorage.getItem("palette-lab:tailwind-created")) {
      const alreadyExists = initialState.projects.some((p) => p.name === "tailwind");
      if (!alreadyExists) {
        initialState = {
          ...initialState,
          projects: [...initialState.projects, createTailwindProject()],
        };
      }
      localStorage.setItem("palette-lab:tailwind-created", "1");
    }

    // One-time migration: replace tailwind project with updated hex-based palette (new families + revised values).
    if (!localStorage.getItem("palette-lab:tailwind-v2-updated")) {
      initialState = {
        ...initialState,
        projects: [...initialState.projects.filter((p) => p.name !== "tailwind"), createTailwindProject()],
      };
      localStorage.setItem("palette-lab:tailwind-v2-updated", "1");
    }

    // One-time migration: add the "Linear" project if it doesn't exist yet.
    if (!localStorage.getItem("palette-lab:linear-created")) {
      const alreadyExists = initialState.projects.some((p) => p.name === "Linear");
      if (!alreadyExists) {
        initialState = {
          ...initialState,
          projects: [...initialState.projects, createLinearProject()],
        };
      }
      localStorage.setItem("palette-lab:linear-created", "1");
    }

    return initialState;
  });

  // Always holds the latest state without closing over it in callbacks
  const stateRef = useRef(state);
  stateRef.current = state;

  // Undo stack — not persisted, kept as ref to avoid triggering re-renders
  const pastRef = useRef<PaletteLabState[]>([]);

  const dispatch = useCallback((action: PaletteLabAction) => {
    if (UNDOABLE_ACTIONS.has(action.type)) {
      pastRef.current = [...pastRef.current.slice(-(MAX_UNDO - 1)), stateRef.current];
    }
    setState((prev) => reducer(prev, action));
  }, []);

  useEffect(() => {
    saveState(state);
  }, [state]);

  // ⌘+Z / Ctrl+Z — undo last mutation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key === "z") {
        if (pastRef.current.length === 0) return;
        e.preventDefault();
        const prev = pastRef.current[pastRef.current.length - 1];
        pastRef.current = pastRef.current.slice(0, -1);
        setState(prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return <PaletteLabContext.Provider value={{ state, dispatch }}>{children}</PaletteLabContext.Provider>;
};

export const usePaletteLabContext = (): PaletteLabContextValue => {
  const ctx = useContext(PaletteLabContext);
  if (!ctx) {
    throw new Error("usePaletteLabContext must be used inside PaletteLabProvider");
  }
  return ctx;
};
`;export{e as default};