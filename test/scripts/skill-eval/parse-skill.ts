import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";

export interface SkillFrontmatter {
  name?: unknown;
  description?: unknown;
  license?: unknown;
  "allowed-tools"?: unknown;
  metadata?: unknown;
  [key: string]: unknown;
}

export interface SkillData {
  frontmatter: SkillFrontmatter;
  body: string;
  lineCount: number;
  dirName: string;
  skillPath: string;
}

/**
 * `skills/` 直下の全ディレクトリ名を返す
 */
export function discoverSkills(root: string): string[] {
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

/**
 * SKILL.md を読み込み、frontmatter と body を分割・パースして SkillData を返す
 */
export function parseSkill(skillDir: string): SkillData {
  const skillPath = path.join(skillDir, "SKILL.md");
  const content = fs.readFileSync(skillPath, "utf-8");
  const lines = content.split("\n");
  const lineCount = lines.length;
  const dirName = path.basename(skillDir);

  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    return {
      frontmatter: {},
      body: content,
      lineCount,
      dirName,
      skillPath,
    };
  }

  const frontmatter = parse(match[1]) as SkillFrontmatter;
  const body = content.slice(match[0].length);

  return { frontmatter, body, lineCount, dirName, skillPath };
}

/**
 * ` ``` ` で囲まれたフェンスドコードブロックを除去
 */
export function stripFencedCodeBlocks(text: string): string {
  return text.replace(/^```[\s\S]*?^```/gm, "");
}

/**
 * 例示コンテキスト内の行を除去する。
 * - `**Example**:` / `**Examples**:` を含む行
 * - `Example:` で始まるブロック（後続の空行・番号リストを含む）
 */
export function stripExampleBlocks(text: string): string {
  const lines = text.split("\n");
  const result: string[] = [];
  let inExampleBlock = false;

  for (const line of lines) {
    // 行内に **Example**: / **Examples**: マーカーがある → スキップ
    if (/\*\*Examples?\*\*/.test(line)) {
      result.push("");
      continue;
    }

    // "Example:" で始まるブロック開始
    if (/^Example:/.test(line)) {
      inExampleBlock = true;
      result.push("");
      continue;
    }

    if (inExampleBlock) {
      // 空行・番号リストはブロック継続
      if (line.trim() === "" || /^\d+\./.test(line.trim())) {
        result.push("");
        continue;
      }
      // それ以外でブロック終了
      inExampleBlock = false;
    }

    result.push(line);
  }

  return result.join("\n");
}

/**
 * body からフェンスドコードブロックと例示ブロックを除外した上で、
 * `references/`・`scripts/`・`assets/` への参照パスを抽出
 */
export function extractReferencedFiles(body: string, _skillName: string): string[] {
  const stripped = stripExampleBlocks(stripFencedCodeBlocks(body));

  const patterns = [/\]\(((?:references|scripts|assets)\/[^)]+)\)/g, /`((?:references|scripts|assets)\/[^`]+)`/g];

  const files = new Set<string>();
  for (const pattern of patterns) {
    for (const match of stripped.matchAll(pattern)) {
      files.add(match[1]);
    }
  }

  return [...files].sort();
}
