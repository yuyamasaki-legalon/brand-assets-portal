// 同義語の統一性関連のバリデーター
import type { Violation } from "../../types";

export function validateSynonymConsistency(text: string): Violation[] {
  const violations: Violation[] = [];

  // GENERAL-15: 同義語は統一する（カタカナよりひらがな・漢字を推奨）
  const synonymPatterns: Array<{
    pattern: RegExp;
    incorrect: string;
    correct: string;
    suggestion?: string;
  }> = [
    {
      pattern: /プリント(?:する|します|できる|可能|が|を|は|の)/g,
      incorrect: "プリント",
      correct: "印刷",
    },
    {
      pattern: /リフレッシュ(?:する|します|できる|可能|が|を|は|の)/g,
      incorrect: "リフレッシュ",
      correct: "更新",
    },
    {
      pattern: /クローズ(?:する|します|できる|可能|が|を|は|の)/g,
      incorrect: "クローズ",
      correct: "閉じる",
    },
    {
      pattern: /オープン(?:する|します|できる|可能|が|を|は|の)/g,
      incorrect: "オープン",
      correct: "開く",
    },
    {
      pattern: /ログアウト(?:する|します|できる|可能|が|を|は|の)/g,
      incorrect: "ログアウト",
      correct: "ログアウト",
      suggestion: "サインアウト",
    },
    {
      pattern: /フォルダー(?:を|が|は|の|に)/g,
      incorrect: "フォルダー",
      correct: "フォルダ",
    },
  ];

  synonymPatterns.forEach(({ pattern, incorrect, correct, suggestion }) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      violations.push({
        ruleId: "GENERAL-15",
        description: "同義語は統一する",
        position: { start: match.index, end: match.index + match[0].length },
        incorrectText: match[0],
        suggestion: suggestion ? `${suggestion}に統一してください` : `${correct}に統一してください`,
        severity: "info",
        category: "不適切な表現",
      });
    }
  });

  return violations;
}
