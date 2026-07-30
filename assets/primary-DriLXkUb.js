var e=`import type { ColorFamily } from "../store/types";
import { hexToOklchChannels } from "./oklch";

export const DEFAULT_BASE_TONE = 950;

// Fixed primary tone set — v3 tone numbering.
// Tone 950 is always the opaque reference; others use neutralAlphaMap alpha values.
const PRIMARY_TONE_SCALES = [950, 900, 800, 700, 600, 500, 400, 300, 200, 100, 50] as const;

const formatOklchColor = (l: number, c: number, h: number, alpha?: number): string => {
  const lStr = \`\${l}%\`;
  const cStr = String(parseFloat(c.toFixed(4)));
  const hStr = String(parseFloat(h.toFixed(2)));
  return alpha !== undefined && alpha < 1
    ? \`oklch(\${lStr} \${cStr} \${hStr} / \${alpha})\`
    : \`oklch(\${lStr} \${cStr} \${hStr})\`;
};

const resolveBaseChannels = (baseTone: ColorFamily["tones"][number]): { l: number; c: number; h: number } => {
  const fallback = hexToOklchChannels(baseTone.hex);
  return {
    l: Number.isFinite(baseTone.lightness) ? baseTone.lightness : fallback.l,
    c: Number.isFinite(baseTone.chroma) ? baseTone.chroma : fallback.c,
    h: Number.isFinite(baseTone.hue) ? baseTone.hue : fallback.h,
  };
};

export type PrimaryScaleEntry = {
  value: number;
  hex: string;
  oklch: string;
};

/**
 * Build the primary scale for a color family.
 *
 * Always generates the fixed tone set [950, 900, 800, 700, 500, 400, 300, 200, 100, 50]:
 * - Tone 950 → baseTone color opaque (alpha = 1)
 * - Other tones → baseTone color at neutralAlphaMap[tone] alpha
 *
 * primaryBaseTone controls which palette tone is used as the opaque base color.
 * All tones are always generated regardless of the baseTone value,
 * so primary.*.950 is never null.
 */
export const buildPrimaryScale = (family: ColorFamily, alphaMap: Map<number, number>): PrimaryScaleEntry[] => {
  const baseToneValue = Number(family.primaryBaseTone ?? DEFAULT_BASE_TONE);
  if (!Number.isFinite(baseToneValue)) return [];

  const baseTone = family.tones.find((t) => Number(t.value) === baseToneValue);
  if (!baseTone) return [];

  const { l: baseL, c: baseC, h: baseH } = resolveBaseChannels(baseTone);
  const result: PrimaryScaleEntry[] = [];

  for (const tone of PRIMARY_TONE_SCALES) {
    if (tone === DEFAULT_BASE_TONE) {
      result.push({ value: DEFAULT_BASE_TONE, hex: baseTone.hex, oklch: formatOklchColor(baseL, baseC, baseH) });
      continue;
    }
    const alpha = alphaMap.get(tone);
    if (alpha === undefined) continue;
    result.push({ value: tone, hex: baseTone.hex, oklch: formatOklchColor(baseL, baseC, baseH, alpha) });
  }

  return result;
};
`;export{e as default};