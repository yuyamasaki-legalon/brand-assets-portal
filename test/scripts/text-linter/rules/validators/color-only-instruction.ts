// 色情報のみの操作案内関連のバリデーター
import type { Violation } from "../../types";

export function validateColorOnlyInstruction(text: string): Violation[] {
  const violations: Violation[] = [];

  // GENERAL-10: 色の情報に限定した操作案内をしない
  const colorOnlyPatterns = [
    {
      pattern: /赤(?:い|色の)?(?:ボタン|ラベル|メッセージ|テキスト|アイコン|マーク|部分)/g,
      color: "赤",
    },
    {
      pattern: /青(?:い|色の)?(?:ボタン|ラベル|メッセージ|テキスト|アイコン|マーク|部分)/g,
      color: "青",
    },
    {
      pattern: /緑(?:色の)?(?:ボタン|ラベル|メッセージ|テキスト|アイコン|マーク|部分)/g,
      color: "緑",
    },
    {
      pattern: /黄(?:色の)?(?:ボタン|ラベル|メッセージ|テキスト|アイコン|マーク|部分)/g,
      color: "黄",
    },
    {
      pattern: /オレンジ(?:色の)?(?:ボタン|ラベル|メッセージ|テキスト|アイコン|マーク|部分)/g,
      color: "オレンジ",
    },
  ];

  colorOnlyPatterns.forEach(({ pattern, color }) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      violations.push({
        ruleId: "GENERAL-10",
        description: "色の情報に限定した操作案内をしない",
        position: { start: match.index, end: match.index + match[0].length },
        incorrectText: match[0],
        suggestion: "色以外の情報（位置、番号、名称など）も追加してください",
        severity: "warning",
        category: "不適切な表現",
      });
    }
  });

  return violations;
}
