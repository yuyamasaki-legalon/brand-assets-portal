// 3点リーダー関連のバリデーター
import type { Violation } from "../../types";

export function validateEllipsis(text: string): Violation[] {
  const violations: Violation[] = [];

  // GENERAL-48: 3点リーダーはテキストの省略を表す場合、および進行状況を表す場合のみに使用する
  // 不適切な使用例: 「詳しくは...」「ご確認ください...」など文末での使用

  // 文末での3点リーダー使用を検出（数字の後を除く）
  const inappropriateEllipsis = /(?<![0-9])\.{3}(?![0-9])/g;

  let match;
  while ((match = inappropriateEllipsis.exec(text)) !== null) {
    // 前後のコンテキストを確認
    const beforeText = text.substring(Math.max(0, match.index - 10), match.index);
    const afterText = text.substring(match.index + 3, Math.min(match.index + 10, text.length));

    // 数字の省略（例: 123456789...）は許可
    if (/\d$/.test(beforeText)) {
      continue;
    }

    // 進行状況を表す場合（例: 読み込み中...）は許可
    if (/(?:中|処理|読み込み|ロード|保存|更新|削除|作成)$/.test(beforeText)) {
      continue;
    }

    violations.push({
      ruleId: "GENERAL-48",
      description: "3点リーダーはテキストの省略を表す場合、および進行状況を表す場合のみに使用する",
      position: { start: match.index, end: match.index + 3 },
      incorrectText: "...",
      suggestion: "文を完結させるか、適切な句点を使用してください",
      severity: "warning",
      category: "記号",
    });
  }

  return violations;
}
