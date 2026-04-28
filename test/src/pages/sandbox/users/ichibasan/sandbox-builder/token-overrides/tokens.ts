import type React from "react";
import backgroundTokenSource from "./background.tokens.json";
import blanketTokenSource from "./blanket.tokens.json";
import borderTokenSource from "./border.tokens.json";
import { hexToRgb, tintDepthShadows } from "./color-utils";
import depthTokenSource from "./depth.tokens.json";
import foregroundTokenSource from "./foreground.tokens.json";
import gradientTokenSource from "./gradient.tokens.json";
import interactionTokenSource from "./interaction.tokens.json";
import paletteScaleSource from "./palette.json";
import paletteTokenSource from "./palette.tokens.json";
import {
  buildAllPrimaryScales,
  buildColorTransparentScale,
  computeTransparentScalesFromNeutral,
} from "./palette-computer";
import paletteConfigSource from "./palette-config.json";
import { flattenColorTokens, flattenPalette, flattenSimpleVars } from "./token-flattener";
import { getByPath, isRecord, type JsonObject, resolveTokenCategory, unwrapTokenTree } from "./token-resolver";

// ─── Palette-config helpers ───────────────────────────────────────────────────
// transparentScales and primaryScales from palette-config.json are now derived
// at runtime from palette.json neutral; only primaryBaseColors is still read
// from config (it encodes intent, not math).

const PRIMARY_BASE_COLORS = paletteConfigSource.primaryBaseColors as Record<string, string>;
const PRIMARY_SCALES = paletteConfigSource.primaryScales as [number, number][];

// ─── Runtime scale computation ────────────────────────────────────────────────

/**
 * Transparent-scale alphas derived from the neutral palette.
 * Replaces the hardcoded `transparentScales` array in palette-config.json.
 * Exported so ThemeCustomizationView can reuse the same values.
 */
export const COMPUTED_TRANSPARENT_SCALES = computeTransparentScalesFromNeutral(
  paletteScaleSource.neutral as unknown as Record<string, string>,
);

/**
 * Neutral palette from palette.json (tone → hex).
 * Exported so ThemeCustomizationView can compute neutral-mode transparent
 * token overrides (e.g. neutral.xSubtle) using the updated palette values,
 * instead of relying on the old Aegis CSS defaults.
 */
export const NEUTRAL_PALETTE = paletteScaleSource.neutral as unknown as Record<string, string>;

// ─── Types ────────────────────────────────────────────────────────────────────
// JsonObject, TokenLeaf, isRecord, isTokenLeaf, unwrapTokenTree, getByPath,
// and resolveTokenCategory are all imported from ./token-resolver.

// ─── Scale palette ────────────────────────────────────────────────────────────

const scalePalette = Object.fromEntries(
  Object.entries(paletteScaleSource).map(([colorName, scales]) => [colorName, { ...(scales as JsonObject) }]),
);

// Semantic primary scales: output tone 800 is always the opaque identity.
// `primaryBaseColors` selects which source tone is mapped onto that identity.
const primaryScales = buildAllPrimaryScales(
  scalePalette as Record<string, Record<string, string>>,
  PRIMARY_BASE_COLORS,
  PRIMARY_SCALES,
);

export const INITIAL_PALETTE = {
  scale: {
    white: {
      1000: "#ffffff",
    },
    transparent: "transparent",
    ...scalePalette,
    // white-transparent: white at each tone's opacity
    "white-transparent": buildColorTransparentScale("#ffffff", COMPUTED_TRANSPARENT_SCALES),
    // neutral-transparent: black overlay at neutral-derived opacity levels
    "neutral-transparent": buildColorTransparentScale("#000000", COMPUTED_TRANSPARENT_SCALES),
  },
  primary: primaryScales,
  chart: (
    unwrapTokenTree(
      (((paletteTokenSource as JsonObject).internal as JsonObject).color as JsonObject).palette,
    ) as JsonObject
  ).chart,
} as const;

// ─── Initial token bundles ────────────────────────────────────────────────────

export const INITIAL_DESIGN_TOKENS = {
  background: resolveTokenCategory(
    backgroundTokenSource as JsonObject,
    "background",
    INITIAL_PALETTE as unknown as JsonObject,
  ),
  forground: resolveTokenCategory(
    foregroundTokenSource as JsonObject,
    "foreground",
    INITIAL_PALETTE as unknown as JsonObject,
  ),
  border: resolveTokenCategory(borderTokenSource as JsonObject, "border", INITIAL_PALETTE as unknown as JsonObject),
} as const;

const buildColorTokens = (palette: JsonObject) => ({
  background: resolveTokenCategory(backgroundTokenSource as JsonObject, "background", palette),
  blanket: resolveTokenCategory(blanketTokenSource as JsonObject, "blanket", palette),
  border: resolveTokenCategory(borderTokenSource as JsonObject, "border", palette),
  chart: unwrapTokenTree(
    ((((paletteTokenSource as JsonObject).internal as JsonObject).color as JsonObject).palette as JsonObject).chart,
  ) as JsonObject,
  foreground: resolveTokenCategory(foregroundTokenSource as JsonObject, "foreground", palette),
  interaction: resolveTokenCategory(interactionTokenSource as JsonObject, "interaction", palette),
});

const INITIAL_COLOR_TOKENS = buildColorTokens(INITIAL_PALETTE as unknown as JsonObject);

const INITIAL_DEPTH_TOKENS = ((depthTokenSource as JsonObject).depth ?? {}) as JsonObject;
const INITIAL_GRADIENT_TOKENS = ((gradientTokenSource as JsonObject).gradient ?? {}) as JsonObject;

export const INITIAL_BRAND_TOKENS = {
  Brand: {
    default: INITIAL_COLOR_TOKENS.border.brand,
  },
  BrandAccent: {
    default: INITIAL_COLOR_TOKENS.background["brand.bold"],
    hovered: INITIAL_COLOR_TOKENS.background["brand.bold.hovered"],
    pressed: INITIAL_COLOR_TOKENS.background["brand.bold.pressed"],
  },
  BrandBackground: {
    bold: INITIAL_COLOR_TOKENS.background["brand.bold"],
    "bold.hovered": INITIAL_COLOR_TOKENS.background["brand.bold.hovered"],
    "bold.pressed": INITIAL_COLOR_TOKENS.background["brand.bold.pressed"],
  },
  BrandForeground: {
    default: INITIAL_COLOR_TOKENS.foreground.brand,
  },
} as const;

export const INITIAL_PALETTE_TEXT = JSON.stringify(INITIAL_PALETTE, null, 2);
export const INITIAL_PALETTE_CONFIG_TEXT = JSON.stringify(paletteConfigSource, null, 2);
export const INITIAL_DESIGN_TOKEN_TEXT = {
  background: JSON.stringify(INITIAL_DESIGN_TOKENS.background, null, 2),
  forground: JSON.stringify(INITIAL_DESIGN_TOKENS.forground, null, 2),
  border: JSON.stringify(INITIAL_DESIGN_TOKENS.border, null, 2),
} as const;
export const INITIAL_DESIGN_TOKEN_BUNDLE = {
  background: INITIAL_DESIGN_TOKENS.background,
  forground: INITIAL_DESIGN_TOKENS.forground,
  border: INITIAL_DESIGN_TOKENS.border,
  ...INITIAL_BRAND_TOKENS,
} as const;
export const INITIAL_DESIGN_TOKEN_BUNDLE_TEXT = JSON.stringify(INITIAL_DESIGN_TOKEN_BUNDLE, null, 2);

// ─── Token override builders ──────────────────────────────────────────────────

const parseTokenObject = (
  value: unknown,
  category: "background" | "foreground" | "border",
  palette: JsonObject,
): Record<string, string> => {
  if (!isRecord(value)) {
    return {};
  }

  const normalizedTokenSource = Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => {
      if (isRecord(nestedValue) && typeof nestedValue.$value === "string") {
        return [key.replaceAll(".", "-"), nestedValue];
      }

      if (typeof nestedValue === "string" && /^\{.+\}$/.test(nestedValue)) {
        return [key.replaceAll(".", "-"), { $value: nestedValue }];
      }

      return [key, nestedValue];
    }),
  );

  const hasResolvableTokenRef = Object.values(normalizedTokenSource).some(
    (entry) => isRecord(entry) && typeof entry.$value === "string",
  );

  if (hasResolvableTokenRef) {
    const resolved = resolveTokenCategory({ color: { [category]: normalizedTokenSource } }, category, palette);
    return Object.fromEntries(
      Object.entries(resolved).map(([key, resolvedValue]) => [
        `--aegis-color-${category}-${key.replaceAll(".", "-")}`,
        String(resolvedValue),
      ]),
    );
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [
      `--aegis-color-${category}-${key.replaceAll(".", "-")}`,
      String(nestedValue),
    ]),
  );
};

const parseTokenRecord = (value: unknown, prefix: string): Record<string, string> => {
  if (!isRecord(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [
      `${prefix}${key === "default" ? "" : `-${key.replaceAll(".", "-")}`}`,
      String(nestedValue),
    ]),
  );
};

const isSameStringRecord = (value: JsonObject | null, reference: Record<string, string>) => {
  if (value === null) {
    return false;
  }

  const valueEntries = Object.entries(value).map(([key, nestedValue]) => [key, String(nestedValue)]);
  const referenceEntries = Object.entries(reference);

  if (valueEntries.length !== referenceEntries.length) {
    return false;
  }

  return referenceEntries.every(([key, nestedValue]) => value[key] === nestedValue);
};

const parseObjectText = (text: string): JsonObject | null => {
  try {
    const parsed = JSON.parse(text) as unknown;
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const buildBaseLocalTokenStyle = (palette: JsonObject): React.CSSProperties =>
  ({
    ...flattenPalette(palette),
    ...flattenColorTokens(buildColorTokens(palette)),
    ...flattenSimpleVars(INITIAL_DEPTH_TOKENS, "depth"),
    ...flattenSimpleVars(INITIAL_GRADIENT_TOKENS, "gradient"),
    "--aegis-color-background-neutral-subtler": "var(--aegis-color-background-neutral-xSubtle)",
    "--aegis-color-background-neutral-subtler-hovered": "var(--aegis-color-background-neutral-xSubtle-hovered)",
    "--aegis-color-background-neutral-subtler-pressed": "var(--aegis-color-background-neutral-xSubtle-pressed)",
    "--aegis-color-background-danger-subtler": "var(--aegis-color-background-danger-xSubtle)",
    "--aegis-color-background-warning-subtler": "var(--aegis-color-background-warning-xSubtle)",
    "--aegis-color-background-information-subtler": "var(--aegis-color-background-information-xSubtle)",
    "--aegis-color-background-accent-gray-subtler": "var(--aegis-color-background-accent-gray-xSubtle)",
    "--aegis-color-background-accent-blue-subtler": "var(--aegis-color-background-accent-blue-xSubtle)",
    "--aegis-color-background-accent-yellow-subtler": "var(--aegis-color-background-accent-yellow-xSubtle)",
    "--aegis-color-background-accent-orange-subtler": "var(--aegis-color-background-accent-orange-xSubtle)",
    "--aegis-color-background-accent-red-subtler": "var(--aegis-color-background-accent-red-xSubtle)",
    "--aegis-color-background-accent-purple-subtler": "var(--aegis-color-background-accent-purple-xSubtle)",
    "--aegis-color-background-accent-teal-subtler": "var(--aegis-color-background-accent-teal-xSubtle)",
    "--aegis-color-background-accent-indigo-subtler": "var(--aegis-color-background-accent-indigo-xSubtle)",
    "--aegis-color-background-accent-magenta-subtler": "var(--aegis-color-background-accent-magenta-xSubtle)",
    "--aegis-color-foreground-subtler": "var(--aegis-color-foreground-xSubtle)",
    "--aegis-color-border-information-bolder": "var(--aegis-color-border-information-xBold)",
    "--aegis-color-border-brand-default": "var(--aegis-color-border-brand)",
    "--aegis-color-text-neutral-default": "var(--aegis-color-foreground-default)",
    "--aegis-color-text-default": "var(--aegis-color-foreground-default)",
    "--aegis-color-text-subtle": "var(--aegis-color-foreground-subtle)",
    "--aegis-color-text-neutral-subtle": "var(--aegis-color-foreground-subtle)",
    "--aegis-action-list-item-background-color-hovered": "var(--aegis-color-background-neutral-xSubtle-hovered)",
  }) as React.CSSProperties;

export const buildTokenOverrideStyle = ({
  paletteText,
  designTokenText,
}: {
  paletteText: string;
  designTokenText: string;
}): React.CSSProperties => {
  const paletteParsed = parseObjectText(paletteText);
  const designTokenParsed = parseObjectText(designTokenText);

  const effectivePalette = paletteParsed ?? (INITIAL_PALETTE as unknown as JsonObject);
  const backgroundParsed = isRecord(designTokenParsed?.background)
    ? (designTokenParsed.background as JsonObject)
    : null;
  const forgroundParsed = isRecord(designTokenParsed?.forground) ? (designTokenParsed.forground as JsonObject) : null;
  const borderParsed = isRecord(designTokenParsed?.border) ? (designTokenParsed.border as JsonObject) : null;
  const backgroundVars =
    backgroundParsed && !isSameStringRecord(backgroundParsed, INITIAL_DESIGN_TOKENS.background)
      ? parseTokenObject(backgroundParsed, "background", effectivePalette)
      : {};
  const forgroundVars =
    forgroundParsed && !isSameStringRecord(forgroundParsed, INITIAL_DESIGN_TOKENS.forground)
      ? parseTokenObject(forgroundParsed, "foreground", effectivePalette)
      : {};
  const borderVars =
    borderParsed && !isSameStringRecord(borderParsed, INITIAL_DESIGN_TOKENS.border)
      ? parseTokenObject(borderParsed, "border", effectivePalette)
      : {};
  const brandParsed = isRecord(designTokenParsed?.Brand) ? (designTokenParsed.Brand as JsonObject) : null;
  const brandAccentParsed = isRecord(designTokenParsed?.BrandAccent)
    ? (designTokenParsed.BrandAccent as JsonObject)
    : null;
  const brandBackgroundParsed = isRecord(designTokenParsed?.BrandBackground)
    ? (designTokenParsed.BrandBackground as JsonObject)
    : null;
  const brandForegroundParsed = isRecord(designTokenParsed?.BrandForeground)
    ? (designTokenParsed.BrandForeground as JsonObject)
    : null;
  const themeAccentParsed = isRecord(designTokenParsed?.ThemeAccent)
    ? (designTokenParsed.ThemeAccent as JsonObject)
    : null;
  const baseBackgroundParsed = isRecord(designTokenParsed?.BaseBackground)
    ? (designTokenParsed.BaseBackground as JsonObject)
    : null;
  const baseForegroundParsed = isRecord(designTokenParsed?.BaseForeground)
    ? (designTokenParsed.BaseForeground as JsonObject)
    : null;
  const brandVars =
    brandParsed && !isSameStringRecord(brandParsed, INITIAL_BRAND_TOKENS.Brand)
      ? {
          ...parseTokenRecord(brandParsed, "--aegis-color-brand"),
          ...(brandParsed.default !== undefined
            ? {
                "--aegis-color-border-brand": String(brandParsed.default),
                "--aegis-color-border-brand-default": String(brandParsed.default),
              }
            : {}),
        }
      : {};
  const brandAccentVars =
    brandAccentParsed && !isSameStringRecord(brandAccentParsed, INITIAL_BRAND_TOKENS.BrandAccent)
      ? parseTokenRecord(brandAccentParsed, "--aegis-color-brand-accent")
      : {};
  const brandBackgroundVars =
    brandBackgroundParsed && !isSameStringRecord(brandBackgroundParsed, INITIAL_BRAND_TOKENS.BrandBackground)
      ? parseTokenRecord(brandBackgroundParsed, "--aegis-color-background-brand")
      : {};
  const brandForegroundVars =
    brandForegroundParsed && !isSameStringRecord(brandForegroundParsed, INITIAL_BRAND_TOKENS.BrandForeground)
      ? {
          ...parseTokenRecord(brandForegroundParsed, "--aegis-color-foreground-brand"),
          ...(brandForegroundParsed.default !== undefined
            ? {
                "--aegis-color-foreground-brand": String(brandForegroundParsed.default),
              }
            : {}),
        }
      : {};
  const themeAccentPalette = getByPath(themeAccentParsed, ["internal", "color", "palette"]);
  const themeAccentColorSource = getByPath(themeAccentParsed, ["color"]);
  const themeAccentPaletteVars = isRecord(themeAccentPalette) ? flattenPalette(themeAccentPalette) : {};
  const themeAccentColorVars =
    isRecord(themeAccentPalette) && isRecord(themeAccentColorSource)
      ? flattenColorTokens({
          background: resolveTokenCategory({ color: themeAccentColorSource }, "background", themeAccentPalette),
          border: resolveTokenCategory({ color: themeAccentColorSource }, "border", themeAccentPalette),
          foreground: resolveTokenCategory({ color: themeAccentColorSource }, "foreground", themeAccentPalette),
        })
      : {};

  // Tint depth (box-shadow) tokens with the brand accent 900 color when set.
  // Only the RGB part of each rgba() is replaced; alpha values are preserved.
  const themeAccentScale = getByPath(themeAccentParsed, ["internal", "color", "palette", "scale", "themeAccent"]);
  const accent900Hex =
    isRecord(themeAccentScale) && typeof themeAccentScale["900"] === "string" ? themeAccentScale["900"] : null;
  const depthVars = accent900Hex
    ? (() => {
        const [r, g, b] = hexToRgb(accent900Hex);
        return Object.fromEntries(
          Object.entries(INITIAL_DEPTH_TOKENS).map(([key, value]) => [
            `--aegis-depth-${key}`,
            tintDepthShadows(String(value), r, g, b),
          ]),
        );
      })()
    : {};

  const baseBackgroundVars = baseBackgroundParsed
    ? parseTokenObject(baseBackgroundParsed, "background", effectivePalette)
    : {};
  const baseForegroundVars = baseForegroundParsed
    ? parseTokenObject(baseForegroundParsed, "foreground", effectivePalette)
    : {};

  return {
    ...buildBaseLocalTokenStyle(effectivePalette),
    ...themeAccentPaletteVars,
    ...themeAccentColorVars,
    ...depthVars,
    ...backgroundVars,
    ...forgroundVars,
    ...borderVars,
    ...brandVars,
    ...brandAccentVars,
    ...brandBackgroundVars,
    ...brandForegroundVars,
    ...baseBackgroundVars,
    ...baseForegroundVars,
  } as React.CSSProperties;
};

export const buildThemeCssText = ({
  paletteText,
  designTokenText,
  scopeSelector = ".scope",
}: {
  paletteText: string;
  designTokenText: string;
  scopeSelector?: string;
}): string => {
  const style = buildTokenOverrideStyle({ paletteText, designTokenText });
  const cssVariableEntries = Object.entries(style)
    .filter(([key, value]) => key.startsWith("--") && value != null)
    .sort(([left], [right]) => left.localeCompare(right));

  const declarations = cssVariableEntries.map(([key, value]) => `  ${key}: ${String(value)};`).join("\n");

  return [
    "/**",
    " * Do not edit directly, this file was auto-generated.",
    " */",
    "",
    `${scopeSelector} {`,
    declarations,
    "}",
    "",
    buildScrollAreaWorkaroundCss(scopeSelector),
  ].join("\n");
};

export const buildScrollAreaWorkaroundCss = (scopeSelector: string): string =>
  [
    "@media (any-hover: hover) {",
    `  ${scopeSelector} :where(.aegis-ScrollArea .aegis-YceSBa_thumb:hover, .aegis-DataTable .aegis-n2VB_q_thumb:hover) {`,
    "    background-color: var(--aegis-color-foreground-xSubtle);",
    "  }",
    "}",
  ].join("\n");
