import type { FieldConfig } from "./base";

export const NavListConfig: FieldConfig[] = [
  // Properties
  {
    key: "size",
    label: "Size",
    type: "select",
    options: ["large", "medium", "small"],
    defaultValue: "medium",
    tab: "Properties",
  },
  { key: "withGroup", label: "With Group", type: "checkbox", tab: "Properties" },
  {
    key: "groups",
    label: "Groups",
    type: "stepper",
    min: 2,
    max: 5,
    defaultValue: "2",
    indent: true,
    visibleWhen: (p) => p.withGroup === "true",
    tab: "Properties",
  },
  {
    key: "withGroupTitle",
    label: "With Group Title",
    type: "checkbox",
    indent: true,
    visibleWhen: (p) => p.withGroup === "true",
    tab: "Properties",
  },
  {
    key: "_nlGroupItems",
    label: "",
    type: "navlist-group-items-editor",
    visibleWhen: (p) => p.withGroup === "true",
    tab: "Properties",
  },

  // Content
  {
    key: "titles",
    label: "Title",
    type: "textarea",
    multiValue: true,
    placeholder: "AAA,BBB,CCC",
    defaultValue: "Group A,Group B",
    visibleWhen: (p) => p.withGroup === "true" && p.withGroupTitle === "true",
    tab: "Content",
  },
  {
    key: "itemTexts",
    label: "Item Text",
    type: "textarea",
    multiValue: true,
    placeholder: "AAA,BBB,CCC",
    defaultValue: "Dashboard,Settings,Reports",
    tab: "Content",
  },
];
