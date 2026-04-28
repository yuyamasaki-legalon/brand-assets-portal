import type { FieldConfig } from "./base";

export const TagConfig: FieldConfig[] = [
  // --- Properties ---
  {
    key: "size",
    label: "Size",
    type: "select",
    options: ["medium", "small"],
    defaultValue: "small",
    tab: "Properties",
  },
  {
    key: "variant",
    label: "Variant",
    type: "select",
    options: ["outline", "fill"],
    defaultValue: "outline",
    tab: "Properties",
  },
  {
    key: "color",
    label: "Color",
    type: "select",
    options: [
      "neutral",
      "inverse",
      "red",
      "yellow",
      "blue",
      "teal",
      "purple",
      "magenta",
      "orange",
      "lime",
      "indigo",
      "transparent",
    ],
    defaultValue: "blue",
    tab: "Properties",
  },

  // --- Content ---
  { key: "label", label: "Label", type: "textfield", defaultValue: "Tag", tab: "Content" },
];
