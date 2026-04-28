// 括弧の全角半角関連のバリデーター
import type { Violation } from "../../types";

export function validateBrackets(text: string): Violation[] {
  const violations: Violation[] = [];

  // GENERAL-64: 文章中の括弧類（ ）、「 」、［ ］などの記号は原則全角で使用し、前後にスペースを入れない
  const halfWidthBrackets = [
    { pattern: /\(/g, incorrect: "(", correct: "（" },
    { pattern: /\)/g, incorrect: ")", correct: "）" },
    { pattern: /\[/g, incorrect: "[", correct: "［" },
    { pattern: /\]/g, incorrect: "]", correct: "］" },
    { pattern: /\{/g, incorrect: "{", correct: "｛" },
    { pattern: /\}/g, incorrect: "}", correct: "｝" },
  ];

  halfWidthBrackets.forEach(({ pattern, incorrect, correct }) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      // 前後の文字をチェック
      const beforeChar = text[match.index - 1] || "";
      const afterChar = text[match.index + 1] || "";

      // 日本語の文章中で使われている場合のみ検出
      // (英数字のみの表記や、URLなどは除外)
      const isInJapaneseContext = /[ぁ-んァ-ヶ一-龯]/.test(beforeChar) || /[ぁ-んァ-ヶ一-龯]/.test(afterChar);

      if (isInJapaneseContext) {
        violations.push({
          ruleId: "GENERAL-64",
          description: "文章中の括弧類は原則全角で使用する",
          position: { start: match.index, end: match.index + 1 },
          incorrectText: incorrect,
          suggestion: correct,
          severity: "error",
          category: "記号",
        });
      }
    }
  });

  // 全角括弧の前後のスペースをチェック
  const bracketWithSpace = /\s([（[［｛])|([）\]］｝])\s/g;
  let spaceMatch;
  while ((spaceMatch = bracketWithSpace.exec(text)) !== null) {
    violations.push({
      ruleId: "GENERAL-64",
      description: "括弧の前後にスペースを入れない",
      position: { start: spaceMatch.index, end: spaceMatch.index + spaceMatch[0].length },
      incorrectText: spaceMatch[0],
      suggestion: spaceMatch[0].replace(/\s/g, ""),
      severity: "warning",
      category: "記号",
    });
  }

  return violations;
}
