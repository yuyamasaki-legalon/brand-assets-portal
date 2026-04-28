// TSX ファイルから日本語テキストを抽出するモジュール
import * as ts from "typescript";
import type { ExtractedText, TextContext } from "./types";

// 日本語文字を含むかチェックする正規表現
const JAPANESE_REGEX = /[\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\uFF00-\uFFEF]/;

/**
 * テキストに日本語が含まれているかチェック
 */
function containsJapanese(text: string): boolean {
  return JAPANESE_REGEX.test(text);
}

/**
 * ソースファイルから位置情報（行・列）を取得
 */
function getLineAndColumn(sourceFile: ts.SourceFile, pos: number): { line: number; column: number } {
  const { line, character } = sourceFile.getLineAndCharacterOfPosition(pos);
  return { line: line + 1, column: character + 1 };
}

/**
 * JSX 要素名を取得
 */
function getJsxElementName(node: ts.JsxOpeningElement | ts.JsxSelfClosingElement): string | undefined {
  const tagName = node.tagName;
  if (ts.isIdentifier(tagName)) {
    return tagName.text;
  }
  if (ts.isPropertyAccessExpression(tagName)) {
    // e.g., Snackbar.Action -> Snackbar.Action
    return tagName.getText();
  }
  return undefined;
}

/**
 * CallExpression から呼び出し元の名前を取得
 * 例: Snackbar.show() -> "Snackbar"
 *     toast() -> "toast"
 */
function getCallExpressionName(callExpr: ts.CallExpression): string | undefined {
  const expression = callExpr.expression;

  // Snackbar.show() のような PropertyAccessExpression パターン
  if (ts.isPropertyAccessExpression(expression)) {
    const obj = expression.expression;
    if (ts.isIdentifier(obj)) {
      return obj.text;
    }
  }

  // toast() のような直接呼び出しパターン
  if (ts.isIdentifier(expression)) {
    return expression.text;
  }

  return undefined;
}

/**
 * ノードの親を辿ってコンテキスト情報を取得
 */
function getTextContext(node: ts.Node): TextContext | undefined {
  let current: ts.Node | undefined = node.parent;
  let propName: string | undefined;

  while (current) {
    // <Component prop="text" /> のパターン
    if (ts.isJsxAttribute(current)) {
      const jsxPropName = current.name.getText();
      const parent = current.parent?.parent;

      if (parent && (ts.isJsxOpeningElement(parent) || ts.isJsxSelfClosingElement(parent))) {
        const componentName = getJsxElementName(parent);
        return { componentName, propName: jsxPropName };
      }
    }

    // <Component>text</Component> のパターン
    if (ts.isJsxElement(current)) {
      const componentName = getJsxElementName(current.openingElement);
      return { componentName };
    }

    // <Component /> 内の JsxExpression のパターン
    if (ts.isJsxExpression(current)) {
      const parent = current.parent;
      if (parent && ts.isJsxElement(parent)) {
        const componentName = getJsxElementName(parent.openingElement);
        return { componentName };
      }
    }

    // { message: "text" } のような PropertyAssignment パターン
    // propName を記録しておく
    if (ts.isPropertyAssignment(current)) {
      const name = current.name;
      if (ts.isIdentifier(name)) {
        propName = name.text;
      }
    }

    // Snackbar.show({ message: "text" }) のような CallExpression パターン
    if (ts.isCallExpression(current)) {
      const componentName = getCallExpressionName(current);
      if (componentName) {
        return { componentName, propName };
      }
    }

    current = current.parent;
  }

  return undefined;
}

/**
 * TSX ファイルから日本語テキストを抽出
 */
export function extractJapaneseTexts(sourceCode: string, filePath: string): ExtractedText[] {
  const extractedTexts: ExtractedText[] = [];

  const sourceFile = ts.createSourceFile(filePath, sourceCode, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

  function visit(node: ts.Node): void {
    // 文字列リテラル ("..." または '...')
    if (ts.isStringLiteral(node)) {
      const text = node.text;
      if (containsJapanese(text)) {
        const { line, column } = getLineAndColumn(sourceFile, node.getStart());
        const context = getTextContext(node);
        extractedTexts.push({
          text,
          line,
          column,
          start: node.getStart(),
          end: node.getEnd(),
          context,
        });
      }
    }

    // テンプレートリテラル (`...`)
    if (ts.isNoSubstitutionTemplateLiteral(node)) {
      const text = node.text;
      if (containsJapanese(text)) {
        const { line, column } = getLineAndColumn(sourceFile, node.getStart());
        const context = getTextContext(node);
        extractedTexts.push({
          text,
          line,
          column,
          start: node.getStart(),
          end: node.getEnd(),
          context,
        });
      }
    }

    // テンプレートリテラル（式を含む）の各部分
    if (ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) {
      const text = node.text;
      if (containsJapanese(text)) {
        const { line, column } = getLineAndColumn(sourceFile, node.getStart());
        const context = getTextContext(node);
        extractedTexts.push({
          text,
          line,
          column,
          start: node.getStart(),
          end: node.getEnd(),
          context,
        });
      }
    }

    // JSX テキスト (<div>こんにちは</div> の「こんにちは」部分)
    if (ts.isJsxText(node)) {
      const text = node.text.trim();
      if (text && containsJapanese(text)) {
        const { line, column } = getLineAndColumn(sourceFile, node.getStart());
        const context = getTextContext(node);
        extractedTexts.push({
          text,
          line,
          column,
          start: node.getStart(),
          end: node.getEnd(),
          context,
        });
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return extractedTexts;
}
