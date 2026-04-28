import { describe, expect, it } from "vitest";
import { buildMdFileOptions, resolveDocsHashForState, truncateMiddle } from "./FloatingSourceCodeViewer.helpers";

describe("FloatingSourceCodeViewer helpers", () => {
  it("truncates long strings in the middle", () => {
    expect(truncateMiddle("abcdefghijklmnopqrstuvwxyz", 10)).toBe("abcdef…xyz");
  });

  it("builds markdown options relative to the current file directory", () => {
    expect(
      buildMdFileOptions({
        adjacentMarkdownFiles: ["/src/pages/sandbox/foo/SPEC.md", "/src/pages/sandbox/foo/docs/notes.md"],
        filePath: "src/pages/sandbox/foo/index.tsx",
      }),
    ).toEqual([
      { label: "SPEC.md", value: "/src/pages/sandbox/foo/SPEC.md" },
      { label: "notes.md - docs/notes.md", value: "/src/pages/sandbox/foo/docs/notes.md" },
    ]);
  });

  it("joins pathname, search, and hash without extra processing", () => {
    expect(resolveDocsHashForState({ pathname: "/template", search: "?a=1", hash: "#docs=file" })).toBe(
      "/template?a=1#docs=file",
    );
  });
});
