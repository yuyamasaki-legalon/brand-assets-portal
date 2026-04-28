/**
 * CSV 辞書データベースから terminology.json を自動生成
 *
 * 使用方法:
 *   pnpm translation:generate
 *
 * CSV 更新時に再実行すれば terminology.json が即座に更新される
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

// 型定義
interface CsvTerm {
  japanese: string;
  english: string;
  definition: string;
  context: string;
  screen: string;
  category: string;
  usFirstRelease: boolean;
  notApplicableForUs: boolean;
  termOrPhrase: string;
}

interface CsvPhrase {
  japanese: string;
  english: string;
  reviewed: boolean;
  note: string;
  uiDisplay: string;
  termOrPhrase: string;
}

interface TerminologyRule {
  id: string;
  ja: string;
  correct: string;
  context?: string;
  severity: "error" | "warning" | "info";
  source: "terms" | "phrases";
}

interface TerminologyJson {
  rules: TerminologyRule[];
}

// パス定義
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = path.join(SCRIPT_DIR, "../docs/translation-dictionary-database");
const GLOSSARY_DIR = path.join(SCRIPT_DIR, "../glossary");
const TERMS_CSV = path.join(DOCS_DIR, "terms.csv");
const PHRASES_CSV = path.join(DOCS_DIR, "phrases.csv");
const TERMINOLOGY_JSON = path.join(GLOSSARY_DIR, "terminology.json");

// CSV パーサー（依存なし）
function parseCsv(content: string): string[][] {
  const lines: string[][] = [];
  let currentLine: string[] = [];
  let currentField = "";
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        currentLine.push(currentField.trim());
        currentField = "";
      } else if (char === "\n" || (char === "\r" && nextChar === "\n")) {
        currentLine.push(currentField.trim());
        if (currentLine.some((f) => f !== "")) {
          lines.push(currentLine);
        }
        currentLine = [];
        currentField = "";
        if (char === "\r") i++;
      } else {
        currentField += char;
      }
    }
  }

  if (currentField || currentLine.length > 0) {
    currentLine.push(currentField.trim());
    if (currentLine.some((f) => f !== "")) {
      lines.push(currentLine);
    }
  }

  return lines;
}

// terms.csv をパース
function parseTermsCsv(filePath: string): CsvTerm[] {
  const content = fs.readFileSync(filePath, "utf-8").replace(/^\uFEFF/, "");
  const rows = parseCsv(content);
  if (rows.length === 0) return [];

  return rows
    .slice(1)
    .map((row) => ({
      japanese: row[0] || "",
      english: row[1] || "",
      definition: row[2] || "",
      context: row[3] || "",
      screen: row[4] || "",
      category: row[5] || "",
      usFirstRelease: row[6]?.toLowerCase() === "yes",
      notApplicableForUs: row[7]?.toLowerCase() === "yes",
      termOrPhrase: row[8] || "term",
    }))
    .filter((term) => term.japanese && term.english);
}

// phrases.csv をパース
function parsePhrasesCsv(filePath: string): CsvPhrase[] {
  const content = fs.readFileSync(filePath, "utf-8").replace(/^\uFEFF/, "");
  const rows = parseCsv(content);
  if (rows.length === 0) return [];

  return rows
    .slice(1)
    .map((row) => ({
      japanese: row[0] || "",
      english: row[1] || "",
      reviewed: row[2]?.toLowerCase() === "yes",
      note: row[3] || "",
      uiDisplay: row[4] || "",
      termOrPhrase: row[7] || "phrase",
    }))
    .filter((phrase) => phrase.japanese && phrase.english);
}

// English が複数行や特殊文字を含む場合はスキップ
function isValidEnglish(english: string): boolean {
  // 改行を含む、または空
  if (english.includes("\n") || english.trim() === "") {
    return false;
  }
  // プレースホルダーのみ（{x1} など）
  if (/^\{[^}]+\}$/.test(english.trim())) {
    return false;
  }
  return true;
}

// terminology.json を生成
function generateTerminology(terms: CsvTerm[], phrases: CsvPhrase[]): TerminologyJson {
  const rules: TerminologyRule[] = [];
  const seen = new Set<string>();
  let idCounter = 1;

  // terms.csv から生成（US リリース対象のみ）
  for (const term of terms) {
    if (!term.usFirstRelease || term.notApplicableForUs) continue;
    if (!isValidEnglish(term.english)) continue;

    const key = `${term.japanese}|${term.english}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const context = term.definition || term.context || undefined;

    rules.push({
      id: `TERM-${String(idCounter++).padStart(3, "0")}`,
      ja: term.japanese,
      correct: term.english,
      context: context,
      severity: "warning",
      source: "terms",
    });
  }

  // phrases.csv から生成（レビュー済みのみ）
  for (const phrase of phrases) {
    if (!phrase.reviewed) continue;
    if (!isValidEnglish(phrase.english)) continue;

    const key = `${phrase.japanese}|${phrase.english}`;
    if (seen.has(key)) continue;
    seen.add(key);

    rules.push({
      id: `PHRASE-${String(idCounter++).padStart(3, "0")}`,
      ja: phrase.japanese,
      correct: phrase.english,
      context: phrase.note || undefined,
      severity: "info",
      source: "phrases",
    });
  }

  return { rules };
}

// メイン処理
function main() {
  console.log("=== Generating terminology.json from CSV ===\n");

  // ファイル存在チェック
  if (!fs.existsSync(TERMS_CSV)) {
    console.error(`Error: ${TERMS_CSV} not found`);
    process.exit(1);
  }
  if (!fs.existsSync(PHRASES_CSV)) {
    console.error(`Error: ${PHRASES_CSV} not found`);
    process.exit(1);
  }

  // CSV 読み込み
  console.log("Loading CSV files...");
  const terms = parseTermsCsv(TERMS_CSV);
  const phrases = parsePhrasesCsv(PHRASES_CSV);
  console.log(`  terms.csv: ${terms.length} entries`);
  console.log(`  phrases.csv: ${phrases.length} entries\n`);

  // terminology.json 生成
  console.log("Generating terminology.json...");
  const terminology = generateTerminology(terms, phrases);
  console.log(`  Generated ${terminology.rules.length} rules\n`);

  // ファイル書き込み
  const jsonContent = JSON.stringify(terminology, null, 2);
  fs.writeFileSync(TERMINOLOGY_JSON, `${jsonContent}\n`, "utf-8");
  console.log(`Written to: ${TERMINOLOGY_JSON}\n`);

  // サマリー
  const termRules = terminology.rules.filter((r) => r.source === "terms");
  const phraseRules = terminology.rules.filter((r) => r.source === "phrases");
  console.log("=== Summary ===");
  console.log(`  From terms.csv: ${termRules.length} rules`);
  console.log(`  From phrases.csv: ${phraseRules.length} rules`);
  console.log(`  Total: ${terminology.rules.length} rules`);
}

main();
