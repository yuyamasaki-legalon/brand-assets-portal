import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { discoverSkills, extractReferencedFiles, parseSkill, stripFencedCodeBlocks } from "./parse-skill";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILLS_ROOT = path.resolve(__dirname, "../../skills");
const PROJECT_ROOT = path.resolve(SKILLS_ROOT, "..");

const ALLOWED_FRONTMATTER_KEYS = new Set([
  "name",
  "description",
  "license",
  "allowed-tools",
  "metadata",
  "user_invocable",
  "arguments",
  "disable-model-invocation",
]);

const skillNames = discoverSkills(SKILLS_ROOT);

describe.each(skillNames)("skill: %s", (skillName) => {
  const skillDir = path.join(SKILLS_ROOT, skillName);
  const skillMdPath = path.join(skillDir, "SKILL.md");

  // ── 1. SKILL.md 存在チェック ──
  it("SKILL.md が存在する", () => {
    expect(fs.existsSync(skillMdPath)).toBe(true);
  });

  // 以降のテストは SKILL.md が存在する前提
  describe("フロントマター構造", () => {
    it("YAML フロントマターで始まる", () => {
      const content = fs.readFileSync(skillMdPath, "utf-8");
      expect(content.startsWith("---\n")).toBe(true);
    });

    it("有効な YAML としてパース可能", () => {
      expect(() => parseSkill(skillDir)).not.toThrow();
    });

    it("フロントマターが辞書型である", () => {
      const { frontmatter } = parseSkill(skillDir);
      expect(typeof frontmatter).toBe("object");
      expect(frontmatter).not.toBeNull();
      expect(Array.isArray(frontmatter)).toBe(false);
    });

    it("許可されたキーのみ含む", () => {
      const { frontmatter } = parseSkill(skillDir);
      const keys = Object.keys(frontmatter);
      const unexpected = keys.filter((k) => !ALLOWED_FRONTMATTER_KEYS.has(k));
      expect(unexpected, `許可されていないキー: ${unexpected.join(", ")}`).toHaveLength(0);
    });
  });

  // ── 3. name フィールド ──
  describe("name フィールド", () => {
    it("name が存在する", () => {
      const { frontmatter } = parseSkill(skillDir);
      expect(frontmatter.name).toBeDefined();
    });

    it("name が文字列である", () => {
      const { frontmatter } = parseSkill(skillDir);
      expect(typeof frontmatter.name).toBe("string");
    });

    it("name がハイフンケース形式である", () => {
      const { frontmatter } = parseSkill(skillDir);
      expect(frontmatter.name).toMatch(/^[a-z0-9-]+$/);
    });

    it("name が先頭・末尾ハイフンや連続ハイフンを含まない", () => {
      const name = parseSkill(skillDir).frontmatter.name as string;
      expect(name.startsWith("-"), "先頭ハイフン").toBe(false);
      expect(name.endsWith("-"), "末尾ハイフン").toBe(false);
      expect(name.includes("--"), "連続ハイフン").toBe(false);
    });

    it("name が 64 文字以下である", () => {
      const name = parseSkill(skillDir).frontmatter.name as string;
      expect(name.length).toBeLessThanOrEqual(64);
    });

    it("name がディレクトリ名と一致する", () => {
      const { frontmatter, dirName } = parseSkill(skillDir);
      expect(frontmatter.name).toBe(dirName);
    });
  });

  // ── 4. description フィールド ──
  describe("description フィールド", () => {
    it("description が存在する", () => {
      const { frontmatter } = parseSkill(skillDir);
      expect(frontmatter.description).toBeDefined();
    });

    it("description が文字列である", () => {
      const { frontmatter } = parseSkill(skillDir);
      expect(typeof frontmatter.description).toBe("string");
    });

    it("description が空でない", () => {
      const desc = parseSkill(skillDir).frontmatter.description as string;
      expect(desc.trim().length).toBeGreaterThan(0);
    });

    it("description が角括弧 (<>) を含まない", () => {
      const desc = parseSkill(skillDir).frontmatter.description as string;
      expect(desc).not.toMatch(/[<>]/);
    });

    it("description が 1024 文字以下である", () => {
      const desc = parseSkill(skillDir).frontmatter.description as string;
      expect(desc.length).toBeLessThanOrEqual(1024);
    });
  });

  // ── 5. 構造チェック ──
  describe("構造チェック", () => {
    it("SKILL.md が 500 行以下である", () => {
      const { lineCount } = parseSkill(skillDir);
      expect(lineCount).toBeLessThanOrEqual(500);
    });

    it("SKILL.md に TODO:/FIXME: プレースホルダーがない", () => {
      const { body } = parseSkill(skillDir);
      const stripped = stripFencedCodeBlocks(body);
      expect(stripped).not.toMatch(/TODO:/);
      expect(stripped).not.toMatch(/FIXME:/);
    });

    it("参照されたファイルが全て存在する", () => {
      const { body } = parseSkill(skillDir);
      const refs = extractReferencedFiles(body, skillName);
      const missing = refs.filter(
        (ref) => !fs.existsSync(path.join(skillDir, ref)) && !fs.existsSync(path.join(PROJECT_ROOT, ref)),
      );
      expect(missing, `存在しないファイル: ${missing.join(", ")}`).toHaveLength(0);
    });
  });
});
