// 長文関連のバリデーター
import type { Violation } from "../../types";

export function validateLongSentence(text: string): Violation[] {
  const violations: Violation[] = [];

  // GENERAL-49: 1度に限られた数の概念に焦点を当てて短文にまとめる
  // 1文が80文字を超える場合に警告

  // 句点で分割して各文をチェック
  const sentences = text.split(/。/);

  let currentPosition = 0;

  sentences.forEach((sentence) => {
    const trimmedSentence = sentence.trim();

    if (trimmedSentence.length > 0) {
      // 80文字以上の文を検出
      if (trimmedSentence.length > 80) {
        violations.push({
          ruleId: "GENERAL-49",
          description: "1文は80文字以内にまとめる",
          position: { start: currentPosition, end: currentPosition + trimmedSentence.length },
          incorrectText: trimmedSentence,
          suggestion: "短文に分割してください",
          severity: "info",
          category: "文章の書き方",
        });
      }
    }

    // 次の文の開始位置を更新（句点の分も含める）
    currentPosition += sentence.length + 1; // +1 for 。
  });

  return violations;
}
