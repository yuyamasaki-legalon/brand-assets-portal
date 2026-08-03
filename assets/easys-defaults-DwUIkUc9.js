var e=`/**
 * EASYS typography default values — one entry per text type.
 *
 * Phase 1 alignment: values now mirror Aegis's actual token system.
 * See aegis-token-baseline.ts for source constants and rationale.
 *
 * letterSpacing is a DELTA from the Aegis global baseline (0.02em).
 * 0 = no adjustment (matches Aegis native body letter-spacing).
 */

import { FW_BOLD, FW_REGULAR, LH_CONDENSED, LH_EXPANDED, LH_EXPANDED_PLUS, LH_NORMAL } from "./aegis-token-baseline";

export const TEXT_TYPES = [
  "title",
  "documentTitle",
  "body",
  "documentBody",
  "label",
  "caption",
  "data",
  "component",
] as const;

export type TextType = (typeof TEXT_TYPES)[number];

export type TypographySettings = {
  /** Key into FONT_SIZE_OPTIONS[type] */
  fontSizeKey: string;
  /** 100–900 */
  fontWeight: number;
  /** Delta from Aegis global baseline (0.02em). 0 = no adjustment. */
  letterSpacing: number;
  /** ratio, e.g. 1.6 */
  lineHeight: number;
};

export const EASYS_DEFAULTS: Record<TextType, TypographySettings> = {
  // title variants: font-weight 700, line-height condensed (1.2), no extra letter-spacing
  title: { fontSizeKey: "title.large", fontWeight: FW_BOLD, letterSpacing: 0, lineHeight: LH_CONDENSED },
  documentTitle: { fontSizeKey: "title.medium", fontWeight: FW_BOLD, letterSpacing: 0, lineHeight: LH_CONDENSED },

  // body variants: regular weight, body.medium (14px)
  body: { fontSizeKey: "body.medium", fontWeight: FW_REGULAR, letterSpacing: 0, lineHeight: LH_NORMAL },
  documentBody: { fontSizeKey: "body.medium", fontWeight: FW_REGULAR, letterSpacing: 0, lineHeight: LH_EXPANDED_PLUS },

  // label: 13px (label.small), bold, normal line-height
  label: { fontSizeKey: "label.small", fontWeight: FW_BOLD, letterSpacing: 0, lineHeight: LH_NORMAL },

  // caption: 12px, regular, normal line-height
  caption: { fontSizeKey: "caption.small", fontWeight: FW_REGULAR, letterSpacing: 0, lineHeight: LH_NORMAL },

  // data: 14px, regular, normal line-height (Aegis data token: lineHeight = normal/1.5)
  data: { fontSizeKey: "data.medium", fontWeight: FW_REGULAR, letterSpacing: 0, lineHeight: LH_NORMAL },

  // component: 14px (component.medium), bold, expanded line-height
  component: { fontSizeKey: "component.medium", fontWeight: FW_BOLD, letterSpacing: 0, lineHeight: LH_EXPANDED },
};

export const TEXT_TYPE_LABELS: Record<TextType, string> = {
  title: "Title",
  documentTitle: "Document Title",
  body: "Body",
  documentBody: "Document Body",
  label: "Label",
  caption: "Caption",
  data: "Data",
  component: "Component",
};
`;export{e as default};