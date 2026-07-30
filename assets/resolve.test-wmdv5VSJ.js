var e=`import { describe, expect, it } from "vitest";

import paletteInitial from "../../assets/palette-initial.json";
import { importFromPaletteJson } from "../../seed/seed";
import type { ColorFamily } from "../../store/types";
import { cssColorToRgb } from "../oklch";
import { computeChecksWithContext, formatContrastRatio, resolveRefToCss, resolveTokenRgb, TOKEN_REFS } from "./resolve";
import { COMPONENT_CHECKS, type ComponentCheckItem, type RGB } from "./specs";

const families = (): ColorFamily[] =>
  importFromPaletteJson(paletteInitial as Record<string, Record<string, string>>).colorFamilies;

const ctx = (surfaceBgRgb: RGB = [255, 255, 255]) => ({
  appBgRgb: [255, 255, 255] as RGB,
  pageBgRgb: [255, 255, 255] as RGB,
  surfaceBgRgb,
  neutralAlphaOrigin: "black" as const,
});

describe("computeChecksWithContext", () => {
  it("calculates currentSurface checks against the runtime surface background", () => {
    const seedFamilies = families();
    const surfaceBgRgb: RGB = [240, 240, 240];
    const check: ComponentCheckItem = {
      id: "test/current-surface",
      component: "Test",
      role: "foreground",
      fg: { category: "foreground", key: "default" },
      criterion: "text-normal",
      contrastTarget: "currentSurface",
      surfaceMode: "normal",
    };

    const [result] = computeChecksWithContext([check], seedFamilies, ctx(surfaceBgRgb));

    expect(result.bgRgb).toEqual(surfaceBgRgb);
    expect(result.fgRgb).toEqual(resolveTokenRgb("foreground", "default", seedFamilies, surfaceBgRgb));
    expect(result.ratio).toBeGreaterThan(1);
  });

  it("resolves componentBackground bg first, then resolves fg over that bg", () => {
    const seedFamilies = families();
    const surfaceBgRgb: RGB = [240, 240, 240];
    const check: ComponentCheckItem = {
      id: "test/component-background",
      component: "Test",
      role: "foreground",
      fg: { category: "foreground", key: "default" },
      bg: { category: "background", key: "neutral-xSubtle" },
      criterion: "text-normal",
      contrastTarget: "componentBackground",
      surfaceMode: "normal",
    };

    const expectedBg = resolveTokenRgb("background", "neutral-xSubtle", seedFamilies, surfaceBgRgb);
    const expectedFg = resolveTokenRgb("foreground", "default", seedFamilies, expectedBg ?? surfaceBgRgb);
    const [result] = computeChecksWithContext([check], seedFamilies, ctx(surfaceBgRgb));

    expect(result.bgRgb).toEqual(expectedBg);
    expect(result.fgRgb).toEqual(expectedFg);
  });

  it("supports filtering to normal surface checks only", () => {
    const filteredChecks = COMPONENT_CHECKS.filter((check) => check.surfaceMode === "normal");

    expect(filteredChecks.length).toBeGreaterThan(0);
    expect(filteredChecks.every((check) => check.surfaceMode === "normal")).toBe(true);
  });

  it("switches to a separate inverse surface check set", () => {
    const normalChecks = COMPONENT_CHECKS.filter((check) => check.surfaceMode === "normal");
    const inverseChecks = COMPONENT_CHECKS.filter((check) => check.surfaceMode === "inverse");

    expect(inverseChecks.length).toBeGreaterThan(0);
    expect(inverseChecks.every((check) => check.surfaceMode === "inverse")).toBe(true);
    expect(inverseChecks.some((check) => check.component === "Text" && check.variant === "inverse")).toBe(true);
    const normalIds = new Set(normalChecks.map((check) => check.id));
    expect(inverseChecks.some((check) => normalIds.has(check.id))).toBe(false);
  });

  it("covers normal text foreground tokens while excluding component pressed tokens", () => {
    const textNormalChecks = COMPONENT_CHECKS.filter(
      (check) => check.component === "Text" && check.surfaceMode === "normal",
    );
    const keys = new Set(textNormalChecks.map((check) => check.fg.key));

    expect(keys).toContain("disabled");
    expect(keys).toContain("danger-bold");
    expect(keys).toContain("information-bold");
    expect(keys).toContain("success-bold");
    expect(keys).toContain("warning-subtle");
    expect(keys).toContain("warning-bold");
    expect(keys).toContain("accent-blue-bold");
    expect(keys).toContain("accent-magenta-bold");
    expect(keys).not.toContain("pressed");
    expect(keys).not.toContain("danger-pressed");
    expect(keys).not.toContain("information-pressed");
    expect(keys).not.toContain("success-pressed");
    expect(keys).not.toContain("warning-pressed");
    expect(textNormalChecks.every((check) => check.state == null)).toBe(true);
  });

  it("uses neutral-bold tokens for solid neutral button backgrounds", () => {
    const solidNeutralButtonChecks = COMPONENT_CHECKS.filter(
      (check) => check.component === "Button" && check.variant === "solid·neutral",
    );

    expect(solidNeutralButtonChecks.length).toBeGreaterThan(0);
    expect(solidNeutralButtonChecks.some((check) => check.fg.key.includes("brand-bold"))).toBe(false);
    expect(solidNeutralButtonChecks.some((check) => check.bg?.key.includes("brand-bold"))).toBe(false);
    expect(solidNeutralButtonChecks.some((check) => check.fg.key === "neutral-bold")).toBe(true);
    expect(solidNeutralButtonChecks.some((check) => check.fg.key === "neutral-bold-hovered")).toBe(true);
    expect(solidNeutralButtonChecks.some((check) => check.fg.key === "neutral-bold-pressed")).toBe(true);
  });
});

describe("resolveTokenRgb", () => {
  it("brand-bold refs point to neutral scale, not brand.* (Aegis default alignment)", () => {
    expect(TOKEN_REFS.background["brand-bold"]).toBe("scale.neutral.950");
    expect(TOKEN_REFS.background["brand-bold-hovered"]).toBe("scale.neutral.950");
    expect(TOKEN_REFS.background["brand-bold-pressed"]).toBe("scale.neutral.900");
  });

  it("brand-bold resolves to neutral.950 RGB — not the first non-neutral family", () => {
    const over: RGB = [255, 255, 255];
    const result = resolveTokenRgb("background", "brand-bold", families(), over);
    expect(result).not.toBeNull();
    // neutral.950 = darkest tone — should be very dark, not red/pink
    expect(result![0]).toBeLessThan(50);
    expect(result![1]).toBeLessThan(50);
    expect(result![2]).toBeLessThan(50);
  });

  it("brand-bold-hovered and brand-bold-pressed resolve to neutral 950/900 (not red family)", () => {
    const over: RGB = [255, 255, 255];
    for (const key of ["brand-bold-hovered", "brand-bold-pressed"] as const) {
      const result = resolveTokenRgb("background", key, families(), over);
      expect(result).not.toBeNull();
      // neutral.950 / neutral.900 — both near-equal R/G/B (gray), not red
      const [r, g, b] = result!;
      expect(Math.abs(r - g)).toBeLessThan(10);
      expect(Math.abs(g - b)).toBeLessThan(10);
    }
  });

  it("TOKEN_REFS.foreground.inverse points to scale.neutral.50 (not scale.white.1000)", () => {
    expect(TOKEN_REFS.foreground["inverse"]).toBe("scale.neutral.50");
  });

  it("light project: brand-bold (neutral.950) is dark, foreground.inverse (neutral.50) is light — readable contrast", () => {
    const over: RGB = [255, 255, 255];
    // normal neutral: 950=darkest (dark), 50=#f5f5f5 (light)
    const bgRgb = resolveTokenRgb("background", "brand-bold", families(), over);
    const fgRgb = resolveTokenRgb("foreground", "inverse", families(), over);
    expect(bgRgb).not.toBeNull();
    expect(fgRgb).not.toBeNull();
    // neutral.950 must be dark side
    expect(bgRgb![0]).toBeLessThan(50);
    // neutral.50 must be light side
    expect(fgRgb![0]).toBeGreaterThan(200);
  });

  it("dark project (inverted neutral): brand-bold resolves to light side, foreground.inverse to dark side — no white-on-white", () => {
    const over: RGB = [0, 0, 0];
    // inverted neutral: 950=#f9f9f9 (R=249, light), 50=#191919 (R=25, dark)
    const bgRgb = resolveTokenRgb("background", "brand-bold", invertedNeutralFamilies(), over);
    const fgRgb = resolveTokenRgb("foreground", "inverse", invertedNeutralFamilies(), over);
    expect(bgRgb).not.toBeNull();
    expect(fgRgb).not.toBeNull();
    // neutral.950 in dark project = light (R > 200)
    expect(bgRgb![0]).toBeGreaterThan(200);
    // neutral.50 in dark project = dark (R < 50)
    expect(fgRgb![0]).toBeLessThan(50);
    // bg and fg must be on opposite ends — not white-on-white
    expect(Math.abs(bgRgb![0] - fgRgb![0])).toBeGreaterThan(150);
  });

  it("includes inverse surface token refs used by the Surface BG selector", () => {
    expect(TOKEN_REFS.background["information-bold-hovered"]).toBeDefined();
    expect(TOKEN_REFS.background["danger-bold-pressed"]).toBeDefined();
  });

  it("resolves primary token to composite RGB array — not a CSS string", () => {
    // TOKEN_REFS.background["danger-hovered"] → "primary.red.300"
    // resolvePaletteRef composites the OKLCH transparent color over white
    const result = resolveTokenRgb("background", "danger-hovered", families(), [255, 255, 255]);
    expect(result).not.toBeNull();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(3);
    expect(result!.every((v) => typeof v === "number")).toBe(true);
    expect(result!.every((v) => v >= 0 && v <= 255)).toBe(true);
  });

  it("resolves multiple primary danger tokens as RGB — all in valid sRGB range", () => {
    const over: RGB = [255, 255, 255];
    // danger → primary.red.200, danger-hovered → primary.red.300, danger-pressed → primary.red.400
    for (const key of ["danger", "danger-hovered", "danger-pressed"] as const) {
      const result = resolveTokenRgb("background", key, families(), over);
      expect(result).not.toBeNull();
      expect(Array.isArray(result)).toBe(true);
      expect(result!.every((v) => v >= 0 && v <= 255)).toBe(true);
    }
  });

  it("resolveTokenRgb returns RGB array while resolveRefToCss returns oklch string — same ref, different contracts", () => {
    // Both use "primary.red.300" under the hood via TOKEN_REFS
    const ref = TOKEN_REFS.background["danger-hovered"];
    expect(ref).toBe("primary.red.300");

    const css = resolveRefToCss(ref, families());
    expect(typeof css).toBe("string");
    expect(css).toMatch(/^oklch\\(/);

    const rgb = resolveTokenRgb("background", "danger-hovered", families(), [255, 255, 255]);
    expect(Array.isArray(rgb)).toBe(true);
    expect(typeof rgb).not.toBe("string");
  });

  it("resolveTokenRgb RGB matches cssColorToRgb(resolveRefToCss(...)) composite — same color, two contracts", () => {
    // resolveRefToCss returns the OKLCH native CSS string
    // resolveTokenRgb returns that same color composited over white as RGB
    // cssColorToRgb bridges them: compositing the CSS string over white should give the same RGB
    const white: RGB = [255, 255, 255];
    const css = resolveRefToCss("primary.red.300", families());
    expect(css).not.toBeNull();

    const expectedRgb = cssColorToRgb(css!, white);
    const actualRgb = resolveTokenRgb("background", "danger-hovered", families(), white);

    expect(expectedRgb).not.toBeNull();
    expect(actualRgb).not.toBeNull();
    // Both paths resolve the same color — values must match within floating-point rounding
    expect(actualRgb![0]).toBeCloseTo(expectedRgb![0], 0);
    expect(actualRgb![1]).toBeCloseTo(expectedRgb![1], 0);
    expect(actualRgb![2]).toBeCloseTo(expectedRgb![2], 0);
  });
});

describe("resolveRefToCss", () => {
  it("emits oklch(0% 0 0 / alpha) for neutral-transparent — not rgba()", () => {
    // neutral.300 = #cdcdcd, R=205 → alpha = round3(1-205/255) = 0.196
    const result = resolveRefToCss("scale.neutral-transparent.300", families());
    expect(result).toBe("oklch(0% 0 0 / 0.196)");
  });

  it("emits oklch(100% 0 0 / alpha) for white-transparent (inverse-transparent) in black-origin — not rgba()", () => {
    // black-origin: inverseBaseL = "100%" → same as before for light mode
    const result = resolveRefToCss("scale.white-transparent.300", families());
    expect(result).toBe("oklch(100% 0 0 / 0.196)");
  });

  it("emits oklch(L% C H / alpha) for primary lighter tones, using base tone L/C/H", () => {
    // red primaryBaseTone=600 (FAMILY_DEFAULT_BASE_TONE) → L=55.55 (AEGIS_FIXED_LIGHTNESS["600"])
    // alpha for tone 300 = neutral.300 alpha = round3(1-205/255) = 0.196
    const result = resolveRefToCss("primary.red.300", families());
    expect(result).not.toBeNull();
    expect(result).toContain("55.55%");
    expect(result).toContain("/ 0.196");
  });

  it("emits opaque oklch (no alpha) for the primary opaque tone (950)", () => {
    const result = resolveRefToCss("primary.red.950", families());
    expect(result).not.toBeNull();
    expect(result).toContain("55.55%");
    expect(result).not.toContain("/");
  });

  it("returns null for a tone outside the primary scale (missing from PRIMARY_TONE_SCALES)", () => {
    // PRIMARY_TONE_SCALES = [950, 900, 800, 700, 600, 500, 400, 300, 200, 100, 50]
    // → 999 is not in scale; 600 is, so omit 600 from this assertion.
    expect(resolveRefToCss("primary.red.999", families())).toBeNull();
  });
});

// dark-mode inverted neutral: 50=dark(#191919 R=25), 500=mid(#7d7d7d R=125), 950=light(#f9f9f9 R=249)
// calcWhiteAlpha: 50→0.098, 500→0.49, 950→0.976
const invertedNeutralFamilies = (): ColorFamily[] => {
  const invertedNeutral: ColorFamily = {
    id: "neutral-inverted",
    name: "neutral",
    primaryBaseTone: null,
    tones: [
      { value: 50, hex: "#191919", lightness: 10.2, chroma: 0, hue: 0, alphaMode: "none" as const },
      { value: 500, hex: "#7d7d7d", lightness: 50, chroma: 0, hue: 0, alphaMode: "none" as const },
      { value: 950, hex: "#f9f9f9", lightness: 97.5, chroma: 0, hue: 0, alphaMode: "none" as const },
    ],
  };
  return families().map((f) => (f.name.toLowerCase() === "neutral" ? invertedNeutral : f));
};

describe("resolveRefToCss with white-origin", () => {
  it("emits oklch(100% 0 0 / alpha) for neutral-transparent with white-origin", () => {
    // neutral.300 = #cdcdcd, R=205 → calcWhiteAlpha = round3(205/255) = 0.804
    const result = resolveRefToCss("scale.neutral-transparent.300", families(), "white");
    expect(result).toBe("oklch(100% 0 0 / 0.804)");
  });

  it("emits oklch(0% 0 0 / alpha) for neutral-transparent with black-origin (default)", () => {
    const result = resolveRefToCss("scale.neutral-transparent.300", families());
    expect(result).toBe("oklch(0% 0 0 / 0.196)");
  });

  it("primary.red.300 alpha differs between black-origin and white-origin", () => {
    // neutral.300 = #cdcdcd, R=205
    // black-origin: calcNeutralAlpha = round3(1-205/255) = 0.196
    // white-origin: calcWhiteAlpha = round3(205/255) = 0.804
    const blackResult = resolveRefToCss("primary.red.300", families(), "black");
    const whiteResult = resolveRefToCss("primary.red.300", families(), "white");
    expect(blackResult).toContain("/ 0.196");
    expect(whiteResult).toContain("/ 0.804");
  });
});

describe("resolveRefToCss with inverted (dark-mode) neutral — white-origin direction", () => {
  it("white-transparent (inverse-transparent) uses black base in white-origin", () => {
    // white-origin: inverseBaseL = "0%" → black base
    // inverted neutral.50 (#191919 R=25): calcWhiteAlpha = 0.098
    // inverted neutral.950 (#f9f9f9 R=249): calcWhiteAlpha = 0.976
    expect(resolveRefToCss("scale.white-transparent.50", invertedNeutralFamilies(), "white")).toBe(
      "oklch(0% 0 0 / 0.098)",
    );
    expect(resolveRefToCss("scale.white-transparent.950", invertedNeutralFamilies(), "white")).toBe(
      "oklch(0% 0 0 / 0.976)",
    );
  });

  it("neutral-transparent.50 is low alpha, .950 is high alpha (50 < 950)", () => {
    // inverted neutral: 50=#191919(R=25)→0.098, 950=#f9f9f9(R=249)→0.976
    expect(resolveRefToCss("scale.neutral-transparent.50", invertedNeutralFamilies(), "white")).toBe(
      "oklch(100% 0 0 / 0.098)",
    );
    expect(resolveRefToCss("scale.neutral-transparent.950", invertedNeutralFamilies(), "white")).toBe(
      "oklch(100% 0 0 / 0.976)",
    );
  });

  it("primary.red.50 alpha < primary.red.500 alpha (direction preserved in white-origin)", () => {
    // inverted neutral alphaMap: 50→0.098, 500→0.49
    // red.baseTone=700 → 50 and 500 are both transparent entries in primary scale
    const alpha50 = resolveRefToCss("primary.red.50", invertedNeutralFamilies(), "white");
    const alpha500 = resolveRefToCss("primary.red.500", invertedNeutralFamilies(), "white");
    expect(alpha50).toContain("/ 0.098");
    expect(alpha500).toContain("/ 0.49");
  });
});

describe("formatContrastRatio", () => {
  it("does not round failed threshold-near values up to a passing-looking value", () => {
    expect(formatContrastRatio(4.499, false)).toBe("4.49:1");
    expect(formatContrastRatio(2.999, false)).toBe("2.99:1");
  });

  it("uses two-decimal formatting for pass and fail values", () => {
    expect(formatContrastRatio(4.501, true)).toBe("4.50:1");
    expect(formatContrastRatio(3.82, false)).toBe("3.82:1");
    expect(formatContrastRatio(null, null)).toBe("—");
  });
});
`;export{e as default};