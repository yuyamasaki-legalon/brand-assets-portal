import type { FieldConfig } from "./base";

export const SegmentedControlConfig: FieldConfig[] = [
  // --- Properties ---
  {
    key: "variant",
    label: "Variant",
    type: "select",
    options: ["plain", "solid"],
    defaultValue: "plain",
    tab: "Properties",
  },
  {
    key: "size",
    label: "Size",
    type: "select",
    options: ["medium", "small", "xSmall"],
    defaultValue: "medium",
    tab: "Properties",
  },
  {
    key: "weight",
    label: "Weight",
    type: "select",
    options: ["bold", "normal"],
    defaultValue: "normal",
    tab: "Properties",
  },

  // --- Content ---
  { key: "items", label: "Items", type: "stepper", min: 2, max: 10, defaultValue: "3", tab: "Content" },
  {
    key: "label",
    label: "Label",
    type: "textarea",
    multiValue: true,
    placeholder: "Option A,Option B,Option C",
    tab: "Content",
  },
];
