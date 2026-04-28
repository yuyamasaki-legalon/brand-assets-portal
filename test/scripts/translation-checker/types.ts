// Translation Checker 型定義

export type Severity = "error" | "warning" | "info";

export interface TerminologyRule {
  id: string;
  ja: string;
  correct: string;
  incorrect?: string[]; // 自動修正用: 誤訳パターン（定義されている場合のみ自動修正可能）
  context?: string;
  severity: Severity;
  source?: "terms" | "phrases";
}

export interface TerminologyGlossary {
  rules: TerminologyRule[];
}

export interface TranslationViolation {
  ruleId: string;
  messageKey: string;
  expectedText: string;
  actualText: string;
  severity: Severity;
  description: string;
  // 自動修正用フィールド（incorrect が定義されている場合のみ設定）
  autoFix?: boolean;
  incorrectText?: string; // マッチした誤訳パターン
}

export interface TranslationEntry {
  key: string;
  jaText: string;
  enText: string;
  line: number;
  column: number;
}

export interface ParsedTranslations {
  filePath: string;
  entries: TranslationEntry[];
}

export interface FileViolation {
  filePath: string;
  entry: TranslationEntry;
  violation: TranslationViolation;
}

export interface Fix {
  key: string;
  incorrectText: string;
  correctText: string;
  line: number;
}

export interface CheckResult {
  totalFiles: number;
  totalViolations: number;
  fileViolations: FileViolation[];
  fixedCount: number;
}
