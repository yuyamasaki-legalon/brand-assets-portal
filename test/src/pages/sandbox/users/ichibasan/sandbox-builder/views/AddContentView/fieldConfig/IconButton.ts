import type { FieldConfig } from "./base";

export const IconButtonConfig: FieldConfig[] = [
  // --- Properties ---
  {
    key: "variant",
    label: "Variant",
    type: "select",
    options: ["solid", "subtle", "plain"],
    defaultValue: "subtle",
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
  {
    key: "color",
    label: "Color",
    type: "select",
    options: ["neutral", "brand", "danger", "inverse"],
    defaultValue: "neutral",
    tab: "Properties",
  },
  { key: "loading", label: "Loading", type: "checkbox", tab: "Properties" },

  // --- Content ---
  {
    key: "icon",
    label: "Icon",
    type: "icon-combobox",
    defaultValue: "LfPlusLarge",
    disabledWhen: (p) => p.loading === "true",
    tab: "Content",
  },
];
