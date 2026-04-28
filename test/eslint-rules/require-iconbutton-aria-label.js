/**
 * β版: IconButton に aria-label または aria-labelledby がない場合に警告する。
 * アイコンのみのボタンはテキストラベルがないため、スクリーンリーダー向けの代替テキストが必須。
 *
 * @see docs/anti-patterns/AP-ICONBUTTON-002.md
 */
import { ESLintUtils } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator(() => "");

const isIdentifierName = (nameNode) => {
  if (!nameNode) return "";
  if (nameNode.type === "JSXIdentifier") return nameNode.name;
  if (nameNode.type === "JSXMemberExpression") {
    return nameNode.property.type === "JSXIdentifier" ? nameNode.property.name : "";
  }
  return "";
};

const hasAriaLabel = (openingElement) =>
  openingElement.attributes.some(
    (attr) =>
      attr.type === "JSXAttribute" &&
      attr.name.type === "JSXIdentifier" &&
      (attr.name.name === "aria-label" || attr.name.name === "aria-labelledby"),
  );

export default createRule({
  name: "require-iconbutton-aria-label",
  meta: {
    type: "problem",
    docs: {
      description: "IconButton に aria-label または aria-labelledby を必須にする",
      recommended: "error",
    },
    messages: {
      missingAriaLabel:
        "IconButton に aria-label または aria-labelledby が必要です。スクリーンリーダーがボタンの目的を伝えるために必須です。",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXOpeningElement(node) {
        const name = isIdentifierName(node.name);
        if (name !== "IconButton") return;

        if (!hasAriaLabel(node)) {
          context.report({ node, messageId: "missingAriaLabel" });
        }
      },
    };
  },
});
