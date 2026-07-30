var e=`// Palette Lab–specific token → RGB resolution.
// This is the source of truth for how palette tones map to Aegis semantic tokens.
// sandbox-builder should eventually be updated to match this logic.
//
// ─── 責務分担 ──────────────────────────────────────────────────────────────────
// resolveRefToCss    → CSS 文字列を返す (oklch(...) 等)。runtime CSS 変数用。
//                      transparent / primary の出力は OKLCH native を優先する。
//                      rgba(...) は使わない。
// resolvePaletteRef  → composite 済み RGB を返す。contrast 計算専用。
//                      CSS 文字列は返さない。
//
// この2つを混ぜると UI 表示・runtime token・contrast 計算でズレが生じる。
// ──────────────────────────────────────────────────────────────────────────────

import type { ColorFamily } from "../../store/types";
import { ALT_TONE_SENTINEL } from "../../store/types";
import { cssColorToRgb } from "../oklch";
import { buildPrimaryScale } from "../primary";
import { buildNeutralAlphaMap, type NeutralAlphaOrigin } from "../transparent";
import type { ComponentCheckItem, ContrastCriterion, DesignTokenOverrideCategory, RGB } from "./specs";

// ─── Static token refs ────────────────────────────────────────────────────────
// Default palette references for each semantic token.
// Source: sandbox-builder/token-overrides/{background,foreground,border}.tokens.json
//
// Ref format:
//   scale.neutral.{tone}            → resolved from neutral ColorFamily (name === "neutral")
//   scale.neutral-transparent.{n}   → oklch(0% 0 0 / alpha) composited over background
//   scale.white.1000                → #ffffff
//   scale.white-transparent.{n}     → legacy key for inverse-transparent; base = opposite of neutral-transparent
//   primary.{name}.{tone}           → resolved from named ColorFamily (name === colorName)
//   scale.{color}.{tone}            → fixed Aegis palette (FIXED_PALETTE below, unaffected by palette lab)
//   scale.transparent               → fully transparent (returns background)

export const TOKEN_REFS: Record<DesignTokenOverrideCategory, Record<string, string>> = {
  background: {
    default: "scale.white.1000",
    input: "scale.white.1000",
    "input-focused": "scale.white.1000",
    "input-hovered": "scale.neutral-transparent.100",
    "input-bold": "scale.neutral.400",
    "neutral-subtlest": "scale.transparent",
    "neutral-subtlest-opaque": "scale.white.1000",
    "neutral-subtlest-hovered": "scale.neutral-transparent.100",
    "neutral-subtlest-pressed": "scale.neutral-transparent.200",
    "neutral-subtlest-selected": "scale.neutral-transparent.100",
    "neutral-subtlest-opaque-hovered": "scale.neutral.100",
    "neutral-subtlest-opaque-pressed": "scale.neutral.200",
    "neutral-subtlest-opaque-selected": "scale.neutral.100",
    "neutral-xSubtle": "scale.neutral-transparent.50",
    "neutral-xSubtle-hovered": "scale.neutral-transparent.100",
    "neutral-xSubtle-pressed": "scale.neutral-transparent.200",
    "neutral-xSubtle-selected": "scale.neutral-transparent.100",
    "neutral-xSubtle-opaque": "scale.neutral.50",
    "neutral-subtle": "scale.neutral-transparent.100",
    "neutral-subtle-hovered": "scale.neutral-transparent.200",
    "neutral-subtle-pressed": "scale.neutral-transparent.300",
    "neutral-subtle-opaque": "scale.neutral.100",
    neutral: "scale.neutral-transparent.300",
    "neutral-opaque": "scale.neutral.300",
    "neutral-bold": "scale.neutral.950",
    "neutral-bold-hovered": "scale.neutral.950",
    "neutral-bold-pressed": "scale.neutral.900",
    selected: "scale.neutral-transparent.200",
    "selected-bold": "scale.neutral.950",
    disabled: "scale.neutral-transparent.50",
    "brand-bold": "scale.neutral.950",
    "brand-bold-hovered": "scale.neutral.950",
    "brand-bold-pressed": "scale.neutral.900",
    "inverse-subtlest": "scale.transparent",
    "inverse-subtlest-hovered": "scale.white-transparent.200",
    "inverse-subtlest-pressed": "scale.white-transparent.300",
    "inverse-subtle": "scale.white-transparent.100",
    "inverse-subtle-hovered": "scale.white-transparent.200",
    "inverse-subtle-pressed": "scale.white-transparent.300",
    inverse: "scale.white-transparent.300",
    "inverse-disabled": "scale.white-transparent.50",
    "inverse-bold": "scale.white-transparent.950",
    "inverse-bold-hovered": "scale.white-transparent.950",
    "inverse-bold-pressed": "scale.white-transparent.900",
    "danger-subtlest": "scale.transparent",
    "danger-subtlest-hovered": "primary.red.100",
    "danger-subtlest-pressed": "primary.red.200",
    "danger-subtlest-selected": "primary.red.100",
    "danger-subtlest-disabled": "primary.red.50",
    "danger-subtle": "primary.red.100",
    "danger-subtle-hovered": "primary.red.200",
    "danger-subtle-pressed": "primary.red.300",
    danger: "primary.red.200",
    "danger-hovered": "primary.red.300",
    "danger-pressed": "primary.red.400",
    "danger-bold": "primary.red.950",
    "danger-bold-hovered": "primary.red.900",
    "danger-bold-pressed": "primary.red.800",
    "danger-xSubtle": "scale.red.50",
    "success-subtlest": "scale.transparent",
    "success-subtlest-hovered": "primary.teal.100",
    "success-subtlest-pressed": "primary.teal.200",
    "success-subtle": "primary.teal.100",
    "success-subtle-hovered": "primary.teal.200",
    "success-subtle-pressed": "primary.teal.300",
    success: "primary.teal.200",
    "success-hovered": "primary.teal.300",
    "success-pressed": "primary.teal.400",
    "success-bold": "primary.teal.950",
    "success-xBold": "scale.teal.900",
    "success-xBold-hovered": "scale.teal.950",
    "success-xBold-pressed": "scale.teal.950",
    "warning-subtlest": "scale.transparent",
    "warning-subtlest-hovered": "primary.yellow.100",
    "warning-subtlest-pressed": "primary.yellow.200",
    "warning-subtlest-selected": "primary.yellow.100",
    "warning-subtlest-disabled": "primary.yellow.50",
    "warning-subtle": "primary.yellow.100",
    "warning-subtle-hovered": "primary.yellow.200",
    "warning-subtle-pressed": "primary.yellow.300",
    warning: "primary.yellow.200",
    "warning-hovered": "primary.yellow.300",
    "warning-pressed": "primary.yellow.400",
    "warning-bold": "primary.yellow.950",
    "warning-xSubtle": "scale.yellow.50",
    "warning-xBold": "scale.yellow.800",
    "warning-xBold-hovered": "scale.yellow.900",
    "warning-xBold-pressed": "scale.yellow.950",
    "information-subtlest": "scale.transparent",
    "information-subtlest-hovered": "primary.blue.100",
    "information-subtlest-pressed": "primary.blue.200",
    "information-subtle": "primary.blue.100",
    "information-subtle-hovered": "primary.blue.200",
    "information-subtle-pressed": "primary.blue.300",
    information: "primary.blue.200",
    "information-hovered": "primary.blue.300",
    "information-pressed": "primary.blue.400",
    "information-bold": "primary.blue.950",
    "information-bold-hovered": "primary.blue.900",
    "information-bold-pressed": "primary.blue.800",
    "information-xSubtle": "scale.blue.50",
    "accent-gray-subtlest": "scale.transparent",
    "accent-gray-subtlest-hovered": "scale.neutral-transparent.50",
    "accent-gray-subtlest-pressed": "scale.neutral-transparent.100",
    "accent-gray-subtlest-selected": "scale.neutral-transparent.50",
    "accent-gray-subtlest-disabled": "scale.neutral-transparent.50",
    "accent-gray-xxSubtle": "scale.neutral-transparent.100",
    "accent-gray-xSubtle": "scale.neutral-transparent.200",
    "accent-blue-subtlest": "scale.transparent",
    "accent-blue-subtlest-hovered": "primary.blue.100",
    "accent-blue-subtlest-pressed": "primary.blue.200",
    "accent-blue-xxSubtle": "primary.blue.100",
    "accent-blue-xSubtle": "primary.blue.200",
    "accent-blue-subtle": "primary.blue.300",
    "accent-blue-subtle-hovered": "primary.blue.400",
    "accent-blue-subtle-pressed": "primary.blue.700",
    "accent-blue-subtle-disabled": "primary.blue.50",
    "accent-yellow-subtlest": "scale.transparent",
    "accent-yellow-subtlest-hovered": "primary.yellow.100",
    "accent-yellow-subtlest-pressed": "primary.yellow.200",
    "accent-yellow-xxSubtle": "primary.yellow.100",
    "accent-yellow-xSubtle": "primary.yellow.200",
    "accent-yellow-subtle": "primary.yellow.300",
    "accent-yellow-subtle-hovered": "primary.yellow.400",
    "accent-yellow-subtle-pressed": "primary.yellow.700",
    "accent-yellow-subtle-disabled": "primary.yellow.50",
    "accent-orange-subtlest": "scale.transparent",
    "accent-orange-subtlest-hovered": "primary.orange.100",
    "accent-orange-subtlest-pressed": "primary.orange.200",
    "accent-orange-xxSubtle": "primary.orange.100",
    "accent-orange-xSubtle": "primary.orange.200",
    "accent-orange-subtle": "primary.orange.300",
    "accent-orange-subtle-hovered": "primary.orange.400",
    "accent-orange-subtle-pressed": "primary.orange.700",
    "accent-orange-subtle-disabled": "primary.orange.50",
    "accent-red-subtlest": "scale.transparent",
    "accent-red-subtlest-hovered": "primary.red.100",
    "accent-red-subtlest-pressed": "primary.red.200",
    "accent-red-xxSubtle": "primary.red.100",
    "accent-red-xSubtle": "primary.red.200",
    "accent-red-subtle": "primary.red.300",
    "accent-red-subtle-hovered": "primary.red.400",
    "accent-red-subtle-pressed": "primary.red.700",
    "accent-red-subtle-disabled": "primary.red.50",
    "accent-purple-subtlest": "scale.transparent",
    "accent-purple-subtlest-hovered": "primary.purple.100",
    "accent-purple-subtlest-pressed": "primary.purple.200",
    "accent-purple-xxSubtle": "primary.purple.100",
    "accent-purple-xSubtle": "primary.purple.200",
    "accent-purple-subtle": "primary.purple.300",
    "accent-purple-subtle-hovered": "primary.purple.400",
    "accent-purple-subtle-pressed": "primary.purple.700",
    "accent-purple-subtle-disabled": "primary.purple.50",
    "accent-teal-subtlest": "scale.transparent",
    "accent-teal-subtlest-hovered": "primary.teal.100",
    "accent-teal-subtlest-pressed": "primary.teal.200",
    "accent-teal-xxSubtle": "primary.teal.100",
    "accent-teal-xSubtle": "primary.teal.200",
    "accent-teal-subtle": "primary.teal.300",
    "accent-teal-subtle-hovered": "primary.teal.400",
    "accent-teal-subtle-pressed": "primary.teal.700",
    "accent-teal-subtle-disabled": "primary.teal.50",
    "accent-indigo-subtlest": "scale.transparent",
    "accent-indigo-subtlest-hovered": "primary.indigo.100",
    "accent-indigo-subtlest-pressed": "primary.indigo.200",
    "accent-indigo-xxSubtle": "primary.indigo.100",
    "accent-indigo-xSubtle": "primary.indigo.200",
    "accent-indigo-subtle": "primary.indigo.300",
    "accent-indigo-subtle-hovered": "primary.indigo.400",
    "accent-indigo-subtle-pressed": "primary.indigo.700",
    "accent-indigo-subtle-disabled": "primary.indigo.50",
    "accent-magenta-subtlest": "scale.transparent",
    "accent-magenta-subtlest-hovered": "primary.magenta.100",
    "accent-magenta-subtlest-pressed": "primary.magenta.200",
    "accent-magenta-xxSubtle": "primary.magenta.100",
    "accent-magenta-xSubtle": "primary.magenta.200",
    "accent-magenta-subtle": "primary.magenta.300",
    "accent-magenta-subtle-hovered": "primary.magenta.400",
    "accent-magenta-subtle-pressed": "primary.magenta.700",
    "accent-magenta-subtle-disabled": "primary.magenta.50",
    "accent-lime-subtlest": "scale.transparent",
    "accent-lime-subtlest-hovered": "primary.lime.100",
    "accent-lime-subtlest-pressed": "primary.lime.200",
    "accent-lime-xSubtle": "primary.lime.100",
    "accent-lime-subtle": "primary.lime.300",
    "accent-lime-subtle-hovered": "primary.lime.400",
    "accent-lime-subtle-pressed": "primary.lime.700",
    "accent-lime-subtle-disabled": "primary.lime.50",
    "accent-blue-bold": "primary.blue.950",
    "accent-yellow-bold": "primary.yellow.950",
    "accent-orange-bold": "primary.orange.950",
    "accent-red-bold": "primary.red.950",
    "accent-purple-bold": "primary.purple.950",
    "accent-teal-bold": "primary.teal.950",
    "accent-indigo-bold": "primary.indigo.950",
    "accent-magenta-bold": "primary.magenta.950",
    "accent-lime-bold": "primary.lime.950",
  },
  foreground: {
    default: "scale.neutral.950",
    bold: "scale.neutral.950",
    subtle: "scale.neutral-transparent.700",
    xSubtle: "scale.neutral.700",
    brand: "scale.neutral.950",
    disabled: "scale.neutral.300",
    "disabled-inverse": "scale.neutral.400",
    pressed: "scale.neutral.950",
    inverse: "scale.neutral.50",
    "inverse-subtle": "scale.white-transparent.900",
    danger: "scale.red.900",
    "danger-pressed": "scale.red.950",
    "danger-bold": "scale.red.950",
    information: "scale.blue.900",
    "information-pressed": "scale.blue.950",
    "information-bold": "scale.blue.950",
    success: "scale.teal.900",
    "success-pressed": "scale.teal.950",
    "success-bold": "scale.teal.950",
    "warning-subtle": "scale.yellow.800",
    warning: "scale.yellow.900",
    "warning-pressed": "scale.yellow.950",
    "warning-bold": "scale.yellow.950",
    "accent-gray-subtle": "scale.neutral.900",
    "accent-gray": "scale.neutral.950",
    "accent-blue-subtle": "scale.blue.900",
    "accent-blue": "scale.blue.950",
    "accent-blue-bold": "scale.blue.950",
    "accent-yellow-subtle": "scale.yellow.900",
    "accent-yellow": "scale.yellow.950",
    "accent-yellow-bold": "scale.yellow.950",
    "accent-orange-subtle": "scale.orange.900",
    "accent-orange": "scale.orange.950",
    "accent-orange-bold": "scale.orange.950",
    "accent-red-subtle": "scale.red.900",
    "accent-red": "scale.red.950",
    "accent-red-bold": "scale.red.950",
    "accent-purple-subtle": "scale.purple.900",
    "accent-purple": "scale.purple.950",
    "accent-purple-bold": "scale.purple.950",
    "accent-lime-subtle": "scale.lime.900",
    "accent-lime": "scale.lime.950",
    "accent-lime-bold": "scale.lime.950",
    "accent-teal-subtle": "scale.teal.900",
    "accent-teal": "scale.teal.950",
    "accent-teal-bold": "scale.teal.950",
    "accent-indigo-subtle": "scale.indigo.900",
    "accent-indigo": "scale.indigo.950",
    "accent-indigo-bold": "scale.indigo.950",
    "accent-magenta-subtle": "scale.magenta.900",
    "accent-magenta": "scale.magenta.950",
    "accent-magenta-bold": "scale.magenta.950",
  },
  border: {
    default: "scale.neutral-transparent.200",
    bold: "scale.neutral.400",
    disabled: "scale.neutral-transparent.200",
    selected: "scale.neutral.950",
    brand: "scale.neutral.950",
    input: "scale.neutral.500",
    "input-hovered": "scale.neutral.950",
    "input-focused": "scale.neutral.950",
    neutral: "scale.neutral-transparent.300",
    "neutral-subtlest": "scale.transparent",
    "neutral-subtlest-hovered": "scale.neutral-transparent.300",
    "neutral-subtlest-pressed": "scale.neutral.950",
    "neutral-subtle": "scale.neutral-transparent.200",
    "neutral-bold": "scale.neutral-transparent.700",
    "inverse-subtlest": "scale.transparent",
    "inverse-subtlest-hovered": "scale.white-transparent.300",
    "inverse-subtlest-pressed": "scale.white-transparent.950",
    "inverse-subtle": "scale.white-transparent.300",
    inverse: "scale.white-transparent.900",
    "inverse-disabled": "scale.white-transparent.200",
    "inverse-bold": "scale.white.1000",
    "danger-subtlest": "scale.transparent",
    "danger-subtlest-hovered": "primary.red.300",
    "danger-subtlest-pressed": "scale.red.900",
    "danger-subtle": "primary.red.200",
    danger: "primary.red.800",
    "danger-bold": "primary.red.950",
    "information-subtlest": "scale.transparent",
    "information-subtlest-hovered": "primary.blue.300",
    "information-subtlest-pressed": "scale.blue.900",
    "information-subtle": "primary.blue.700",
    information: "primary.blue.800",
    "information-bold": "primary.blue.950",
    "information-xBold": "scale.blue.900",
    "success-subtlest": "scale.transparent",
    "success-subtlest-hovered": "primary.teal.300",
    "success-subtlest-pressed": "scale.teal.900",
    "warning-subtlest": "scale.transparent",
    "warning-subtlest-hovered": "primary.yellow.300",
    "warning-subtlest-pressed": "scale.yellow.900",
    warning: "primary.yellow.800",
    "warning-bold": "primary.yellow.950",
    "accent-gray-bold": "scale.neutral.300",
    "accent-blue-bold": "scale.blue.800",
    "accent-blue-bold-disabled": "primary.blue.200",
    "accent-yellow-bold": "scale.yellow.800",
    "accent-yellow-bold-disabled": "primary.yellow.200",
    "accent-orange-bold": "scale.orange.800",
    "accent-orange-bold-disabled": "primary.orange.200",
    "accent-purple-bold": "scale.purple.800",
    "accent-purple-bold-disabled": "primary.purple.200",
    "accent-red-bold": "scale.red.800",
    "accent-red-bold-disabled": "primary.red.200",
    "accent-teal-bold": "scale.teal.800",
    "accent-teal-bold-disabled": "primary.teal.200",
    "accent-indigo-bold": "scale.indigo.800",
    "accent-indigo-bold-disabled": "primary.indigo.200",
    "accent-magenta-bold": "scale.magenta.800",
    "accent-magenta-bold-disabled": "primary.magenta.200",
    "accent-lime-bold": "scale.lime.800",
    "accent-lime-bold-disabled": "primary.lime.200",
  },
};

// ─── Fixed accent palette ─────────────────────────────────────────────────────
// Static Aegis palette colors (scale.{color}.{tone}) not affected by palette lab adjustments.
// Source: sandbox-builder/token-overrides/palette.json

export const FIXED_PALETTE: Record<string, Record<string, string>> = {
  red: {
    "50": "#fef7f6",
    "100": "#fdf0ee",
    "200": "#fbe8e4",
    "300": "#ffd7d0",
    "400": "#f99a8d",
    "500": "#dd4d3f",
    "700": "#ba271d",
    "800": "#d34638",
    "900": "#ad1610",
    "950": "#7f0b07",
  },
  blue: {
    "50": "#f6f9fe",
    "100": "#eef4fc",
    "200": "#e3eefc",
    "300": "#cee3ff",
    "400": "#8fbbf3",
    "500": "#3085e8",
    "700": "#1066c1",
    "800": "#3f7ecf",
    "900": "#215da5",
    "950": "#0e417d",
  },
  teal: {
    "50": "#eefdf7",
    "100": "#e5f9f1",
    "200": "#d2f7e9",
    "300": "#b4f1db",
    "400": "#51d2ac",
    "500": "#009c7a",
    "700": "#007a5e",
    "800": "#039373",
    "900": "#016e55",
    "950": "#024f3c",
  },
  yellow: {
    "50": "#fdf9f2",
    "100": "#fbf2e3",
    "200": "#ffeac8",
    "300": "#ffdca1",
    "400": "#e9ab2c",
    "500": "#a18200",
    "700": "#806300",
    "800": "#a37402",
    "900": "#7a5600",
    "950": "#573d04",
  },
  orange: {
    "50": "#fdf8f5",
    "100": "#fef0e9",
    "200": "#ffe7dc",
    "300": "#ffd8c4",
    "400": "#fa9d6c",
    "500": "#d25e00",
    "700": "#a54800",
    "800": "#c15d1e",
    "900": "#944103",
    "950": "#6b2e04",
  },
  purple: {
    "50": "#faf8fd",
    "100": "#f7f1fc",
    "200": "#f2e8fa",
    "300": "#ebd9f9",
    "400": "#cba6e7",
    "500": "#aa59de",
    "700": "#893bb8",
    "800": "#9a5fc0",
    "900": "#793aa0",
    "950": "#5a237a",
  },
  magenta: {
    "50": "#fef7f9",
    "100": "#feeff3",
    "200": "#fee6ec",
    "300": "#fbd6e0",
    "400": "#f895b5",
    "500": "#df3c82",
    "700": "#b32565",
    "800": "#c44d7b",
    "900": "#a1235a",
    "950": "#761640",
  },
  lime: {
    "50": "#f8fbef",
    "100": "#f2f7e0",
    "200": "#eaf2cb",
    "300": "#ddeaa3",
    "400": "#b2c348",
    "500": "#799033",
    "700": "#5e7027",
    "800": "#798628",
    "900": "#5a641a",
    "950": "#404715",
  },
  indigo: {
    "50": "#f9f8fd",
    "100": "#f3f2fc",
    "200": "#ecebfb",
    "300": "#dfddff",
    "400": "#b4afed",
    "500": "#7b6df3",
    "700": "#604ecd",
    "800": "#7b6bd0",
    "900": "#5c49ac",
    "950": "#422e88",
  },
};

// ─── Color utilities ──────────────────────────────────────────────────────────

const WHITE: RGB = [255, 255, 255];
const BLACK: RGB = [0, 0, 0];

const hexToRgb = (hex: string): RGB => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const compositeOver = (fg: RGB, alpha: number, bg: RGB): RGB => [
  Math.round(alpha * fg[0] + (1 - alpha) * bg[0]),
  Math.round(alpha * fg[1] + (1 - alpha) * bg[1]),
  Math.round(alpha * fg[2] + (1 - alpha) * bg[2]),
];

// ─── Palette ref resolver ─────────────────────────────────────────────────────

const resolvePaletteRef = (
  ref: string,
  families: ColorFamily[],
  over: RGB = WHITE,
  origin: NeutralAlphaOrigin = "black",
  bgHex?: string,
): RGB | null => {
  if (ref === "scale.transparent") return over;
  if (ref === "scale.white.1000") return WHITE;

  if (ref.startsWith("scale.white-transparent.")) {
    const tone = parseInt(ref.slice(24), 10);
    const neutralFamily = families.find((f) => f.name.toLowerCase() === "neutral");
    const alpha = buildNeutralAlphaMap(neutralFamily, origin, bgHex).get(tone);
    if (alpha === undefined) return null;
    // inverse-transparent: opposite base from neutral-transparent
    return compositeOver(origin === "white" ? BLACK : WHITE, alpha, over);
  }

  if (ref.startsWith("scale.neutral-transparent.")) {
    const tone = parseInt(ref.slice(26), 10);
    const neutralFamily = families.find((f) => f.name.toLowerCase() === "neutral");
    const alpha = buildNeutralAlphaMap(neutralFamily, origin, bgHex).get(tone);
    if (alpha === undefined) return null;
    return compositeOver(origin === "white" ? WHITE : BLACK, alpha, over);
  }

  if (ref.startsWith("scale.neutral.")) {
    const tone = parseInt(ref.slice(14), 10);
    const neutralFamily = families.find((f) => f.name.toLowerCase() === "neutral");
    const toneEntry = neutralFamily?.tones.find((t) => t.value === tone);
    if (!toneEntry) return null;
    return hexToRgb(toneEntry.hex);
  }

  if (ref.startsWith("brand.")) {
    // Resolve against the first non-neutral family (the brand/primary family in the lab)
    const toneStr = ref.slice(6);
    const toneValue = toneStr === "alt500" ? ALT_TONE_SENTINEL : parseInt(toneStr, 10);
    const brandFamily = families.find((f) => f.name.toLowerCase() !== "neutral");
    if (!brandFamily) return null;
    const toneEntry = brandFamily.tones.find((t) => t.value === toneValue);
    if (!toneEntry) return null;
    return hexToRgb(toneEntry.hex);
  }

  if (ref.startsWith("primary.")) {
    const rest = ref.slice(8); // e.g. "red.200"
    const dotIdx = rest.lastIndexOf(".");
    if (dotIdx === -1) return null;
    const colorName = rest.slice(0, dotIdx);
    const tone = parseInt(rest.slice(dotIdx + 1), 10);

    const family = families.find((f) => f.name.toLowerCase() === colorName);
    if (family) {
      const neutralFamily = families.find((f) => f.name.toLowerCase() === "neutral");
      const alphaMap = buildNeutralAlphaMap(neutralFamily, origin, bgHex);
      const entry = buildPrimaryScale(family, alphaMap).find((e) => e.value === tone);
      if (!entry) return null;
      return cssColorToRgb(entry.oklch, over);
    }
    const hex = FIXED_PALETTE[colorName]?.[String(tone)];
    if (hex) return hexToRgb(hex);
    return null;
  }

  // scale.{color}.{tone} — prefer live palette families, fall back to fixed Aegis defaults
  if (ref.startsWith("scale.")) {
    const rest = ref.slice(6);
    const dotIdx = rest.lastIndexOf(".");
    if (dotIdx !== -1) {
      const colorName = rest.slice(0, dotIdx);
      const toneStr = rest.slice(dotIdx + 1);
      const family = families.find((f) => f.name.toLowerCase() === colorName);
      if (family) {
        const toneEntry = family.tones.find((t) => t.value === Number(toneStr));
        if (toneEntry?.hex) return hexToRgb(toneEntry.hex);
      }
      const hex = FIXED_PALETTE[colorName]?.[toneStr];
      if (hex) return hexToRgb(hex);
    }
  }

  return null;
};

// ─── CSS string resolver ──────────────────────────────────────────────────────
// Unlike resolvePaletteRef (composites over a specific background), this emits
// native CSS values: hex for solids, oklch() for transparents and primary tones.
// Used by runtimeTokens.ts to generate semantic CSS custom properties.

export const resolveRefToCss = (
  ref: string,
  families: ColorFamily[],
  origin: NeutralAlphaOrigin = "black",
  bgHex?: string,
): string | null => {
  if (ref === "scale.transparent") return "transparent";
  if (ref === "scale.white.1000") return "#ffffff";

  if (ref.startsWith("scale.white-transparent.")) {
    const tone = parseInt(ref.slice(24), 10);
    const neutralFamily = families.find((f) => f.name.toLowerCase() === "neutral");
    const alpha = buildNeutralAlphaMap(neutralFamily, origin, bgHex).get(tone);
    // inverse-transparent: opposite base from neutral-transparent
    const baseL = origin === "white" ? "0%" : "100%";
    return alpha !== undefined ? \`oklch(\${baseL} 0 0 / \${alpha})\` : null;
  }

  if (ref.startsWith("scale.neutral-transparent.")) {
    const tone = parseInt(ref.slice(26), 10);
    const neutralFamily = families.find((f) => f.name.toLowerCase() === "neutral");
    const alpha = buildNeutralAlphaMap(neutralFamily, origin, bgHex).get(tone);
    const baseL = origin === "white" ? "100%" : "0%";
    return alpha !== undefined ? \`oklch(\${baseL} 0 0 / \${alpha})\` : null;
  }

  if (ref.startsWith("scale.neutral.")) {
    const tone = parseInt(ref.slice(14), 10);
    const neutralFamily = families.find((f) => f.name.toLowerCase() === "neutral");
    return neutralFamily?.tones.find((t) => t.value === tone)?.hex ?? null;
  }

  if (ref.startsWith("brand.")) {
    const toneStr = ref.slice(6);
    const toneValue = toneStr === "alt500" ? ALT_TONE_SENTINEL : parseInt(toneStr, 10);
    const brandFamily = families.find((f) => f.name.toLowerCase() !== "neutral");
    return brandFamily?.tones.find((t) => t.value === toneValue)?.hex ?? null;
  }

  if (ref.startsWith("primary.")) {
    const rest = ref.slice(8);
    const dot = rest.lastIndexOf(".");
    if (dot === -1) return null;
    const colorName = rest.slice(0, dot);
    const tone = parseInt(rest.slice(dot + 1), 10);
    const family = families.find((f) => f.name.toLowerCase() === colorName);
    if (family) {
      const neutralFamily = families.find((f) => f.name.toLowerCase() === "neutral");
      const alphaMap = buildNeutralAlphaMap(neutralFamily, origin, bgHex);
      const entry = buildPrimaryScale(family, alphaMap).find((e) => e.value === tone);
      return entry?.oklch ?? null;
    }
    return FIXED_PALETTE[colorName]?.[String(tone)] ?? null;
  }

  if (ref.startsWith("scale.")) {
    const rest = ref.slice(6);
    const dot = rest.lastIndexOf(".");
    if (dot !== -1) {
      const colorName = rest.slice(0, dot);
      const toneStr = rest.slice(dot + 1);
      const family = families.find((f) => f.name.toLowerCase() === colorName);
      if (family) {
        const hex = family.tones.find((t) => t.value === Number(toneStr))?.hex;
        if (hex) return hex;
      }
      return FIXED_PALETTE[colorName]?.[toneStr] ?? null;
    }
  }

  return null;
};

// ─── Public API ───────────────────────────────────────────────────────────────

export const resolveTokenRgb = (
  category: DesignTokenOverrideCategory,
  key: string,
  families: ColorFamily[],
  overBg: RGB = WHITE,
  origin: NeutralAlphaOrigin = "black",
  runtimeCssVars: Record<string, string> = {},
  bgHex?: string,
): RGB | null => {
  const cssValue = runtimeCssVars[\`--aegis-color-\${category}-\${key}\`];
  if (cssValue !== undefined) {
    const rgb = cssColorToRgb(cssValue, overBg);
    if (rgb) return rgb;
  }
  const ref = TOKEN_REFS[category]?.[key];
  if (!ref) return null;
  return resolvePaletteRef(ref, families, overBg, origin, bgHex);
};

// ─── WCAG math ────────────────────────────────────────────────────────────────

export const relativeLuminance = ([r, g, b]: RGB): number => {
  const lin = (c: number): number => {
    const n = c / 255;
    return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};

const rgbToHexString = ([r, g, b]: RGB): string =>
  \`#\${r.toString(16).padStart(2, "0")}\${g.toString(16).padStart(2, "0")}\${b.toString(16).padStart(2, "0")}\`;

export const wcagContrastRatio = (rgb1: RGB, rgb2: RGB): number => {
  const l1 = relativeLuminance(rgb1);
  const l2 = relativeLuminance(rgb2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

const CRITERION_THRESHOLD: Record<ContrastCriterion, number> = {
  "text-normal": 4.5,
  "text-large": 3,
  "non-text": 3,
};

export const formatContrastRatio = (ratio: number | null, pass: boolean | null): string => {
  if (ratio == null) return "—";
  const displayRatio = pass === false ? Math.floor(ratio * 100) / 100 : ratio;
  return \`\${displayRatio.toFixed(2)}:1\`;
};

// ─── Palette dependency detection ─────────────────────────────────────────────

const isPaletteDependentRef = (ref: string, families: ColorFamily[]): boolean => {
  if (ref.startsWith("scale.neutral") || ref.startsWith("scale.white")) return true;
  if (ref.startsWith("brand.")) return true;
  if (ref.startsWith("primary.")) {
    const colorName = ref.slice(8, ref.lastIndexOf("."));
    return families.some((f) => f.name.toLowerCase() === colorName);
  }
  return false;
};

const isItemPaletteDependent = (checkItem: ComponentCheckItem, families: ColorFamily[]): boolean => {
  const fgRef = TOKEN_REFS[checkItem.fg.category]?.[checkItem.fg.key] ?? "";
  const bgRef = checkItem.bg ? (TOKEN_REFS[checkItem.bg.category]?.[checkItem.bg.key] ?? "") : "";
  return isPaletteDependentRef(fgRef, families) || isPaletteDependentRef(bgRef, families);
};

// ─── Result type ──────────────────────────────────────────────────────────────

export interface ComponentCheckResult {
  item: ComponentCheckItem;
  ratio: number | null;
  fgRgb: RGB | null;
  bgRgb: RGB | null;
  pass: boolean | null;
  threshold: number;
  isPaletteDependent: boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────────

export type BgContext = {
  appBgRgb: RGB;
  pageBgRgb: RGB;
  surfaceBgRgb: RGB;
  neutralAlphaOrigin: NeutralAlphaOrigin;
};

// ─── Contrast computation ─────────────────────────────────────────────────────

export const computeChecksWithContext = (
  checks: ComponentCheckItem[],
  families: ColorFamily[],
  ctx: BgContext,
  runtimeCssVars: Record<string, string> = {},
): ComponentCheckResult[] =>
  checks.map((checkItem): ComponentCheckResult => {
    const threshold = CRITERION_THRESHOLD[checkItem.criterion];
    const isPaletteDependent = isItemPaletteDependent(checkItem, families);
    const origin = ctx.neutralAlphaOrigin;

    const appBgHex = rgbToHexString(ctx.appBgRgb);

    let bgRgb: RGB | null;
    let fgRgb: RGB | null;

    if (checkItem.contrastTarget === "componentBackground") {
      const overBg = ctx.surfaceBgRgb;
      bgRgb = resolveTokenRgb(
        checkItem.bg!.category,
        checkItem.bg!.key,
        families,
        overBg,
        origin,
        runtimeCssVars,
        appBgHex,
      );
      fgRgb = resolveTokenRgb(
        checkItem.fg.category,
        checkItem.fg.key,
        families,
        bgRgb ?? overBg,
        origin,
        runtimeCssVars,
        appBgHex,
      );
    } else {
      bgRgb = ctx.surfaceBgRgb;
      fgRgb = resolveTokenRgb(
        checkItem.fg.category,
        checkItem.fg.key,
        families,
        bgRgb,
        origin,
        runtimeCssVars,
        appBgHex,
      );
    }

    if (!fgRgb || !bgRgb) {
      return { item: checkItem, ratio: null, fgRgb, bgRgb, pass: null, threshold, isPaletteDependent };
    }
    const ratio = wcagContrastRatio(fgRgb, bgRgb);
    return { item: checkItem, ratio, fgRgb, bgRgb, pass: ratio >= threshold, threshold, isPaletteDependent };
  });
`;export{e as default};