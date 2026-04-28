import type { FieldConfig } from "./base";

export const SideNavigationConfig: FieldConfig[] = [
  // Properties
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
    key: "_snGroupItems",
    label: "",
    type: "sidenavigation-group-items-editor",
    visibleWhen: (p) => p.withGroup === "true",
    tab: "Properties",
  },
  { key: "withGroupTitle", label: "With Group Title", type: "checkbox", tab: "Properties" },
  { key: "withinPageLayout", label: "Within Page Layout", type: "checkbox", tab: "Properties" },

  // Content
  {
    key: "titles",
    label: "Title",
    type: "textarea",
    multiValue: true,
    placeholder: "AAA,BBB,CCC",
    defaultValue: "Group A,Group B",
    visibleWhen: (p) => p.withGroupTitle === "true",
    tab: "Content",
  },
  {
    key: "labels",
    label: "Label",
    type: "textarea",
    multiValue: true,
    placeholder: "AAA,BBB,CCC",
    defaultValue: "Dashboard,Settings,Reports",
    visibleWhen: (p) => p.withGroup !== "true",
    tab: "Content",
  },
  {
    key: "_snGroupContent",
    label: "",
    type: "sidenavigation-group-content-editor",
    visibleWhen: (p) => p.withGroup === "true",
    tab: "Content",
  },
];
