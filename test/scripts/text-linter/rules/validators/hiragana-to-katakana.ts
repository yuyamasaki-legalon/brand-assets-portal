// 外来語のひらがな表記関連のバリデーター
import type { Violation } from "../../types";

export function validateHiraganaToKatakana(text: string): Violation[] {
  const violations: Violation[] = [];

  // GENERAL-17: 外来語、擬音語、擬態語には、カタカナを用いる
  const hiraganaToKatakanaPatterns = [
    { pattern: /ぼたん/g, incorrect: "ぼたん", correct: "ボタン" },
    { pattern: /めにゅー/g, incorrect: "めにゅー", correct: "メニュー" },
    { pattern: /ふぁいる/g, incorrect: "ふぁいる", correct: "ファイル" },
    { pattern: /だいあろぐ/g, incorrect: "だいあろぐ", correct: "ダイアログ" },
    { pattern: /ぺーじ/g, incorrect: "ぺーじ", correct: "ページ" },
    { pattern: /てきすと/g, incorrect: "てきすと", correct: "テキスト" },
    { pattern: /りんく/g, incorrect: "りんく", correct: "リンク" },
    { pattern: /めっせーじ/g, incorrect: "めっせーじ", correct: "メッセージ" },
    { pattern: /えらー/g, incorrect: "えらー", correct: "エラー" },
    { pattern: /ゆーざー/g, incorrect: "ゆーざー", correct: "ユーザー" },
    // 擬音語・擬態語
    { pattern: /ぴかぴか/g, incorrect: "ぴかぴか", correct: "ピカピカ" },
    { pattern: /きらきら/g, incorrect: "きらきら", correct: "キラキラ" },
    { pattern: /がちゃがちゃ/g, incorrect: "がちゃがちゃ", correct: "ガチャガチャ" },
  ];

  hiraganaToKatakanaPatterns.forEach(({ pattern, incorrect, correct }) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      violations.push({
        ruleId: "GENERAL-17",
        description: "外来語、擬音語、擬態語には、カタカナを用いる",
        position: { start: match.index, end: match.index + incorrect.length },
        incorrectText: incorrect,
        suggestion: correct,
        severity: "error",
        category: "カタカナ語",
      });
    }
  });

  return violations;
}
