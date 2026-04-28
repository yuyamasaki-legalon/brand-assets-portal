// 形容詞と副詞の使い分け関連のバリデーター
import type { Violation } from "../../types";

export function validateAdjectiveAdverb(text: string): Violation[] {
  const violations: Violation[] = [];

  // GENERAL-23: 動作や変化を示す文では、形容詞ではなく副詞を使う
  // パターン: 形容詞 + する/できる/なる
  const adjectiveToAdverbPatterns = [
    {
      pattern: /明るい(?:する|します|でき|なり)/g,
      incorrect: "明るい",
      correct: "明るく",
    },
    {
      pattern: /暗い(?:する|します|でき|なり)/g,
      incorrect: "暗い",
      correct: "暗く",
    },
    {
      pattern: /大きい(?:する|します|でき|なり)/g,
      incorrect: "大きい",
      correct: "大きく",
    },
    {
      pattern: /小さい(?:する|します|でき|なり)/g,
      incorrect: "小さい",
      correct: "小さく",
    },
    {
      pattern: /高い(?:する|します|でき|なり)/g,
      incorrect: "高い",
      correct: "高く",
    },
    {
      pattern: /低い(?:する|します|でき|なり)/g,
      incorrect: "低い",
      correct: "低く",
    },
    {
      pattern: /速い(?:する|します|でき|なり)/g,
      incorrect: "速い",
      correct: "速く",
    },
    {
      pattern: /遅い(?:する|します|でき|なり)/g,
      incorrect: "遅い",
      correct: "遅く",
    },
    {
      pattern: /強い(?:する|します|でき|なり)/g,
      incorrect: "強い",
      correct: "強く",
    },
    {
      pattern: /弱い(?:する|します|でき|なり)/g,
      incorrect: "弱い",
      correct: "弱く",
    },
    {
      pattern: /新しい(?:する|します|でき|なり)/g,
      incorrect: "新しい",
      correct: "新しく",
    },
    {
      pattern: /古い(?:する|します|でき|なり)/g,
      incorrect: "古い",
      correct: "古く",
    },
    {
      pattern: /長い(?:する|します|でき|なり)/g,
      incorrect: "長い",
      correct: "長く",
    },
    {
      pattern: /短い(?:する|します|でき|なり)/g,
      incorrect: "短い",
      correct: "短く",
    },
    {
      pattern: /広い(?:する|します|でき|なり)/g,
      incorrect: "広い",
      correct: "広く",
    },
    {
      pattern: /狭い(?:する|します|でき|なり)/g,
      incorrect: "狭い",
      correct: "狭く",
    },
    {
      pattern: /深い(?:する|します|でき|なり)/g,
      incorrect: "深い",
      correct: "深く",
    },
    {
      pattern: /浅い(?:する|します|でき|なり)/g,
      incorrect: "浅い",
      correct: "浅く",
    },
    {
      pattern: /厚い(?:する|します|でき|なり)/g,
      incorrect: "厚い",
      correct: "厚く",
    },
    {
      pattern: /薄い(?:する|します|でき|なり)/g,
      incorrect: "薄い",
      correct: "薄く",
    },
  ];

  adjectiveToAdverbPatterns.forEach(({ pattern, incorrect, correct }) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const verbMatch = match[0].match(/(?:する|します|でき|なり)/);
      const verb = verbMatch ? verbMatch[0] : "";
      violations.push({
        ruleId: "GENERAL-23",
        description: "動作や変化を示す文では副詞を使う",
        position: { start: match.index, end: match.index + match[0].length },
        incorrectText: match[0],
        suggestion: `${correct}${verb}`,
        severity: "info",
        category: "不適切な表現",
      });
    }
  });

  return violations;
}
