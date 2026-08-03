var e=`import { AEGIS_FIXED_LIGHTNESS, hexToOklchChannels } from "../color/oklch";
import type { ColorFamily, PaletteProject, ToneEntry } from "../store/types";
import { ALT_TONE_SENTINEL } from "../store/types";

const FAMILY_DEFAULT_BASE_TONE: Record<string, number> = {
  neutral: 900,
  red: 600,
  orange: 500,
  amber: 400,
  yellow: 400,
  lime: 600,
  grass: 600,
  teal: 700,
  azure: 600,
  blue: 600,
  indigo: 500,
  purple: 700,
  magenta: 600,
  green: 800,
  navy: 800,
};

export const importFromPaletteJson = (
  json: Record<string, Record<string, string>>,
  name = "Aegis Default",
  applyFixedLightness = true,
): PaletteProject => {
  const colorFamilies: ColorFamily[] = Object.entries(json).map(([familyName, toneMap]) => {
    const tones: ToneEntry[] = Object.entries(toneMap)
      .map(([toneKey, hex]): ToneEntry | null => {
        const value = toneKey === "alt500" ? ALT_TONE_SENTINEL : Number(toneKey);

        if (Number.isNaN(value)) {
          return null;
        }

        const channels = hexToOklchChannels(hex);
        const fixedLightness = applyFixedLightness ? AEGIS_FIXED_LIGHTNESS[toneKey] : undefined;

        return {
          value,
          lightness: fixedLightness !== undefined ? fixedLightness : channels.l,
          chroma: channels.c,
          hue: channels.h,
          alphaMode: "none",
          hex,
        };
      })
      .filter((tone): tone is ToneEntry => tone !== null)
      .sort((left, right) => left.value - right.value);

    return {
      id: crypto.randomUUID(),
      name: familyName,
      tones,
      primaryBaseTone: FAMILY_DEFAULT_BASE_TONE[familyName.toLowerCase()] ?? null,
      isBuiltIn: familyName.toLowerCase() === "neutral" ? true : undefined,
    };
  });

  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    name,
    createdAt: now,
    updatedAt: now,
    colorFamilies,
    appBgLightness: 100,
    paneBackgroundRef: "default",
    tokenOverrides: {},
  };
};
`;export{e as default};