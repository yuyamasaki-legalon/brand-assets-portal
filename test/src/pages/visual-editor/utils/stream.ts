import type { FileReferenceMatch, StreamInlineToken, StreamSegment } from "../types";

// Match file references: absolute paths (/...), or relative paths (src/...)
// Supports [path], (path), and bare path forms, with optional line:col or #L markers
const fileReferencePattern =
  /(\[((?:\/[^\]\n]*|src\/[^\]\n]*?)\.[A-Za-z0-9]+(?:#L\d+(?:C\d+)?|:\d+(?::\d+)?)?)\]|\(((?:\/[^)\n]*|src\/[^)\n]*?)\.[A-Za-z0-9]+(?:#L\d+(?:C\d+)?|:\d+(?::\d+)?)?)\)|((?:\/(?:[^\s\n])+|src\/[^\s\n]+?)\.[A-Za-z0-9]+(?:#L\d+(?:C\d+)?|:\d+(?::\d+)?)?))/g;

const parseFileReferenceText = (rawValue: string, workspaceDir: string): FileReferenceMatch | null => {
  const unwrapped = rawValue.replace(/^\[|\]$/g, "").replace(/^\(|\)$/g, "");
  const match = unwrapped.match(/^(.*?)(?:#L(\d+)(?:C(\d+))?|:(\d+)(?::(\d+))?)?$/);
  if (!match) return null;

  const rawPath = match[1];
  if (!(rawPath.startsWith("/") || rawPath.startsWith("src/"))) {
    return null;
  }

  const lineText = match[2] ?? match[4] ?? null;
  const columnText = match[3] ?? match[5] ?? null;
  const absolutePath = rawPath.startsWith("/") ? rawPath : `${workspaceDir.replace(/\/$/, "")}/${rawPath}`;

  return {
    absolutePath,
    column: columnText ? Number(columnText) : null,
    displayText: unwrapped,
    fullMatch: rawValue,
    line: lineText ? Number(lineText) : null,
    pathText: rawPath,
  };
};

export const tokenizeFileReferences = (value: string, workspaceDir: string): StreamInlineToken[] => {
  const tokens: StreamInlineToken[] = [];
  let cursor = 0;

  for (const match of value.matchAll(fileReferencePattern)) {
    const fullMatch = match[0];
    const startIndex = match.index ?? 0;
    const parsed = parseFileReferenceText(fullMatch, workspaceDir);
    if (!parsed) continue;

    if (startIndex > cursor) {
      tokens.push({ key: `text-${cursor}`, type: "text", value: value.slice(cursor, startIndex) });
    }

    tokens.push({ key: `file-${startIndex}`, type: "file", value: parsed });
    cursor = startIndex + fullMatch.length;
  }

  if (cursor < value.length) {
    tokens.push({ key: `text-${cursor}`, type: "text", value: value.slice(cursor) });
  }

  return tokens.length > 0 ? tokens : [{ key: "text-0", type: "text", value }];
};

export const parseStreamSegments = (value: string): StreamSegment[] => {
  const segments: StreamSegment[] = [];
  let cursor = 0;

  while (cursor < value.length) {
    const fenceStart = value.indexOf("```", cursor);
    if (fenceStart === -1) {
      const remainder = value.slice(cursor);
      if (remainder) {
        segments.push({ type: "text", content: remainder, key: `text-${cursor}` });
      }
      break;
    }

    if (fenceStart > cursor) {
      segments.push({ type: "text", content: value.slice(cursor, fenceStart), key: `text-${cursor}` });
    }

    const fenceLineEnd = value.indexOf("\n", fenceStart);
    if (fenceLineEnd === -1) {
      segments.push({
        type: "code",
        language: value.slice(fenceStart + 3).trim(),
        content: "",
        isOpen: true,
        key: `code-${fenceStart}`,
      });
      break;
    }

    const language =
      value
        .slice(fenceStart + 3, fenceLineEnd)
        .trim()
        .split(/\s+/)[0] ?? "";
    const contentStart = fenceLineEnd + 1;
    const fenceClose = value.indexOf("\n```", contentStart);

    if (fenceClose === -1) {
      segments.push({
        type: "code",
        language,
        content: value.slice(contentStart),
        isOpen: true,
        key: `code-${fenceStart}`,
      });
      break;
    }

    segments.push({
      type: "code",
      language,
      content: value.slice(contentStart, fenceClose),
      isOpen: false,
      key: `code-${fenceStart}`,
    });
    cursor = fenceClose + 4;
  }

  return segments.filter((segment) => segment.content.length > 0 || segment.type === "code");
};
