import type { FieldConfig } from "./base";

export const LinkConfig: FieldConfig[] = [
  // --- Properties ---
  {
    key: "textType",
    label: "Text Type",
    type: "select",
    options: ["default", "title", "document title", "label", "body", "document body", "caption", "data", "component"],
    defaultValue: "default",
    tab: "Properties",
  },

  // Size (per textType)
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
    visibleWhen: (p) => p.textType === "body",
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
  {
    key: "sizeComponent",
    label: "Size",
    type: "select",
    options: ["large", "medium", "small", "xSmall", "xxSmall"],
    defaultValue: "medium",
    indent: true,
    tab: "Properties",
    visibleWhen: (p) => p.textType === "component",
  },

  // Font — document body のみ
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

  // Weight — title / document title / caption は bold なし
  {
    key: "weight",
    label: "Weight",
    type: "select",
    options: ["normal", "bold"],
    defaultValue: "normal",
    indent: true,
    tab: "Properties",
    visibleWhen: (p) => {
      const t = p.textType ?? "default";
      return t !== "default" && t !== "title" && t !== "document title" && t !== "caption";
    },
  },

  { key: "_divider1", label: "", type: "divider", tab: "Properties" },

  // Color — options restricted by textType + size + weight (Storybook-derived rules)
  // textType "default": all 4 colors
  {
    key: "color",
    label: "Color",
    type: "select",
    options: ["information", "default", "inverse", "subtle"],
    defaultValue: "information",
    tab: "Properties",
    visibleWhen: (p) => (p.textType ?? "default") === "default",
  },
  // title / document title / label / bold variants / large non-bold body|docBody|component → "default" only
  {
    key: "colorDefault",
    label: "Color",
    type: "select",
    options: ["default"],
    defaultValue: "default",
    tab: "Properties",
    visibleWhen: (p) => {
      const t = p.textType ?? "default";
      if (t === "default") return false;
      if (t === "title" || t === "document title" || t === "label") return true;
      const w = p.weight ?? "normal";
      if (w === "bold") return true;
      if (t === "body") return ["xxLarge", "xLarge", "large", "semiSmall"].includes(p.sizeBody ?? "medium");
      if (t === "document body") return (p.sizeDocBody ?? "medium") === "large";
      if (t === "component") return ["large", "xxSmall"].includes(p.sizeComponent ?? "medium");
      return false;
    },
  },
  // caption / small non-bold body|docBody|data|component → "information" only
  {
    key: "colorInfo",
    label: "Color",
    type: "select",
    options: ["information"],
    defaultValue: "information",
    tab: "Properties",
    visibleWhen: (p) => {
      const t = p.textType ?? "default";
      if (t === "default") return false;
      if (t === "caption") return true;
      const w = p.weight ?? "normal";
      if (w === "bold") return false;
      if (t === "body") return ["medium", "small", "xSmall"].includes(p.sizeBody ?? "medium");
      if (t === "document body") return ["medium", "small"].includes(p.sizeDocBody ?? "medium");
      if (t === "data") return true;
      if (t === "component") return ["medium", "small", "xSmall"].includes(p.sizeComponent ?? "medium");
      return false;
    },
  },
  { key: "underline", label: "Underline", type: "checkbox", tab: "Properties" },
  { key: "leading", label: "Leading", type: "checkbox", tab: "Properties" },
  { key: "trailing", label: "Trailing", type: "checkbox", tab: "Properties" },

  // --- Content ---
  { key: "text", label: "Text", type: "textfield", defaultValue: "Link", tab: "Content" },
  {
    key: "leadingIcon",
    label: "Leading Icon",
    type: "icon-combobox",
    defaultValue: "LfQuestionCircle",
    tab: "Content",
    visibleWhen: (p) => p.leading === "true",
  },
  {
    key: "trailingIcon",
    label: "Trailing Icon",
    type: "icon-combobox",
    defaultValue: "LfArrowUpRightFromSquare",
    tab: "Content",
    visibleWhen: (p) => p.trailing === "true",
  },
];
