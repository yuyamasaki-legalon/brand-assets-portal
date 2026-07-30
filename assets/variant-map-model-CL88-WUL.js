var e=`/**
 * Variant Map state model for Typography Lab.
 *
 * Defines the structural mapping: variant family → slot → token references.
 * Values here are token KEY references, not actual values.
 * Actual values are resolved by looking up SettingState at render/export time.
 *
 * Key design rules:
 *   - "Default" / "Emphasis" are UI slot names, NOT Aegis actual variant names.
 *   - actualVariantName holds the official Aegis variant string (used for export).
 *   - sizeTokenKey references the Aegis internal size token (for letter-spacing lookup).
 *   - weightToken / lineHeightToken reference SettingState key names.
 *   - SettingState and VariantMapState are never merged into one state object.
 *
 * Single-slot families:
 *   - title, document.title  → Emphasis only (bold)
 *   - caption                → Default only (normal)
 *
 * Multi-slot families (Default + Emphasis):
 *   - body, document.body, label, data, component
 */

import type { LineHeightTokenKey, SizeTokenKey, WeightTokenKey } from "./setting-model";

// ─── Variant family keys ───────────────────────────────────────────────────────

export const VARIANT_FAMILY_KEYS = [
  "title",
  "document.title",
  "body",
  "document.body",
  "label",
  "caption",
  "data",
  "component",
] as const;

export type VariantFamilyKey = (typeof VARIANT_FAMILY_KEYS)[number];

export const VARIANT_FAMILY_LABELS: Record<VariantFamilyKey, string> = {
  title: "Title",
  "document.title": "Document Title",
  body: "Body",
  "document.body": "Document Body",
  label: "Label",
  caption: "Caption",
  data: "Data",
  component: "Component",
};

// ─── Weight slots ──────────────────────────────────────────────────────────────

/**
 * UI slot names for font-weight.
 *
 * "Default" = the normal/regular weight variant of this family.
 * "Emphasis" = the bold/emphasized weight variant of this family.
 *
 * Single-weight families use only one slot:
 *   - title, document.title → Emphasis (bold is the only option)
 *   - caption               → Default (normal is the only option)
 */
export const WEIGHT_SLOTS = ["Default", "Emphasis"] as const;
export type WeightSlot = (typeof WEIGHT_SLOTS)[number];

// ─── Slot definition ───────────────────────────────────────────────────────────

export type VariantSlotDef = {
  /**
   * Official Aegis actual variant name.
   * Used verbatim in typographies.js / typography.tokens.json export.
   *
   * Examples:
   *   "body.medium"                     — body Default
   *   "body.medium.bold"                — body Emphasis
   *   "document.body.sans.medium"       — document.body Default
   *   "document.body.sans.medium.bold"  — document.body Emphasis
   *   "label.small.bold"                — label Emphasis
   *   "component.medium"                — component Default
   *   "component.medium.bold"           — component Emphasis
   */
  actualVariantName: string;

  /**
   * Aegis internal size token key.
   * Used to look up letter-spacing from SettingState.letterSpacing.
   * Also used to display the relevant letter-spacing row in Variant Map tab.
   *
   * Must be one of SizeTokenKey (x5Large … x3Small).
   */
  sizeTokenKey: SizeTokenKey;

  /**
   * References SettingState.weights[weightToken].
   * The actual font-weight number is resolved at render/export time.
   */
  weightToken: WeightTokenKey;

  /**
   * References SettingState.lineHeights[lineHeightToken].
   * The actual ratio is resolved at render/export time.
   */
  lineHeightToken: LineHeightTokenKey;

  /**
   * Per-slot letter-spacing override (absolute em value).
   * When set, takes precedence over SettingState.letterSpacing[sizeTokenKey].
   * Only used for families where VariantFamilyDef.letterSpacingEditable is true.
   * Undefined = no override (fall back to the size-token value from SettingState).
   */
  letterSpacingOverride?: number;
};

// ─── Family definition ─────────────────────────────────────────────────────────

export type VariantFamilyDef = {
  /**
   * Slot definitions for this family.
   * Partial because single-weight families only define one of the two slots.
   *
   * At least one slot must always be defined.
   */
  slots: Partial<Record<WeightSlot, VariantSlotDef>>;

  /**
   * When true, each slot exposes an independent letter-spacing slider in the
   * Variant Map tab instead of the readonly SettingState display.
   *
   * Use for families where letter-spacing is design-sensitive and benefits from
   * per-variant tuning (e.g. component text, data cells).
   * The edited value is stored in VariantSlotDef.letterSpacingOverride.
   */
  letterSpacingEditable?: boolean;

  /**
   * Contextual note shown as auxiliary text in the Variant Map UI.
   * Use to clarify design intent or flag distinctions that can cause confusion.
   *
   * Example: title's representative value vs. actual component defaults.
   */
  note?: string;
};

// ─── Variant Map state ─────────────────────────────────────────────────────────

export type VariantMapState = Record<VariantFamilyKey, VariantFamilyDef>;

// ─── Defaults ──────────────────────────────────────────────────────────────────

/**
 * Default variant map.
 *
 * Corrections applied vs. earlier planning:
 *   - actualVariantName: official Aegis variant strings throughout
 *   - sizeTokenKey: Aegis internal tokens (xxLarge=20px, medium=14px, etc.)
 *   - data.lineHeightToken: "normal" (corrected from "condensed")
 *   - label: Default + Emphasis (multi-weight, not single-weight)
 *   - component: Default + Emphasis (2 slots; Default=normal, Emphasis=bold)
 *   - caption: Default only (single slot, normal weight)
 *   - title / document.title: Emphasis only (single slot, bold weight)
 */
export const VARIANT_MAP_DEFAULTS: VariantMapState = {
  // ── Single-slot: Emphasis (bold) ─────────────────────────────────────────────

  title: {
    note: "Token family representative value. Actual component defaults (e.g. ContentHeaderTitle) may use a different variant.",
    slots: {
      Emphasis: {
        // title.large = 24px in Aegis — the primary page-heading variant.
        // Using x3Large (24px) so actualVariantName and sizeTokenKey agree.
        actualVariantName: "title.large",
        sizeTokenKey: "x3Large", // 24px — consistent with title.large
        weightToken: "bold",
        lineHeightToken: "condensed",
      },
    },
  },

  "document.title": {
    slots: {
      Emphasis: {
        actualVariantName: "document.title.sans.small",
        sizeTokenKey: "xLarge", // 18px
        weightToken: "bold",
        lineHeightToken: "condensed",
      },
    },
  },

  // ── Single-slot: Default (normal) ────────────────────────────────────────────

  caption: {
    slots: {
      Default: {
        actualVariantName: "caption.small",
        sizeTokenKey: "xSmall", // 12px
        weightToken: "normal",
        lineHeightToken: "normal",
      },
    },
  },

  // ── Multi-slot: Default + Emphasis ───────────────────────────────────────────

  body: {
    slots: {
      Default: {
        actualVariantName: "body.medium",
        sizeTokenKey: "medium", // 14px
        weightToken: "normal",
        lineHeightToken: "normal",
      },
      Emphasis: {
        actualVariantName: "body.medium.bold",
        sizeTokenKey: "medium", // 14px
        weightToken: "bold",
        lineHeightToken: "normal",
      },
    },
  },

  "document.body": {
    slots: {
      Default: {
        actualVariantName: "document.body.sans.medium",
        sizeTokenKey: "medium", // 14px
        weightToken: "normal",
        lineHeightToken: "expandedPlus",
      },
      Emphasis: {
        actualVariantName: "document.body.sans.medium.bold",
        sizeTokenKey: "medium", // 14px
        weightToken: "bold",
        lineHeightToken: "expandedPlus",
      },
    },
  },

  label: {
    slots: {
      Default: {
        actualVariantName: "label.small",
        sizeTokenKey: "small", // 13px
        weightToken: "normal",
        lineHeightToken: "normal",
      },
      Emphasis: {
        actualVariantName: "label.small.bold",
        sizeTokenKey: "small", // 13px
        weightToken: "bold",
        lineHeightToken: "normal",
      },
    },
  },

  data: {
    letterSpacingEditable: true,
    slots: {
      Default: {
        actualVariantName: "data.medium",
        sizeTokenKey: "medium", // 14px
        weightToken: "normal",
        lineHeightToken: "normal", // corrected: normal (not condensed)
      },
      Emphasis: {
        actualVariantName: "data.medium.bold",
        sizeTokenKey: "medium", // 14px
        weightToken: "bold",
        lineHeightToken: "normal", // corrected: normal
      },
    },
  },

  component: {
    letterSpacingEditable: true,
    slots: {
      Default: {
        actualVariantName: "component.medium",
        sizeTokenKey: "medium", // 14px
        weightToken: "normal", // flexible: allows Lab to test lighter component text
        lineHeightToken: "expanded",
      },
      Emphasis: {
        actualVariantName: "component.medium.bold",
        sizeTokenKey: "medium", // 14px
        weightToken: "bold", // standard interactive / button weight
        lineHeightToken: "expanded",
      },
    },
  },
};

// ─── Helper utilities ──────────────────────────────────────────────────────────

/** Returns true if this family has only one weight slot. */
export const isSingleSlotFamily = (def: VariantFamilyDef): boolean => Object.keys(def.slots).length === 1;

/** Returns the defined slots for a family as an ordered [slot, def] array. */
export const getDefinedSlots = (def: VariantFamilyDef): [WeightSlot, VariantSlotDef][] =>
  (["Default", "Emphasis"] as WeightSlot[]).flatMap((slot) => {
    const slotDef = def.slots[slot];
    return slotDef ? [[slot, slotDef]] : [];
  });
`;export{e as default};