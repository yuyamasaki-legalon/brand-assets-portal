/**
 * Claude Code PreToolUse Hook: aegis-gate-review
 *
 * git push 実行前に変更ファイルを軽量チェックし、
 * Aegis デザインシステムの重大な違反があれば警告を出す。
 *
 * チェック項目（ESLint で未カバーのもののみ）:
 *   1. 生 HTML インタラクティブ要素（<button>, <input>, <select>, <textarea>）
 *   2. ページファイルに PageLayout import なし
 *
 * 警告のみ（push はブロックしない）。
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// git push コマンドの検出
const PUSH_PATTERN = /^\s*git\s+push\b/;

// チェック対象の拡張子
const TARGET_EXTENSIONS = new Set([".tsx", ".ts"]);

// コメント行の簡易検出（// or /* で始まる行）
function isCommentLine(line) {
  const trimmed = line.trim();
  return trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*");
}

// 文字列リテラル内の簡易検出（行内にクォートで囲まれた部分）
function stripStringLiterals(line) {
  return line
    .replace(/"(?:[^"\\]|\\.)*"/g, '""')
    .replace(/'(?:[^'\\]|\\.)*'/g, "''")
    .replace(/`(?:[^`\\]|\\.)*`/g, "``");
}

function getChangedFiles(projectDir) {
  try {
    // push 対象の全コミット + 未コミットの変更ファイルを取得
    // 優先順: @{upstream}..HEAD → main/master (local or origin) との merge-base..HEAD → HEAD~1..HEAD
    // 初回 push で upstream がないケースや fresh worktree でも merge-base で全コミットをカバーする
    const committed = execSync(
      'git diff --name-only @{upstream}..HEAD 2>/dev/null || git diff --name-only "$(git merge-base HEAD main 2>/dev/null || git merge-base HEAD master 2>/dev/null || git merge-base HEAD origin/main 2>/dev/null || git merge-base HEAD origin/master 2>/dev/null || echo HEAD~1)"..HEAD 2>/dev/null || true',
      { cwd: projectDir, encoding: "utf-8", shell: "/bin/zsh" },
    ).trim();

    const uncommitted = execSync("git diff --name-only 2>/dev/null || true", {
      cwd: projectDir,
      encoding: "utf-8",
    }).trim();

    const staged = execSync("git diff --cached --name-only 2>/dev/null || true", {
      cwd: projectDir,
      encoding: "utf-8",
    }).trim();

    const allFiles = new Set(
      [committed, uncommitted, staged]
        .join("\n")
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
    );

    return [...allFiles].filter((f) => {
      const ext = path.extname(f);
      return TARGET_EXTENSIONS.has(ext) && f.startsWith("src/");
    });
  } catch {
    return [];
  }
}

function checkFile(filePath, projectDir) {
  const fullPath = path.join(projectDir, filePath);
  if (!fs.existsSync(fullPath)) return [];

  const content = fs.readFileSync(fullPath, "utf-8");
  const lines = content.split("\n");
  const warnings = [];

  // ルートエントリファイルのみ対象。_shared/ 等の _ プレフィックスセグメントは除外
  const isPageFile =
    /src\/pages\/.*\/(index\.tsx|Page\.tsx)$/.test(filePath) && !/\/_[^/]+\//.test(filePath);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (isCommentLine(line)) continue;

    const cleaned = stripStringLiterals(line);

    // Check 1: 生 HTML インタラクティブ要素
    const rawHtmlMatch = cleaned.match(/<(button|input|select|textarea)[\s>]/i);
    if (rawHtmlMatch) {
      const tag = rawHtmlMatch[1].toLowerCase();
      const aegisMap = {
        button: "Button / IconButton",
        input: "TextField / Checkbox / RadioButton / Switch",
        select: "Select",
        textarea: "Textarea",
      };
      warnings.push({
        file: filePath,
        line: i + 1,
        message: `<${tag}> を検出。Aegis <${aegisMap[tag]}> を使用してください`,
      });
    }

    // IconButton aria-label チェックは ESLint require-iconbutton-aria-label で pre-commit 時にカバー済み
  }

  // Check 3: ページファイルに PageLayout がない
  if (isPageFile && !content.includes("PageLayout")) {
    warnings.push({
      file: filePath,
      line: 1,
      message: "ページファイルに PageLayout の import がありません",
    });
  }

  return warnings;
}

async function main() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const input = JSON.parse(Buffer.concat(chunks).toString());

  const command = input.tool_input?.command;
  if (typeof command !== "string") return;

  // git push 以外は即スキップ
  if (!PUSH_PATTERN.test(command)) return;

  const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const changedFiles = getChangedFiles(projectDir);

  if (changedFiles.length === 0) return;

  const allWarnings = [];
  for (const file of changedFiles) {
    const warnings = checkFile(file, projectDir);
    allWarnings.push(...warnings);
  }

  if (allWarnings.length === 0) return;

  // stderr に警告を出力（push はブロックしない）
  const header = `\n⚠️  Aegis Gate Review: ${allWarnings.length} 件の警告\n`;
  const details = allWarnings
    .map((w) => `  ${w.file}:${w.line} — ${w.message}`)
    .join("\n");
  const footer = "\n  push は続行されます。修正が必要な場合は後で対応してください。\n";

  process.stderr.write(header + details + footer);
}

main().catch(() => {
  // hook 自体の失敗時はブロックしない
  process.exit(0);
});
