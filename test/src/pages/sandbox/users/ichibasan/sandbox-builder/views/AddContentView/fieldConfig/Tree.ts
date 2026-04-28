import type { FieldConfig } from "./base";

export const TREE_LABEL_DEFAULT = `Tree Item A,
  Tree Item A-1,
  Tree Item A-2,
    Tree Item A-2_a,
    Tree Item A-2_b,

Tree Item B,
  Tree Item B-1,
  Tree Item B-2,
    Tree Item B-2_a,
    Tree Item B-2_b,

Tree Item C,
  Tree Item C-1,
  Tree Item C-2,
    Tree Item C-2_a,
    Tree Item C-2_b,`;

export const TreeConfig: FieldConfig[] = [
  // Properties
  { key: "children", label: "Children", type: "checkbox", tab: "Properties" },
  { key: "selection", label: "Selection", type: "checkbox", tab: "Properties" },
  {
    key: "selectionType",
    label: "Selection Type",
    type: "select",
    options: ["Single", "Multiple"],
    defaultValue: "Multiple",
    indent: true,
    tab: "Properties",
    visibleWhen: (p) => p.selection === "true",
  },
  {
    key: "propagateSelection",
    label: "Propagate Selection",
    type: "checkbox",
    indent: true,
    visibleWhen: (p) => p.selection === "true" && (p.selectionType ?? "Multiple") === "Multiple",
    tab: "Properties",
  },
  { key: "reorderable", label: "Reorderable", type: "checkbox", tab: "Properties" },

  // Content
  {
    key: "label",
    label: "Label",
    type: "textarea",
    multiValue: true,
    placeholder: "AAA,BBB,CCC",
    defaultValue: TREE_LABEL_DEFAULT,
    tab: "Content",
  },
];
