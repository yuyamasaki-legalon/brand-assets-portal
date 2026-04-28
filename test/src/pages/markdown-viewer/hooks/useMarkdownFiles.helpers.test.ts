import { describe, expect, it } from "vitest";
import type { MarkdownFile } from "../types";
import { filterMarkdownFiles, getMissingMarkdownPaths, resolveSelectedMarkdownPath } from "./useMarkdownFiles.helpers";

const files: MarkdownFile[] = [
  { path: "/docs/guide.md", title: "guide", category: "docs" },
  { path: "/src/pages/sandbox/foo/SPEC.md", title: "SPEC", category: "sandbox" },
];

describe("useMarkdownFiles helpers", () => {
  it("resolves selected path only when registered", () => {
    expect(resolveSelectedMarkdownPath("/docs/guide.md", (path) => path === "/docs/guide.md")).toBe("/docs/guide.md");
    expect(resolveSelectedMarkdownPath("/docs/missing.md", () => false)).toBeNull();
  });

  it("finds missing markdown paths from cache", () => {
    expect(getMissingMarkdownPaths(files, { "/docs/guide.md": "loaded" })).toEqual(["/src/pages/sandbox/foo/SPEC.md"]);
  });

  it("filters by category and query against title, path, and content", () => {
    expect(
      filterMarkdownFiles({
        files,
        searchQuery: "spec",
        categoryFilter: "sandbox",
        contentCache: {},
      }),
    ).toEqual([{ path: "/src/pages/sandbox/foo/SPEC.md", title: "SPEC", category: "sandbox" }]);

    expect(
      filterMarkdownFiles({
        files,
        searchQuery: "loaded text",
        categoryFilter: "all",
        contentCache: { "/docs/guide.md": "Loaded text here" },
      }),
    ).toEqual([{ path: "/docs/guide.md", title: "guide", category: "docs" }]);
  });
});
