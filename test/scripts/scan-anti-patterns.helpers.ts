import { relative } from "node:path";

export interface Finding {
  file: string;
  line: number;
  rule: string;
  severity: "error" | "warning" | "info";
  message: string;
  code: string;
}

const addFinding = (
  findings: Finding[],
  rootDir: string,
  file: string,
  line: number,
  rule: string,
  severity: Finding["severity"],
  message: string,
  code: string,
): void => {
  findings.push({ file: relative(rootDir, file), line, rule, severity, message, code: code.trim() });
};

export function scanAntiPatterns(content: string, filePath: string, rootDir: string): Finding[] {
  const findings: Finding[] = [];
  const lines = content.split("\n");

  const pxPattern = /style\s*=\s*\{\{[^}]*\b(\d+)px\b/;
  const spanPattern = /<span[\s>]/;
  const divClickPattern = /<div\s[^>]*onClick/;
  const inputComponents = /\b(TextField|Select|Textarea|Combobox|TagInput|TagPicker|DateField)\b/;
  const rawElements = /<(button|input|select|textarea|table)[\s>]/i;
  const colorPattern = /(?:color|backgroundColor|background|borderColor)\s*:\s*["']?(#[0-9a-fA-F]{3,8}|rgb\(|rgba\()/;
  const hasFormControl = content.includes("FormControl");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNo = i + 1;
    const trimmed = line.trim();

    if (pxPattern.test(line)) {
      addFinding(
        findings,
        rootDir,
        filePath,
        lineNo,
        "AP-TOKEN-001",
        "warning",
        "インラインスタイルに生の px 値が使用されています",
        line,
      );
    }

    if (spanPattern.test(line)) {
      addFinding(
        findings,
        rootDir,
        filePath,
        lineNo,
        "AP-SPAN-001",
        "warning",
        "生の <span> タグが使用されています。<Text> の使用を検討してください",
        line,
      );
    }

    if (divClickPattern.test(line)) {
      const hasRole = /role\s*=\s*["']button["']/.test(line);
      const hasTabIndex = /tabIndex/.test(line);
      const hasKeyDown = /onKeyDown/.test(line);

      if (!hasRole || !hasTabIndex || !hasKeyDown) {
        addFinding(
          findings,
          rootDir,
          filePath,
          lineNo,
          "AP-KEYBOARD-001",
          "error",
          '<div onClick> にキーボード対応（role="button" + tabIndex + onKeyDown）がありません',
          line,
        );
      }
    }

    if (!hasFormControl) {
      const match = line.match(inputComponents);
      if (match && /<\s*/.test(line) && !line.includes("aria-label")) {
        addFinding(
          findings,
          rootDir,
          filePath,
          lineNo,
          "AP-FORMCONTROL-001",
          "warning",
          `${match[1]} が FormControl 外で使用されている可能性があります`,
          line,
        );
      }
    }

    const rawElementMatch = line.match(rawElements);
    if (rawElementMatch) {
      if (!trimmed.startsWith("//") && !trimmed.startsWith("*") && !trimmed.startsWith("<!--")) {
        const element = rawElementMatch[1].toLowerCase();
        const aegisAlternative: Record<string, string> = {
          button: "Button / IconButton",
          input: "TextField / Checkbox / Radio",
          select: "Select / Combobox",
          textarea: "Textarea",
          table: "Table / DataTable",
        };

        addFinding(
          findings,
          rootDir,
          filePath,
          lineNo,
          "AP-CUSTOM-UI-001",
          "warning",
          `生の <${element}> が使用されています。Aegis の ${aegisAlternative[element]} を検討してください`,
          line,
        );
      }
    }

    if (colorPattern.test(line) && !trimmed.startsWith("//") && !trimmed.startsWith("*")) {
      addFinding(
        findings,
        rootDir,
        filePath,
        lineNo,
        "AP-COLOR-001",
        "warning",
        "ハードコードされた色が使用されています。Aegis カラートークンを検討してください",
        line,
      );
    }
  }

  return findings;
}
