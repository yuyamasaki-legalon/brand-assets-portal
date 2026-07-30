var e=`import { wcagContrastRatio } from "./contrast";
import type { RGB } from "./contrast/specs";

const WHITE: RGB = [255, 255, 255];
const BLACK: RGB = [0, 0, 0];

/** Returns whichever of #ffffff / #000000 has higher WCAG contrast against the given background. */
export const contrastTextColor = (bgRgb: RGB): "#ffffff" | "#000000" =>
  wcagContrastRatio(WHITE, bgRgb) >= wcagContrastRatio(BLACK, bgRgb) ? "#ffffff" : "#000000";
`;export{e as default};