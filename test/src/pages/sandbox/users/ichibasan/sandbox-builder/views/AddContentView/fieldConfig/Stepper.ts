import type { FieldConfig } from "./base";

export const StepperConfig: FieldConfig[] = [
  // --- Properties ---
  {
    key: "orientation",
    label: "Orientation",
    type: "select",
    options: ["horizontal", "vertical"],
    defaultValue: "horizontal",
    tab: "Properties",
  },
  {
    key: "size",
    label: "Size",
    type: "select",
    options: ["medium", "small"],
    defaultValue: "medium",
    tab: "Properties",
  },
  { key: "readOnly", label: "Read Only", type: "checkbox", tab: "Properties" },
  { key: "subContent", label: "Sub Content", type: "checkbox", tab: "Properties" },

  // --- Content ---
  { key: "items", label: "Items", type: "stepper", min: 2, max: 10, defaultValue: "3", tab: "Content" },
  {
    key: "label",
    label: "Label",
    type: "textarea",
    multiValue: true,
    placeholder: "Step 1,Step 2,Step 3",
    tab: "Content",
  },
];
