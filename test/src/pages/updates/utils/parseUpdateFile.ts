import type { UpdateFileMeta, UpdateItem, UpdateSection } from "../types";

const parseFrontmatter = (raw: string): { meta: UpdateFileMeta; body: string } => {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    throw new Error("Invalid frontmatter format");
  }

  const frontmatterStr = match[1];
  const body = match[2].trim();

  const meta: Record<string, string> = {};
  for (const line of frontmatterStr.split("\n")) {
    const kvMatch = line.match(/^(\w+):\s*"?([^"]*)"?\s*$/);
    if (kvMatch) {
      meta[kvMatch[1]] = kvMatch[2];
    }
  }

  return {
    meta: {
      period: meta.period ?? "",
      date: meta.date ?? "",
      commitCount: Number(meta.commitCount) || 0,
    },
    body,
  };
};

const parseItem = (block: string): UpdateItem | null => {
  const lines = block.trim().split("\n");
  if (lines.length === 0) return null;

  // ## タイトル
  const titleMatch = lines[0].match(/^##\s+(.+)$/);
  if (!titleMatch) return null;
  const title = titleMatch[1];

  // `Tag名`
  let tag = "";
  let description = "";
  let impact = "";

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const tagMatch = line.match(/^`([^`]+)`$/);
    if (tagMatch) {
      tag = tagMatch[1];
      continue;
    }

    const impactMatch = line.match(/^\*\*これにより:\*\*\s*(.+)$/);
    if (impactMatch) {
      impact = impactMatch[1];
      continue;
    }

    // 空行を除いた残りの行が description
    if (line.trim() !== "") {
      if (description) {
        description += `\n${line}`;
      } else {
        description = line;
      }
    }
  }

  return { title, tag, description, impact };
};

export const parseUpdateFile = (raw: string): UpdateSection => {
  const { meta, body } = parseFrontmatter(raw);

  // 本文を --- (horizontal rule) で分割
  const blocks = body.split(/\n---\n/);
  const items: UpdateItem[] = [];

  for (const block of blocks) {
    const item = parseItem(block);
    if (item) {
      items.push(item);
    }
  }

  return { meta, items };
};
