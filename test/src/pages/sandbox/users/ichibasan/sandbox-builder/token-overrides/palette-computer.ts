/**
 * Palette-scale computation utilities.
 *
 * Responsibilities:
 *  - Derive transparent-scale alpha values from neutral palette steps
 *  - Build per-color primary scales keyed from each color's designated base tone
 *  - Provide typed generators for Brand / BrandAccent / BaseBackground / BaseForeground tokens
 *
 * All functions are pure — no side effects, no React.
 */

import { hexToRgb, hexToRgba } from "./color-utils";

// ─── Types ────────────────────────────────────────────────────────────────────

/** A transparent-scale entry: [toneNumber, alphaValue]. */
export type TransparentScaleEntry = [number, number];
/** A primary-scale entry: [outputToneNumber, alphaValue]. */
export type PrimaryScaleEntry = [number, number];

/**
 * Palette tone numbers that participate in the transparent / primary scales.
 * Tones 1000 (black) and 0 (white) are intentionally excluded — they are
 * always treated as solid anchors.
 */
export const TRANSPARENT_TONE_KEYS = [900, 800, 700, 600, 500, 400, 300, 200, 100, 50] as const;
export type TransparentTone = (typeof TRANSPARENT_TONE_KEYS)[number];

// ─── Transparent Scale ────────────────────────────────────────────────────────

/**
 * Compute transparent-scale alpha values from the neutral palette.
 *
 * For each tone T in 900..50, the alpha is the opacity of `neutral[900]` that,
 * when composited over white, matches the visual lightness of `neutral[T]`.
 *
 * Formula:  alpha = (255 − R_T) / (255 − R_900)
 *
 * Why neutral[900] as the base (not black/0):
 *   Using the actual darkest palette tone as the denominator yields higher
 *   alpha values for the same target lightness compared with the black-base
 *   formula ((255 − R) / 255).  When these alphas are applied to chromatic
 *   brand colors (e.g. brand-accent[900]) rather than neutral grey, the
 *   higher opacity lets the color's hue register — even at xSubtle level
 *   (tone 50, ~2.6 %) — while the composited lightness remains consistent
 *   with the neutral palette.
 *
 * Precision: rounded to 4 decimal places (≈ 2–3 significant figures as a %).
 * Falls back to the black-base formula if neutral[900] is absent.
 */
export const computeTransparentScalesFromNeutral = (neutral: Record<string, string>): TransparentScaleEntry[] => {
  const base900Hex = neutral["900"];
  const base900R = base900Hex ? hexToRgb(base900Hex)[0] : 0;
  const denominator = 255 - base900R;

  return TRANSPARENT_TONE_KEYS.map((tone): TransparentScaleEntry => {
    const hex = neutral[String(tone)];
    if (!hex) return [tone, 0];
    const targetR = hexToRgb(hex)[0];
    const alpha = denominator > 0 ? (255 - targetR) / denominator : (255 - targetR) / 255;
    return [tone, Math.round(alpha * 10000) / 10000];
  });
};

/**
 * Build a transparent color scale (tone → rgba CSS string) from a solid base
 * hex color and the pre-computed transparent scale entries.
 *
 * Used for `white-transparent` and `neutral-transparent` palette entries.
 */
export const buildColorTransparentScale = (
  baseHex: string,
  transparentScales: TransparentScaleEntry[],
): Record<string, string> =>
  Object.fromEntries(transparentScales.map(([tone, alpha]) => [String(tone), hexToRgba(baseHex, alpha)]));

// ─── Primary Scale ────────────────────────────────────────────────────────────

/**
 * Build the default semantic primary scale for a single color family.
 *
 * The "primary" scale is used for semantic background / border token lookup
 * (e.g. `internal.color.palette.primary.red.50`). Unlike the raw scale (which
 * carries opaque hex values at every tone), the primary scale re-maps one
 * designated source tone onto the standard output ladder:
 *
 *  • Output tone 800 is always the opaque identity
 *  • Output tones below 800 are transparent overlays of that identity color
 *  • `primaryBaseColors[color]` decides which scale tone becomes that identity
 *
 * Example — yellow, sourceTone = "400":
 *   { "800": yellow[400], "700": rgba(yellow[400], α700), …, "50": rgba(yellow[400], α50) }
 *
 * Example — navy, sourceTone = "800":
 *   { "800": navy[800], "700": rgba(navy[800], α700), …, "50": rgba(navy[800], α50) }
 */
export const buildSemanticPrimaryScaleForColor = (
  colorPalette: Record<string, string>,
  sourceTone: string,
  primaryScales: PrimaryScaleEntry[],
): Record<string, string> => {
  const identityHex = colorPalette[sourceTone];
  if (!identityHex) return {};
  const result: Record<string, string> = {};

  for (const [tone, alpha] of primaryScales) {
    result[String(tone)] = alpha === 1 ? identityHex : hexToRgba(identityHex, alpha);
  }

  return result;
};

/**
 * Build a transparent primary scale where the output tone ladder matches the
 * source tone ladder (used by ThemeAccent, whose identity lives at 900).
 */
export const buildPrimaryScaleForColor = (
  colorPalette: Record<string, string>,
  baseTone: string,
  transparentScales: TransparentScaleEntry[],
): Record<string, string> => {
  const baseHex = colorPalette[baseTone];
  if (!baseHex) return {};

  const baseToneNum = Number.parseInt(baseTone, 10);
  const result: Record<string, string> = {};

  for (const [tone, alpha] of transparentScales) {
    if (tone > baseToneNum) continue;
    result[String(tone)] = tone === baseToneNum ? baseHex : hexToRgba(baseHex, alpha);
  }

  return result;
};

/**
 * Build primary scales for all colors listed in `primaryBaseColors`.
 *
 * @param palette          Full scale palette — `{ colorName: { tone: hex } }`
 * @param primaryBaseColors  `{ colorName: baseToneString }`, e.g. `{ yellow: "400", navy: "800" }`
 * @param transparentScales  Pre-computed transparent scale entries (from `computeTransparentScalesFromNeutral`)
 */
export const buildAllPrimaryScales = (
  palette: Record<string, Record<string, string>>,
  primaryBaseColors: Record<string, string>,
  primaryScales: PrimaryScaleEntry[],
): Record<string, Record<string, string>> =>
  Object.fromEntries(
    Object.entries(primaryBaseColors).map(([colorName, baseTone]) => [
      colorName,
      buildSemanticPrimaryScaleForColor(palette[colorName] ?? {}, baseTone, primaryScales),
    ]),
  );

// ─── Brand Token Generators ───────────────────────────────────────────────────

export interface BrandTokens {
  /** Brand indicator color used on borders and as the default brand accent. */
  Brand: { default: string };
  /** CTA button background colors in default / hovered / pressed states. */
  BrandBackground: {
    bold: string;
    "bold.hovered": string;
    "bold.pressed": string;
  };
  /**
   * Foreground (text / icon) color for brand-colored surfaces.
   * Only set when the selected brand tone is light (400 or 500) and the
   * default foreground would have insufficient contrast against the brand bg.
   */
  BrandForeground?: { default: string };
}

/**
 * Extract BrandTokens from brand-color swatches produced by the color popover.
 *
 * @param popoverSwatches  Swatches from the brand color popover (labels: "default", "hovered", "pressed")
 * @param paletteSwatches  Full brand palette swatches (includes tone-labeled entries like "800")
 * @param selectedTone     Currently selected brand base tone ("400"–"900")
 * @param normalizeColor   Canvas-based color normalizer; converts oklch → hex/rgba for CSS output
 */
export const buildBrandTokensFromSwatches = (
  popoverSwatches: ReadonlyArray<{ label: string; cssColor: string }>,
  paletteSwatches: ReadonlyArray<{ label: string; cssColor: string }>,
  selectedTone: string,
  normalizeColor: (value: string) => string,
  foregroundHexOverride?: string,
): BrandTokens | null => {
  const getColor = (swatches: typeof popoverSwatches, label: string) =>
    swatches.find((s) => s.label === label)?.cssColor;

  const bold = getColor(popoverSwatches, "default");
  const hovered = getColor(popoverSwatches, "hovered");
  const pressed = getColor(popoverSwatches, "pressed");

  if (!bold || !hovered || !pressed) return null;

  const tokens: BrandTokens = {
    Brand: { default: normalizeColor(bold) },
    BrandBackground: {
      bold: normalizeColor(bold),
      "bold.hovered": normalizeColor(hovered),
      "bold.pressed": normalizeColor(pressed),
    },
  };

  // Light brand tones (500 / 400) require a dark foreground for sufficient contrast.
  const foreground800 = getColor(paletteSwatches, "800");
  const resolvedForeground =
    foregroundHexOverride ?? (foreground800 && ["500", "400"].includes(selectedTone) ? foreground800 : undefined);

  if (resolvedForeground) {
    tokens.BrandForeground = { default: normalizeColor(resolvedForeground) };
  }

  return tokens;
};

// ─── BrandAccent (ThemeAccent) Primary Scale ──────────────────────────────────

/**
 * Build the primary scale used by ThemeAccent tokens.
 *
 * ThemeAccent always uses the scale["900"] hex as its full-opacity anchor
 * (baseTone = "900"), producing tone entries from 900 down to 50.
 *
 * Replaces the old hardcoded `PRIMARY_SCALES = [[800, 1], …]` approach, which
 * incorrectly labeled the full-opacity entry as tone 800 regardless of the
 * actual base color.
 */
export const buildBrandAccentPrimaryScale = (
  base900Hex: string,
  transparentScales: TransparentScaleEntry[],
): Record<string, string> => buildPrimaryScaleForColor({ "900": base900Hex }, "900", transparentScales);

// ─── BaseBackground Token Generators ─────────────────────────────────────────

/**
 * Spec for a single BaseBackground semantic token:
 *
 *  transparent — `rgba(basePalette["900"], spec.alpha)`
 *  solid       — the literal palette entry at `spec.paletteKey` (50 / 100 / 200)
 *
 * The alpha values for the transparent variants correspond to the transparent
 * scale tones used for each semantic level:
 *   xSubtle          → tone 50
 *   xSubtle.hovered  → tone 100
 *   subtle           → tone 100
 *   neutral          → tone 300
 *   selected         → tone 200
 *
 * Alpha values are NOT hardcoded here; they are derived at call time from
 * COMPUTED_TRANSPARENT_SCALES so they always match the neutral palette exactly,
 * keeping the computed values consistent with the Aegis default tokens.
 */
export type BaseBackgroundTokenSpec =
  | { type: "transparent"; tone: TransparentTone }
  | { type: "solid"; paletteKey: "50" | "100" | "200" };

/**
 * Default semantic-token → spec mapping for base background colors.
 * Keys match the token IDs managed by BASE_BACKGROUND_MANAGED_KEYS in
 * ThemeCustomizationView.
 *
 * Transparent specs reference a tone number rather than a hardcoded alpha.
 * The actual alpha is resolved at call time from COMPUTED_TRANSPARENT_SCALES
 * (derived from palette.json neutral), mirroring the Aegis primary-scale formula:
 *   rgba(color_tone_900, computeWhiteEquivAlpha(neutral[tone]))
 */
export const BASE_BACKGROUND_TOKEN_SPECS: Readonly<Partial<Record<string, BaseBackgroundTokenSpec>>> = {
  "neutral.xSubtle": { type: "transparent", tone: 50 },
  "neutral.xSubtle.hovered": { type: "transparent", tone: 100 },
  "neutral.xSubtle.pressed": { type: "transparent", tone: 200 },
  "neutral.xSubtle.selected": { type: "transparent", tone: 100 },
  "neutral.xSubtle.opaque": { type: "solid", paletteKey: "50" },
  "neutral.subtle": { type: "transparent", tone: 100 },
  "neutral.subtle.hovered": { type: "transparent", tone: 200 },
  "neutral.subtle.pressed": { type: "transparent", tone: 300 },
  "neutral.subtle.opaque": { type: "solid", paletteKey: "100" },
  neutral: { type: "transparent", tone: 300 },
  "neutral.opaque": { type: "solid", paletteKey: "100" },
  "neutral.subtlest.hovered": { type: "transparent", tone: 100 },
  "neutral.subtlest.pressed": { type: "transparent", tone: 200 },
  "neutral.subtlest.selected": { type: "transparent", tone: 100 },
  "neutral.subtlest.opaque.hovered": { type: "solid", paletteKey: "100" },
  "neutral.subtlest.opaque.pressed": { type: "solid", paletteKey: "200" },
  "neutral.subtlest.opaque.selected": { type: "solid", paletteKey: "100" },
  disabled: { type: "transparent", tone: 50 },
  "input.hovered": { type: "transparent", tone: 100 },
  selected: { type: "transparent", tone: 200 },
};

/**
 * Compute the CSS color string for a single base-background semantic token.
 *
 *  transparent: `rgba(palette["900"], neutralTransparentScale[spec.tone].alpha)`
 *  solid:       `palette[spec.paletteKey]` (opaque 50 / 100 / 200)
 *
 * @param spec              Token spec (transparent | solid)
 * @param palette           Base color palette map (tone string → CSS color)
 * @param normalizeColor    Canvas-based color normalizer (oklch → hex / rgba)
 * @param transparentScales Neutral-palette-derived scale entries (from COMPUTED_TRANSPARENT_SCALES).
 *   Used to look up the alpha for transparent specs so the value matches the
 *   Aegis primary-scale formula: rgba(color_900, computeWhiteEquivAlpha(neutral[tone])).
 */
export const computeBaseBackgroundTokenValue = (
  spec: BaseBackgroundTokenSpec,
  palette: Record<string, string>,
  normalizeColor: (value: string) => string,
  transparentScales: TransparentScaleEntry[],
): string | undefined => {
  if (spec.type === "solid") {
    const raw = palette[spec.paletteKey];
    return raw ? normalizeColor(raw) : undefined;
  }

  // Look up the alpha from the neutral transparent scale for this spec's tone.
  // This mirrors the Aegis primary scale: rgba(color_900, alpha_from_neutral_tone).
  const alpha = transparentScales.find(([tone]) => tone === spec.tone)?.[1];
  if (alpha === undefined) return undefined;

  // Always anchor to the darkest available tone for consistent perceived lightness
  // regardless of the brand base tone selection.
  const transparentReferenceTone = ["900", "800", "700", "600", "500", "400"].find(
    (tone) => palette[tone] !== undefined,
  );
  const raw = transparentReferenceTone ? palette[transparentReferenceTone] : undefined;
  if (!raw) return undefined;

  const hex = normalizeColor(raw);
  return hexToRgba(hex, alpha);
};

export const createPaletteMap = (
  swatches: ReadonlyArray<{ label: string; cssColor: string }>,
  normalizeColor: (value: string) => string,
): Record<string, string> =>
  Object.fromEntries(swatches.map((swatch) => [swatch.label, normalizeColor(swatch.cssColor)]));

// ─── BaseForeground Token Generators ─────────────────────────────────────────

export interface BaseForegroundTokens {
  /** Primary text / icon color. */
  default: string;
  /** High-emphasis text. */
  bold: string;
  /** Pressed / active-state text. */
  pressed: string;
  /** Secondary (de-emphasized) text. */
  subtle: string;
}

/**
 * Derive BaseForeground semantic tokens from a palette indexed by tone label.
 *
 * Tone-to-role mapping (first-match wins):
 *   default → 900
 *   bold    → 900 → 800
 *   pressed → 800 → 900
 *   subtle  → 700 → 600
 *
 * Returns `null` when the "900" tone is absent (no foreground color configured).
 *
 * @param palette        Map of tone label → CSS color string
 * @param normalizeColor Canvas-based color normalizer
 */
export const buildBaseForegroundTokens = (
  palette: Record<string, string>,
  normalizeColor: (value: string) => string,
): BaseForegroundTokens | null => {
  const defaultColor = palette["900"];
  if (!defaultColor) return null;

  const bold = palette["900"] ?? palette["800"];
  const pressed = palette["800"] ?? palette["900"];
  const subtle = palette["700"] ?? palette["600"];

  if (!bold || !pressed || !subtle) return null;

  return {
    default: normalizeColor(defaultColor),
    bold: normalizeColor(bold),
    pressed: normalizeColor(pressed),
    subtle: normalizeColor(subtle),
  };
};
