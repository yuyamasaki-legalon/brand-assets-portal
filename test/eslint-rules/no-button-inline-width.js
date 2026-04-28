import { ESLintUtils } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator(() => "");

const isWidthKey = (key) => {
  if (!key) return false;
  if (key.type === "Identifier") return key.name === "width";
  if (key.type === "Literal") return key.value === "width";
  return false;
};

const hasWidthInStyle = (expression) => {
  if (expression.type !== "ObjectExpression") return false;
  return expression.properties.some(
    (property) => property.type === "Property" && isWidthKey(property.key),
  );
};

export default createRule({
  name: "no-button-inline-width",
  meta: {
    type: "problem",
    docs: {
      description: "Button に style.width を書くのを禁止し、width prop の使用を促す",
      recommended: "error",
    },
    messages: {
      width: "Button の横幅は style ではなく width prop で指定してください。",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.type !== "JSXIdentifier" || node.name.name !== "Button") return;

        for (const attr of node.attributes) {
          if (attr.type !== "JSXAttribute" || attr.name.type !== "JSXIdentifier") continue;
          if (attr.name.name !== "style" || !attr.value || attr.value.type !== "JSXExpressionContainer") continue;

          const expr = attr.value.expression;
          if (hasWidthInStyle(expr)) {
            context.report({ node: attr, messageId: "width" });
          }
        }
      },
    };
  },
});
