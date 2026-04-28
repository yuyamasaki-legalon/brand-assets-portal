import type { TocEntry } from "../types";
import { createSlugger, stripMarkdownInline } from "./slugify";

const atxHeadingPattern = /^(#{1,6})[ \t]+(.+?)(?:[ \t]+#+[ \t]*)?$/;
const setextHeadingPattern = /^(=+|-+)[ \t]*$/;

const normalizeHeadingText = (rawText: string) => stripMarkdownInline(rawText.trim());

export const extractMarkdownHeadings = (content: string): TocEntry[] => {
  const slugger = createSlugger();
  const headings: TocEntry[] = [];
  const lines = content.split(/\r?\n/);

  let inFencedCodeBlock = false;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (/^(```|~~~)/.test(trimmed)) {
      inFencedCodeBlock = !inFencedCodeBlock;
      continue;
    }

    if (inFencedCodeBlock || trimmed.length === 0) {
      continue;
    }

    const atxMatch = line.match(atxHeadingPattern);
    if (atxMatch) {
      const text = normalizeHeadingText(atxMatch[2]);
      if (!text) {
        continue;
      }

      headings.push({
        id: slugger(text),
        text,
        level: atxMatch[1].length,
      });
      continue;
    }

    const nextLine = lines[index + 1];
    if (!nextLine) {
      continue;
    }

    const setextMatch = nextLine.trim().match(setextHeadingPattern);
    if (!setextMatch) {
      continue;
    }

    const text = normalizeHeadingText(line);
    if (!text) {
      continue;
    }

    headings.push({
      id: slugger(text),
      text,
      level: setextMatch[1][0] === "=" ? 1 : 2,
    });
    index += 1;
  }

  return headings;
};
