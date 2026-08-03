var e=`import { describe, expect, it } from "vitest";
import type { ColorFamily, PaletteProject, ToneEntry } from "../store/types";
import { exportToPaletteTokensJs } from "./exportTokens";

const makeTone = (value: number, hex: string): ToneEntry => ({
  value,
  lightness: 50,
  chroma: 0.1,
  hue: 240,
  alphaMode: "none",
  hex,
});

const makeFamily = (
  name: string,
  tones: ToneEntry[],
  primaryBaseTone: number | null = null,
  isBuiltIn = false,
): ColorFamily => ({
  id: \`family-\${name}\`,
  name,
  tones,
  primaryBaseTone,
  isBuiltIn,
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

type PaletteScaleToken = { $value: string; $deprecated?: boolean };
type ExportedPalette = {
  internal: {
    color: {
      palette: {
        $type: "color";
        scale: Record<string, Record<string, PaletteScaleToken> | PaletteScaleToken>;
        primary: Record<string, Record<string, PaletteScaleToken>>;
      };
    };
  };
};

const parseExport = (result: string): ExportedPalette =>
  JSON.parse(result.replace(/^export default /, "").replace(/;\\s*$/, "")) as ExportedPalette;

describe("exportToPaletteTokensJs", () => {
  it("output contains palette scale and primary sections", () => {
    const project = makeProject({
      colorFamilies: [makeFamily("brand", [makeTone(800, "#000000")])],
    });
    const result = exportToPaletteTokensJs(project);
    const palette = parseExport(result).internal.color.palette;
    expect(palette.$type).toBe("color");
    expect(palette.scale).toHaveProperty("white");
    expect(palette.scale).toHaveProperty("transparent");
    expect(palette.scale).toHaveProperty("brand");
    expect(palette.primary).toEqual({});
  });

  it("neutral-transparent uses black overlay alpha computed from built-in neutral tones", () => {
    const project = makeProject({
      colorFamilies: [makeFamily("neutral", [makeTone(900, "#191919")], null, true)],
    });
    const result = exportToPaletteTokensJs(project);
    const neutralTransparent = parseExport(result).internal.color.palette.scale["neutral-transparent"] as Record<
      string,
      PaletteScaleToken
    >;
    expect(neutralTransparent["900"].$value).toBe("oklch(0% 0 0 / 0.902)");
  });

  it("white-transparent (inverse-transparent) uses white base in black-origin (light mode)", () => {
    // light / black-origin (appBgLightness=100): inverseBaseL = "100%", alpha = calcNeutralAlpha = 0.902
    const project = makeProject({
      colorFamilies: [makeFamily("neutral", [makeTone(900, "#191919")], null, true)],
    });
    const result = exportToPaletteTokensJs(project);
    const whiteTransparent = parseExport(result).internal.color.palette.scale["white-transparent"] as Record<
      string,
      PaletteScaleToken
    >;
    expect(whiteTransparent["900"].$value).toBe("oklch(100% 0 0 / 0.902)");
    expect(Object.keys(parseExport(result).internal.color.palette.scale)).toContain("white-transparent");
    expect(Object.keys(parseExport(result).internal.color.palette.scale)).not.toContain("inverse-transparent");
  });

  it("white-transparent (inverse-transparent) uses black base in white-origin (dark mode)", () => {
    // dark / white-origin (appBgLightness=20): inverseBaseL = "0%", alpha derived from App BG
    // appBgLightness=20 → BG = oklch(20% 0 0) ≈ #161616 (R=22)
    // neutral.300 = #e1e1e1 (R=225) → alpha = (225-22)/(255-22) = round3(203/233) = 0.871
    const project = makeProject({
      appBgLightness: 20,
      colorFamilies: [makeFamily("neutral", [makeTone(300, "#e1e1e1")], null, true)],
    });
    const result = exportToPaletteTokensJs(project);
    const whiteTransparent = parseExport(result).internal.color.palette.scale["white-transparent"] as Record<
      string,
      PaletteScaleToken
    >;
    expect(whiteTransparent["300"].$value).toBe("oklch(0% 0 0 / 0.871)");
    expect(whiteTransparent["300"].$value).not.toContain("oklch(100%");
  });

  it("built-in neutral family is excluded from primary output", () => {
    const project = makeProject({
      colorFamilies: [
        makeFamily("neutral", [makeTone(500, "#999999")], null, true),
        makeFamily("brand", [makeTone(500, "#123456")], 500),
      ],
    });
    const result = exportToPaletteTokensJs(project);
    const primary = parseExport(result).internal.color.palette.primary;
    expect(primary).not.toHaveProperty("neutral");
    expect(primary).toHaveProperty("brand");
  });

  it("falls back to empty transparent scales when no built-in neutral family exists", () => {
    const project = makeProject({
      colorFamilies: [makeFamily("brand", [makeTone(500, "#000000")])],
    });
    const result = exportToPaletteTokensJs(project);
    const scale = parseExport(result).internal.color.palette.scale;
    expect(scale["neutral-transparent"]).toEqual({});
    expect(scale["white-transparent"]).toEqual({});
  });

  it("white-origin (appBgLightness=20): neutral-transparent alpha derived from App BG (50 low, 900 high)", () => {
    // appBgLightness=20 → BG = oklch(20% 0 0) ≈ #161616 (R=22), overlay = #ffffff
    // alpha = (R_target - 22) / (255 - 22)
    // 50  = #191919 (R=25)  → (25-22)/233  = round3(0.0129) = 0.013
    // 900 = #f5f5f5 (R=245) → (245-22)/233 = round3(0.9571) = 0.957
    const project = makeProject({
      appBgLightness: 20,
      colorFamilies: [makeFamily("neutral", [makeTone(50, "#191919"), makeTone(900, "#f5f5f5")], null, true)],
    });
    const result = exportToPaletteTokensJs(project);
    const neutralTransparent = parseExport(result).internal.color.palette.scale["neutral-transparent"] as Record<
      string,
      PaletteScaleToken
    >;
    expect(neutralTransparent["50"].$value).toBe("oklch(100% 0 0 / 0.013)");
    expect(neutralTransparent["900"].$value).toBe("oklch(100% 0 0 / 0.957)");
    expect(neutralTransparent["50"].$value).not.toContain("oklch(0%");
    expect(neutralTransparent["900"].$value).not.toContain("oklch(0%");
  });

  it("black-origin (appBgLightness=100): neutral-transparent uses oklch(0% 0 0 / alpha)", () => {
    // neutral.300 = #e1e1e1 → R=225 → black-origin alpha = round3(1-225/255) = 0.118
    const project = makeProject({
      appBgLightness: 100,
      colorFamilies: [makeFamily("neutral", [makeTone(300, "#e1e1e1")], null, true)],
    });
    const result = exportToPaletteTokensJs(project);
    const neutralTransparent = parseExport(result).internal.color.palette.scale["neutral-transparent"] as Record<
      string,
      PaletteScaleToken
    >;
    expect(neutralTransparent["300"].$value).toBe("oklch(0% 0 0 / 0.118)");
  });
});
`;export{e as default};