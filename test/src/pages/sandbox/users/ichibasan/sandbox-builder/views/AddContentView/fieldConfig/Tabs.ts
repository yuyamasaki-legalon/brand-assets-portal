import type { FieldConfig } from "./base";

const TAB_MAX = 10;

const BADGE_COLORS = ["neutral", "subtle", "success", "information", "warning", "danger", "inverse"];
const LIST_WIDTHS = ["xxSmall", "xSmall", "small", "medium", "large", "xLarge", "xxLarge"];

const itemOverrideKeys = (m: number): string[] => [
  `label_row${m}`,
  `leadingType_row${m}`,
  `leadingIcon_row${m}`,
  `leadingBadgeColor_row${m}`,
  `trailingType_row${m}`,
  `trailingBadgeColor_row${m}`,
  `trailingText_row${m}`,
];

const hasItemOverride = (p: Record<string, string>, m: number): boolean =>
  itemOverrideKeys(m).some((k) => p[k] !== undefined);

const editTargetField: FieldConfig = {
  key: "editTarget",
  label: "Edit Tabs Content",
  type: "select",
  defaultValue: "All Items",
  tab: "Content",
  optionsGetter: (p) => {
    const count = Math.min(Math.max(parseInt(p.items ?? "3", 10), 2), TAB_MAX);
    return [
      "All Items",
      ...Array.from({ length: count }, (_, i) => {
        const label = `Item-${i + 1}`;
        return hasItemOverride(p, i + 1) ? { label, value: label, description: "Edited" } : label;
      }),
    ];
  },
};

const resetItemOverridesField: FieldConfig = {
  key: "_resetItemOverrides",
  label: "Reset Item Overrides",
  type: "button",
  tab: "Content",
  visibleWhen: (p) => {
    if ((p.editTarget ?? "All Items") !== "All Items") return false;
    for (let m = 1; m <= TAB_MAX; m++) {
      if (hasItemOverride(p, m)) return true;
    }
    return false;
  },
  onClick: (_p) => {
    const result: Record<string, string | undefined> = {};
    for (let m = 1; m <= TAB_MAX; m++) {
      for (const k of itemOverrideKeys(m)) {
        result[k] = undefined;
      }
    }
    return result;
  },
};

const clearItemOverrideField: FieldConfig = {
  key: "_clearItemOverride",
  label: "Clear Item Override",
  type: "button",
  tab: "Content",
  visibleWhen: (p) => {
    const target = p.editTarget ?? "All Items";
    if (target === "All Items") return false;
    const m = parseInt(target.replace("Item-", ""), 10);
    return !Number.isNaN(m) && hasItemOverride(p, m);
  },
  onClick: (p) => {
    const m = parseInt((p.editTarget ?? "").replace("Item-", ""), 10);
    if (!m) return {};
    const result: Record<string, string | undefined> = {};
    for (const k of itemOverrideKeys(m)) {
      result[k] = undefined;
    }
    return result;
  },
};

export const TabsConfig: FieldConfig[] = [
  // --- Properties ---
  {
    key: "size",
    label: "Size",
    type: "select",
    options: ["large", "medium", "small"],
    defaultValue: "large",
    tab: "Properties",
  },
  {
    key: "position",
    label: "Position",
    type: "select",
    options: ["top", "start", "end"],
    defaultValue: "top",
    tab: "Properties",
  },
  {
    key: "listWidth",
    label: "List Width",
    type: "select",
    options: LIST_WIDTHS,
    defaultValue: "medium",
    tab: "Properties",
    visibleWhen: (p) => p.position === "start" || p.position === "end",
  },
  { key: "listBordered", label: "List Bordered", type: "checkbox", tab: "Properties" },
  { key: "tabWidth", label: "Tab Width", type: "checkbox", tab: "Properties" },
  { key: "withTabLeading", label: "With Tab Leading", type: "checkbox", tab: "Properties" },
  { key: "withTabTrailing", label: "With Tab Trailing", type: "checkbox", tab: "Properties" },

  // --- Content ---
  { key: "items", label: "Items", type: "stepper", min: 2, max: TAB_MAX, defaultValue: "3", tab: "Content" },
  editTargetField,
  resetItemOverridesField,
  clearItemOverrideField,

  // Label — All Items
  {
    key: "label",
    label: "Label",
    type: "textarea",
    multiValue: true,
    placeholder: "Tab 1,Tab 2,Tab 3",
    tab: "Content",
    visibleWhen: (p) => (p.editTarget ?? "All Items") === "All Items",
  },

  // Label — per item
  ...Array.from(
    { length: TAB_MAX },
    (_, m): FieldConfig => ({
      key: `label_row${m + 1}`,
      label: "Label",
      type: "textfield",
      placeholder: `Tab ${m + 1}`,
      defaultValue: `Tab ${m + 1}`,
      tab: "Content",
      visibleWhen: (p) => p.editTarget === `Item-${m + 1}`,
    }),
  ),

  // Leading — All Items
  {
    key: "leadingType",
    label: "Leading Type",
    type: "select",
    options: ["Icon", "Badge"],
    defaultValue: "Icon",
    tab: "Content",
    visibleWhen: (p) => p.withTabLeading === "true" && (p.editTarget ?? "All Items") === "All Items",
  },
  {
    key: "leadingIcon",
    label: "Leading Icon",
    type: "icon-combobox",
    defaultValue: "LfPlusLarge",
    indent: true,
    tab: "Content",
    visibleWhen: (p) =>
      p.withTabLeading === "true" &&
      (p.editTarget ?? "All Items") === "All Items" &&
      (p.leadingType ?? "Icon") === "Icon",
  },
  {
    key: "leadingBadgeColor",
    label: "Leading Badge Color",
    type: "select",
    options: BADGE_COLORS,
    defaultValue: "information",
    indent: true,
    tab: "Content",
    visibleWhen: (p) =>
      p.withTabLeading === "true" && (p.editTarget ?? "All Items") === "All Items" && p.leadingType === "Badge",
  },

  // Leading — per item
  ...Array.from({ length: TAB_MAX }, (_, m): FieldConfig[] => [
    {
      key: `leadingType_row${m + 1}`,
      label: "Leading Type",
      type: "select",
      options: ["Icon", "Badge"],
      defaultValue: "Icon",
      tab: "Content",
      visibleWhen: (p) => p.withTabLeading === "true" && p.editTarget === `Item-${m + 1}`,
    },
    {
      key: `leadingIcon_row${m + 1}`,
      label: "Leading Icon",
      type: "icon-combobox",
      defaultValue: "LfPlusLarge",
      indent: true,
      tab: "Content",
      visibleWhen: (p) =>
        p.withTabLeading === "true" &&
        p.editTarget === `Item-${m + 1}` &&
        (p[`leadingType_row${m + 1}`] ?? p.leadingType ?? "Icon") === "Icon",
    },
    {
      key: `leadingBadgeColor_row${m + 1}`,
      label: "Leading Badge Color",
      type: "select",
      options: BADGE_COLORS,
      defaultValue: "information",
      indent: true,
      tab: "Content",
      visibleWhen: (p) =>
        p.withTabLeading === "true" &&
        p.editTarget === `Item-${m + 1}` &&
        (p[`leadingType_row${m + 1}`] ?? p.leadingType ?? "Icon") === "Badge",
    },
  ]).flat(),

  // Trailing — All Items
  {
    key: "trailingType",
    label: "Trailing Type",
    type: "select",
    options: ["Badge", "Text"],
    defaultValue: "Badge",
    tab: "Content",
    visibleWhen: (p) => p.withTabTrailing === "true" && (p.editTarget ?? "All Items") === "All Items",
  },
  {
    key: "trailingBadgeColor",
    label: "Trailing Badge Color",
    type: "select",
    options: BADGE_COLORS,
    defaultValue: "information",
    indent: true,
    tab: "Content",
    visibleWhen: (p) =>
      p.withTabTrailing === "true" &&
      (p.editTarget ?? "All Items") === "All Items" &&
      (p.trailingType ?? "Badge") === "Badge",
  },
  {
    key: "trailingText",
    label: "Trailing Text",
    type: "textfield",
    defaultValue: "New",
    indent: true,
    tab: "Content",
    visibleWhen: (p) =>
      p.withTabTrailing === "true" && (p.editTarget ?? "All Items") === "All Items" && p.trailingType === "Text",
  },

  // Trailing — per item
  ...Array.from({ length: TAB_MAX }, (_, m): FieldConfig[] => [
    {
      key: `trailingType_row${m + 1}`,
      label: "Trailing Type",
      type: "select",
      options: ["Badge", "Text"],
      defaultValue: "Badge",
      tab: "Content",
      visibleWhen: (p) => p.withTabTrailing === "true" && p.editTarget === `Item-${m + 1}`,
    },
    {
      key: `trailingBadgeColor_row${m + 1}`,
      label: "Trailing Badge Color",
      type: "select",
      options: BADGE_COLORS,
      defaultValue: "information",
      indent: true,
      tab: "Content",
      visibleWhen: (p) =>
        p.withTabTrailing === "true" &&
        p.editTarget === `Item-${m + 1}` &&
        (p[`trailingType_row${m + 1}`] ?? p.trailingType ?? "Badge") === "Badge",
    },
    {
      key: `trailingText_row${m + 1}`,
      label: "Trailing Text",
      type: "textfield",
      defaultValue: "New",
      indent: true,
      tab: "Content",
      visibleWhen: (p) =>
        p.withTabTrailing === "true" &&
        p.editTarget === `Item-${m + 1}` &&
        (p[`trailingType_row${m + 1}`] ?? p.trailingType ?? "Badge") === "Text",
    },
  ]).flat(),
];
