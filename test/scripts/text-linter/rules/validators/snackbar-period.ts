// スナックバー句点関連のバリデーター
import type { TextContext, Violation } from "../../types";

export function validateSnackbarPeriod(text: string, context?: TextContext): Violation[] {
  const violations: Violation[] = [];

  // GENERAL-54: スナックバーの末尾に句点（。）を付けない
  // ただし2つの文を表示する場合は1つ目の文の終わりに句点をつける

  // Snackbar コンポーネント以外はスキップ（case-insensitive）
  if (context?.componentName?.toLowerCase() !== "snackbar") {
    return violations;
  }

  // 文末の句点を検出（文中の句点は許可）
  const endingPeriodPattern = /。\s*$/;

  if (endingPeriodPattern.test(text)) {
    // 2文以上ある場合は、最後の文の句点のみ削除
    const sentences = text.split("。").filter((s) => s.trim().length > 0);

    if (sentences.length === 1) {
      // 1文のみの場合、末尾の句点を削除
      const match = text.match(/。\s*$/);
      if (match) {
        violations.push({
          ruleId: "GENERAL-54",
          description: "スナックバーの末尾に句点を付けない",
          position: { start: text.length - match[0].length, end: text.length },
          incorrectText: match[0],
          suggestion: "",
          severity: "warning",
          category: "snackbar",
        });
      }
    } else {
      // 2文以上の場合でも、最後の句点は不要
      const match = text.match(/。\s*$/);
      if (match) {
        violations.push({
          ruleId: "GENERAL-54",
          description: "スナックバーの末尾に句点を付けない（1つ目の文の句点は許可）",
          position: { start: text.length - match[0].length, end: text.length },
          incorrectText: match[0],
          suggestion: "",
          severity: "warning",
          category: "snackbar",
        });
      }
    }
  }

  return violations;
}
