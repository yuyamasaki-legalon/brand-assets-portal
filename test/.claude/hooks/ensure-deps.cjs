/**
 * Claude Code PreToolUse Hook: ensure-deps
 *
 * pnpm コマンド実行前に依存関係の状態をチェックし、
 * 必要なら `pnpm install` を自動で前置する。
 */

const fs = require("fs");
const path = require("path");

// pnpm install 自体は対象外（無限ループ防止）
const INSTALL_PATTERN = /^\s*pnpm\s+(install|i|add|remove|update)\b/;

// hook 対象の pnpm サブコマンド
const TARGET_PATTERN =
  /^\s*pnpm\s+(dev|build|lint|format|fix:style|lint:style|lint:eslint-custom|sandbox:create|sandbox:create-user|test|preview)\b/;

function needsInstall(projectDir) {
  const nodeModules = path.join(projectDir, "node_modules");
  const modulesYaml = path.join(nodeModules, ".modules.yaml");
  const lockFile = path.join(projectDir, "pnpm-lock.yaml");

  // node_modules が存在しない
  if (!fs.existsSync(nodeModules)) {
    return true;
  }

  // .modules.yaml が存在しない
  if (!fs.existsSync(modulesYaml)) {
    return true;
  }

  // pnpm-lock.yaml の mtime > .modules.yaml の mtime → install 必要
  try {
    const lockStat = fs.statSync(lockFile);
    const yamlStat = fs.statSync(modulesYaml);
    if (lockStat.mtimeMs > yamlStat.mtimeMs) {
      return true;
    }
  } catch {
    // lock ファイルが無い場合などはスキップ
    return false;
  }

  return false;
}

async function main() {
  // stdin から JSON を読み取る
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const input = JSON.parse(Buffer.concat(chunks).toString());

  const command = input.tool_input?.command;
  if (typeof command !== "string") {
    return;
  }

  // pnpm install 系コマンドは対象外
  if (INSTALL_PATTERN.test(command)) {
    return;
  }

  // 対象コマンドかチェック
  if (!TARGET_PATTERN.test(command)) {
    return;
  }

  // プロジェクトディレクトリを特定
  const projectDir =
    process.env.CLAUDE_PROJECT_DIR || process.cwd();

  if (!needsInstall(projectDir)) {
    return;
  }

  // pnpm install を前置してコマンドを書き換え
  const result = {
    updatedInput: {
      command: `pnpm install && ${command}`,
    },
  };
  process.stdout.write(JSON.stringify(result));
}

main().catch(() => {
  // hook 自体の失敗時は元のコマンドをブロックしない
  process.exit(0);
});
