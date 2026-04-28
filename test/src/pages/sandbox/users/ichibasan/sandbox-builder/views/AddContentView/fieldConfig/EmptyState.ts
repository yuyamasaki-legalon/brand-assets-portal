import type { FieldConfig } from "./base";

export const EmptyStateConfig: FieldConfig[] = [
  // --- Properties ---
  { key: "visual", label: "Visual", type: "checkbox", tab: "Properties" },
  {
    key: "visualType",
    label: "Visual Type",
    type: "select",
    options: ["Icon", "Illust"],
    defaultValue: "Icon",
    visibleWhen: (p) => (p.__area ?? "contentBody") === "contentBody" && p.visual === "true",
    tab: "Properties",
  },
  {
    key: "icon",
    label: "Icon",
    type: "select",
    options: ["LfHourglass", "LfWarningRhombus", "LfWarningTriangleFill", "LfInformationCircle", "LfCheckCircle"],
    defaultValue: "LfHourglass",
    visibleWhen: (p) =>
      p.visual === "true" && ((p.__area ?? "contentBody") !== "contentBody" || (p.visualType ?? "Icon") === "Icon"),
    tab: "Properties",
  },
  {
    key: "illust",
    label: "Illust",
    type: "select",
    options: ["book", "box", "contract", "error-cat-1", "error-cat-2", "error-cat-3", "magnifying-glass"],
    defaultValue: "box",
    visibleWhen: (p) =>
      (p.__area ?? "contentBody") === "contentBody" && p.visual === "true" && p.visualType === "Illust",
    tab: "Properties",
  },
  { key: "title", label: "Title", type: "checkbox", defaultValue: "true", tab: "Properties" },
  { key: "buttonGroup", label: "ButtonGroup", type: "checkbox", defaultValue: "true", tab: "Properties" },

  // --- Content ---
  {
    key: "titleText",
    label: "Title",
    type: "textfield",
    defaultValue: "No Items Found",
    tab: "Content",
    visibleWhen: (p) => p.title !== "false",
  },
  {
    key: "text",
    label: "Text",
    type: "textarea",
    defaultValue: "There are no items to display at this time.",
    tab: "Content",
  },
  {
    key: "btnItems",
    label: "Buttons",
    type: "stepper",
    min: 1,
    max: 3,
    defaultValue: "1",
    tab: "Content",
    visibleWhen: (p) => p.buttonGroup !== "false",
  },
  {
    key: "btnLabel1",
    label: "Button Label",
    type: "textfield",
    indent: true,
    defaultValue: "Action",
    tab: "Content",
    visibleWhen: (p) => p.buttonGroup !== "false" && parseInt(p.btnItems ?? "1", 10) >= 1,
  },
  {
    key: "btnLabel2",
    label: "Button Label 2",
    type: "textfield",
    indent: true,
    defaultValue: "Action 2",
    tab: "Content",
    visibleWhen: (p) => p.buttonGroup !== "false" && parseInt(p.btnItems ?? "1", 10) >= 2,
  },
  {
    key: "btnLabel3",
    label: "Button Label 3",
    type: "textfield",
    indent: true,
    defaultValue: "Action 3",
    tab: "Content",
    visibleWhen: (p) => p.buttonGroup !== "false" && parseInt(p.btnItems ?? "1", 10) >= 3,
  },
];
