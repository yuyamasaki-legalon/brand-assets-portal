/**
 * Shared color math utilities.
 * Pure functions only — no React, no side effects.
 */

export interface OklchColor {
  l: number;
  c: number;
  h: number;
}

/** Parse a 3- or 6-digit hex color string to [r, g, b] (0–255 each). */
export const hexToRgb = (hex: string): [number, number, number] => {
  const normalized = hex.replace("#", "");
  const expanded =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : normalized;
  return [
    Number.parseInt(expanded.slice(0, 2), 16),
    Number.parseInt(expanded.slice(2, 4), 16),
    Number.parseInt(expanded.slice(4, 6), 16),
  ];
};

/** Format a hex color + alpha as a CSS rgba() string. */
export const hexToRgba = (hex: string, alpha: number): string => {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const srgbToLinear = (value: number): number => {
  const n = value / 255;
  return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
};

/** Convert sRGB (0–255 each) to OKLCH. */
export const rgbToOklch = (r: number, g: number, b: number): OklchColor => {
  const rl = srgbToLinear(r);
  const gl = srgbToLinear(g);
  const bl = srgbToLinear(b);

  const l = 0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl;
  const m = 0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl;
  const s = 0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl;

  const lRoot = Math.cbrt(l);
  const mRoot = Math.cbrt(m);
  const sRoot = Math.cbrt(s);

  const lOklab = 0.2104542553 * lRoot + 0.793617785 * mRoot - 0.0040720468 * sRoot;
  const aOklab = 1.9779984951 * lRoot - 2.428592205 * mRoot + 0.4505937099 * sRoot;
  const bOklab = 0.0259040371 * lRoot + 0.7827717662 * mRoot - 0.808675766 * sRoot;

  const c = Math.sqrt(aOklab * aOklab + bOklab * bOklab);
  const rawHue = (Math.atan2(bOklab, aOklab) * 180) / Math.PI;

  return { l: lOklab, c, h: rawHue >= 0 ? rawHue : rawHue + 360 };
};

/** Convert a hex color string to OKLCH. */
export const hexToOklch = (hex: string): OklchColor => rgbToOklch(...hexToRgb(hex));

/**
 * Compute the alpha value such that `rgba(black, alpha)` placed over white
 * renders visually equivalent to the given hex color on a white background.
 *
 * Formula (per-channel, valid for grayscale where R = G = B):
 *   alpha = (255 − R) / 255
 *
 * This is used to derive transparent-scale alphas directly from neutral palette
 * steps instead of hardcoding them in palette-config.json.
 */
export const computeWhiteEquivAlpha = (hex: string): number => {
  const [r] = hexToRgb(hex);
  return Math.round(((255 - r) / 255) * 100) / 100;
};

/**
 * Aegis OKLCH lightness (L%) for each standard palette tone.
 * These fixed lightness targets are used when generating / snapping palette swatches.
 */
export const FIXED_LIGHTNESS: Readonly<Record<string, number>> = {
  "900": 21.3,
  "800": 29,
  "700": 38,
  "600": 47.8,
  "500": 59.1,
  alt500: 67,
  "400": 78.1,
  "300": 91,
  "200": 94.5,
  "100": 96.5,
  "50": 98.21,
};

/**
 * Replace the `0, 0, 0` RGB component in box-shadow rgba() values with the
 * given color, leaving alpha values unchanged.
 *
 * Used to tint Aegis depth (shadow) tokens when a brand accent color is active.
 *
 * Example:
 *   tintDepthShadows("0 1px 4px rgba(0, 0, 0, 0.05)", 19, 25, 61)
 *   → "0 1px 4px rgba(19, 25, 61, 0.05)"
 */
export const tintDepthShadows = (shadowValue: string, r: number, g: number, b: number): string =>
  shadowValue.replace(/rgba\(\s*0\s*,\s*0\s*,\s*0\s*,/g, `rgba(${r}, ${g}, ${b},`);

/**
 * Find the palette tone key (from `candidates`) whose FIXED_LIGHTNESS is
 * closest to the OKLCH lightness of the given hex color.
 *
 * @param hex        Input color
 * @param candidates Tone keys to compare against, e.g. ["900","800","700","600"]
 */
export const findNearestToneByLightness = (hex: string, candidates: readonly string[]): string => {
  const { l } = hexToOklch(hex);
  const lightnessPercent = l * 100;

  return candidates.reduce((nearest, current) => {
    const nearestDiff = Math.abs((FIXED_LIGHTNESS[nearest] ?? Number.POSITIVE_INFINITY) - lightnessPercent);
    const currentDiff = Math.abs((FIXED_LIGHTNESS[current] ?? Number.POSITIVE_INFINITY) - lightnessPercent);
    return currentDiff < nearestDiff ? current : nearest;
  });
};
