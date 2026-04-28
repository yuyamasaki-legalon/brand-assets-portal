import type { FieldConfig } from "./base";

export const BreadcrumbConfig: FieldConfig[] = [
  // --- Properties ---
  { key: "withButton", label: "With Button", type: "checkbox", tab: "Properties" },
  { key: "withItemTrailing", label: "With Item Trailing", type: "checkbox", tab: "Properties" },
  { key: "tabbable", label: "Tabbable", type: "checkbox", tab: "Properties" },

  // --- Content ---
  { key: "items", label: "Items", type: "stepper", min: 2, max: 10, defaultValue: "3", tab: "Content" },
  {
    key: "label",
    label: "Label",
    type: "textarea",
    placeholder: "AAA,BBB,CCC",
    multiValue: true,
    defaultValue: "Home,Category,Detail",
    tab: "Content",
  },
];
