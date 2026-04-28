// 冗長な語尾関連のバリデーター (GENERAL-68の拡張)
import type { Violation } from "../../types";

export function validateRedundantSuffix(text: string): Violation[] {
  const violations: Violation[] = [];

  // GENERAL-24: 状況が理解できる場合は冗長な表現は避ける
  // 「確認済みにする」→「確認済み」など

  const redundantSuffixPatterns = [
    {
      pattern: /確認済みにする/g,
      incorrect: "確認済みにする",
      correct: "確認済み",
    },
    {
      pattern: /完了済みにする/g,
      incorrect: "完了済みにする",
      correct: "完了済み",
    },
    {
      pattern: /処理済みにする/g,
      incorrect: "処理済みにする",
      correct: "処理済み",
    },
    {
      pattern: /承認済みにする/g,
      incorrect: "承認済みにする",
      correct: "承認済み",
    },
    {
      pattern: /選択済みにする/g,
      incorrect: "選択済みにする",
      correct: "選択済み",
    },
    {
      pattern: /未確認にする/g,
      incorrect: "未確認にする",
      correct: "未確認",
    },
    {
      pattern: /未完了にする/g,
      incorrect: "未完了にする",
      correct: "未完了",
    },
    {
      pattern: /(?:有効|無効|公開|非公開|表示|非表示)(?:の)?状態にする/g,
      incorrect: "状態にする",
      correct: "にする",
    },
  ];

  redundantSuffixPatterns.forEach(({ pattern, incorrect, correct }) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      violations.push({
        ruleId: "GENERAL-24",
        description: "冗長な表現は避ける",
        position: { start: match.index, end: match.index + match[0].length },
        incorrectText: match[0],
        suggestion: match[0].replace(incorrect, correct),
        severity: "warning",
        category: "冗長な日本語を避ける",
      });
    }
  });

  return violations;
}
