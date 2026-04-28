import type { FieldConfig } from "./base";

export const RangeCalendarConfig: FieldConfig[] = [
  // --- Properties ---
  { key: "minValue", label: "Min Value", type: "checkbox", tab: "Properties" },
  {
    key: "minValueDate",
    label: "Min Value",
    type: "datefield",
    defaultValue: "today",
    indent: true,
    visibleWhen: (p) => p.minValue === "true",
    tab: "Properties",
  },
  { key: "maxValue", label: "Max Value", type: "checkbox", tab: "Properties" },
  {
    key: "maxValueDate",
    label: "Max Value",
    type: "datefield",
    defaultValue: "today",
    indent: true,
    visibleWhen: (p) => p.maxValue === "true",
    tab: "Properties",
  },
];
