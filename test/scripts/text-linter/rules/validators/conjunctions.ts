// 接続詞・列挙関連のバリデーター
import type { Violation } from "../../types";

export function validateConjunctions(text: string): Violation[] {
  const violations: Violation[] = [];

  // GENERAL-32: 2つの要素を列挙する場合は「と」「または」を使用し、読点（、）は使用しない
  // より厳密なパターン: 名詞、名詞の後に助詞「を」「が」が続き、その後に動詞が続かない場合のみ
  // 動詞が続く場合（例：「契約書を終了する」）は列挙ではない
  // 副詞や接続詞の後の読点は除外（例：「予め、非表示にする」「まず、確認する」）
  const twoItemCommaPattern =
    /([一-龯ぁ-んァ-ヶa-zA-Z0-9]{2,})、([一-龯ぁ-んァ-ヶa-zA-Z0-9]{2,})(?=[をが](?![一-龯ぁ-んァ-ヶ]{1,10}する|[一-龯ぁ-んァ-ヶ]{1,10}します|[一-龯ぁ-んァ-ヶ]{1,10}した))/g;

  // 副詞や接続詞のリスト（これらの後の読点は列挙ではない）
  const adverbs = [
    "予め",
    "あらかじめ",
    "まず",
    "次に",
    "そして",
    "また",
    "さらに",
    "ただし",
    "なお",
    "ちなみに",
    "例えば",
    "もし",
    "特に",
    "必ず",
    "最初に",
    "最後に",
    "同時に",
    "すでに",
    "既に",
    "もちろん",
  ];

  let match;
  while ((match = twoItemCommaPattern.exec(text)) !== null) {
    const firstItem = match[1];

    // 最初の要素が副詞や接続詞の場合はスキップ
    if (adverbs.includes(firstItem)) {
      continue;
    }

    // 3つ以上の列挙でないことを確認（前に「、」がないか）
    const beforeText = text.substring(Math.max(0, match.index - 20), match.index);
    if (!beforeText.includes("、")) {
      const fullMatch = match[0];
      const afterIndex = match.index + fullMatch.length;
      const afterText = text.substring(afterIndex, Math.min(afterIndex + 15, text.length));

      // 後ろに動詞が続く場合はスキップ（例：「を終了する」「を確認します」）
      if (/^[をが][一-龯ぁ-んァ-ヶ]{1,10}(する|します|した|して|させ|され|でき)/.test(afterText)) {
        continue;
      }

      // 後ろに続く文脈から「と」「または」のどちらが適切か推測
      const suggestion = fullMatch.replace("、", "と");

      violations.push({
        ruleId: "GENERAL-32",
        description: "2つの要素を列挙する場合は、「と」「または」を使用し、読点（、）は使用しない",
        position: { start: match.index, end: match.index + fullMatch.length },
        incorrectText: fullMatch,
        suggestion: suggestion,
        severity: "warning",
        category: "日本語の使い分け",
      });
    }
  }

  // GENERAL-178: 3つ以上の要素を列挙する場合、最後の要素の前に「、および」「、または」
  // パターン: 名詞、名詞、名詞（最後の要素の前に「、および」「、または」がない）
  const threeItemPattern =
    /([一-龯ぁ-んァ-ヶa-zA-Z0-9]+)、([一-龯ぁ-んァ-ヶa-zA-Z0-9]+)、([一-龯ぁ-んァ-ヶa-zA-Z0-9]+)(?![、])/g;
  twoItemCommaPattern.lastIndex = 0;
  while ((match = threeItemPattern.exec(text)) !== null) {
    const item1 = match[1];
    const item2 = match[2];
    const item3 = match[3];
    const fullMatch = match[0];

    // 最後の「、」の後に「および」「または」がついていない場合
    if (!fullMatch.includes("、および") && !fullMatch.includes("、または")) {
      const suggestion = `${item1}、${item2}、および${item3}`;

      violations.push({
        ruleId: "GENERAL-178",
        description: "3つ以上の要素を列挙する場合は、最後の要素の前にのみ「、および」または「、または」を使用する",
        position: { start: match.index, end: match.index + fullMatch.length },
        incorrectText: fullMatch,
        suggestion: suggestion,
        severity: "warning",
        category: "正しい文法表現",
      });
    }
  }

  return violations;
}
