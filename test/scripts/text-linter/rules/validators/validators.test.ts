import { describe, expect, it } from "vitest";
import { validateAbstractLink } from "./abstract-link";
import { validateAdjectiveAdverb } from "./adjective-adverb";
import { validateApology } from "./apology";
import { validateBrackets } from "./brackets";
import { validateColorOnlyInstruction } from "./color-only-instruction";
import { validateConjunctions } from "./conjunctions";
import { validateDateTime } from "./datetime";
import { validateDoubleNegation } from "./double-negation";
import { validateEllipsis } from "./ellipsis";
import { validateExcessiveHonorifics } from "./excessive-honorifics";
import { validateHiraganaToKatakana } from "./hiragana-to-katakana";
import { validateKanjiToHiragana } from "./kanji";
import { validateKatakana } from "./katakana";
import { validateKatakanaToJapanese } from "./katakana-japanese";
import { validateLargeNumberUnits } from "./large-number-units";
import { validateLongSentence } from "./long-sentence";
import { validateNegativeTerminology } from "./negative-terminology";
import { validateNonStandardKanji } from "./non-standard-kanji";
import { validateNumberFormat } from "./number";
import { validateOkurigana } from "./okurigana";
import { validateParticles } from "./particles";
import { validatePassiveVoice } from "./passive-voice";
import { validateRedundancy } from "./redundancy";
import { validateRedundantSuffix } from "./redundant-suffix";
import { validateSnackbarPeriod } from "./snackbar-period";
import { validateSoundOnlyInstruction } from "./sound-only-instruction";
import { validateSpacing } from "./spacing";
import { validateSymbol } from "./symbol";
import { validateSynonymConsistency } from "./synonym-consistency";
import { validateVagueError } from "./vague-error";
import { validateVagueTerminology } from "./vague-terminology";

// ============================================
// validateKanjiToHiragana (kanji.ts)
// ============================================
describe("validateKanjiToHiragana", () => {
  describe("GENERAL-6: 助動詞及び助詞はひらがなにする", () => {
    it("「無い」を検出する", () => {
      const result = validateKanjiToHiragana("データが無い場合");
      expect(result.some((v) => v.ruleId === "GENERAL-6" && v.incorrectText === "無い")).toBe(true);
    });

    it("「程」を検出する", () => {
      const result = validateKanjiToHiragana("1週間程かかります");
      expect(result.some((v) => v.ruleId === "GENERAL-6" && v.incorrectText === "程")).toBe(true);
    });

    it("漢字と連続する「程」は検出しない", () => {
      const result = validateKanjiToHiragana("社内規程を確認してください");
      expect(result.filter((v) => v.ruleId === "GENERAL-6" && v.incorrectText === "程")).toHaveLength(0);
    });
  });

  describe("GENERAL-7: その他例に挙げる語句はひらがなにする", () => {
    it("「出来る」を検出する", () => {
      const result = validateKanjiToHiragana("設定が出来る");
      expect(result.some((v) => v.ruleId === "GENERAL-7" && v.incorrectText === "出来る")).toBe(true);
    });

    it("「その他」を検出する", () => {
      // 「その他」の後にひらがな・カタカナ・漢字が続かない場合に検出
      const result = validateKanjiToHiragana("その他 に関して");
      expect(result.some((v) => v.ruleId === "GENERAL-7" && v.incorrectText === "その他")).toBe(true);
    });
  });

  describe("GENERAL-33: 「ください」はひらがなで表記", () => {
    it("「下さい」を検出する", () => {
      const result = validateKanjiToHiragana("確認して下さい");
      expect(result.some((v) => v.ruleId === "GENERAL-33" && v.incorrectText === "下さい")).toBe(true);
    });
  });
});

// ============================================
// validateNumberFormat (number.ts)
// ============================================
describe("validateNumberFormat", () => {
  describe("GENERAL-18: 半角数字を使用", () => {
    it("全角数字を検出する", () => {
      const result = validateNumberFormat("１２３件のデータ");
      expect(result.some((v) => v.ruleId === "GENERAL-18")).toBe(true);
    });

    it("半角数字は検出しない", () => {
      const result = validateNumberFormat("123件のデータ");
      expect(result.filter((v) => v.ruleId === "GENERAL-18")).toHaveLength(0);
    });
  });

  describe("GENERAL-19: 桁区切りカンマ", () => {
    it("4桁以上の数字でカンマがない場合を検出する", () => {
      const result = validateNumberFormat("10000件");
      expect(result.some((v) => v.ruleId === "GENERAL-19")).toBe(true);
    });

    it("カンマ区切りの数字は検出しない", () => {
      const result = validateNumberFormat("10,000件");
      expect(result.filter((v) => v.ruleId === "GENERAL-19")).toHaveLength(0);
    });
  });
});

// ============================================
// validateKatakana (katakana.ts)
// ============================================
describe("validateKatakana", () => {
  describe("GENERAL-34: -er 語尾は長音符号を使用", () => {
    it("「ユーザ」を検出する", () => {
      const result = validateKatakana("ユーザが設定");
      expect(result.some((v) => v.ruleId === "GENERAL-34" && v.suggestion === "ユーザー")).toBe(true);
    });

    it("「ユーザー」は検出しない", () => {
      const result = validateKatakana("ユーザーが設定");
      expect(result.filter((v) => v.ruleId === "GENERAL-34")).toHaveLength(0);
    });
  });

  describe("GENERAL-42: V音はバ行で表記", () => {
    it("「ヴァージョン」を検出する", () => {
      const result = validateKatakana("ヴァージョン1.0");
      expect(result.some((v) => v.ruleId === "GENERAL-42")).toBe(true);
    });

    it("「バージョン」は検出しない", () => {
      const result = validateKatakana("バージョン1.0");
      expect(result.filter((v) => v.ruleId === "GENERAL-42")).toHaveLength(0);
    });
  });
});

// ============================================
// validateSnackbarPeriod (snackbar-period.ts)
// ============================================
describe("validateSnackbarPeriod", () => {
  describe("GENERAL-54: スナックバーの末尾に句点を付けない", () => {
    it("snackbar コンテキストで末尾句点を検出する", () => {
      const result = validateSnackbarPeriod("保存しました。", { componentName: "snackbar" });
      expect(result).toHaveLength(1);
      expect(result[0].ruleId).toBe("GENERAL-54");
    });

    it("snackbar 以外のコンテキストでは検出しない", () => {
      const result = validateSnackbarPeriod("保存しました。", { componentName: "Text" });
      expect(result).toHaveLength(0);
    });

    it("コンテキストがない場合は検出しない", () => {
      const result = validateSnackbarPeriod("保存しました。");
      expect(result).toHaveLength(0);
    });

    it("末尾に句点がない場合は検出しない", () => {
      const result = validateSnackbarPeriod("保存しました", { componentName: "snackbar" });
      expect(result).toHaveLength(0);
    });
  });
});

// ============================================
// validateAbstractLink (abstract-link.ts)
// ============================================
describe("validateAbstractLink", () => {
  describe("GENERAL-55: リンクテキストは遷移先が推測できるようにする", () => {
    it("「こちら」を検出する", () => {
      const result = validateAbstractLink("詳しくはこちらをクリック");
      expect(result.some((v) => v.ruleId === "GENERAL-55")).toBe(true);
    });

    it("「以下のリンク」を検出する", () => {
      const result = validateAbstractLink("詳細は以下のリンクから確認");
      expect(result.some((v) => v.ruleId === "GENERAL-55")).toBe(true);
    });

    it("「次のページ」を検出する", () => {
      const result = validateAbstractLink("詳しくは次のページを参照");
      expect(result.some((v) => v.ruleId === "GENERAL-55")).toBe(true);
    });

    it("具体的なリンクテキストは検出しない", () => {
      const result = validateAbstractLink("利用規約を確認する");
      expect(result.filter((v) => v.ruleId === "GENERAL-55")).toHaveLength(0);
    });
  });
});

// ============================================
// validateAdjectiveAdverb (adjective-adverb.ts)
// ============================================
describe("validateAdjectiveAdverb", () => {
  describe("GENERAL-23: 動作や変化を示す文では副詞を使う", () => {
    it("「明るいする」を検出する", () => {
      const result = validateAdjectiveAdverb("画面を明るいする");
      expect(result.some((v) => v.ruleId === "GENERAL-23" && v.suggestion === "明るくする")).toBe(true);
    });

    it("「大きいします」を検出する", () => {
      const result = validateAdjectiveAdverb("文字を大きいします");
      expect(result.some((v) => v.ruleId === "GENERAL-23" && v.suggestion === "大きくします")).toBe(true);
    });

    it("「小さいなり」を検出する", () => {
      const result = validateAdjectiveAdverb("アイコンが小さいなり");
      expect(result.some((v) => v.ruleId === "GENERAL-23" && v.suggestion === "小さくなり")).toBe(true);
    });

    it("正しい副詞の使用は検出しない", () => {
      const result = validateAdjectiveAdverb("画面を明るくする");
      expect(result.filter((v) => v.ruleId === "GENERAL-23")).toHaveLength(0);
    });
  });
});

// ============================================
// validateApology (apology.ts)
// ============================================
describe("validateApology", () => {
  describe("GENERAL-16: 謝罪の表現を使用しない", () => {
    it("「申し訳ございません」を検出する", () => {
      const result = validateApology("申し訳ございませんが、");
      expect(result.some((v) => v.ruleId === "GENERAL-16")).toBe(true);
    });

    it("「お詫びいたします」を検出する", () => {
      const result = validateApology("お詫びいたします");
      expect(result.some((v) => v.ruleId === "GENERAL-16")).toBe(true);
    });

    it("「恐れ入りますが」を検出する", () => {
      const result = validateApology("恐れ入りますが");
      expect(result.some((v) => v.ruleId === "GENERAL-16")).toBe(true);
    });

    it("「ご容赦ください」を検出する", () => {
      const result = validateApology("ご容赦ください");
      expect(result.some((v) => v.ruleId === "GENERAL-16")).toBe(true);
    });

    it("謝罪表現がないテキストは検出しない", () => {
      const result = validateApology("設定を変更してください");
      expect(result.filter((v) => v.ruleId === "GENERAL-16")).toHaveLength(0);
    });
  });
});

// ============================================
// validateBrackets (brackets.ts)
// ============================================
describe("validateBrackets", () => {
  describe("GENERAL-64: 文章中の括弧類は全角で使用", () => {
    it("日本語文中の半角括弧を検出する", () => {
      const result = validateBrackets("詳細(設定)を確認");
      expect(result.some((v) => v.ruleId === "GENERAL-64" && v.incorrectText === "(")).toBe(true);
    });

    it("英数字のみの括弧は検出しない", () => {
      const result = validateBrackets("function(arg)");
      expect(result.filter((v) => v.ruleId === "GENERAL-64")).toHaveLength(0);
    });

    it("全角括弧の前後のスペースを検出する", () => {
      const result = validateBrackets("詳細 （設定）");
      expect(result.some((v) => v.ruleId === "GENERAL-64" && v.description.includes("スペース"))).toBe(true);
    });
  });
});

// ============================================
// validateColorOnlyInstruction (color-only-instruction.ts)
// ============================================
describe("validateColorOnlyInstruction", () => {
  describe("GENERAL-10: 色の情報に限定した操作案内をしない", () => {
    it("「赤いボタン」を検出する", () => {
      const result = validateColorOnlyInstruction("赤いボタンをクリック");
      expect(result.some((v) => v.ruleId === "GENERAL-10")).toBe(true);
    });

    it("「青色のラベル」を検出する", () => {
      const result = validateColorOnlyInstruction("青色のラベルを確認");
      expect(result.some((v) => v.ruleId === "GENERAL-10")).toBe(true);
    });

    it("「緑色のアイコン」を検出する", () => {
      const result = validateColorOnlyInstruction("緑色のアイコンを選択");
      expect(result.some((v) => v.ruleId === "GENERAL-10")).toBe(true);
    });

    it("色以外の情報を含む説明は検出しない", () => {
      const result = validateColorOnlyInstruction("保存ボタンをクリック");
      expect(result.filter((v) => v.ruleId === "GENERAL-10")).toHaveLength(0);
    });
  });
});

// ============================================
// validateConjunctions (conjunctions.ts)
// ============================================
describe("validateConjunctions", () => {
  describe("GENERAL-178: 3つ以上の要素の列挙", () => {
    it("3つの列挙で「、および」がない場合を検出する", () => {
      const result = validateConjunctions("名前、住所、電話番号");
      expect(result.some((v) => v.ruleId === "GENERAL-178")).toBe(true);
    });

    it("「、および」を含む列挙は検出しない", () => {
      const result = validateConjunctions("名前、住所、および電話番号");
      expect(result.filter((v) => v.ruleId === "GENERAL-178")).toHaveLength(0);
    });
  });
});

// ============================================
// validateDateTime (datetime.ts)
// ============================================
describe("validateDateTime", () => {
  describe("GENERAL-21: 日時表記は yyyy/MM/dd HH:mm", () => {
    it("和暦風の日時を検出する", () => {
      const result = validateDateTime("2021年11月12日 15時30分");
      expect(result.some((v) => v.ruleId === "GENERAL-21" && v.suggestion === "2021/11/12 15:30")).toBe(true);
    });

    it("正しい形式は検出しない", () => {
      const result = validateDateTime("2021/11/12 15:30");
      expect(result.filter((v) => v.ruleId === "GENERAL-21")).toHaveLength(0);
    });
  });
});

// ============================================
// validateDoubleNegation (double-negation.ts)
// ============================================
describe("validateDoubleNegation", () => {
  describe("GENERAL-13: 二重否定は避ける", () => {
    it("「を非表示にする」を検出する", () => {
      const result = validateDoubleNegation("項目を非表示にする");
      expect(result.some((v) => v.ruleId === "GENERAL-13" && v.suggestion?.includes("表示"))).toBe(true);
    });

    it("「を無効にする」を検出する", () => {
      const result = validateDoubleNegation("機能を無効にする");
      expect(result.some((v) => v.ruleId === "GENERAL-13" && v.suggestion?.includes("有効"))).toBe(true);
    });

    it("肯定的な表現は検出しない", () => {
      const result = validateDoubleNegation("機能を有効にする");
      expect(result.filter((v) => v.ruleId === "GENERAL-13")).toHaveLength(0);
    });
  });
});

// ============================================
// validateEllipsis (ellipsis.ts)
// ============================================
describe("validateEllipsis", () => {
  describe("GENERAL-48: 3点リーダーの適切な使用", () => {
    it("不適切な3点リーダーを検出する", () => {
      const result = validateEllipsis("詳しくは...");
      expect(result.some((v) => v.ruleId === "GENERAL-48")).toBe(true);
    });

    it("進行状況を表す3点リーダーは検出しない", () => {
      const result = validateEllipsis("読み込み中...");
      expect(result.filter((v) => v.ruleId === "GENERAL-48")).toHaveLength(0);
    });

    it("数字の省略は検出しない", () => {
      const result = validateEllipsis("123456789...");
      expect(result.filter((v) => v.ruleId === "GENERAL-48")).toHaveLength(0);
    });
  });
});

// ============================================
// validateExcessiveHonorifics (excessive-honorifics.ts)
// ============================================
describe("validateExcessiveHonorifics", () => {
  describe("GENERAL-4: 過剰な敬語表現は使用しない", () => {
    it("「いただけますようお願いいたします」を検出する", () => {
      const result = validateExcessiveHonorifics("ご確認いただけますようお願いいたします");
      expect(result.some((v) => v.ruleId === "GENERAL-4")).toBe(true);
    });

    it("「お手数ですが」を検出する", () => {
      const result = validateExcessiveHonorifics("お手数ですが");
      expect(result.some((v) => v.ruleId === "GENERAL-4")).toBe(true);
    });

    it("「恐れ入りますが」を検出する", () => {
      const result = validateExcessiveHonorifics("恐れ入りますが");
      expect(result.some((v) => v.ruleId === "GENERAL-4")).toBe(true);
    });

    it("簡潔な表現は検出しない", () => {
      const result = validateExcessiveHonorifics("確認してください");
      expect(result.filter((v) => v.ruleId === "GENERAL-4")).toHaveLength(0);
    });
  });
});

// ============================================
// validateHiraganaToKatakana (hiragana-to-katakana.ts)
// ============================================
describe("validateHiraganaToKatakana", () => {
  describe("GENERAL-17: 外来語はカタカナを用いる", () => {
    it("「ぼたん」を検出する", () => {
      const result = validateHiraganaToKatakana("ぼたんをクリック");
      expect(result.some((v) => v.ruleId === "GENERAL-17" && v.suggestion === "ボタン")).toBe(true);
    });

    it("「ふぁいる」を検出する", () => {
      const result = validateHiraganaToKatakana("ふぁいるを選択");
      expect(result.some((v) => v.ruleId === "GENERAL-17" && v.suggestion === "ファイル")).toBe(true);
    });

    it("「めにゅー」を検出する", () => {
      const result = validateHiraganaToKatakana("めにゅーを開く");
      expect(result.some((v) => v.ruleId === "GENERAL-17" && v.suggestion === "メニュー")).toBe(true);
    });

    it("カタカナ表記は検出しない", () => {
      const result = validateHiraganaToKatakana("ボタンをクリック");
      expect(result.filter((v) => v.ruleId === "GENERAL-17")).toHaveLength(0);
    });
  });
});

// ============================================
// validateKatakanaToJapanese (katakana-japanese.ts)
// ============================================
describe("validateKatakanaToJapanese", () => {
  describe("GENERAL-9: カタカナ語より日本語を優先", () => {
    it("「オート」を検出する", () => {
      const result = validateKatakanaToJapanese("オートで設定");
      expect(result.some((v) => v.ruleId === "GENERAL-9" && v.suggestion === "自動")).toBe(true);
    });

    it("「インプット」を検出する", () => {
      const result = validateKatakanaToJapanese("インプットを確認");
      expect(result.some((v) => v.ruleId === "GENERAL-9" && v.suggestion === "入力")).toBe(true);
    });

    it("「アウトプット」を検出する", () => {
      const result = validateKatakanaToJapanese("アウトプットを確認");
      expect(result.some((v) => v.ruleId === "GENERAL-9" && v.suggestion === "出力")).toBe(true);
    });

    it("日本語表記は検出しない", () => {
      const result = validateKatakanaToJapanese("自動で設定");
      expect(result.filter((v) => v.ruleId === "GENERAL-9")).toHaveLength(0);
    });
  });
});

// ============================================
// validateLargeNumberUnits (large-number-units.ts)
// ============================================
describe("validateLargeNumberUnits", () => {
  describe("GENERAL-20: 5桁以上の数字は単位語を使用", () => {
    it("10000以上の数字を検出する", () => {
      const result = validateLargeNumberUnits("100000件のデータ");
      expect(result.some((v) => v.ruleId === "GENERAL-20" && v.suggestion?.includes("万"))).toBe(true);
    });

    it("カンマ区切りの大きな数字を検出する", () => {
      const result = validateLargeNumberUnits("1,000,000件");
      expect(result.some((v) => v.ruleId === "GENERAL-20")).toBe(true);
    });

    it("単位語を使用した数字は検出しない", () => {
      const result = validateLargeNumberUnits("10万件のデータ");
      expect(result.filter((v) => v.ruleId === "GENERAL-20")).toHaveLength(0);
    });
  });
});

// ============================================
// validateLongSentence (long-sentence.ts)
// ============================================
describe("validateLongSentence", () => {
  describe("GENERAL-49: 1文は80文字以内", () => {
    it("80文字を超える文を検出する", () => {
      // 句点で区切られない1つの長い文
      const longText =
        "この文章は非常に長い文章でありユーザーにとって読みにくくなる可能性があるためもう少し短くまとめることを推奨しますできれば分割して複数の文にすることでより読みやすくなります";
      const result = validateLongSentence(longText);
      expect(result.some((v) => v.ruleId === "GENERAL-49")).toBe(true);
    });

    it("80文字以内の文は検出しない", () => {
      const result = validateLongSentence("この文章は短いです。");
      expect(result.filter((v) => v.ruleId === "GENERAL-49")).toHaveLength(0);
    });
  });
});

// ============================================
// validateNegativeTerminology (negative-terminology.ts)
// ============================================
describe("validateNegativeTerminology", () => {
  describe("GENERAL-12: マイナスイメージの用語は使用しない", () => {
    it("「遅い」を検出する", () => {
      // パターンは「遅い」の後に特定の文字が続く場合のみ検出
      const result = validateNegativeTerminology("通信が遅いです");
      expect(result.some((v) => v.ruleId === "GENERAL-12")).toBe(true);
    });

    it("「弱いセキュリティ」を検出する", () => {
      const result = validateNegativeTerminology("弱いセキュリティ設定");
      expect(result.some((v) => v.ruleId === "GENERAL-12")).toBe(true);
    });

    it("肯定的な表現は検出しない", () => {
      const result = validateNegativeTerminology("高速な通信");
      expect(result.filter((v) => v.ruleId === "GENERAL-12")).toHaveLength(0);
    });
  });
});

// ============================================
// validateNonStandardKanji (non-standard-kanji.ts)
// ============================================
describe("validateNonStandardKanji", () => {
  describe("GENERAL-5: 非常用漢字は使用しない", () => {
    it("「予め」を検出する", () => {
      const result = validateNonStandardKanji("予め設定");
      expect(result.some((v) => v.ruleId === "GENERAL-5" && v.suggestion === "あらかじめ")).toBe(true);
    });

    it("「殆ど」を検出する", () => {
      const result = validateNonStandardKanji("殆どの場合");
      expect(result.some((v) => v.ruleId === "GENERAL-5" && v.suggestion === "ほとんど")).toBe(true);
    });

    it("「暫く」を検出する", () => {
      const result = validateNonStandardKanji("暫くお待ちください");
      expect(result.some((v) => v.ruleId === "GENERAL-5" && v.suggestion === "しばらく")).toBe(true);
    });

    it("ひらがな表記は検出しない", () => {
      const result = validateNonStandardKanji("あらかじめ設定");
      expect(result.filter((v) => v.ruleId === "GENERAL-5")).toHaveLength(0);
    });
  });
});

// ============================================
// validateOkurigana (okurigana.ts)
// ============================================
describe("validateOkurigana", () => {
  describe("GENERAL-8: 送り仮名はすべてつける", () => {
    it("「読込」を検出する", () => {
      const result = validateOkurigana("データを読込");
      expect(result.some((v) => v.ruleId === "GENERAL-8" && v.suggestion === "読み込み")).toBe(true);
    });

    it("「取消」を検出する", () => {
      const result = validateOkurigana("取消ボタン");
      expect(result.some((v) => v.ruleId === "GENERAL-8" && v.suggestion === "取り消し")).toBe(true);
    });

    it("「申込」を検出する", () => {
      const result = validateOkurigana("申込フォーム");
      expect(result.some((v) => v.ruleId === "GENERAL-8" && v.suggestion === "申し込み")).toBe(true);
    });

    it("送り仮名がある表記は検出しない", () => {
      const result = validateOkurigana("データを読み込み");
      expect(result.filter((v) => v.ruleId === "GENERAL-8")).toHaveLength(0);
    });

    it("「取消法」は除外する", () => {
      const result = validateOkurigana("取消法に基づき");
      expect(result.filter((v) => v.ruleId === "GENERAL-8")).toHaveLength(0);
    });

    it("「受付メールアドレス」は除外する", () => {
      const result = validateOkurigana("受付メールアドレスを設定");
      expect(result.filter((v) => v.ruleId === "GENERAL-8")).toHaveLength(0);
    });

    it("「案件受付」は除外する", () => {
      const result = validateOkurigana("案件受付を開始");
      expect(result.filter((v) => v.ruleId === "GENERAL-8")).toHaveLength(0);
    });
  });
});

// ============================================
// validateParticles (particles.ts)
// ============================================
describe("validateParticles", () => {
  describe("GENERAL-74: 格助詞をむやみに省略しない", () => {
    it("「設定変更」を検出する", () => {
      const result = validateParticles("設定変更できます");
      expect(result.some((v) => v.ruleId === "GENERAL-74" && v.suggestion === "設定を変更")).toBe(true);
    });

    it("「ファイル削除」を検出する", () => {
      const result = validateParticles("ファイル削除しますか");
      expect(result.some((v) => v.ruleId === "GENERAL-74" && v.suggestion === "ファイルを削除")).toBe(true);
    });

    it("助詞がある表現は検出しない", () => {
      const result = validateParticles("設定を変更できます");
      expect(result.filter((v) => v.ruleId === "GENERAL-74")).toHaveLength(0);
    });
  });

  describe("GENERAL-29: 「に」は到着点、「へ」は方向", () => {
    it("「一覧へ戻る」を検出する", () => {
      const result = validateParticles("一覧へ戻る");
      expect(result.some((v) => v.ruleId === "GENERAL-29" && v.suggestion === "に")).toBe(true);
    });
  });

  describe("GENERAL-30: 「より」は比較、「から」は始点", () => {
    it("「フォルダより選択」を検出する", () => {
      const result = validateParticles("フォルダより選択");
      expect(result.some((v) => v.ruleId === "GENERAL-30" && v.suggestion === "から")).toBe(true);
    });
  });

  describe("GENERAL-31: 「で」は限定を示すときだけ", () => {
    it("「一覧で選択」を検出する", () => {
      const result = validateParticles("一覧で選択");
      expect(result.some((v) => v.ruleId === "GENERAL-31" && v.suggestion === "から")).toBe(true);
    });
  });
});

// ============================================
// validatePassiveVoice (passive-voice.ts)
// ============================================
describe("validatePassiveVoice", () => {
  describe("GENERAL-50: 受動態を避ける", () => {
    it("「が表示されます」を検出する", () => {
      // パターンはひらがな・カタカナ・漢字の後に「が表示されます」を検出
      const result = validatePassiveVoice("メッセージが表示されます");
      expect(result.some((v) => v.ruleId === "GENERAL-50" && v.suggestion?.includes("表示します"))).toBe(true);
    });

    it("「が選択されます」を検出する", () => {
      const result = validatePassiveVoice("項目が選択されます");
      expect(result.some((v) => v.ruleId === "GENERAL-50")).toBe(true);
    });

    it("能動態は検出しない", () => {
      const result = validatePassiveVoice("エラーを表示します");
      expect(result.filter((v) => v.ruleId === "GENERAL-50")).toHaveLength(0);
    });
  });
});

// ============================================
// validateRedundancy (redundancy.ts)
// ============================================
describe("validateRedundancy", () => {
  describe("GENERAL-68: 冗長な語尾を避ける", () => {
    it("「させていただきました」を検出する", () => {
      const result = validateRedundancy("更新させていただきました");
      expect(result.some((v) => v.ruleId === "GENERAL-68" && v.suggestion === "しました")).toBe(true);
    });

    it("「することができる」を検出する", () => {
      const result = validateRedundancy("設定することができる");
      expect(result.some((v) => v.ruleId === "GENERAL-68" && v.suggestion === "できる")).toBe(true);
    });

    it("「することが可能です」を検出する", () => {
      const result = validateRedundancy("変更することが可能です");
      expect(result.some((v) => v.ruleId === "GENERAL-68" && v.suggestion === "できます")).toBe(true);
    });

    it("簡潔な表現は検出しない", () => {
      const result = validateRedundancy("更新しました");
      expect(result.filter((v) => v.ruleId === "GENERAL-68")).toHaveLength(0);
    });
  });
});

// ============================================
// validateRedundantSuffix (redundant-suffix.ts)
// ============================================
describe("validateRedundantSuffix", () => {
  describe("GENERAL-24: 冗長な表現は避ける", () => {
    it("「確認済みにする」を検出する", () => {
      const result = validateRedundantSuffix("確認済みにする");
      expect(result.some((v) => v.ruleId === "GENERAL-24")).toBe(true);
    });

    it("「完了済みにする」を検出する", () => {
      const result = validateRedundantSuffix("完了済みにする");
      expect(result.some((v) => v.ruleId === "GENERAL-24")).toBe(true);
    });

    it("「有効の状態にする」を検出する", () => {
      const result = validateRedundantSuffix("有効の状態にする");
      expect(result.some((v) => v.ruleId === "GENERAL-24")).toBe(true);
    });

    it("簡潔な表現は検出しない", () => {
      const result = validateRedundantSuffix("確認済み");
      expect(result.filter((v) => v.ruleId === "GENERAL-24")).toHaveLength(0);
    });
  });
});

// ============================================
// validateSoundOnlyInstruction (sound-only-instruction.ts)
// ============================================
describe("validateSoundOnlyInstruction", () => {
  describe("GENERAL-11: 音の情報に限定した操作案内をしない", () => {
    it("「カチッという音がするまで」を検出する", () => {
      const result = validateSoundOnlyInstruction("カチッという音がするまで押す");
      expect(result.some((v) => v.ruleId === "GENERAL-11")).toBe(true);
    });

    it("「音が鳴るまで」を検出する", () => {
      const result = validateSoundOnlyInstruction("音が鳴るまで待つ");
      expect(result.some((v) => v.ruleId === "GENERAL-11")).toBe(true);
    });

    it("音に言及しない説明は検出しない", () => {
      const result = validateSoundOnlyInstruction("ボタンを押してください");
      expect(result.filter((v) => v.ruleId === "GENERAL-11")).toHaveLength(0);
    });
  });
});

// ============================================
// validateSpacing (spacing.ts)
// ============================================
describe("validateSpacing", () => {
  describe("GENERAL-143: 日本語単位の前にスペースを入れない", () => {
    it("「10 件」を検出する", () => {
      const result = validateSpacing("10 件のデータ");
      expect(result.some((v) => v.ruleId === "GENERAL-143" && v.suggestion === "10件")).toBe(true);
    });

    it("「5 分」を検出する", () => {
      const result = validateSpacing("5 分後に再試行");
      expect(result.some((v) => v.ruleId === "GENERAL-143" && v.suggestion === "5分")).toBe(true);
    });

    it("スペースなしの表記は検出しない", () => {
      const result = validateSpacing("10件のデータ");
      expect(result.filter((v) => v.ruleId === "GENERAL-143")).toHaveLength(0);
    });
  });

  describe("GENERAL-144: 英語単位の前にスペースを入れる", () => {
    it("「10minutes」を検出する", () => {
      const result = validateSpacing("10minutes");
      expect(result.some((v) => v.ruleId === "GENERAL-144" && v.suggestion === "10 minutes")).toBe(true);
    });

    it("「5kg」を検出する", () => {
      const result = validateSpacing("5kg");
      expect(result.some((v) => v.ruleId === "GENERAL-144" && v.suggestion === "5 kg")).toBe(true);
    });

    it("スペースありの表記は検出しない", () => {
      const result = validateSpacing("10 minutes");
      expect(result.filter((v) => v.ruleId === "GENERAL-144")).toHaveLength(0);
    });
  });
});

// ============================================
// validateSymbol (symbol.ts)
// ============================================
describe("validateSymbol", () => {
  describe("GENERAL-47: 文章の末尾に句点をつける", () => {
    it("句点がない長い文を検出する", () => {
      const result = validateSymbol("この設定を変更することで有効にできます");
      expect(result.some((v) => v.ruleId === "GENERAL-47")).toBe(true);
    });

    it("句点がある文は検出しない", () => {
      const result = validateSymbol("この設定を変更することで有効にできます。");
      expect(result.filter((v) => v.ruleId === "GENERAL-47")).toHaveLength(0);
    });
  });
});

// ============================================
// validateSynonymConsistency (synonym-consistency.ts)
// ============================================
describe("validateSynonymConsistency", () => {
  describe("GENERAL-15: 同義語は統一する", () => {
    it("「プリントする」を検出する", () => {
      const result = validateSynonymConsistency("ドキュメントをプリントする");
      expect(result.some((v) => v.ruleId === "GENERAL-15" && v.suggestion?.includes("印刷"))).toBe(true);
    });

    it("「リフレッシュする」を検出する", () => {
      const result = validateSynonymConsistency("画面をリフレッシュする");
      expect(result.some((v) => v.ruleId === "GENERAL-15" && v.suggestion?.includes("更新"))).toBe(true);
    });

    it("「フォルダー」を検出する", () => {
      const result = validateSynonymConsistency("フォルダーを選択");
      expect(result.some((v) => v.ruleId === "GENERAL-15" && v.suggestion?.includes("フォルダ"))).toBe(true);
    });

    it("推奨される表現は検出しない", () => {
      const result = validateSynonymConsistency("印刷する");
      expect(result.filter((v) => v.ruleId === "GENERAL-15")).toHaveLength(0);
    });
  });
});

// ============================================
// validateVagueError (vague-error.ts)
// ============================================
describe("validateVagueError", () => {
  describe("GENERAL-52: エラーメッセージは具体的に", () => {
    it("「エラーです」を検出する", () => {
      const result = validateVagueError("エラーです");
      expect(result.some((v) => v.ruleId === "GENERAL-52")).toBe(true);
    });

    it("「エラーが発生しました」を検出する", () => {
      const result = validateVagueError("エラーが発生しました");
      expect(result.some((v) => v.ruleId === "GENERAL-52")).toBe(true);
    });

    it("「失敗しました」を検出する", () => {
      const result = validateVagueError("失敗しました");
      expect(result.some((v) => v.ruleId === "GENERAL-52")).toBe(true);
    });

    it("「問題が発生しました」を検出する", () => {
      const result = validateVagueError("問題が発生しました");
      expect(result.some((v) => v.ruleId === "GENERAL-52")).toBe(true);
    });

    it("具体的なエラーメッセージは検出しない", () => {
      const result = validateVagueError("ファイルサイズが上限を超えています。10MB以下のファイルを選択してください。");
      expect(result.filter((v) => v.ruleId === "GENERAL-52")).toHaveLength(0);
    });
  });
});

// ============================================
// validateVagueTerminology (vague-terminology.ts)
// ============================================
describe("validateVagueTerminology", () => {
  describe("GENERAL-14: 曖昧な用語は具体的に", () => {
    it("「一般」を検出する", () => {
      const result = validateVagueTerminology("一般の設定");
      expect(result.some((v) => v.ruleId === "GENERAL-14")).toBe(true);
    });

    it("「通常」を検出する", () => {
      const result = validateVagueTerminology("通常の場合");
      expect(result.some((v) => v.ruleId === "GENERAL-14")).toBe(true);
    });

    it("「デフォルト」を検出する", () => {
      const result = validateVagueTerminology("デフォルトの値");
      expect(result.some((v) => v.ruleId === "GENERAL-14")).toBe(true);
    });

    it("具体的な表現は検出しない", () => {
      const result = validateVagueTerminology("初期設定の値");
      expect(result.filter((v) => v.ruleId === "GENERAL-14")).toHaveLength(0);
    });
  });
});
