// 曖昧なエラーメッセージ関連のバリデーター
import type { Violation } from "../../types";

export function validateVagueError(text: string): Violation[] {
  const violations: Violation[] = [];

  // GENERAL-52: エラーメッセージには、事象と原因を明確に特定し、対処方法を提示する
  // 曖昧なエラーメッセージを検出

  const vagueErrorPatterns = [
    {
      pattern: /^エラーです(?:。)?$/g,
      incorrect: "エラーです",
      suggestion: "具体的なエラー内容と対処方法を記載してください",
    },
    {
      pattern: /^エラーが発生しました(?:。)?$/g,
      incorrect: "エラーが発生しました",
      suggestion: "具体的なエラー内容と対処方法を記載してください",
    },
    {
      pattern: /^失敗しました(?:。)?$/g,
      incorrect: "失敗しました",
      suggestion: "何が失敗したのか、なぜ失敗したのかを明記してください",
    },
    {
      pattern: /^(?:処理|操作)に失敗しました(?:。)?$/g,
      incorrect: "処理に失敗しました",
      suggestion: "どの処理が、なぜ失敗したのかを明記してください",
    },
    {
      pattern: /^問題が発生しました(?:。)?$/g,
      incorrect: "問題が発生しました",
      suggestion: "具体的な問題内容と対処方法を記載してください",
    },
    {
      pattern: /^無効(?:です|な(?:値|入力))(?:。)?$/g,
      incorrect: "無効です",
      suggestion: "何が無効なのか、どう修正すべきかを明記してください",
    },
  ];

  vagueErrorPatterns.forEach(({ pattern, incorrect, suggestion }) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      violations.push({
        ruleId: "GENERAL-52",
        description: "エラーメッセージには具体的な事象、原因、対処方法を記載する",
        position: { start: match.index, end: match.index + match[0].length },
        incorrectText: match[0],
        suggestion,
        severity: "warning",
        category: "エラーメッセージ",
      });
    }
  });

  return violations;
}
