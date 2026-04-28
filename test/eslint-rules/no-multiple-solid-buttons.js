/**
 * β版: 同一の ButtonGroup / DialogFooter 内に複数の variant="solid" Button を禁止する。
 * プライマリアクションは 1 つに限定し、ユーザーの意思決定を明確にする。
 *
 * @see docs/anti-patterns/AP-BUTTON-003.md
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

const isSolidVariant = (openingElement) =>
  openingElement.attributes.some(
    (attr) =>
      attr.type === "JSXAttribute" &&
      attr.name.type === "JSXIdentifier" &&
      attr.name.name === "variant" &&
      attr.value &&
      attr.value.type === "Literal" &&
      attr.value.value === "solid",
  );

export default createRule({
  name: "no-multiple-solid-buttons",
  meta: {
    type: "problem",
    docs: {
      description:
        '同一の ButtonGroup / DialogFooter 内に複数の variant="solid" Button を禁止する',
      recommended: "error",
    },
    messages: {
      multipleSolid:
        '同一グループ内に variant="solid" の Button が複数あります。プライマリアクションは 1 つにしてください。',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const CONTAINER_NAMES = new Set(["ButtonGroup", "DialogFooter"]);

    return {
      JSXElement(node) {
        const name = isIdentifierName(node.openingElement.name);
        if (!CONTAINER_NAMES.has(name)) return;

        let solidCount = 0;
        const solidNodes = [];

        for (const child of node.children) {
          if (child.type !== "JSXElement") continue;
          const childName = isIdentifierName(child.openingElement.name);
          if (childName !== "Button") continue;

          if (isSolidVariant(child.openingElement)) {
            solidCount++;
            solidNodes.push(child.openingElement);
          }
        }

        if (solidCount > 1) {
          for (const solidNode of solidNodes.slice(1)) {
            context.report({ node: solidNode, messageId: "multipleSolid" });
          }
        }
      },
    };
  },
});
