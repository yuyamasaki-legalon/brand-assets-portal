import type { FieldConfig } from "./base";

const TAG_COLORS = [
  "neutral",
  "transparent",
  "red",
  "orange",
  "yellow",
  "lime",
  "teal",
  "blue",
  "indigo",
  "purple",
  "magenta",
  "inverse",
];

const tagColorField = (n: number): FieldConfig => ({
  key: `tagColor${n}`,
  label: `Tag Content-${n} Color`,
  type: "select",
  options: TAG_COLORS,
  defaultValue: "neutral",
  indent: true,
  tab: "Content",
  visibleWhen: (p) => parseInt(p.tgItems ?? "3", 10) >= n,
});

export const TagGroupConfig: FieldConfig[] = [
  // --- Properties ---
  {
    key: "size",
    label: "Size",
    type: "select",
    options: ["medium", "small"],
    defaultValue: "small",
    tab: "Properties",
  },
  { key: "withLabel", label: "With Label", type: "checkbox", tab: "Properties" },
  { key: "tgItems", label: "Items", type: "stepper", min: 1, max: 30, defaultValue: "3", tab: "Properties" },

  // --- Content ---
  {
    key: "groupLabel",
    label: "Group Label",
    type: "textfield",
    placeholder: "Label",
    visibleWhen: (p) => p.withLabel === "true",
    tab: "Content",
  },
  {
    key: "tagLabels",
    label: "Tag Label",
    type: "textarea",
    multiValue: true,
    placeholder: "AAA,BBB,CCC",
    tab: "Content",
  },
  {
    key: "tagVariant",
    label: "Tag Content All",
    type: "select",
    options: ["fill", "outline"],
    defaultValue: "fill",
    tab: "Content",
  },
  { key: "_dividerTagItems", label: "", type: "divider", tab: "Content" },
  ...Array.from({ length: 30 }, (_, i) => tagColorField(i + 1)),
];
