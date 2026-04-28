import { describe, expect, it } from "vitest";
import { scanAntiPatterns } from "./scan-anti-patterns.helpers";

describe("scanAntiPatterns", () => {
  it("finds several anti-pattern classes from a source snippet", () => {
    const source = [
      "<div onClick={handleClick}>bad</div>",
      "<span>raw</span>",
      "<button>raw</button>",
      "<TextField value={value} />",
      '<div style={{ color: "#fff", margin: "12px" }} />',
    ].join("\n");

    const findings = scanAntiPatterns(source, "/repo/src/example.tsx", "/repo");

    expect(findings.map((finding) => finding.rule)).toEqual([
      "AP-KEYBOARD-001",
      "AP-SPAN-001",
      "AP-CUSTOM-UI-001",
      "AP-FORMCONTROL-001",
      "AP-TOKEN-001",
      "AP-COLOR-001",
    ]);
  });

  it("skips standalone-input warning when FormControl is present", () => {
    const source = ["<FormControl>", '  <TextField aria-label="name" />', "</FormControl>"].join("\n");
    expect(scanAntiPatterns(source, "/repo/src/example.tsx", "/repo")).toEqual([]);
  });
});
