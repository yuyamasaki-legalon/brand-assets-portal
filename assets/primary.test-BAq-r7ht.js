var e=`import { describe, expect, it } from "vitest";
import type { ColorFamily, ToneEntry } from "../store/types";
import { buildPrimaryScale } from "./primary";

const makeTone = (value: number, hex: string): ToneEntry => ({
  value,
  lightness: 50,
  chroma: 0.1,
  hue: 240,
  alphaMode: "none",
  hex,
});

const makeFamily = (name: string, tones: ToneEntry[], primaryBaseTone: number | null = null): ColorFamily => ({
  id: \`family-\${name}\`,
  name,
  tones,
  primaryBaseTone,
});

// ALPHA_MAP covers all non-950 tones in PRIMARY_TONE_SCALES
const ALPHA_MAP = new Map<number, number>([
  [50, 0.04],
  [100, 0.07],
  [200, 0.12],
  [300, 0.2],
  [400, 0.32],
  [500, 0.45],
  [600, 0.62],
  [700, 0.73],
  [800, 0.82],
  [900, 0.94],
]);

describe("buildPrimaryScale", () => {
  it("tone 950 is always the opaque reference — uses baseTone L/C/H, all others use alphaMap", () => {
    const family = makeFamily("primary", [makeTone(700, "#ad1610")], 700);
    const scale = buildPrimaryScale(family, ALPHA_MAP);

    // 950 is the opaque entry (DEFAULT_BASE_TONE)
    expect(scale.find((e) => e.value === 950)?.oklch).toBe("oklch(50% 0.1 240)");
    // other tones in PRIMARY_TONE_SCALES use baseTone L/C/H + alphaMap
    expect(scale.find((e) => e.value === 700)?.oklch).toBe("oklch(50% 0.1 240 / 0.73)");
    expect(scale.find((e) => e.value === 500)?.oklch).toBe("oklch(50% 0.1 240 / 0.45)");
    expect(scale.find((e) => e.value === 100)?.oklch).toBe("oklch(50% 0.1 240 / 0.07)");
    // tone 600 is in PRIMARY_TONE_SCALES
    expect(scale.find((e) => e.value === 600)?.oklch).toBe("oklch(50% 0.1 240 / 0.62)");
  });

  it("defaults to tone 950 when primaryBaseTone is null", () => {
    const family = makeFamily("primary", [makeTone(950, "#000000")], null);
    const scale = buildPrimaryScale(family, ALPHA_MAP);

    // tone 950 is the opaque reference (DEFAULT_BASE_TONE)
    expect(scale.find((e) => e.value === 950)).toEqual({ value: 950, hex: "#000000", oklch: "oklch(50% 0.1 240)" });
    // other tones use base hex + alphaMap
    expect(scale.find((e) => e.value === 100)?.oklch).toBe("oklch(50% 0.1 240 / 0.07)");
    expect(scale.find((e) => e.value === 50)?.oklch).toBe("oklch(50% 0.1 240 / 0.04)");
  });

  it("returns empty array when base tone is not found", () => {
    const family = makeFamily("primary", [makeTone(100, "#808080"), makeTone(500, "#404040")], 800);
    expect(buildPrimaryScale(family, ALPHA_MAP)).toEqual([]);
  });

  it("all scale entries use baseTone hex and baseTone L/C/H regardless of individual tone hue or chroma", () => {
    const family = makeFamily(
      "primary",
      [makeTone(100, "#0000cc"), makeTone(500, "#0044cc"), makeTone(700, "#cc0000")],
      700,
    );
    const scale = buildPrimaryScale(family, ALPHA_MAP);
    // all entries use baseTone (700) hex and L/C/H
    expect(scale.every((e) => e.hex === "#cc0000")).toBe(true);
    expect(scale.every((e) => e.oklch.startsWith("oklch(50% 0.1 240"))).toBe(true);
  });

  it("baseTone L/C/H is used even when baseTone is visually darker than lighter-numbered tones", () => {
    const family = makeFamily("primary", [makeTone(100, "#111111"), makeTone(700, "#808080")], 700);
    const scale = buildPrimaryScale(family, ALPHA_MAP);
    expect(scale.every((e) => e.hex === "#808080")).toBe(true);
  });

  it("generates exactly PRIMARY_TONE_SCALES entries when alphaMap covers all non-950 tones", () => {
    const family = makeFamily("primary", [makeTone(700, "#ad1610")], 700);
    const scale = buildPrimaryScale(family, ALPHA_MAP);
    // PRIMARY_TONE_SCALES = [950, 900, 800, 700, 600, 500, 400, 300, 200, 100, 50]
    expect(scale.map((e) => e.value)).toEqual([950, 900, 800, 700, 600, 500, 400, 300, 200, 100, 50]);
  });

  it("normalizes persisted string tone values before building the scale", () => {
    const tones = [500, 700].map((v) => ({
      ...makeTone(v, "#ad1610"),
      value: String(v) as unknown as number,
    }));
    const family = makeFamily("red", tones, "700" as unknown as number);
    const scale = buildPrimaryScale(family, ALPHA_MAP);

    expect(scale.find((e) => e.value === 950)?.oklch).toBe("oklch(50% 0.1 240)");
    expect(scale.find((e) => e.value === 700)?.oklch).toBe("oklch(50% 0.1 240 / 0.73)");
    expect(scale.find((e) => e.value === 500)?.oklch).toBe("oklch(50% 0.1 240 / 0.45)");
  });

  it("falls back to the base hex when persisted OKLCH channels are invalid", () => {
    const invalidBaseTone: ToneEntry = {
      ...makeTone(700, "#ad1610"),
      chroma: Number.NaN,
      hue: Number.NaN,
      lightness: Number.NaN,
    };
    const family = makeFamily("red", [invalidBaseTone], 700);
    const scale = buildPrimaryScale(family, ALPHA_MAP);
    const opaque = scale.find((e) => e.value === 950)?.oklch;
    const lighter = scale.find((e) => e.value === 500)?.oklch;

    expect(opaque).toMatch(/^oklch\\(\\d/);
    expect(opaque).not.toContain("NaN");
    expect(lighter).toContain("/ 0.45");
    expect(lighter).not.toContain("NaN");
  });

  it("uses the alpha value from alphaMap, not a fixed table", () => {
    const customAlphaMap = new Map<number, number>([
      [100, 0.15],
      [900, 0.99],
    ]);
    const family = makeFamily("primary", [makeTone(700, "#000000")], 700);
    const scale = buildPrimaryScale(family, customAlphaMap);

    expect(scale.find((e) => e.value === 100)?.oklch).toBe("oklch(50% 0.1 240 / 0.15)");
    expect(scale.find((e) => e.value === 900)?.oklch).toBe("oklch(50% 0.1 240 / 0.99)");
    // 950 is always opaque regardless of alphaMap
    expect(scale.find((e) => e.value === 950)?.oklch).toBe("oklch(50% 0.1 240)");
  });

  it("excludes tones not present in alphaMap rather than treating them as transparent", () => {
    const sparseAlphaMap = new Map<number, number>([[500, 0.45]]); // 100 is missing
    const family = makeFamily("primary", [makeTone(700, "#000000")], 700);
    const scale = buildPrimaryScale(family, sparseAlphaMap);
    const values = scale.map((e) => e.value);

    // 950 is always included (opaque, no alphaMap lookup)
    expect(values).toContain(950);
    expect(values).toContain(500);
    // 100 is absent because sparseAlphaMap has no entry for it
    expect(values).not.toContain(100);
  });

  it("tone 950 is always opaque regardless of alphaMap entry", () => {
    const family = makeFamily("primary", [makeTone(700, "#000000")], 700);
    const scale = buildPrimaryScale(family, ALPHA_MAP);
    expect(scale.find((e) => e.value === 950)?.oklch).toBe("oklch(50% 0.1 240)");
  });
});
`;export{e as default};