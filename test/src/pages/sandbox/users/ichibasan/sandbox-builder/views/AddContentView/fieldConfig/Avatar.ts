import type { FieldConfig } from "./base";

const AVATAR_COLORS = ["auto", "subtle", "brand", "red", "orange", "teal", "indigo", "blue", "purple", "magenta"];

export const AvatarConfig: FieldConfig[] = [
  // --- Properties ---
  {
    key: "size",
    label: "Size",
    type: "select",
    options: ["large", "medium", "small", "xSmall"],
    defaultValue: "medium",
    tab: "Properties",
  },
  { key: "color", label: "Color", type: "select", options: AVATAR_COLORS, defaultValue: "subtle", tab: "Properties" },
  { key: "withIcon", label: "With Icon", type: "checkbox", tab: "Properties" },
  { key: "withinDisabledElement", label: "Within Disabled Element", type: "checkbox", tab: "Properties" },

  // --- Content ---
  {
    key: "icon",
    label: "Icon",
    type: "icon-combobox",
    defaultValue: "LfPlusLarge",
    disabledWhen: (p) => p.withIcon !== "true",
    tab: "Content",
  },
];
