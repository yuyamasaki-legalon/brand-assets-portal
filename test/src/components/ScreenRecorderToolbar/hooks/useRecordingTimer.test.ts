import { describe, expect, it } from "vitest";
import { formatTime } from "./useRecordingTimer";

describe("formatTime", () => {
  it("formats zero seconds", () => {
    expect(formatTime(0)).toBe("00:00");
  });

  it("formats seconds under a minute", () => {
    expect(formatTime(59)).toBe("00:59");
  });

  it("formats exactly one minute", () => {
    expect(formatTime(60)).toBe("01:00");
  });

  it("formats minutes and seconds with padding", () => {
    expect(formatTime(125)).toBe("02:05");
  });

  it("formats large values without hour overflow", () => {
    expect(formatTime(3600)).toBe("60:00");
  });
});
