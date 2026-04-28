import type { FieldConfig } from "./base";

export const SwitchConfig: FieldConfig[] = [
  // --- Properties ---
  {
    key: "size",
    label: "Size",
    type: "select",
    options: ["small", "medium"],
    defaultValue: "small",
    tab: "Properties",
  },
  {
    key: "color",
    label: "Color",
    type: "select",
    options: ["neutral", "information"],
    defaultValue: "information",
    tab: "Properties",
  },
  {
    key: "labelPosition",
    label: "Label Position",
    type: "select",
    options: ["start", "end"],
    defaultValue: "end",
    tab: "Properties",
  },

  // --- Content ---
  { key: "label", label: "Label", type: "textfield", defaultValue: "Toggle Option", tab: "Content" },
];
