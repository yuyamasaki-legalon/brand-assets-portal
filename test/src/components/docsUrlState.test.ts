import { describe, expect, it } from "vitest";
import { buildDocsHash, normalizeMdIdentifier, parseDocsHash, resolveInitialMdFile } from "./docsUrlState";

describe("docsUrlState", () => {
  it("parses docs hash without file", () => {
    expect(parseDocsHash("#docs")).toEqual({ isOpen: true, fileId: null });
  });

  it("parses docs hash with encoded file id", () => {
    const hash = "#docs=src%2Fpages%2Fsandbox%2Fusers%2Fwataryooou%2Floc-case-claude%2FSPEC.md";
    expect(parseDocsHash(hash)).toEqual({
      isOpen: true,
      fileId: "src/pages/sandbox/users/wataryooou/loc-case-claude/SPEC.md",
    });
  });

  it("ignores unrelated hash", () => {
    expect(parseDocsHash("#other")).toEqual({ isOpen: false, fileId: null });
  });

  it("builds docs hash with normalized identifier", () => {
    expect(buildDocsHash("/src/pages/sandbox/foo/SPEC.md", normalizeMdIdentifier)).toBe(
      "#docs=src%2Fpages%2Fsandbox%2Ffoo%2FSPEC.md",
    );
  });

  it("builds docs hash without file", () => {
    expect(buildDocsHash(null, normalizeMdIdentifier)).toBe("#docs");
  });

  it("resolves initial file using hash identifier", () => {
    const adjacent = ["/src/pages/sandbox/foo/SPEC.md", "/src/pages/sandbox/foo/PRD.md"];
    expect(
      resolveInitialMdFile({
        adjacentMarkdownFiles: adjacent,
        selectedMdFile: null,
        hashFileId: "src/pages/sandbox/foo/PRD.md",
        normalizeIdentifier: normalizeMdIdentifier,
      }),
    ).toBe("/src/pages/sandbox/foo/PRD.md");
  });

  it("resolves initial file using legacy filename hash", () => {
    const adjacent = ["/src/pages/sandbox/foo/SPEC.md", "/src/pages/sandbox/foo/PRD.md"];
    expect(
      resolveInitialMdFile({
        adjacentMarkdownFiles: adjacent,
        selectedMdFile: null,
        hashFileId: "SPEC.md",
        normalizeIdentifier: normalizeMdIdentifier,
      }),
    ).toBe("/src/pages/sandbox/foo/SPEC.md");
  });

  it("falls back to first file when hash is missing", () => {
    const adjacent = ["/src/pages/sandbox/foo/SPEC.md", "/src/pages/sandbox/foo/PRD.md"];
    expect(
      resolveInitialMdFile({
        adjacentMarkdownFiles: adjacent,
        selectedMdFile: null,
        hashFileId: null,
        normalizeIdentifier: normalizeMdIdentifier,
      }),
    ).toBe("/src/pages/sandbox/foo/SPEC.md");
  });

  it("keeps selected file when already set", () => {
    const adjacent = ["/src/pages/sandbox/foo/SPEC.md", "/src/pages/sandbox/foo/PRD.md"];
    expect(
      resolveInitialMdFile({
        adjacentMarkdownFiles: adjacent,
        selectedMdFile: "/src/pages/sandbox/foo/PRD.md",
        hashFileId: "SPEC.md",
        normalizeIdentifier: normalizeMdIdentifier,
      }),
    ).toBe("/src/pages/sandbox/foo/PRD.md");
  });

  it("returns null when no markdown files are present", () => {
    expect(
      resolveInitialMdFile({
        adjacentMarkdownFiles: [],
        selectedMdFile: null,
        hashFileId: "SPEC.md",
        normalizeIdentifier: normalizeMdIdentifier,
      }),
    ).toBeNull();
  });
});
