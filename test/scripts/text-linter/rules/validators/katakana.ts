// カタカナ語関連のバリデーター
import type { Violation } from "../../types";

// GENERAL-34: 語尾-er → 長音符号「ー」
const erWords: Array<{ pattern: RegExp; correct: string; incorrect: string }> = [
  { pattern: /コンピュータ(?!ー)/g, correct: "コンピューター", incorrect: "コンピュータ" },
  { pattern: /メーカ(?!ー)/g, correct: "メーカー", incorrect: "メーカ" },
  { pattern: /ユーザ(?!ー)/g, correct: "ユーザー", incorrect: "ユーザ" },
  { pattern: /ブラウザ(?!ー)/g, correct: "ブラウザー", incorrect: "ブラウザ" },
  { pattern: /エディタ(?!ー)/g, correct: "エディター", incorrect: "エディタ" },
  { pattern: /カレンダ(?!ー)/g, correct: "カレンダー", incorrect: "カレンダ" },
  { pattern: /メモリ(?!ー)/g, correct: "メモリー", incorrect: "メモリ" },
  { pattern: /カテゴリ(?!ー)/g, correct: "カテゴリー", incorrect: "カテゴリ" },
];

// GENERAL-36: 語尾-re → 長音符号なし、ただし-ture, -sureは付ける
const reWords: Array<{ pattern: RegExp; correct: string; incorrect: string }> = [
  { pattern: /ハードウエアー/g, correct: "ハードウェア", incorrect: "ハードウエアー" },
  { pattern: /ソフトウエアー/g, correct: "ソフトウェア", incorrect: "ソフトウエアー" },
  { pattern: /アーキテクチャ(?!ー)/g, correct: "アーキテクチャー", incorrect: "アーキテクチャ" },
  { pattern: /シグネチャ(?!ー)/g, correct: "シグネチャー", incorrect: "シグネチャ" },
  { pattern: /フィーチャ(?!ー)/g, correct: "フィーチャー", incorrect: "フィーチャ" },
];

// GENERAL-38: 「ウィ」「ウェ」「ウォ」→「ウイ」「ウエ」「ウオ」(例外あり)
const wiWeWoWords: Array<{ pattern: RegExp; correct: string; incorrect: string }> = [
  { pattern: /ウィンドー/g, correct: "ウィンドウ", incorrect: "ウィンドー" },
  { pattern: /ウィルス/g, correct: "ウイルス", incorrect: "ウィルス" },
];

// GENERAL-39: 「クァ」「クィ」「クェ」「クォ」→「クア」「クイ」「クエ」「クオ」
const quWords: Array<{ pattern: RegExp; correct: string; incorrect: string }> = [
  { pattern: /クィック/g, correct: "クイック", incorrect: "クィック" },
  { pattern: /クォリティ/g, correct: "クオリティー", incorrect: "クォリティ" },
];

// GENERAL-40: 「フア」「フイ」「フエ」→「ファ」「フィ」「フェ」
const faFiFeWords: Array<{ pattern: RegExp; correct: string; incorrect: string }> = [
  { pattern: /インタフェース/g, correct: "インターフェイス", incorrect: "インタフェース" },
];

// GENERAL-42: V音→「バ」「ビ」「ブ」「ベ」「ボ」
const vWords: Array<{ pattern: RegExp; correct: string; incorrect: string }> = [
  { pattern: /ヴァージョン/g, correct: "バージョン", incorrect: "ヴァージョン" },
  { pattern: /ユニヴァーサル/g, correct: "ユニバーサル", incorrect: "ユニヴァーサル" },
];

// GENERAL-44: de→「デ」
const deWords: Array<{ pattern: RegExp; correct: string; incorrect: string }> = [
  { pattern: /ディバッグ/g, correct: "デバッグ", incorrect: "ディバッグ" },
  { pattern: /ディファクト/g, correct: "デファクト", incorrect: "ディファクト" },
  { pattern: /ディベロッパー/g, correct: "デベロッパー", incorrect: "ディベロッパー" },
];

// GENERAL-46: 語頭re, pre→「リ」「プリ」
const rePreWords: Array<{ pattern: RegExp; correct: string; incorrect: string }> = [
  { pattern: /レファレンス/g, correct: "リファレンス", incorrect: "レファレンス" },
];

// GENERAL-179: 語尾-or → 長音符号「ー」
const orWords: Array<{ pattern: RegExp; correct: string; incorrect: string }> = [
  { pattern: /エディタ(?!ー)/g, correct: "エディター", incorrect: "エディタ" },
  { pattern: /モニタ(?!ー)/g, correct: "モニター", incorrect: "モニタ" },
  { pattern: /プロセッサ(?!ー)/g, correct: "プロセッサー", incorrect: "プロセッサ" },
];

// GENERAL-180: 語尾-ar → 長音符号「ー」
const arWords: Array<{ pattern: RegExp; correct: string; incorrect: string }> = [
  { pattern: /カレンダ(?!ー)/g, correct: "カレンダー", incorrect: "カレンダ" },
  { pattern: /セミナ(?!ー)/g, correct: "セミナー", incorrect: "セミナ" },
];

// GENERAL-181: 語尾-y → 長音符号「ー」
const yWords: Array<{ pattern: RegExp; correct: string; incorrect: string }> = [
  { pattern: /メモリ(?!ー)/g, correct: "メモリー", incorrect: "メモリ" },
  { pattern: /カテゴリ(?!ー)/g, correct: "カテゴリー", incorrect: "カテゴリ" },
  { pattern: /セキュリティ(?!ー)/g, correct: "セキュリティー", incorrect: "セキュリティ" },
  { pattern: /ディレクトリ(?!ー)/g, correct: "ディレクトリー", incorrect: "ディレクトリ" },
];

// GENERAL-76: 他社製品名
const productNames: Array<{ pattern: RegExp; correct: string; incorrect: string }> = [
  { pattern: /\bExcel(?!ファイル)/g, correct: "Microsoft Excel", incorrect: "Excel" },
  { pattern: /(?<!Microsoft\s)Teams(?![a-zA-Z])/g, correct: "Microsoft Teams", incorrect: "Teams" },
];

export function validateKatakana(text: string): Violation[] {
  const violations: Violation[] = [];

  const allPatterns: Array<{
    patterns: Array<{ pattern: RegExp; correct: string; incorrect: string }>;
    ruleId: string;
    description: string;
    severity?: "error" | "warning" | "info";
  }> = [
    {
      patterns: erWords,
      ruleId: "GENERAL-34",
      description: "英語の語尾が-erにあたるものは、原則として長音符号「ー」を用いて書き表す",
      severity: "error",
    },
    {
      patterns: reWords,
      ruleId: "GENERAL-36,37",
      description: "英語の語尾の-reにあたるものの長音符号ルール",
      severity: "error",
    },
    {
      patterns: wiWeWoWords,
      ruleId: "GENERAL-38",
      description: "原則として「ウィ」「ウェ」「ウォ」は使用せず、「ウイ」「ウエ」「ウオ」と表記する",
      severity: "error",
    },
    {
      patterns: quWords,
      ruleId: "GENERAL-39",
      description: "「クァ」「クィ」「クェ」「クォ」は使用せず「クア」「クイ」「クエ」「クオ」と表記する",
      severity: "error",
    },
    {
      patterns: faFiFeWords,
      ruleId: "GENERAL-40",
      description: "「フア」「フイ」「フエ」は使用せず「ファ」「フィ」「フェ」と表記する",
      severity: "error",
    },
    {
      patterns: vWords,
      ruleId: "GENERAL-42",
      description: "原語の「V」音には「バ」「ビ」「ブ」「ベ」「ボ」をあてる",
      severity: "error",
    },
    { patterns: deWords, ruleId: "GENERAL-44", description: "原語の「de」には「デ」をあてる", severity: "error" },
    {
      patterns: rePreWords,
      ruleId: "GENERAL-46",
      description: "語頭の「re」「pre」の表記は「リ」「プリ」をあてる",
      severity: "error",
    },
    {
      patterns: orWords,
      ruleId: "GENERAL-179",
      description: "英語の語尾が-orにあたるものは、原則として長音符号「ー」を用いて書き表す",
      severity: "error",
    },
    {
      patterns: arWords,
      ruleId: "GENERAL-180",
      description: "英語の語尾が-arにあたるものは、原則として長音符号「ー」を用いて書き表す",
      severity: "error",
    },
    {
      patterns: yWords,
      ruleId: "GENERAL-181",
      description: "英語の語尾が-yにあたるものは、原則として長音符号「ー」を用いて書き表す",
      severity: "error",
    },
    { patterns: productNames, ruleId: "GENERAL-76", description: "他社製品の名称は正式名で記載する", severity: "info" },
  ];

  allPatterns.forEach(({ patterns, ruleId, description, severity = "error" }) => {
    patterns.forEach(({ pattern, correct, incorrect }) => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        violations.push({
          ruleId,
          description,
          position: { start: match.index, end: match.index + incorrect.length },
          incorrectText: incorrect,
          suggestion: correct,
          severity,
          category: "カタカナ語",
        });
      }
    });
  });

  return violations;
}
