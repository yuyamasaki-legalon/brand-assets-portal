import type { FieldConfig } from "./base";

export const FileDropConfig: FieldConfig[] = [
  // --- Properties ---
  { key: "icon", label: "Icon", type: "checkbox", defaultValue: "true", tab: "Properties" },
  {
    key: "text",
    label: "Text",
    type: "textarea",
    defaultValue: "Drag and drop your files\nto upload them to the space",
    tab: "Properties",
  },
  { key: "buttonLabel", label: "Button Label", type: "textfield", defaultValue: "Select File", tab: "Properties" },
  { key: "multiple", label: "Multiple", type: "checkbox", tab: "Properties" },
  { key: "sub", label: "Sub", type: "checkbox", tab: "Properties" },
];
