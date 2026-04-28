/**
 * Mock data for LangGraph Chat Widget Demo
 */

import type { ActionButtonsData, FormData, InfoCardData, ListData, ResponsePattern } from "./types";

/**
 * Widget data definitions
 */

const infoCardExample: InfoCardData = {
  title: "契約書情報",
  description: "以下は契約書の基本情報です",
  items: [
    { label: "契約番号", value: "CNT-2024-001" },
    { label: "契約日", value: "2024年11月28日" },
    { label: "契約先", value: "株式会社サンプル" },
    { label: "契約期間", value: "2024年4月1日 〜 2025年3月31日" },
  ],
};

const formExample: FormData = {
  title: "契約書登録フォーム",
  fields: [
    {
      label: "契約名",
      placeholder: "例：業務委託契約",
      type: "text",
    },
    {
      label: "契約先企業名",
      placeholder: "例：株式会社サンプル",
      type: "text",
    },
    {
      label: "契約金額",
      placeholder: "例：1000000",
      type: "number",
    },
  ],
};

const listExample: ListData = {
  title: "契約書一覧",
  items: [
    {
      id: "1",
      label: "業務委託契約",
      description: "株式会社サンプルとの業務委託契約",
    },
    {
      id: "2",
      label: "秘密保持契約",
      description: "株式会社テストとのNDA",
    },
    {
      id: "3",
      label: "ライセンス契約",
      description: "ソフトウェアライセンス契約",
    },
  ],
};

const actionButtonsExample: ActionButtonsData = {
  title: "次のアクションを選択してください",
  buttons: [
    {
      label: "契約書を作成",
      action: "create",
      variant: "solid",
      color: "information",
    },
    {
      label: "契約書を検索",
      action: "search",
      variant: "subtle",
      color: "neutral",
    },
    {
      label: "契約書を削除",
      action: "delete",
      variant: "subtle",
      color: "danger",
    },
  ],
};

/**
 * Response patterns with associated widgets
 */
export const responsePatterns: ResponsePattern[] = [
  // 挨拶系
  {
    keywords: ["こんにちは", "はじめまして", "よろしく", "hello", "hi"],
    response:
      "こんにちは！契約書管理のアシスタントです。契約書の情報確認、登録、検索などをお手伝いできます。何かお困りでしょうか？",
    widget: {
      id: "w-actions-1",
      type: "action-buttons",
      data: actionButtonsExample,
    },
  },
  // 情報確認系
  {
    keywords: ["情報", "詳細", "確認", "見せて", "表示"],
    response: "契約書の情報を表示します。",
    widget: {
      id: "w-info-1",
      type: "info-card",
      data: infoCardExample,
    },
  },
  // 登録・作成系
  {
    keywords: ["登録", "作成", "新規", "追加", "入力"],
    response: "契約書の登録フォームを表示します。必要事項を入力してください。",
    widget: {
      id: "w-form-1",
      type: "form",
      data: formExample,
    },
  },
  // 一覧・検索系
  {
    keywords: ["一覧", "リスト", "検索", "探す", "見つける"],
    response: "契約書の一覧を表示します。",
    widget: {
      id: "w-list-1",
      type: "list",
      data: listExample,
    },
  },
  // アクション選択系
  {
    keywords: ["できる", "機能", "何", "help", "ヘルプ"],
    response: "以下の機能が利用できます。アクションを選択してください。",
    widget: {
      id: "w-actions-2",
      type: "action-buttons",
      data: actionButtonsExample,
    },
  },
];

/**
 * Default response when no pattern matches
 */
export const defaultResponse: ResponsePattern = {
  keywords: [],
  response:
    "申し訳ございません。その内容は理解できませんでした。「情報」「登録」「一覧」などのキーワードで試してみてください。",
  widget: undefined,
};

/**
 * Helper function to find matching response pattern
 */
export function findMatchingPattern(userInput: string): ResponsePattern {
  const normalizedInput = userInput.toLowerCase();

  const matchedPattern = responsePatterns.find((pattern) =>
    pattern.keywords.some((keyword) => normalizedInput.includes(keyword.toLowerCase())),
  );

  return matchedPattern || defaultResponse;
}
