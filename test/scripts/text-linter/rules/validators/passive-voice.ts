// 受動態関連のバリデーター
import type { Violation } from "../../types";

export function validatePassiveVoice(text: string): Violation[] {
  const violations: Violation[] = [];

  // GENERAL-50: 受動態を避け、シンプルで直接的な表現を使う
  // 受動態のパターン: 〜されます、〜られます、〜が表示されます など

  const passiveVoicePatterns = [
    {
      // 「〜が表示されます」→「〜を表示します」
      pattern: /([ぁ-んァ-ヶ一-龯]+)が(?:表示|表記|記載|記録|保存|登録|追加|削除|変更|更新|反映)されます/g,
      getCorrection: (match: RegExpExecArray) => `${match[1]}を表示します`,
    },
    {
      // 「〜が選択されます」→「〜を選択します」
      pattern: /([ぁ-んァ-ヶ一-龯]+)が(?:選択|指定|設定)されます/g,
      getCorrection: (match: RegExpExecArray) => `${match[1]}を選択します`,
    },
    {
      // 「〜が実行されます」→「〜を実行します」
      pattern: /([ぁ-んァ-ヶ一-龯]+)が(?:実行|処理|起動|開始|終了|完了)されます/g,
      getCorrection: (match: RegExpExecArray) => `${match[1]}を実行します`,
    },
    {
      // 「〜が送信されます」→「〜を送信します」
      pattern: /([ぁ-んァ-ヶ一-龯]+)が(?:送信|送付|通知|配信)されます/g,
      getCorrection: (match: RegExpExecArray) => `${match[1]}を送信します`,
    },
  ];

  passiveVoicePatterns.forEach(({ pattern, getCorrection }) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const suggestion = getCorrection(match);

      violations.push({
        ruleId: "GENERAL-50",
        description: "受動態を避け、シンプルで直接的な表現を使う",
        position: { start: match.index, end: match.index + match[0].length },
        incorrectText: match[0],
        suggestion,
        severity: "info",
        category: "文章の書き方",
      });
    }
  });

  return violations;
}
