import { describe, expect, it } from "vitest";
import { isValidKebabCase, toKebabCase, toPascalCase } from "./create-user-sandbox-page.helpers";

describe("create-user-sandbox-page helpers", () => {
  it("normalizes user input to kebab-case", () => {
    expect(toKebabCase(" Ryo Watanabe ")).toBe("ryo-watanabe");
    expect(toKebabCase("John_Doe!!")).toBe("john-doe");
  });

  it("converts names to PascalCase", () => {
    expect(toPascalCase("ryo-watanabe")).toBe("RyoWatanabe");
    expect(toPascalCase("john doe")).toBe("JohnDoe");
  });

  it("validates kebab-case strictly", () => {
    expect(isValidKebabCase("ryo-watanabe")).toBe(true);
    expect(isValidKebabCase("RyoWatanabe")).toBe(false);
    expect(isValidKebabCase("ryo--watanabe")).toBe(false);
  });
});
