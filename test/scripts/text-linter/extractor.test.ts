import { describe, expect, it } from "vitest";
import { extractJapaneseTexts } from "./extractor";

describe("extractJapaneseTexts", () => {
  describe("文字列リテラルの抽出", () => {
    it("ダブルクォートの文字列リテラルを抽出する", () => {
      const code = `const msg = "こんにちは";`;
      const result = extractJapaneseTexts(code, "test.tsx");

      expect(result).toHaveLength(1);
      expect(result[0].text).toBe("こんにちは");
    });

    it("シングルクォートの文字列リテラルを抽出する", () => {
      const code = `const msg = 'こんにちは';`;
      const result = extractJapaneseTexts(code, "test.tsx");

      expect(result).toHaveLength(1);
      expect(result[0].text).toBe("こんにちは");
    });

    it("テンプレートリテラルを抽出する", () => {
      const code = "const msg = `こんにちは`;";
      const result = extractJapaneseTexts(code, "test.tsx");

      expect(result).toHaveLength(1);
      expect(result[0].text).toBe("こんにちは");
    });

    it("英語のみの文字列は抽出しない", () => {
      const code = `const msg = "Hello World";`;
      const result = extractJapaneseTexts(code, "test.tsx");

      expect(result).toHaveLength(0);
    });
  });

  describe("JSX テキストの抽出", () => {
    it("JSX 要素内のテキストを抽出する", () => {
      const code = `<div>こんにちは</div>`;
      const result = extractJapaneseTexts(code, "test.tsx");

      expect(result).toHaveLength(1);
      expect(result[0].text).toBe("こんにちは");
    });

    it("ネストした JSX 要素内のテキストを抽出する", () => {
      const code = `<div><span>こんにちは</span></div>`;
      const result = extractJapaneseTexts(code, "test.tsx");

      expect(result).toHaveLength(1);
      expect(result[0].text).toBe("こんにちは");
    });
  });

  describe("コンテキストの検出", () => {
    it("JSX 属性のコンポーネント名と prop 名を検出する", () => {
      const code = `<Snackbar message="保存しました。" />`;
      const result = extractJapaneseTexts(code, "test.tsx");

      expect(result).toHaveLength(1);
      expect(result[0].text).toBe("保存しました。");
      expect(result[0].context?.componentName).toBe("Snackbar");
      expect(result[0].context?.propName).toBe("message");
    });

    it("JSX 子要素のコンポーネント名を検出する", () => {
      const code = `<Snackbar>保存しました。</Snackbar>`;
      const result = extractJapaneseTexts(code, "test.tsx");

      expect(result).toHaveLength(1);
      expect(result[0].text).toBe("保存しました。");
      expect(result[0].context?.componentName).toBe("Snackbar");
    });

    it("通常の div 要素のコンテキストを検出する", () => {
      const code = `<div>こんにちは</div>`;
      const result = extractJapaneseTexts(code, "test.tsx");

      expect(result).toHaveLength(1);
      expect(result[0].context?.componentName).toBe("div");
    });

    it("ネストしたコンポーネントでは直近の親を検出する", () => {
      const code = `<Card><Text>こんにちは</Text></Card>`;
      const result = extractJapaneseTexts(code, "test.tsx");

      expect(result).toHaveLength(1);
      expect(result[0].context?.componentName).toBe("Text");
    });
  });

  describe("位置情報", () => {
    it("行番号と列番号を正しく取得する", () => {
      const code = `const x = 1;
const msg = "こんにちは";`;
      const result = extractJapaneseTexts(code, "test.tsx");

      expect(result).toHaveLength(1);
      expect(result[0].line).toBe(2);
      expect(result[0].column).toBe(13);
    });
  });
});
