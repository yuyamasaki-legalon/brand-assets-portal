import { ESLintUtils } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator(() => "");

export default createRule({
  name: "no-raw-span",
  meta: {
    type: "suggestion",
    docs: {
      description: "<span> の代わりに Aegis の <Text> コンポーネントを使用してください",
      recommended: "warn",
    },
    messages: {
      useText: "<span> ではなく Aegis の <Text> コンポーネントを使用してください。",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.type !== "JSXIdentifier") return;
        if (node.name.name !== "span") return;

        context.report({
          node,
          messageId: "useText",
        });
      },
    };
  },
});
