var e=`import type { ColorFamily } from "../store/types";
import { isDisplayTone } from "../store/types";
import { calcOverlayAlpha } from "./neutral";
import { computeHex } from "./oklch";

/** "black" = light-mode shadow origin; "white" = dark-mode highlight origin. */
export type NeutralAlphaOrigin = "black" | "white";

/** appBgLightness < 50 → dark canvas → white-based neutrals. */
export const getNeutralAlphaOrigin = (appBgLightness: number): NeutralAlphaOrigin =>
  appBgLightness < 50 ? "white" : "black";

/**
 * Anchor backgrounds used when \`bgHex\` is not supplied. These match the legacy
 * behavior (BG=#ffffff for light, BG=#000000 for dark), but real callers should
 * pass the actual App BG so the alpha reproduces the target tone correctly.
 */
const ANCHOR_BG: Record<NeutralAlphaOrigin, string> = {
  black: "#ffffff",
  white: "#000000",
};

const OVERLAY_HEX: Record<NeutralAlphaOrigin, string> = {
  black: "#000000",
  white: "#ffffff",
};

/**
 * Derives alpha values dynamically from the neutral family's tone hex values.
 *
 * The overlay color is determined by \`origin\`:
 * - black-origin (light mode): black overlay  (#000000)
 * - white-origin (dark mode):  white overlay  (#ffffff)
 *
 * \`bgHex\` is the App BG color the alpha is computed against. When omitted,
 * an anchor BG (#ffffff for light / #000000 for dark) is used for backward
 * compatibility. Always pass the actual App BG when available so the alpha
 * reproduces the neutral tone exactly over the canvas in use.
 *
 * primary transparent shares the same alphaMap as neutral for the active origin.
 * This is the sole source of alphaMap for all callers.
 */
export const buildNeutralAlphaMap = (
  neutralFamily: ColorFamily | undefined,
  origin: NeutralAlphaOrigin = "black",
  bgHex?: string,
): Map<number, number> => {
  if (!neutralFamily) return new Map();

  const effectiveBgHex = bgHex ?? ANCHOR_BG[origin];
  const overlayHex = OVERLAY_HEX[origin];

  return new Map(
    neutralFamily.tones
      .filter((t) => isDisplayTone(t.value))
      .sort((a, b) => a.value - b.value)
      .map((t) => {
        const hex = t.hex || computeHex(t);
        return [t.value, calcOverlayAlpha(hex, effectiveBgHex, overlayHex)];
      }),
  );
};
`;export{e as default};