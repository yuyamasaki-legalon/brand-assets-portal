import { describe, expect, it } from "vitest";
import { compressWhitespace, formatDuration, quoteForShell, truncate } from "./format";

describe("compressWhitespace", () => {
  it("collapses multiple spaces into one", () => {
    expect(compressWhitespace("hello   world")).toBe("hello world");
  });

  it("trims leading and trailing whitespace", () => {
    expect(compressWhitespace("  hello  ")).toBe("hello");
  });

  it("normalizes tabs and newlines", () => {
    expect(compressWhitespace("hello\n\tworld")).toBe("hello world");
  });

  it("returns empty string for whitespace-only input", () => {
    expect(compressWhitespace("   ")).toBe("");
  });
});

describe("truncate", () => {
  it("returns the original string if within limit", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("returns the original string at exact limit", () => {
    expect(truncate("hello", 5)).toBe("hello");
  });

  it("truncates with ellipsis when exceeding limit", () => {
    const result = truncate("hello world", 6);
    expect(result).toHaveLength(6);
    expect(result.endsWith("\u2026")).toBe(true);
  });

  it("handles single character limit", () => {
    const result = truncate("abc", 1);
    expect(result).toBe("\u2026");
  });
});

describe("formatDuration", () => {
  it("formats sub-second durations in milliseconds", () => {
    expect(formatDuration(123)).toBe("123 ms");
    expect(formatDuration(999)).toBe("999 ms");
  });

  it("rounds sub-second durations", () => {
    expect(formatDuration(123.456)).toBe("123 ms");
  });

  it("formats durations >= 1s in seconds with one decimal", () => {
    expect(formatDuration(1000)).toBe("1.0 s");
    expect(formatDuration(1500)).toBe("1.5 s");
    expect(formatDuration(12345)).toBe("12.3 s");
  });
});

describe("quoteForShell", () => {
  it("wraps value in single quotes", () => {
    expect(quoteForShell("hello")).toBe("'hello'");
  });

  it("escapes single quotes within the value", () => {
    expect(quoteForShell("it's")).toBe("'it'\"'\"'s'");
  });

  it("handles empty string", () => {
    expect(quoteForShell("")).toBe("''");
  });

  it("handles value with spaces", () => {
    expect(quoteForShell("hello world")).toBe("'hello world'");
  });
});
