var e=`import type { ToneEntry } from "../store/types";

export const isNeutralInverted = (tones: ToneEntry[]): boolean => {
  const t50 = tones.find((t) => t.value === 50);
  const t900 = tones.find((t) => t.value === 900);
  return t50 !== undefined && t900 !== undefined && t50.lightness < t900.lightness;
};

export type NeutralScaleEntry = {
  value: number;
  hex: string;
  rgba: string;
};

const hexToChannel = (hex: string): number => {
  const n = parseInt(hex.replace("#", ""), 16);
  return (n >> 16) & 255;
};

const round3 = (n: number): number => Math.round(n * 1000) / 1000;

export const calcNeutralAlpha = (hex: string): number => round3(1 - hexToChannel(hex) / 255);

export const calcWhiteAlpha = (hex: string): number => round3(hexToChannel(hex) / 255);

/**
 * Generalized overlay alpha: solves
 *   R_bg × (1 - α) + R_overlay × α = R_target
 * for α, where α reproduces \`target\` by compositing \`overlay\` over \`bg\`.
 *
 * Reduces to:
 *   calcNeutralAlpha(target)  when bg=#ffffff, overlay=#000000
 *   calcWhiteAlpha(target)    when bg=#000000, overlay=#ffffff
 *
 * Returns 0 if the denominator collapses (bg === overlay).
 */
export const calcOverlayAlpha = (targetHex: string, bgHex: string, overlayHex: string): number => {
  const target = hexToChannel(targetHex);
  const bg = hexToChannel(bgHex);
  const overlay = hexToChannel(overlayHex);
  const denom = overlay - bg;
  if (denom === 0) return 0;
  return round3((target - bg) / denom);
};

export const buildNeutralScale = (tones: ToneEntry[]): NeutralScaleEntry[] =>
  tones.map((tone) => ({
    value: tone.value,
    hex: tone.hex,
    rgba: \`rgba(0, 0, 0, \${calcNeutralAlpha(tone.hex)})\`,
  }));

export const buildWhiteScale = (tones: ToneEntry[]): NeutralScaleEntry[] =>
  tones.map((tone) => ({
    value: tone.value,
    hex: tone.hex,
    rgba: \`rgba(255, 255, 255, \${calcWhiteAlpha(tone.hex)})\`,
  }));
`;export{e as default};