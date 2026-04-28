import type { FieldConfig } from "./base";

export const BannerConfig: FieldConfig[] = [
  // --- Properties ---
  {
    key: "color",
    label: "Color",
    type: "select",
    options: ["information", "success", "warning", "danger"],
    defaultValue: "information",
    tab: "Properties",
  },
  { key: "inline", label: "Inline", type: "checkbox", tab: "Properties" },
  { key: "closeButton", label: "Close Button", type: "checkbox", defaultValue: "true", tab: "Properties" },
  { key: "action", label: "Action", type: "checkbox", tab: "Properties" },
  { key: "title", label: "Title", type: "checkbox", tab: "Properties" },
  { key: "withActionLabel", label: "With Action Label", type: "checkbox", tab: "Properties" },

  // --- Content ---
  {
    key: "titleText",
    label: "Title Text",
    type: "textfield",
    defaultValue: "Information Title",
    visibleWhen: (p) => p.title === "true",
    tab: "Content",
  },
  { key: "text", label: "Text", type: "textfield", defaultValue: 'This is a "Information" banner.', tab: "Content" },
  {
    key: "linkLabel",
    label: "Link Label",
    type: "textfield",
    defaultValue: "Link",
    visibleWhen: (p) => p.withActionLabel === "true",
    tab: "Content",
  },
  {
    key: "buttonLabel",
    label: "Button Label",
    type: "textfield",
    defaultValue: "Action",
    visibleWhen: (p) => p.action === "true",
    tab: "Content",
  },
];
