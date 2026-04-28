import { describe, expect, it } from "vitest";
import { parseStreamSegments, tokenizeFileReferences } from "./stream";

describe("tokenizeFileReferences", () => {
  const workspaceDir = "/Users/dev/project";

  it("returns plain text token for input without file references", () => {
    const result = tokenizeFileReferences("no file refs here", workspaceDir);
    expect(result).toEqual([{ key: "text-0", type: "text", value: "no file refs here" }]);
  });

  it("tokenizes absolute file path", () => {
    const result = tokenizeFileReferences("see /Users/dev/project/src/foo.tsx for details", workspaceDir);
    const fileToken = result.find((t) => t.type === "file");
    expect(fileToken).toBeDefined();
    if (!fileToken || fileToken.type !== "file") {
      throw new Error("Expected file token");
    }
    expect(fileToken.value.absolutePath).toBe("/Users/dev/project/src/foo.tsx");
  });

  it("tokenizes relative src/ path", () => {
    const result = tokenizeFileReferences("check src/pages/index.tsx", workspaceDir);
    const fileToken = result.find((t) => t.type === "file");
    expect(fileToken).toBeDefined();
    if (!fileToken || fileToken.type !== "file") {
      throw new Error("Expected file token");
    }
    expect(fileToken.value.absolutePath).toBe("/Users/dev/project/src/pages/index.tsx");
  });

  it("tokenizes bracketed path", () => {
    const result = tokenizeFileReferences("file [src/foo.ts] here", workspaceDir);
    const fileToken = result.find((t) => t.type === "file");
    expect(fileToken).toBeDefined();
    if (!fileToken || fileToken.type !== "file") {
      throw new Error("Expected file token");
    }
    expect(fileToken.value.displayText).toBe("src/foo.ts");
  });

  it("extracts line number from path:line format", () => {
    const result = tokenizeFileReferences("see src/foo.ts:42", workspaceDir);
    const fileToken = result.find((t) => t.type === "file");
    expect(fileToken).toBeDefined();
    if (!fileToken || fileToken.type !== "file") {
      throw new Error("Expected file token");
    }
    expect(fileToken.value.line).toBe(42);
  });

  it("extracts line and column from path:line:col format", () => {
    const result = tokenizeFileReferences("see src/foo.ts:42:10", workspaceDir);
    const fileToken = result.find((t) => t.type === "file");
    expect(fileToken).toBeDefined();
    if (!fileToken || fileToken.type !== "file") {
      throw new Error("Expected file token");
    }
    expect(fileToken.value.line).toBe(42);
    expect(fileToken.value.column).toBe(10);
  });

  it("extracts line from #L format", () => {
    const result = tokenizeFileReferences("see src/foo.ts#L42", workspaceDir);
    const fileToken = result.find((t) => t.type === "file");
    expect(fileToken).toBeDefined();
    if (!fileToken || fileToken.type !== "file") {
      throw new Error("Expected file token");
    }
    expect(fileToken.value.line).toBe(42);
  });

  it("preserves text between file references", () => {
    const result = tokenizeFileReferences("open src/a.ts and src/b.ts", workspaceDir);
    const textTokens = result.filter((t) => t.type === "text");
    const fileTokens = result.filter((t) => t.type === "file");
    expect(fileTokens).toHaveLength(2);
    expect(textTokens.length).toBeGreaterThanOrEqual(1);
  });
});

describe("parseStreamSegments", () => {
  it("returns a single text segment for plain text", () => {
    const result = parseStreamSegments("hello world");
    expect(result).toEqual([{ type: "text", content: "hello world", key: "text-0" }]);
  });

  it("returns empty array for empty input", () => {
    expect(parseStreamSegments("")).toEqual([]);
  });

  it("parses a fenced code block", () => {
    const input = "```typescript\nconst x = 1;\n```";
    const result = parseStreamSegments(input);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("code");
    if (result[0].type === "code") {
      expect(result[0].language).toBe("typescript");
      expect(result[0].content).toBe("const x = 1;");
      expect(result[0].isOpen).toBe(false);
    }
  });

  it("handles code block without language", () => {
    const input = "```\nsome code\n```";
    const result = parseStreamSegments(input);
    expect(result).toHaveLength(1);
    if (result[0].type === "code") {
      expect(result[0].language).toBe("");
    }
  });

  it("marks unclosed code block as open", () => {
    const input = "```typescript\nconst x = 1;";
    const result = parseStreamSegments(input);
    expect(result).toHaveLength(1);
    if (result[0].type === "code") {
      expect(result[0].isOpen).toBe(true);
      expect(result[0].content).toBe("const x = 1;");
    }
  });

  it("parses mixed text and code segments", () => {
    const input = "before\n```js\ncode\n```\nafter";
    const result = parseStreamSegments(input);
    expect(result.length).toBeGreaterThanOrEqual(3);
    expect(result[0].type).toBe("text");
    const codeSegment = result.find((s) => s.type === "code");
    expect(codeSegment).toBeDefined();
    if (codeSegment?.type === "code") {
      expect(codeSegment.language).toBe("js");
      expect(codeSegment.content).toBe("code");
    }
  });

  it("handles multiple code blocks", () => {
    const input = "```ts\na\n```\ntext\n```py\nb\n```";
    const result = parseStreamSegments(input);
    const codeBlocks = result.filter((s) => s.type === "code");
    expect(codeBlocks).toHaveLength(2);
  });
});
