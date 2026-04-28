// 曖昧な用語関連のバリデーター
import type { Violation } from "../../types";

export function validateVagueTerminology(text: string): Violation[] {
  const violations: Violation[] = [];

  // GENERAL-14: 概念がわかりづらい用語は、単体での使用は避けたほうが望ましい
  const vagueTermPatterns = [
    {
      pattern: /一般(?=[ぁ-んァ-ヶ一-龯のをがはに\s。、]|$)/g,
      incorrect: "一般",
      correct: "標準/通常",
    },
    {
      pattern: /通常(?=[ぁ-んァ-ヶ一-龯のをがはに\s。、]|$)(?!的)/g,
      incorrect: "通常",
      correct: "標準/デフォルト",
    },
    {
      pattern: /標準(?=[ぁ-んァ-ヶ一-龯のをがはに\s。、]|$)(?!的)/g,
      incorrect: "標準",
      correct: "デフォルト/基本",
    },
    {
      pattern: /デフォルト(?=[ぁ-んァ-ヶ一-龯のをがはに\s。、]|$)/g,
      incorrect: "デフォルト",
      correct: "初期設定/規定値",
    },
  ];

  vagueTermPatterns.forEach(({ pattern, incorrect, correct }) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      // マッチした部分のみを取得（前後の文字を除外）
      const matchedWord = match[0].trim();

      violations.push({
        ruleId: "GENERAL-14",
        description: "曖昧な用語は具体的な説明と併用する",
        position: { start: match.index, end: match.index + match[0].length },
        incorrectText: matchedWord,
        suggestion: `${correct}など、より具体的な説明を併記してください`,
        severity: "info",
        category: "不適切な表現",
      });
    }
  });

  return violations;
}
