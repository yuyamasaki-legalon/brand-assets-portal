/**
 * β版: 入力コンポーネント（TextField, Select, Textarea 等）が FormControl 外で
 * 使用されている場合に警告する。FormControl でラップするか、aria-label を付ける必要がある。
 *
 * @see docs/anti-patterns/AP-FORMCONTROL-001.md
 */
import { ESLintUtils } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator(() => "");

const INPUT_COMPONENTS = new Set([
  "TextField",
  "Select",
  "Textarea",
  "Combobox",
  "TagInput",
  "TagPicker",
  "DateField",
  "DatePicker",
  "RangeDatePicker",
  "TimeField",
]);

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

const isInsideFormControl = (node) => {
  let current = node.parent;
  while (current) {
    if (current.type === "JSXElement") {
      const name = isIdentifierName(current.openingElement.name);
      if (name === "FormControl") return true;
    }
    current = current.parent;
  }
  return false;
};

export default createRule({
  name: "no-textfield-without-formcontrol",
  meta: {
    type: "problem",
    docs: {
      description:
        "入力コンポーネント（TextField, Select, Textarea 等）は FormControl 内で使用するか、aria-label を付ける必要がある",
      recommended: "warn",
    },
    messages: {
      missingFormControl:
        "{{ componentName }} は FormControl 内で使用するか、aria-label / aria-labelledby を付けてください。",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXOpeningElement(node) {
        const name = isIdentifierName(node.name);
        if (!INPUT_COMPONENTS.has(name)) return;

        if (isInsideFormControl(node)) return;
        if (hasAriaLabel(node)) return;

        context.report({
          node,
          messageId: "missingFormControl",
          data: { componentName: name },
        });
      },
    };
  },
});
