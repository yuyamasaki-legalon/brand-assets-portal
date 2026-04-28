import type { FieldConfig } from "./base";

export const AccordionConfig: FieldConfig[] = [
  // --- Properties ---
  { key: "expandMultiple", label: "Expand Multiple", type: "checkbox", tab: "Properties" },
  {
    key: "size",
    label: "Size",
    type: "select",
    options: ["large", "medium", "small"],
    defaultValue: "medium",
    tab: "Properties",
  },
  { key: "bordered", label: "Bordered", type: "checkbox", tab: "Properties" },
  { key: "buttonWidth", label: "Button Width", type: "checkbox", tab: "Properties" },
  { key: "buttonIcon", label: "Button Icon", type: "checkbox", tab: "Properties" },
  {
    key: "iconPosition",
    label: "Button Icon Position",
    type: "select",
    options: ["start", "end"],
    defaultValue: "end",
    indent: true,
    disabledWhen: (p) => p.buttonIcon !== "true",
    tab: "Properties",
  },
  {
    key: "buttonVariant",
    label: "Button Variant",
    type: "select",
    options: ["solid", "subtle", "plain"],
    defaultValue: "plain",
    indent: true,
    tab: "Properties",
  },
  { key: "withPanelCloseButton", label: "With Panel Close Button", type: "checkbox", tab: "Properties" },
  // --- Content ---
  { key: "items", label: "Items", type: "stepper", min: 1, max: 10, defaultValue: "3", tab: "Content" },
  { key: "label", label: "Label", type: "textarea", placeholder: "AAA,BBB,CCC", multiValue: true, tab: "Content" },
  { key: "content", label: "Content", type: "textarea", placeholder: "AAA,BBB,CCC", multiValue: true, tab: "Content" },
  { key: "icon", label: "Icon", type: "icon-combobox", visibleWhen: (p) => p.buttonIcon === "true", tab: "Content" },
];
