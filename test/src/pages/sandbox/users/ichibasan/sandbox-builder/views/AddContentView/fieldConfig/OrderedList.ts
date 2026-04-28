import type { FieldConfig } from "./base";

export const OrderedListConfig: FieldConfig[] = [
  // --- Content ---

  // Level 1 (always visible)
  { key: "items", label: "Text", type: "textarea", multiValue: true, defaultValue: "AAA,BBB,CCC", tab: "Content" },

  // Level 2
  {
    key: "items1",
    label: "Text",
    type: "textarea",
    multiValue: true,
    defaultValue: "AAA,BBB,CCC",
    indent: true,
    tab: "Content",
    visibleWhen: (p) => p.depth1 === "true",
  },
  {
    key: "_rm1",
    label: "remove list",
    type: "button",
    indent: true,
    tab: "Content",
    visibleWhen: (p) => p.depth1 === "true",
    onClick: () => ({
      depth1: undefined,
      items1: undefined,
      depth2: undefined,
      items2: undefined,
      depth3: undefined,
      items3: undefined,
      depth4: undefined,
      items4: undefined,
    }),
  },
  { key: "_div1", label: "", type: "divider", tab: "Content", visibleWhen: (p) => p.depth1 === "true" },

  // Level 3
  {
    key: "items2",
    label: "Text",
    type: "textarea",
    multiValue: true,
    defaultValue: "AAA,BBB,CCC",
    indent: true,
    tab: "Content",
    visibleWhen: (p) => p.depth2 === "true",
  },
  {
    key: "_rm2",
    label: "remove list",
    type: "button",
    indent: true,
    tab: "Content",
    visibleWhen: (p) => p.depth2 === "true",
    onClick: () => ({
      depth2: undefined,
      items2: undefined,
      depth3: undefined,
      items3: undefined,
      depth4: undefined,
      items4: undefined,
    }),
  },
  { key: "_div2", label: "", type: "divider", tab: "Content", visibleWhen: (p) => p.depth2 === "true" },

  // Level 4
  {
    key: "items3",
    label: "Text",
    type: "textarea",
    multiValue: true,
    defaultValue: "AAA,BBB,CCC",
    indent: true,
    tab: "Content",
    visibleWhen: (p) => p.depth3 === "true",
  },
  {
    key: "_rm3",
    label: "remove list",
    type: "button",
    indent: true,
    tab: "Content",
    visibleWhen: (p) => p.depth3 === "true",
    onClick: () => ({ depth3: undefined, items3: undefined, depth4: undefined, items4: undefined }),
  },
  { key: "_div3", label: "", type: "divider", tab: "Content", visibleWhen: (p) => p.depth3 === "true" },

  // Level 5
  {
    key: "items4",
    label: "Text",
    type: "textarea",
    multiValue: true,
    defaultValue: "AAA,BBB,CCC",
    indent: true,
    tab: "Content",
    visibleWhen: (p) => p.depth4 === "true",
  },
  {
    key: "_rm4",
    label: "remove list",
    type: "button",
    indent: true,
    tab: "Content",
    visibleWhen: (p) => p.depth4 === "true",
    onClick: () => ({ depth4: undefined, items4: undefined }),
  },
  { key: "_div4", label: "", type: "divider", tab: "Content", visibleWhen: (p) => p.depth4 === "true" },

  // [add list] — always at the bottom, adds the next depth
  {
    key: "_add",
    label: "add list",
    type: "button",
    tab: "Content",
    visibleWhen: (p) => p.depth4 !== "true",
    onClick: (p) => {
      if (p.depth1 !== "true") return { depth1: "true" };
      if (p.depth2 !== "true") return { depth2: "true" };
      if (p.depth3 !== "true") return { depth3: "true" };
      return { depth4: "true" };
    },
  },
];
