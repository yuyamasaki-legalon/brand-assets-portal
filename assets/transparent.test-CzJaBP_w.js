var e=`import { describe, expect, it } from "vitest";

import type { ColorFamily } from "../store/types";
import { buildNeutralAlphaMap, getNeutralAlphaOrigin } from "./transparent";

// light-mode neutral palette: 50 is lightest (high R), 900 is darkest (low R)
// neutral.50 = #f5f5f5 → R=245; neutral.900 = #191919 → R=25
const lightNeutralFamily: ColorFamily = {
  id: "neutral-light",
  name: "neutral",
  tones: [
    { value: 50, hex: "#f5f5f5", lightness: 96.08, chroma: 0, hue: 0, alphaMode: "none" as const },
    { value: 900, hex: "#191919", lightness: 10.2, chroma: 0, hue: 0, alphaMode: "none" as const },
  ],
  primaryBaseTone: null,
};

// dark-mode inverted neutral palette: 50 is darkest (low R), 900 is lightest (high R)
// neutral.50 = #191919 → R=25; neutral.900 = #f5f5f5 → R=245
const darkNeutralFamily: ColorFamily = {
  id: "neutral-dark",
  name: "neutral",
  tones: [
    { value: 50, hex: "#191919", lightness: 10.2, chroma: 0, hue: 0, alphaMode: "none" as const },
    { value: 900, hex: "#f5f5f5", lightness: 96.08, chroma: 0, hue: 0, alphaMode: "none" as const },
  ],
  primaryBaseTone: null,
};

describe("getNeutralAlphaOrigin", () => {
  it("returns white when appBgLightness < 50", () => {
    expect(getNeutralAlphaOrigin(0)).toBe("white");
    expect(getNeutralAlphaOrigin(49)).toBe("white");
    expect(getNeutralAlphaOrigin(49.999)).toBe("white");
  });

  it("returns black when appBgLightness >= 50", () => {
    expect(getNeutralAlphaOrigin(50)).toBe("black");
    expect(getNeutralAlphaOrigin(100)).toBe("black");
  });

  it("treats exactly 50 as black (light mode threshold)", () => {
    expect(getNeutralAlphaOrigin(50)).toBe("black");
  });
});

describe("buildNeutralAlphaMap", () => {
  it("black-origin: light palette — 50 has low alpha, 900 has high alpha", () => {
    // calcNeutralAlpha: 50 (#f5f5f5 R=245) → 0.039, 900 (#191919 R=25) → 0.902
    const map = buildNeutralAlphaMap(lightNeutralFamily, "black");
    expect(map.get(50)).toBeCloseTo(0.039, 3);
    expect(map.get(900)).toBeCloseTo(0.902, 3);
    expect(map.get(50)!).toBeLessThan(map.get(900)!);
  });

  it("white-origin: dark (inverted) palette — 50 has low alpha, 900 has high alpha", () => {
    // calcWhiteAlpha: 50 (#191919 R=25) → 0.098, 900 (#f5f5f5 R=245) → 0.961
    const map = buildNeutralAlphaMap(darkNeutralFamily, "white");
    expect(map.get(50)).toBeCloseTo(0.098, 3);
    expect(map.get(900)).toBeCloseTo(0.961, 3);
    expect(map.get(50)!).toBeLessThan(map.get(900)!);
  });

  it("white-origin uses calcWhiteAlpha (R/255), not calcNeutralAlpha", () => {
    // standard neutral.300 = #e1e1e1 R=225 → calcWhiteAlpha = 0.882, calcNeutralAlpha = 0.118
    const singleToneFamily: ColorFamily = {
      id: "t",
      name: "neutral",
      tones: [{ value: 300, hex: "#e1e1e1", lightness: 88.24, chroma: 0, hue: 0, alphaMode: "none" as const }],
      primaryBaseTone: null,
    };
    expect(buildNeutralAlphaMap(singleToneFamily, "white").get(300)).toBeCloseTo(0.882, 3);
    expect(buildNeutralAlphaMap(singleToneFamily, "black").get(300)).toBeCloseTo(0.118, 3);
  });

  it("returns empty Map when neutralFamily is undefined", () => {
    expect(buildNeutralAlphaMap(undefined, "black").size).toBe(0);
    expect(buildNeutralAlphaMap(undefined, "white").size).toBe(0);
  });
});
`;export{e as default};