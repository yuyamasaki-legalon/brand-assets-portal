var e=`/**
 * Setting state model for Typography Lab.
 *
 * Holds token "actual values" — numbers, not references.
 * This is strictly separate from VariantMapState, which holds structural references
 * (which token each variant slot uses).
 *
 * State shape:
 *   weights       — 4 weight tokens: normal / medium / semibold / bold
 *   letterSpacing — per Aegis internal size token (x5Large … x3Small), absolute em value
 *   lineHeights   — 5 line-height tokens including @lab-extension tight
 *   fontFamily    — sans (primary) + serif (reserved / future)
 */

import {
  FW_BOLD,
  FW_MEDIUM,
  FW_REGULAR,
  FW_SEMIBOLD,
  LH_CONDENSED,
  LH_EXPANDED,
  LH_EXPANDED_PLUS,
  LH_NORMAL,
  LH_TIGHT,
} from "./aegis-token-baseline";

// ─── Size token keys ───────────────────────────────────────────────────────────

/**
 * Aegis internal size token keys, largest → smallest.
 *
 * These are used as keys for letter-spacing in SettingState.
 * px values:
 *   x5Large=36  x4Large=32  x3Large=24  xxLarge=20  xLarge=18
 *   large=16    medium=14   small=13    xSmall=12   xxSmall=11  x3Small=10
 */
export const SIZE_TOKEN_KEYS = [
  "x5Large",
  "x4Large",
  "x3Large",
  "xxLarge",
  "xLarge",
  "large",
  "medium",
  "small",
  "xSmall",
  "xxSmall",
  "x3Small",
] as const;

export type SizeTokenKey = (typeof SIZE_TOKEN_KEYS)[number];

/** Canonical px value for each Aegis internal size token. */
export const SIZE_TOKEN_PX: Record<SizeTokenKey, number> = {
  x5Large: 36,
  x4Large: 32,
  x3Large: 24,
  xxLarge: 20,
  xLarge: 18,
  large: 16,
  medium: 14,
  small: 13,
  xSmall: 12,
  xxSmall: 11,
  x3Small: 10,
};

// ─── Weight token keys ─────────────────────────────────────────────────────────

/**
 * 4 official weight tokens.
 * medium (500) and semibold (600) are currently unused in Aegis production variants
 * but are retained in the token structure for completeness and future use.
 */
export const WEIGHT_TOKEN_KEYS = ["normal", "medium", "semibold", "bold"] as const;
export type WeightTokenKey = (typeof WEIGHT_TOKEN_KEYS)[number];

export const WEIGHT_TOKEN_DEFAULTS: Record<WeightTokenKey, number> = {
  normal: FW_REGULAR,
  medium: FW_MEDIUM,
  semibold: FW_SEMIBOLD,
  bold: FW_BOLD,
};

// ─── Line-height token keys ────────────────────────────────────────────────────

/**
 * 5 line-height tokens.
 * "tight" is a @lab-extension not present in Aegis's official token set.
 */
export const LINE_HEIGHT_TOKEN_KEYS = ["tight", "condensed", "normal", "expanded", "expandedPlus"] as const;

export type LineHeightTokenKey = (typeof LINE_HEIGHT_TOKEN_KEYS)[number];

export const LINE_HEIGHT_TOKEN_DEFAULTS: Record<LineHeightTokenKey, number> = {
  tight: LH_TIGHT, // @lab-extension
  condensed: LH_CONDENSED,
  normal: LH_NORMAL,
  expanded: LH_EXPANDED,
  expandedPlus: LH_EXPANDED_PLUS,
};

/** True for tokens that exist in Aegis's official token set. */
export const LINE_HEIGHT_IS_AEGIS_OFFICIAL: Record<LineHeightTokenKey, boolean> = {
  tight: false, // @lab-extension
  condensed: true,
  normal: true,
  expanded: true,
  expandedPlus: true,
};

// ─── Font family ───────────────────────────────────────────────────────────────

/**
 * Font genre: sans is the primary genre for this Lab.
 * serif is reserved for future expansion; UI does not expose it yet.
 */
export type FontGenre = "sans" | "serif";

export type FontFamilyConfig = {
  /**
   * Ordered list of font family names (CSS font-family stack order).
   * Platform-specific families (e.g. Hiragino) should be listed before cross-platform fallbacks.
   */
  families: string[];
};

// ─── Setting state ─────────────────────────────────────────────────────────────

export type SettingState = {
  /** Weight token actual values. Key = WeightTokenKey, value = CSS font-weight number. */
  weights: Record<WeightTokenKey, number>;

  /**
   * Letter-spacing per Aegis internal size token.
   * Value is absolute em (0 = no tracking).
   * The Lab resets Aegis's global \`body { letter-spacing: 0.02em }\` in the preview root,
   * so these values are not deltas — they are the full letter-spacing for that size.
   */
  letterSpacing: Record<SizeTokenKey, number>;

  /** Line-height token actual values. Key = LineHeightTokenKey, value = CSS ratio. */
  lineHeights: Record<LineHeightTokenKey, number>;

  /**
   * Font family configuration.
   * "sans" is the active genre for this prototype.
   * "serif" is reserved for future use; internal model is present but UI is hidden.
   */
  fontFamily: Record<FontGenre, FontFamilyConfig>;
};

export const SETTING_DEFAULTS: SettingState = {
  weights: { ...WEIGHT_TOKEN_DEFAULTS },

  // Default absolute letter-spacing per size token.
  letterSpacing: {
    x5Large: -0.028,
    x4Large: -0.024,
    x3Large: -0.018,
    xxLarge: -0.01,
    xLarge: -0.005,
    large: 0,
    medium: 0,
    small: 0.005,
    xSmall: 0.01,
    xxSmall: 0.015,
    x3Small: 0.02,
  },

  lineHeights: { ...LINE_HEIGHT_TOKEN_DEFAULTS },

  fontFamily: {
    sans: {
      families: ["Inter", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", "system-ui", "sans-serif"],
    },
    serif: {
      // Reserved for future expansion. Not exposed in UI yet.
      families: ["Georgia", "Times New Roman", "serif"],
    },
  },
};
`;export{e as default};