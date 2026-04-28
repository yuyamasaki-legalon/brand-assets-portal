import { describe, expect, it } from "vitest";
import { toPercentPosition } from "./useMemos";

describe("toPercentPosition", () => {
  it("returns 0 for origin", () => {
    expect(toPercentPosition(0, 1920)).toBe(0);
  });

  it("returns 50 for midpoint", () => {
    expect(toPercentPosition(960, 1920)).toBe(50);
  });

  it("returns 100 for full viewport", () => {
    expect(toPercentPosition(1920, 1920)).toBe(100);
  });

  it("returns 25 for quarter position", () => {
    expect(toPercentPosition(480, 1920)).toBe(25);
  });

  it("handles different viewport sizes", () => {
    expect(toPercentPosition(100, 1000)).toBe(10);
  });
});
