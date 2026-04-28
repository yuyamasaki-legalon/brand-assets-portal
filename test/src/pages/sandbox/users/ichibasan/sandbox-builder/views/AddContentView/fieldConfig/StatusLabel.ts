import type { FieldConfig } from "./base";

export const StatusLabelConfig: FieldConfig[] = [
  // --- Properties ---
  {
    key: "size",
    label: "Size",
    type: "select",
    options: ["small", "medium", "large", "xLarge"],
    defaultValue: "medium",
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
    options: ["neutral", "red", "yellow", "blue", "teal", "gray", "purple", "magenta", "orange", "lime", "indigo"],
    defaultValue: "neutral",
    tab: "Properties",
  },

  // --- Content ---
  {
    key: "label",
    label: "Label",
    type: "textarea",
    multiValue: true,
    defaultValue:
      "Completed,Active,Pending,Archived,Draft,Active,Completed,Pending,Active,Draft,Completed,Active,Pending,Archived,Draft,Active,Completed,Pending,Active,Draft",
    tab: "Content",
  },
];
