/**
 * β版: DialogContent に DialogHeader が含まれていない場合に警告する。
 * 支援技術がダイアログの目的を判断するためにタイトルが必要。
 *
 * @see docs/anti-patterns/AP-DIALOG-001.md
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

const hasDialogHeader = (children) =>
  children.some(
    (child) =>
      child.type === "JSXElement" && isIdentifierName(child.openingElement.name) === "DialogHeader",
  );

export default createRule({
  name: "no-dialog-without-header",
  meta: {
    type: "problem",
    docs: {
      description: "DialogContent に DialogHeader を含めることを強制する",
      recommended: "error",
    },
    messages: {
      missingHeader:
        "DialogContent には DialogHeader が必要です。支援技術がダイアログの目的を判断するためのタイトルを提供してください。",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXElement(node) {
        const name = isIdentifierName(node.openingElement.name);
        if (name !== "DialogContent") return;

        if (!hasDialogHeader(node.children)) {
          context.report({ node: node.openingElement, messageId: "missingHeader" });
        }
      },
    };
  },
});
