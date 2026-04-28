import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { applyFixes, parseTranslationsFile } from "./parser";

describe("parseTranslationsFile", () => {
  let tempDir: string;
  let tempFile: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "translation-checker-test-"));
    tempFile = path.join(tempDir, "translations.ts");
  });

  afterEach(() => {
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
    if (fs.existsSync(tempDir)) {
      fs.rmdirSync(tempDir);
    }
  });

  it("素のオブジェクトリテラルをパースできる", () => {
    const content = `
export const translations = {
  "en-US": {
    hello: "Hello",
    world: "World",
  },
  "ja-JP": {
    hello: "こんにちは",
    world: "世界",
  },
};
`;
    fs.writeFileSync(tempFile, content);

    const result = parseTranslationsFile(tempFile);

    expect(result.entries).toHaveLength(2);
    expect(result.entries.find((e) => e.key === "hello")).toEqual(
      expect.objectContaining({
        key: "hello",
        enText: "Hello",
        jaText: "こんにちは",
      }),
    );
  });

  it("as const 付きをパースできる", () => {
    const content = `
export const translations = {
  "en-US": {
    greeting: "Hi there",
  },
  "ja-JP": {
    greeting: "やあ",
  },
} as const;
`;
    fs.writeFileSync(tempFile, content);

    const result = parseTranslationsFile(tempFile);

    expect(result.entries).toHaveLength(1);
    expect(result.entries[0]).toEqual(
      expect.objectContaining({
        key: "greeting",
        enText: "Hi there",
        jaText: "やあ",
      }),
    );
  });

  it("satisfies 付きをパースできる", () => {
    const content = `
type TranslationDict = { "en-US": Record<string, string>; "ja-JP": Record<string, string> };

export const translations = {
  "en-US": {
    button: "Click me",
  },
  "ja-JP": {
    button: "クリック",
  },
} satisfies TranslationDict;
`;
    fs.writeFileSync(tempFile, content);

    const result = parseTranslationsFile(tempFile);

    expect(result.entries).toHaveLength(1);
    expect(result.entries[0].enText).toBe("Click me");
  });

  it("as const satisfies 両方付きをパースできる", () => {
    const content = `
type TranslationDict = { "en-US": Record<string, string>; "ja-JP": Record<string, string> };

export const translations = {
  "en-US": {
    label: "Label text",
  },
  "ja-JP": {
    label: "ラベル",
  },
} as const satisfies TranslationDict;
`;
    fs.writeFileSync(tempFile, content);

    const result = parseTranslationsFile(tempFile);

    expect(result.entries).toHaveLength(1);
    expect(result.entries[0].enText).toBe("Label text");
  });

  it("括弧で囲まれた式もパースできる", () => {
    const content = `
export const translations = ({
  "en-US": {
    test: "Test value",
  },
  "ja-JP": {
    test: "テスト値",
  },
});
`;
    fs.writeFileSync(tempFile, content);

    const result = parseTranslationsFile(tempFile);

    expect(result.entries).toHaveLength(1);
    expect(result.entries[0].enText).toBe("Test value");
  });

  it("translations という名前の変数がない場合は空配列を返す", () => {
    const content = `
export const messages = {
  "en-US": { hello: "Hello" },
  "ja-JP": { hello: "こんにちは" },
};
`;
    fs.writeFileSync(tempFile, content);

    const result = parseTranslationsFile(tempFile);

    expect(result.entries).toHaveLength(0);
  });

  it("en-US と ja-JP で異なるキーがある場合、共通のキーのみ返す", () => {
    const content = `
export const translations = {
  "en-US": {
    common: "Common",
    enOnly: "English only",
  },
  "ja-JP": {
    common: "共通",
    jaOnly: "日本語のみ",
  },
};
`;
    fs.writeFileSync(tempFile, content);

    const result = parseTranslationsFile(tempFile);

    expect(result.entries).toHaveLength(1);
    expect(result.entries[0].key).toBe("common");
  });
});

describe("applyFixes", () => {
  let tempDir: string;
  let tempFile: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "translation-checker-fix-test-"));
    tempFile = path.join(tempDir, "translations.ts");
  });

  afterEach(() => {
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
    if (fs.existsSync(tempDir)) {
      fs.rmdirSync(tempDir);
    }
  });

  it("クォートなしキーの値を修正し、修正された違反を返す", () => {
    const content = `export const translations = {
  "en-US": {
    hello: "Cases List",
  },
  "ja-JP": {
    hello: "案件一覧",
  },
};`;
    fs.writeFileSync(tempFile, content);

    const result = applyFixes(tempFile, [{ key: "hello", incorrectText: "Cases", correctText: "Matters" }]);

    expect(result).toEqual([{ key: "hello", incorrectText: "Cases" }]);
    const updated = fs.readFileSync(tempFile, "utf-8");
    expect(updated).toContain('hello: "Matters List"');
  });

  it("クォート付きキーの値を修正し、修正された違反を返す", () => {
    const content = `export const translations = {
  "en-US": {
    "key-with-dash": "Cases List",
  },
  "ja-JP": {
    "key-with-dash": "案件一覧",
  },
};`;
    fs.writeFileSync(tempFile, content);

    const result = applyFixes(tempFile, [{ key: "key-with-dash", incorrectText: "Cases", correctText: "Matters" }]);

    expect(result).toEqual([{ key: "key-with-dash", incorrectText: "Cases" }]);
    const updated = fs.readFileSync(tempFile, "utf-8");
    expect(updated).toContain('"key-with-dash": "Matters List"');
  });

  it("キーが見つからない場合は空配列を返し、ファイルを変更しない", () => {
    const content = `export const translations = {
  "en-US": {
    hello: "Hello World",
  },
  "ja-JP": {
    hello: "こんにちは",
  },
};`;
    fs.writeFileSync(tempFile, content);

    const result = applyFixes(tempFile, [{ key: "nonexistent", incorrectText: "Cases", correctText: "Matters" }]);

    expect(result).toEqual([]);
    const updated = fs.readFileSync(tempFile, "utf-8");
    expect(updated).toBe(content);
  });

  it("incorrectText が値に含まれない場合は空配列を返す", () => {
    const content = `export const translations = {
  "en-US": {
    hello: "Hello World",
  },
  "ja-JP": {
    hello: "こんにちは",
  },
};`;
    fs.writeFileSync(tempFile, content);

    const result = applyFixes(tempFile, [{ key: "hello", incorrectText: "Cases", correctText: "Matters" }]);

    expect(result).toEqual([]);
    const updated = fs.readFileSync(tempFile, "utf-8");
    expect(updated).toBe(content);
  });

  it("複数の修正で成功したもののみ返す", () => {
    const content = `export const translations = {
  "en-US": {
    key1: "Cases List",
    key2: "Correct Value",
    key3: "Cases Detail",
  },
  "ja-JP": {
    key1: "案件一覧",
    key2: "正しい値",
    key3: "案件詳細",
  },
};`;
    fs.writeFileSync(tempFile, content);

    const result = applyFixes(tempFile, [
      { key: "key1", incorrectText: "Cases", correctText: "Matters" },
      { key: "key2", incorrectText: "Cases", correctText: "Matters" }, // マッチしない
      { key: "key3", incorrectText: "Cases", correctText: "Matters" },
    ]);

    expect(result).toEqual([
      { key: "key1", incorrectText: "Cases" },
      { key: "key3", incorrectText: "Cases" },
    ]);
    const updated = fs.readFileSync(tempFile, "utf-8");
    expect(updated).toContain('key1: "Matters List"');
    expect(updated).toContain('key2: "Correct Value"'); // 変更されていない
    expect(updated).toContain('key3: "Matters Detail"');
  });

  it("大文字小文字を保持しながら置換する", () => {
    const content = `export const translations = {
  "en-US": {
    hello: "Some cases here",
  },
  "ja-JP": {
    hello: "案件",
  },
};`;
    fs.writeFileSync(tempFile, content);

    const result = applyFixes(tempFile, [{ key: "hello", incorrectText: "cases", correctText: "matters" }]);

    expect(result).toEqual([{ key: "hello", incorrectText: "cases" }]);
    const updated = fs.readFileSync(tempFile, "utf-8");
    expect(updated).toContain('hello: "Some matters here"');
  });

  it("同一キーで複数の違反がある場合、成功したもののみ返す", () => {
    const content = `export const translations = {
  "en-US": {
    message: "Cases occurred here",
  },
  "ja-JP": {
    message: "案件が発生しました",
  },
};`;
    fs.writeFileSync(tempFile, content);

    const result = applyFixes(tempFile, [
      { key: "message", incorrectText: "Cases", correctText: "Matters" },
      { key: "message", incorrectText: "Error occurred", correctText: "An error has occurred" }, // マッチしない
    ]);

    // "Cases" のみ成功、"Error occurred" は失敗
    expect(result).toEqual([{ key: "message", incorrectText: "Cases" }]);
    const updated = fs.readFileSync(tempFile, "utf-8");
    expect(updated).toContain('message: "Matters occurred here"');
  });

  it("エスケープされた引用符を含む値を修正できる", () => {
    const content = `export const translations = {
  "en-US": {
    message: "Say \\"Cases\\" here",
  },
  "ja-JP": {
    message: "案件と言う",
  },
};`;
    fs.writeFileSync(tempFile, content);

    const result = applyFixes(tempFile, [{ key: "message", incorrectText: "Cases", correctText: "Matters" }]);

    expect(result).toEqual([{ key: "message", incorrectText: "Cases" }]);
    const updated = fs.readFileSync(tempFile, "utf-8");
    expect(updated).toContain('message: "Say \\"Matters\\" here"');
  });

  it("複数のエスケープシーケンスを含む値を修正できる", () => {
    const content = `export const translations = {
  "en-US": {
    message: "Click \\"Cases\\" button\\nto continue",
  },
  "ja-JP": {
    message: "案件ボタンをクリック",
  },
};`;
    fs.writeFileSync(tempFile, content);

    const result = applyFixes(tempFile, [{ key: "message", incorrectText: "Cases", correctText: "Matters" }]);

    expect(result).toEqual([{ key: "message", incorrectText: "Cases" }]);
    const updated = fs.readFileSync(tempFile, "utf-8");
    expect(updated).toContain('message: "Click \\"Matters\\" button\\nto continue"');
  });

  it("$ を含む correctText を正しく置換する", () => {
    const content = `export const translations = {
  "en-US": {
    price: "100 dollars",
  },
  "ja-JP": {
    price: "100ドル",
  },
};`;
    fs.writeFileSync(tempFile, content);

    const result = applyFixes(tempFile, [{ key: "price", incorrectText: "dollars", correctText: "$" }]);

    expect(result).toEqual([{ key: "price", incorrectText: "dollars" }]);
    const updated = fs.readFileSync(tempFile, "utf-8");
    expect(updated).toContain('price: "100 $"');
  });

  it("$1 や $& などの置換トークンを含む correctText を正しく置換する", () => {
    const content = `export const translations = {
  "en-US": {
    template: "Use placeholder here",
  },
  "ja-JP": {
    template: "プレースホルダーを使用",
  },
};`;
    fs.writeFileSync(tempFile, content);

    const result = applyFixes(tempFile, [
      { key: "template", incorrectText: "placeholder", correctText: "$1 variable" },
    ]);

    expect(result).toEqual([{ key: "template", incorrectText: "placeholder" }]);
    const updated = fs.readFileSync(tempFile, "utf-8");
    // $1 がリテラルとして保持されていることを確認
    expect(updated).toContain('template: "Use $1 variable here"');
  });
});
