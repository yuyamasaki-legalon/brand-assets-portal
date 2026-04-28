import type { FieldConfig } from "./base";

export const AvatarGroupConfig: FieldConfig[] = [
  {
    key: "size",
    label: "Size",
    type: "select",
    options: ["large", "medium", "small", "xSmall"],
    defaultValue: "medium",
  },
  { key: "items", label: "Items", type: "stepper", min: 1, max: 10, defaultValue: "5" },
];
