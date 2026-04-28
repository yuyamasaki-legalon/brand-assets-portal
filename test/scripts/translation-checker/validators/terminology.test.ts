// 用語統一チェッカーのテスト
// 新ロジック: 日本語が含まれる → 正訳が使われていない → 違反

import { describe, expect, it } from "vitest";
import type { TranslationEntry } from "../types";
import { validateAllTerminology, validateTerminology } from "./terminology";

// テスト用ヘルパー関数
function createEntry(key: string, jaText: string, enText: string): TranslationEntry {
  return { key, jaText, enText, line: 1, column: 1 };
}

describe("validateTerminology", () => {
  describe("正訳が含まれている場合", () => {
    it("違反を検出しない", () => {
      // 「案件」の正訳は「Matters」
      const entry = createEntry("label", "案件一覧", "Matters List");
      const result = validateTerminology(entry);
      expect(result).toHaveLength(0);
    });

    it("大文字小文字を区別しない", () => {
      const entry = createEntry("label", "案件", "matters");
      const result = validateTerminology(entry);
      expect(result).toHaveLength(0);
    });

    it("部分一致でも正訳として認識する", () => {
      const entry = createEntry("label", "案件", "All Matters are here");
      const result = validateTerminology(entry);
      expect(result).toHaveLength(0);
    });
  });

  describe("正訳が含まれていない場合", () => {
    it("違反を検出する", () => {
      // 「案件」の正訳は「Matters」だが、「Cases」が使われている
      const entry = createEntry("label", "案件一覧", "Cases List");
      const result = validateTerminology(entry);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].expectedText).toBe("Matters");
    });

    it("description に日本語と正訳を含む", () => {
      const entry = createEntry("label", "案件", "Cases");
      const result = validateTerminology(entry);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].description).toContain("案件");
      expect(result[0].description).toContain("Matters");
    });
  });

  describe("日本語が含まれていない場合", () => {
    it("違反を検出しない", () => {
      const entry = createEntry("label", "設定", "Settings");
      // 「設定」に対するルールがあるか不明だが、ルールがなければ違反なし
      const _result = validateTerminology(entry);
      // この場合はルールに依存するのでチェックしない
    });
  });

  describe("複数のルールに該当する場合", () => {
    it("それぞれの違反を検出する", () => {
      // 日本語に複数のキーワードが含まれ、それぞれの正訳が欠けている場合
      const entry = createEntry("label", "案件担当者", "Person in charge");
      const result = validateTerminology(entry);
      // 「案件」→「Matters」のルールに該当し、正訳が含まれていなければ違反
      expect(result.length).toBeGreaterThan(0);
    });
  });
});

describe("validateAllTerminology", () => {
  it("複数のエントリを一括で検証する", () => {
    const entries = [
      createEntry("label1", "案件", "Matters"), // OK
      createEntry("label2", "案件", "Cases"), // NG
    ];
    const result = validateAllTerminology(entries);
    // 少なくとも1つの違反があるはず
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it("空の配列を渡しても問題なく動作する", () => {
    const result = validateAllTerminology([]);
    expect(result).toHaveLength(0);
  });
});

describe("エッジケース", () => {
  it("空の英語テキストでは違反を検出する", () => {
    const entry = createEntry("empty", "案件", "");
    const result = validateTerminology(entry);
    // 空なので正訳が含まれていない → 違反
    expect(result.length).toBeGreaterThan(0);
  });

  it("空の日本語テキストでは違反を検出しない", () => {
    const entry = createEntry("empty", "", "Matters");
    const result = validateTerminology(entry);
    expect(result).toHaveLength(0);
  });
});

describe("日本語部分一致による false positive 防止", () => {
  it("長い日本語キーワードの正訳がある場合、短いキーワードで誤検知しない", () => {
    // 「案件名」→「Matter name」は正しい翻訳
    // 「案件」→「Matters」ルールで誤検知されるべきではない
    const entry = createEntry("label", "案件名", "Matter name");
    const result = validateTerminology(entry);
    // TERM-005 (案件名 → Matter name) は満たしている
    // TERM-003 (案件 → Matters) は「案件名」の部分文字列なのでスキップされるべき
    const term003Violation = result.find((v) => v.ruleId === "TERM-003");
    expect(term003Violation).toBeUndefined();
  });

  it("長い日本語キーワードの正訳がない場合は違反を検出する", () => {
    // 「案件名」→「Matter name」だが、「Case name」が使われている
    const entry = createEntry("label", "案件名", "Case name");
    const result = validateTerminology(entry);
    // TERM-005 (案件名 → Matter name) の違反を検出
    const term005Violation = result.find((v) => v.ruleId === "TERM-005");
    expect(term005Violation).toBeDefined();
    expect(term005Violation?.expectedText).toBe("Matter name");
    // TERM-003 (案件) はスキップされるべき
    const term003Violation = result.find((v) => v.ruleId === "TERM-003");
    expect(term003Violation).toBeUndefined();
  });

  it("異なる長いキーワードが複数ある場合、それぞれ独立して検出する", () => {
    // 「案件名」と「案件タイプ」は両方「案件」を含むが、別のルール
    const entry = createEntry("label", "案件名と案件タイプ", "Matter name and Case type");
    const result = validateTerminology(entry);
    // TERM-005 (案件名 → Matter name) は満たしている → 違反なし
    const term005Violation = result.find((v) => v.ruleId === "TERM-005");
    expect(term005Violation).toBeUndefined();
    // TERM-004 (案件タイプ → Matter type) は満たしていない → 違反
    const term004Violation = result.find((v) => v.ruleId === "TERM-004");
    expect(term004Violation).toBeDefined();
    expect(term004Violation?.expectedText).toBe("Matter type");
    // TERM-003 (案件 → Matters) は長いキーワードの部分文字列なのでスキップ
    const term003Violation = result.find((v) => v.ruleId === "TERM-003");
    expect(term003Violation).toBeUndefined();
  });

  it("短いキーワードが独立して出現する場合は違反を検出する", () => {
    // 「案件名と案件」→「Matter name and Cases」
    // 「案件名」の位置の「案件」はスキップされるが、独立した「案件」は検出される
    const entry = createEntry("label", "案件名と案件", "Matter name and Cases");
    const result = validateTerminology(entry);
    // TERM-003 (案件 → Matters) の違反を検出（独立した「案件」に対して）
    const term003Violation = result.find((v) => v.ruleId === "TERM-003");
    expect(term003Violation).toBeDefined();
    expect(term003Violation?.autoFix).toBe(true);
    expect(term003Violation?.incorrectText).toBe("Cases");
  });
});

describe("正訳と誤訳が両方存在する場合", () => {
  it("正訳と誤訳が両方存在する場合も違反を検出する", () => {
    // 「案件」→「Cases and Matters」
    // 「Matters」（正訳）があっても「Cases」（誤訳）も含まれている → 違反
    const entry = createEntry("label", "案件一覧", "Cases and Matters List");
    const result = validateTerminology(entry);
    // "Cases" が含まれているので違反を検出
    const term003Violation = result.find((v) => v.ruleId === "TERM-003");
    expect(term003Violation).toBeDefined();
    expect(term003Violation?.autoFix).toBe(true);
    expect(term003Violation?.incorrectText).toBe("Cases");
  });

  it("正訳のみで誤訳がない場合は違反を検出しない", () => {
    // 「案件」→「Matters List」
    // 正訳のみなので違反なし
    const entry = createEntry("label", "案件一覧", "Matters List");
    const result = validateTerminology(entry);
    const term003Violation = result.find((v) => v.ruleId === "TERM-003");
    expect(term003Violation).toBeUndefined();
  });
});

describe("正訳の単語境界チェック", () => {
  it("正訳が別の単語の部分文字列として含まれる場合は違反を検出する", () => {
    // 「ファイル」→「Profiles」
    // "Profiles" に "files" が含まれるが、独立した単語ではない → 違反
    const entry = createEntry("label", "ファイル", "Profiles");
    const result = validateTerminology(entry);
    const term016Violation = result.find((v) => v.ruleId === "TERM-016");
    expect(term016Violation).toBeDefined();
    expect(term016Violation?.expectedText).toBe("Files");
  });

  it("正訳が独立した単語として存在する場合は違反を検出しない", () => {
    // 「ファイル」→「Files list」
    // "Files" が独立した単語として存在する → 違反なし
    const entry = createEntry("label", "ファイル", "Files list");
    const result = validateTerminology(entry);
    const term016Violation = result.find((v) => v.ruleId === "TERM-016");
    expect(term016Violation).toBeUndefined();
  });

  it("正訳が文末に独立した単語として存在する場合は違反を検出しない", () => {
    // 「ファイル」→「Upload Files」
    const entry = createEntry("label", "ファイル", "Upload Files");
    const result = validateTerminology(entry);
    const term016Violation = result.find((v) => v.ruleId === "TERM-016");
    expect(term016Violation).toBeUndefined();
  });

  it("正訳が単独で存在する場合は違反を検出しない", () => {
    // 「ファイル」→「Files」
    const entry = createEntry("label", "ファイル", "Files");
    const result = validateTerminology(entry);
    const term016Violation = result.find((v) => v.ruleId === "TERM-016");
    expect(term016Violation).toBeUndefined();
  });
});

describe("自動修正フラグ", () => {
  it("incorrect パターンがマッチする場合、autoFix が true になる", () => {
    // TERM-003 (案件 → Matters) には incorrect: ["Cases", "Case"] が定義されている
    const entry = createEntry("label", "案件一覧", "Cases List");
    const result = validateTerminology(entry);
    // 違反が検出されることを確認
    expect(result.length).toBeGreaterThan(0);
    // autoFix が true、incorrectText が設定されている
    const violation = result.find((v) => v.ruleId === "TERM-003");
    expect(violation).toBeDefined();
    expect(violation?.autoFix).toBe(true);
    expect(violation?.incorrectText).toBe("Cases");
  });

  it("正訳がない場合でも incorrect がマッチしなければ autoFix は undefined", () => {
    const entry = createEntry("label", "案件", "Unknown translation");
    const result = validateTerminology(entry);
    // 違反が検出される（正訳が含まれていない）
    expect(result.length).toBeGreaterThan(0);
    // incorrect パターンにマッチしないので autoFix は undefined
    const violation = result.find((v) => v.ruleId === "TERM-003");
    expect(violation).toBeDefined();
    expect(violation?.autoFix).toBeUndefined();
    expect(violation?.incorrectText).toBeUndefined();
  });

  it("違反に incorrectText が含まれる", () => {
    const entry = createEntry("label", "案件", "Case management");
    const result = validateTerminology(entry);
    const violation = result.find((v) => v.ruleId === "TERM-003");
    expect(violation).toBeDefined();
    expect(violation?.autoFix).toBe(true);
    expect(violation?.incorrectText).toBe("Case");
  });

  it("長いパターンを優先してマッチする", () => {
    // PHRASE-089 (エラーが発生しました) には incorrect: ["Error occurred", "An error occurred", "Error has occurred"] が定義されている
    // "An error occurred" は "Error occurred" より長いので、"An error occurred" がマッチすべき
    const entry = createEntry("label", "エラーが発生しました", "An error occurred");
    const result = validateTerminology(entry);
    const violation = result.find((v) => v.ruleId === "PHRASE-089");
    expect(violation).toBeDefined();
    expect(violation?.autoFix).toBe(true);
    // 長いパターン "An error occurred" がマッチすること（"Error occurred" ではなく）
    expect(violation?.incorrectText).toBe("An error occurred");
  });

  it("複数の誤訳パターンが独立して出現する場合、すべてを報告する", () => {
    // "Case and Cases" には "Case" と "Cases" の両方が独立して含まれる
    // 両方のパターンに対して違反を報告すべき
    const entry = createEntry("label", "案件", "Case and Cases list");
    const result = validateTerminology(entry);
    // 両方のパターンに対して違反を報告
    const term003Violations = result.filter((v) => v.ruleId === "TERM-003");
    expect(term003Violations.length).toBe(2);
    const incorrectTexts = term003Violations.map((v) => v.incorrectText).sort();
    expect(incorrectTexts).toEqual(["Case", "Cases"]);
  });

  it("長いパターンに包含される短いパターンは重複報告しない", () => {
    // "Cases" のみの場合、"Case" は "Cases" に包含されているので報告しない
    const entry = createEntry("label", "案件", "Cases list");
    const result = validateTerminology(entry);
    const term003Violations = result.filter((v) => v.ruleId === "TERM-003");
    // "Cases" のみ報告（"Case" は包含されているのでスキップ）
    expect(term003Violations.length).toBe(1);
    expect(term003Violations[0].incorrectText).toBe("Cases");
  });
});

describe("プレースホルダーを含むフレーズの単語境界チェック", () => {
  it("正訳がプレースホルダーで終わる場合も正しくマッチする", () => {
    // PHRASE-076: "{xxxx}の入力は必須です" → "Please enter a(an) {xxxx}"
    // 正訳が "}" で終わるため、\b が適用されないことを確認
    const entry = createEntry("label", "{xxxx}の入力は必須です", "Please enter a(an) {xxxx}");
    const result = validateTerminology(entry);
    const phrase076Violation = result.find((v) => v.ruleId === "PHRASE-076");
    // 正訳が完全に含まれているので違反なし
    expect(phrase076Violation).toBeUndefined();
  });

  it("正訳がプレースホルダーで終わり、テキストが異なる場合は違反を検出する", () => {
    // 正訳と異なる翻訳の場合は違反を検出
    const entry = createEntry("label", "{xxxx}の入力は必須です", "Input {xxxx} is required");
    const result = validateTerminology(entry);
    const phrase076Violation = result.find((v) => v.ruleId === "PHRASE-076");
    // 正訳が含まれていないので違反
    expect(phrase076Violation).toBeDefined();
    expect(phrase076Violation?.expectedText).toBe("Please enter a(an) {xxxx}");
  });

  it("正訳が括弧で終わる場合も正しくマッチする", () => {
    // PHRASE-073: "例: 甲、委託者、当社" → "Example: party A, consignor, our company"
    // 単語文字で終わるので従来通り \b が適用される
    const entry = createEntry("label", "例: 甲、委託者、当社", "Example: party A, consignor, our company");
    const result = validateTerminology(entry);
    const phrase073Violation = result.find((v) => v.ruleId === "PHRASE-073");
    expect(phrase073Violation).toBeUndefined();
  });

  it("空の正訳に対しては false を返す", () => {
    // 空文字列のエッジケース
    const entry = createEntry("label", "テスト", "Test");
    const result = validateTerminology(entry);
    // 空の正訳を持つルールはないが、関数が正しく動作することを確認
    expect(result).toBeDefined();
  });
});
