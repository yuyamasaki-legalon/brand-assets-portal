var e=`import tailwindHex from "../assets/palette-tailwind-hex.json";
import { hexToOklchChannels, oklchToHex } from "../color/oklch";
import type { ColorFamily, PaletteProject, ToneEntry } from "../store/types";

// Neutrals ordered by warm→cool hue tilt, then new tinted variants grouped by hue.
// Chromatics in hue-angle order (red≈20° … rose≈355°).
const FAMILY_ORDER = [
  "neutral",
  "zinc",
  "gray",
  "slate",
  "stone",
  "taupe",
  "olive",
  "mist",
  "mauve",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
] as const;

const PRIMARY_BASE_TONE: Partial<Record<string, number>> = {
  neutral: 900,
  zinc: 900,
  gray: 900,
  slate: 900,
  stone: 900,
  taupe: 900,
  olive: 900,
  mist: 900,
  mauve: 900,
  red: 500,
  orange: 500,
  amber: 500,
  yellow: 500,
  lime: 500,
  green: 600,
  emerald: 600,
  teal: 600,
  cyan: 600,
  sky: 500,
  blue: 600,
  indigo: 600,
  violet: 600,
  purple: 600,
  fuchsia: 600,
  pink: 600,
  rose: 600,
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const buildTones = (toneMap: Record<string, string>): ToneEntry[] => {
  const base = Object.entries(toneMap)
    .filter(([key]) => key !== "950")
    .map(([key, hex]): ToneEntry => {
      const { l, c, h } = hexToOklchChannels(hex);
      return { value: Number(key), lightness: l, chroma: c, hue: h, alphaMode: "none", hex };
    })
    .sort((a, b) => a.value - b.value);

  const t400 = base.find((t) => t.value === 400);
  const t500 = base.find((t) => t.value === 500);
  if (t400 && t500) {
    const l = lerp(t400.lightness, t500.lightness, 0.5);
    const c = lerp(t400.chroma, t500.chroma, 0.5);
    const h = lerp(t400.hue, t500.hue, 0.5);
    const tone450: ToneEntry = {
      value: 450,
      lightness: l,
      chroma: c,
      hue: h,
      alphaMode: "none",
      hex: oklchToHex(l, c, h),
    };
    return [...base, tone450].sort((a, b) => a.value - b.value);
  }
  return base;
};

export const createTailwindProject = (): PaletteProject => {
  const now = new Date().toISOString();
  const hexData = tailwindHex as Record<string, Record<string, string>>;

  const colorFamilies: ColorFamily[] = FAMILY_ORDER.filter((name) => name in hexData).map((name) => ({
    id: crypto.randomUUID(),
    name,
    primaryBaseTone: PRIMARY_BASE_TONE[name] ?? null,
    isBuiltIn: name === "neutral" ? true : undefined,
    tones: buildTones(hexData[name]),
  }));

  return {
    id: crypto.randomUUID(),
    name: "tailwind",
    createdAt: now,
    updatedAt: now,
    colorFamilies,
    appBgLightness: 100,
    paneBackgroundRef: "default",
    tokenOverrides: {},
  };
};
`;export{e as default};