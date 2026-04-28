import type { ProviderOptions } from "@legalforce/aegis-react";
import greenDark from "@legalforce/aegis-tokens/css/color-scheme-green-dark.module.css";
import greenLight from "@legalforce/aegis-tokens/css/color-scheme-green-light.module.css";
import navyDark from "@legalforce/aegis-tokens/css/color-scheme-navy-dark.module.css";
import navyLight from "@legalforce/aegis-tokens/css/color-scheme-navy-light.module.css";
import neutralDark from "@legalforce/aegis-tokens/css/color-scheme-neutral-dark.module.css";
import neutralLight from "@legalforce/aegis-tokens/css/color-scheme-neutral-light.module.css";
import global from "@legalforce/aegis-tokens/css/global.module.css";
import full from "@legalforce/aegis-tokens/css/scale-full.module.css";
import medium from "@legalforce/aegis-tokens/css/scale-medium.module.css";
import small from "@legalforce/aegis-tokens/css/scale-small.module.css";

export type ThemeName = "neutral" | "green" | "navy";

export const themes: Record<ThemeName, ProviderOptions["theme"]> = {
  neutral: {
    global,
    colorScheme: { light: neutralLight, dark: neutralDark },
    scale: { full, medium, small },
  },
  green: {
    global,
    colorScheme: { light: greenLight, dark: greenDark },
    scale: { full, medium, small },
  },
  navy: {
    global,
    colorScheme: { light: navyLight, dark: navyDark },
    scale: { full, medium, small },
  },
};

export const themeOptions: { label: string; value: ThemeName }[] = [
  { value: "neutral", label: "LegalOn (neutral)" },
  { value: "green", label: "WorkOn (green)" },
  { value: "navy", label: "DealOn (navy)" },
];
