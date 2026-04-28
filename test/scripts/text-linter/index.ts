#!/usr/bin/env tsx
// Text Linter CLI - 日本語テキストスタイルガイドラインチェッカー

import * as fs from "node:fs";
import * as path from "node:path";
import { glob } from "glob";
import { parseArgs } from "./cli";
import { extractJapaneseTexts } from "./extractor";
import { applyAllFixes, validateText } from "./rules";
import type { FileViolation, Violation } from "./types";

// ANSI カラーコード
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  gray: "\x1b[90m",
  bold: "\x1b[1m",
};

function printHelp(): void {
  console.log(`
${colors.bold}Text Linter${colors.reset} - 日本語テキストスタイルガイドラインチェッカー

${colors.bold}Usage:${colors.reset}
  pnpm lint:text [options] [pattern]

${colors.bold}Options:${colors.reset}
  --fix             自動修正を適用
  --rules <ids>     チェックするルールを指定（カンマ区切り）
  --no-info         info レベルの出力を非表示にする
  --help, -h        ヘルプを表示

${colors.bold}Examples:${colors.reset}
  pnpm lint:text                              # src/**/*.tsx をチェック
  pnpm lint:text --fix                        # 自動修正を適用
  pnpm lint:text "src/pages/**/*.tsx"         # 特定のパターンをチェック
  pnpm lint:text --rules GENERAL-54           # snackbar ルールのみ
  pnpm lint:text --rules GENERAL-54,GENERAL-6 # 複数ルール指定
`);
}

// severity に応じた色を取得
function getSeverityColor(severity: Violation["severity"]): string {
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
function printViolation(violation: FileViolation): void {
  const { filePath, text, violation: v } = violation;
  const color = getSeverityColor(v.severity);

  console.log(`${colors.gray}${filePath}:${text.line}:${text.column}${colors.reset}`);
  console.log(`  ${color}${v.severity}${colors.reset}  ${colors.bold}${v.ruleId}${colors.reset}  ${v.description}`);
  console.log(
    `           ${colors.gray}検出:${colors.reset} ${v.incorrectText} ${colors.gray}→${colors.reset} ${v.suggestion}`,
  );
  console.log();
}

// ファイルを処理
function processFile(filePath: string, ruleFilter: string[] | null, hideInfo: boolean): FileViolation[] {
  const violations: FileViolation[] = [];

  try {
    const sourceCode = fs.readFileSync(filePath, "utf-8");
    const extractedTexts = extractJapaneseTexts(sourceCode, filePath);

    for (const extractedText of extractedTexts) {
      let textViolations = validateText(extractedText.text, extractedText.context);

      // ルールフィルタが指定されている場合は絞り込み
      if (ruleFilter) {
        textViolations = textViolations.filter((v) => ruleFilter.includes(v.ruleId));
      }

      for (const violation of textViolations) {
        if (hideInfo && violation.severity === "info") {
          continue;
        }
        violations.push({
          filePath,
          text: extractedText,
          violation,
        });
      }
    }
  } catch (error) {
    console.error(`${colors.red}Error processing ${filePath}:${colors.reset}`, error);
  }

  return violations;
}

// 自動修正を適用
function applyFixesToFile(filePath: string, ruleFilter: string[] | null, hideInfo: boolean): number {
  let fixCount = 0;

  try {
    let sourceCode = fs.readFileSync(filePath, "utf-8");
    const extractedTexts = extractJapaneseTexts(sourceCode, filePath);

    // 後ろから処理するために逆順ソート
    const sortedTexts = [...extractedTexts].sort((a, b) => b.start - a.start);

    for (const extractedText of sortedTexts) {
      let violations = validateText(extractedText.text, extractedText.context);

      // ルールフィルタが指定されている場合は絞り込み
      if (ruleFilter) {
        violations = violations.filter((v) => ruleFilter.includes(v.ruleId));
      }

      if (violations.length > 0) {
        if (hideInfo) {
          violations = violations.filter((v) => v.severity !== "info");
        }

        const fixedText = applyAllFixes(extractedText.text, violations);

        if (fixedText !== extractedText.text) {
          // ソースコード内の該当箇所を置換
          // 注意: extractedText.start/end はクォートを含む位置なので調整が必要
          const originalInSource = sourceCode.substring(extractedText.start, extractedText.end);

          // クォート文字を保持して中身だけ置換
          let replacement: string;
          if (originalInSource.startsWith("`")) {
            replacement = `\`${fixedText}\``;
          } else if (originalInSource.startsWith('"')) {
            replacement = `"${fixedText}"`;
          } else if (originalInSource.startsWith("'")) {
            replacement = `'${fixedText}'`;
          } else {
            // JSX テキストの場合はそのまま
            replacement = fixedText;
          }

          sourceCode =
            sourceCode.substring(0, extractedText.start) + replacement + sourceCode.substring(extractedText.end);

          fixCount += violations.length;
        }
      }
    }

    if (fixCount > 0) {
      fs.writeFileSync(filePath, sourceCode, "utf-8");
    }
  } catch (error) {
    console.error(`${colors.red}Error fixing ${filePath}:${colors.reset}`, error);
  }

  return fixCount;
}

// メイン処理
async function main(): Promise<void> {
  const args = parseArgs(process.argv);

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

  if (args.rules) {
    console.log(`${colors.bold}Checking ${files.length} files (rules: ${args.rules.join(", ")})...${colors.reset}\n`);
  } else {
    console.log(`${colors.bold}Checking ${files.length} files...${colors.reset}\n`);
  }

  if (args.fix) {
    // 自動修正モード
    let totalFixes = 0;
    let filesFixed = 0;

    for (const file of files) {
      const filePath = path.join(cwd, file);
      const fixCount = applyFixesToFile(filePath, args.rules, args.hideInfo);

      if (fixCount > 0) {
        console.log(`${colors.blue}Fixed${colors.reset} ${file} (${fixCount} problems)`);
        totalFixes += fixCount;
        filesFixed++;
      }
    }

    console.log();
    if (totalFixes > 0) {
      console.log(`${colors.bold}✓ Fixed ${totalFixes} problems in ${filesFixed} files${colors.reset}`);
    } else {
      console.log(`${colors.bold}✓ No problems to fix${colors.reset}`);
    }
  } else {
    // チェックモード
    const allViolations: FileViolation[] = [];

    for (const file of files) {
      const filePath = path.join(cwd, file);
      const violations = processFile(filePath, args.rules, args.hideInfo);
      allViolations.push(...violations);
    }

    // 結果を出力
    for (const violation of allViolations) {
      if (args.hideInfo && violation.violation.severity === "info") continue;
      printViolation(violation);
    }

    // サマリー
    const filteredViolations = args.hideInfo
      ? allViolations.filter((v) => v.violation.severity !== "info")
      : allViolations;
    const errorCount = filteredViolations.filter((v) => v.violation.severity === "error").length;
    const warningCount = filteredViolations.filter((v) => v.violation.severity === "warning").length;
    const infoCount = filteredViolations.filter((v) => v.violation.severity === "info").length;

    if (filteredViolations.length > 0) {
      console.log(
        `${colors.bold}✖ ${filteredViolations.length} problems${colors.reset} (${colors.red}${errorCount} errors${colors.reset}, ${colors.yellow}${warningCount} warnings${colors.reset}, ${colors.blue}${infoCount} info${colors.reset})`,
      );
      // エラーがある場合のみ非ゼロで終了
      if (errorCount > 0) {
        process.exit(1);
      }
    } else {
      console.log(`${colors.bold}✓ No problems found${colors.reset}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
