import type { FieldConfig } from "./base";
import { makeEditTargetFields } from "./base";

const TG_COL_COLORS = [
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

// --- ButtonGroup per-row fields ---

const bgRowBtnItemsField = (rowNum: number): FieldConfig => ({
  key: `bgRow${rowNum}BtnItems`,
  label: "Button Items",
  type: "stepper",
  min: 0,
  max: 5,
  defaultValue: "3",
  colScoped: true,
  tab: "Content",
  visibleWhen: (p) => p.colContent === "ButtonGroup" && p.bgEditTarget === `Row-${rowNum}`,
});

const bgRowBtnField = (rowNum: number, n: number): FieldConfig => ({
  key: `bgRow${rowNum}Btn${n}`,
  label: `Item-${n}`,
  type: "button",
  subComponent: "Button",
  indent: true,
  colScoped: true,
  tab: "Content",
  visibleWhen: (p) =>
    p.colContent === "ButtonGroup" &&
    p.bgEditTarget === `Row-${rowNum}` &&
    parseInt(p[`bgRow${rowNum}BtnItems`] ?? p.bgBtnItems ?? "3", 10) >= n,
});

const bgRowIconItemsField = (rowNum: number): FieldConfig => ({
  key: `bgRow${rowNum}IconItems`,
  label: "IconButton Items",
  type: "stepper",
  min: 0,
  max: 5,
  defaultValue: "1",
  colScoped: true,
  tab: "Content",
  visibleWhen: (p) => p.colContent === "ButtonGroup" && p.bgEditTarget === `Row-${rowNum}`,
});

const bgRowIconField = (rowNum: number, n: number): FieldConfig => ({
  key: `bgRow${rowNum}Icon${n}`,
  label: `Item-${n}`,
  type: "button",
  subComponent: "IconButton",
  indent: true,
  colScoped: true,
  tab: "Content",
  visibleWhen: (p) =>
    p.colContent === "ButtonGroup" &&
    p.bgEditTarget === `Row-${rowNum}` &&
    parseInt(p[`bgRow${rowNum}IconItems`] ?? p.bgIconItems ?? "1", 10) >= n,
});

// --- IconButton per-row fields ---

const IB_CONTENT_SUB_KEYS = ["variant", "color", "loading", "icon"];

const ibRowContentField = (rowNum: number): FieldConfig => ({
  key: `ibRow${rowNum}Content`,
  label: "IconButton Content",
  type: "button",
  subComponent: "IconButton",
  excludedSubKeys: ["size"],
  indent: true,
  colScoped: true,
  tab: "Content",
  visibleWhen: (p) => p.colContent === "IconButton" && p.ibEditTarget === `Row-${rowNum}`,
});

// --- Button per-row fields ---

const BTN_CONTENT_SUB_KEYS = [
  "variant",
  "color",
  "loading",
  "leading",
  "trailing",
  "withoutContent",
  "minWidth",
  "leadingType",
  "leadingIcon",
  "leadingBadge",
  "leadingBadgeColor",
  "leadingBadgeCount",
  "trailingType",
  "trailingIcon",
  "trailingBadge",
  "trailingBadgeColor",
  "trailingBadgeCount",
];

const btnRowLabelField = (rowNum: number): FieldConfig => ({
  key: `btnRow${rowNum}Label`,
  label: "Button Label",
  type: "textfield",
  placeholder: "Button",
  indent: true,
  colScoped: true,
  tab: "Content",
  visibleWhen: (p) => p.colContent === "Button" && p.btnEditTarget === `Row-${rowNum}`,
});

const btnRowContentField = (rowNum: number): FieldConfig => ({
  key: `btnRow${rowNum}Content`,
  label: "Button Content",
  type: "button",
  subComponent: "Button",
  excludedSubKeys: ["label", "size"],
  indent: true,
  colScoped: true,
  tab: "Content",
  visibleWhen: (p) => p.colContent === "Button" && p.btnEditTarget === `Row-${rowNum}`,
});

// --- Tag per-row fields ---

const TAG_CONTENT_SUB_KEYS = ["variant", "color"];

const tagRowLabelField = (rowNum: number): FieldConfig => ({
  key: `tagRow${rowNum}Label`,
  label: "Tag Label",
  type: "textfield",
  placeholder: "Tag",
  indent: true,
  colScoped: true,
  tab: "Content",
  visibleWhen: (p) => p.colContent === "Tag" && p.tagEditTarget === `Row-${rowNum}`,
});

const tagRowContentField = (rowNum: number): FieldConfig => ({
  key: `tagRow${rowNum}Content`,
  label: "Tag Content",
  type: "button",
  subComponent: "Tag",
  onlyTab: "Properties",
  indent: true,
  colScoped: true,
  tab: "Content",
  visibleWhen: (p) => p.colContent === "Tag" && p.tagEditTarget === `Row-${rowNum}`,
});

// --- TagGroup per-row fields ---

// Per-row label field (visible when "Row-{rowNum}" selected)
const tgRowLabelField = (rowNum: number): FieldConfig => ({
  key: `tgTagLabels${rowNum}`,
  label: "Tag Label",
  type: "textarea",
  multiValue: true,
  placeholder: "AAA,BBB,CCC",
  indent: true,
  colScoped: true,
  tab: "Content",
  visibleWhen: (p) => p.colContent === "TagGroup" && p.tgEditTarget === `Row-${rowNum}`,
});

// Per-row items field (visible when "Row-{rowNum}" selected)
const tgRowItemsField = (rowNum: number): FieldConfig => ({
  key: `tgRow${rowNum}Items`,
  label: "Items",
  type: "stepper",
  min: 1,
  max: 10,
  defaultValue: "3",
  indent: true,
  colScoped: true,
  tab: "Content",
  visibleWhen: (p) => p.colContent === "TagGroup" && p.tgEditTarget === `Row-${rowNum}`,
});

// Shared color field shown in "All Rows" mode
const tgTagColorField = (n: number): FieldConfig => ({
  key: `tgTagColor${n}`,
  label: `Tag Content-${n} Color`,
  type: "select",
  options: TG_COL_COLORS,
  defaultValue: "neutral",
  indent: true,
  colScoped: true,
  tab: "Content",
  visibleWhen: (p) =>
    p.colContent === "TagGroup" && (p.tgEditTarget ?? "All Rows") === "All Rows" && parseInt(p.tgItems ?? "3", 10) >= n,
});

// Per-row color field (visible when "Row-{rowNum}" selected)
const tgRowColorField = (rowNum: number, n: number): FieldConfig => ({
  key: `tgRow${rowNum}TagColor${n}`,
  label: `Tag Content-${n} Color`,
  type: "select",
  options: TG_COL_COLORS,
  defaultValue: "neutral",
  indent: true,
  colScoped: true,
  tab: "Content",
  visibleWhen: (p) =>
    p.colContent === "TagGroup" &&
    p.tgEditTarget === `Row-${rowNum}` &&
    parseInt(p[`tgRow${rowNum}Items`] ?? p.tgItems ?? "3", 10) >= n,
});

// --- StatusLabel per-row fields ---

const SL_CONTENT_SUB_KEYS = ["variant", "color"];

const slRowLabelField = (rowNum: number): FieldConfig => ({
  key: `slRow${rowNum}Label`,
  label: "StatusLabel Label",
  type: "textfield",
  placeholder: "Status",
  indent: true,
  colScoped: true,
  tab: "Content",
  visibleWhen: (p) => p.colContent === "StatusLabel" && p.slEditTarget === `Row-${rowNum}`,
});

const slRowContentField = (rowNum: number): FieldConfig => ({
  key: `slRow${rowNum}Content`,
  label: "StatusLabel Content",
  type: "button",
  subComponent: "StatusLabel",
  onlyTab: "Properties",
  excludedSubKeys: ["size"],
  indent: true,
  colScoped: true,
  tab: "Content",
  visibleWhen: (p) => p.colContent === "StatusLabel" && p.slEditTarget === `Row-${rowNum}`,
});

const COL_CONTENT_OPTIONS = [
  "Text",
  "Link",
  "Button",
  "IconButton",
  "ButtonGroup",
  "Tag",
  "TagGroup",
  "StatusLabel",
  "AvatarGroup",
  "TextField",
  "Select",
  "Combobox",
  "TagPicker",
  "TagInput",
  "DatePicker",
];

const LEADING_CONTENT_OPTIONS = ["Avatar", "Icon"];
const TRAILING_CONTENT_OPTIONS = ["Text", "Icon"];

const COMPONENT_COL_CONTENT = new Set([
  "Button",
  "IconButton",
  "ButtonGroup",
  "Tag",
  "TagGroup",
  "StatusLabel",
  "AvatarGroup",
]);

export const DataTableConfig: FieldConfig[] = [
  // --- Properties ---
  {
    key: "size",
    label: "Size",
    type: "select",
    options: ["medium", "small"],
    defaultValue: "medium",
    tab: "Properties",
  },
  { key: "stickyHeader", label: "Sticky Header", type: "checkbox", defaultValue: "true", tab: "Properties" },
  { key: "sorting", label: "Sorting", type: "checkbox", defaultValue: "true", tab: "Properties" },
  {
    key: "manualSorting",
    label: "Manual Sorting",
    type: "checkbox",
    tab: "Properties",
    visibleWhen: (p) => p.sorting !== "false",
    indent: true,
  },
  { key: "columnPinning", label: "Column Pinning", type: "checkbox", tab: "Properties" },
  {
    key: "pinningCols",
    label: "Pinned Cols",
    type: "tagpicker",
    optionsGetter: (p) =>
      Array.from({ length: Math.min(Math.max(parseInt(p.colItems ?? "5", 10), 2), 20) }, (_, i) => ({
        label: `Col ${i + 1}`,
        value: `col${i}`,
      })),
    max: 3,
    defaultValue: "col0",
    indent: true,
    tab: "Properties",
    visibleWhen: (p) => p.columnPinning === "true",
  },
  {
    key: "pinPosition",
    label: "Pin Position",
    type: "select",
    optionsGetter: () => [
      { label: "Start", value: "start" },
      { label: "End", value: "end" },
    ],
    defaultValue: "start",
    indent: true,
    tab: "Properties",
    visibleWhen: (p) => p.columnPinning === "true",
  },
  { key: "columnVisibility", label: "Column Visibility", type: "checkbox", defaultValue: "true", tab: "Properties" },
  { key: "columnSizing", label: "Column Sizing", type: "checkbox", defaultValue: "true", tab: "Properties" },
  { key: "columnReorderable", label: "Column Reorderable", type: "checkbox", defaultValue: "true", tab: "Properties" },
  { key: "columnOrder", label: "Column Order", type: "checkbox", tab: "Properties" },
  {
    key: "columnOrderList",
    label: "Column Order",
    type: "column-order-editor",
    indent: true,
    tab: "Properties",
    visibleWhen: (p) => p.columnOrder === "true",
  },
  { key: "_div1", label: "", type: "divider", tab: "Properties" },
  { key: "columnBordered", label: "Column Bordered", type: "checkbox", tab: "Properties" },
  { key: "outerBordered", label: "Outer Bordered", type: "checkbox", tab: "Properties" },
  { key: "_div2", label: "", type: "divider", tab: "Properties" },
  {
    key: "highlightRowOnHover",
    label: "Highlight Row On Hover",
    type: "checkbox",
    defaultValue: "true",
    tab: "Properties",
  },
  { key: "highlightedRows", label: "Highlighted Rows", type: "checkbox", tab: "Properties" },
  {
    key: "highlightedRowsSelect",
    label: "Select Rows",
    type: "tagpicker",
    optionsGetter: (p) =>
      Array.from({ length: Math.min(Math.max(parseInt(p.rowItems ?? "10", 10), 2), 50) }, (_, i) => `Item-${i + 1}`),
    defaultValue: "Item-2",
    indent: true,
    tab: "Properties",
    visibleWhen: (p) => p.highlightedRows === "true",
  },
  { key: "_div3", label: "", type: "divider", tab: "Properties" },
  { key: "multipleRowSelection", label: "Multiple Row Selection", type: "checkbox", tab: "Properties" },
  { key: "badgedRows", label: "Badged Rows", type: "checkbox", tab: "Properties" },
  {
    key: "badgedRowsSelect",
    label: "Select Rows",
    type: "tagpicker",
    optionsGetter: (p) =>
      Array.from({ length: Math.min(Math.max(parseInt(p.rowItems ?? "10", 10), 2), 50) }, (_, i) => `Item-${i + 1}`),
    defaultValue: "Item-2",
    indent: true,
    tab: "Properties",
    visibleWhen: (p) => p.badgedRows === "true",
  },
  { key: "rowReorderable", label: "Row Reorderable", type: "checkbox", tab: "Properties" },
  { key: "_div4", label: "", type: "divider", tab: "Properties" },
  { key: "extraHeaderMenuItems", label: "Extra Header Menu Items", type: "checkbox", tab: "Properties" },

  // --- Content ---

  // ステッパー
  { key: "colItems", label: "Col Items", type: "stepper", min: 2, max: 20, defaultValue: "5", tab: "Content" },
  { key: "rowItems", label: "Row Items", type: "stepper", min: 2, max: 50, defaultValue: "10", tab: "Content" },
  // カラム選択 Tabs（DataTable 専用）
  { key: "_colSegmenter", label: "", type: "col-segmenter", tab: "Content" },
  {
    key: "colTitle",
    label: "Title",
    type: "textfield",
    colScoped: true,
    tab: "Content",
    defaultValueGetter: (p) =>
      `Col ${Math.min(parseInt(p._activeCol ?? "0", 10), parseInt(p.colItems ?? "5", 10) - 1) + 1}`,
  },

  // --- Per-column fields (colScoped: true) ---
  {
    key: "colContent",
    label: "Col Content",
    type: "select",
    options: COL_CONTENT_OPTIONS,
    defaultValue: "Text",
    colScoped: true,
    tab: "Content",
  },
  {
    key: "buttonSize",
    label: "Size",
    type: "select",
    options: ["large", "medium", "small", "xSmall"],
    defaultValue: "small",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "Button",
  },
  {
    key: "iconButtonSize",
    label: "Size",
    type: "select",
    options: ["large", "medium", "small", "xSmall"],
    defaultValue: "small",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "IconButton",
  },
  {
    key: "bgSize",
    label: "Size",
    type: "select",
    options: ["large", "medium", "small", "xSmall"],
    defaultValue: "medium",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "ButtonGroup",
  },
  {
    key: "tagSize",
    label: "Size",
    type: "select",
    options: ["medium", "small", "xSmall"],
    defaultValue: "small",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "Tag",
  },
  {
    key: "slSize",
    label: "Size",
    type: "select",
    options: ["large", "medium", "small"],
    defaultValue: "medium",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "StatusLabel",
  },
  {
    key: "text",
    label: "Text",
    type: "textarea",
    multiValue: true,
    placeholder: "AAA,BBB,CCC",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => (p.colContent ?? "Text") === "Text",
  },
  {
    key: "withDescription",
    label: "With Description",
    type: "checkbox",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => (p.colContent ?? "Text") === "Text",
  },
  {
    key: "textDescription",
    label: "Text Description",
    type: "textarea",
    multiValue: true,
    placeholder: "AAA,BBB,CCC",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => (p.colContent ?? "Text") === "Text" && p.withDescription === "true",
  },

  // Leading
  {
    key: "leading",
    label: "Leading",
    type: "checkbox",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => (p.colContent ?? "Text") === "Text",
  },
  {
    key: "leadingContent",
    label: "Leading Content",
    type: "select",
    options: LEADING_CONTENT_OPTIONS,
    defaultValue: "Icon",
    indent: true,
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.leading === "true",
  },
  {
    key: "leadingIcon",
    label: "Leading Icon",
    type: "icon-combobox",
    defaultValue: "LfPlusLarge",
    indent: true,
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.leading === "true" && (p.leadingContent ?? "Icon") === "Icon",
  },

  // Trailing
  {
    key: "trailing",
    label: "Trailing",
    type: "checkbox",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => (p.colContent ?? "Text") === "Text",
  },
  {
    key: "trailingContent",
    label: "Trailing Content",
    type: "select",
    options: TRAILING_CONTENT_OPTIONS,
    defaultValue: "Icon",
    indent: true,
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.trailing === "true",
  },
  {
    key: "trailingText",
    label: "Trailing Text",
    type: "textfield",
    placeholder: "",
    indent: true,
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.trailing === "true" && p.trailingContent === "Text",
  },
  {
    key: "trailingTextVariant",
    label: "Trailing TextVariant",
    type: "button",
    subComponent: "Text",
    onlyTab: "Properties",
    indent: true,
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.trailing === "true" && p.trailingContent === "Text",
  },
  {
    key: "trailingIcon",
    label: "Trailing Icon",
    type: "icon-combobox",
    defaultValue: "LfPlusLarge",
    indent: true,
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.trailing === "true" && (p.trailingContent ?? "Icon") === "Icon",
  },

  // Link col content fields
  {
    key: "linkLabel",
    label: "Label",
    type: "textarea",
    multiValue: true,
    placeholder: "AAA,BBB,CCC",
    defaultValue: "Link",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "Link",
  },

  // Component-specific settings
  {
    key: "_divider2",
    label: "",
    type: "divider",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => COMPONENT_COL_CONTENT.has(p.colContent ?? "Text") && p.colContent !== "TagGroup",
  },

  ...makeEditTargetFields({
    componentName: "Button",
    colContent: "Button",
    prefix: "btn",
    rowOverrideKeys: (n) => [`btnRow${n}Label`, ...BTN_CONTENT_SUB_KEYS.map((k) => `btnRow${n}Content_${k}`)],
  }),
  {
    key: "buttonLabel",
    label: "Button Label",
    type: "textarea",
    multiValue: true,
    placeholder: "AAA,BBB,CCC",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "Button" && (p.btnEditTarget ?? "All Rows") === "All Rows",
  },
  {
    key: "buttonContent",
    label: "Button Content",
    type: "button",
    subComponent: "Button",
    excludedSubKeys: ["label", "size"],
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "Button" && (p.btnEditTarget ?? "All Rows") === "All Rows",
  },
  // Per-row Button fields (Row-n 選択時に該当行のみ表示)
  ...Array.from({ length: 50 }, (_, i) => btnRowLabelField(i + 1)),
  ...Array.from({ length: 50 }, (_, i) => btnRowContentField(i + 1)),

  ...makeEditTargetFields({
    componentName: "IconButton",
    colContent: "IconButton",
    prefix: "ib",
    rowOverrideKeys: (n) => IB_CONTENT_SUB_KEYS.map((k) => `ibRow${n}Content_${k}`),
  }),
  {
    key: "iconButtonContent",
    label: "IconButton Content",
    type: "button",
    subComponent: "IconButton",
    excludedSubKeys: ["size"],
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "IconButton" && (p.ibEditTarget ?? "All Rows") === "All Rows",
  },
  // Per-row IconButton fields (Row-n 選択時に該当行のみ表示)
  ...Array.from({ length: 50 }, (_, i) => ibRowContentField(i + 1)),

  // ButtonGroup col content fields
  ...makeEditTargetFields({
    componentName: "ButtonGroup",
    colContent: "ButtonGroup",
    prefix: "bg",
    rowOverrideKeys: (n) => [`bgRow${n}BtnItems`, `bgRow${n}IconItems`],
  }),
  {
    key: "bgBtnItems",
    label: "Button Items",
    type: "stepper",
    min: 0,
    max: 5,
    defaultValue: "3",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "ButtonGroup" && (p.bgEditTarget ?? "All Rows") === "All Rows",
  },
  {
    key: "bgBtn1",
    label: "Item-1",
    type: "button",
    subComponent: "Button",
    indent: true,
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) =>
      p.colContent === "ButtonGroup" &&
      (p.bgEditTarget ?? "All Rows") === "All Rows" &&
      parseInt(p.bgBtnItems ?? "3", 10) >= 1,
  },
  {
    key: "bgBtn2",
    label: "Item-2",
    type: "button",
    subComponent: "Button",
    indent: true,
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) =>
      p.colContent === "ButtonGroup" &&
      (p.bgEditTarget ?? "All Rows") === "All Rows" &&
      parseInt(p.bgBtnItems ?? "3", 10) >= 2,
  },
  {
    key: "bgBtn3",
    label: "Item-3",
    type: "button",
    subComponent: "Button",
    indent: true,
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) =>
      p.colContent === "ButtonGroup" &&
      (p.bgEditTarget ?? "All Rows") === "All Rows" &&
      parseInt(p.bgBtnItems ?? "3", 10) >= 3,
  },
  {
    key: "bgBtn4",
    label: "Item-4",
    type: "button",
    subComponent: "Button",
    indent: true,
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) =>
      p.colContent === "ButtonGroup" &&
      (p.bgEditTarget ?? "All Rows") === "All Rows" &&
      parseInt(p.bgBtnItems ?? "3", 10) >= 4,
  },
  {
    key: "bgBtn5",
    label: "Item-5",
    type: "button",
    subComponent: "Button",
    indent: true,
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) =>
      p.colContent === "ButtonGroup" &&
      (p.bgEditTarget ?? "All Rows") === "All Rows" &&
      parseInt(p.bgBtnItems ?? "3", 10) >= 5,
  },
  {
    key: "bgIconItems",
    label: "IconButton Items",
    type: "stepper",
    min: 0,
    max: 5,
    defaultValue: "1",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "ButtonGroup" && (p.bgEditTarget ?? "All Rows") === "All Rows",
  },
  {
    key: "bgIcon1",
    label: "Item-1",
    type: "button",
    subComponent: "IconButton",
    indent: true,
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) =>
      p.colContent === "ButtonGroup" &&
      (p.bgEditTarget ?? "All Rows") === "All Rows" &&
      parseInt(p.bgIconItems ?? "1", 10) >= 1,
  },
  {
    key: "bgIcon2",
    label: "Item-2",
    type: "button",
    subComponent: "IconButton",
    indent: true,
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) =>
      p.colContent === "ButtonGroup" &&
      (p.bgEditTarget ?? "All Rows") === "All Rows" &&
      parseInt(p.bgIconItems ?? "1", 10) >= 2,
  },
  {
    key: "bgIcon3",
    label: "Item-3",
    type: "button",
    subComponent: "IconButton",
    indent: true,
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) =>
      p.colContent === "ButtonGroup" &&
      (p.bgEditTarget ?? "All Rows") === "All Rows" &&
      parseInt(p.bgIconItems ?? "1", 10) >= 3,
  },
  {
    key: "bgIcon4",
    label: "Item-4",
    type: "button",
    subComponent: "IconButton",
    indent: true,
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) =>
      p.colContent === "ButtonGroup" &&
      (p.bgEditTarget ?? "All Rows") === "All Rows" &&
      parseInt(p.bgIconItems ?? "1", 10) >= 4,
  },
  {
    key: "bgIcon5",
    label: "Item-5",
    type: "button",
    subComponent: "IconButton",
    indent: true,
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) =>
      p.colContent === "ButtonGroup" &&
      (p.bgEditTarget ?? "All Rows") === "All Rows" &&
      parseInt(p.bgIconItems ?? "1", 10) >= 5,
  },
  // Per-row ButtonGroup fields (Row-n 選択時に該当行のみ表示)
  ...Array.from({ length: 50 }, (_, ri) => [
    bgRowBtnItemsField(ri + 1),
    ...Array.from({ length: 5 }, (_, bi) => bgRowBtnField(ri + 1, bi + 1)),
    bgRowIconItemsField(ri + 1),
    ...Array.from({ length: 5 }, (_, ii) => bgRowIconField(ri + 1, ii + 1)),
  ]).flat(),

  ...makeEditTargetFields({
    componentName: "Tag",
    colContent: "Tag",
    prefix: "tag",
    rowOverrideKeys: (n) => [`tagRow${n}Label`, ...TAG_CONTENT_SUB_KEYS.map((k) => `tagRow${n}Content_${k}`)],
  }),
  {
    key: "tagLabel",
    label: "Tag Label",
    type: "textarea",
    multiValue: true,
    placeholder: "AAA,BBB,CCC",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "Tag" && (p.tagEditTarget ?? "All Rows") === "All Rows",
  },
  {
    key: "tagContent",
    label: "Tag Content",
    type: "button",
    subComponent: "Tag",
    colScoped: true,
    tab: "Content",
    onlyTab: "Properties",
    visibleWhen: (p) => p.colContent === "Tag" && (p.tagEditTarget ?? "All Rows") === "All Rows",
  },
  // Per-row Tag fields (Row-n 選択時に該当行のみ表示)
  ...Array.from({ length: 50 }, (_, i) => tagRowLabelField(i + 1)),
  ...Array.from({ length: 50 }, (_, i) => tagRowContentField(i + 1)),

  // TagGroup col content fields
  {
    key: "tgVariant",
    label: "Variant",
    type: "select",
    options: ["fill", "outline"],
    defaultValue: "fill",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "TagGroup",
  },
  {
    key: "tgSize",
    label: "Size",
    type: "select",
    options: ["small", "medium"],
    defaultValue: "medium",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "TagGroup",
  },
  {
    key: "_dividerTgEdit",
    label: "",
    type: "divider",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "TagGroup",
  },
  ...makeEditTargetFields({
    componentName: "TagGroup",
    colContent: "TagGroup",
    prefix: "tg",
    rowOverrideKeys: (n) => [
      `tgTagLabels${n}`,
      `tgRow${n}Items`,
      ...Array.from({ length: 10 }, (_, ci) => `tgRow${n}TagColor${ci + 1}`),
    ],
  }),
  // All Rows: shared label (全行一括)
  {
    key: "tgTagLabels",
    label: "Tag Label",
    type: "textarea",
    multiValue: true,
    placeholder: "AAA,BBB,CCC",
    indent: true,
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "TagGroup" && (p.tgEditTarget ?? "All Rows") === "All Rows",
  },
  // Per-row labels + items (Row-n 選択時に該当行のみ表示)
  ...Array.from({ length: 50 }, (_, i) => tgRowLabelField(i + 1)),
  {
    key: "tgItems",
    label: "Items",
    type: "stepper",
    min: 1,
    max: 10,
    defaultValue: "3",
    indent: true,
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "TagGroup" && (p.tgEditTarget ?? "All Rows") === "All Rows",
  },
  ...Array.from({ length: 50 }, (_, i) => tgRowItemsField(i + 1)),
  // All Rows: shared colors
  ...Array.from({ length: 10 }, (_, i) => tgTagColorField(i + 1)),
  // Per-row colors (Row-n 選択時に該当行のみ表示)
  ...Array.from({ length: 50 }, (_, ri) =>
    Array.from({ length: 10 }, (_, ci) => tgRowColorField(ri + 1, ci + 1)),
  ).flat(),

  ...makeEditTargetFields({
    componentName: "StatusLabel",
    colContent: "StatusLabel",
    prefix: "sl",
    rowOverrideKeys: (n) => [`slRow${n}Label`, ...SL_CONTENT_SUB_KEYS.map((k) => `slRow${n}Content_${k}`)],
  }),
  {
    key: "statusLabelLabel",
    label: "StatusLabel Label",
    type: "textarea",
    multiValue: true,
    placeholder: "AAA,BBB,CCC",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "StatusLabel" && (p.slEditTarget ?? "All Rows") === "All Rows",
  },
  {
    key: "statusLabelContent",
    label: "StatusLabel Content",
    type: "button",
    subComponent: "StatusLabel",
    onlyTab: "Properties",
    excludedSubKeys: ["size"],
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "StatusLabel" && (p.slEditTarget ?? "All Rows") === "All Rows",
  },
  // Per-row StatusLabel fields (Row-n 選択時に該当行のみ表示)
  ...Array.from({ length: 50 }, (_, i) => slRowLabelField(i + 1)),
  ...Array.from({ length: 50 }, (_, i) => slRowContentField(i + 1)),

  {
    key: "avatarGroupContent",
    label: "AvatarGroup Content",
    type: "button",
    subComponent: "AvatarGroup",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "AvatarGroup",
  },

  // TextField col content fields
  {
    key: "textfieldValue",
    label: "Text",
    type: "textarea",
    multiValue: true,
    placeholder: "AAA,BBB,CCC",
    defaultValue:
      "wasabi lover,ecliptic advocate,entrepreneur,ravioli enthusiast,foodie,photographer,pleasure devotee,activist,commodity fan,artist and activist",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "TextField",
    disabledWhen: (p) => p.textfieldPlaceholder === "true",
  },
  {
    key: "textfieldPlaceholder",
    label: "Placeholder",
    type: "checkbox",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "TextField",
  },
  {
    key: "textfieldPlaceholderText",
    label: "Placeholder Text",
    type: "textfield",
    defaultValue: "This is Placeholder",
    indent: true,
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "TextField",
    disabledWhen: (p) => p.textfieldPlaceholder !== "true",
  },
  {
    key: "textfieldGhost",
    label: "Ghost",
    type: "checkbox",
    defaultValue: "true",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "TextField",
  },

  // Select col content fields
  {
    key: "selectValue",
    label: "Selections",
    type: "textarea",
    multiValue: true,
    placeholder: "AAA,BBB,CCC",
    defaultValue:
      "Vanuatu,Colombia,Uzbekistan,Gibraltar,Angola,Republic of Korea,Armenia,Christmas Island,Bolivia,Greece",
    caption: "Enter the selected value for each row.",
    errorGetter: (p) => {
      const DT_DEFAULT =
        "Vanuatu,Colombia,Uzbekistan,Gibraltar,Angola,Republic of Korea,Armenia,Christmas Island,Bolivia,Greece";
      const opts = (p.selectOptions ?? DT_DEFAULT)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const vals = (p.selectValue ?? DT_DEFAULT)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const missing = vals.find((v) => v && !opts.includes(v));
      return missing ? `"${missing}" is not in Options.` : null;
    },
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "Select",
    disabledWhen: (p) => p.selectPlaceholder === "true",
  },
  {
    key: "selectOptions",
    label: "Options",
    type: "textarea",
    multiValue: true,
    placeholder: "AAA,BBB,CCC",
    defaultValue:
      "Vanuatu,Colombia,Uzbekistan,Gibraltar,Angola,Republic of Korea,Armenia,Christmas Island,Bolivia,Greece",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "Select",
  },
  {
    key: "selectPlaceholder",
    label: "Placeholder",
    type: "checkbox",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "Select",
  },
  {
    key: "selectPlaceholderText",
    label: "Placeholder Text",
    type: "textfield",
    defaultValue: "Select...",
    indent: true,
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "Select",
    disabledWhen: (p) => p.selectPlaceholder !== "true",
  },
  {
    key: "selectGhost",
    label: "Ghost",
    type: "checkbox",
    defaultValue: "true",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "Select",
  },

  // Combobox col content fields
  {
    key: "comboboxValue",
    label: "Selections",
    type: "textarea",
    multiValue: true,
    placeholder: "AAA,BBB,CCC",
    defaultValue: "Sushi,Ramen,Tempura,Udon,Soba,Tonkatsu,Yakitori,Takoyaki,Okonomiyaki,Miso",
    caption: "Enter the selected value for each row.",
    errorGetter: (p) => {
      const DT_DEFAULT = "Sushi,Ramen,Tempura,Udon,Soba,Tonkatsu,Yakitori,Takoyaki,Okonomiyaki,Miso";
      const opts = (p.comboboxOptions ?? DT_DEFAULT)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const vals = (p.comboboxValue ?? DT_DEFAULT)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const missing = vals.find((v) => v && !opts.includes(v));
      return missing ? `"${missing}" is not in Options.` : null;
    },
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "Combobox",
    disabledWhen: (p) => p.comboboxPlaceholder === "true",
  },
  {
    key: "comboboxOptions",
    label: "Options",
    type: "textarea",
    multiValue: true,
    placeholder: "AAA,BBB,CCC",
    defaultValue: "Sushi,Ramen,Tempura,Udon,Soba,Tonkatsu,Yakitori,Takoyaki,Okonomiyaki,Miso",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "Combobox",
  },
  {
    key: "comboboxPlaceholder",
    label: "Placeholder",
    type: "checkbox",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "Combobox",
  },
  {
    key: "comboboxPlaceholderText",
    label: "Placeholder Text",
    type: "textfield",
    defaultValue: "Search...",
    indent: true,
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "Combobox",
    disabledWhen: (p) => p.comboboxPlaceholder !== "true",
  },
  {
    key: "comboboxGhost",
    label: "Ghost",
    type: "checkbox",
    defaultValue: "true",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "Combobox",
  },

  // TagPicker col content fields
  {
    key: "tagPickerOptions",
    label: "Options",
    type: "textarea",
    multiValue: true,
    placeholder: "AAA,BBB,CCC",
    defaultValue: "Tokyo,New York,London,Paris,Berlin,Sydney,Toronto,Dubai,Singapore,Seoul",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "TagPicker",
  },
  {
    key: "tagPickerValue",
    label: "Value",
    type: "textarea",
    multiValue: true,
    placeholder: "AAA,BBB,CCC",
    defaultValue: "Tokyo,New York,London,Paris,Berlin,Sydney,Toronto,Dubai,Singapore,Seoul",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "TagPicker",
    disabledWhen: (p) => p.tagPickerPlaceholder === "true",
  },
  {
    key: "tagPickerPlaceholder",
    label: "Placeholder",
    type: "checkbox",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "TagPicker",
  },
  {
    key: "tagPickerPlaceholderText",
    label: "Placeholder Text",
    type: "textfield",
    defaultValue: "Add tags...",
    indent: true,
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "TagPicker",
    disabledWhen: (p) => p.tagPickerPlaceholder !== "true",
  },
  {
    key: "tagPickerGhost",
    label: "Ghost",
    type: "checkbox",
    defaultValue: "true",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "TagPicker",
  },

  // TagInput col content fields
  {
    key: "tagInputValue",
    label: "Value",
    type: "textarea",
    multiValue: true,
    placeholder: "AAA,BBB,CCC",
    defaultValue:
      "Kertzmann and Sons,O'Reilly - Conn,Pouros Reinger and Kuvalis,Schimmel - Fadel,Effertz - Leannon,Cormier and Sons,Donnelly Inc,Hermiston and Armstrong,Zemlak - Franey,King - Braun",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "TagInput",
    disabledWhen: (p) => p.tagInputPlaceholder === "true",
  },
  {
    key: "tagInputPlaceholder",
    label: "Placeholder",
    type: "checkbox",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "TagInput",
  },
  {
    key: "tagInputPlaceholderText",
    label: "Placeholder Text",
    type: "textfield",
    defaultValue: "Add tags...",
    indent: true,
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "TagInput",
    disabledWhen: (p) => p.tagInputPlaceholder !== "true",
  },
  {
    key: "tagInputGhost",
    label: "Ghost",
    type: "checkbox",
    defaultValue: "true",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "TagInput",
  },

  // DatePicker col content fields
  {
    key: "datePickerValue",
    label: "Value",
    type: "textarea",
    multiValue: true,
    placeholder: "AAA,BBB,CCC",
    defaultValue:
      "2024-01-15,2024-02-20,2024-03-10,2024-04-05,2024-05-22,2024-06-18,2024-07-30,2024-08-12,2024-09-25,2024-10-08",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "DatePicker",
    disabledWhen: (p) => p.datePickerPlaceholder === "true",
  },
  {
    key: "datePickerPlaceholder",
    label: "Placeholder",
    type: "checkbox",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "DatePicker",
  },
  {
    key: "datePickerGhost",
    label: "Ghost",
    type: "checkbox",
    defaultValue: "true",
    colScoped: true,
    tab: "Content",
    visibleWhen: (p) => p.colContent === "DatePicker",
  },
];
