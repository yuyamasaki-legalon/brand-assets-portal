var e=`/**
 * Export model for Typography Lab.
 *
 * Generates Aegis-ready output from SettingState + VariantMapState.
 *
 * Output format: resolved values (not token references).
 *   fontSize:       rem (base 16px)
 *   fontWeight:     numeric CSS value
 *   lineHeight:     unitless ratio
 *   letterSpacing:  absolute em (preview root resets Aegis global body { letter-spacing: 0.02em })
 *
 * Active exports:
 *   buildTokensJson()     — typography.tokens.json format
 *   buildTypographiesJs() — typographies.js format
 */

import {
  LINE_HEIGHT_IS_AEGIS_OFFICIAL,
  LINE_HEIGHT_TOKEN_KEYS,
  type SettingState,
  SIZE_TOKEN_KEYS,
  SIZE_TOKEN_PX,
  WEIGHT_TOKEN_KEYS,
} from "./setting-model";
import { getDefinedSlots, VARIANT_FAMILY_KEYS, VARIANT_FAMILY_LABELS, type VariantMapState } from "./variant-map-model";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toFontFamilyCssValue = (names: string[]): string => names.map((f) => (f.includes(" ") ? \`"\${f}"\` : f)).join(", ");

/** px → rem string. Base 16px. Result is always a clean decimal (no trailing zeros). */
const toRemStr = (px: number): string => \`\${px / 16}rem\`;

/** Absolute em value → fixed-3 string with unit. */
const toSpacingStr = (em: number): string => \`\${em.toFixed(3)}em\`;

// ─── buildTokensJson ──────────────────────────────────────────────────────────

/**
 * Generates typography.tokens.json format from SettingState.
 *
 * Token structure:
 *   typography.fontFamily.{sans|serif}
 *   typography.fontWeight.{normal|medium|semibold|bold}
 *   typography.lineHeight.{tight|condensed|normal|expanded|expandedPlus}
 *   typography.letterSpacing.{sizeToken}  (x5Large … x3Small)
 *   typography.fontSize.{sizeToken}        (x5Large … x3Small)
 *
 * "tight" is a Lab extension, not in Aegis's official token set.
 * It is marked with $description in the output so downstream tools can identify it.
 */
export const buildTokensJson = (setting: SettingState): string => {
  const tokens = {
    typography: {
      fontFamily: {
        sans: { value: toFontFamilyCssValue(setting.fontFamily.sans.families) },
        serif: { value: toFontFamilyCssValue(setting.fontFamily.serif.families) },
      },
      fontWeight: Object.fromEntries(WEIGHT_TOKEN_KEYS.map((k) => [k, { value: setting.weights[k] }])),
      lineHeight: Object.fromEntries(
        LINE_HEIGHT_TOKEN_KEYS.map((k) =>
          LINE_HEIGHT_IS_AEGIS_OFFICIAL[k]
            ? [k, { value: setting.lineHeights[k] }]
            : [k, { value: setting.lineHeights[k], $description: "lab-extension: not in Aegis official token set" }],
        ),
      ),
      letterSpacing: Object.fromEntries(
        SIZE_TOKEN_KEYS.map((k) => [k, { value: toSpacingStr(setting.letterSpacing[k]) }]),
      ),
      fontSize: Object.fromEntries(SIZE_TOKEN_KEYS.map((k) => [k, { value: toRemStr(SIZE_TOKEN_PX[k]) }])),
    },
  };

  return JSON.stringify(tokens, null, 2);
};

// ─── buildTypographiesJs ──────────────────────────────────────────────────────

/**
 * Generates typographies.js format from SettingState + VariantMapState.
 *
 * Each entry is keyed by actualVariantName (Aegis official variant string).
 * Default / Emphasis UI slot names are fully expanded to actual variant names at output time.
 *
 * letterSpacing resolution (per slot):
 *   - slotDef.letterSpacingOverride is set → use override (component / data families)
 *   - otherwise → use SettingState.letterSpacing[sizeTokenKey]
 *
 * fontFamily is extracted as a separate export constant because it is shared across all variants.
 */
export const buildTypographiesJs = (setting: SettingState, variantMap: VariantMapState): string => {
  const lines: string[] = [
    "// Typography Lab — typographies.js (v2)",
    "// Output format: resolved values (not token references)",
    "// fontSize: rem (base 16px) | letterSpacing: absolute em (preview root resets Aegis global 0.02em baseline)",
    "",
    "export const fontFamily = {",
    \`  sans: \${JSON.stringify(toFontFamilyCssValue(setting.fontFamily.sans.families))},\`,
    \`  serif: \${JSON.stringify(toFontFamilyCssValue(setting.fontFamily.serif.families))},\`,
    "};",
    "",
    "export const typographies = {",
  ];

  for (const familyKey of VARIANT_FAMILY_KEYS) {
    const familyDef = variantMap[familyKey];
    const slots = getDefinedSlots(familyDef);
    const label = VARIANT_FAMILY_LABELS[familyKey];

    // Section divider per family
    const divider = "─".repeat(Math.max(0, 74 - label.length));
    lines.push("", \`  // ── \${label} \${divider}\`);

    // Title-family note: representative value ≠ actual component defaults
    if (familyDef.note) {
      lines.push(\`  // NOTE: \${familyDef.note}\`);
    }

    for (const [, slotDef] of slots) {
      const px = SIZE_TOKEN_PX[slotDef.sizeTokenKey];
      const fontWeight = setting.weights[slotDef.weightToken];
      const lineHeight = setting.lineHeights[slotDef.lineHeightToken];
      // Override takes precedence (component / data); otherwise fall back to size-token value.
      const letterSpacing = slotDef.letterSpacingOverride ?? setting.letterSpacing[slotDef.sizeTokenKey];

      // Flag Lab-extension line-height tokens inline
      const lhComment = !LINE_HEIGHT_IS_AEGIS_OFFICIAL[slotDef.lineHeightToken] ? " /* @lab-extension */" : "";

      lines.push(
        \`  \${JSON.stringify(slotDef.actualVariantName)}: {\`,
        \`    fontSize: "\${toRemStr(px)}",\`,
        \`    fontWeight: \${fontWeight},\`,
        \`    lineHeight: \${lineHeight},\${lhComment}\`,
        \`    letterSpacing: "\${toSpacingStr(letterSpacing)}",\`,
        \`  },\`,
      );
    }
  }

  lines.push("};", "");

  return lines.join("\\n");
};
`;export{e as default};