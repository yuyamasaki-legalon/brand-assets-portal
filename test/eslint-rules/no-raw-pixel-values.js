/**
 * β版: インラインスタイルにハードコードされた px 値が使用されている場合に警告する。
 * Aegis デザイントークン（var(--aegis-space-*), var(--aegis-size-*) 等）への置き換えを推奨。
 *
 * @see docs/anti-patterns/AP-TOKEN-001.md
 */
import { ESLintUtils } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator(() => "");

const PX_REGEX = /^\d+px$/;

const STYLE_KEYS_TO_CHECK = new Set([
  "padding",
  "paddingTop",
  "paddingBottom",
  "paddingLeft",
  "paddingRight",
  "paddingInline",
  "paddingBlock",
  "margin",
  "marginTop",
  "marginBottom",
  "marginLeft",
  "marginRight",
  "marginInline",
  "marginBlock",
  "gap",
  "rowGap",
  "columnGap",
  "borderRadius",
  "width",
  "height",
  "maxWidth",
  "maxHeight",
  "minWidth",
  "minHeight",
  "top",
  "bottom",
  "left",
  "right",
]);

const getKeyName = (key) => {
  if (!key) return "";
  if (key.type === "Identifier") return key.name;
  if (key.type === "Literal") return String(key.value);
  return "";
};

export default createRule({
  name: "no-raw-pixel-values",
  meta: {
    type: "suggestion",
    docs: {
      description:
        'インラインスタイルの px 値をトークン（var(--aegis-*)）に置き換えることを推奨する',
      recommended: "warn",
    },
    messages: {
      rawPixel:
        'style.{{ property }} にハードコードされた px 値 "{{ value }}" が使用されています。Aegis デザイントークン（var(--aegis-*)）の使用を検討してください。',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXOpeningElement(node) {
        for (const attr of node.attributes) {
          if (attr.type !== "JSXAttribute" || attr.name.type !== "JSXIdentifier") continue;
          if (attr.name.name !== "style" || !attr.value || attr.value.type !== "JSXExpressionContainer")
            continue;

          const expr = attr.value.expression;
          if (expr.type !== "ObjectExpression") continue;

          for (const prop of expr.properties) {
            if (prop.type !== "Property") continue;
            const keyName = getKeyName(prop.key);
            if (!STYLE_KEYS_TO_CHECK.has(keyName)) continue;

            if (prop.value.type === "Literal" && typeof prop.value.value === "string" && PX_REGEX.test(prop.value.value)) {
              context.report({
                node: prop,
                messageId: "rawPixel",
                data: { property: keyName, value: prop.value.value },
              });
            }

            if (prop.value.type === "Literal" && typeof prop.value.value === "number" && prop.value.value !== 0) {
              context.report({
                node: prop,
                messageId: "rawPixel",
                data: { property: keyName, value: `${prop.value.value}` },
              });
            }
          }
        }
      },
    };
  },
});
