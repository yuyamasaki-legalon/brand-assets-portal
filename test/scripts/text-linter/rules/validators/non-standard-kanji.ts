// 非常用漢字・旧字関連のバリデーター
import type { Violation } from "../../types";

export function validateNonStandardKanji(text: string): Violation[] {
  const violations: Violation[] = [];

  // GENERAL-5: 非常用漢字及び旧字は使用しない
  const nonStandardKanjiPatterns = [
    { pattern: /予め/g, incorrect: "予め", correct: "あらかじめ" },
    { pattern: /殆ど/g, incorrect: "殆ど", correct: "ほとんど" },
    { pattern: /暫く/g, incorrect: "暫く", correct: "しばらく" },
    { pattern: /嘗て/g, incorrect: "嘗て", correct: "かつて" },
    { pattern: /敢えて/g, incorrect: "敢えて", correct: "あえて" },
    { pattern: /飽くまで/g, incorrect: "飽くまで", correct: "あくまで" },
    { pattern: /僅か/g, incorrect: "僅か", correct: "わずか" },
    { pattern: /辿る/g, incorrect: "辿る", correct: "たどる" },
    { pattern: /拘らず/g, incorrect: "拘らず", correct: "かかわらず" },
    { pattern: /概ね/g, incorrect: "概ね", correct: "おおむね" },
  ];

  nonStandardKanjiPatterns.forEach(({ pattern, incorrect, correct }) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      violations.push({
        ruleId: "GENERAL-5",
        description: "非常用漢字及び旧字は使用しない",
        position: { start: match.index, end: match.index + incorrect.length },
        incorrectText: incorrect,
        suggestion: correct,
        severity: "error",
        category: "常用漢字表",
      });
    }
  });

  return violations;
}
