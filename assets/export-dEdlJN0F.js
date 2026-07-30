var e=`import type { PaletteProject, ToneEntry } from "../store/types";
import { toneLabel } from "../store/types";

export const exportToPaletteJson = (project: PaletteProject): Record<string, Record<string, string>> => {
  const result: Record<string, Record<string, string>> = {};

  for (const family of project.colorFamilies) {
    const toneMap: Record<string, string> = {};
    for (const tone of family.tones) {
      toneMap[toneLabel(tone.value)] = tone.hex;
    }
    result[family.name] = toneMap;
  }

  return result;
};

const formatOklch = (tone: ToneEntry): string => {
  const l = tone.lightness;
  const c = parseFloat(tone.chroma.toFixed(4));
  const h = parseFloat(tone.hue.toFixed(2));
  return \`oklch(\${l}% \${c} \${h})\`;
};

export const exportToPaletteJsonOklch = (project: PaletteProject): Record<string, Record<string, string>> => {
  const result: Record<string, Record<string, string>> = {};

  for (const family of project.colorFamilies) {
    const toneMap: Record<string, string> = {};
    for (const tone of family.tones) {
      toneMap[toneLabel(tone.value)] = formatOklch(tone);
    }
    result[family.name] = toneMap;
  }

  return result;
};
`;export{e as default};