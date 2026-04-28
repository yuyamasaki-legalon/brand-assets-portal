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

const includeSomeTooltipComponentInParent = (node) =>
  node === undefined || node === null
    ? false
    : (node.type === "JSXElement" && isIdentifierName(node.openingElement.name) === "Tooltip") ||
      includeSomeTooltipComponentInParent(node.parent);

const includeHoverTriggeredPopoverComponentInParent = (node) => {
  if (node === undefined || node === null) return false;
  if (node.type === "JSXElement" && isIdentifierName(node.openingElement.name) === "Popover") {
    const triggerAttr = node.openingElement.attributes.find(
      (attr) => attr.type === "JSXAttribute" && attr.name.type === "JSXIdentifier" && attr.name.name === "trigger",
    );
    if (triggerAttr && triggerAttr.value && triggerAttr.value.type === "Literal" && triggerAttr.value.value === "hover") {
      return true;
    }
  }
  return includeHoverTriggeredPopoverComponentInParent(node.parent);
};

export default createRule({
  name: "no-icon-button-without-popper",
  meta: {
    type: "problem",
    docs: {
      description: "IconButton は Tooltip または hover Popover で囲む必要があります",
      recommended: "error",
    },
    messages: {
      missingTooltip: '"IconButton" must be used within "Tooltip" or "Popover" with trigger="hover".',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXElement(node) {
        const name = isIdentifierName(node.openingElement.name);
        if (name !== "IconButton") return;

        const isTooltipDetected = includeSomeTooltipComponentInParent(node.parent);
        const isHoverTriggeredPopoverDetected = includeHoverTriggeredPopoverComponentInParent(node.parent);

        if (!isTooltipDetected && !isHoverTriggeredPopoverDetected) {
          context.report({ node: node.openingElement, messageId: "missingTooltip" });
        }
      },
    };
  },
});
