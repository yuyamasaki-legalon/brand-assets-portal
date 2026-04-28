// 型定義ファイル

export interface Rule {
  id: string;
  description: string;
  inappropriateExample: string;
  correctExample: string;
  category: string;
  notes: string;
  component: string;
  language: string;
}

export interface Violation {
  ruleId: string;
  description: string;
  position: { start: number; end: number };
  incorrectText: string;
  suggestion: string;
  severity: "error" | "warning" | "info";
  category: string;
}

// テキストのコンテキスト情報（親コンポーネントなど）
export interface TextContext {
  componentName?: string; // e.g., "Snackbar"
  propName?: string; // e.g., "message"
}

export type ValidatorFunction = (text: string, context?: TextContext) => Violation[];

// TSX ファイルから抽出したテキスト情報
export interface ExtractedText {
  text: string;
  line: number;
  column: number;
  start: number;
  end: number;
  context?: TextContext;
}

// ファイルごとの違反情報
export interface FileViolation {
  filePath: string;
  text: ExtractedText;
  violation: Violation;
}
