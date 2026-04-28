import type { FieldConfig } from "./base";

export const TOOLBAR_GROUP_MAX = 5;
export const TOOLBAR_ITEMS_MAX = 5;

export const ToolbarConfig: FieldConfig[] = [
  // Properties
  {
    key: "orientation",
    label: "Orientation",
    type: "select",
    options: ["horizontal", "vertical"],
    defaultValue: "horizontal",
    tab: "Properties",
  },
  {
    key: "groups",
    label: "Groups",
    type: "stepper",
    min: 1,
    max: TOOLBAR_GROUP_MAX,
    defaultValue: "2",
    tab: "Properties",
  },
  // グループ別アイテム数（インデント表示）
  { key: "_tbGroupItems", label: "", type: "toolbar-group-items-editor", tab: "Properties" },

  // Content — 全 Group×Item をインライン列挙
  { key: "_tbContent", label: "", type: "toolbar-content-editor", tab: "Content" },
];
