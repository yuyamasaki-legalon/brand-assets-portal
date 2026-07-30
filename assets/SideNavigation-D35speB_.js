var e=`import type { FieldConfig } from "./base";

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
    label: "Items (per group)",
    type: "textarea",
    multiValue: true,
    placeholder: "Item A,Item B|Item C,Item D",
    defaultValue: "Item A,Item B|Item C,Item D",
    visibleWhen: (p) => p.withGroupTitle === "true",
    tab: "Content",
  },
  {
    key: "labels",
    label: "Group Names",
    type: "textarea",
    multiValue: true,
    placeholder: "Group 1,Group 2",
    defaultValue: "Group 1,Group 2",
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
`;export{e as default};