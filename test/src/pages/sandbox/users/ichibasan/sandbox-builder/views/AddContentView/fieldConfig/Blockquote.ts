import type { FieldConfig } from "./base";

export const BlockquoteConfig: FieldConfig[] = [
  // --- Properties ---
  { key: "withCodeBlock", label: "With Code Block", type: "checkbox", tab: "Properties" },

  // --- Content ---
  {
    key: "text",
    label: "Text",
    type: "textarea",
    defaultValue: '"Innovation distinguishes between a leader and a follower."',
    tab: "Content",
  },
];
