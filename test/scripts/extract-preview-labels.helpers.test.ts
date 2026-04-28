import { describe, expect, it } from "vitest";
import { buildAliasUrl, classifyPreviewLabel, extractPreviewLabels } from "./extract-preview-labels.helpers";

describe("extractPreviewLabels", () => {
  it("returns empty result when no labels are provided", () => {
    expect(extractPreviewLabels([])).toEqual({ validAliases: [], warnings: [] });
  });

  it("ignores labels that do not start with preview:", () => {
    const result = extractPreviewLabels([{ name: "bug" }, { name: "enhancement" }]);
    expect(result.validAliases).toEqual([]);
    expect(result.warnings).toEqual([]);
  });

  it("accepts a single valid preview label", () => {
    const result = extractPreviewLabels([{ name: "preview:case-review" }]);
    expect(result.validAliases).toEqual(["case-review"]);
    expect(result.warnings).toEqual([]);
  });

  it("accepts multiple valid preview labels preserving order", () => {
    const result = extractPreviewLabels([{ name: "preview:case-review" }, { name: "preview:tabular-review" }]);
    expect(result.validAliases).toEqual(["case-review", "tabular-review"]);
    expect(result.warnings).toEqual([]);
  });

  it("deduplicates identical preview labels silently", () => {
    const result = extractPreviewLabels([{ name: "preview:case-review" }, { name: "preview:case-review" }]);
    expect(result.validAliases).toEqual(["case-review"]);
    expect(result.warnings).toEqual([]);
  });

  it("warns on empty slug", () => {
    const result = extractPreviewLabels([{ name: "preview:" }]);
    expect(result.validAliases).toEqual([]);
    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0]).toContain("no slug");
  });

  it("warns on uppercase slug", () => {
    const result = extractPreviewLabels([{ name: "preview:Case-Review" }]);
    expect(result.validAliases).toEqual([]);
    expect(result.warnings[0]).toContain("invalid");
  });

  it("warns on spaces in slug", () => {
    const result = extractPreviewLabels([{ name: "preview:case review" }]);
    expect(result.validAliases).toEqual([]);
    expect(result.warnings[0]).toContain("invalid");
  });

  it("warns on slug starting with a hyphen", () => {
    const result = extractPreviewLabels([{ name: "preview:-clm" }]);
    expect(result.validAliases).toEqual([]);
    expect(result.warnings[0]).toContain("invalid");
  });

  it("warns when slug exceeds 31 characters", () => {
    const slug = "a".repeat(32);
    const result = extractPreviewLabels([{ name: `preview:${slug}` }]);
    expect(result.validAliases).toEqual([]);
    expect(result.warnings[0]).toContain("invalid");
  });

  it("accepts slug exactly 31 characters long", () => {
    const slug = "a".repeat(31);
    const result = extractPreviewLabels([{ name: `preview:${slug}` }]);
    expect(result.validAliases).toEqual([slug]);
    expect(result.warnings).toEqual([]);
  });

  it("rejects pr-{N} pattern as reserved", () => {
    const result = extractPreviewLabels([{ name: "preview:pr-123" }]);
    expect(result.validAliases).toEqual([]);
    expect(result.warnings[0]).toContain("reserved");
  });

  it("rejects literal reserved words", () => {
    for (const reserved of ["main", "preview", "latest", "production", "staging"]) {
      const result = extractPreviewLabels([{ name: `preview:${reserved}` }]);
      expect(result.validAliases).toEqual([]);
      expect(result.warnings[0]).toContain("reserved");
    }
  });

  it("accepts non-reserved names that contain reserved substrings", () => {
    const result = extractPreviewLabels([{ name: "preview:pre-production-check" }]);
    expect(result.validAliases).toEqual(["pre-production-check"]);
    expect(result.warnings).toEqual([]);
  });

  it("caps at 5 aliases and warns when exceeded", () => {
    const result = extractPreviewLabels([
      { name: "preview:a1" },
      { name: "preview:a2" },
      { name: "preview:a3" },
      { name: "preview:a4" },
      { name: "preview:a5" },
      { name: "preview:a6" },
    ]);
    expect(result.validAliases).toEqual(["a1", "a2", "a3", "a4", "a5"]);
    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0]).toContain("More than 5");
  });

  it("mixes valid and invalid entries, collecting warnings only for invalid ones", () => {
    const result = extractPreviewLabels([
      { name: "bug" },
      { name: "preview:case-review" },
      { name: "preview:" },
      { name: "preview:Upper" },
      { name: "preview:tabular-review" },
    ]);
    expect(result.validAliases).toEqual(["case-review", "tabular-review"]);
    expect(result.warnings).toHaveLength(2);
  });

  it("handles missing name field gracefully", () => {
    const result = extractPreviewLabels([{ name: "" }]);
    expect(result.validAliases).toEqual([]);
    expect(result.warnings).toEqual([]);
  });
});

describe("buildAliasUrl", () => {
  it("builds project URL from alias and host", () => {
    expect(buildAliasUrl("case-review", "aegis-lab.on-technologies-technical-dept.workers.dev")).toBe(
      "https://case-review-aegis-lab.on-technologies-technical-dept.workers.dev",
    );
  });
});

describe("classifyPreviewLabel", () => {
  it("classifies a valid preview label", () => {
    expect(classifyPreviewLabel("preview:case-review")).toEqual({ status: "valid", slug: "case-review" });
  });

  it("classifies non-preview labels as not-preview", () => {
    expect(classifyPreviewLabel("bug")).toMatchObject({ status: "not-preview" });
  });

  it("classifies empty slug as invalid", () => {
    expect(classifyPreviewLabel("preview:")).toMatchObject({ status: "invalid", slug: "" });
  });

  it("classifies malformed slugs as invalid", () => {
    expect(classifyPreviewLabel("preview:Upper")).toMatchObject({ status: "invalid", slug: "Upper" });
    expect(classifyPreviewLabel("preview:has space")).toMatchObject({ status: "invalid" });
    expect(classifyPreviewLabel(`preview:${"a".repeat(32)}`)).toMatchObject({ status: "invalid" });
  });

  it("classifies reserved literal names as reserved", () => {
    for (const reserved of ["main", "preview", "latest", "production", "staging"]) {
      expect(classifyPreviewLabel(`preview:${reserved}`)).toMatchObject({ status: "reserved", slug: reserved });
    }
  });

  it("classifies pr-{N} pattern as reserved", () => {
    expect(classifyPreviewLabel("preview:pr-123")).toMatchObject({ status: "reserved", slug: "pr-123" });
    expect(classifyPreviewLabel("preview:pr-0")).toMatchObject({ status: "reserved", slug: "pr-0" });
  });

  it("does not flag names containing reserved substrings as reserved", () => {
    expect(classifyPreviewLabel("preview:pre-production-check")).toEqual({
      status: "valid",
      slug: "pre-production-check",
    });
  });
});
