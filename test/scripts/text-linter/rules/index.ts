// ルールエンジン統合
import type { TextContext, Violation } from "../types";
import { validateAbstractLink } from "./validators/abstract-link";
import { validateAdjectiveAdverb } from "./validators/adjective-adverb";
import { validateApology } from "./validators/apology";
import { validateBrackets } from "./validators/brackets";
import { validateColorOnlyInstruction } from "./validators/color-only-instruction";
import { validateConjunctions } from "./validators/conjunctions";
import { validateDateTime } from "./validators/datetime";
import { validateDoubleNegation } from "./validators/double-negation";
import { validateEllipsis } from "./validators/ellipsis";
import { validateExcessiveHonorifics } from "./validators/excessive-honorifics";
import { validateHiraganaToKatakana } from "./validators/hiragana-to-katakana";
import { validateKanjiToHiragana } from "./validators/kanji";
import { validateKatakana } from "./validators/katakana";
import { validateKatakanaToJapanese } from "./validators/katakana-japanese";
import { validateLargeNumberUnits } from "./validators/large-number-units";
import { validateLongSentence } from "./validators/long-sentence";
import { validateNegativeTerminology } from "./validators/negative-terminology";
import { validateNonStandardKanji } from "./validators/non-standard-kanji";
import { validateNumberFormat } from "./validators/number";
import { validateOkurigana } from "./validators/okurigana";
import { validateParticles } from "./validators/particles";
import { validatePassiveVoice } from "./validators/passive-voice";
import { validateRedundancy } from "./validators/redundancy";
import { validateRedundantSuffix } from "./validators/redundant-suffix";
import { validateSnackbarPeriod } from "./validators/snackbar-period";
import { validateSoundOnlyInstruction } from "./validators/sound-only-instruction";
import { validateSpacing } from "./validators/spacing";
import { validateSymbol } from "./validators/symbol";
import { validateSynonymConsistency } from "./validators/synonym-consistency";
import { validateVagueError } from "./validators/vague-error";
import { validateVagueTerminology } from "./validators/vague-terminology";

export function validateText(text: string, context?: TextContext): Violation[] {
  const allViolations: Violation[] = [];

  // 全バリデーターを実行
  allViolations.push(...validateKanjiToHiragana(text));
  allViolations.push(...validateNumberFormat(text));
  allViolations.push(...validateKatakana(text));
  allViolations.push(...validateDateTime(text));
  allViolations.push(...validateSymbol(text));
  allViolations.push(...validateParticles(text));
  allViolations.push(...validateRedundancy(text));
  allViolations.push(...validateKatakanaToJapanese(text));
  allViolations.push(...validateOkurigana(text));
  allViolations.push(...validateConjunctions(text));
  allViolations.push(...validateSpacing(text));
  allViolations.push(...validateDoubleNegation(text));
  allViolations.push(...validateNonStandardKanji(text));
  allViolations.push(...validateApology(text));
  allViolations.push(...validateHiraganaToKatakana(text));
  allViolations.push(...validateEllipsis(text));
  allViolations.push(...validateBrackets(text));
  allViolations.push(...validateExcessiveHonorifics(text));
  allViolations.push(...validatePassiveVoice(text));
  allViolations.push(...validateAbstractLink(text));
  allViolations.push(...validateRedundantSuffix(text));
  allViolations.push(...validateLargeNumberUnits(text));
  allViolations.push(...validateLongSentence(text));
  allViolations.push(...validateVagueError(text));
  allViolations.push(...validateSnackbarPeriod(text, context));
  allViolations.push(...validateColorOnlyInstruction(text));
  allViolations.push(...validateSoundOnlyInstruction(text));
  allViolations.push(...validateNegativeTerminology(text));
  allViolations.push(...validateVagueTerminology(text));
  allViolations.push(...validateSynonymConsistency(text));
  allViolations.push(...validateAdjectiveAdverb(text));

  // ポジションでソート
  allViolations.sort((a, b) => a.position.start - b.position.start);

  return allViolations;
}

// 修正を適用する関数
export function applyFix(text: string, violation: Violation): string {
  const before = text.substring(0, violation.position.start);
  const after = text.substring(violation.position.end);
  return before + violation.suggestion + after;
}

// すべての修正を一括適用
export function applyAllFixes(text: string, violations: Violation[]): string {
  // 後ろから適用していくことで、位置のズレを防ぐ
  const sortedViolations = [...violations].sort((a, b) => b.position.start - a.position.start);

  let result = text;
  for (const violation of sortedViolations) {
    result = applyFix(result, violation);
  }

  return result;
}
