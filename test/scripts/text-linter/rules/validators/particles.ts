// 助詞の使い分け関連のバリデーター
import type { Violation } from "../../types";

export function validateParticles(text: string): Violation[] {
  const violations: Violation[] = [];

  // GENERAL-74: 格助詞をむやみに省略しない
  const particleOmissionPatterns = [
    { pattern: /項目名変更/g, incorrect: "項目名変更", correct: "項目名を変更" },
    { pattern: /操作完了したら/g, incorrect: "操作完了したら", correct: "操作が完了したら" },
    { pattern: /設定変更/g, incorrect: "設定変更", correct: "設定を変更" },
    { pattern: /ファイル削除/g, incorrect: "ファイル削除", correct: "ファイルを削除" },
    { pattern: /データ保存/g, incorrect: "データ保存", correct: "データを保存" },
  ];

  particleOmissionPatterns.forEach(({ pattern, incorrect, correct }) => {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(text)) !== null) {
      violations.push({
        ruleId: "GENERAL-74",
        description: "格助詞をむやみに省略しない",
        position: { start: match.index, end: match.index + incorrect.length },
        incorrectText: incorrect,
        suggestion: correct,
        severity: "warning",
        category: "格助詞を省略しない",
      });
    }
  });

  // GENERAL-29: 「に」は動作の到着点、「へ」は方向
  // 変換・移動などの到着点には「に」を使うべき
  // 具体的な場所（一覧、画面、ページなど）への移動は「に」を使う
  const niHePatterns = [
    { pattern: /([をが])(.{1,10})へ(変換|移動|追加|設定|登録|保存|アップロード)/g, particle: "へ", correct: "に" },
    {
      pattern: /(一覧|画面|ページ|TOP|トップ|メニュー|ダッシュボード)へ(戻る|移動|遷移|進む)/g,
      particle: "へ",
      correct: "に",
    },
  ];

  niHePatterns.forEach(({ pattern, correct }) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const particleIndex = match.index + match[0].lastIndexOf("へ");
      violations.push({
        ruleId: "GENERAL-29",
        description: '"に"は動作の到着点を示し、"へ"は方向を示すために用いる',
        position: { start: particleIndex, end: particleIndex + 1 },
        incorrectText: "へ",
        suggestion: correct,
        severity: "warning",
        category: "日本語の使い分け",
      });
    }
  });

  // GENERAL-30: 「より」は比較、「から」は始点
  const yoriKaraPatterns = [
    { pattern: /(フォルダ|ディレクトリ|ファイル|リスト|一覧)より(選択|取得|読み込み|インポート)/g },
  ];

  yoriKaraPatterns.forEach(({ pattern }) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const particleIndex = match.index + match[1].length;
      violations.push({
        ruleId: "GENERAL-30",
        description: '"より"は比較を示し、"から"は始点を示すために用いる',
        position: { start: particleIndex, end: particleIndex + 2 },
        incorrectText: "より",
        suggestion: "から",
        severity: "warning",
        category: "日本語の使い分け",
      });
    }
  });

  // GENERAL-31: 「で」は限定を示すときだけ
  // 「〜一覧で選択」→「〜一覧から選択」
  const dePatterns = [{ pattern: /(一覧|リスト|画面|ページ)で(選択|確認|設定)/g }];

  dePatterns.forEach(({ pattern }) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const particleIndex = match.index + match[1].length;
      violations.push({
        ruleId: "GENERAL-31",
        description: '"で"は限定を示すときだけに用いる。それ以外のときは他の表現を用いる',
        position: { start: particleIndex, end: particleIndex + 1 },
        incorrectText: "で",
        suggestion: "から",
        severity: "warning",
        category: "日本語の使い分け",
      });
    }
  });

  return violations;
}
