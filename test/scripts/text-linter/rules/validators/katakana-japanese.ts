// カタカナ→日本語変換のバリデーター
import type { Violation } from "../../types";

// GENERAL-9: カタカナ語より日本語を優先
const katakanaToJapaneseMap: Array<{ pattern: RegExp; katakana: string; japanese: string }> = [
  { pattern: /(?<![ァ-ヶ])オート(?![ァ-ヶ])/g, katakana: "オート", japanese: "自動" },
  { pattern: /(?<![ァ-ヶ])アウトプット(?![ァ-ヶ])/g, katakana: "アウトプット", japanese: "出力" },
  { pattern: /(?<![ァ-ヶ])インプット(?![ァ-ヶ])/g, katakana: "インプット", japanese: "入力" },
];

export function validateKatakanaToJapanese(text: string): Violation[] {
  const violations: Violation[] = [];

  katakanaToJapaneseMap.forEach(({ pattern, katakana, japanese }) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      violations.push({
        ruleId: "GENERAL-9",
        description: "英語または外来語と日本語の表記とが両方とも一般的な場合には、日本語を原則にする",
        position: { start: match.index, end: match.index + match[0].length },
        incorrectText: match[0],
        suggestion: japanese,
        severity: "info",
        category: "カタカナ語",
      });
    }
  });

  return violations;
}
