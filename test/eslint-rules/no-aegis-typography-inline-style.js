import { ESLintUtils } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator(() => "");
const TARGETS = new Set(["Text", "Body", "Heading"]);

export default createRule({
  name: "no-aegis-typography-inline-style",
  meta: {
    type: "problem",
    docs: {
      description: "Aegis Typography (Text/Body/Heading) の whiteSpace を style で指定するのを禁止し、whiteSpace prop を使わせる",
      recommended: "error",
    },
    messages: {
      whiteSpace: "whiteSpace は style ではなく whiteSpace prop を使ってください。",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.type !== "JSXIdentifier") return;
        const name = node.name.name;
        if (!TARGETS.has(name)) return;

        for (const attr of node.attributes) {
          if (attr.type !== "JSXAttribute" || attr.name.type !== "JSXIdentifier") continue;
          if (attr.name.name !== "style" || !attr.value || attr.value.type !== "JSXExpressionContainer") continue;

          const expr = attr.value.expression;
          if (expr.type === "ObjectExpression") {
            const hasWhiteSpace = expr.properties.some(
              (p) =>
                p.type === "Property" &&
                p.key.type === "Identifier" &&
                p.key.name === "whiteSpace",
            );
            if (hasWhiteSpace) {
              context.report({
                node: attr,
                messageId: "whiteSpace",
              });
            }
          }
        }
      },
    };
  },
});
