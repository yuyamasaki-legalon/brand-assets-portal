import rule from "./no-raw-span.js";
import { createRuleTester } from "./test-utils.js";

const ruleTester = createRuleTester();

ruleTester.run("no-raw-span", rule, {
  valid: [
    // Text コンポーネントを使用
    `<Text>テキスト</Text>`,
    `<Body>本文テキスト</Body>`,
    `<Heading>見出し</Heading>`,
    // 他の HTML 要素
    `<div>テキスト</div>`,
    `<p>段落</p>`,
  ],
  invalid: [
    {
      code: `<span>テキスト</span>`,
      errors: [{ messageId: "useText" }],
    },
    {
      code: `<span className="highlight">ハイライト</span>`,
      errors: [{ messageId: "useText" }],
    },
    {
      code: `<span style={{ color: "red" }}>赤テキスト</span>`,
      errors: [{ messageId: "useText" }],
    },
  ],
});
