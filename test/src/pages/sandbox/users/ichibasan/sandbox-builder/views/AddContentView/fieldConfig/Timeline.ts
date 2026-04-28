import type { FieldConfig } from "./base";

const TIMELINE_ITEM_MAX = 10;

export const TimelineConfig: FieldConfig[] = [
  { key: "items", label: "Items", type: "stepper", min: 2, max: TIMELINE_ITEM_MAX, defaultValue: "4", tab: "Content" },
  {
    key: "tagLabels",
    label: "Label",
    type: "textarea",
    multiValue: true,
    placeholder: "V0,V1,V1.2,V2",
    defaultValueGetter: (p) => {
      const itemCount = Math.min(Math.max(parseInt(p.items ?? "4", 10), 2), TIMELINE_ITEM_MAX);
      const defaults = ["V0", "V1", "V1.2", "V2"];
      return defaults.slice(0, itemCount).join(",");
    },
    tab: "Content",
  },
];
