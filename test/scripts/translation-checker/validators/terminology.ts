// 用語統一チェッカー
// ハイブリッドロジック:
//   検知: 日本語が含まれる → 誤訳パターンが存在する → 違反
//   自動修正: incorrect パターンがマッチ → 置換可能

import terminologyJson from "../glossary/terminology.json";
import type { TerminologyGlossary, TranslationEntry, TranslationViolation } from "../types";

const terminology = terminologyJson as TerminologyGlossary;

// 日本語キーワードの長い順にソートしたルール（部分一致の false positive を防ぐため）
const sortedRules = [...terminology.rules].sort((a, b) => b.ja.length - a.ja.length);

/**
 * 正規表現の特殊文字をエスケープ
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * 文字列が指定した単語を独立した単語として含むかチェック（大文字小文字を区別しない）
 * 単語境界（\b）を使用して、部分文字列としてのマッチを防ぐ
 * 例: "Files" は "Profiles" にマッチしないが、"Files list" にはマッチする
 *
 * 注意: \b は単語文字（\w = [a-zA-Z0-9_]）と非単語文字の境界にのみマッチする。
 * そのため、フレーズが非単語文字で始まる/終わる場合（例: "{xxxx}"）は、
 * その位置に \b を適用しない。
 */
function containsWordIgnoreCase(text: string, word: string): boolean {
  if (word.length === 0) return false;

  const escaped = escapeRegex(word);

  // 最初の文字が単語文字の場合のみ \b を適用
  const startBoundary = /^\w/.test(word) ? "\\b" : "";
  // 最後の文字が単語文字の場合のみ \b を適用
  const endBoundary = /\w$/.test(word) ? "\\b" : "";

  const pattern = new RegExp(`${startBoundary}${escaped}${endBoundary}`, "i");
  return pattern.test(text);
}

/**
 * 文字列内の部分文字列の全出現位置（開始インデックス）を取得
 */
function findAllOccurrences(text: string, search: string): number[] {
  const positions: number[] = [];
  let pos = text.indexOf(search);
  while (pos !== -1) {
    positions.push(pos);
    pos = text.indexOf(search, pos + 1);
  }
  return positions;
}

/**
 * ある位置が、既にマッチした範囲のいずれかに包含されるかチェック
 */
function isPositionCoveredByRanges(pos: number, len: number, ranges: Array<{ start: number; end: number }>): boolean {
  return ranges.some((range) => pos >= range.start && pos + len <= range.end);
}

/**
 * 英語テキスト内で部分文字列の全出現位置（開始インデックス）を取得（大文字小文字を区別しない）
 */
function findAllOccurrencesIgnoreCase(text: string, search: string): number[] {
  const positions: number[] = [];
  const lowerText = text.toLowerCase();
  const lowerSearch = search.toLowerCase();
  let pos = lowerText.indexOf(lowerSearch);
  while (pos !== -1) {
    positions.push(pos);
    pos = lowerText.indexOf(lowerSearch, pos + 1);
  }
  return positions;
}

/**
 * 英語テキストに含まれるすべての誤訳パターンを検出して返す
 * 長いパターンを優先し、短いパターンが長いパターンに包含される位置はスキップする
 * 独立して出現するパターンはすべて報告する
 */
function findAllIncorrectMatches(enText: string, incorrectPatterns: string[] | undefined): string[] {
  if (!incorrectPatterns) {
    return [];
  }

  // 長いパターンを優先（部分一致の重複を防ぐ）
  const sortedPatterns = [...incorrectPatterns].sort((a, b) => b.length - a.length);

  // マッチした位置を記録（重複検出を防ぐ）
  const matchedRanges: Array<{ start: number; end: number }> = [];
  const matchedPatterns: string[] = [];

  for (const pattern of sortedPatterns) {
    const positions = findAllOccurrencesIgnoreCase(enText, pattern);

    // このパターンの出現位置のうち、既にマッチした長いパターンに包含されていない位置があるか
    const uncoveredPositions = positions.filter(
      (pos) => !isPositionCoveredByRanges(pos, pattern.length, matchedRanges),
    );

    if (uncoveredPositions.length > 0) {
      // 未カバーの位置があれば、このパターンを報告対象に追加
      matchedPatterns.push(pattern);
      // マッチした位置を記録
      for (const pos of uncoveredPositions) {
        matchedRanges.push({ start: pos, end: pos + pattern.length });
      }
    }
  }

  return matchedPatterns;
}

/**
 * 翻訳エントリの用語を検証
 * 検知: 日本語テキストに特定のキーワードが含まれ、英語テキストに誤訳パターンが存在すれば違反
 * 自動修正: 違反の英語テキストに incorrect パターンがマッチしていれば自動修正可能
 *
 * 注意: 長い日本語キーワードを優先してチェックし、短いキーワードが長いキーワードの
 * 出現位置と完全に重複する場合のみ false positive を防ぐためスキップする。
 * 例: "案件名" → "Matter name" で "案件名" の位置の "案件" はスキップ
 *     しかし "案件名と案件" では独立した "案件" も検出される
 */
export function validateTerminology(entry: TranslationEntry): TranslationViolation[] {
  const violations: TranslationViolation[] = [];
  // マッチした日本語キーワードの位置を記録（長い順に処理するため、短いキーワードのスキップに使用）
  const matchedJaRanges: Array<{ start: number; end: number }> = [];

  for (const rule of sortedRules) {
    // 日本語テキストにルールの日本語キーワードが含まれているかチェック
    const jaPositions = findAllOccurrences(entry.jaText, rule.ja);
    if (jaPositions.length === 0) {
      continue;
    }

    // このキーワードの出現位置のうち、既にマッチした長いキーワードに包含されていない位置があるか
    const uncoveredPositions = jaPositions.filter(
      (pos) => !isPositionCoveredByRanges(pos, rule.ja.length, matchedJaRanges),
    );

    if (uncoveredPositions.length === 0) {
      // すべての出現位置が既にマッチした長いキーワードに包含されている → スキップ
      continue;
    }

    // このルールの日本語キーワードの位置を記録（未カバーの位置のみ）
    for (const pos of uncoveredPositions) {
      matchedJaRanges.push({ start: pos, end: pos + rule.ja.length });
    }

    // 誤訳パターンがマッチするかチェック（すべてのマッチを検出）
    const matchedIncorrects = findAllIncorrectMatches(entry.enText, rule.incorrect);

    if (matchedIncorrects.length > 0) {
      // 誤訳パターンが存在 → 各パターンに対して違反を報告（正訳の有無に関わらず）
      for (const matchedIncorrect of matchedIncorrects) {
        const violation: TranslationViolation = {
          ruleId: rule.id,
          messageKey: entry.key,
          expectedText: rule.correct,
          actualText: entry.enText,
          severity: rule.severity,
          description: `"${rule.ja}" should be translated as "${rule.correct}"`,
          autoFix: true,
          incorrectText: matchedIncorrect,
        };
        violations.push(violation);
      }
    } else if (!containsWordIgnoreCase(entry.enText, rule.correct)) {
      // 正訳も誤訳もない → 違反（自動修正不可）
      const violation: TranslationViolation = {
        ruleId: rule.id,
        messageKey: entry.key,
        expectedText: rule.correct,
        actualText: entry.enText,
        severity: rule.severity,
        description: `"${rule.ja}" should be translated as "${rule.correct}"`,
      };
      violations.push(violation);
    }
    // 正訳があり誤訳がない → 違反なし
  }

  return violations;
}

/**
 * 複数の翻訳エントリを一括で検証
 */
export function validateAllTerminology(entries: TranslationEntry[]): TranslationViolation[] {
  const allViolations: TranslationViolation[] = [];

  for (const entry of entries) {
    allViolations.push(...validateTerminology(entry));
  }

  return allViolations;
}
