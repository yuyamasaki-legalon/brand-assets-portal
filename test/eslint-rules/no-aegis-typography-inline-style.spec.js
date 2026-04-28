import rule from "./no-aegis-typography-inline-style.js";
import { createRuleTester } from "./test-utils.js";

const ruleTester = createRuleTester();

ruleTester.run("no-aegis-typography-inline-style", rule, {
  valid: [
    // whiteSpace prop を使用
    `<Text whiteSpace="nowrap">テキスト</Text>`,
    `<Body whiteSpace="pre-wrap">テキスト</Body>`,
    `<Heading whiteSpace="normal">見出し</Heading>`,
    // style に whiteSpace がない
    `<Text style={{ color: "red" }}>テキスト</Text>`,
    `<Body style={{ fontSize: 14 }}>テキスト</Body>`,
    // 対象外のコンポーネント
    `<div style={{ whiteSpace: "nowrap" }}>テキスト</div>`,
    `<span style={{ whiteSpace: "nowrap" }}>テキスト</span>`,
  ],
  invalid: [
    {
      code: `<Text style={{ whiteSpace: "nowrap" }}>テキスト</Text>`,
      errors: [{ messageId: "whiteSpace" }],
    },
    {
      code: `<Body style={{ whiteSpace: "pre-wrap" }}>テキスト</Body>`,
      errors: [{ messageId: "whiteSpace" }],
    },
    {
      code: `<Heading style={{ whiteSpace: "normal" }}>見出し</Heading>`,
      errors: [{ messageId: "whiteSpace" }],
    },
    {
      code: `<Text style={{ color: "red", whiteSpace: "nowrap" }}>テキスト</Text>`,
      errors: [{ messageId: "whiteSpace" }],
    },
  ],
});
