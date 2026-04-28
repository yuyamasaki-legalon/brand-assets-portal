// 日付・時刻関連のバリデーター
import type { Violation } from "../../types";

// GENERAL-21: 日時表記 yyyy/MM/dd HH:mm
const japaneseDateTimePatterns = [
  // 2021年11月12日 15時30分 → 2021/11/12 15:30
  {
    pattern: /(\d{4})年(\d{1,2})月(\d{1,2})日\s*(\d{1,2})時(\d{1,2})分/g,
    incorrect: "$1年$2月$3日 $4時$5分",
    getSuggestion: (match: RegExpExecArray) => {
      const year = match[1];
      const month = match[2].padStart(2, "0");
      const day = match[3].padStart(2, "0");
      const hour = match[4].padStart(2, "0");
      const minute = match[5].padStart(2, "0");
      return `${year}/${month}/${day} ${hour}:${minute}`;
    },
  },
  // 2022/3/2 5:03 → 2022/03/02 05:03
  {
    pattern: /(\d{4})\/(\d{1})\/(\d{1,2})\s+(\d{1})[:：](\d{2})/g,
    incorrect: "single digit month/day/hour",
    getSuggestion: (match: RegExpExecArray) => {
      const year = match[1];
      const month = match[2].padStart(2, "0");
      const day = match[3].padStart(2, "0");
      const hour = match[4].padStart(2, "0");
      const minute = match[5];
      return `${year}/${month}/${day} ${hour}:${minute}`;
    },
  },
];

export function validateDateTime(text: string): Violation[] {
  const violations: Violation[] = [];

  japaneseDateTimePatterns.forEach(({ pattern, getSuggestion }) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const suggestion = getSuggestion(match);
      violations.push({
        ruleId: "GENERAL-21",
        description: "日本向けの場合、日時表記にはyyyy/MM/dd HH:mm の形式を用いる",
        position: { start: match.index, end: match.index + match[0].length },
        incorrectText: match[0],
        suggestion,
        severity: "error",
        category: "数値・単位・拡張子・日付・時刻",
      });
    }
  });

  return violations;
}
