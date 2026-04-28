import type { FieldConfig } from "./base";

export const CheckboxConfig: FieldConfig[] = [
  // --- Properties ---
  {
    key: "size",
    label: "Size",
    type: "select",
    options: ["medium", "small"],
    defaultValue: "medium",
    tab: "Properties",
  },
  {
    key: "color",
    label: "Color",
    type: "select",
    options: ["neutral", "warning", "danger"],
    defaultValue: "neutral",
    tab: "Properties",
  },
  { key: "indeterminate", label: "Indeterminate", type: "checkbox", tab: "Properties" },
  { key: "noLabel", label: "No Label", type: "checkbox", tab: "Properties" },

  // --- Content ---
  {
    key: "inputType",
    label: "Text Layout",
    type: "select",
    options: ["Single-line", "Multi-line"],
    defaultValue: "Single-line",
    tab: "Content",
  },
  {
    key: "label",
    label: "Label",
    type: "textfield",
    defaultValue: "Sample checkbox option",
    tab: "Content",
    visibleWhen: (p) => (p.inputType ?? "Single-line") === "Single-line",
  },
  {
    key: "labelArea",
    label: "Label",
    type: "textarea",
    defaultValue: "Sample checkbox option",
    tab: "Content",
    visibleWhen: (p) => p.inputType === "Multi-line",
  },
];
