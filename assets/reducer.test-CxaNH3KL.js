var e=`import { describe, expect, it } from "vitest";

import { reducer } from "./reducer";
import type { ColorFamily, PaletteLabState, PaletteProject, ToneEntry } from "./types";
import { AEGIS_FIXED_LIGHTNESS, DEFAULT_TONE_VALUES } from "./types";

// ---------------------------------------------------------------------------
// Factories
// ---------------------------------------------------------------------------

const makeTone = (value: number, overrides: Partial<ToneEntry> = {}): ToneEntry => ({
  value,
  lightness: 50,
  chroma: 0.1,
  hue: 240,
  alphaMode: "none",
  hex: "#0000ff",
  ...overrides,
});

const makeFamily = (id: string, overrides: Partial<ColorFamily> = {}): ColorFamily => ({
  id,
  name: "Blue",
  tones: [],
  primaryBaseTone: null,
  ...overrides,
});

const makeProject = (id: string, overrides: Partial<PaletteProject> = {}): PaletteProject => ({
  id,
  name: "Test Project",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  colorFamilies: [],
  appBgLightness: 100,
  paneBackgroundRef: "default",
  tokenOverrides: {},
  ...overrides,
});

const makeState = (overrides: Partial<PaletteLabState> = {}): PaletteLabState => ({
  projects: [],
  activeProjectId: null,
  activeFamilyId: null,
  activeToneValue: null,
  gamut: "Display P3",
  ...overrides,
});

// ---------------------------------------------------------------------------
// ADD_PROJECT
// ---------------------------------------------------------------------------

describe("ADD_PROJECT", () => {
  it("adds a new project to the list", () => {
    const next = reducer(makeState(), { type: "ADD_PROJECT", payload: { name: "My Project" } });
    expect(next.projects).toHaveLength(1);
    expect(next.projects[0].name).toBe("My Project");
  });

  it("sets activeProjectId to the new project's id", () => {
    const next = reducer(makeState(), { type: "ADD_PROJECT", payload: { name: "X" } });
    expect(next.activeProjectId).toBe(next.projects[0].id);
  });

  it("sets activeFamilyId to the built-in neutral family", () => {
    const state = makeState({ activeFamilyId: "existing-family" });
    const next = reducer(state, { type: "ADD_PROJECT", payload: { name: "X" } });
    const neutral = next.projects[0].colorFamilies[0];
    expect(next.activeFamilyId).toBe(neutral?.id);
  });

  it("appends without removing existing projects", () => {
    const p1 = makeProject("p1");
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, { type: "ADD_PROJECT", payload: { name: "New" } });
    expect(next.projects).toHaveLength(2);
    expect(next.projects[0].id).toBe("p1");
  });

  it("new project has ISO createdAt and updatedAt", () => {
    const next = reducer(makeState(), { type: "ADD_PROJECT", payload: { name: "X" } });
    expect(next.projects[0].createdAt).toMatch(/^\\d{4}-\\d{2}-\\d{2}T/);
    expect(next.projects[0].updatedAt).toMatch(/^\\d{4}-\\d{2}-\\d{2}T/);
  });

  it("new project has a built-in neutral family", () => {
    const next = reducer(makeState(), { type: "ADD_PROJECT", payload: { name: "X" } });
    const families = next.projects[0].colorFamilies;
    expect(families).toHaveLength(1);
    expect(families[0].name).toBe("neutral");
    expect(families[0].isBuiltIn).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// DELETE_PROJECT
// ---------------------------------------------------------------------------

describe("DELETE_PROJECT", () => {
  it("removes the target project", () => {
    const p1 = makeProject("p1");
    const p2 = makeProject("p2");
    const state = makeState({ projects: [p1, p2], activeProjectId: "p2" });
    const next = reducer(state, { type: "DELETE_PROJECT", payload: { projectId: "p1" } });
    expect(next.projects).toHaveLength(1);
    expect(next.projects[0].id).toBe("p2");
  });

  it("preserves activeProjectId when the deleted project is not active", () => {
    const p1 = makeProject("p1");
    const p2 = makeProject("p2");
    const state = makeState({ projects: [p1, p2], activeProjectId: "p2" });
    const next = reducer(state, { type: "DELETE_PROJECT", payload: { projectId: "p1" } });
    expect(next.activeProjectId).toBe("p2");
  });

  it("switches to the first remaining project when the active project is deleted", () => {
    const p1 = makeProject("p1");
    const p2 = makeProject("p2");
    const state = makeState({ projects: [p1, p2], activeProjectId: "p1" });
    const next = reducer(state, { type: "DELETE_PROJECT", payload: { projectId: "p1" } });
    expect(next.activeProjectId).toBe("p2");
  });

  it("sets activeProjectId to null when the last project is deleted", () => {
    const p1 = makeProject("p1");
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, { type: "DELETE_PROJECT", payload: { projectId: "p1" } });
    expect(next.activeProjectId).toBeNull();
  });

  it("sets activeFamilyId to first family of next active project", () => {
    const f1 = makeFamily("f1");
    const p1 = makeProject("p1");
    const p2 = makeProject("p2", { colorFamilies: [f1] });
    const state = makeState({ projects: [p1, p2], activeProjectId: "p1" });
    const next = reducer(state, { type: "DELETE_PROJECT", payload: { projectId: "p1" } });
    expect(next.activeFamilyId).toBe("f1");
  });

  it("sets activeFamilyId to null when the next active project has no families", () => {
    const p1 = makeProject("p1");
    const p2 = makeProject("p2", { colorFamilies: [] });
    const state = makeState({ projects: [p1, p2], activeProjectId: "p1", activeFamilyId: "f1" });
    const next = reducer(state, { type: "DELETE_PROJECT", payload: { projectId: "p1" } });
    expect(next.activeFamilyId).toBeNull();
  });

  it("sets both IDs to null when the last project is deleted", () => {
    const p1 = makeProject("p1");
    const state = makeState({ projects: [p1], activeProjectId: "p1", activeFamilyId: "f1" });
    const next = reducer(state, { type: "DELETE_PROJECT", payload: { projectId: "p1" } });
    expect(next.activeProjectId).toBeNull();
    expect(next.activeFamilyId).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// SELECT_PROJECT
// ---------------------------------------------------------------------------

describe("SELECT_PROJECT", () => {
  it("updates activeProjectId", () => {
    const p1 = makeProject("p1");
    const p2 = makeProject("p2");
    const state = makeState({ projects: [p1, p2], activeProjectId: "p1" });
    const next = reducer(state, { type: "SELECT_PROJECT", payload: { projectId: "p2" } });
    expect(next.activeProjectId).toBe("p2");
  });

  it("sets activeFamilyId to the first family of the selected project", () => {
    const f1 = makeFamily("f1");
    const f2 = makeFamily("f2");
    const p1 = makeProject("p1");
    const p2 = makeProject("p2", { colorFamilies: [f1, f2] });
    const state = makeState({ projects: [p1, p2], activeProjectId: "p1" });
    const next = reducer(state, { type: "SELECT_PROJECT", payload: { projectId: "p2" } });
    expect(next.activeFamilyId).toBe("f1");
  });

  it("sets activeFamilyId to null when the selected project has no families", () => {
    const f1 = makeFamily("f1");
    const p1 = makeProject("p1", { colorFamilies: [f1] });
    const p2 = makeProject("p2", { colorFamilies: [] });
    const state = makeState({ projects: [p1, p2], activeProjectId: "p1", activeFamilyId: "f1" });
    const next = reducer(state, { type: "SELECT_PROJECT", payload: { projectId: "p2" } });
    expect(next.activeFamilyId).toBeNull();
  });

  it("does not mutate the projects array", () => {
    const p1 = makeProject("p1");
    const p2 = makeProject("p2");
    const state = makeState({ projects: [p1, p2], activeProjectId: "p1" });
    const next = reducer(state, { type: "SELECT_PROJECT", payload: { projectId: "p2" } });
    expect(next.projects).toEqual(state.projects);
  });
});

// ---------------------------------------------------------------------------
// ADD_FAMILY
// ---------------------------------------------------------------------------

describe("ADD_FAMILY", () => {
  it("adds a family to the active project", () => {
    const p1 = makeProject("p1");
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, { type: "ADD_FAMILY", payload: { name: "Red" } });
    expect(next.projects[0].colorFamilies).toHaveLength(1);
    expect(next.projects[0].colorFamilies[0].name).toBe("Red");
  });

  it("sets activeFamilyId to the new family's id", () => {
    const p1 = makeProject("p1");
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, { type: "ADD_FAMILY", payload: { name: "Red" } });
    expect(next.activeFamilyId).toBe(next.projects[0].colorFamilies[0].id);
  });

  it("creates exactly 10 default tones matching DEFAULT_TONE_VALUES", () => {
    const p1 = makeProject("p1");
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, { type: "ADD_FAMILY", payload: { name: "X" } });
    const tones = next.projects[0].colorFamilies[0].tones;
    expect(tones).toHaveLength(DEFAULT_TONE_VALUES.length);
    expect(tones.map((t) => t.value)).toEqual([...DEFAULT_TONE_VALUES].sort((a, b) => a - b));
  });

  it("default tones use AEGIS_FIXED_LIGHTNESS for known values", () => {
    const p1 = makeProject("p1");
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, { type: "ADD_FAMILY", payload: { name: "X" } });
    for (const tone of next.projects[0].colorFamilies[0].tones) {
      const fixed = AEGIS_FIXED_LIGHTNESS[String(tone.value)];
      if (fixed !== undefined) {
        expect(tone.lightness).toBe(fixed);
      }
    }
  });

  it("default tones have valid hex strings", () => {
    const p1 = makeProject("p1");
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, { type: "ADD_FAMILY", payload: { name: "X" } });
    for (const tone of next.projects[0].colorFamilies[0].tones) {
      expect(tone.hex).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it("does not affect other projects", () => {
    const p1 = makeProject("p1");
    const p2 = makeProject("p2");
    const state = makeState({ projects: [p1, p2], activeProjectId: "p1" });
    const next = reducer(state, { type: "ADD_FAMILY", payload: { name: "X" } });
    expect(next.projects.find((p) => p.id === "p2")!.colorFamilies).toEqual([]);
  });

  it("updates project updatedAt", () => {
    const p1 = makeProject("p1");
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, { type: "ADD_FAMILY", payload: { name: "X" } });
    expect(next.projects[0].updatedAt).not.toBe(p1.updatedAt);
  });

  it("is a no-op when activeProjectId is null", () => {
    const state = makeState({ activeProjectId: null });
    expect(reducer(state, { type: "ADD_FAMILY", payload: { name: "X" } })).toEqual(state);
  });
});

// ---------------------------------------------------------------------------
// DELETE_FAMILY
// ---------------------------------------------------------------------------

describe("DELETE_FAMILY", () => {
  it("removes the specified family", () => {
    const f1 = makeFamily("f1");
    const f2 = makeFamily("f2");
    const p1 = makeProject("p1", { colorFamilies: [f1, f2] });
    const state = makeState({ projects: [p1], activeProjectId: "p1", activeFamilyId: "f2" });
    const next = reducer(state, { type: "DELETE_FAMILY", payload: { familyId: "f1" } });
    expect(next.projects[0].colorFamilies.map((f) => f.id)).toEqual(["f2"]);
  });

  it("preserves activeFamilyId when a non-active family is deleted", () => {
    const f1 = makeFamily("f1");
    const f2 = makeFamily("f2");
    const p1 = makeProject("p1", { colorFamilies: [f1, f2] });
    const state = makeState({ projects: [p1], activeProjectId: "p1", activeFamilyId: "f2" });
    const next = reducer(state, { type: "DELETE_FAMILY", payload: { familyId: "f1" } });
    expect(next.activeFamilyId).toBe("f2");
  });

  it("switches activeFamilyId to the first remaining when the active family is deleted", () => {
    const f1 = makeFamily("f1");
    const f2 = makeFamily("f2");
    const p1 = makeProject("p1", { colorFamilies: [f1, f2] });
    const state = makeState({ projects: [p1], activeProjectId: "p1", activeFamilyId: "f1" });
    const next = reducer(state, { type: "DELETE_FAMILY", payload: { familyId: "f1" } });
    expect(next.activeFamilyId).toBe("f2");
  });

  it("sets activeFamilyId to null when the last family is deleted", () => {
    const f1 = makeFamily("f1");
    const p1 = makeProject("p1", { colorFamilies: [f1] });
    const state = makeState({ projects: [p1], activeProjectId: "p1", activeFamilyId: "f1" });
    const next = reducer(state, { type: "DELETE_FAMILY", payload: { familyId: "f1" } });
    expect(next.activeFamilyId).toBeNull();
  });

  it("updates project updatedAt", () => {
    const f1 = makeFamily("f1");
    const p1 = makeProject("p1", { colorFamilies: [f1] });
    const state = makeState({ projects: [p1], activeProjectId: "p1", activeFamilyId: "f1" });
    const next = reducer(state, { type: "DELETE_FAMILY", payload: { familyId: "f1" } });
    expect(next.projects[0].updatedAt).not.toBe(p1.updatedAt);
  });

  it("is a no-op when activeProjectId is null", () => {
    const state = makeState({ activeProjectId: null });
    expect(reducer(state, { type: "DELETE_FAMILY", payload: { familyId: "f1" } })).toEqual(state);
  });
});

// ---------------------------------------------------------------------------
// SELECT_FAMILY
// ---------------------------------------------------------------------------

describe("SELECT_FAMILY", () => {
  it("sets activeFamilyId", () => {
    const state = makeState({ activeFamilyId: "f1" });
    const next = reducer(state, { type: "SELECT_FAMILY", payload: { familyId: "f2" } });
    expect(next.activeFamilyId).toBe("f2");
  });

  it("does not mutate projects", () => {
    const p1 = makeProject("p1");
    const state = makeState({ projects: [p1], activeProjectId: "p1", activeFamilyId: "f1" });
    const next = reducer(state, { type: "SELECT_FAMILY", payload: { familyId: "f2" } });
    expect(next.projects).toEqual(state.projects);
  });
});

// ---------------------------------------------------------------------------
// RENAME_FAMILY
// ---------------------------------------------------------------------------

describe("RENAME_FAMILY", () => {
  it("renames the specified family", () => {
    const f1 = makeFamily("f1", { name: "Old" });
    const p1 = makeProject("p1", { colorFamilies: [f1] });
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, { type: "RENAME_FAMILY", payload: { familyId: "f1", name: "New" } });
    expect(next.projects[0].colorFamilies[0].name).toBe("New");
  });

  it("does not rename other families", () => {
    const f1 = makeFamily("f1", { name: "Blue" });
    const f2 = makeFamily("f2", { name: "Red" });
    const p1 = makeProject("p1", { colorFamilies: [f1, f2] });
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, { type: "RENAME_FAMILY", payload: { familyId: "f1", name: "Navy" } });
    expect(next.projects[0].colorFamilies.find((f) => f.id === "f2")!.name).toBe("Red");
  });

  it("updates project updatedAt", () => {
    const f1 = makeFamily("f1");
    const p1 = makeProject("p1", { colorFamilies: [f1] });
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, { type: "RENAME_FAMILY", payload: { familyId: "f1", name: "New" } });
    expect(next.projects[0].updatedAt).not.toBe(p1.updatedAt);
  });

  it("is a no-op when activeProjectId is null", () => {
    const state = makeState({ activeProjectId: null });
    expect(reducer(state, { type: "RENAME_FAMILY", payload: { familyId: "f1", name: "X" } })).toEqual(state);
  });
});

// ---------------------------------------------------------------------------
// ADD_TONE
// ---------------------------------------------------------------------------

describe("ADD_TONE", () => {
  it("adds a tone with the given value", () => {
    const f1 = makeFamily("f1");
    const p1 = makeProject("p1", { colorFamilies: [f1] });
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, { type: "ADD_TONE", payload: { familyId: "f1", toneValue: 550 } });
    const tones = next.projects[0].colorFamilies[0].tones;
    expect(tones).toHaveLength(1);
    expect(tones[0].value).toBe(550);
  });

  it("tones remain sorted ascending after insertion", () => {
    const f1 = makeFamily("f1", { tones: [makeTone(500), makeTone(700)] });
    const p1 = makeProject("p1", { colorFamilies: [f1] });
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, { type: "ADD_TONE", payload: { familyId: "f1", toneValue: 600 } });
    expect(next.projects[0].colorFamilies[0].tones.map((t) => t.value)).toEqual([500, 600, 700]);
  });

  it("uses AEGIS_FIXED_LIGHTNESS for known tone values", () => {
    const f1 = makeFamily("f1");
    const p1 = makeProject("p1", { colorFamilies: [f1] });
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, { type: "ADD_TONE", payload: { familyId: "f1", toneValue: 500 } });
    expect(next.projects[0].colorFamilies[0].tones[0].lightness).toBe(AEGIS_FIXED_LIGHTNESS["500"]);
  });

  it("falls back to lightness=50 for unknown tone values", () => {
    const f1 = makeFamily("f1");
    const p1 = makeProject("p1", { colorFamilies: [f1] });
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, { type: "ADD_TONE", payload: { familyId: "f1", toneValue: 999 } });
    expect(next.projects[0].colorFamilies[0].tones[0].lightness).toBe(50);
  });

  it("new tone has a valid hex string", () => {
    const f1 = makeFamily("f1");
    const p1 = makeProject("p1", { colorFamilies: [f1] });
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, { type: "ADD_TONE", payload: { familyId: "f1", toneValue: 300 } });
    expect(next.projects[0].colorFamilies[0].tones[0].hex).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("does not affect other families", () => {
    const f1 = makeFamily("f1");
    const f2 = makeFamily("f2");
    const p1 = makeProject("p1", { colorFamilies: [f1, f2] });
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, { type: "ADD_TONE", payload: { familyId: "f1", toneValue: 300 } });
    expect(next.projects[0].colorFamilies.find((f) => f.id === "f2")!.tones).toEqual([]);
  });

  it("is a no-op when activeProjectId is null", () => {
    const state = makeState({ activeProjectId: null });
    expect(reducer(state, { type: "ADD_TONE", payload: { familyId: "f1", toneValue: 300 } })).toEqual(state);
  });
});

// ---------------------------------------------------------------------------
// DELETE_TONE
// ---------------------------------------------------------------------------

describe("DELETE_TONE", () => {
  it("removes the tone with the given value", () => {
    const f1 = makeFamily("f1", { tones: [makeTone(500), makeTone(700)] });
    const p1 = makeProject("p1", { colorFamilies: [f1] });
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, { type: "DELETE_TONE", payload: { familyId: "f1", toneValue: 500 } });
    expect(next.projects[0].colorFamilies[0].tones.map((t) => t.value)).toEqual([700]);
  });

  it("results in an empty tones array when the last tone is deleted", () => {
    const f1 = makeFamily("f1", { tones: [makeTone(500)] });
    const p1 = makeProject("p1", { colorFamilies: [f1] });
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, { type: "DELETE_TONE", payload: { familyId: "f1", toneValue: 500 } });
    expect(next.projects[0].colorFamilies[0].tones).toEqual([]);
  });

  it("does not affect other families", () => {
    const f1 = makeFamily("f1", { tones: [makeTone(500)] });
    const f2 = makeFamily("f2", { tones: [makeTone(500)] });
    const p1 = makeProject("p1", { colorFamilies: [f1, f2] });
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, { type: "DELETE_TONE", payload: { familyId: "f1", toneValue: 500 } });
    expect(next.projects[0].colorFamilies.find((f) => f.id === "f2")!.tones).toHaveLength(1);
  });

  it("is a no-op when activeProjectId is null", () => {
    const state = makeState({ activeProjectId: null });
    expect(reducer(state, { type: "DELETE_TONE", payload: { familyId: "f1", toneValue: 500 } })).toEqual(state);
  });
});

// ---------------------------------------------------------------------------
// UPDATE_TONE
// ---------------------------------------------------------------------------

describe("UPDATE_TONE", () => {
  it("applies lightness patch", () => {
    const f1 = makeFamily("f1", { tones: [makeTone(500, { lightness: 50 })] });
    const p1 = makeProject("p1", { colorFamilies: [f1] });
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, {
      type: "UPDATE_TONE",
      payload: { familyId: "f1", toneValue: 500, patch: { lightness: 75 } },
    });
    expect(next.projects[0].colorFamilies[0].tones[0].lightness).toBe(75);
  });

  it("recomputes hex when L/C/H is patched (no hex in patch)", () => {
    const f1 = makeFamily("f1", { tones: [makeTone(500, { hex: "#ff0000" })] });
    const p1 = makeProject("p1", { colorFamilies: [f1] });
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, {
      type: "UPDATE_TONE",
      payload: { familyId: "f1", toneValue: 500, patch: { lightness: 80 } },
    });
    const hex = next.projects[0].colorFamilies[0].tones[0].hex;
    expect(hex).not.toBe("#ff0000");
    expect(hex).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("uses the provided hex directly when patch includes hex (no recompute)", () => {
    const f1 = makeFamily("f1", { tones: [makeTone(500)] });
    const p1 = makeProject("p1", { colorFamilies: [f1] });
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, {
      type: "UPDATE_TONE",
      payload: { familyId: "f1", toneValue: 500, patch: { lightness: 60, chroma: 0.2, hue: 120, hex: "#aabbcc" } },
    });
    expect(next.projects[0].colorFamilies[0].tones[0].hex).toBe("#aabbcc");
  });

  it("does not recompute hex when only alphaMode is patched", () => {
    const f1 = makeFamily("f1", { tones: [makeTone(500, { hex: "#fixed00" })] });
    const p1 = makeProject("p1", { colorFamilies: [f1] });
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, {
      type: "UPDATE_TONE",
      payload: { familyId: "f1", toneValue: 500, patch: { alphaMode: "transparent" } },
    });
    expect(next.projects[0].colorFamilies[0].tones[0].hex).toBe("#fixed00");
    expect(next.projects[0].colorFamilies[0].tones[0].alphaMode).toBe("transparent");
  });

  it("does not modify other tones in the same family", () => {
    const f1 = makeFamily("f1", { tones: [makeTone(500, { lightness: 50 }), makeTone(700, { lightness: 30 })] });
    const p1 = makeProject("p1", { colorFamilies: [f1] });
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, {
      type: "UPDATE_TONE",
      payload: { familyId: "f1", toneValue: 500, patch: { lightness: 80 } },
    });
    expect(next.projects[0].colorFamilies[0].tones.find((t) => t.value === 700)!.lightness).toBe(30);
  });

  it("is a no-op when activeProjectId is null", () => {
    const state = makeState({ activeProjectId: null });
    expect(
      reducer(state, { type: "UPDATE_TONE", payload: { familyId: "f1", toneValue: 500, patch: { lightness: 60 } } }),
    ).toEqual(state);
  });

  it("updates project updatedAt", () => {
    const f1 = makeFamily("f1", { tones: [makeTone(500)] });
    const p1 = makeProject("p1", { colorFamilies: [f1] });
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, {
      type: "UPDATE_TONE",
      payload: { familyId: "f1", toneValue: 500, patch: { lightness: 60 } },
    });
    expect(next.projects[0].updatedAt).not.toBe(p1.updatedAt);
  });
});

// ---------------------------------------------------------------------------
// IMPORT_PALETTE
// ---------------------------------------------------------------------------

describe("IMPORT_PALETTE", () => {
  it("adds the project when it does not already exist", () => {
    const p1 = makeProject("p1");
    const imported = makeProject("p2", { name: "Imported" });
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, { type: "IMPORT_PALETTE", payload: { project: imported } });
    expect(next.projects).toHaveLength(2);
  });

  it("replaces an existing project with the same id", () => {
    const p1 = makeProject("p1", { name: "Old" });
    const updated = makeProject("p1", { name: "Updated" });
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, { type: "IMPORT_PALETTE", payload: { project: updated } });
    expect(next.projects).toHaveLength(1);
    expect(next.projects[0].name).toBe("Updated");
  });

  it("sets activeProjectId to the imported project's id", () => {
    const p1 = makeProject("p1");
    const imported = makeProject("p2");
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, { type: "IMPORT_PALETTE", payload: { project: imported } });
    expect(next.activeProjectId).toBe("p2");
  });

  it("sets activeFamilyId to the first family of the imported project", () => {
    const f1 = makeFamily("f1");
    const imported = makeProject("p2", { colorFamilies: [f1] });
    const state = makeState({ projects: [], activeProjectId: null });
    const next = reducer(state, { type: "IMPORT_PALETTE", payload: { project: imported } });
    expect(next.activeFamilyId).toBe("f1");
  });

  it("sets activeFamilyId to null when the imported project has no families", () => {
    const imported = makeProject("p2", { colorFamilies: [] });
    const state = makeState({ projects: [], activeProjectId: null, activeFamilyId: "orphan" });
    const next = reducer(state, { type: "IMPORT_PALETTE", payload: { project: imported } });
    expect(next.activeFamilyId).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// SELECT_TONE
// ---------------------------------------------------------------------------

describe("SELECT_TONE", () => {
  it("sets activeToneValue to the given tone value", () => {
    const state = makeState();
    const next = reducer(state, { type: "SELECT_TONE", payload: { toneValue: 500 } });
    expect(next.activeToneValue).toBe(500);
  });

  it("can be called when activeProjectId is null", () => {
    const state = makeState({ activeProjectId: null });
    const next = reducer(state, { type: "SELECT_TONE", payload: { toneValue: 200 } });
    expect(next.activeToneValue).toBe(200);
  });

  it("overwrites a previously selected tone value", () => {
    const state = makeState({ activeToneValue: 300 });
    const next = reducer(state, { type: "SELECT_TONE", payload: { toneValue: 700 } });
    expect(next.activeToneValue).toBe(700);
  });

  it("does not mutate projects", () => {
    const p1 = makeProject("p1");
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, { type: "SELECT_TONE", payload: { toneValue: 500 } });
    expect(next.projects).toBe(state.projects);
  });
});

// ---------------------------------------------------------------------------
// UPDATE_TONE_BULK
// ---------------------------------------------------------------------------

describe("UPDATE_TONE_BULK", () => {
  it("patches the given toneValue in all families", () => {
    const f1 = makeFamily("f1", { tones: [makeTone(500, { lightness: 50 })] });
    const f2 = makeFamily("f2", { tones: [makeTone(500, { lightness: 60 })] });
    const p1 = makeProject("p1", { colorFamilies: [f1, f2] });
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, { type: "UPDATE_TONE_BULK", payload: { toneValue: 500, patch: { lightness: 75 } } });
    const families = next.projects[0].colorFamilies;
    expect(families[0].tones[0].lightness).toBe(75);
    expect(families[1].tones[0].lightness).toBe(75);
  });

  it("recomputes hex when L/C/H is patched without explicit hex", () => {
    const f1 = makeFamily("f1", { tones: [makeTone(500, { hex: "#ff0000" })] });
    const p1 = makeProject("p1", { colorFamilies: [f1] });
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, { type: "UPDATE_TONE_BULK", payload: { toneValue: 500, patch: { lightness: 80 } } });
    const hex = next.projects[0].colorFamilies[0].tones[0].hex;
    expect(hex).not.toBe("#ff0000");
    expect(hex).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("skips families that do not have the target tone value", () => {
    const f1 = makeFamily("f1", { tones: [makeTone(500)] });
    const f2 = makeFamily("f2", { tones: [makeTone(300)] });
    const p1 = makeProject("p1", { colorFamilies: [f1, f2] });
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, { type: "UPDATE_TONE_BULK", payload: { toneValue: 500, patch: { lightness: 99 } } });
    expect(next.projects[0].colorFamilies[1].tones[0].lightness).toBe(50); // unchanged
  });

  it("updates project updatedAt", () => {
    const p1 = makeProject("p1", { colorFamilies: [makeFamily("f1", { tones: [makeTone(500)] })] });
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, { type: "UPDATE_TONE_BULK", payload: { toneValue: 500, patch: { lightness: 60 } } });
    expect(next.projects[0].updatedAt).not.toBe(p1.updatedAt);
  });

  it("is a no-op when activeProjectId is null", () => {
    const state = makeState({ activeProjectId: null });
    const next = reducer(state, { type: "UPDATE_TONE_BULK", payload: { toneValue: 500, patch: { lightness: 60 } } });
    expect(next).toEqual(state);
  });

  it("does not affect other projects", () => {
    const f1 = makeFamily("f1", { tones: [makeTone(500, { lightness: 50 })] });
    const p1 = makeProject("p1", { colorFamilies: [f1] });
    const p2 = makeProject("p2", { colorFamilies: [makeFamily("f2", { tones: [makeTone(500, { lightness: 50 })] })] });
    const state = makeState({ projects: [p1, p2], activeProjectId: "p1" });
    const next = reducer(state, { type: "UPDATE_TONE_BULK", payload: { toneValue: 500, patch: { lightness: 99 } } });
    expect(next.projects[1].colorFamilies[0].tones[0].lightness).toBe(50); // p2 unchanged
  });
});

// ---------------------------------------------------------------------------
// SET_PRIMARY_BASE_TONE
// ---------------------------------------------------------------------------

describe("SET_PRIMARY_BASE_TONE", () => {
  it("sets primaryBaseTone on the matching family", () => {
    const f1 = makeFamily("f1", { primaryBaseTone: null });
    const p1 = makeProject("p1", { colorFamilies: [f1] });
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, { type: "SET_PRIMARY_BASE_TONE", payload: { familyId: "f1", baseTone: 600 } });
    expect(next.projects[0].colorFamilies[0].primaryBaseTone).toBe(600);
  });

  it("does not modify other families", () => {
    const f1 = makeFamily("f1", { primaryBaseTone: null });
    const f2 = makeFamily("f2", { primaryBaseTone: null });
    const p1 = makeProject("p1", { colorFamilies: [f1, f2] });
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, { type: "SET_PRIMARY_BASE_TONE", payload: { familyId: "f1", baseTone: 600 } });
    expect(next.projects[0].colorFamilies[1].primaryBaseTone).toBeNull();
  });

  it("accepts null to reset to default", () => {
    const f1 = makeFamily("f1", { primaryBaseTone: 600 });
    const p1 = makeProject("p1", { colorFamilies: [f1] });
    const state = makeState({ projects: [p1], activeProjectId: "p1" });
    const next = reducer(state, { type: "SET_PRIMARY_BASE_TONE", payload: { familyId: "f1", baseTone: null } });
    expect(next.projects[0].colorFamilies[0].primaryBaseTone).toBeNull();
  });

  it("is a no-op when activeProjectId is null", () => {
    const state = makeState({ activeProjectId: null });
    const next = reducer(state, { type: "SET_PRIMARY_BASE_TONE", payload: { familyId: "f1", baseTone: 500 } });
    expect(next).toEqual(state);
  });
});

// ---------------------------------------------------------------------------
// Project settings
// ---------------------------------------------------------------------------

describe("SET_APP_BG_LIGHTNESS", () => {
  it("updates the active project's appBgLightness", () => {
    const p1 = makeProject("p1");
    const p2 = makeProject("p2");
    const state = makeState({ projects: [p1, p2], activeProjectId: "p1" });

    const next = reducer(state, { type: "SET_APP_BG_LIGHTNESS", payload: { lightness: 12.5 } });

    expect(next.projects[0].appBgLightness).toBe(12.5);
    expect(next.projects[1].appBgLightness).toBe(100);
  });

  it("updates project updatedAt", () => {
    const p1 = makeProject("p1");
    const state = makeState({ projects: [p1], activeProjectId: "p1" });

    const next = reducer(state, { type: "SET_APP_BG_LIGHTNESS", payload: { lightness: 12.5 } });

    expect(next.projects[0].updatedAt).not.toBe(p1.updatedAt);
  });

  it("is a no-op when activeProjectId is null", () => {
    const state = makeState({ activeProjectId: null });
    const next = reducer(state, { type: "SET_APP_BG_LIGHTNESS", payload: { lightness: 12.5 } });
    expect(next).toEqual(state);
  });
});

describe("SET_TOKEN_OVERRIDE", () => {
  it("sets a token override on the active project", () => {
    const p1 = makeProject("p1");
    const state = makeState({ projects: [p1], activeProjectId: "p1" });

    const next = reducer(state, {
      type: "SET_TOKEN_OVERRIDE",
      payload: { tokenName: "--aegis-color-foreground-default", value: "#ffffff" },
    });

    expect(next.projects[0].tokenOverrides["--aegis-color-foreground-default"]).toBe("#ffffff");
  });

  it("removes a token override from the active project", () => {
    const p1 = makeProject("p1", {
      tokenOverrides: { "--aegis-color-foreground-default": "#ffffff" },
    });
    const state = makeState({ projects: [p1], activeProjectId: "p1" });

    const next = reducer(state, {
      type: "SET_TOKEN_OVERRIDE",
      payload: { tokenName: "--aegis-color-foreground-default", value: null },
    });

    expect(next.projects[0].tokenOverrides["--aegis-color-foreground-default"]).toBeUndefined();
  });

  it("updates project updatedAt", () => {
    const p1 = makeProject("p1");
    const state = makeState({ projects: [p1], activeProjectId: "p1" });

    const next = reducer(state, {
      type: "SET_TOKEN_OVERRIDE",
      payload: { tokenName: "--aegis-color-foreground-default", value: "#191919" },
    });

    expect(next.projects[0].updatedAt).not.toBe(p1.updatedAt);
  });

  it("is a no-op when activeProjectId is null", () => {
    const state = makeState({ activeProjectId: null });
    const next = reducer(state, {
      type: "SET_TOKEN_OVERRIDE",
      payload: { tokenName: "--aegis-color-foreground-default", value: "#191919" },
    });
    expect(next).toEqual(state);
  });
});

describe("SET_PANE_BACKGROUND_REF", () => {
  it("updates the active project's paneBackgroundRef", () => {
    const p1 = makeProject("p1");
    const p2 = makeProject("p2");
    const state = makeState({ projects: [p1, p2], activeProjectId: "p1" });

    const next = reducer(state, { type: "SET_PANE_BACKGROUND_REF", payload: { ref: "neutral:300" } });

    expect(next.projects[0].paneBackgroundRef).toBe("neutral:300");
    expect(next.projects[1].paneBackgroundRef).toBe("default");
  });

  it("updates project updatedAt", () => {
    const p1 = makeProject("p1");
    const state = makeState({ projects: [p1], activeProjectId: "p1" });

    const next = reducer(state, { type: "SET_PANE_BACKGROUND_REF", payload: { ref: "neutral:300" } });

    expect(next.projects[0].updatedAt).not.toBe(p1.updatedAt);
  });

  it("is a no-op when activeProjectId is null", () => {
    const state = makeState({ activeProjectId: null });
    const next = reducer(state, { type: "SET_PANE_BACKGROUND_REF", payload: { ref: "neutral:300" } });
    expect(next).toEqual(state);
  });
});
`;export{e as default};