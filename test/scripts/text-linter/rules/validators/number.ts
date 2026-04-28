// 数値フォーマット関連のバリデーター
import type { Violation } from "../../types";

// GENERAL-18: 数字は半角の算用数字を用いる
const zenToHanMap: Record<string, string> = {
  "０": "0",
  "１": "1",
  "２": "2",
  "３": "3",
  "４": "4",
  "５": "5",
  "６": "6",
  "７": "7",
  "８": "8",
  "９": "9",
  一: "1",
  二: "2",
  三: "3",
  四: "4",
  五: "5",
  六: "6",
  七: "7",
  八: "8",
  九: "9",
  十: "10",
};

// GENERAL-19: 3桁ごとに桁区切りのカンマ
const numberWithoutCommaPattern = /\b(\d)(\d{3})(?=\D|$)/g;

// GENERAL-26: 人数の単位は「名」
const peopleCountPattern = /(\d+)(人|ユーザー)/g;

// GENERAL-27, 28: ファイル拡張子
const fileExtensionPattern =
  /([Pp][Dd][Ff]|[Cc][Ss][Vv]|[Dd][Oo][Cc][Xx]?|[Xx][Ll][Ss][Xx]?|\.([A-Z]{2,4}))\s*ファイル/g;

export function validateNumberFormat(text: string): Violation[] {
  const violations: Violation[] = [];

  // GENERAL-18: 全角数字チェック
  const zenkakuNumberPattern = /[０-９]/g; // 全角数字
  let match;
  while ((match = zenkakuNumberPattern.exec(text)) !== null) {
    const zenkaku = match[0];
    violations.push({
      ruleId: "GENERAL-18",
      description: "数字は半角の算用数字を用いる",
      position: { start: match.index, end: match.index + 1 },
      incorrectText: zenkaku,
      suggestion: zenToHanMap[zenkaku] || zenkaku,
      severity: "error",
      category: "数値・単位・拡張子・日付・時刻",
    });
  }

  // 漢数字チェック (慣用句以外)
  const kanjiNumberInContextPattern = /(\d+|[一二三四五六七八九十百千万億])回目/g;
  while ((match = kanjiNumberInContextPattern.exec(text)) !== null) {
    const kanjiNum = match[1];
    if (zenToHanMap[kanjiNum]) {
      violations.push({
        ruleId: "GENERAL-18",
        description: "数字は半角の算用数字を用いる",
        position: { start: match.index, end: match.index + kanjiNum.length },
        incorrectText: kanjiNum,
        suggestion: zenToHanMap[kanjiNum],
        severity: "error",
        category: "数値・単位・拡張子・日付・時刻",
      });
    }
  }

  // GENERAL-19: 4桁以上の数字にカンマがないケース
  const fourDigitPattern = /\b(\d{4,})\b/g;
  zenkakuNumberPattern.lastIndex = 0;
  while ((match = fourDigitPattern.exec(text)) !== null) {
    const num = match[1];
    // 日付や電話番号などの例外を除外
    if (!/^\d{4}[/\-年]/.test(text.substring(match.index))) {
      const formatted = num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      if (num !== formatted) {
        violations.push({
          ruleId: "GENERAL-19",
          description: "数値は原則、3桁ごとに桁区切りの記号のカンマ（,）を用いる",
          position: { start: match.index, end: match.index + num.length },
          incorrectText: num,
          suggestion: formatted,
          severity: "warning",
          category: "数値・単位・拡張子・日付・時刻",
        });
      }
    }
  }

  // GENERAL-26: 人数単位
  fourDigitPattern.lastIndex = 0;
  while ((match = peopleCountPattern.exec(text)) !== null) {
    const unit = match[2];
    if (unit === "人" || unit === "ユーザー") {
      violations.push({
        ruleId: "GENERAL-26",
        description: "人数の単位は「名」を用いる",
        position: { start: match.index + match[1].length, end: match.index + match[0].length },
        incorrectText: unit,
        suggestion: "名",
        severity: "error",
        category: "数値・単位・拡張子・日付・時刻",
      });
    }
  }

  // GENERAL-27: ファイル拡張子表記
  peopleCountPattern.lastIndex = 0;
  while ((match = fileExtensionPattern.exec(text)) !== null) {
    const ext = match[1];
    let correctExt = "";

    if (/^[Pp][Dd][Ff]$/.test(ext)) correctExt = "PDF";
    else if (/^[Cc][Ss][Vv]$/.test(ext)) correctExt = "CSV";
    else if (/^[Dd][Oo][Cc][Xx]?$/.test(ext)) correctExt = ext.toUpperCase();
    else if (/^[Xx][Ll][Ss][Xx]?$/.test(ext)) correctExt = ext.toUpperCase();
    else if (/^\.([A-Z]{2,4})$/.test(ext)) {
      // 拡張子の場合は小文字
      correctExt = ext.toLowerCase();
    }

    if (correctExt && ext !== correctExt) {
      violations.push({
        ruleId: ext.startsWith(".") ? "GENERAL-28" : "GENERAL-27",
        description: ext.startsWith(".")
          ? "拡張子を表現する際には、ピリオド + 小文字 で表記する"
          : "「〇〇ファイル」の〇〇の部分は、大文字か開発元公式の書き方で表記する",
        position: { start: match.index, end: match.index + ext.length },
        incorrectText: ext,
        suggestion: correctExt,
        severity: "error",
        category: "数値・単位・拡張子・日付・時刻",
      });
    }
  }

  return violations;
}
