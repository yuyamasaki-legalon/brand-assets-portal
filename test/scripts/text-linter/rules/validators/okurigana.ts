// 送り仮名関連のバリデーター
import type { Violation } from "../../types";

// GENERAL-8: 送り仮名はすべてつける
const okuriganaPatterns: Array<{ pattern: RegExp; incorrect: string; correct: string }> = [
  { pattern: /読込(?![みむ])/g, incorrect: "読込", correct: "読み込み" },
  { pattern: /取消(?![しす法])/g, incorrect: "取消", correct: "取り消し" }, // 取消法は除外
  { pattern: /申込(?![みむ])/g, incorrect: "申込", correct: "申し込み" },
  { pattern: /貸出(?![しす])/g, incorrect: "貸出", correct: "貸し出し" },
  { pattern: /繰返(?![しす])/g, incorrect: "繰返", correct: "繰り返し" },
  { pattern: /打合(?![わせ])/g, incorrect: "打合", correct: "打ち合わせ" },
  { pattern: /引継(?![ぎぐ])/g, incorrect: "引継", correct: "引き継ぎ" },
  { pattern: /(?<!案件)受付(?![けく]|メール)/g, incorrect: "受付", correct: "受け付け" }, // 案件受付、受付メールは除外
  { pattern: /問合(?![わせ])/g, incorrect: "問合", correct: "問い合わせ" },
  { pattern: /振込(?![みむ])/g, incorrect: "振込", correct: "振り込み" },
];

export function validateOkurigana(text: string): Violation[] {
  const violations: Violation[] = [];

  okuriganaPatterns.forEach(({ pattern, incorrect, correct }) => {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(text)) !== null) {
      violations.push({
        ruleId: "GENERAL-8",
        description: "送り仮名はすべてつけることが望ましい",
        position: { start: match.index, end: match.index + incorrect.length },
        incorrectText: incorrect,
        suggestion: correct,
        severity: "warning",
        category: "漢字とひらがな",
      });
    }
  });

  return violations;
}
