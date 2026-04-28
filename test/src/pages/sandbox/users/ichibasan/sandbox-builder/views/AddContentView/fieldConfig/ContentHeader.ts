import type { FieldConfig } from "./base";

export const ContentHeaderConfig: FieldConfig[] = [
  // --- Properties ---
  {
    key: "size",
    label: "Size",
    type: "select",
    options: ["xLarge", "large", "medium", "small", "xSmall"],
    defaultValue: "xLarge",
    tab: "Properties",
  },
  { key: "descriptionTop", label: "Description-top", type: "checkbox", tab: "Properties" },
  { key: "descriptionBottom", label: "Description-bottom", type: "checkbox", tab: "Properties" },
  { key: "leading", label: "Leading", type: "checkbox", tab: "Properties" },
  { key: "trailing", label: "Trailing", type: "checkbox", tab: "Properties" },
  { key: "action", label: "Action", type: "checkbox", tab: "Properties" },

  // --- Content ---
  {
    key: "descriptionTopText",
    label: "Description-top Label",
    type: "textfield",
    defaultValue: "Description",
    tab: "Content",
    visibleWhen: (p) => p.descriptionTop === "true",
  },
  { key: "titleText", label: "Title Label", type: "textfield", defaultValue: "Page Title", tab: "Content" },
  {
    key: "descriptionBottomText",
    label: "Description-bottom Label",
    type: "textfield",
    defaultValue: "Description",
    tab: "Content",
    visibleWhen: (p) => p.descriptionBottom === "true",
  },
  {
    key: "trailingContent",
    label: "Trailing Content",
    type: "select",
    options: ["ButtonGroup", "Button", "IconButton"],
    defaultValue: "ButtonGroup",
    tab: "Content",
    visibleWhen: (p) => p.trailing === "true",
  },
  // ButtonGroup インライン設定 (Trailing Content = ButtonGroup のとき)
  {
    key: "trailingButtonGroup_size",
    label: "Size",
    type: "select",
    options: ["large", "medium", "small", "xSmall"],
    defaultValue: "medium",
    indent: true,
    tab: "Content",
    visibleWhen: (p) => p.trailing === "true" && (p.trailingContent ?? "ButtonGroup") === "ButtonGroup",
  },
  {
    key: "trailingButtonGroup_attached",
    label: "Attached",
    type: "checkbox",
    indent: true,
    tab: "Content",
    visibleWhen: (p) => p.trailing === "true" && (p.trailingContent ?? "ButtonGroup") === "ButtonGroup",
  },
  {
    key: "trailingButtonGroup_btnItems",
    label: "Button Items",
    type: "stepper",
    min: 0,
    max: 5,
    defaultValue: "3",
    indent: true,
    tab: "Content",
    visibleWhen: (p) => p.trailing === "true" && (p.trailingContent ?? "ButtonGroup") === "ButtonGroup",
    minGetter: (p) => Math.max(0, 2 - parseInt(p.trailingButtonGroup_iconItems ?? "1", 10)),
  },
  {
    key: "trailingButtonGroup_btn1",
    label: "Item-1",
    type: "button",
    subComponent: "Button",
    excludedSubKeys: ["size"],
    indent: true,
    tab: "Content",
    visibleWhen: (p) =>
      p.trailing === "true" &&
      (p.trailingContent ?? "ButtonGroup") === "ButtonGroup" &&
      parseInt(p.trailingButtonGroup_btnItems ?? "3", 10) >= 1,
  },
  {
    key: "trailingButtonGroup_btn2",
    label: "Item-2",
    type: "button",
    subComponent: "Button",
    excludedSubKeys: ["size"],
    indent: true,
    tab: "Content",
    visibleWhen: (p) =>
      p.trailing === "true" &&
      (p.trailingContent ?? "ButtonGroup") === "ButtonGroup" &&
      parseInt(p.trailingButtonGroup_btnItems ?? "3", 10) >= 2,
  },
  {
    key: "trailingButtonGroup_btn3",
    label: "Item-3",
    type: "button",
    subComponent: "Button",
    excludedSubKeys: ["size"],
    indent: true,
    tab: "Content",
    visibleWhen: (p) =>
      p.trailing === "true" &&
      (p.trailingContent ?? "ButtonGroup") === "ButtonGroup" &&
      parseInt(p.trailingButtonGroup_btnItems ?? "3", 10) >= 3,
  },
  {
    key: "trailingButtonGroup_btn4",
    label: "Item-4",
    type: "button",
    subComponent: "Button",
    excludedSubKeys: ["size"],
    indent: true,
    tab: "Content",
    visibleWhen: (p) =>
      p.trailing === "true" &&
      (p.trailingContent ?? "ButtonGroup") === "ButtonGroup" &&
      parseInt(p.trailingButtonGroup_btnItems ?? "3", 10) >= 4,
  },
  {
    key: "trailingButtonGroup_btn5",
    label: "Item-5",
    type: "button",
    subComponent: "Button",
    excludedSubKeys: ["size"],
    indent: true,
    tab: "Content",
    visibleWhen: (p) =>
      p.trailing === "true" &&
      (p.trailingContent ?? "ButtonGroup") === "ButtonGroup" &&
      parseInt(p.trailingButtonGroup_btnItems ?? "3", 10) >= 5,
  },
  {
    key: "trailingButtonGroup_iconItems",
    label: "IconButton Items",
    type: "stepper",
    min: 0,
    max: 5,
    defaultValue: "1",
    indent: true,
    tab: "Content",
    visibleWhen: (p) => p.trailing === "true" && (p.trailingContent ?? "ButtonGroup") === "ButtonGroup",
    minGetter: (p) => Math.max(0, 2 - parseInt(p.trailingButtonGroup_btnItems ?? "3", 10)),
  },
  {
    key: "trailingButtonGroup_icon1",
    label: "Item-1",
    type: "button",
    subComponent: "IconButton",
    excludedSubKeys: ["size"],
    indent: true,
    tab: "Content",
    visibleWhen: (p) =>
      p.trailing === "true" &&
      (p.trailingContent ?? "ButtonGroup") === "ButtonGroup" &&
      parseInt(p.trailingButtonGroup_iconItems ?? "1", 10) >= 1,
  },
  {
    key: "trailingButtonGroup_icon2",
    label: "Item-2",
    type: "button",
    subComponent: "IconButton",
    excludedSubKeys: ["size"],
    indent: true,
    tab: "Content",
    visibleWhen: (p) =>
      p.trailing === "true" &&
      (p.trailingContent ?? "ButtonGroup") === "ButtonGroup" &&
      parseInt(p.trailingButtonGroup_iconItems ?? "1", 10) >= 2,
  },
  {
    key: "trailingButtonGroup_icon3",
    label: "Item-3",
    type: "button",
    subComponent: "IconButton",
    excludedSubKeys: ["size"],
    indent: true,
    tab: "Content",
    visibleWhen: (p) =>
      p.trailing === "true" &&
      (p.trailingContent ?? "ButtonGroup") === "ButtonGroup" &&
      parseInt(p.trailingButtonGroup_iconItems ?? "1", 10) >= 3,
  },
  {
    key: "trailingButtonGroup_icon4",
    label: "Item-4",
    type: "button",
    subComponent: "IconButton",
    excludedSubKeys: ["size"],
    indent: true,
    tab: "Content",
    visibleWhen: (p) =>
      p.trailing === "true" &&
      (p.trailingContent ?? "ButtonGroup") === "ButtonGroup" &&
      parseInt(p.trailingButtonGroup_iconItems ?? "1", 10) >= 4,
  },
  {
    key: "trailingButtonGroup_icon5",
    label: "Item-5",
    type: "button",
    subComponent: "IconButton",
    excludedSubKeys: ["size"],
    indent: true,
    tab: "Content",
    visibleWhen: (p) =>
      p.trailing === "true" &&
      (p.trailingContent ?? "ButtonGroup") === "ButtonGroup" &&
      parseInt(p.trailingButtonGroup_iconItems ?? "1", 10) >= 5,
  },

  {
    key: "trailingButton",
    label: "Button Content",
    type: "button",
    subComponent: "Button",
    indent: true,
    tab: "Content",
    visibleWhen: (p) => p.trailing === "true" && p.trailingContent === "Button",
  },
  {
    key: "trailingIconButton",
    label: "IconButton Content",
    type: "button",
    subComponent: "IconButton",
    indent: true,
    tab: "Content",
    visibleWhen: (p) => p.trailing === "true" && p.trailingContent === "IconButton",
  },
];
