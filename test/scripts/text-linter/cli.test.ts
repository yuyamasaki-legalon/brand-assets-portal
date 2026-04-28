import { describe, expect, it } from "vitest";
import { parseArgs } from "./cli";

describe("text-linter cli", () => {
  it("parses rules and explicit pattern", () => {
    expect(parseArgs(["node", "script", "--rules", "general-54, general-6", "src/pages/**/*.tsx"])).toEqual({
      fix: false,
      help: false,
      hideInfo: false,
      pattern: "src/pages/**/*.tsx",
      rules: ["GENERAL-54", "GENERAL-6"],
    });
  });

  it("uses default pattern and parses boolean flags", () => {
    expect(parseArgs(["node", "script", "--fix", "--no-info", "-h"])).toEqual({
      fix: true,
      help: true,
      hideInfo: true,
      pattern: "src/**/*.tsx",
      rules: null,
    });
  });
});
