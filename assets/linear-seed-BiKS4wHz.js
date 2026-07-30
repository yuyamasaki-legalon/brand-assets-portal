var e=`import linearLch from "../assets/palette-linear-lch.json";
import { hexToOklchChannels, oklchToHex } from "../color/oklch";
import type { ColorFamily, PaletteProject, ToneEntry } from "../store/types";

// Ordered by hue angle. Neutral (achromatic) first, then chromatics: red≈29°, orange≈48°,
// yellow≈85°, green≈142°, cyan≈210°, blue≈267°, purple≈288°.
const FAMILY_ORDER = ["neutral", "red", "orange", "yellow", "green", "cyan", "blue", "purple"] as const;

const PRIMARY_BASE_TONE: Partial<Record<string, number>> = {
  neutral: 900,
  red: 600,
  orange: 600,
  yellow: 600,
  green: 600,
  cyan: 600,
  blue: 600,
  purple: 600,
};

// Aegis canonical tone values — only these are kept/interpolated.
const AEGIS_TONES = [50, 100, 200, 300, 400, 450, 500, 600, 700, 800, 900];

// Convert an LCH CSS string to hex via browser canvas.
// LCH is well-supported (Chrome 111+, Firefox 113+, Safari 15.4+).
const lchToHex = (lchStr: string): string => {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = lchStr;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return \`#\${r.toString(16).padStart(2, "0")}\${g.toString(16).padStart(2, "0")}\${b.toString(16).padStart(2, "0")}\`;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const buildLinearTones = (toneMap: Record<string, string>): ToneEntry[] => {
  // Parse all tones provided in the source data.
  const parsed = Object.entries(toneMap)
    .map(([key, lchStr]): [number, ToneEntry] => {
      const hex = lchToHex(lchStr);
      const { l, c, h } = hexToOklchChannels(hex);
      return [Number(key), { value: Number(key), lightness: l, chroma: c, hue: h, alphaMode: "none" as const, hex }];
    })
    .sort(([a], [b]) => a - b);

  const toneByValue = new Map(parsed);
  const sortedSrcValues = [...toneByValue.keys()];

  const result: ToneEntry[] = [];
  for (const target of AEGIS_TONES) {
    if (toneByValue.has(target)) {
      result.push(toneByValue.get(target)!);
    } else {
      // Interpolate between the nearest bracketing source tones, if they exist.
      const lower = [...sortedSrcValues].reverse().find((v) => v < target);
      const upper = sortedSrcValues.find((v) => v > target);
      if (lower !== undefined && upper !== undefined) {
        const t = (target - lower) / (upper - lower);
        const lo = toneByValue.get(lower)!;
        const hi = toneByValue.get(upper)!;
        const l = lerp(lo.lightness, hi.lightness, t);
        const c = lerp(lo.chroma, hi.chroma, t);
        const h = lerp(lo.hue, hi.hue, t);
        result.push({ value: target, lightness: l, chroma: c, hue: h, alphaMode: "none", hex: oklchToHex(l, c, h) });
      }
      // Skip tones outside the available source range (e.g. 800/900 for accent families).
    }
  }

  return result.sort((a, b) => a.value - b.value);
};

export const createLinearProject = (): PaletteProject => {
  const now = new Date().toISOString();
  const lchData = linearLch as Record<string, Record<string, string>>;

  const colorFamilies: ColorFamily[] = FAMILY_ORDER.filter((name) => name in lchData).map((name) => ({
    id: crypto.randomUUID(),
    name,
    primaryBaseTone: PRIMARY_BASE_TONE[name] ?? null,
    isBuiltIn: name === "neutral" ? true : undefined,
    tones: buildLinearTones(lchData[name]),
  }));

  return {
    id: crypto.randomUUID(),
    name: "Linear",
    createdAt: now,
    updatedAt: now,
    colorFamilies,
    appBgLightness: 100,
    paneBackgroundRef: "default",
    tokenOverrides: {},
  };
};
`;export{e as default};