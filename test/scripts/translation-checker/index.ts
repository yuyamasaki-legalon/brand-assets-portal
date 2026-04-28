#!/usr/bin/env tsx
// Translation Checker CLI - 翻訳品質チェッカー
// 新ロジック: 日本語が含まれる → 正訳が使われていない → 違反

import * as path from "node:path";
import { glob } from "glob";
import { applyFixes, parseTranslationsFile } from "./parser";
import type { FileViolation, TranslationViolation } from "./types";
import { validateTerminology } from "./validators/terminology";

// ANSI カラーコード
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  green: "\x1b[32m",
  gray: "\x1b[90m",
  bold: "\x1b[1m",
};

// CLI 引数解析
interface CliArgs {
  help: boolean;
  fix: boolean;
  pattern: string;
  rules: string[] | null;
  verbose: boolean;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);

  let rules: string[] | null = null;
  const rulesIndex = args.indexOf("--rules");
  if (rulesIndex !== -1 && args[rulesIndex + 1]) {
    rules = args[rulesIndex + 1].split(",").map((r) => r.trim().toUpperCase());
  }

  return {
    help: args.includes("--help") || args.includes("-h"),
    fix: args.includes("--fix"),
    verbose: args.includes("--verbose") || args.includes("-v"),
    pattern:
      args.find((arg) => !arg.startsWith("-") && args[args.indexOf(arg) - 1] !== "--rules") ||
      "src/pages/sandbox/**/translations.ts",
    rules,
  };
}

function printHelp(): void {
  console.log(`
${colors.bold}Translation Checker${colors.reset} - 翻訳品質チェッカー

${colors.bold}Usage:${colors.reset}
  pnpm lint:translation [options] [pattern]

${colors.bold}Options:${colors.reset}
  --fix             自動修正を適用（incorrect パターンが定義されているルールのみ）
  --rules <ids>     チェックするルールを指定（カンマ区切り、例: TERM-001,TERM-002）
  --verbose, -v     詳細な出力を表示
  --help, -h        ヘルプを表示

${colors.bold}Examples:${colors.reset}
  pnpm lint:translation                                    # デフォルトパターンをチェック
  pnpm lint:translation --fix                              # 自動修正を適用
  pnpm lint:translation "src/pages/sandbox/**/translations.ts"  # 特定のパターン
  pnpm lint:translation --rules TERM-001                   # 特定のルールのみ

${colors.bold}管理:${colors.reset}
  pnpm translation:generate    # CSV から terminology.json を再生成
`);
}

// severity に応じた色を取得
function getSeverityColor(severity: TranslationViolation["severity"]): string {
  switch (severity) {
    case "error":
      return colors.red;
    case "warning":
      return colors.yellow;
    case "info":
      return colors.blue;
  }
}

// 結果を整形して出力
function printViolation(violation: FileViolation, verbose: boolean, showFixable: boolean): void {
  const { filePath, entry, violation: v } = violation;
  const color = getSeverityColor(v.severity);
  const fixable = v.autoFix ? `${colors.green}[fixable]${colors.reset}` : "";

  console.log(`${colors.gray}${filePath}:${entry.line}${colors.reset} ${colors.bold}[${entry.key}]${colors.reset}`);
  console.log(
    `  ${color}${v.severity}${colors.reset}  ${colors.bold}${v.ruleId}${colors.reset}  ${v.description} ${showFixable ? fixable : ""}`,
  );
  console.log(`           ${colors.gray}期待:${colors.reset} "${v.expectedText}"`);
  if (!verbose) {
    console.log(`           ${colors.gray}現在:${colors.reset} "${entry.enText}"`);
  }

  if (verbose) {
    console.log(`           ${colors.gray}ja-JP:${colors.reset} ${entry.jaText}`);
    console.log(`           ${colors.gray}en-US:${colors.reset} ${entry.enText}`);
    if (v.incorrectText) {
      console.log(`           ${colors.gray}誤訳パターン:${colors.reset} "${v.incorrectText}"`);
    }
  }

  console.log();
}

// ファイルを処理
interface ProcessResult {
  violations: FileViolation[];
  hasError: boolean;
}

function processFile(filePath: string, ruleFilter: string[] | null): ProcessResult {
  const violations: FileViolation[] = [];

  try {
    const parsed = parseTranslationsFile(filePath);

    for (const entry of parsed.entries) {
      let entryViolations = validateTerminology(entry);

      // ルールフィルタが指定されている場合は絞り込み
      if (ruleFilter) {
        entryViolations = entryViolations.filter((v) => ruleFilter.includes(v.ruleId));
      }

      for (const violation of entryViolations) {
        violations.push({
          filePath,
          entry,
          violation,
        });
      }
    }
    return { violations, hasError: false };
  } catch (error) {
    console.error(`${colors.red}Error processing ${filePath}:${colors.reset}`, error);
    return { violations, hasError: true };
  }
}

// メイン処理
async function main(): Promise<void> {
  const args = parseArgs();

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  const cwd = process.cwd();
  const files = await glob(args.pattern, {
    cwd,
    ignore: ["**/node_modules/**", "**/dist/**"],
  });

  if (files.length === 0) {
    console.log(`${colors.yellow}No files found matching: ${args.pattern}${colors.reset}`);
    process.exit(0);
  }

  const modeStr = args.fix ? "(fix mode)" : "";
  if (args.rules) {
    console.log(
      `${colors.bold}Checking ${files.length} files ${modeStr}(rules: ${args.rules.join(", ")})...${colors.reset}\n`,
    );
  } else {
    console.log(`${colors.bold}Checking ${files.length} files ${modeStr}...${colors.reset}\n`);
  }

  // ファイルごとに処理
  const allViolations: FileViolation[] = [];
  let parseErrorCount = 0;
  let totalFixedCount = 0;

  for (const file of files) {
    const filePath = path.join(cwd, file);
    const result = processFile(filePath, args.rules);
    if (result.hasError) {
      parseErrorCount++;
    }

    // 修正モードの場合、autoFix 可能な違反を修正
    if (args.fix) {
      const fixableViolations = result.violations.filter((v) => v.violation.autoFix && v.violation.incorrectText);

      if (fixableViolations.length > 0) {
        const fixes = fixableViolations.map((v) => ({
          key: v.entry.key,
          incorrectText: v.violation.incorrectText as string,
          correctText: v.violation.expectedText,
        }));

        const fixedItems = applyFixes(filePath, fixes);
        totalFixedCount += fixedItems.length;

        // key+incorrectText でセットを作成（同一キーの複数違反を個別に追跡）
        const fixedSet = new Set(fixedItems.map((f) => `${f.key}::${f.incorrectText}`));

        // 実際に修正されたもののみ除外し、修正できなかったものは残す
        const unfixedViolations = result.violations.filter((v) => {
          const isFixable = v.violation.autoFix && v.violation.incorrectText;
          if (!isFixable) return true;
          return !fixedSet.has(`${v.entry.key}::${v.violation.incorrectText}`);
        });
        allViolations.push(...unfixedViolations);
      } else {
        allViolations.push(...result.violations);
      }
    } else {
      allViolations.push(...result.violations);
    }
  }

  // 結果を出力（修正モードでない場合、または修正できなかった違反）
  for (const violation of allViolations) {
    printViolation(violation, args.verbose, !args.fix);
  }

  // サマリー
  const errorCount = allViolations.filter((v) => v.violation.severity === "error").length;
  const warningCount = allViolations.filter((v) => v.violation.severity === "warning").length;
  const infoCount = allViolations.filter((v) => v.violation.severity === "info").length;
  const fixableCount = allViolations.filter((v) => v.violation.autoFix).length;

  if (args.fix && totalFixedCount > 0) {
    console.log(`${colors.green}✓ ${totalFixedCount} problem(s) fixed${colors.reset}`);
  }

  if (allViolations.length > 0) {
    let summary = `${colors.bold}✖ ${allViolations.length} problems${colors.reset} (${colors.red}${errorCount} errors${colors.reset}, ${colors.yellow}${warningCount} warnings${colors.reset}, ${colors.blue}${infoCount} info${colors.reset})`;
    if (!args.fix && fixableCount > 0) {
      summary += `\n  ${colors.green}${fixableCount} fixable with --fix${colors.reset}`;
    }
    console.log(summary);
  } else if (totalFixedCount === 0) {
    console.log(`${colors.bold}✓ No translation problems found${colors.reset}`);
  }

  // パースエラーがあった場合も非ゼロで終了
  if (parseErrorCount > 0) {
    console.log(`${colors.red}${parseErrorCount} file(s) failed to parse${colors.reset}`);
    process.exit(1);
  }

  // エラーがある場合のみ非ゼロで終了
  if (errorCount > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
