import { describe, expect, it } from "vitest";
import { generateRecordingFilename } from "./useScreenRecording";

describe("generateRecordingFilename", () => {
  it("generates filename with zero-padded date and time", () => {
    expect(generateRecordingFilename(new Date(2026, 0, 5, 9, 3, 7))).toBe("review-20260105-090307.webm");
  });

  it("handles end-of-year date", () => {
    expect(generateRecordingFilename(new Date(2026, 11, 31, 23, 59, 59))).toBe("review-20261231-235959.webm");
  });
});
