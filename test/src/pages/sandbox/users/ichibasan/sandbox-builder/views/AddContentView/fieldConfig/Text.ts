import type { FieldConfig } from "./base";

export const TextConfig: FieldConfig[] = [
  // --- Properties ---
  {
    key: "textType",
    label: "Text Type",
    type: "select",
    options: ["title", "document title", "label", "body", "document body", "caption", "data"],
    defaultValue: "body",
    tab: "Properties",
  },

  // Size (per textType — options differ across types)
  {
    key: "sizeTitle",
    label: "Size",
    type: "select",
    options: ["large", "medium", "small", "xSmall", "xxSmall", "x3Small"],
    defaultValue: "medium",
    indent: true,
    tab: "Properties",
    visibleWhen: (p) => p.textType === "title",
  },
  {
    key: "sizeDocTitle",
    label: "Size",
    type: "select",
    options: ["medium", "small", "xSmall"],
    defaultValue: "medium",
    indent: true,
    tab: "Properties",
    visibleWhen: (p) => p.textType === "document title",
  },
  {
    key: "sizeLabel",
    label: "Size",
    type: "select",
    options: ["large", "medium", "small"],
    defaultValue: "medium",
    indent: true,
    tab: "Properties",
    visibleWhen: (p) => p.textType === "label",
  },
  {
    key: "sizeBody",
    label: "Size",
    type: "select",
    options: ["xxLarge", "xLarge", "large", "medium", "semiSmall", "small", "xSmall"],
    defaultValue: "medium",
    indent: true,
    tab: "Properties",
    visibleWhen: (p) => (p.textType ?? "body") === "body",
  },
  {
    key: "sizeDocBody",
    label: "Size",
    type: "select",
    options: ["large", "medium", "small"],
    defaultValue: "medium",
    indent: true,
    tab: "Properties",
    visibleWhen: (p) => p.textType === "document body",
  },
  {
    key: "sizeCaption",
    label: "Size",
    type: "select",
    options: ["medium", "small", "xSmall"],
    defaultValue: "small",
    indent: true,
    tab: "Properties",
    visibleWhen: (p) => p.textType === "caption",
  },
  {
    key: "sizeData",
    label: "Size",
    type: "select",
    options: ["medium", "small"],
    defaultValue: "medium",
    indent: true,
    tab: "Properties",
    visibleWhen: (p) => p.textType === "data",
  },

  // Font — document.body.{font}.{size} requires font; document.title uses no-font form
  {
    key: "font",
    label: "Font",
    type: "select",
    options: ["sans", "serif"],
    defaultValue: "sans",
    indent: true,
    tab: "Properties",
    visibleWhen: (p) => p.textType === "document body",
  },

  // Color
  //   title (non-x3Small): always "bold" → no field shown (ComponentRenderer hardcodes "bold")
  //   title (x3Small only): "bold" | "subtle" → show dedicated field
  //   caption: "default" | "subtle" | "danger"
  //   others:  "default" | "subtle"
  {
    key: "colorTitleX3Small",
    label: "Color",
    type: "select",
    options: ["bold", "subtle"],
    defaultValue: "bold",
    indent: true,
    tab: "Properties",
    visibleWhen: (p) => p.textType === "title" && p.sizeTitle === "x3Small",
  },
  {
    key: "color",
    label: "Color",
    type: "select",
    options: ["default", "subtle"],
    defaultValue: "default",
    indent: true,
    tab: "Properties",
    visibleWhen: (p) => p.textType !== "title" && p.textType !== "caption",
  },
  {
    key: "colorCaption",
    label: "Color",
    type: "select",
    options: ["default", "subtle", "danger"],
    defaultValue: "default",
    indent: true,
    tab: "Properties",
    visibleWhen: (p) => p.textType === "caption",
  },

  // Weight — title is always bold (no field); document.title and caption have no bold variant
  {
    key: "weight",
    label: "Weight",
    type: "select",
    options: ["normal", "bold"],
    defaultValue: "normal",
    indent: true,
    tab: "Properties",
    visibleWhen: (p) => {
      const t = p.textType ?? "body";
      return t !== "title" && t !== "document title" && t !== "caption";
    },
  },

  // --- Content ---
  {
    key: "inputType",
    label: "Text Layout",
    type: "select",
    options: ["Single-line", "Multi-line"],
    defaultValue: "Single-line",
    tab: "Content",
    visibleWhen: (p) => p.textType !== "title",
  },
  {
    key: "text",
    label: "Text",
    type: "textfield",
    tab: "Content",
    visibleWhen: (p) => p.textType === "title" || (p.inputType ?? "Single-line") === "Single-line",
  },
  {
    key: "textArea",
    label: "Text",
    type: "textarea",
    tab: "Content",
    visibleWhen: (p) => p.textType !== "title" && p.inputType === "Multi-line",
  },
];
