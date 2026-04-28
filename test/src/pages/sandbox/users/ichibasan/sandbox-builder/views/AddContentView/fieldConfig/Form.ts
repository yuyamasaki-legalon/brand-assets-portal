import type { FieldConfig } from "./base";

const INPUT_TYPE_OPTIONS = [
  "Select",
  "Combobox",
  "DateField",
  "DatePicker",
  "RangeDatePicker",
  "Search",
  "TagInput",
  "TagPicker",
  "TextArea",
  "TextField",
  "TimeField",
  "TimePicker",
  "CheckboxGroup",
  "RadioGroup",
];

const INPUT_TYPE_TO_COMPONENT: Record<string, string> = {
  Select: "Select",
  Combobox: "Combobox",
  DateField: "DateField",
  DatePicker: "DatePicker",
  RangeDatePicker: "RangeDatePicker",
  ReadOnly: "TextField",
  Search: "Search",
  TagInput: "TagInput",
  TagPicker: "TagPicker",
  TextArea: "Textarea",
  TextField: "TextField",
  TimeField: "TimeField",
  TimePicker: "TimePicker",
  CheckboxGroup: "CheckboxGroup",
  RadioGroup: "RadioGroup",
};

const MAX_NESTED = 10;

function makeItemFields(n: number): FieldConfig[] {
  const nestedSubFields: FieldConfig[] = [];
  for (let m = 1; m <= MAX_NESTED; m++) {
    nestedSubFields.push(
      {
        key: `nestedInputType${n}_${m}`,
        label: "Input Type",
        type: "select",
        options: INPUT_TYPE_OPTIONS,
        defaultValue: "Select",
        indent: true,
        visibleWhen: (p) =>
          parseInt(p.items ?? "3", 10) >= n &&
          (p[`item${n}FormLayout`] ?? "default") === "nested" &&
          parseInt(p[`nestedItems${n}`] ?? "3", 10) >= m,
        tab: "Properties",
      },
      {
        key: `nestedItemEdit${n}_${m}`,
        label: `Item-${n}-${m}`,
        type: "button",
        subComponentGetter: (p) => INPUT_TYPE_TO_COMPONENT[p[`nestedInputType${n}_${m}`] ?? "Select"],
        labelWhen: (p) =>
          `Item-${n}-${m} ${INPUT_TYPE_TO_COMPONENT[p[`nestedInputType${n}_${m}`] ?? "Select"] ?? "Select"}`,
        excludedSubKeys: ["variant", "withinFormControl", "fcTitle", "orientation"],
        visibleWhen: (p) =>
          parseInt(p.items ?? "3", 10) >= n &&
          (p[`item${n}FormLayout`] ?? "default") === "nested" &&
          parseInt(p[`nestedItems${n}`] ?? "3", 10) >= m,
        tab: "Content",
      },
    );
  }

  return [
    {
      key: `_itemSep${n}`,
      label: "",
      type: "divider" as const,
      visibleWhen: (p) => parseInt(p.items ?? "3", 10) >= n,
      tab: "Properties" as const,
    },
    {
      key: `item${n}FormLayout`,
      label: `Item-${n}`,
      type: "select",
      options: ["default", "with group", "nested"],
      defaultValue: "default",
      visibleWhen: (p) => parseInt(p.items ?? "3", 10) >= n && (p.fcOrientation ?? "Vertical") !== "Horizontal",
      tab: "Properties",
    },
    // nested: Items stepper (Item-N の直下)
    {
      key: `nestedItems${n}`,
      label: "Items",
      type: "stepper",
      min: 1,
      max: MAX_NESTED,
      defaultValue: "3",
      indent: true,
      visibleWhen: (p) => parseInt(p.items ?? "3", 10) >= n && (p[`item${n}FormLayout`] ?? "default") === "nested",
      tab: "Properties",
    },
    {
      key: `inputType${n}`,
      label: "Input Type",
      type: "select",
      options: INPUT_TYPE_OPTIONS,
      defaultValue: "Select",
      indent: true,
      visibleWhen: (p) => parseInt(p.items ?? "3", 10) >= n && (p.fcOrientation ?? "Vertical") !== "Horizontal",
      tab: "Properties",
    },
    {
      key: `itemEdit${n}`,
      label: `Item-${n}`,
      type: "button",
      subComponentGetter: (p) => INPUT_TYPE_TO_COMPONENT[p[`inputType${n}`] ?? "Select"],
      labelWhen: (p) => `Item-${n} ${INPUT_TYPE_TO_COMPONENT[p[`inputType${n}`] ?? "Select"] ?? "Select"}`,
      excludedSubKeys: ["variant", "withinFormControl", "fcTitle", "orientation"],
      visibleWhen: (p) =>
        parseInt(p.items ?? "3", 10) >= n &&
        (p.fcOrientation ?? "Vertical") !== "Horizontal" &&
        (p[`item${n}FormLayout`] ?? "default") !== "nested",
      tab: "Content",
    },
    // with group: 2つ目の FC
    {
      key: `inputType${n}_2`,
      label: "Input Type",
      type: "select",
      options: INPUT_TYPE_OPTIONS,
      defaultValue: "Select",
      indent: true,
      visibleWhen: (p) => parseInt(p.items ?? "3", 10) >= n && (p[`item${n}FormLayout`] ?? "default") === "with group",
      tab: "Properties",
    },
    {
      key: `itemEdit${n}_2`,
      label: `Item-${n}-2`,
      type: "button",
      subComponentGetter: (p) => INPUT_TYPE_TO_COMPONENT[p[`inputType${n}_2`] ?? "Select"],
      labelWhen: (p) => `Item-${n}-2 ${INPUT_TYPE_TO_COMPONENT[p[`inputType${n}_2`] ?? "Select"] ?? "Select"}`,
      excludedSubKeys: ["variant", "withinFormControl", "fcTitle", "orientation"],
      visibleWhen: (p) => parseInt(p.items ?? "3", 10) >= n && (p[`item${n}FormLayout`] ?? "default") === "with group",
      tab: "Content",
    },
    // nested: per-sub-item fields
    ...nestedSubFields,
  ];
}

export const FormConfig: FieldConfig[] = [
  { key: "items", label: "Items", type: "stepper", min: 1, max: 20, defaultValue: "3", tab: "Properties" },
  { key: "_formSep", label: "", type: "divider", tab: "Properties" },
  {
    key: "fcOrientation",
    label: "Orientation",
    type: "select",
    options: ["Vertical", "Horizontal"],
    defaultValue: "Vertical",
    tab: "Properties",
  },
  {
    key: "labelWidth",
    label: "Label Width",
    type: "select",
    options: ["Off", "xSmall", "small", "medium", "auto"],
    defaultValue: "Off",
    indent: true,
    visibleWhen: (p) => (p.fcOrientation ?? "Vertical") === "Horizontal",
    tab: "Properties",
  },
  ...Array.from({ length: 20 }, (_, i) => makeItemFields(i + 1)).flat(),
];
