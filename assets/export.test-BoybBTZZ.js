var e=`import { describe, expect, it } from "vitest";
import type { ColorFamily, PaletteProject, ToneEntry } from "../store/types";
import { exportToPaletteJson } from "./export";

// ---------------------------------------------------------------------------
// Factories
// ---------------------------------------------------------------------------

const makeTone = (value: number, hex: string): ToneEntry => ({
  value,
  lightness: 50,
  chroma: 0.1,
  hue: 240,
  alphaMode: "none",
  hex,
});

const makeFamily = (name: string, tones: ToneEntry[]): ColorFamily => ({
  id: \`family-\${name}\`,
  name,
  tones,
  primaryBaseTone: null,
});

const makeProject = (overrides: Partial<PaletteProject> = {}): PaletteProject => ({
  id: "project-1",
  name: "Test",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  colorFamilies: [],
  appBgLightness: 100,
  paneBackgroundRef: "default",
  tokenOverrides: {},
  ...overrides,
});

// ---------------------------------------------------------------------------
// exportToPaletteJson
// ---------------------------------------------------------------------------

describe("exportToPaletteJson", () => {
  it("returns an empty object when the project has no families", () => {
    expect(exportToPaletteJson(makeProject())).toEqual({});
  });

  it("maps family name to a tone map with stringified tone values as keys", () => {
    const project = makeProject({
      colorFamilies: [makeFamily("Blue", [makeTone(50, "#eef2ff"), makeTone(100, "#e0e7ff")])],
    });
    expect(exportToPaletteJson(project)).toEqual({
      Blue: { "50": "#eef2ff", "100": "#e0e7ff" },
    });
  });

  it("handles multiple families", () => {
    const project = makeProject({
      colorFamilies: [
        makeFamily("Blue", [makeTone(500, "#0000ff")]),
        makeFamily("Red", [makeTone(500, "#ff0000")]),
        makeFamily("Green", [makeTone(500, "#00ff00")]),
      ],
    });
    const result = exportToPaletteJson(project);
    expect(Object.keys(result)).toHaveLength(3);
    expect(result.Blue).toEqual({ "500": "#0000ff" });
    expect(result.Red).toEqual({ "500": "#ff0000" });
    expect(result.Green).toEqual({ "500": "#00ff00" });
  });

  it("produces an empty tone map for a family with no tones", () => {
    const project = makeProject({ colorFamilies: [makeFamily("Empty", [])] });
    expect(exportToPaletteJson(project)).toEqual({ Empty: {} });
  });

  it("tone value is always stringified as the key (not a number)", () => {
    const project = makeProject({ colorFamilies: [makeFamily("Gray", [makeTone(950, "#111111")])] });
    const result = exportToPaletteJson(project);
    expect(typeof Object.keys(result.Gray)[0]).toBe("string");
    expect(Object.keys(result.Gray)).toEqual(["950"]);
  });

  it("preserves the tone's hex value exactly", () => {
    const project = makeProject({ colorFamilies: [makeFamily("X", [makeTone(500, "#abcdef")])] });
    expect(exportToPaletteJson(project).X["500"]).toBe("#abcdef");
  });

  it("output shape matches palette-initial.json (familyName → toneValue → hex)", () => {
    const project = makeProject({
      colorFamilies: [makeFamily("primary", [makeTone(50, "#f0f9ff"), makeTone(900, "#0c4a6e")])],
    });
    const result = exportToPaletteJson(project);
    expect(typeof result).toBe("object");
    expect(typeof result.primary).toBe("object");
    expect(typeof result.primary["50"]).toBe("string");
  });

  it("is a pure function — calling it twice returns equal results", () => {
    const project = makeProject({ colorFamilies: [makeFamily("Blue", [makeTone(500, "#0000ff")])] });
    expect(exportToPaletteJson(project)).toEqual(exportToPaletteJson(project));
  });
});
`;export{e as default};