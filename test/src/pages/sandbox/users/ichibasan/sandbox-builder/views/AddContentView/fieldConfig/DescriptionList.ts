import type { FieldConfig } from "./base";

const DL_ITEM_MAX = 20;

const DL_DEFAULT_TERMS =
  "Name,Status,Created At,Updated At,Email,Phone,Company,Department,Location,Role,Description,Category,Type,Owner,Priority,Due Date,Budget,Progress,Rating,Notes";

const DL_DEFAULT_DD: Record<string, string> = {
  Text: "John Doe,Active,2024-01-15,2024-03-20,john@example.com,+1-555-0123,Acme Corp,Engineering,Tokyo,Admin,Product manager,Software,Bug,Alice,High,2024-04-30,$50000,75%,4.5,No issues",
  Link: "View details,See more,Download,Upload,Share,Contact,Settings,Dashboard,Profile,Reports,Documentation,Archive,Create,Assign,Update,Schedule,Budget,Progress,Review,Notes",
  TagGroup:
    "Nicolas Little,Dominick Frami,Rita Thompson,Clifford Becker,Conrad Emard,Edward Mosciski,Donnie McGlynn,Jeannette Stanton,Grace Yost,Pete Walsh",
  StatusLabel:
    "Completed,Active,Pending,Archived,Draft,Active,Completed,Pending,Active,Draft,Completed,Active,Pending,Archived,Draft,Active,Completed,Pending,Active,Draft",
};

// Detail Leading/Trailing is only available for Text / Link dd content
const dlLeadingTrailingAllowed = (p: Record<string, string>) =>
  !["TagGroup", "StatusLabel"].includes(p.ddContent ?? "Text");

// Per-item leading/trailing resolution helpers
const dlItemLeadingOn = (p: Record<string, string>, n: number) =>
  p[`detailLeading${n}`] !== undefined ? p[`detailLeading${n}`] === "true" : p.detailLeading === "true";

const dlItemTrailingOn = (p: Record<string, string>, n: number) =>
  p[`detailTrailing${n}`] !== undefined ? p[`detailTrailing${n}`] === "true" : p.detailTrailing === "true";

const dlItemTrailingType = (p: Record<string, string>, n: number) =>
  p[`detailTrailingType${n}`] ?? p.detailTrailingType ?? "IconButton";

// Per-item override keys
const dlOverrideKeys = (n: number) => [
  `dlTerm${n}`,
  `dlDetail${n}`,
  `detailLeading${n}`,
  `detailLeadingType${n}`,
  `detailTrailing${n}`,
  `detailTrailingType${n}`,
  `trailingText${n}`,
  `trailingIcon${n}`,
  `trailingIconButton${n}`,
  `trailingStatusLabel${n}`,
  `ddTagGroup${n}`,
];

// Per-item fields (Item-N mode)
const dlItemFields = (n: number): FieldConfig[] => [
  {
    key: `dlTerm${n}`,
    label: "Term",
    type: "textfield",
    placeholder: "Name",
    tab: "Content",
    visibleWhen: (p) => (p.dlEditTarget ?? "All Items") === `Item-${n}`,
  },
  {
    key: `dlDetail${n}`,
    label: "Content",
    type: "textfield",
    placeholder: "Value",
    tab: "Content",
    visibleWhen: (p) => (p.dlEditTarget ?? "All Items") === `Item-${n}`,
  },
  // Per-item Detail Leading
  {
    key: `detailLeading${n}`,
    label: "Detail Leading",
    type: "checkbox",
    tab: "Content",
    defaultValueGetter: (p) => p.detailLeading,
    visibleWhen: (p) => p.dlEditTarget === `Item-${n}` && dlLeadingTrailingAllowed(p),
  },
  {
    key: `detailLeadingType${n}`,
    label: "Detail Leading",
    type: "select",
    options: ["Avatar", "Icon"],
    defaultValueGetter: (p) => p.detailLeadingType ?? "Avatar",
    indent: true,
    tab: "Content",
    visibleWhen: (p) => p.dlEditTarget === `Item-${n}` && dlItemLeadingOn(p, n) && dlLeadingTrailingAllowed(p),
  },
  // Per-item Detail Trailing
  {
    key: `detailTrailing${n}`,
    label: "Detail Trailing",
    type: "checkbox",
    tab: "Content",
    defaultValueGetter: (p) => p.detailTrailing,
    visibleWhen: (p) => p.dlEditTarget === `Item-${n}` && dlLeadingTrailingAllowed(p),
  },
  {
    key: `detailTrailingType${n}`,
    label: "Detail Trailing",
    type: "select",
    options: ["Icon", "Text", "IconButton", "Tag", "StatusLabel"],
    defaultValueGetter: (p) => p.detailTrailingType ?? "IconButton",
    indent: true,
    tab: "Content",
    visibleWhen: (p) => p.dlEditTarget === `Item-${n}` && dlItemTrailingOn(p, n) && dlLeadingTrailingAllowed(p),
  },
  {
    key: `trailingText${n}`,
    label: "Detail Trailing Text",
    type: "textfield",
    placeholder: "Label",
    indent: true,
    tab: "Content",
    visibleWhen: (p) =>
      p.dlEditTarget === `Item-${n}` &&
      dlItemTrailingOn(p, n) &&
      dlItemTrailingType(p, n) === "Text" &&
      dlLeadingTrailingAllowed(p),
  },
  {
    key: `trailingIcon${n}`,
    label: "Detail Trailing Icon",
    type: "icon-combobox",
    defaultValue: "LfPlusLarge",
    indent: true,
    tab: "Content",
    visibleWhen: (p) =>
      p.dlEditTarget === `Item-${n}` &&
      dlItemTrailingOn(p, n) &&
      dlItemTrailingType(p, n) === "Icon" &&
      dlLeadingTrailingAllowed(p),
  },
  {
    key: `trailingIconButton${n}`,
    label: "Detail Trailing IconButton",
    type: "icon-combobox",
    defaultValue: "LfQuestionCircle",
    indent: true,
    tab: "Content",
    visibleWhen: (p) =>
      p.dlEditTarget === `Item-${n}` &&
      dlItemTrailingOn(p, n) &&
      dlItemTrailingType(p, n) === "IconButton" &&
      dlLeadingTrailingAllowed(p),
  },
  {
    key: `trailingTag${n}`,
    label: "Detail Trailing Tag",
    type: "button",
    subComponent: "Tag",
    indent: true,
    tab: "Content",
    visibleWhen: (p) =>
      p.dlEditTarget === `Item-${n}` &&
      dlItemTrailingOn(p, n) &&
      dlItemTrailingType(p, n) === "Tag" &&
      dlLeadingTrailingAllowed(p),
  },
  {
    key: `trailingStatusLabel${n}`,
    label: "Detail Trailing StatusLabel",
    type: "button",
    subComponent: "StatusLabel",
    indent: true,
    tab: "Content",
    visibleWhen: (p) =>
      p.dlEditTarget === `Item-${n}` &&
      dlItemTrailingOn(p, n) &&
      dlItemTrailingType(p, n) === "StatusLabel" &&
      dlLeadingTrailingAllowed(p),
  },
  // Per-item TagGroup content
  {
    key: `ddTagGroup${n}`,
    label: "Tag Content",
    type: "button",
    subComponent: "TagGroup",
    tab: "Content",
    visibleWhen: (p) => p.dlEditTarget === `Item-${n}` && (p.ddContent ?? "Text") === "TagGroup",
  },
];

export const DescriptionListConfig: FieldConfig[] = [
  // --- Properties ---
  {
    key: "size",
    label: "Size",
    type: "select",
    options: ["xLarge", "large", "small"],
    defaultValue: "large",
    tab: "Properties",
  },
  { key: "bordered", label: "Bordered", type: "checkbox", tab: "Properties" },
  {
    key: "itemOrientation",
    label: "Item Orientation",
    type: "select",
    options: ["vertical", "horizontal"],
    defaultValue: "vertical",
    tab: "Properties",
  },
  { key: "termTrailing", label: "Term Trailing", type: "checkbox", tab: "Properties" },
  {
    key: "termWidth",
    label: "Term Width",
    type: "checkbox",
    tab: "Properties",
    visibleWhen: (p) => (p.itemOrientation ?? "vertical") === "horizontal",
  },
  {
    key: "termWidthType",
    label: "Term Width",
    type: "select",
    options: ["xxLarge", "xLarge", "large", "medium", "small"],
    defaultValue: "medium",
    indent: true,
    tab: "Properties",
    visibleWhen: (p) => (p.itemOrientation ?? "vertical") === "horizontal" && p.termWidth === "true",
  },

  // --- Content ---
  { key: "items", label: "Items", type: "stepper", min: 1, max: DL_ITEM_MAX, defaultValue: "3", tab: "Content" },

  // Edit DescriptionList Content
  {
    key: "dlEditTarget",
    label: "Edit DescriptionList Content",
    type: "select",
    options: ["All Items"],
    optionsGetter: (p) => {
      const count = Math.min(Math.max(parseInt(p.items ?? "3", 10), 1), DL_ITEM_MAX);
      return [
        "All Items",
        ...Array.from({ length: count }, (_, i) => {
          const n = i + 1;
          const label = `Item-${n}`;
          return dlOverrideKeys(n).some((k) => p[k] !== undefined)
            ? { label, value: label, description: "Edited" }
            : label;
        }),
      ];
    },
    defaultValue: "All Items",
    tab: "Content",
  },

  // Clear Item Override
  {
    key: "_dlClearItemOverride",
    label: "Clear Item Override",
    type: "button",
    tab: "Content",
    visibleWhen: (p) => {
      const target = p.dlEditTarget ?? "All Items";
      if (target === "All Items") return false;
      const n = parseInt(target.replace("Item-", ""), 10);
      return !Number.isNaN(n) && dlOverrideKeys(n).some((k) => p[k] !== undefined);
    },
    onClick: (p) => {
      const n = parseInt((p.dlEditTarget ?? "").replace("Item-", ""), 10);
      if (!n) return {};
      const result: Record<string, string | undefined> = {};
      for (const k of dlOverrideKeys(n)) {
        result[k] = undefined;
      }
      return result;
    },
  },

  // Reset Item Overrides
  {
    key: "_dlResetItemOverrides",
    label: "Reset Item Overrides",
    type: "button",
    tab: "Content",
    visibleWhen: (p) => {
      if ((p.dlEditTarget ?? "All Items") !== "All Items") return false;
      for (let n = 1; n <= DL_ITEM_MAX; n++) {
        if (dlOverrideKeys(n).some((k) => p[k] !== undefined)) return true;
      }
      return false;
    },
    onClick: (_p) => {
      const result: Record<string, string | undefined> = {};
      for (let n = 1; n <= DL_ITEM_MAX; n++) {
        for (const k of dlOverrideKeys(n)) {
          result[k] = undefined;
        }
      }
      return result;
    },
  },

  {
    key: "ddContent",
    label: "dd Content",
    type: "select",
    options: ["Text", "Link", "TagGroup", "StatusLabel"],
    defaultValue: "Text",
    tab: "Content",
  },
  {
    key: "ddTagGroup",
    label: "Tag Content",
    type: "button",
    subComponent: "TagGroup",
    tab: "Content",
    visibleWhen: (p) => (p.dlEditTarget ?? "All Items") === "All Items" && (p.ddContent ?? "Text") === "TagGroup",
  },

  // All Items: Term labels
  {
    key: "dtLabels",
    label: "Term",
    type: "textarea",
    multiValue: true,
    placeholder: "Name,Status,...",
    defaultValueGetter: (p) => {
      const count = Math.min(Math.max(parseInt(p.items ?? "3", 10), 1), DL_ITEM_MAX);
      return DL_DEFAULT_TERMS.split(",").slice(0, count).join(",");
    },
    tab: "Content",
    visibleWhen: (p) => (p.dlEditTarget ?? "All Items") === "All Items",
  },

  // All Items: Detail content
  {
    key: "ddLabels",
    label: "Content",
    type: "textarea",
    multiValue: true,
    placeholder: "John Doe,Active,...",
    defaultValueGetter: (p) => {
      const count = Math.min(Math.max(parseInt(p.items ?? "3", 10), 1), DL_ITEM_MAX);
      const base = DL_DEFAULT_DD[p.ddContent ?? "Text"] ?? DL_DEFAULT_DD.Text;
      return base.split(",").slice(0, count).join(",");
    },
    tab: "Content",
    visibleWhen: (p) => (p.dlEditTarget ?? "All Items") === "All Items",
  },

  // Detail Leading / Trailing (Content タブ最下部、All Items モードのみ / Item-N は per-item フィールドで対応)
  {
    key: "detailLeading",
    label: "Detail Leading",
    type: "checkbox",
    tab: "Content",
    visibleWhen: (p) => (p.dlEditTarget ?? "All Items") === "All Items" && dlLeadingTrailingAllowed(p),
  },
  {
    key: "detailLeadingType",
    label: "Detail Leading",
    type: "select",
    options: ["Avatar", "Icon"],
    defaultValue: "Avatar",
    indent: true,
    tab: "Content",
    visibleWhen: (p) =>
      (p.dlEditTarget ?? "All Items") === "All Items" && p.detailLeading === "true" && dlLeadingTrailingAllowed(p),
  },
  {
    key: "detailTrailing",
    label: "Detail Trailing",
    type: "checkbox",
    tab: "Content",
    visibleWhen: (p) => (p.dlEditTarget ?? "All Items") === "All Items" && dlLeadingTrailingAllowed(p),
  },
  {
    key: "detailTrailingType",
    label: "Detail Trailing",
    type: "select",
    options: ["Icon", "Text", "IconButton", "Tag", "StatusLabel"],
    defaultValue: "IconButton",
    indent: true,
    tab: "Content",
    visibleWhen: (p) =>
      (p.dlEditTarget ?? "All Items") === "All Items" && p.detailTrailing === "true" && dlLeadingTrailingAllowed(p),
  },
  {
    key: "trailingText",
    label: "Detail Trailing Text",
    type: "textarea",
    multiValue: true,
    placeholder: "Label",
    defaultValueGetter: (p) => {
      const count = Math.min(Math.max(parseInt(p.items ?? "3", 10), 1), DL_ITEM_MAX);
      return Array.from({ length: count }, () => "Label").join(",");
    },
    indent: true,
    tab: "Content",
    visibleWhen: (p) =>
      (p.dlEditTarget ?? "All Items") === "All Items" &&
      p.detailTrailing === "true" &&
      (p.detailTrailingType ?? "IconButton") === "Text" &&
      dlLeadingTrailingAllowed(p),
  },
  {
    key: "trailingIcon",
    label: "Detail Trailing Icon",
    type: "icon-combobox",
    defaultValue: "LfPlusLarge",
    indent: true,
    tab: "Content",
    visibleWhen: (p) =>
      (p.dlEditTarget ?? "All Items") === "All Items" &&
      p.detailTrailing === "true" &&
      (p.detailTrailingType ?? "IconButton") === "Icon" &&
      dlLeadingTrailingAllowed(p),
  },
  {
    key: "trailingIconButton",
    label: "Detail Trailing IconButton",
    type: "icon-combobox",
    defaultValue: "LfQuestionCircle",
    indent: true,
    tab: "Content",
    visibleWhen: (p) =>
      (p.dlEditTarget ?? "All Items") === "All Items" &&
      p.detailTrailing === "true" &&
      (p.detailTrailingType ?? "IconButton") === "IconButton" &&
      dlLeadingTrailingAllowed(p),
  },
  {
    key: "trailingTag",
    label: "Detail Trailing Tag",
    type: "button",
    subComponent: "Tag",
    indent: true,
    tab: "Content",
    visibleWhen: (p) =>
      (p.dlEditTarget ?? "All Items") === "All Items" &&
      p.detailTrailing === "true" &&
      (p.detailTrailingType ?? "IconButton") === "Tag" &&
      dlLeadingTrailingAllowed(p),
  },
  {
    key: "trailingStatusLabel",
    label: "Detail Trailing StatusLabel",
    type: "button",
    subComponent: "StatusLabel",
    indent: true,
    tab: "Content",
    visibleWhen: (p) =>
      (p.dlEditTarget ?? "All Items") === "All Items" &&
      p.detailTrailing === "true" &&
      (p.detailTrailingType ?? "IconButton") === "StatusLabel" &&
      dlLeadingTrailingAllowed(p),
  },

  // Per-item overrides (Item-N mode)
  ...Array.from({ length: DL_ITEM_MAX }, (_, i) => dlItemFields(i + 1)).flat(),
];
