// 二重否定関連のバリデーター
import type { Violation } from "../../types";

export function validateDoubleNegation(text: string): Violation[] {
  const violations: Violation[] = [];

  // GENERAL-13: 二重否定は避ける
  // 「非表示」「無効」などの否定的な表現を検出
  const doubleNegationPatterns = [
    {
      // 「非表示」の検出パターン
      // 「を非表示」「非表示にする」「非表示を解除」など
      pattern:
        /(?:[をが]非表示|非表示(?:に(?:する|します|しま|でき)|を(?:設定|有効|解除|選択)|の(?:設定|状態)|とする))/g,
      negativeWord: "非表示",
      positiveWord: "表示",
      ruleId: "GENERAL-13",
    },
    {
      // 「無効」の検出パターン
      pattern:
        /(?:[をが]無効|無効(?:に(?:する|します|しま|でき)|を(?:設定|有効|解除|選択)|の(?:設定|状態)|とする|化))/g,
      negativeWord: "無効",
      positiveWord: "有効",
      ruleId: "GENERAL-13",
    },
    {
      // 「不要」の検出パターン
      pattern: /(?:[をが]不要|不要(?:に(?:する|します|しま|でき)|を(?:設定|有効|解除|選択)|の(?:設定|状態)|とする))/g,
      negativeWord: "不要",
      positiveWord: "必要",
      ruleId: "GENERAL-13",
    },
  ];

  doubleNegationPatterns.forEach(({ pattern, negativeWord, positiveWord, ruleId }) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      // マッチしたテキスト全体を取得
      const matchedText = match[0];

      // 提案: 否定語を肯定語に置き換える
      const suggestion = matchedText.replace(negativeWord, positiveWord);

      violations.push({
        ruleId,
        description: "二重否定は避ける",
        position: { start: match.index, end: match.index + matchedText.length },
        incorrectText: matchedText,
        suggestion,
        severity: "warning",
        category: "日本語の使い分け",
      });
    }
  });

  return violations;
}
