// 音情報のみの操作案内関連のバリデーター
import type { Violation } from "../../types";

export function validateSoundOnlyInstruction(text: string): Violation[] {
  const violations: Violation[] = [];

  // GENERAL-11: 音の情報に限定した操作案内をしない
  const soundOnlyPatterns = [
    {
      pattern: /(?:カチッ|ガチャ|ピッ|ポン|ビープ)(?:と|という)?音(?:がする|が鳴る)?まで/g,
      sound: "擬音",
    },
    {
      pattern: /音(?:がする|が鳴る|が聞こえる)(?:まで|とき|たら)/g,
      sound: "音",
    },
    {
      pattern: /(?:クリック|タップ|スワイプ)(?:音|の音)(?:がする|が鳴る)(?:まで|とき|たら)/g,
      sound: "操作音",
    },
  ];

  soundOnlyPatterns.forEach(({ pattern, sound }) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      violations.push({
        ruleId: "GENERAL-11",
        description: "音の情報に限定した操作案内をしない",
        position: { start: match.index, end: match.index + match[0].length },
        incorrectText: match[0],
        suggestion: "視覚的なフィードバック（表示、変化など）も追加してください",
        severity: "warning",
        category: "不適切な表現",
      });
    }
  });

  return violations;
}
