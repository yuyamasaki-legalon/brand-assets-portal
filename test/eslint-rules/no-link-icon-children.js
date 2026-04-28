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

const hasAttr = (openingElement, attrName) =>
  openingElement.attributes.some(
    (attr) => attr.type === "JSXAttribute" && attr.name.type === "JSXIdentifier" && attr.name.name === attrName,
  );

const hasIconChild = (children) =>
  children.some((child) => {
    if (child.type === "JSXElement") {
      const name = isIdentifierName(child.openingElement.name);
      return name === "Icon" || name.startsWith("Lf");
    }
    if (child.type === "JSXSelfClosingElement") {
      const name = isIdentifierName(child.name);
      return name === "Icon" || name.startsWith("Lf");
    }
    return false;
  });

export default createRule({
  name: "no-link-icon-children",
  meta: {
    type: "problem",
    docs: {
      description: "Link に Icon を子として入れる場合は trailing/leading を使わせる（style/className は対象外）",
      recommended: "error",
    },
    messages: {
      useTrailing: "Link に Icon を子で入れず trailing/leading を使ってください。",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXElement(node) {
        const opening = node.openingElement;
        const name = isIdentifierName(opening.name);
        if (name !== "Link") return;

        // Icon 子要素は trailing/leading を使う
        const hasTrailing = hasAttr(opening, "trailing");
        const hasLeading = hasAttr(opening, "leading");
        if (!hasTrailing && !hasLeading && hasIconChild(node.children)) {
          context.report({ node: opening, messageId: "useTrailing" });
        }
      },
    };
  },
});
