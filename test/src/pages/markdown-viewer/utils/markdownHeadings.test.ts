import { describe, expect, it } from "vitest";
import { extractMarkdownHeadings } from "./markdownHeadings";

describe("extractMarkdownHeadings", () => {
  it("extracts ATX headings with stable deduplicated ids", () => {
    expect(extractMarkdownHeadings(["# Overview", "## Details", "## Details", "### `API` notes"].join("\n"))).toEqual([
      { id: "overview", text: "Overview", level: 1 },
      { id: "details", text: "Details", level: 2 },
      { id: "details-1", text: "Details", level: 2 },
      { id: "api-notes", text: "API notes", level: 3 },
    ]);
  });

  it("ignores fenced code blocks and supports setext headings", () => {
    expect(
      extractMarkdownHeadings(["Title", "=====", "", "```md", "# Ignored", "```", "", "Section", "-----"].join("\n")),
    ).toEqual([
      { id: "title", text: "Title", level: 1 },
      { id: "section", text: "Section", level: 2 },
    ]);
  });
});
