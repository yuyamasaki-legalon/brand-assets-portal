// 漢字/ひらがな関連のバリデーター
import type { Violation } from "../../types";

// GENERAL-6: 助動詞及び助詞はひらがなにする
const auxiliaryMap: Record<string, string> = {
  無い: "ない",
  様だ: "ようだ",
  位: "くらい",
  程: "ほど",
};

// GENERAL-7: その他ひらがなにする語句
// 見出し（タグ内テキストが単独で「その他」の場合）は許容するため、コンテキスト判定を入れる
// 前後の文字を考慮して誤検出を防ぐ
const hiraganaPatterns: Array<{ pattern: RegExp; incorrect: string; correct: string }> = [
  { pattern: /有る/g, incorrect: "有る", correct: "ある" },
  { pattern: /居る/g, incorrect: "居る", correct: "いる" },
  { pattern: /出来る/g, incorrect: "出来る", correct: "できる" },
  { pattern: /通り/g, incorrect: "通り", correct: "とおり" },
  { pattern: /共に/g, incorrect: "共に", correct: "ともに" },
  { pattern: /及び/g, incorrect: "及び", correct: "および" },
  { pattern: /並びに/g, incorrect: "並びに", correct: "ならびに" },
  { pattern: /又は/g, incorrect: "又は", correct: "または" },
  { pattern: /若しくは/g, incorrect: "若しくは", correct: "もしくは" },
  { pattern: /に付いて/g, incorrect: "に付いて", correct: "について" },

  // 1文字パターン：前後がひらがなでない場合のみマッチ
  // 「事」: 「この事」「その事」などで使われるが、「大事」「事実」などは除外
  { pattern: /(?<![ぁ-んァ-ヶ一-龯])事(?![ぁ-んァ-ヶ一-龯実態])/g, incorrect: "事", correct: "こと" },

  // 「時」: 「この時」などで使われるが、「時間」「同時」などは除外
  { pattern: /(?<![ぁ-んァ-ヶ一-龯])時(?![ぁ-んァ-ヶ一-龯間刻代点])(?![間刻])/g, incorrect: "時", correct: "とき" },

  // 「他」: 「その他」のみ検出
  { pattern: /(?:その|この|あの|どの)他(?![ぁ-んァ-ヶ一-龯])/g, incorrect: "他", correct: "ほか" },

  // 「尚」: 接続詞として単独で使われる場合
  { pattern: /(?<![ぁ-んァ-ヶ一-龯])尚(?:[、。，]|\s)/g, incorrect: "尚", correct: "なお" },
];

// GENERAL-33: 補助動詞の「ください」はひらがな
const kudasaiPattern = /下さい/g;

// GENERAL-57: 「ヶ」「ヵ」→「か」
const kaPattern = /[ヶヵ]/g;

// GENERAL-69: 常用漢字表にない読み方
const nonStandardReadings: Array<{ pattern: RegExp; incorrect: string; correct: string }> = [
  { pattern: /想い/g, incorrect: "想い", correct: "思い" },
  { pattern: /旧い/g, incorrect: "旧い", correct: "古い" },
];

const findPrevNonWhitespaceChar = (text: string, index: number) => {
  for (let i = index - 1; i >= 0; i -= 1) {
    if (!/\s/.test(text[i])) return text[i];
  }
  return "";
};

const findNextNonWhitespaceChar = (text: string, index: number) => {
  for (let i = index; i < text.length; i += 1) {
    if (!/\s/.test(text[i])) return text[i];
  }
  return "";
};

export function validateKanjiToHiragana(text: string): Violation[] {
  const violations: Violation[] = [];

  // GENERAL-6: 助動詞・助詞チェック
  const isKanji = (char: string) => /[一-龯]/.test(char);
  // 熟語として除外するパターン（例: 規程, 工程, 行程, 日程, 課程, 過程）
  const excludePatterns: Record<string, RegExp> = {
    程: /[規工行日課過]/,
  };
  Object.entries(auxiliaryMap).forEach(([kanji, hiragana]) => {
    const regex = new RegExp(kanji, "g");
    let match;
    while ((match = regex.exec(text)) !== null) {
      const prevChar = text[match.index - 1] || "";
      const nextChar = text[match.index + kanji.length] || "";
      // 前後両方が漢字の場合は助詞・助動詞ではないので除外
      if (isKanji(prevChar) && isKanji(nextChar)) {
        continue;
      }
      // 特定の熟語パターン（例: 規程, 工程）は除外
      if (excludePatterns[kanji]?.test(prevChar)) {
        continue;
      }
      violations.push({
        ruleId: "GENERAL-6",
        description: "助動詞及び助詞はひらがなにする",
        position: { start: match.index, end: match.index + kanji.length },
        incorrectText: kanji,
        suggestion: hiragana,
        severity: "error",
        category: "漢字とひらがな",
      });
    }
  });

  // GENERAL-7: その他の語句（改善版）
  hiraganaPatterns.forEach(({ pattern, incorrect, correct }) => {
    let match;
    // 正規表現のlastIndexをリセット
    pattern.lastIndex = 0;
    while ((match = pattern.exec(text)) !== null) {
      // 「その他」は文中のみ検出し、見出し・ラベルの単独使用は許容する
      if (incorrect === "他") {
        const prev = findPrevNonWhitespaceChar(text, match.index);
        const next = findNextNonWhitespaceChar(text, match.index + match[0].length);
        const contextPattern = /[ぁ-んァ-ヶ一-龯。、，,.?？!！・]/;
        // 文脈がなくタグ内に単独で置かれている場合はスキップ
        if ((prev === ">" && next === "<") || (!contextPattern.test(prev) && !contextPattern.test(next))) {
          continue;
        }
      }

      violations.push({
        ruleId: "GENERAL-7",
        description: "その他例に挙げる語句はひらがなにする",
        position: { start: match.index, end: match.index + match[0].length },
        incorrectText: match[0],
        suggestion: correct,
        severity: "error",
        category: "漢字とひらがな",
      });
    }
  });

  // GENERAL-33: 「ください」
  let match;
  while ((match = kudasaiPattern.exec(text)) !== null) {
    violations.push({
      ruleId: "GENERAL-33",
      description: "補助動詞の「ください」はひらがな表記にする",
      position: { start: match.index, end: match.index + 3 },
      incorrectText: "下さい",
      suggestion: "ください",
      severity: "error",
      category: "漢字とひらがな",
    });
  }

  // GENERAL-57: 「ヶ」「ヵ」→「か」
  kudasaiPattern.lastIndex = 0;
  while ((match = kaPattern.exec(text)) !== null) {
    violations.push({
      ruleId: "GENERAL-57",
      description: "「ヶ」と「ヵ」は使わず、「か」を使用する",
      position: { start: match.index, end: match.index + 1 },
      incorrectText: match[0],
      suggestion: "か",
      severity: "error",
      category: "漢字とひらがな",
    });
  }

  // GENERAL-69: 常用漢字表にない読み方
  nonStandardReadings.forEach(({ pattern, incorrect, correct }) => {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(text)) !== null) {
      violations.push({
        ruleId: "GENERAL-69",
        description: "常用漢字表にない読み方は使用しない",
        position: { start: match.index, end: match.index + incorrect.length },
        incorrectText: incorrect,
        suggestion: correct,
        severity: "error",
        category: "常用漢字表",
      });
    }
  });

  return violations;
}
