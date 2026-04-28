import { ESLintUtils } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator(() => "");

// Banner が内部で自動表示するアイコン
const BANNER_INTERNAL_ICONS = new Set([
  "LfInformationCircle",
  "LfCheckCircle",
  "LfWarningRhombus",
  "LfWarningTriangleFill",
]);

const isIdentifierName = (nameNode) => {
  if (!nameNode) return "";
  if (nameNode.type === "JSXIdentifier") return nameNode.name;
  if (nameNode.type === "JSXMemberExpression") {
    return nameNode.property.type === "JSXIdentifier" ? nameNode.property.name : "";
  }
  return "";
};

const findBannerInternalIcon = (children) => {
  for (const child of children) {
    // <Icon><LfInformationCircle /></Icon> のパターン
    if (child.type === "JSXElement") {
      const name = isIdentifierName(child.openingElement.name);
      if (name === "Icon" && child.children) {
        for (const iconChild of child.children) {
          if (iconChild.type === "JSXElement" || iconChild.type === "JSXSelfClosingElement") {
            const iconName = isIdentifierName(
              iconChild.type === "JSXElement" ? iconChild.openingElement.name : iconChild.name,
            );
            if (BANNER_INTERNAL_ICONS.has(iconName)) {
              return iconName;
            }
          }
        }
      }
      // 直接 <LfInformationCircle /> のパターン
      if (BANNER_INTERNAL_ICONS.has(name)) {
        return name;
      }
    }
    // <LfInformationCircle /> (self-closing)
    if (child.type === "JSXSelfClosingElement") {
      const name = isIdentifierName(child.name);
      if (BANNER_INTERNAL_ICONS.has(name)) {
        return name;
      }
    }
  }
  return null;
};

export default createRule({
  name: "no-banner-icon-children",
  meta: {
    type: "problem",
    docs: {
      description:
        "Banner に内部で自動表示されるアイコン（LfInformationCircle, LfCheckCircle, LfWarningRhombus, LfWarningTriangleFill）を子要素として含めることを禁止する",
      recommended: "error",
    },
    messages: {
      noIconInBanner:
        "Banner に {{ iconName }} を追加しないでください。Banner は color prop に応じてこのアイコンが自動的に表示されます。",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXElement(node) {
        const opening = node.openingElement;
        const name = isIdentifierName(opening.name);
        if (name !== "Banner") return;

        const foundIcon = findBannerInternalIcon(node.children);
        if (foundIcon) {
          context.report({
            node: opening,
            messageId: "noIconInBanner",
            data: { iconName: foundIcon },
          });
        }
      },
    };
  },
});
