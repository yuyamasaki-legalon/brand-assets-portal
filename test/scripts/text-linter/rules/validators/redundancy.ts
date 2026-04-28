// 冗長表現関連のバリデーター
import type { Violation } from "../../types";

export function validateRedundancy(text: string): Violation[] {
  const violations: Violation[] = [];

  // GENERAL-68: 冗長な語尾を避ける
  const redundantPatterns = [
    {
      pattern: /をご確認いただけますようお願いいたします/g,
      incorrect: "をご確認いただけますようお願いいたします",
      correct: "を確認してください",
    },
    {
      pattern: /させていただきました/g,
      incorrect: "させていただきました",
      correct: "しました",
    },
    {
      pattern: /することができる/g,
      incorrect: "することができる",
      correct: "できる",
    },
    {
      pattern: /することが可能です/g,
      incorrect: "することが可能です",
      correct: "できます",
    },
  ];

  redundantPatterns.forEach(({ pattern, incorrect, correct }) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      violations.push({
        ruleId: "GENERAL-68",
        description: "冗長な語尾を避ける",
        position: { start: match.index, end: match.index + match[0].length },
        incorrectText: match[0],
        suggestion: correct,
        severity: "warning",
        category: "冗長な日本語を避ける",
      });
    }
  });

  return violations;
}
