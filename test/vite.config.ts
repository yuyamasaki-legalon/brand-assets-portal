import { promises as fs } from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";
import { createRequire } from "node:module";
import path from "node:path";
import react from "@vitejs/plugin-react";
import ts from "typescript";
import { defineConfig, type Plugin } from "vite";

interface EditableVariantTarget {
  id: string;
  componentName: string;
  currentVariant: string;
  supportsVariant: boolean;
  labelHint: string | null;
  order: number;
  openLine: number;
  openColumn: number;
  textValue: string | null;
  gapValue: string | null;
  marginValue: string | null;
  paddingValue: string | null;
  editableProps: EditablePropEntry[];
  currentIconName: string | null;
  line: number;
  column: number;
  literalStart: number;
  literalEnd: number;
  mode: "replace" | "replace-expression" | "insert" | "text-only";
  quote: '"' | "'";
}

interface EditablePropEntry {
  path: string;
  label: string;
  value: string;
  valueType: "string" | "number" | "boolean" | "expression";
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === "object";
};

const require = createRequire(import.meta.url);

const readInstalledPackageVersion = async (packageName: string): Promise<string> => {
  const packageJsonPath = require.resolve(`${packageName}/package.json`);
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf8")) as unknown;

  if (!isRecord(packageJson) || typeof packageJson.version !== "string") {
    throw new Error(`Could not read ${packageName} version.`);
  }

  return packageJson.version;
};

const readJsonBody = async (req: IncomingMessage): Promise<unknown> => {
  const chunks: Uint8Array[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  const body = Buffer.concat(chunks).toString("utf8");
  if (body.length === 0) return {};
  return JSON.parse(body) as unknown;
};

const sendJson = (res: ServerResponse, statusCode: number, payload: unknown) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
};

const appendPlugin = (plugins: Plugin[], plugin: Plugin | Plugin[]) => {
  if (Array.isArray(plugin)) {
    plugins.push(...plugin);
    return;
  }

  plugins.push(plugin);
};

const createLiveVariantEditorPlugin = (): Plugin => {
  const workspaceRoot = process.cwd();
  const editableRoot = path.resolve(workspaceRoot, "src");

  // --- Undo/Redo stacks per file ---
  const undoStacks = new Map<string, string[]>();
  const redoStacks = new Map<string, string[]>();
  const MAX_UNDO = 50;

  const pushUndo = (absolutePath: string, sourceCode: string) => {
    if (!undoStacks.has(absolutePath)) undoStacks.set(absolutePath, []);
    const stack = undoStacks.get(absolutePath)!;
    stack.push(sourceCode);
    if (stack.length > MAX_UNDO) stack.shift();
    redoStacks.set(absolutePath, []);
  };

  const resolveEditablePath = (filePath: string): string => {
    if (!filePath.startsWith("src/")) {
      throw new Error("Only src/ files are editable.");
    }

    if (!filePath.endsWith(".tsx")) {
      throw new Error("Only .tsx files are editable.");
    }

    const absolute = path.resolve(workspaceRoot, filePath);
    if (!absolute.startsWith(`${editableRoot}${path.sep}`)) {
      throw new Error("Invalid file path.");
    }

    return absolute;
  };

  const parseEditableVariantTargets = (sourceCode: string): EditableVariantTarget[] => {
    const sourceFile = ts.createSourceFile("editor.tsx", sourceCode, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const targets: EditableVariantTarget[] = [];
    let orderCounter = 0;

    const normalizeText = (text: string) => text.replace(/\s+/g, " ").trim();

    const readAttributeString = (node: ts.JsxOpeningLikeElement, attributeName: string): string | null => {
      const attribute = node.attributes.properties.find((prop) => {
        return ts.isJsxAttribute(prop) && ts.isIdentifier(prop.name) && prop.name.text === attributeName;
      });

      if (!attribute || !ts.isJsxAttribute(attribute) || !attribute.initializer) {
        return null;
      }

      if (ts.isStringLiteral(attribute.initializer)) {
        return attribute.initializer.text;
      }

      if (
        ts.isJsxExpression(attribute.initializer) &&
        attribute.initializer.expression &&
        ts.isStringLiteralLike(attribute.initializer.expression)
      ) {
        return attribute.initializer.expression.text;
      }

      return null;
    };

    const extractLabelHint = (node: ts.JsxOpeningLikeElement): string | null => {
      const ariaLabel = readAttributeString(node, "aria-label");
      if (ariaLabel) {
        const normalized = normalizeText(ariaLabel);
        return normalized.length > 0 ? normalized.slice(0, 80) : null;
      }

      const title = readAttributeString(node, "title");
      if (title) {
        const normalized = normalizeText(title);
        return normalized.length > 0 ? normalized.slice(0, 80) : null;
      }

      if (ts.isJsxOpeningElement(node) && ts.isJsxElement(node.parent)) {
        for (const child of node.parent.children) {
          if (ts.isJsxText(child)) {
            const normalized = normalizeText(child.getText(sourceFile));
            if (normalized.length > 0) {
              return normalized.slice(0, 80);
            }
          }

          if (ts.isJsxExpression(child) && child.expression && ts.isStringLiteralLike(child.expression)) {
            const normalized = normalizeText(child.expression.text);
            if (normalized.length > 0) {
              return normalized.slice(0, 80);
            }
          }
        }
      }

      return null;
    };

    const classifyExpression = (
      expression: ts.Expression,
    ): { value: string; valueType: "string" | "number" | "boolean" | "expression" } => {
      if (ts.isStringLiteralLike(expression)) {
        return { value: expression.text, valueType: "string" };
      }
      if (ts.isNumericLiteral(expression)) {
        return { value: expression.text, valueType: "number" };
      }
      if (expression.kind === ts.SyntaxKind.TrueKeyword) {
        return { value: "true", valueType: "boolean" };
      }
      if (expression.kind === ts.SyntaxKind.FalseKeyword) {
        return { value: "false", valueType: "boolean" };
      }
      return { value: expression.getText(sourceFile), valueType: "expression" };
    };

    const extractEditableProps = (node: ts.JsxOpeningLikeElement): EditablePropEntry[] => {
      const props: EditablePropEntry[] = [];

      for (const prop of node.attributes.properties) {
        if (!ts.isJsxAttribute(prop)) continue;
        if (!ts.isIdentifier(prop.name)) continue;

        const propName = prop.name.text;
        if (propName === "style") {
          if (
            prop.initializer &&
            ts.isJsxExpression(prop.initializer) &&
            prop.initializer.expression &&
            ts.isObjectLiteralExpression(prop.initializer.expression)
          ) {
            for (const styleProp of prop.initializer.expression.properties) {
              if (!ts.isPropertyAssignment(styleProp)) continue;
              const styleName = ts.isIdentifier(styleProp.name)
                ? styleProp.name.text
                : ts.isStringLiteralLike(styleProp.name)
                  ? styleProp.name.text
                  : null;
              if (!styleName) continue;
              const classified = classifyExpression(styleProp.initializer);
              props.push({
                path: `style:${styleName}`,
                label: `style.${styleName}`,
                value: classified.value,
                valueType: classified.valueType,
              });
            }
          }
          continue;
        }

        if (!prop.initializer) {
          props.push({
            path: `prop:${propName}`,
            label: propName,
            value: "true",
            valueType: "boolean",
          });
          continue;
        }

        if (ts.isStringLiteral(prop.initializer)) {
          props.push({
            path: `prop:${propName}`,
            label: propName,
            value: prop.initializer.text,
            valueType: "string",
          });
          continue;
        }

        if (ts.isJsxExpression(prop.initializer) && prop.initializer.expression) {
          const classified = classifyExpression(prop.initializer.expression);
          props.push({
            path: `prop:${propName}`,
            label: propName,
            value: classified.value,
            valueType: classified.valueType,
          });
        }
      }

      return props;
    };

    const findFirstIconTag = (root: ts.Node): ts.JsxSelfClosingElement | ts.JsxOpeningElement | null => {
      let found: ts.JsxSelfClosingElement | ts.JsxOpeningElement | null = null;
      const visitNode = (current: ts.Node) => {
        if (found) return;
        if (ts.isJsxSelfClosingElement(current) || ts.isJsxOpeningElement(current)) {
          const tagName = current.tagName.getText(sourceFile);
          if (/^Lf[A-Z][A-Za-z0-9]*$/.test(tagName)) {
            found = current;
            return;
          }
        }
        ts.forEachChild(current, visitNode);
      };
      visitNode(root);
      return found;
    };

    const extractCurrentIconName = (node: ts.JsxOpeningLikeElement): string | null => {
      if (!ts.isJsxOpeningElement(node) || !ts.isJsxElement(node.parent)) {
        return null;
      }
      const iconTag = findFirstIconTag(node.parent);
      if (!iconTag) return null;
      return iconTag.tagName.getText(sourceFile);
    };

    const readAttributeInitializerText = (initializer: ts.JsxAttributeValue): string | null => {
      if (ts.isStringLiteral(initializer)) {
        return initializer.text;
      }
      if (ts.isJsxExpression(initializer) && initializer.expression && ts.isStringLiteralLike(initializer.expression)) {
        return initializer.expression.text;
      }
      return null;
    };

    const readAttributeValue = (node: ts.JsxOpeningLikeElement, attributeName: string): string | null => {
      const attribute = node.attributes.properties.find((prop) => {
        return ts.isJsxAttribute(prop) && ts.isIdentifier(prop.name) && prop.name.text === attributeName;
      });
      if (!attribute || !ts.isJsxAttribute(attribute) || !attribute.initializer) return null;
      return readAttributeInitializerText(attribute.initializer);
    };

    const readStyleObjectValue = (node: ts.JsxOpeningLikeElement, propName: "gap" | "margin" | "padding"): string | null => {
      const styleAttr = node.attributes.properties.find((prop) => {
        return ts.isJsxAttribute(prop) && ts.isIdentifier(prop.name) && prop.name.text === "style";
      });
      if (!styleAttr || !ts.isJsxAttribute(styleAttr) || !styleAttr.initializer) return null;
      if (!ts.isJsxExpression(styleAttr.initializer) || !styleAttr.initializer.expression) return null;
      if (!ts.isObjectLiteralExpression(styleAttr.initializer.expression)) return null;

      const styleObject = styleAttr.initializer.expression;
      const property = styleObject.properties.find((propertyNode) => {
        if (!ts.isPropertyAssignment(propertyNode)) return false;
        if (ts.isIdentifier(propertyNode.name)) return propertyNode.name.text === propName;
        if (ts.isStringLiteralLike(propertyNode.name)) return propertyNode.name.text === propName;
        return false;
      });
      if (!property || !ts.isPropertyAssignment(property)) return null;

      if (ts.isStringLiteralLike(property.initializer)) {
        return property.initializer.text;
      }
      return null;
    };

    const extractTextValue = (node: ts.JsxOpeningLikeElement): string | null => {
      if (!ts.isJsxOpeningElement(node) || !ts.isJsxElement(node.parent)) return null;

      for (const child of node.parent.children) {
        if (ts.isJsxText(child)) {
          const normalized = normalizeText(child.getText(sourceFile));
          if (normalized.length > 0) return normalized.slice(0, 200);
        }
        if (ts.isJsxExpression(child) && child.expression && ts.isStringLiteralLike(child.expression)) {
          const normalized = normalizeText(child.expression.text);
          if (normalized.length > 0) return normalized.slice(0, 200);
        }
      }

      return null;
    };

    const readGapValue = (node: ts.JsxOpeningLikeElement) => {
      return readAttributeValue(node, "gap") ?? readStyleObjectValue(node, "gap");
    };

    const readMarginValue = (node: ts.JsxOpeningLikeElement) => {
      return readAttributeValue(node, "margin") ?? readStyleObjectValue(node, "margin");
    };

    const readPaddingValue = (node: ts.JsxOpeningLikeElement) => {
      return readAttributeValue(node, "padding") ?? readStyleObjectValue(node, "padding");
    };

    const pushReplaceTarget = (
      node: ts.JsxOpeningLikeElement,
      variantAttr: ts.JsxAttribute,
      variantLiteral: ts.StringLiteral,
    ) => {
      const literalStart = variantLiteral.getStart(sourceFile);
      const literalEnd = variantLiteral.getEnd();
      const quoteChar = sourceCode[literalStart];

      if (quoteChar !== "'" && quoteChar !== '"') {
        return;
      }

      const componentName = node.tagName.getText(sourceFile);
      const location = sourceFile.getLineAndCharacterOfPosition(variantAttr.getStart(sourceFile));
      const openLocation = sourceFile.getLineAndCharacterOfPosition(node.tagName.getStart(sourceFile));

      targets.push({
        id: `${literalStart}:${literalEnd}:${componentName}`,
        componentName,
        currentVariant: variantLiteral.text,
        supportsVariant: true,
        labelHint: extractLabelHint(node),
        order: orderCounter++,
        openLine: openLocation.line + 1,
        openColumn: openLocation.character + 1,
        textValue: extractTextValue(node),
        gapValue: readGapValue(node),
        marginValue: readMarginValue(node),
        paddingValue: readPaddingValue(node),
        editableProps: extractEditableProps(node),
        currentIconName: extractCurrentIconName(node),
        line: location.line + 1,
        column: location.character + 1,
        literalStart,
        literalEnd,
        mode: "replace",
        quote: quoteChar,
      });
    };

    const inferVariantFromExpression = (exprText: string): string => {
      const matched = exprText.match(/["']([A-Za-z][A-Za-z0-9._-]*)["']/);
      if (matched?.[1]) {
        return matched[1];
      }
      return "solid";
    };

    const pushExpressionReplaceTarget = (
      node: ts.JsxOpeningLikeElement,
      variantAttr: ts.JsxAttribute,
      expressionInitializer: ts.JsxExpression,
    ) => {
      const componentName = node.tagName.getText(sourceFile);
      const location = sourceFile.getLineAndCharacterOfPosition(variantAttr.getStart(sourceFile));
      const openLocation = sourceFile.getLineAndCharacterOfPosition(node.tagName.getStart(sourceFile));
      const exprStart = expressionInitializer.getStart(sourceFile);
      const exprEnd = expressionInitializer.getEnd();
      const exprText = expressionInitializer.getText(sourceFile);

      // Expression-based variants (e.g. variant={cond ? "solid" : "subtle"}) must not be
      // overwritten with a static string. Expose as text-only so text/spacing/props remain editable.
      targets.push({
        id: `${exprStart}:${exprEnd}:${componentName}:expr`,
        componentName,
        currentVariant: inferVariantFromExpression(exprText),
        supportsVariant: false,
        labelHint: extractLabelHint(node),
        order: orderCounter++,
        openLine: openLocation.line + 1,
        openColumn: openLocation.character + 1,
        textValue: extractTextValue(node),
        gapValue: readGapValue(node),
        marginValue: readMarginValue(node),
        paddingValue: readPaddingValue(node),
        editableProps: extractEditableProps(node),
        currentIconName: extractCurrentIconName(node),
        line: location.line + 1,
        column: location.character + 1,
        literalStart: exprStart,
        literalEnd: exprEnd,
        mode: "text-only",
        quote: '"',
      });
    };

    const pushInsertTarget = (node: ts.JsxOpeningLikeElement, componentName: string) => {
      if (componentName !== "Button" && componentName !== "IconButton") {
        return;
      }

      const insertPos = node.tagName.getEnd();
      const location = sourceFile.getLineAndCharacterOfPosition(node.tagName.getStart(sourceFile));
      targets.push({
        id: `insert:${insertPos}:${componentName}:${orderCounter}`,
        componentName,
        currentVariant: "solid",
        supportsVariant: true,
        labelHint: extractLabelHint(node),
        order: orderCounter++,
        openLine: location.line + 1,
        openColumn: location.character + 1,
        textValue: extractTextValue(node),
        gapValue: readGapValue(node),
        marginValue: readMarginValue(node),
        paddingValue: readPaddingValue(node),
        editableProps: extractEditableProps(node),
        currentIconName: extractCurrentIconName(node),
        line: location.line + 1,
        column: location.character + 1,
        literalStart: insertPos,
        literalEnd: insertPos,
        mode: "insert",
        quote: '"',
      });
    };

    const pushTextOnlyTarget = (node: ts.JsxOpeningLikeElement, componentName: string) => {
      const textValue = extractTextValue(node);
      const gapValue = readGapValue(node);
      const marginValue = readMarginValue(node);
      const paddingValue = readPaddingValue(node);

      if (!textValue && !gapValue && !marginValue && !paddingValue) {
        return;
      }

      const location = sourceFile.getLineAndCharacterOfPosition(node.tagName.getStart(sourceFile));
      targets.push({
        id: `text-only:${componentName}:${orderCounter}`,
        componentName,
        currentVariant: "",
        supportsVariant: false,
        labelHint: extractLabelHint(node),
        order: orderCounter++,
        openLine: location.line + 1,
        openColumn: location.character + 1,
        textValue,
        gapValue,
        marginValue,
        paddingValue,
        editableProps: extractEditableProps(node),
        currentIconName: extractCurrentIconName(node),
        line: location.line + 1,
        column: location.character + 1,
        literalStart: node.tagName.getEnd(),
        literalEnd: node.tagName.getEnd(),
        mode: "text-only",
        quote: '"',
      });
    };

    const visit = (node: ts.Node) => {
      if (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) {
        const componentName = node.tagName.getText(sourceFile);
        const variantProp = node.attributes.properties.find((prop) => {
          return ts.isJsxAttribute(prop) && ts.isIdentifier(prop.name) && prop.name.text === "variant";
        });

        if (variantProp && ts.isJsxAttribute(variantProp) && variantProp.initializer) {
          if (ts.isStringLiteral(variantProp.initializer)) {
            pushReplaceTarget(node, variantProp, variantProp.initializer);
          } else if (ts.isJsxExpression(variantProp.initializer)) {
            pushExpressionReplaceTarget(node, variantProp, variantProp.initializer);
          }
        } else {
          const before = targets.length;
          pushInsertTarget(node, componentName);
          if (targets.length === before) {
            pushTextOnlyTarget(node, componentName);
          }
        }
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);

    return targets;
  };

  const toPublicTargets = (targets: EditableVariantTarget[]) => {
    return targets.map((target) => ({
      id: target.id,
      componentName: target.componentName,
      currentVariant: target.currentVariant,
      supportsVariant: target.supportsVariant,
      labelHint: target.labelHint,
      order: target.order,
      openLine: target.openLine,
      openColumn: target.openColumn,
      textValue: target.textValue,
      gapValue: target.gapValue,
      marginValue: target.marginValue,
      paddingValue: target.paddingValue,
      editableProps: target.editableProps,
      currentIconName: target.currentIconName,
      line: target.line,
      column: target.column,
    }));
  };

  const extractImportedIconNames = (sourceFile: ts.SourceFile): string[] => {
    const icons = new Set<string>();

    for (const statement of sourceFile.statements) {
      if (!ts.isImportDeclaration(statement)) continue;
      if (!ts.isStringLiteral(statement.moduleSpecifier)) continue;
      if (statement.moduleSpecifier.text !== "@legalforce/aegis-icons") continue;
      const clause = statement.importClause;
      if (!clause?.namedBindings || !ts.isNamedImports(clause.namedBindings)) continue;

      for (const element of clause.namedBindings.elements) {
        const imported = element.name.text;
        if (/^Lf[A-Z][A-Za-z0-9]*$/.test(imported)) {
          icons.add(imported);
        }
      }
    }

    return Array.from(icons).sort();
  };

  const escapeVariantLiteral = (value: string, quote: '"' | "'") => {
    return value.replaceAll("\\", "\\\\").replaceAll(quote, `\\${quote}`);
  };

  const findTargetByFallback = (
    targets: EditableVariantTarget[],
    componentName: string | null,
    openLine: number | null,
    openColumn: number | null,
  ) => {
    if (componentName === null || openLine === null || openColumn === null) return null;
    return (
      targets.find(
        (candidate) =>
          candidate.componentName === componentName &&
          candidate.openLine === openLine &&
          candidate.openColumn === openColumn,
      ) ?? null
    );
  };

  const findNodeByOpenPosition = (
    sourceFile: ts.SourceFile,
    componentName: string,
    openLine: number,
    openColumn: number,
  ): ts.JsxOpeningLikeElement | null => {
    let found: ts.JsxOpeningLikeElement | null = null;
    const visit = (node: ts.Node) => {
      if (found) return;
      if (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) {
        const name = node.tagName.getText(sourceFile);
        const location = sourceFile.getLineAndCharacterOfPosition(node.tagName.getStart(sourceFile));
        if (name === componentName && location.line + 1 === openLine && location.character + 1 === openColumn) {
          found = node;
          return;
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sourceFile);
    return found;
  };

  const updateJsxText = (
    sourceCode: string,
    sourceFile: ts.SourceFile,
    node: ts.JsxOpeningLikeElement,
    nextText: string,
  ): string | null => {
    if (!ts.isJsxOpeningElement(node) || !ts.isJsxElement(node.parent)) return null;
    for (const child of node.parent.children) {
      if (ts.isJsxText(child)) {
        const current = child.getText(sourceFile);
        if (current.trim().length === 0) continue;
        const prefixMatch = current.match(/^\s*/);
        const suffixMatch = current.match(/\s*$/);
        const prefix = prefixMatch ? prefixMatch[0] : "";
        const suffix = suffixMatch ? suffixMatch[0] : "";
        const start = child.getStart(sourceFile);
        const end = child.getEnd();
        return sourceCode.slice(0, start) + `${prefix}${nextText}${suffix}` + sourceCode.slice(end);
      }
      if (ts.isJsxExpression(child) && child.expression && ts.isStringLiteralLike(child.expression)) {
        const start = child.expression.getStart(sourceFile);
        const end = child.expression.getEnd();
        return sourceCode.slice(0, start) + `"${nextText.replaceAll('"', '\\"')}"` + sourceCode.slice(end);
      }
    }
    return null;
  };

  const removeNodeRange = (sourceCode: string, sourceFile: ts.SourceFile, node: ts.Node): string => {
    let start = node.getStart(sourceFile);
    const end = node.getEnd();
    // Also consume leading whitespace / comma so the result is clean
    while (start > 0 && (sourceCode[start - 1] === " " || sourceCode[start - 1] === ",")) {
      start--;
    }
    // If the character after `end` is a comma, consume it too
    let endAdj = end;
    if (sourceCode[endAdj] === ",") {
      endAdj++;
      // consume trailing space after comma
      while (endAdj < sourceCode.length && sourceCode[endAdj] === " ") {
        endAdj++;
      }
    }
    return sourceCode.slice(0, start) + sourceCode.slice(endAdj);
  };

  const updateSpacing = (
    sourceCode: string,
    sourceFile: ts.SourceFile,
    node: ts.JsxOpeningLikeElement,
    kind: "gap" | "margin" | "padding",
    nextValue: string,
  ): string => {
    const isEmpty = nextValue === "";

    // --- 1. Check for legacy direct attribute (e.g. gap="...") and migrate to style ---
    const directAttr = node.attributes.properties.find((prop) => {
      return ts.isJsxAttribute(prop) && ts.isIdentifier(prop.name) && prop.name.text === kind;
    });
    if (directAttr && ts.isJsxAttribute(directAttr)) {
      let removeStart = directAttr.getStart(sourceFile);
      const removeEnd = directAttr.getEnd();
      while (removeStart > 0 && sourceCode[removeStart - 1] === " ") {
        removeStart--;
      }
      const withoutDirectAttr = sourceCode.slice(0, removeStart) + sourceCode.slice(removeEnd);
      if (isEmpty) {
        return withoutDirectAttr;
      }
      // Re-parse after removal and recurse to add via style.
      const tagLocation = sourceFile.getLineAndCharacterOfPosition(node.tagName.getStart(sourceFile));
      const updatedSourceFile = ts.createSourceFile("editor.tsx", withoutDirectAttr, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
      const updatedNode = findNodeByOpenPosition(
        updatedSourceFile,
        node.tagName.getText(sourceFile),
        tagLocation.line + 1,
        tagLocation.character + 1,
      );
      if (updatedNode) {
        return updateSpacing(withoutDirectAttr, updatedSourceFile, updatedNode, kind, nextValue);
      }
      return withoutDirectAttr;
    }

    // --- Helper: check if a style object literal already has display: flex/grid ---
    const hasFlexOrGrid = (styleObject: ts.ObjectLiteralExpression): boolean => {
      return styleObject.properties.some((propertyNode) => {
        if (!ts.isPropertyAssignment(propertyNode)) return false;
        const nameMatch = ts.isIdentifier(propertyNode.name) && propertyNode.name.text === "display";
        if (!nameMatch) return false;
        if (ts.isStringLiteralLike(propertyNode.initializer)) {
          const val = propertyNode.initializer.text;
          return val === "flex" || val === "grid" || val === "inline-flex" || val === "inline-grid";
        }
        return false;
      });
    };

    const gapFlexPrefix = (styleHasFlex: boolean): string => {
      if (kind !== "gap" || styleHasFlex) return "";
      return `display: "flex", flexDirection: "column", `;
    };

    // --- 2. style is an object literal (e.g. style={{ ... }}) ---
    const styleAttr = node.attributes.properties.find((prop) => {
      return ts.isJsxAttribute(prop) && ts.isIdentifier(prop.name) && prop.name.text === "style";
    });
    if (
      styleAttr &&
      ts.isJsxAttribute(styleAttr) &&
      styleAttr.initializer &&
      ts.isJsxExpression(styleAttr.initializer) &&
      styleAttr.initializer.expression &&
      ts.isObjectLiteralExpression(styleAttr.initializer.expression)
    ) {
      const styleObject = styleAttr.initializer.expression;
      const styleProp = styleObject.properties.find((propertyNode) => {
        if (!ts.isPropertyAssignment(propertyNode)) return false;
        if (ts.isIdentifier(propertyNode.name)) return propertyNode.name.text === kind;
        if (ts.isStringLiteralLike(propertyNode.name)) return propertyNode.name.text === kind;
        return false;
      });

      if (styleProp && ts.isPropertyAssignment(styleProp)) {
        if (isEmpty) {
          return removeNodeRange(sourceCode, sourceFile, styleProp);
        }
        const start = styleProp.initializer.getStart(sourceFile);
        const end = styleProp.initializer.getEnd();
        return sourceCode.slice(0, start) + `"${nextValue}"` + sourceCode.slice(end);
      }

      if (isEmpty) {
        return sourceCode;
      }

      const insertPos = styleObject.getEnd() - 1;
      const prefix = styleObject.properties.length > 0 ? ", " : "";
      const flexProps = gapFlexPrefix(hasFlexOrGrid(styleObject));
      return sourceCode.slice(0, insertPos) + `${prefix}${flexProps}${kind}: "${nextValue}"` + sourceCode.slice(insertPos);
    }

    // --- 3. style is a computed reference (e.g. style={styles.foo}) ---
    if (
      styleAttr &&
      ts.isJsxAttribute(styleAttr) &&
      styleAttr.initializer &&
      ts.isJsxExpression(styleAttr.initializer) &&
      styleAttr.initializer.expression
    ) {
      if (isEmpty) {
        return sourceCode;
      }
      const exprStart = styleAttr.initializer.expression.getStart(sourceFile);
      const exprEnd = styleAttr.initializer.expression.getEnd();
      const exprText = sourceCode.slice(exprStart, exprEnd);
      const flexProps = kind === "gap" ? `display: "flex", flexDirection: "column", ` : "";
      return (
        sourceCode.slice(0, exprStart) +
        `{ ${flexProps}...${exprText}, ${kind}: "${nextValue}" }` +
        sourceCode.slice(exprEnd)
      );
    }

    // --- 4. No style prop exists — create one ---
    if (isEmpty) {
      return sourceCode;
    }

    const flexProps = kind === "gap" ? `display: "flex", flexDirection: "column", ` : "";
    const insertPos = node.tagName.getEnd();
    return sourceCode.slice(0, insertPos) + ` style={{ ${flexProps}${kind}: "${nextValue}" }}` + sourceCode.slice(insertPos);
  };

  const parseInputValue = (raw: string): { renderedAttributeValue: string; renderedStyleValue: string } => {
    const trimmed = raw.trim();
    if (trimmed === "true" || trimmed === "false") {
      return {
        renderedAttributeValue: `{${trimmed}}`,
        renderedStyleValue: trimmed,
      };
    }
    if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
      return {
        renderedAttributeValue: `{${trimmed}}`,
        renderedStyleValue: trimmed,
      };
    }

    const escaped = trimmed.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
    return {
      renderedAttributeValue: `"${escaped}"`,
      renderedStyleValue: `"${escaped}"`,
    };
  };

  const updatePropByPath = (
    sourceCode: string,
    sourceFile: ts.SourceFile,
    node: ts.JsxOpeningLikeElement,
    propPath: string,
    nextValue: string,
  ): string => {
    const parsed = parseInputValue(nextValue);

    if (propPath.startsWith("style:")) {
      const styleKey = propPath.slice("style:".length);
      const styleAttr = node.attributes.properties.find((prop) => {
        return ts.isJsxAttribute(prop) && ts.isIdentifier(prop.name) && prop.name.text === "style";
      });

      if (
        styleAttr &&
        ts.isJsxAttribute(styleAttr) &&
        styleAttr.initializer &&
        ts.isJsxExpression(styleAttr.initializer) &&
        styleAttr.initializer.expression &&
        ts.isObjectLiteralExpression(styleAttr.initializer.expression)
      ) {
        const styleObject = styleAttr.initializer.expression;
        const styleProp = styleObject.properties.find((propertyNode) => {
          if (!ts.isPropertyAssignment(propertyNode)) return false;
          if (ts.isIdentifier(propertyNode.name)) return propertyNode.name.text === styleKey;
          if (ts.isStringLiteralLike(propertyNode.name)) return propertyNode.name.text === styleKey;
          return false;
        });

        if (styleProp && ts.isPropertyAssignment(styleProp)) {
          const start = styleProp.initializer.getStart(sourceFile);
          const end = styleProp.initializer.getEnd();
          return sourceCode.slice(0, start) + parsed.renderedStyleValue + sourceCode.slice(end);
        }

        const insertPos = styleObject.getEnd() - 1;
        const prefix = styleObject.properties.length > 0 ? ", " : "";
        return sourceCode.slice(0, insertPos) + `${prefix}${styleKey}: ${parsed.renderedStyleValue}` + sourceCode.slice(insertPos);
      }

      const insertPos = node.tagName.getEnd();
      return (
        sourceCode.slice(0, insertPos) +
        ` style={{ ${styleKey}: ${parsed.renderedStyleValue} }}` +
        sourceCode.slice(insertPos)
      );
    }

    if (!propPath.startsWith("prop:")) {
      return sourceCode;
    }
    const propName = propPath.slice("prop:".length);

    const attr = node.attributes.properties.find((prop) => {
      return ts.isJsxAttribute(prop) && ts.isIdentifier(prop.name) && prop.name.text === propName;
    });

    if (attr && ts.isJsxAttribute(attr)) {
      if (attr.initializer) {
        const start = attr.initializer.getStart(sourceFile);
        const end = attr.initializer.getEnd();
        return sourceCode.slice(0, start) + parsed.renderedAttributeValue + sourceCode.slice(end);
      }
      const insertPos = attr.getEnd();
      return sourceCode.slice(0, insertPos) + `=${parsed.renderedAttributeValue}` + sourceCode.slice(insertPos);
    }

    const insertPos = node.tagName.getEnd();
    return sourceCode.slice(0, insertPos) + ` ${propName}=${parsed.renderedAttributeValue}` + sourceCode.slice(insertPos);
  };

  const updateIconNameInNode = (
    sourceCode: string,
    sourceFile: ts.SourceFile,
    node: ts.JsxOpeningLikeElement,
    nextIconName: string,
  ): string | null => {
    if (!ts.isJsxOpeningElement(node) || !ts.isJsxElement(node.parent)) {
      return null;
    }

    let foundSelfClosing: ts.JsxSelfClosingElement | null = null;
    let foundOpening: ts.JsxOpeningElement | null = null;

    const visit = (current: ts.Node) => {
      if (foundSelfClosing || foundOpening) return;
      if (ts.isJsxSelfClosingElement(current)) {
        const tag = current.tagName.getText(sourceFile);
        if (/^Lf[A-Z][A-Za-z0-9]*$/.test(tag)) {
          foundSelfClosing = current;
          return;
        }
      }
      if (ts.isJsxOpeningElement(current)) {
        const tag = current.tagName.getText(sourceFile);
        if (/^Lf[A-Z][A-Za-z0-9]*$/.test(tag)) {
          foundOpening = current;
          return;
        }
      }
      ts.forEachChild(current, visit);
    };
    visit(node.parent);

    if (foundSelfClosing !== null) {
      const iconNode = foundSelfClosing as ts.JsxSelfClosingElement;
      const start = iconNode.tagName.getStart(sourceFile);
      const end = iconNode.tagName.getEnd();
      return sourceCode.slice(0, start) + nextIconName + sourceCode.slice(end);
    }

    if (foundOpening !== null) {
      const iconNode = foundOpening as ts.JsxOpeningElement;
      const element = iconNode.parent;
      if (!ts.isJsxElement(element)) {
        return null;
      }
      const openStart = element.openingElement.tagName.getStart(sourceFile);
      const openEnd = element.openingElement.tagName.getEnd();
      const closeStart = element.closingElement.tagName.getStart(sourceFile);
      const closeEnd = element.closingElement.tagName.getEnd();

      let updated = sourceCode;
      updated = updated.slice(0, closeStart) + nextIconName + updated.slice(closeEnd);
      updated = updated.slice(0, openStart) + nextIconName + updated.slice(openEnd);
      return updated;
    }

    return null;
  };

  return {
    name: "aegis-live-variant-editor",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const requestPath = req.url?.split("?")[0] ?? "";

        if (req.method === "POST" && requestPath.startsWith("/__aegis-lab/editor/")) {
          const remoteAddress = req.socket.remoteAddress ?? "";
          const isLoopback = remoteAddress === "127.0.0.1" || remoteAddress === "::1" || remoteAddress === "::ffff:127.0.0.1";
          if (!isLoopback) {
            sendJson(res, 403, { ok: false, error: "Editor API is only available from localhost." });
            return;
          }
        }

        if (req.method === "POST" && requestPath === "/__aegis-lab/editor/analyze") {
          try {
            const body = await readJsonBody(req);
            if (!isRecord(body) || typeof body.filePath !== "string") {
              sendJson(res, 400, { ok: false, error: "Invalid request body." });
              return;
            }

            const filePath = body.filePath;
            const absolutePath = resolveEditablePath(filePath);
            const sourceCode = await fs.readFile(absolutePath, "utf8");
            const sourceFile = ts.createSourceFile("editor.tsx", sourceCode, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
            const targets = parseEditableVariantTargets(sourceCode);

            sendJson(res, 200, {
              ok: true,
              editableVariants: toPublicTargets(targets),
              availableIcons: extractImportedIconNames(sourceFile),
            });
            return;
          } catch (error) {
            sendJson(res, 400, {
              ok: false,
              error: error instanceof Error ? error.message : "Failed to analyze file.",
            });
            return;
          }
        }

        if (req.method === "POST" && requestPath === "/__aegis-lab/editor/update-variant") {
          try {
            const body = await readJsonBody(req);
            if (
              !isRecord(body) ||
              typeof body.filePath !== "string" ||
              typeof body.targetId !== "string" ||
              typeof body.nextVariant !== "string"
            ) {
              sendJson(res, 400, { ok: false, error: "Invalid request body." });
              return;
            }

            const filePath = body.filePath;
            const targetId = body.targetId;
            const nextVariant = body.nextVariant;
            const fallbackComponentName = typeof body.fallbackComponentName === "string" ? body.fallbackComponentName : null;
            const fallbackLine = typeof body.fallbackLine === "number" ? body.fallbackLine : null;
            const fallbackColumn = typeof body.fallbackColumn === "number" ? body.fallbackColumn : null;
            if (!/^[A-Za-z][A-Za-z0-9._-]*$/.test(nextVariant)) {
              sendJson(res, 400, { ok: false, error: "nextVariant must be a valid identifier-like string." });
              return;
            }

            const absolutePath = resolveEditablePath(filePath);
            const sourceCode = await fs.readFile(absolutePath, "utf8");
            const sourceFile = ts.createSourceFile("editor.tsx", sourceCode, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
            const targets = parseEditableVariantTargets(sourceCode);
            const targetById = targets.find((candidate) => candidate.id === targetId);
            const targetByFallback = findTargetByFallback(
              targets,
              fallbackComponentName,
              fallbackLine,
              fallbackColumn,
            );
            const target = targetById ?? targetByFallback;

            if (!target) {
              sendJson(res, 409, { ok: false, error: "Target not found. Please reload targets and retry." });
              return;
            }

            if (!target.supportsVariant) {
              sendJson(res, 409, { ok: false, error: "This target does not support variant editing." });
              return;
            }

            if (target.currentVariant === nextVariant) {
              sendJson(res, 200, {
                ok: true,
                editableVariants: toPublicTargets(targets),
                availableIcons: extractImportedIconNames(sourceFile),
              });
              return;
            }

            const variantLiteral = `${target.quote}${escapeVariantLiteral(nextVariant, target.quote)}${target.quote}`;
            const updatedSource =
              target.mode === "insert"
                ? sourceCode.slice(0, target.literalStart) +
                  ` variant=${variantLiteral}` +
                  sourceCode.slice(target.literalStart)
                : target.mode === "replace-expression"
                  ? sourceCode.slice(0, target.literalStart) + `=${variantLiteral}` + sourceCode.slice(target.literalEnd)
                  : sourceCode.slice(0, target.literalStart) + variantLiteral + sourceCode.slice(target.literalEnd);

            pushUndo(absolutePath, sourceCode);
            await fs.writeFile(absolutePath, updatedSource, "utf8");

            const updatedSourceFile = ts.createSourceFile(
              "editor.tsx",
              updatedSource,
              ts.ScriptTarget.Latest,
              true,
              ts.ScriptKind.TSX,
            );
            const refreshedTargets = parseEditableVariantTargets(updatedSource);
            sendJson(res, 200, {
              ok: true,
              editableVariants: toPublicTargets(refreshedTargets),
              availableIcons: extractImportedIconNames(updatedSourceFile),
            });
            return;
          } catch (error) {
            sendJson(res, 400, {
              ok: false,
              error: error instanceof Error ? error.message : "Failed to update variant.",
            });
            return;
          }
        }

        if (req.method === "POST" && requestPath === "/__aegis-lab/editor/update-text") {
          try {
            const body = await readJsonBody(req);
            if (
              !isRecord(body) ||
              typeof body.filePath !== "string" ||
              typeof body.targetId !== "string" ||
              typeof body.nextText !== "string"
            ) {
              sendJson(res, 400, { ok: false, error: "Invalid request body." });
              return;
            }

            const filePath = body.filePath;
            const targetId = body.targetId;
            const nextText = body.nextText.trim();
            const fallbackComponentName = typeof body.fallbackComponentName === "string" ? body.fallbackComponentName : null;
            const fallbackOpenLine = typeof body.fallbackOpenLine === "number" ? body.fallbackOpenLine : null;
            const fallbackOpenColumn = typeof body.fallbackOpenColumn === "number" ? body.fallbackOpenColumn : null;

            const absolutePath = resolveEditablePath(filePath);
            const sourceCode = await fs.readFile(absolutePath, "utf8");
            const targets = parseEditableVariantTargets(sourceCode);
            const targetById = targets.find((candidate) => candidate.id === targetId);
            const targetByFallback = findTargetByFallback(
              targets,
              fallbackComponentName,
              fallbackOpenLine,
              fallbackOpenColumn,
            );
            const target = targetById ?? targetByFallback;
            if (!target) {
              sendJson(res, 409, { ok: false, error: "Target not found. Please reload targets and retry." });
              return;
            }

            const sourceFile = ts.createSourceFile("editor.tsx", sourceCode, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
            const node = findNodeByOpenPosition(sourceFile, target.componentName, target.openLine, target.openColumn);
            if (!node) {
              sendJson(res, 409, { ok: false, error: "Target JSX node not found." });
              return;
            }

            const updatedSource = updateJsxText(sourceCode, sourceFile, node, nextText);
            if (!updatedSource) {
              sendJson(res, 409, { ok: false, error: "Editable text was not found for this target." });
              return;
            }

            pushUndo(absolutePath, sourceCode);
            await fs.writeFile(absolutePath, updatedSource, "utf8");
            const updatedSourceFile = ts.createSourceFile(
              "editor.tsx",
              updatedSource,
              ts.ScriptTarget.Latest,
              true,
              ts.ScriptKind.TSX,
            );
            const refreshedTargets = parseEditableVariantTargets(updatedSource);
            sendJson(res, 200, {
              ok: true,
              editableVariants: toPublicTargets(refreshedTargets),
              availableIcons: extractImportedIconNames(updatedSourceFile),
            });
            return;
          } catch (error) {
            sendJson(res, 400, {
              ok: false,
              error: error instanceof Error ? error.message : "Failed to update text.",
            });
            return;
          }
        }

        if (req.method === "POST" && requestPath === "/__aegis-lab/editor/update-spacing") {
          try {
            const body = await readJsonBody(req);
            if (
              !isRecord(body) ||
              typeof body.filePath !== "string" ||
              typeof body.targetId !== "string" ||
              typeof body.kind !== "string" ||
              typeof body.nextValue !== "string"
            ) {
              sendJson(res, 400, { ok: false, error: "Invalid request body." });
              return;
            }

            if (body.kind !== "gap" && body.kind !== "margin" && body.kind !== "padding") {
              sendJson(res, 400, { ok: false, error: "kind must be gap, margin, or padding." });
              return;
            }

            const filePath = body.filePath;
            const targetId = body.targetId;
            const kind = body.kind as "gap" | "margin" | "padding";
            const nextValue = body.nextValue.trim();
            const fallbackComponentName = typeof body.fallbackComponentName === "string" ? body.fallbackComponentName : null;
            const fallbackOpenLine = typeof body.fallbackOpenLine === "number" ? body.fallbackOpenLine : null;
            const fallbackOpenColumn = typeof body.fallbackOpenColumn === "number" ? body.fallbackOpenColumn : null;

            const absolutePath = resolveEditablePath(filePath);
            const sourceCode = await fs.readFile(absolutePath, "utf8");
            const targets = parseEditableVariantTargets(sourceCode);
            const targetById = targets.find((candidate) => candidate.id === targetId);
            const targetByFallback = findTargetByFallback(
              targets,
              fallbackComponentName,
              fallbackOpenLine,
              fallbackOpenColumn,
            );
            const target = targetById ?? targetByFallback;
            if (!target) {
              sendJson(res, 409, { ok: false, error: "Target not found. Please reload targets and retry." });
              return;
            }

            const sourceFile = ts.createSourceFile("editor.tsx", sourceCode, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
            const node = findNodeByOpenPosition(sourceFile, target.componentName, target.openLine, target.openColumn);
            if (!node) {
              sendJson(res, 409, { ok: false, error: "Target JSX node not found." });
              return;
            }

            const updatedSource = updateSpacing(sourceCode, sourceFile, node, kind, nextValue);
            pushUndo(absolutePath, sourceCode);
            await fs.writeFile(absolutePath, updatedSource, "utf8");
            const updatedSourceFile = ts.createSourceFile(
              "editor.tsx",
              updatedSource,
              ts.ScriptTarget.Latest,
              true,
              ts.ScriptKind.TSX,
            );
            const refreshedTargets = parseEditableVariantTargets(updatedSource);
            sendJson(res, 200, {
              ok: true,
              editableVariants: toPublicTargets(refreshedTargets),
              availableIcons: extractImportedIconNames(updatedSourceFile),
            });
            return;
          } catch (error) {
            sendJson(res, 400, {
              ok: false,
              error: error instanceof Error ? error.message : "Failed to update spacing.",
            });
            return;
          }
        }

        if (req.method === "POST" && requestPath === "/__aegis-lab/editor/update-prop") {
          try {
            const body = await readJsonBody(req);
            if (
              !isRecord(body) ||
              typeof body.filePath !== "string" ||
              typeof body.targetId !== "string" ||
              typeof body.propPath !== "string" ||
              typeof body.nextValue !== "string"
            ) {
              sendJson(res, 400, { ok: false, error: "Invalid request body." });
              return;
            }

            const filePath = body.filePath;
            const targetId = body.targetId;
            const propPath = body.propPath;
            const nextValue = body.nextValue;
            const fallbackComponentName = typeof body.fallbackComponentName === "string" ? body.fallbackComponentName : null;
            const fallbackOpenLine = typeof body.fallbackOpenLine === "number" ? body.fallbackOpenLine : null;
            const fallbackOpenColumn = typeof body.fallbackOpenColumn === "number" ? body.fallbackOpenColumn : null;

            const absolutePath = resolveEditablePath(filePath);
            const sourceCode = await fs.readFile(absolutePath, "utf8");
            const targets = parseEditableVariantTargets(sourceCode);
            const targetById = targets.find((candidate) => candidate.id === targetId);
            const targetByFallback = findTargetByFallback(
              targets,
              fallbackComponentName,
              fallbackOpenLine,
              fallbackOpenColumn,
            );
            const target = targetById ?? targetByFallback;
            if (!target) {
              sendJson(res, 409, { ok: false, error: "Target not found. Please reload targets and retry." });
              return;
            }

            const sourceFile = ts.createSourceFile("editor.tsx", sourceCode, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
            const node = findNodeByOpenPosition(sourceFile, target.componentName, target.openLine, target.openColumn);
            if (!node) {
              sendJson(res, 409, { ok: false, error: "Target JSX node not found." });
              return;
            }

            const updatedSource = updatePropByPath(sourceCode, sourceFile, node, propPath, nextValue);
            pushUndo(absolutePath, sourceCode);
            await fs.writeFile(absolutePath, updatedSource, "utf8");
            const updatedSourceFile = ts.createSourceFile(
              "editor.tsx",
              updatedSource,
              ts.ScriptTarget.Latest,
              true,
              ts.ScriptKind.TSX,
            );
            const refreshedTargets = parseEditableVariantTargets(updatedSource);
            sendJson(res, 200, {
              ok: true,
              editableVariants: toPublicTargets(refreshedTargets),
              availableIcons: extractImportedIconNames(updatedSourceFile),
            });
            return;
          } catch (error) {
            sendJson(res, 400, {
              ok: false,
              error: error instanceof Error ? error.message : "Failed to update prop.",
            });
            return;
          }
        }

        if (req.method === "POST" && requestPath === "/__aegis-lab/editor/update-icon") {
          try {
            const body = await readJsonBody(req);
            if (
              !isRecord(body) ||
              typeof body.filePath !== "string" ||
              typeof body.targetId !== "string" ||
              typeof body.nextIconName !== "string"
            ) {
              sendJson(res, 400, { ok: false, error: "Invalid request body." });
              return;
            }

            const filePath = body.filePath;
            const targetId = body.targetId;
            const nextIconName = body.nextIconName.trim();
            const fallbackComponentName = typeof body.fallbackComponentName === "string" ? body.fallbackComponentName : null;
            const fallbackOpenLine = typeof body.fallbackOpenLine === "number" ? body.fallbackOpenLine : null;
            const fallbackOpenColumn = typeof body.fallbackOpenColumn === "number" ? body.fallbackOpenColumn : null;

            if (!/^Lf[A-Z][A-Za-z0-9]*$/.test(nextIconName)) {
              sendJson(res, 400, { ok: false, error: "nextIconName must be a valid Aegis icon identifier." });
              return;
            }

            const absolutePath = resolveEditablePath(filePath);
            const sourceCode = await fs.readFile(absolutePath, "utf8");
            const sourceFile = ts.createSourceFile("editor.tsx", sourceCode, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
            const availableIcons = extractImportedIconNames(sourceFile);
            if (!availableIcons.includes(nextIconName)) {
              sendJson(res, 400, { ok: false, error: `${nextIconName} is not imported in this file.` });
              return;
            }

            const targets = parseEditableVariantTargets(sourceCode);
            const targetById = targets.find((candidate) => candidate.id === targetId);
            const targetByFallback = findTargetByFallback(
              targets,
              fallbackComponentName,
              fallbackOpenLine,
              fallbackOpenColumn,
            );
            const target = targetById ?? targetByFallback;
            if (!target) {
              sendJson(res, 409, { ok: false, error: "Target not found. Please reload targets and retry." });
              return;
            }

            const node = findNodeByOpenPosition(sourceFile, target.componentName, target.openLine, target.openColumn);
            if (!node) {
              sendJson(res, 409, { ok: false, error: "Target JSX node not found." });
              return;
            }

            const updatedSource = updateIconNameInNode(sourceCode, sourceFile, node, nextIconName);
            if (!updatedSource) {
              sendJson(res, 409, { ok: false, error: "No editable icon node was found for this target." });
              return;
            }

            pushUndo(absolutePath, sourceCode);
            await fs.writeFile(absolutePath, updatedSource, "utf8");
            const updatedSourceFile = ts.createSourceFile(
              "editor.tsx",
              updatedSource,
              ts.ScriptTarget.Latest,
              true,
              ts.ScriptKind.TSX,
            );
            const refreshedTargets = parseEditableVariantTargets(updatedSource);
            sendJson(res, 200, {
              ok: true,
              editableVariants: toPublicTargets(refreshedTargets),
              availableIcons: extractImportedIconNames(updatedSourceFile),
            });
            return;
          } catch (error) {
            sendJson(res, 400, {
              ok: false,
              error: error instanceof Error ? error.message : "Failed to update icon.",
            });
            return;
          }
        }

        // --- Undo ---
        if (req.method === "POST" && requestPath === "/__aegis-lab/editor/undo") {
          try {
            const body = await readJsonBody(req);
            if (!isRecord(body) || typeof body.filePath !== "string") {
              sendJson(res, 400, { ok: false, error: "Invalid request body." });
              return;
            }
            const absolutePath = resolveEditablePath(body.filePath);
            const stack = undoStacks.get(absolutePath);
            if (!stack || stack.length === 0) {
              sendJson(res, 400, { ok: false, error: "Nothing to undo." });
              return;
            }
            const currentSource = await fs.readFile(absolutePath, "utf8");
            if (!redoStacks.has(absolutePath)) redoStacks.set(absolutePath, []);
            redoStacks.get(absolutePath)!.push(currentSource);
            const previousSource = stack.pop()!;
            await fs.writeFile(absolutePath, previousSource, "utf8");
            const refreshedTargets = parseEditableVariantTargets(previousSource);
            const updatedSourceFile = ts.createSourceFile("editor.tsx", previousSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
            sendJson(res, 200, {
              ok: true,
              editableVariants: toPublicTargets(refreshedTargets),
              availableIcons: extractImportedIconNames(updatedSourceFile),
            });
            return;
          } catch (error) {
            sendJson(res, 400, { ok: false, error: error instanceof Error ? error.message : "Failed to undo." });
            return;
          }
        }

        // --- Redo ---
        if (req.method === "POST" && requestPath === "/__aegis-lab/editor/redo") {
          try {
            const body = await readJsonBody(req);
            if (!isRecord(body) || typeof body.filePath !== "string") {
              sendJson(res, 400, { ok: false, error: "Invalid request body." });
              return;
            }
            const absolutePath = resolveEditablePath(body.filePath);
            const stack = redoStacks.get(absolutePath);
            if (!stack || stack.length === 0) {
              sendJson(res, 400, { ok: false, error: "Nothing to redo." });
              return;
            }
            const currentSource = await fs.readFile(absolutePath, "utf8");
            if (!undoStacks.has(absolutePath)) undoStacks.set(absolutePath, []);
            undoStacks.get(absolutePath)!.push(currentSource);
            const nextSource = stack.pop()!;
            await fs.writeFile(absolutePath, nextSource, "utf8");
            const refreshedTargets = parseEditableVariantTargets(nextSource);
            const updatedSourceFile = ts.createSourceFile("editor.tsx", nextSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
            sendJson(res, 200, {
              ok: true,
              editableVariants: toPublicTargets(refreshedTargets),
              availableIcons: extractImportedIconNames(updatedSourceFile),
            });
            return;
          } catch (error) {
            sendJson(res, 400, { ok: false, error: error instanceof Error ? error.message : "Failed to redo." });
            return;
          }
        }

        next();
      });
    },
  };
};

// https://vite.dev/config/
export default defineConfig(async ({ command }) => {
  const plugins: Plugin[] = [];
  appendPlugin(plugins, react());
  const aegisReactVersion = await readInstalledPackageVersion("@legalforce/aegis-react");
  const localCommentDebugEnabled = ["1", "true", "yes", "on"].includes(
    (process.env.AEGIS_LOCAL_COMMENT_DEBUG ?? "").toLowerCase(),
  );

  if (command === "serve") {
    appendPlugin(plugins, createLiveVariantEditorPlugin());
  }

  // Tauri 環境でなければ Cloudflare プラグインを読み込む
  if (!process.env.TAURI_ENV_PLATFORM) {
    const { cloudflare } = await import("@cloudflare/vite-plugin");
    const cloudflarePlugin = cloudflare({
      configPath: "./wrangler.jsonc",
    });
    appendPlugin(plugins, cloudflarePlugin);
  }

  return {
    base: "/",
    plugins,
    clearScreen: false,
    define: {
      __AEGIS_REACT_VERSION__: JSON.stringify(aegisReactVersion),
      __AEGIS_LOCAL_COMMENT_DEBUG__: JSON.stringify(localCommentDebugEnabled),
      "globalThis.__AEGIS_LOCAL_COMMENT_DEBUG__": JSON.stringify(localCommentDebugEnabled),
    },
    server: {
      host: process.env.TAURI_DEV_HOST || false,
      port: 5173,
      strictPort: !!process.env.TAURI_ENV_PLATFORM,
      watch: {
        ignored: ["**/src-tauri/**"],
      },
    },
  };
});
