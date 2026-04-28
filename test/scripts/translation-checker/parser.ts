// translations.ts ファイルをパースして翻訳エントリを抽出するモジュール
import * as fs from "node:fs";
import * as ts from "typescript";
import type { ParsedTranslations, TranslationEntry } from "./types";

interface LocaleEntries {
  [key: string]: {
    text: string;
    line: number;
    column: number;
  };
}

/**
 * ソースファイルから位置情報（行・列）を取得
 */
function getLineAndColumn(sourceFile: ts.SourceFile, pos: number): { line: number; column: number } {
  const { line, character } = sourceFile.getLineAndCharacterOfPosition(pos);
  return { line: line + 1, column: character + 1 };
}

/**
 * AsExpression や SatisfiesExpression をアンラップして内部の式を取得
 * 例: { ... } as const → { ... }
 * 例: { ... } satisfies Type → { ... }
 * 例: { ... } as const satisfies Type → { ... }
 */
function unwrapExpression(node: ts.Expression): ts.ObjectLiteralExpression | undefined {
  if (ts.isObjectLiteralExpression(node)) {
    return node;
  }
  if (ts.isAsExpression(node)) {
    return unwrapExpression(node.expression);
  }
  if (ts.isSatisfiesExpression(node)) {
    return unwrapExpression(node.expression);
  }
  if (ts.isParenthesizedExpression(node)) {
    return unwrapExpression(node.expression);
  }
  return undefined;
}

/**
 * オブジェクトリテラルからキーと値のマップを抽出
 */
function extractObjectEntries(obj: ts.ObjectLiteralExpression, sourceFile: ts.SourceFile): LocaleEntries {
  const entries: LocaleEntries = {};

  for (const prop of obj.properties) {
    if (ts.isPropertyAssignment(prop)) {
      let key: string | undefined;

      // キー名を取得
      if (ts.isIdentifier(prop.name)) {
        key = prop.name.text;
      } else if (ts.isStringLiteral(prop.name)) {
        key = prop.name.text;
      }

      // 値を取得（文字列リテラルのみ）
      if (key && ts.isStringLiteral(prop.initializer)) {
        const { line, column } = getLineAndColumn(sourceFile, prop.initializer.getStart());
        entries[key] = {
          text: prop.initializer.text,
          line,
          column,
        };
      }
    }
  }

  return entries;
}

/**
 * translations オブジェクトから "en-US" と "ja-JP" を抽出
 */
function extractTranslationsObject(
  obj: ts.ObjectLiteralExpression,
  sourceFile: ts.SourceFile,
): { enUS: LocaleEntries; jaJP: LocaleEntries } {
  const result: { enUS: LocaleEntries; jaJP: LocaleEntries } = {
    enUS: {},
    jaJP: {},
  };

  for (const prop of obj.properties) {
    if (ts.isPropertyAssignment(prop)) {
      let localeName: string | undefined;

      if (ts.isStringLiteral(prop.name)) {
        localeName = prop.name.text;
      }

      if (localeName && ts.isObjectLiteralExpression(prop.initializer)) {
        const entries = extractObjectEntries(prop.initializer, sourceFile);

        if (localeName === "en-US") {
          result.enUS = entries;
        } else if (localeName === "ja-JP") {
          result.jaJP = entries;
        }
      }
    }
  }

  return result;
}

/**
 * translations.ts ファイルをパースして翻訳エントリを抽出
 */
export function parseTranslationsFile(filePath: string): ParsedTranslations {
  const sourceCode = fs.readFileSync(filePath, "utf-8");
  const sourceFile = ts.createSourceFile(filePath, sourceCode, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

  const entries: TranslationEntry[] = [];
  let enUS: LocaleEntries = {};
  let jaJP: LocaleEntries = {};

  function visit(node: ts.Node): void {
    // export const translations = { ... } を探す
    // as const, satisfies, または両方の組み合わせにも対応
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (ts.isIdentifier(decl.name) && decl.name.text === "translations" && decl.initializer) {
          const objLiteral = unwrapExpression(decl.initializer);
          if (objLiteral) {
            const extracted = extractTranslationsObject(objLiteral, sourceFile);
            enUS = extracted.enUS;
            jaJP = extracted.jaJP;
          }
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  // en-US と ja-JP を key でマッチさせてエントリを作成
  const allKeys = new Set([...Object.keys(enUS), ...Object.keys(jaJP)]);

  for (const key of allKeys) {
    const enEntry = enUS[key];
    const jaEntry = jaJP[key];

    if (enEntry && jaEntry) {
      entries.push({
        key,
        enText: enEntry.text,
        jaText: jaEntry.text,
        line: enEntry.line,
        column: enEntry.column,
      });
    }
  }

  return {
    filePath,
    entries,
  };
}

/**
 * 正規表現で使う特殊文字をエスケープ
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * 翻訳ファイルに修正を適用
 * @param filePath 翻訳ファイルのパス
 * @param fixes 適用する修正リスト
 * @returns 修正された違反のリスト（key と incorrectText のペア）
 */
export function applyFixes(
  filePath: string,
  fixes: Array<{ key: string; incorrectText: string; correctText: string }>,
): Array<{ key: string; incorrectText: string }> {
  let content = fs.readFileSync(filePath, "utf-8");
  const fixedItems: Array<{ key: string; incorrectText: string }> = [];

  for (const fix of fixes) {
    // en-US セクション内で、指定されたキーの値を修正
    // キー名とテキストの両方をエスケープして正規表現に使用
    const escapedKey = escapeRegex(fix.key);
    const escapedIncorrect = escapeRegex(fix.incorrectText);

    // "en-US" セクション内の該当キーの値を探して置換
    // パターン: "en-US": { ... key: "...incorrectText..." ... }
    // クォート付きキー（例: "key-with-dash"）とクォートなしキーの両方に対応
    // (?:[^"\\]|\\.)* はエスケープされた文字（\"など）を正しく処理する
    const pattern = new RegExp(`("en-US"[\\s\\S]*?"?${escapedKey}"?:\\s*")((?:[^"\\\\]|\\\\.)*)(")`);

    const match = content.match(pattern);
    if (match) {
      const originalValue = match[2];
      // incorrectText が値に含まれているか確認（大文字小文字を区別しない）
      if (!originalValue.toLowerCase().includes(fix.incorrectText.toLowerCase())) {
        continue;
      }
      // 大文字小文字を保持しながら置換
      // 置換文字列内の $ をエスケープ（$$ はリテラル $ を表す）
      const escapedCorrectText = fix.correctText.replace(/\$/g, "$$$$");
      const newValue = originalValue.replace(new RegExp(escapedIncorrect, "gi"), escapedCorrectText);
      // 2回目の replace でも $ をエスケープする必要がある
      const escapedNewValue = newValue.replace(/\$/g, "$$$$");
      content = content.replace(pattern, `$1${escapedNewValue}$3`);
      fixedItems.push({ key: fix.key, incorrectText: fix.incorrectText });
    }
  }

  if (fixedItems.length > 0) {
    fs.writeFileSync(filePath, content, "utf-8");
  }

  return fixedItems;
}
