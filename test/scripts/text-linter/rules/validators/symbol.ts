// 記号関連のバリデーター
import type { Violation } from "../../types";

export function validateSymbol(text: string): Violation[] {
  const violations: Violation[] = [];

  // GENERAL-47: 文章の末尾には句点「。」をつける (簡易チェック)
  // ボタンラベルやタイトル以外で、句点がない文を検出
  const sentencePattern = /[ますした][^\n。]*$/gm;
  let match;
  while ((match = sentencePattern.exec(text)) !== null) {
    const sentence = match[0];
    if (sentence.length > 10 && !sentence.endsWith("。")) {
      violations.push({
        ruleId: "GENERAL-47",
        description: "文章（メッセージ、説明文など）の末尾には句点「。」をつける",
        position: { start: match.index, end: match.index + sentence.length },
        incorrectText: sentence,
        suggestion: sentence + "。",
        severity: "info",
        category: "記号",
      });
    }
  }

  return violations;
}
