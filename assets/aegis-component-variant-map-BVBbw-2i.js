var e=`/**
 * Aegis component → typography token mapping.
 *
 * @measured         2026-05-01
 * @aegis-version    ^2.48.2  (@legalforce/aegis-react)
 * @measurement-method  Playwright / compareMode ON (Lab CSS removed, Aegis CSS only)
 *
 * When Aegis is updated, re-run Playwright measurements for all entries below and
 * update @measured / @aegis-version. Check especially: font-size, font-weight,
 * line-height, and letter-spacing for each component/props combination.
 *
 * Purpose:
 *   - Source of truth for "what token does each Aegis component actually use?"
 *   - Drives Phase 2 Component mode fixtures in the Typography Lab
 *   - Documents gaps between Lab defaults and Aegis component rendering
 *
 * Design decisions (Phase 2):
 *   - Button nativeLetterSpacing="normal" is kept as-is; Lab does not align native to baseline.
 *     compareMode ON shows Aegis native (normal), compareMode OFF shows Lab setting applied.
 *   - TabsTrigger weight=400 is documented here as a sub-role of "component";
 *     TextType is NOT split into button/tab at this stage.
 *   - DataTable body (14px/400/lh=1.7) is mapped to labType="component", not "body",
 *     because its line-height matches LH_EXPANDED (1.7), not the body type (LH_NORMAL=1.5).
 */

import type { TextType } from "./easys-defaults";

export type ComponentVariantEntry = {
  /** Aegis component name, e.g. "ContentHeaderTitle" */
  component: string;
  /** Human-readable prop description, e.g. 'ContentHeader size="medium"' */
  propsDesc: string;
  /** Aegis token variant identifier, e.g. "title.medium" */
  aegisVariant: string;
  /** Which Lab TextType this component maps to */
  labType: TextType;
  /** Lab font-size key from FONT_SIZE_OPTIONS[labType] */
  fontSizeKey: string;
  /** Measured font-weight */
  fontWeight: number;
  /** Measured line-height ratio */
  lineHeight: number;
  /**
   * "baseline" — component inherits Aegis global body { letter-spacing: 0.02em }
   * "normal"   — component overrides letter-spacing to normal (0) via internal CSS
   */
  nativeLetterSpacing: "baseline" | "normal";
  notes?: string;
};

export const COMPONENT_VARIANT_MAP: ComponentVariantEntry[] = [
  // ── ContentHeaderTitle ─────────────────────────────────────────────────────
  // All sizes: weight=700, lineHeight=1.2 (LH_CONDENSED), ls=0.02em (baseline)

  {
    component: "ContentHeaderTitle",
    propsDesc: 'ContentHeader size="xLarge"',
    aegisVariant: "title.xLarge",
    labType: "title",
    fontSizeKey: "title.xLarge", // 24px — added to font-size-tokens.ts in Phase 2
    fontWeight: 700,
    lineHeight: 1.2,
    nativeLetterSpacing: "baseline",
    notes: "24px is not a Lab default; must select title.xLarge manually in the font-size picker",
  },
  {
    component: "ContentHeaderTitle",
    propsDesc: 'ContentHeader size="large"',
    aegisVariant: "title.large",
    labType: "title",
    fontSizeKey: "title.large",
    fontWeight: 700,
    lineHeight: 1.2,
    nativeLetterSpacing: "baseline",
    notes: "Lab title default (title.large / 20px) matches this variant",
  },
  {
    component: "ContentHeaderTitle",
    propsDesc: 'ContentHeader size="medium" (default)',
    aegisVariant: "title.medium",
    labType: "title",
    fontSizeKey: "title.medium",
    fontWeight: 700,
    lineHeight: 1.2,
    nativeLetterSpacing: "baseline",
  },
  {
    component: "ContentHeaderTitle",
    propsDesc: 'ContentHeader size="small"',
    aegisVariant: "title.small",
    labType: "title",
    fontSizeKey: "title.small",
    fontWeight: 700,
    lineHeight: 1.2,
    nativeLetterSpacing: "baseline",
  },
  {
    component: "ContentHeaderTitle",
    propsDesc: 'ContentHeader size="xSmall"',
    aegisVariant: "title.xSmall",
    labType: "title",
    fontSizeKey: "title.xSmall",
    fontWeight: 700,
    lineHeight: 1.2,
    nativeLetterSpacing: "baseline",
  },

  // ── Button ─────────────────────────────────────────────────────────────────
  // weight=700, lineHeight=1.7 (LH_EXPANDED), nativeLetterSpacing="normal"
  //
  // Aegis button resets letter-spacing to normal (0) internally via CSS Modules,
  // overriding the global body { letter-spacing: 0.02em }.
  //   compareMode ON  → shows Aegis native: letter-spacing: normal
  //   compareMode OFF → shows Lab setting applied: calc(0.02em + delta)
  // The Lab does not align native letter-spacing to baseline; the gap is intentional.

  {
    component: "Button",
    propsDesc: 'size="xLarge"',
    aegisVariant: "component.medium",
    labType: "component",
    fontSizeKey: "component.medium",
    fontWeight: 700,
    lineHeight: 1.7,
    nativeLetterSpacing: "normal",
    notes: "Sizes xLarge–small all use 14px (component.medium)",
  },
  {
    component: "Button",
    propsDesc: 'size="large"',
    aegisVariant: "component.medium",
    labType: "component",
    fontSizeKey: "component.medium",
    fontWeight: 700,
    lineHeight: 1.7,
    nativeLetterSpacing: "normal",
  },
  {
    component: "Button",
    propsDesc: 'size="medium" (default)',
    aegisVariant: "component.medium",
    labType: "component",
    fontSizeKey: "component.medium",
    fontWeight: 700,
    lineHeight: 1.7,
    nativeLetterSpacing: "normal",
  },
  {
    component: "Button",
    propsDesc: 'size="small"',
    aegisVariant: "component.medium",
    labType: "component",
    fontSizeKey: "component.medium",
    fontWeight: 700,
    lineHeight: 1.7,
    nativeLetterSpacing: "normal",
  },
  {
    component: "Button",
    propsDesc: 'size="xSmall"',
    aegisVariant: "component.small",
    labType: "component",
    fontSizeKey: "component.small",
    fontWeight: 700,
    lineHeight: 1.7,
    nativeLetterSpacing: "normal",
    notes: "Only xSmall uses 12px (component.small); all larger sizes use 14px",
  },

  // ── TabsTrigger ────────────────────────────────────────────────────────────
  // Sub-role of "component" type. weight=400 — intentionally regular, not bold.
  // TextType is NOT split into button/tab at this stage; managed here as sub-role.

  {
    component: "TabsTrigger",
    propsDesc: "(no size prop) — sub-role: tab",
    aegisVariant: "component.medium",
    labType: "component",
    fontSizeKey: "component.medium",
    fontWeight: 400, // regular — differs from Lab component default (700)
    lineHeight: 1.5,
    nativeLetterSpacing: "baseline",
    notes:
      "Tab sub-role uses weight=400; Lab component default is 700 (button sub-role). " +
      "Gap is documented here. TextType split (button/tab) deferred to a later phase.",
  },

  // ── FormControl.Label ──────────────────────────────────────────────────────

  {
    component: "FormControl.Label",
    propsDesc: "(no size prop)",
    aegisVariant: "label.small",
    labType: "label",
    fontSizeKey: "label.small",
    fontWeight: 700,
    lineHeight: 1.5,
    nativeLetterSpacing: "baseline",
    notes: "Matches Lab Phase 1 label default exactly (label.small=13px, 700, 1.5)",
  },

  // ── DescriptionListTerm ────────────────────────────────────────────────────
  // size prop (xLarge/large/small) does NOT affect typography — layout/padding only.

  {
    component: "DescriptionListTerm",
    propsDesc: "size=xLarge / large / small (all identical)",
    aegisVariant: "label.small",
    labType: "label",
    fontSizeKey: "label.small",
    fontWeight: 700,
    lineHeight: 1.5,
    nativeLetterSpacing: "baseline",
    notes: "DescriptionList size prop is layout-only; all sizes render the same typography",
  },

  // ── DataTable ──────────────────────────────────────────────────────────────
  // size prop (medium/small) does NOT affect typography.
  // Both header and body use 14px / lh=1.7 (LH_EXPANDED).
  // Mapped to labType="component" (not "body") because lh=1.7 ≠ body type lh=1.5.

  {
    component: "DataTable (column header)",
    propsDesc: "size=medium / small (all identical)",
    aegisVariant: "component.medium",
    labType: "component",
    fontSizeKey: "component.medium",
    fontWeight: 700,
    lineHeight: 1.7,
    nativeLetterSpacing: "baseline",
    notes: "DataTable size prop is layout-only; header typography is uniform across sizes",
  },
  {
    component: "DataTable (body cell)",
    propsDesc: "size=medium / small (all identical)",
    aegisVariant: "component.medium",
    labType: "component", // NOT "body" — lh=1.7 (LH_EXPANDED) ≠ body lh=1.5 (LH_NORMAL)
    fontSizeKey: "component.medium",
    fontWeight: 400,
    lineHeight: 1.7,
    nativeLetterSpacing: "baseline",
    notes:
      "Body cells use regular weight with LH_EXPANDED (1.7), not LH_NORMAL (1.5). " +
      "Mapped to component type, not body type.",
  },
];
`;export{e as default};