// スペーシング関連のバリデーター
import type { Violation } from "../../types";

export function validateSpacing(text: string): Violation[] {
  const violations: Violation[] = [];

  // GENERAL-143: 日本語で単位をつけるとき、原則数字と単位の間にスペースを入れない
  // 半角数字 + 半角スペース + 日本語単位
  const japaneseUnitWithSpacePattern =
    /(\d+)\s+(年|月|日|時|分|秒|件|回|名|個|円|台|枚|本|冊|ページ|行|列|桁|文字|バイト|KB|MB|GB|TB)/g;
  let match;
  while ((match = japaneseUnitWithSpacePattern.exec(text)) !== null) {
    const number = match[1];
    const unit = match[2];
    const fullMatch = match[0];

    violations.push({
      ruleId: "GENERAL-143",
      description: "日本語で単位をつけるとき、原則数字と単位の間にスペースを入れない",
      position: { start: match.index, end: match.index + fullMatch.length },
      incorrectText: fullMatch,
      suggestion: `${number}${unit}`,
      severity: "error",
      category: "数値・単位・拡張子・日付・時刻",
    });
  }

  // GENERAL-144: 英語で単位をつけるとき、数字と単位の間に原則スペースを入れる
  // 半角数字 + 英語単位（スペースなし）
  // 例外: %, ℃, K などの1文字単位はスペースなし
  const englishUnitWithoutSpacePattern =
    /(\d+)(years|months|days|hours|minutes|seconds|items|times|people|bytes|kilobytes|megabytes|gigabytes|terabytes|ms|kg|km|cm|mm)/gi;
  japaneseUnitWithSpacePattern.lastIndex = 0;
  while ((match = englishUnitWithoutSpacePattern.exec(text)) !== null) {
    const number = match[1];
    const unit = match[2];
    const fullMatch = match[0];

    violations.push({
      ruleId: "GENERAL-144",
      description: "英語で単位をつけるとき、数字と単位の間に原則スペースを入れる",
      position: { start: match.index, end: match.index + fullMatch.length },
      incorrectText: fullMatch,
      suggestion: `${number} ${unit}`,
      severity: "error",
      category: "数値・単位・拡張子・日付・時刻",
    });
  }

  return violations;
}
