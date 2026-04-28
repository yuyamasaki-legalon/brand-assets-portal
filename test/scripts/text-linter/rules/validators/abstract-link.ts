// 抽象的なリンクテキスト関連のバリデーター
import type { Violation } from "../../types";

export function validateAbstractLink(text: string): Violation[] {
  const violations: Violation[] = [];

  // GENERAL-55: テキストリンクの文言は、遷移先が推測できるようにする
  // 「こちら」「ここ」などの抽象的な単語を検出

  const abstractLinkPatterns = [
    {
      pattern:
        /(?:詳細は|詳しくは|詳しい(?:情報|内容)は)?(?:こちら|ココ|ここ)(?:から|を(?:クリック|タップ|参照|確認|ご覧))?/g,
      word: "こちら",
      suggestion: "具体的な遷移先を示すテキストに変更してください",
    },
    {
      pattern: /(?:詳細は|詳しくは)?(?:以下|下記)(?:の)?(?:リンク|URL)(?:から|を(?:クリック|タップ|参照|確認|ご覧))?/g,
      word: "以下のリンク",
      suggestion: "具体的な遷移先を示すテキストに変更してください",
    },
    {
      pattern: /(?:詳細は|詳しくは)?(?:次の|以下の)(?:ページ|画面|サイト)(?:から|を(?:参照|確認|ご覧))?/g,
      word: "次のページ",
      suggestion: "具体的なページ名を記載してください",
    },
  ];

  abstractLinkPatterns.forEach(({ pattern, word, suggestion }) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      violations.push({
        ruleId: "GENERAL-55",
        description: "リンクテキストは遷移先が推測できるようにする",
        position: { start: match.index, end: match.index + match[0].length },
        incorrectText: match[0],
        suggestion,
        severity: "warning",
        category: "TextLink",
      });
    }
  });

  return violations;
}
