import type { FieldConfig } from "./base";

const MARK_COLORS = ["red", "orange", "yellow", "teal", "blue", "indigo", "purple", "magenta", "gray"];

export const MarkConfig: FieldConfig[] = [
  // --- Properties ---
  { key: "underline", label: "Underline", type: "checkbox", tab: "Properties" },
  { key: "color", label: "Color", type: "select", options: MARK_COLORS, defaultValue: "red", tab: "Properties" },
  { key: "withText", label: "With Text", type: "checkbox", tab: "Properties" },

  // --- Content ---
  {
    key: "textBefore",
    label: "Text (Before)",
    type: "textarea",
    defaultValue: "This text contains a ",
    tab: "Content",
  },
  { key: "markText", label: "Mark Text", type: "textarea", defaultValue: "important part", tab: "Content" },
  { key: "textAfter", label: "Text (After)", type: "textarea", defaultValue: " for emphasis.", tab: "Content" },
];
