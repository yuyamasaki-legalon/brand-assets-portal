var e=`import { describe, expect, it } from "vitest";
import type { ToneEntry } from "../store/types";
import { computeHex, hexToOklchChannels, oklchToHex } from "./oklch";

// ---------------------------------------------------------------------------
// oklchToHex
// ---------------------------------------------------------------------------

describe("oklchToHex", () => {
  it("returns #000000 for l=0, c=0 (black)", () => {
    expect(oklchToHex(0, 0, 0)).toBe("#000000");
  });

  it("returns #ffffff for l=100, c=0 (white)", () => {
    expect(oklchToHex(100, 0, 0)).toBe("#ffffff");
  });

  it("returns a valid 7-character lowercase hex string", () => {
    expect(oklchToHex(50, 0.1, 240)).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("treats NaN hue the same as hue=0", () => {
    expect(oklchToHex(50, 0, Number.NaN)).toBe(oklchToHex(50, 0, 0));
  });

  it("clamps out-of-gamut values and still returns a valid hex", () => {
    expect(oklchToHex(50, 1.0, 240)).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("gray (c=0) produces the same hex regardless of hue", () => {
    expect(oklchToHex(50, 0, 0)).toBe(oklchToHex(50, 0, 180));
    expect(oklchToHex(50, 0, 0)).toBe(oklchToHex(50, 0, 359));
  });

  it("higher lightness yields a brighter gray than lower lightness", () => {
    const toInt = (h: string) => parseInt(h.slice(1), 16);
    expect(toInt(oklchToHex(80, 0, 0))).toBeGreaterThan(toInt(oklchToHex(20, 0, 0)));
  });
});

// ---------------------------------------------------------------------------
// hexToOklchChannels
// ---------------------------------------------------------------------------

describe("hexToOklchChannels", () => {
  it("black #000000 → l≈0, c≈0, h=0", () => {
    const r = hexToOklchChannels("#000000");
    expect(r.l).toBeCloseTo(0, 1);
    expect(r.c).toBeCloseTo(0, 3);
    expect(r.h).toBe(0);
  });

  it("white #ffffff → l≈100, c≈0, h=0", () => {
    const r = hexToOklchChannels("#ffffff");
    expect(r.l).toBeCloseTo(100, 0);
    expect(r.c).toBeCloseTo(0, 2);
    expect(r.h).toBe(0); // achromatic NaN → 0
  });

  it("invalid hex string → {l:0, c:0, h:0}", () => {
    expect(hexToOklchChannels("not-a-color")).toEqual({ l: 0, c: 0, h: 0 });
  });

  it("empty string → {l:0, c:0, h:0}", () => {
    expect(hexToOklchChannels("")).toEqual({ l: 0, c: 0, h: 0 });
  });

  it("h is never NaN (achromatic normalises to 0)", () => {
    expect(Number.isNaN(hexToOklchChannels("#808080").h)).toBe(false);
  });

  it("l is in 0–100 for standard hex colours (±floating-point epsilon)", () => {
    for (const hex of ["#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff", "#3b82f6"]) {
      const { l } = hexToOklchChannels(hex);
      expect(l).toBeGreaterThanOrEqual(0);
      // #ffffff can return 100.00000000000003 due to l*100 float multiplication
      expect(l).toBeLessThanOrEqual(100.0001);
    }
  });

  it("c is non-negative", () => {
    expect(hexToOklchChannels("#3b82f6").c).toBeGreaterThanOrEqual(0);
  });

  it("h is in 0–360 for chromatic colours", () => {
    const { h } = hexToOklchChannels("#3b82f6");
    expect(h).toBeGreaterThanOrEqual(0);
    expect(h).toBeLessThanOrEqual(360);
  });
});

// ---------------------------------------------------------------------------
// computeHex
// ---------------------------------------------------------------------------

describe("computeHex", () => {
  const tone = (overrides: Partial<ToneEntry> = {}): ToneEntry => ({
    value: 500,
    lightness: 50,
    chroma: 0.1,
    hue: 240,
    alphaMode: "none",
    hex: "#placeholder",
    ...overrides,
  });

  it("returns a valid 7-character hex string", () => {
    expect(computeHex(tone())).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("l=0, c=0 → #000000", () => {
    expect(computeHex(tone({ lightness: 0, chroma: 0, hue: 0 }))).toBe("#000000");
  });

  it("l=100, c=0 → #ffffff", () => {
    expect(computeHex(tone({ lightness: 100, chroma: 0, hue: 0 }))).toBe("#ffffff");
  });

  it("matches oklchToHex(lightness, chroma, hue)", () => {
    const t = tone({ lightness: 60, chroma: 0.15, hue: 180 });
    expect(computeHex(t)).toBe(oklchToHex(60, 0.15, 180));
  });

  it("hex roundtrip is stable (hex → channels → hex)", () => {
    const hex = oklchToHex(60, 0.15, 180);
    const ch = hexToOklchChannels(hex);
    expect(oklchToHex(ch.l, ch.c, ch.h)).toBe(hex);
  });
});
`;export{e as default};