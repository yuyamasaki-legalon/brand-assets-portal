var e=`/**
 * Font-size token definitions for Typography Lab.
 *
 * Each entry: { key, label, rem }
 *   key   — token identifier shown in export CSS comments
 *   label — displayed in the font-size Select ("body.medium (14px)")
 *   rem   — actual CSS value (prototype assumed values; replace when Aegis publishes official px)
 *
 * 1rem = 16px baseline assumed.
 * Arrays are ordered largest → smallest.
 */

import type { TextType } from "./easys-defaults";

export type FontSizeEntry = {
  key: string;
  label: string;
  rem: number;
};

export const FONT_SIZE_OPTIONS: Record<TextType, FontSizeEntry[]> = {
  title: [
    { key: "title.xLarge", label: "title.xLarge (24px)", rem: 1.5 }, // ContentHeaderTitle size=xLarge
    { key: "title.large", label: "title.large (20px)", rem: 1.25 },
    { key: "title.medium", label: "title.medium (18px)", rem: 1.125 },
    { key: "title.small", label: "title.small (16px)", rem: 1 },
    { key: "title.xSmall", label: "title.xSmall (14px)", rem: 0.875 },
    { key: "title.xxSmall", label: "title.xxSmall (12px)", rem: 0.75 },
  ],
  documentTitle: [
    { key: "title.large", label: "title.large (20px)", rem: 1.25 },
    { key: "title.medium", label: "title.medium (18px)", rem: 1.125 },
    { key: "title.small", label: "title.small (16px)", rem: 1 },
    { key: "title.xSmall", label: "title.xSmall (14px)", rem: 0.875 },
  ],
  body: [
    { key: "body.xxLarge", label: "body.xxLarge (20px)", rem: 1.25 },
    { key: "body.xLarge", label: "body.xLarge (18px)", rem: 1.125 },
    { key: "body.large", label: "body.large (16px)", rem: 1 },
    { key: "body.medium", label: "body.medium (14px)", rem: 0.875 },
    { key: "body.small", label: "body.small (12px)", rem: 0.75 },
    { key: "body.xSmall", label: "body.xSmall (11px)", rem: 0.6875 },
  ],
  documentBody: [
    { key: "body.xLarge", label: "body.xLarge (18px)", rem: 1.125 },
    { key: "body.large", label: "body.large (16px)", rem: 1 },
    { key: "body.medium", label: "body.medium (14px)", rem: 0.875 },
    { key: "body.small", label: "body.small (12px)", rem: 0.75 },
  ],
  label: [
    { key: "label.large", label: "label.large (16px)", rem: 1 },
    { key: "label.medium", label: "label.medium (14px)", rem: 0.875 },
    { key: "label.small", label: "label.small (13px)", rem: 0.8125 },
    { key: "label.xSmall", label: "label.xSmall (11px)", rem: 0.6875 },
  ],
  caption: [
    { key: "caption.medium", label: "caption.medium (14px)", rem: 0.875 },
    { key: "caption.small", label: "caption.small (12px)", rem: 0.75 },
  ],
  data: [
    { key: "data.large", label: "data.large (16px)", rem: 1 },
    { key: "data.medium", label: "data.medium (14px)", rem: 0.875 },
    { key: "data.small", label: "data.small (12px)", rem: 0.75 },
    { key: "data.xSmall", label: "data.xSmall (11px)", rem: 0.6875 },
  ],
  component: [
    { key: "component.large", label: "component.large (16px)", rem: 1 },
    { key: "component.medium", label: "component.medium (14px)", rem: 0.875 },
    { key: "component.small", label: "component.small (12px)", rem: 0.75 },
    { key: "component.xSmall", label: "component.xSmall (11px)", rem: 0.6875 },
  ],
};

/** Resolve a fontSizeKey to its rem value. Falls back to 0.875rem if key not found. */
export const resolveFontSizeRem = (type: TextType, key: string): number =>
  FONT_SIZE_OPTIONS[type].find((e) => e.key === key)?.rem ?? 0.875;
`;export{e as default};