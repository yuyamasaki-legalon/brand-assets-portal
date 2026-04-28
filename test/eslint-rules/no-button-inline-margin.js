import { ESLintUtils } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator(() => "");

const MARGIN_KEYS = new Set([
  "margin",
  "marginTop",
  "marginBottom",
  "marginLeft",
  "marginRight",
  "marginInline",
  "marginBlock",
  "marginInlineStart",
  "marginInlineEnd",
  "marginBlockStart",
  "marginBlockEnd",
]);

const isMarginKey = (key) => {
  if (!key) return false;
  if (key.type === "Identifier") return MARGIN_KEYS.has(key.name);
  if (key.type === "Literal") return MARGIN_KEYS.has(String(key.value));
  return false;
};

const hasMarginInStyle = (expression) => {
  if (expression.type !== "ObjectExpression") return false;
  return expression.properties.some(
    (property) => property.type === "Property" && isMarginKey(property.key),
  );
};

export default createRule({
  name: "no-button-inline-margin",
  meta: {
    type: "problem",
    docs: {
      description: "Button に margin 系の inline style を書くのを禁止し、親レイアウトの gap などで余白をとるよう促す",
      recommended: "error",
    },
    messages: {
      margin: "Button の余白は style.margin* ではなく、親のレイアウト(gap/stack)で調整してください。",
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
          if (hasMarginInStyle(expr)) {
            context.report({ node: attr, messageId: "margin" });
          }
        }
      },
    };
  },
});
