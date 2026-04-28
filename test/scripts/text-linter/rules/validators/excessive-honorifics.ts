// 過剰な敬語表現関連のバリデーター
import type { Violation } from "../../types";

export function validateExcessiveHonorifics(text: string): Violation[] {
  const violations: Violation[] = [];

  // GENERAL-4: 尊敬語や謙譲語の敬語表現は、特定の状況以外で使用しない
  // NOTE: GENERAL-68で一部カバー済みだが、より広範な敬語パターンを検出
  const excessiveHonorificsPatterns = [
    {
      pattern: /いただけますようお願いいたします/g,
      incorrect: "いただけますようお願いいたします",
      correct: "ください",
    },
    {
      pattern: /(?:いただけますでしょうか|いただけますか)/g,
      incorrect: "いただけますでしょうか",
      correct: "いただけますか",
    },
    {
      pattern: /ご確認いただけますと幸いです/g,
      incorrect: "ご確認いただけますと幸いです",
      correct: "確認してください",
    },
    {
      pattern: /お手数ですが/g,
      incorrect: "お手数ですが",
      correct: "",
    },
    {
      pattern: /お手数をおかけしますが/g,
      incorrect: "お手数をおかけしますが",
      correct: "",
    },
    {
      pattern: /恐れ入りますが/g,
      incorrect: "恐れ入りますが",
      correct: "",
    },
  ];

  excessiveHonorificsPatterns.forEach(({ pattern, incorrect, correct }) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      violations.push({
        ruleId: "GENERAL-4",
        description: "過剰な敬語表現は使用しない",
        position: { start: match.index, end: match.index + match[0].length },
        incorrectText: match[0],
        suggestion: correct || "簡潔な表現に変更してください",
        severity: "warning",
        category: "敬語・謝罪表現",
      });
    }
  });

  return violations;
}
