// 大きな数字の単位語関連のバリデーター
import type { Violation } from "../../types";

export function validateLargeNumberUnits(text: string): Violation[] {
  const violations: Violation[] = [];

  // GENERAL-20: 説明文、エラー文言に限り、5桁以上の数字は「万」「億」などの単位語を用いる
  // 10000以上の数字を検出

  // 10,000以上の数字（カンマあり・なし両方）
  const largeNumberPattern = /(?:^|[^\d])(\d{1,3}(?:,\d{3})+|\d{5,})(?:[^\d万億兆]|$)/g;

  let match;
  while ((match = largeNumberPattern.exec(text)) !== null) {
    const numberStr = match[1].replace(/,/g, "");
    const number = parseInt(numberStr, 10);

    // 10,000以上の場合のみ
    if (number >= 10000) {
      let suggestion = "";

      if (number >= 100000000) {
        // 1億以上
        const oku = Math.floor(number / 100000000);
        const man = Math.floor((number % 100000000) / 10000);
        if (man > 0) {
          suggestion = `${oku}.${man}億`;
        } else {
          suggestion = `${oku}億`;
        }
      } else if (number >= 10000) {
        // 1万以上
        const man = Math.floor(number / 10000);
        const sen = Math.floor((number % 10000) / 1000);
        if (sen > 0) {
          suggestion = `${man}.${sen}万`;
        } else {
          suggestion = `${man}万`;
        }
      }

      violations.push({
        ruleId: "GENERAL-20",
        description: "説明文、エラー文言では5桁以上の数字は「万」「億」などの単位語を用いる",
        position: {
          start: match.index + (match[0].length - match[1].length),
          end: match.index + match[0].length - (match[0].endsWith(match[1]) ? 0 : 1),
        },
        incorrectText: match[1],
        suggestion,
        severity: "info",
        category: "数値・単位・拡張子・日付・時刻",
      });
    }
  }

  return violations;
}
