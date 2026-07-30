var e=`/**
 * Palette resolution pipeline for Typography Lab.
 *
 * Adapts sandbox-builder's token pipeline to work with a user-supplied
 * palette JSON string (from the Palette textarea).
 *
 * Pipeline:
 *   paletteJson (string)
 *   → parse → raw PaletteMap
 *   → buildFullPalette (adds white-transparent, neutral-transparent, primary scales)
 *   → resolveTokenCategory (background / foreground / border)
 *   → flattenColorTokens → CSSProperties
 */

import type { CSSProperties } from "react";
import backgroundTokenSource from "./background.tokens.json";
import borderTokenSource from "./border.tokens.json";
import foregroundTokenSource from "./foreground.tokens.json";
import {
  buildAllPrimaryScales,
  buildColorTransparentScale,
  computeTransparentScalesFromNeutral,
} from "./palette-computer";
import paletteConfigSource from "./palette-config.json";
import { flattenColorTokens } from "./token-flattener";
import { type JsonObject, resolveTokenCategory } from "./token-resolver";

const PRIMARY_BASE_COLORS = paletteConfigSource.primaryBaseColors as Record<string, string>;
const PRIMARY_SCALES = paletteConfigSource.primaryScales as [number, number][];

type RawPaletteMap = Record<string, Record<string, string>>;

const buildFullPalette = (rawPalette: RawPaletteMap): JsonObject => {
  const neutralTones = (rawPalette.neutral ?? {}) as Record<string, string>;
  const transparentScales = computeTransparentScalesFromNeutral(neutralTones);
  const primaryScales = buildAllPrimaryScales(rawPalette, PRIMARY_BASE_COLORS, PRIMARY_SCALES);

  return {
    scale: {
      white: { 1000: "#ffffff" },
      transparent: "transparent",
      ...rawPalette,
      "white-transparent": buildColorTransparentScale("#ffffff", transparentScales),
      "neutral-transparent": buildColorTransparentScale("#000000", transparentScales),
    },
    primary: primaryScales,
  };
};

export const buildSemanticTokenStyle = (paletteJson: string): CSSProperties => {
  let rawPalette: RawPaletteMap;
  try {
    const parsed: unknown = JSON.parse(paletteJson);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {};
    rawPalette = parsed as RawPaletteMap;
  } catch {
    return {};
  }

  const palette = buildFullPalette(rawPalette);

  const colorTokens = {
    background: resolveTokenCategory(backgroundTokenSource as JsonObject, "background", palette),
    foreground: resolveTokenCategory(foregroundTokenSource as JsonObject, "foreground", palette),
    border: resolveTokenCategory(borderTokenSource as JsonObject, "border", palette),
  };

  return flattenColorTokens(colorTokens as JsonObject) as CSSProperties;
};
`;export{e as default};