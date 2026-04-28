// マイナスイメージ用語関連のバリデーター
import type { Violation } from "../../types";

export function validateNegativeTerminology(text: string): Violation[] {
  const violations: Violation[] = [];

  // GENERAL-12: マイナスイメージの用語は使用しないことが望ましい
  const negativeTermPatterns = [
    {
      pattern: /おそい(?=[はがをのでもです\s。、]|$)/g,
      incorrect: "おそい",
      correct: "低速",
      context: "速度に関する表現",
    },
    {
      pattern: /遅い(?=[はがをのでもです\s。、]|$)/g,
      incorrect: "遅い",
      correct: "低速",
      context: "速度に関する表現",
    },
    {
      pattern: /(?:画質|速度|性能)(?:が)?(?:悪い|低い)/g,
      incorrect: "悪い/低い",
      correct: "標準/基本",
      context: "品質に関する表現",
    },
    {
      pattern: /弱い(?:セキュリティ|パスワード)/g,
      incorrect: "弱い",
      correct: "基本的な",
      context: "セキュリティに関する表現",
    },
  ];

  negativeTermPatterns.forEach(({ pattern, incorrect, correct, context }) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      violations.push({
        ruleId: "GENERAL-12",
        description: "マイナスイメージの用語は使用しない",
        position: { start: match.index, end: match.index + match[0].length },
        incorrectText: match[0],
        suggestion: `${correct}などの肯定的な表現を使用してください`,
        severity: "info",
        category: "不適切な表現",
      });
    }
  });

  return violations;
}
