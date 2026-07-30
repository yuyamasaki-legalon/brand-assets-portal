var e=`/**
 * Typography CSS generation for Typography Lab.
 *
 * Phase 2 (current): LEGACY CSS generation removed. The new model is the sole active path.
 *
 * Active exports:
 *   1. PREVIEW_ROOT_ATTR          — data attribute for the preview root container.
 *   2. buildTypographyVarsCssFromModel — generates --typo2-{family}-{slot}-* vars
 *        from SettingState + VariantMapState (absolute letter-spacing values).
 *   3. STATIC_TYPOGRAPHY_CSS_V2   — static CSS selectors referencing --typo2-* vars.
 *        Generated once at module load from TYPE_ELEMENT_MAP.
 *
 * Preview root letter-spacing:
 *   The preview root resets letter-spacing to 0, overriding Aegis's global
 *   \`body { letter-spacing: 0.02em }\`. All letter-spacing values in SettingState
 *   are therefore absolute (not deltas from the Aegis baseline).
 */

import { TEXT_TYPE_LABELS, TEXT_TYPES, type TextType } from "./easys-defaults";
import {
  LINE_HEIGHT_IS_AEGIS_OFFICIAL,
  LINE_HEIGHT_TOKEN_KEYS,
  type SettingState,
  SIZE_TOKEN_KEYS,
  SIZE_TOKEN_PX,
  WEIGHT_TOKEN_KEYS,
} from "./setting-model";
import { TYPE_ELEMENT_MAP } from "./type-element-map";
import { getDefinedSlots, VARIANT_FAMILY_KEYS, VARIANT_MAP_DEFAULTS, type VariantMapState } from "./variant-map-model";

// ─── Preview root ──────────────────────────────────────────────────────────────

/** Data attribute placed on the Typography Lab root container element. */
export const PREVIEW_ROOT_ATTR = "data-typo-preview-root" as const;

const SCOPE = \`[\${PREVIEW_ROOT_ATTR}]\`;

// ─── CSS variable builder ──────────────────────────────────────────────────────

/** CSS-safe font-family value from an ordered name list. */
const toFontFamilyCss = (names: string[]): string => names.map((f) => (f.includes(" ") ? \`"\${f}"\` : f)).join(", ");

/**
 * Generates CSS custom properties from SettingState + VariantMapState.
 *
 * Variable naming: --typo2-{family}-{slot}-{prop}
 *   family: Aegis family key with dots replaced by hyphens
 *           e.g. "body" → body, "document.title" → document-title
 *   slot:   "default" or "emphasis" (lowercase)
 *   prop:   size | weight | lineheight | spacing
 *
 * Also generates shared token vars:
 *   --typo2-font-family
 *   --typo2-weight-{key}      (normal / medium / semibold / bold)
 *   --typo2-lineheight-{key}  (tight / condensed / normal / expanded / expandedPlus)
 *   --typo2-spacing-{key}     (x5Large … x3Small)
 *
 * letter-spacing values are ABSOLUTE (not deltas).
 * The preview root letter-spacing is 0 (reset by STATIC_TYPOGRAPHY_CSS_V2).
 *
 * @param setting    - Token actual values (weights, lineHeights, letterSpacing, fontFamily)
 * @param variantMap - Structural mapping (which token each variant slot uses)
 */
export const buildTypographyVarsCssFromModel = (setting: SettingState, variantMap: VariantMapState): string => {
  const fontFamily = toFontFamilyCss(setting.fontFamily.sans.families);
  const lines: string[] = [\`  --typo2-font-family: \${fontFamily};\`];

  // Weight tokens
  lines.push("", "  /* weight tokens */");
  for (const key of WEIGHT_TOKEN_KEYS) {
    lines.push(\`  --typo2-weight-\${key}: \${setting.weights[key]};\`);
  }

  // Line-height tokens
  lines.push("", "  /* line-height tokens */");
  for (const key of LINE_HEIGHT_TOKEN_KEYS) {
    const labExt = LINE_HEIGHT_IS_AEGIS_OFFICIAL[key] ? "" : " /* @lab-extension */";
    lines.push(\`  --typo2-lineheight-\${key}: \${setting.lineHeights[key]};\${labExt}\`);
  }

  // Letter-spacing per size token (absolute em values)
  lines.push("", "  /* letter-spacing per size token (absolute) */");
  for (const key of SIZE_TOKEN_KEYS) {
    const px = SIZE_TOKEN_PX[key];
    lines.push(\`  --typo2-spacing-\${key}: \${setting.letterSpacing[key]}em; /* \${px}px */\`);
  }

  // Variant slots — resolved from SettingState
  lines.push("", "  /* variant slots */");
  for (const familyKey of VARIANT_FAMILY_KEYS) {
    const familyDef = variantMap[familyKey];
    const familyVar = familyKey.replace(/\\./g, "-");
    const slots = getDefinedSlots(familyDef);

    for (const [slot, slotDef] of slots) {
      const slotVar = slot.toLowerCase();
      const sizeKey = slotDef.sizeTokenKey;
      const px = SIZE_TOKEN_PX[sizeKey];
      const rem = +(px / 16).toFixed(4);
      const weight = setting.weights[slotDef.weightToken];
      const lineHeight = setting.lineHeights[slotDef.lineHeightToken];
      // Use per-slot override when set (component / data editable families),
      // otherwise fall back to the size-token value from SettingState.
      const spacing = slotDef.letterSpacingOverride ?? setting.letterSpacing[sizeKey];

      lines.push(
        \`  /* \${familyKey} \${slot} → \${slotDef.actualVariantName} */\`,
        \`  --typo2-\${familyVar}-\${slotVar}-size: \${rem}rem; /* \${px}px */\`,
        \`  --typo2-\${familyVar}-\${slotVar}-weight: \${weight};\`,
        \`  --typo2-\${familyVar}-\${slotVar}-lineheight: \${lineHeight};\`,
        \`  --typo2-\${familyVar}-\${slotVar}-spacing: \${spacing}em;\`,
      );
    }
  }

  return \`/* Typography Lab — model-based CSS variables (v2) */\\n\${SCOPE} {\\n\${lines.join("\\n")}\\n}\`;
};

// ─── Static base CSS ──────────────────────────────────────────────────────────

/**
 * Maps each TextType to its primary --typo2-* slot for the static CSS selectors.
 *
 * Single-slot families: the only defined slot.
 * Multi-slot families: the slot matching Aegis's default element styling.
 *   - label → emphasis (form labels use label.small.bold in Aegis)
 *   - component → emphasis (buttons use bold weight in Aegis)
 *   - body / documentBody / data → default (normal weight)
 */
const TYPE_TO_V2: Record<TextType, { family: string; slot: string }> = {
  title: { family: "title", slot: "emphasis" },
  documentTitle: { family: "document-title", slot: "emphasis" },
  body: { family: "body", slot: "default" },
  documentBody: { family: "document-body", slot: "default" },
  label: { family: "label", slot: "emphasis" },
  caption: { family: "caption", slot: "default" },
  data: { family: "data", slot: "default" },
  component: { family: "component", slot: "emphasis" },
};

/**
 * Static CSS selectors referencing --typo2-* vars. Generated once at module load.
 *
 * Selectors are driven by TYPE_ELEMENT_MAP (single source of truth for element targeting).
 * letter-spacing is absolute — no calc() needed because the preview root resets
 * Aegis's global \`body { letter-spacing: 0.02em }\` to 0.
 */
export const STATIC_TYPOGRAPHY_CSS_V2: string = (() => {
  const blocks: string[] = [
    "/* Typography Lab — static base v2 (--typo2-* var references) */",
    \`\${SCOPE} {\\n  letter-spacing: 0; /* reset: Aegis global body { letter-spacing: 0.02em } */\\n}\`,
  ];

  for (const type of TEXT_TYPES) {
    const { selectors, forceInternals } = TYPE_ELEMENT_MAP[type];
    const { family, slot } = TYPE_TO_V2[type];
    const v = \`--typo2-\${family}-\${slot}\`;

    const mainSel = selectors.map((s) => \`\${SCOPE} \${s}\`).join(",\\n");
    blocks.push(\`/* \${TEXT_TYPE_LABELS[type]} */
\${mainSel} {
  font-family: var(--typo2-font-family);
  font-size: var(\${v}-size);
  font-weight: var(\${v}-weight);
  letter-spacing: var(\${v}-spacing);
  line-height: var(\${v}-lineheight);
}\`);

    if (forceInternals?.length) {
      const forceSel = forceInternals.map((s) => \`\${SCOPE} \${s}\`).join(",\\n");
      blocks.push(\`\${forceSel} {
  font-weight: var(\${v}-weight);
  letter-spacing: var(\${v}-spacing);
  line-height: var(\${v}-lineheight);
}\`);
    }
  }

  return blocks.join("\\n\\n");
})();

// ─── Aegis component CSS ───────────────────────────────────────────────────────

/**
 * Static CSS for Aegis components — targets [data-aegis-typography^="family."] selectors.
 *
 * Applies ONLY: font-family, font-weight, letter-spacing, line-height.
 * Does NOT override font-size — each Aegis variant retains its native size.
 *
 * Slot determination:
 *   Multi-slot families (body, document.body, label, data, component):
 *     :not([data-aegis-typography$=".bold"]) → default slot
 *     [data-aegis-typography$=".bold"]       → emphasis slot
 *   Single-slot families:
 *     title / document.title → emphasis (bold is the only option)
 *     caption                → default  (normal is the only option)
 *
 * Per-family exclusions (compare 対象外コンポーネント):
 *   component.*: SegmentedControl ボタンを除外
 *     — Button と class を共有するが操作 UI であり weight 比較対象ではない
 *     — SegmentedControlButton は Button の class に "aegis-SegmentedControlButton" を追加するため
 *       :not(.aegis-SegmentedControlButton) で安全に除外可能
 *   data.*: Pagination 内要素を除外
 *     — Pagination のページ数表示ラベルが data.medium を使うが compare 対象ではない
 *     — :not(.aegis-Pagination *) を selector に直接追加し、最初から Lab CSS を当てない
 *     — CSS Selectors Level 4 の複合 :not() (descendant combinator 付き) を使用
 *       対応ブラウザ: Chrome 88+ / Firefox 84+ / Safari 14+ (Vite ターゲット範囲内)
 *
 * This enables compare mode to reflect weight / spacing / line-height changes in:
 *   - Settings sidebar (FormControl.Label, Tab, Checkbox text, etc.)
 *   - Sample template Aegis components (Text, ContentHeaderTitle, DescriptionListTerm, etc.)
 * without breaking Aegis component sizing (no font-size overrides),
 * and without unintentionally affecting SegmentedControl or Pagination.
 *
 * Generated once at module load from VARIANT_MAP_DEFAULTS slot structure.
 * Uses the same --typo2-{family}-{slot}-* variables as STATIC_TYPOGRAPHY_CSS_V2.
 */
export const STATIC_AEGIS_CSS_V2: string = (() => {
  const blocks: string[] = [
    "/* Typography Lab — Aegis component CSS v2 (font-weight / letter-spacing / line-height only; no font-size) */",
  ];

  for (const familyKey of VARIANT_FAMILY_KEYS) {
    const familyDef = VARIANT_MAP_DEFAULTS[familyKey];
    const familyVar = familyKey.replace(/\\./g, "-");
    const attrPrefix = familyKey; // e.g. "body", "document.title"

    const hasDefault = !!familyDef.slots.Default;
    const hasEmphasis = !!familyDef.slots.Emphasis;
    const v = \`--typo2-\${familyVar}\`;

    // Per-family exclusions appended directly to selectors (Lab CSS never applied to excluded targets).
    //
    // component.* — same-element class exclusion:
    //   SegmentedControlButton renders Button with class "aegis-SegmentedControlButton" on the same
    //   <button> element that carries data-aegis-typography, so :not(.className) works directly.
    //
    // data.* — ancestor-context exclusion (CSS Selectors Level 4 complex :not()):
    //   Pagination's page-count label has data-aegis-typography="data.medium" but is a descendant
    //   of .aegis-Pagination. :not(.aegis-Pagination *) excludes any element inside that container.
    const classExclusion = familyKey === "component" ? \`:not(.aegis-SegmentedControlButton)\` : "";
    const ancestorExclusion = familyKey === "data" ? \`:not(.aegis-Pagination *)\` : "";
    const exclusions = classExclusion + ancestorExclusion;

    if (hasDefault && hasEmphasis) {
      // Multi-slot: split by .bold suffix in the attribute value
      const defaultSel = \`\${SCOPE} [data-aegis-typography^="\${attrPrefix}."]:not([data-aegis-typography$=".bold"])\${exclusions}\`;
      const emphasisSel = \`\${SCOPE} [data-aegis-typography^="\${attrPrefix}."][data-aegis-typography$=".bold"]\${exclusions}\`;

      blocks.push(\`/* \${familyKey} — default */
\${defaultSel} {
  font-family: var(--typo2-font-family);
  font-weight: var(\${v}-default-weight);
  letter-spacing: var(\${v}-default-spacing);
  line-height: var(\${v}-default-lineheight);
}\`);
      blocks.push(\`/* \${familyKey} — emphasis */
\${emphasisSel} {
  font-family: var(--typo2-font-family);
  font-weight: var(\${v}-emphasis-weight);
  letter-spacing: var(\${v}-emphasis-spacing);
  line-height: var(\${v}-emphasis-lineheight);
}\`);
    } else {
      // Single-slot: all variants use the only defined slot
      const slotName = hasEmphasis ? "emphasis" : "default";
      const sel = \`\${SCOPE} [data-aegis-typography^="\${attrPrefix}."]\${exclusions}\`;

      blocks.push(\`/* \${familyKey} */
\${sel} {
  font-family: var(--typo2-font-family);
  font-weight: var(\${v}-\${slotName}-weight);
  letter-spacing: var(\${v}-\${slotName}-spacing);
  line-height: var(\${v}-\${slotName}-lineheight);
}\`);
    }
  }

  return blocks.join("\\n\\n");
})();
`;export{e as default};