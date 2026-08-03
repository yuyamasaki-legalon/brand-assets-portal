var e=`import type { Gamut, OklchChannels, ToneEntry } from "../store/types";
import type { RGB } from "./contrast/specs";

export { AEGIS_FIXED_LIGHTNESS } from "../store/types";

// Upper chroma bounds for the design UI per gamut.
export const MAX_CHROMA: Record<Gamut, number> = { sRGB: 0.4, "Display P3": 0.45 };

type ParsedColor = { r: number; g: number; b: number; alpha: number };

const clamp = (value: number, min = 0, max = 1): number => Math.min(max, Math.max(min, value));
const normalizeHue = (hue: number): number => {
  if (Number.isNaN(hue)) return 0;
  const normalized = hue % 360;
  return normalized < 0 ? normalized + 360 : normalized;
};

const linearToSrgbChannel = (value: number): number => {
  const channel = clamp(value);
  if (channel <= 0.0031308) return 12.92 * channel;
  return 1.055 * channel ** (1 / 2.4) - 0.055;
};

const srgbToLinearChannel = (value: number): number => {
  const channel = clamp(value);
  if (channel <= 0.04045) return channel / 12.92;
  return ((channel + 0.055) / 1.055) ** 2.4;
};

const toByte = (value: number): number => Math.round(clamp(value) * 255);

const oklchToLab = (lightness: number, chroma: number, hue: number) => {
  const radians = (normalizeHue(hue) * Math.PI) / 180;
  return {
    l: lightness / 100,
    a: chroma * Math.cos(radians),
    b: chroma * Math.sin(radians),
  };
};

const oklchToLinearSrgb = (lightness: number, chroma: number, hue: number) => {
  const lab = oklchToLab(lightness, chroma, hue);
  const lPrime = lab.l + 0.3963377774 * lab.a + 0.2158037573 * lab.b;
  const mPrime = lab.l - 0.1055613458 * lab.a - 0.0638541728 * lab.b;
  const sPrime = lab.l - 0.0894841775 * lab.a - 1.291485548 * lab.b;
  const l = lPrime ** 3;
  const m = mPrime ** 3;
  const s = sPrime ** 3;

  return {
    r: +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  };
};

const oklchToXyz = (lightness: number, chroma: number, hue: number) => {
  const lab = oklchToLab(lightness, chroma, hue);
  const lPrime = lab.l + 0.3963377774 * lab.a + 0.2158037573 * lab.b;
  const mPrime = lab.l - 0.1055613458 * lab.a - 0.0638541728 * lab.b;
  const sPrime = lab.l - 0.0894841775 * lab.a - 1.291485548 * lab.b;
  const l = lPrime ** 3;
  const m = mPrime ** 3;
  const s = sPrime ** 3;

  return {
    x: +1.2270138511 * l - 0.5577999807 * m + 0.281256149 * s,
    y: -0.0405801784 * l + 1.1122568696 * m - 0.0716766787 * s,
    z: -0.0763812845 * l - 0.4214819784 * m + 1.5861632204 * s,
  };
};

const oklchToLinearP3 = (lightness: number, chroma: number, hue: number) => {
  const xyz = oklchToXyz(lightness, chroma, hue);
  return {
    r: +2.4934969119 * xyz.x - 0.9313836179 * xyz.y - 0.4027107845 * xyz.z,
    g: -0.8294889696 * xyz.x + 1.7626640603 * xyz.y + 0.0236246858 * xyz.z,
    b: +0.0358458302 * xyz.x - 0.0761723893 * xyz.y + 0.956884524 * xyz.z,
  };
};

const isLinearRgbInGamut = ({ r, g, b }: { r: number; g: number; b: number }): boolean =>
  r >= 0 && r <= 1 && g >= 0 && g <= 1 && b >= 0 && b <= 1;

const parseHexColor = (input: string): ParsedColor | null => {
  const normalized = input.trim();
  const match = normalized.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!match) return null;
  const raw = match[1];
  const hex =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => \`\${c}\${c}\`)
          .join("")
      : raw;
  return {
    r: parseInt(hex.slice(0, 2), 16) / 255,
    g: parseInt(hex.slice(2, 4), 16) / 255,
    b: parseInt(hex.slice(4, 6), 16) / 255,
    alpha: 1,
  };
};

const parseNumber = (value: string, percentBase = 1): number => {
  if (value.endsWith("%")) return (Number(value.slice(0, -1)) / 100) * percentBase;
  return Number(value);
};

const parseRgbColor = (input: string): ParsedColor | null => {
  if (!/^rgba?\\(/i.test(input.trim())) return null;
  const values = input.match(/[+-]?(?:\\d+\\.?\\d*|\\.\\d+)%?/g) ?? [];
  if (values.length < 3) return null;
  const channel = (value: string) => clamp(parseNumber(value, 255) / 255);
  const alpha = values[3] ? clamp(parseNumber(values[3])) : 1;
  return {
    r: channel(values[0]!),
    g: channel(values[1]!),
    b: channel(values[2]!),
    alpha,
  };
};

const parseOklchColor = (input: string): ParsedColor | null => {
  const match = input
    .trim()
    .match(
      /^oklch\\(\\s*([+-]?(?:\\d+\\.?\\d*|\\.\\d+)%?)\\s+([+-]?(?:\\d+\\.?\\d*|\\.\\d+))\\s+([+-]?(?:\\d+\\.?\\d*|\\.\\d+))(?:deg)?(?:\\s*\\/\\s*([+-]?(?:\\d+\\.?\\d*|\\.\\d+)%?))?\\s*\\)$/i,
    );
  if (!match) return null;
  const rawLightness = match[1];
  const lightness = rawLightness.endsWith("%") ? Number(rawLightness.slice(0, -1)) : Number(rawLightness) * 100;
  const chroma = Number(match[2]);
  const hue = Number(match[3]);
  const alpha = match[4] ? clamp(parseNumber(match[4])) : 1;
  const linear = oklchToLinearSrgb(lightness, chroma, hue);

  return {
    r: linearToSrgbChannel(linear.r),
    g: linearToSrgbChannel(linear.g),
    b: linearToSrgbChannel(linear.b),
    alpha,
  };
};

const parseCssColor = (input: string): ParsedColor | null => {
  const value = input.trim();
  if (value.toLowerCase() === "transparent") return { r: 0, g: 0, b: 0, alpha: 0 };
  return parseHexColor(value) ?? parseRgbColor(value) ?? parseOklchColor(value);
};

const rgbToOklchChannels = (rgb: ParsedColor): OklchChannels => {
  const r = srgbToLinearChannel(rgb.r);
  const g = srgbToLinearChannel(rgb.g);
  const b = srgbToLinearChannel(rgb.b);
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  const lPrime = Math.cbrt(l);
  const mPrime = Math.cbrt(m);
  const sPrime = Math.cbrt(s);
  const lightness = 0.2104542553 * lPrime + 0.793617785 * mPrime - 0.0040720468 * sPrime;
  const a = 1.9779984951 * lPrime - 2.428592205 * mPrime + 0.4505937099 * sPrime;
  const bAxis = 0.0259040371 * lPrime + 0.7827717662 * mPrime - 0.808675766 * sPrime;
  const chroma = Math.sqrt(a * a + bAxis * bAxis);
  const hue = chroma < 0.000001 ? 0 : normalizeHue((Math.atan2(bAxis, a) * 180) / Math.PI);

  return { l: lightness * 100, c: chroma, h: hue };
};

// Binary search for the maximum chroma within the given gamut at the given lightness (%) and hue.
export const maxSrgbChroma = (lightness: number, hue: number): number => {
  const l = lightness / 100;
  const safeHue = Number.isNaN(hue) ? 0 : hue;
  let lo = 0,
    hi = MAX_CHROMA.sRGB;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (isLinearRgbInGamut(oklchToLinearSrgb(l * 100, mid, safeHue))) lo = mid;
    else hi = mid;
  }
  return lo;
};

export const maxP3Chroma = (lightness: number, hue: number): number => {
  const l = lightness / 100;
  const safeHue = Number.isNaN(hue) ? 0 : hue;
  let lo = 0,
    hi = MAX_CHROMA["Display P3"];
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (isLinearRgbInGamut(oklchToLinearP3(l * 100, mid, safeHue))) lo = mid;
    else hi = mid;
  }
  return lo;
};

export const maxChromaForGamut = (lightness: number, hue: number, gamut: Gamut): number =>
  gamut === "Display P3" ? maxP3Chroma(lightness, hue) : maxSrgbChroma(lightness, hue);

// Returns true if oklch(lightness%, chroma, hue) maps to a valid sRGB color.
export const isInSrgbGamut = (lightness: number, chroma: number, hue: number): boolean => {
  const safeHue = Number.isNaN(hue) ? 0 : hue;
  return isLinearRgbInGamut(oklchToLinearSrgb(lightness, chroma, safeHue));
};

// Returns true if oklch(lightness%, chroma, hue) maps to a valid Display P3 color.
export const isInP3Gamut = (lightness: number, chroma: number, hue: number): boolean => {
  const safeHue = Number.isNaN(hue) ? 0 : hue;
  return isLinearRgbInGamut(oklchToLinearP3(lightness, chroma, safeHue));
};

export const isInGamutFor = (lightness: number, chroma: number, hue: number, gamut: Gamut): boolean =>
  gamut === "Display P3" ? isInP3Gamut(lightness, chroma, hue) : isInSrgbGamut(lightness, chroma, hue);

export const oklchToHex = (l: number, c: number, h: number): string => {
  const safeHue = Number.isNaN(h) ? 0 : h;
  const linear = oklchToLinearSrgb(l, c, safeHue);
  const r = toByte(linearToSrgbChannel(linear.r)).toString(16).padStart(2, "0");
  const g = toByte(linearToSrgbChannel(linear.g)).toString(16).padStart(2, "0");
  const b = toByte(linearToSrgbChannel(linear.b)).toString(16).padStart(2, "0");
  return \`#\${r}\${g}\${b}\`;
};

export const hexToOklchChannels = (hex: string): OklchChannels => {
  const parsed = parseHexColor(hex);
  if (!parsed) {
    return { l: 0, c: 0, h: 0 };
  }
  return rgbToOklchChannels(parsed);
};

export const computeHex = (tone: ToneEntry): string => oklchToHex(tone.lightness, tone.chroma, tone.hue);

export const oklchToRgb = (lightness: number, chroma: number, hue: number): RGB => {
  const safeHue = Number.isNaN(hue) ? 0 : hue;
  const rgb = oklchToLinearSrgb(lightness, chroma, safeHue);
  return [toByte(linearToSrgbChannel(rgb.r)), toByte(linearToSrgbChannel(rgb.g)), toByte(linearToSrgbChannel(rgb.b))];
};

export const toneToRgb = (tone: ToneEntry): RGB => oklchToRgb(tone.lightness, tone.chroma, tone.hue);

export const cssColorToRgb = (color: string, backgroundRgb: RGB = [255, 255, 255]): RGB | null => {
  const parsed = parseCssColor(color);
  if (!parsed) return null;

  const alpha = clamp(parsed.alpha);
  const channels = [parsed.r, parsed.g, parsed.b] as const;

  return channels.map((channel, index) => {
    const foreground = Math.max(0, Math.min(255, channel * 255));
    return Math.round(foreground * alpha + backgroundRgb[index] * (1 - alpha));
  }) as RGB;
};

export const parseColorToRgb = (input: string, fallback: RGB = [255, 255, 255]): RGB => {
  return cssColorToRgb(input.trim(), fallback) ?? fallback;
};

export const normalizeColorInputToOklch = (input: string): string => {
  const parsed = parseCssColor(input.trim());
  if (!parsed) return input;

  const color = rgbToOklchChannels(parsed);
  const lightness = color.l.toFixed(0);
  const chroma = color.c.toFixed(3);
  const hue = Number.isNaN(color.h) ? 0 : color.h;

  return \`oklch(\${lightness}% \${chroma} \${hue.toFixed(0)})\`;
};

// Returns the highest lightness (0-100) at which oklch(L, C, H) is in sRGB.
export const maxSrgbLightness = (chroma: number, hue: number): number => {
  const safeHue = Number.isNaN(hue) ? 0 : hue;
  if (chroma <= 0) return 100;
  // Coarse scan to find the highest valid lightness seed, then binary-search to the upper edge.
  let seed = -1;
  for (let l = 5; l <= 95; l += 5) {
    if (isInSrgbGamut(l, chroma, safeHue)) seed = l;
  }
  if (seed < 0) return 0;
  let lo = seed,
    hi = 100;
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    if (isInSrgbGamut(mid, chroma, safeHue)) lo = mid;
    else hi = mid;
  }
  return lo;
};

// Returns the lowest lightness (0-100) at which oklch(L, C, H) is in sRGB.
export const minSrgbLightness = (chroma: number, hue: number): number => {
  const safeHue = Number.isNaN(hue) ? 0 : hue;
  if (chroma <= 0) return 0;
  // Coarse scan to find the lowest valid lightness seed, then binary-search to the lower edge.
  let seed = -1;
  for (let l = 95; l >= 5; l -= 5) {
    if (isInSrgbGamut(l, chroma, safeHue)) seed = l;
  }
  if (seed < 0) return 100;
  let lo = 0,
    hi = seed;
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    if (isInSrgbGamut(mid, chroma, safeHue)) hi = mid;
    else lo = mid;
  }
  return hi;
};

// Returns all invalid hue ranges [lo, hi] (degrees 0-359) for the given tone.
// Multiple disjoint invalid bands are all preserved.
// Returns empty array when all hues are in-gamut.
export const srgbHueInvalidRanges = (lightness: number, chroma: number): Array<[number, number]> => {
  if (chroma <= 0) return [];
  const STEPS = 360; // 1° per step
  const validMap = new Uint8Array(STEPS);
  let anyInvalid = false;
  for (let i = 0; i < STEPS; i++) {
    const valid = isInSrgbGamut(lightness, chroma, i);
    validMap[i] = valid ? 1 : 0;
    if (!valid) anyInvalid = true;
  }
  if (!anyInvalid) return [];

  const ranges: Array<[number, number]> = [];
  let runStart: number | null = null;
  for (let i = 0; i < STEPS; i++) {
    if (!validMap[i]) {
      if (runStart === null) runStart = i;
    } else if (runStart !== null) {
      ranges.push([runStart, i - 1]);
      runStart = null;
    }
  }
  if (runStart !== null) ranges.push([runStart, STEPS - 1]);
  return ranges;
};
`;export{e as default};