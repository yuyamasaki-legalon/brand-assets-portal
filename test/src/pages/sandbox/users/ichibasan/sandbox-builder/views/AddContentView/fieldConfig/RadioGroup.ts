import type { FieldConfig } from "./base";

const CARD_MAX = 10;
const LABEL_MAX = 5;

const LABEL_TYPES = ["label", "body", "caption", "data"];

// Label-N: N 行目テキスト（All Rows: textarea 全一括 / Row-X: textfield 個別）
const cardLabelFields = (n: number): FieldConfig[] => {
  const allRows: FieldConfig = {
    key: `cardLabel${n}`,
    label: n === 1 ? "Label" : `Label-${n}`,
    type: "textarea",
    multiValue: true,
    placeholder: "Card A,Card B,Card C",
    defaultValue: `Label ${n},Label ${n},Label ${n}`,
    tab: "Content",
    visibleWhen: (p) =>
      p.withRadioCard === "true" &&
      parseInt(p.labelItems ?? "1", 10) >= n &&
      (p.editTarget ?? "All Items") === "All Items",
  };
  const perRow: FieldConfig[] = Array.from(
    { length: CARD_MAX },
    (_, m): FieldConfig => ({
      key: `cardLabel${n}_row${m + 1}`,
      label: n === 1 ? "Label" : `Label-${n}`,
      type: "textfield",
      placeholder: `Label ${n}`,
      defaultValue: `Label ${n}`,
      tab: "Content",
      visibleWhen: (p) =>
        p.withRadioCard === "true" && parseInt(p.labelItems ?? "1", 10) >= n && p.editTarget === `Item-${m + 1}`,
    }),
  );
  return [allRows, ...perRow];
};

// Divider: グループ間の区切り線
const cardDividerField = (n: number): FieldConfig => ({
  key: `_divider${n}`,
  label: "",
  type: "divider",
  tab: "Content",
  visibleWhen:
    n === 1
      ? (p) => p.withRadioCard === "true"
      : (p) => p.withRadioCard === "true" && parseInt(p.labelItems ?? "1", 10) >= n,
});

// FontStyle-N: N 行目のタイポグラフィ設定
const cardFontStyleField = (n: number): FieldConfig => ({
  key: `cardLabelStyle${n}`,
  label: "FontStyle",
  type: "typography-select",
  subComponent: "Text",
  allowedTextTypes: LABEL_TYPES,
  tab: "Content",
  visibleWhen: (p) =>
    p.withRadioCard === "true" &&
    parseInt(p.labelItems ?? "1", 10) >= n &&
    (p.editTarget ?? "All Items") === "All Items",
});

// Edit Radio Content: 編集対象を選択
const editTargetField: FieldConfig = {
  key: "editTarget",
  label: "Edit Radio Content",
  type: "select",
  defaultValue: "All Items",
  tab: "Content",
  visibleWhen: (p) => p.withRadioCard === "true",
  optionsGetter: (p) => {
    const count = Math.min(Math.max(parseInt(p.items ?? "3", 10), 2), CARD_MAX);
    return ["All Items", ...Array.from({ length: count }, (_, i) => `Item-${i + 1}`)];
  },
};

// アイテム上書き判定ヘルパー
const hasItemOverride = (p: Record<string, string>, m: number): boolean => {
  for (let n = 1; n <= LABEL_MAX; n++) {
    if (p[`cardLabel${n}_row${m}`] !== undefined) return true;
  }
  return false;
};

// Reset Item Overrides: 全アイテムの上書きを一括クリア（All Items モード時）
const resetItemOverridesField: FieldConfig = {
  key: "_resetItemOverrides",
  label: "Reset Item Overrides",
  type: "button",
  tab: "Content",
  visibleWhen: (p) => {
    if (p.withRadioCard !== "true" || (p.editTarget ?? "All Items") !== "All Items") return false;
    for (let m = 1; m <= CARD_MAX; m++) {
      if (hasItemOverride(p, m)) return true;
    }
    return false;
  },
  onClick: (_p) => {
    const result: Record<string, string | undefined> = {};
    for (let m = 1; m <= CARD_MAX; m++) {
      for (let n = 1; n <= LABEL_MAX; n++) {
        result[`cardLabel${n}_row${m}`] = undefined;
      }
    }
    return result;
  },
};

// Clear Item Override: 選択中アイテムの上書きをクリア（Item-N モード時）
const clearItemOverrideField: FieldConfig = {
  key: "_clearItemOverride",
  label: "Clear Item Override",
  type: "button",
  tab: "Content",
  visibleWhen: (p) => {
    const target = p.editTarget ?? "All Items";
    if (p.withRadioCard !== "true" || target === "All Items") return false;
    const m = parseInt(target.replace("Item-", ""), 10);
    return !Number.isNaN(m) && hasItemOverride(p, m);
  },
  onClick: (p) => {
    const m = parseInt((p.editTarget ?? "").replace("Item-", ""), 10);
    if (!m) return {};
    const result: Record<string, string | undefined> = {};
    for (let n = 1; n <= LABEL_MAX; n++) {
      result[`cardLabel${n}_row${m}`] = undefined;
    }
    return result;
  },
};

export const RadioGroupConfig: FieldConfig[] = [
  // --- Properties ---
  { key: "withRadioCard", label: "With Radio Card", type: "checkbox", tab: "Properties" },
  // Normal モード: medium / small
  {
    key: "size",
    label: "Size",
    type: "select",
    options: ["medium", "small"],
    defaultValue: "medium",
    tab: "Properties",
    visibleWhen: (p) => p.withRadioCard !== "true",
  },
  // Card モード: large / medium / small
  {
    key: "sizeCard",
    label: "Size",
    type: "select",
    options: ["large", "medium", "small"],
    defaultValue: "medium",
    tab: "Properties",
    visibleWhen: (p) => p.withRadioCard === "true",
  },
  {
    key: "orientation",
    label: "Orientation",
    type: "select",
    options: ["vertical", "horizontal"],
    defaultValue: "vertical",
    tab: "Properties",
    visibleWhen: (p) => p.withRadioCard !== "true",
  },
  { key: "title", label: "Title", type: "checkbox", tab: "Properties" },

  // --- Content ---
  { key: "titleText", label: "Title Text", type: "textfield", tab: "Content", visibleWhen: (p) => p.title === "true" },
  { key: "items", label: "Items", type: "stepper", min: 2, max: CARD_MAX, defaultValue: "3", tab: "Content" },
  {
    key: "variant",
    label: "Variant",
    type: "select",
    options: ["plain", "outline"],
    defaultValue: "plain",
    tab: "Content",
    visibleWhen: (p) => p.withRadioCard === "true",
  },
  {
    key: "labelItems",
    label: "Label Items",
    type: "stepper",
    min: 1,
    max: LABEL_MAX,
    defaultValue: "1",
    tab: "Content",
    visibleWhen: (p) => p.withRadioCard === "true",
  },

  // Normal モード
  {
    key: "text",
    label: "Text",
    type: "textarea",
    multiValue: true,
    placeholder: "Option A,Option B,Option C",
    tab: "Content",
    visibleWhen: (p) => p.withRadioCard !== "true",
  },

  // Card モード: ────── / editTarget / Label-N / FontStyle-N
  ...Array.from({ length: LABEL_MAX }, (_, i) => [
    cardDividerField(i + 1),
    ...(i === 0 ? [editTargetField, resetItemOverridesField, clearItemOverrideField] : []),
    ...cardLabelFields(i + 1),
    cardFontStyleField(i + 1),
  ]).flat(),
];
