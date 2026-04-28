import { describe, expect, it } from "vitest";
import { applyAllFixes, applyFix, validateText } from "./index";

describe("validateText", () => {
  it("複数のルール違反を検出する", () => {
    const text = "データが無い場合は、下さい";
    const result = validateText(text);

    expect(result.length).toBeGreaterThan(0);
    expect(result.some((v) => v.ruleId === "GENERAL-6")).toBe(true);
    expect(result.some((v) => v.ruleId === "GENERAL-33")).toBe(true);
  });

  it("問題がないテキストでは空の配列を返す", () => {
    const text = "こんにちは";
    const result = validateText(text);

    expect(result).toHaveLength(0);
  });

  it("結果は位置順にソートされる", () => {
    const text = "下さい、無い";
    const result = validateText(text);

    for (let i = 1; i < result.length; i++) {
      expect(result[i].position.start).toBeGreaterThanOrEqual(result[i - 1].position.start);
    }
  });

  describe("コンテキスト対応", () => {
    it("snackbar コンテキストで GENERAL-54 を検出する", () => {
      const result = validateText("保存しました。", { componentName: "snackbar" });
      expect(result.some((v) => v.ruleId === "GENERAL-54")).toBe(true);
    });

    it("他のコンテキストでは GENERAL-54 を検出しない", () => {
      const result = validateText("保存しました。", { componentName: "Text" });
      expect(result.some((v) => v.ruleId === "GENERAL-54")).toBe(false);
    });
  });
});

describe("applyFix", () => {
  it("単一の修正を適用する", () => {
    const text = "下さい";
    const violation = {
      ruleId: "GENERAL-33",
      description: "「ください」はひらがなで表記",
      position: { start: 0, end: 3 },
      incorrectText: "下さい",
      suggestion: "ください",
      severity: "warning" as const,
      category: "kanji",
    };

    const result = applyFix(text, violation);
    expect(result).toBe("ください");
  });

  it("テキストの途中を修正する", () => {
    const text = "確認して下さい";
    const violation = {
      ruleId: "GENERAL-33",
      description: "「ください」はひらがなで表記",
      position: { start: 4, end: 7 },
      incorrectText: "下さい",
      suggestion: "ください",
      severity: "warning" as const,
      category: "kanji",
    };

    const result = applyFix(text, violation);
    expect(result).toBe("確認してください");
  });
});

describe("applyAllFixes", () => {
  it("複数の修正を適用する", () => {
    const text = "データが無い場合";
    const violations = validateText(text);
    const result = applyAllFixes(text, violations);

    expect(result).not.toContain("無い");
    expect(result).toContain("ない");
  });

  it("修正がない場合は元のテキストを返す", () => {
    const text = "こんにちは";
    const violations = validateText(text);
    const result = applyAllFixes(text, violations);

    expect(result).toBe(text);
  });
});
