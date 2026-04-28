// 謝罪表現関連のバリデーター
import type { Violation } from "../../types";

export function validateApology(text: string): Violation[] {
  const violations: Violation[] = [];

  // GENERAL-16: 謝罪の表現を使用しない
  const apologyPatterns = [
    {
      pattern: /申し訳(?:ございません|ありません)(?:が|。|、)/g,
      word: "申し訳ございません",
    },
    {
      pattern: /(?:お詫び|おわび)(?:いたします|します|申し上げます)/g,
      word: "お詫び",
    },
    {
      pattern: /(?:恐れ入りますが|恐縮ですが)/g,
      word: "恐れ入りますが",
    },
    {
      pattern: /ご容赦(?:ください|下さい)/g,
      word: "ご容赦ください",
    },
  ];

  apologyPatterns.forEach(({ pattern, word }) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      violations.push({
        ruleId: "GENERAL-16",
        description: "謝罪の表現を使用しない",
        position: { start: match.index, end: match.index + match[0].length },
        incorrectText: match[0],
        suggestion: "事象や対処方法を直接記述してください",
        severity: "warning",
        category: "不適切な表現",
      });
    }
  });

  return violations;
}
