import type { FieldConfig } from "./base";

const BADGE_COLORS = ["neutral", "subtle", "success", "information", "warning", "danger", "inverse"];

export const ButtonConfig: FieldConfig[] = [
  // --- Properties ---
  {
    key: "variant",
    label: "Variant",
    type: "select",
    options: ["solid", "subtle", "plain", "gutterless", "Weight(gutterless)"],
    defaultValue: "subtle",
    tab: "Properties",
  },
  {
    key: "color",
    label: "Color",
    type: "select",
    options: ["neutral", "brand", "danger", "inverse"],
    defaultValue: "neutral",
    tab: "Properties",
  },
  {
    key: "size",
    label: "Size",
    type: "select",
    options: ["large", "medium", "small", "xSmall"],
    defaultValue: "medium",
    tab: "Properties",
  },
  { key: "loading", label: "Loading", type: "checkbox", disabledWhen: undefined, tab: "Properties" },
  {
    key: "minWidth",
    label: "Min Width",
    type: "select",
    options: [
      "none",
      "Width",
      "x8Large(80px)",
      "x9Large(88px)",
      "x10Large(96px)",
      "x11Large(104px)",
      "x12Large(112px)",
      "x13Large(120px)",
      "x14Large(160px)",
      "x15Large(200px)",
      "x16Large(240px)",
    ],
    defaultValue: "none",
    tab: "Properties",
  },
  { key: "leading", label: "Leading", type: "checkbox", disabledWhen: (p) => p.loading === "true", tab: "Properties" },
  {
    key: "trailing",
    label: "Trailing",
    type: "checkbox",
    disabledWhen: (p) => p.loading === "true",
    tab: "Properties",
  },
  { key: "withoutContent", label: "Without Content", type: "checkbox", tab: "Properties" },

  // --- Content ---
  {
    key: "label",
    label: "Label",
    type: "textfield",
    defaultValue: "Button",
    visibleWhen: (p) => p.withoutContent !== "true",
    tab: "Content",
  },

  // Leading
  {
    key: "leadingType",
    label: "Leading Type",
    type: "select",
    options: ["Icon", "Badge"],
    defaultValue: "Icon",
    visibleWhen: (p) => p.loading !== "true" && p.leading === "true",
    tab: "Content",
  },
  {
    key: "leadingIcon",
    label: "Leading Icon",
    type: "icon-combobox",
    defaultValue: "LfPlusLarge",
    indent: true,
    visibleWhen: (p) => p.loading !== "true" && p.leading === "true" && (p.leadingType ?? "Icon") === "Icon",
    tab: "Content",
  },
  {
    key: "leadingBadge",
    label: "Leading Badge",
    type: "select",
    options: ["normal", "count"],
    defaultValue: "normal",
    indent: true,
    visibleWhen: (p) => p.loading !== "true" && p.leading === "true" && p.leadingType === "Badge",
    tab: "Content",
  },
  {
    key: "leadingBadgeColor",
    label: "Leading Badge Color",
    type: "select",
    options: BADGE_COLORS,
    defaultValue: "information",
    indent: true,
    visibleWhen: (p) => p.loading !== "true" && p.leading === "true" && p.leadingType === "Badge",
    tab: "Content",
  },
  {
    key: "leadingBadgeCount",
    label: "Leading Badge Count",
    type: "textfield",
    defaultValue: "3",
    indent: true,
    visibleWhen: (p) =>
      p.loading !== "true" && p.leading === "true" && p.leadingType === "Badge" && p.leadingBadge === "count",
    tab: "Content",
  },

  // Trailing（Without Content=On の場合は LfAngleDownMiddle に固定 → 全フィールド非表示）
  {
    key: "trailingType",
    label: "Trailing Type",
    type: "select",
    options: ["Icon", "Badge"],
    defaultValue: "Icon",
    visibleWhen: (p) => p.loading !== "true" && p.trailing === "true" && p.withoutContent !== "true",
    tab: "Content",
  },
  {
    key: "trailingIcon",
    label: "Trailing Icon",
    type: "icon-combobox",
    defaultValue: "LfPlusLarge",
    indent: true,
    visibleWhen: (p) =>
      p.loading !== "true" &&
      p.trailing === "true" &&
      (p.trailingType ?? "Icon") === "Icon" &&
      p.withoutContent !== "true",
    tab: "Content",
  },
  {
    key: "trailingBadge",
    label: "Trailing Badge",
    type: "select",
    options: ["normal", "count"],
    defaultValue: "normal",
    indent: true,
    visibleWhen: (p) =>
      p.loading !== "true" && p.trailing === "true" && p.trailingType === "Badge" && p.withoutContent !== "true",
    tab: "Content",
  },
  {
    key: "trailingBadgeColor",
    label: "Trailing Badge Color",
    type: "select",
    options: BADGE_COLORS,
    defaultValue: "information",
    indent: true,
    visibleWhen: (p) =>
      p.loading !== "true" && p.trailing === "true" && p.trailingType === "Badge" && p.withoutContent !== "true",
    tab: "Content",
  },
  {
    key: "trailingBadgeCount",
    label: "Trailing Badge Count",
    type: "textfield",
    defaultValue: "3",
    indent: true,
    visibleWhen: (p) =>
      p.loading !== "true" &&
      p.trailing === "true" &&
      p.trailingType === "Badge" &&
      p.trailingBadge === "count" &&
      p.withoutContent !== "true",
    tab: "Content",
  },
];
