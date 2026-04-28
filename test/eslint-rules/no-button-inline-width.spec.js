import rule from "./no-button-inline-width.js";
import { createRuleTester } from "./test-utils.js";

const ruleTester = createRuleTester();

ruleTester.run("no-button-inline-width", rule, {
  valid: [
    // width prop を使用
    `<Button width="full">ボタン</Button>`,
    `<Button width="auto">ボタン</Button>`,
    // style に width がない
    `<Button style={{ color: "red" }}>ボタン</Button>`,
    `<Button style={{ padding: 8 }}>ボタン</Button>`,
    // 対象外のコンポーネント
    `<div style={{ width: 100 }}>テキスト</div>`,
    `<Input style={{ width: 200 }} />`,
  ],
  invalid: [
    {
      code: `<Button style={{ width: 100 }}>ボタン</Button>`,
      errors: [{ messageId: "width" }],
    },
    {
      code: `<Button style={{ width: "100px" }}>ボタン</Button>`,
      errors: [{ messageId: "width" }],
    },
    {
      code: `<Button style={{ color: "red", width: 200 }}>ボタン</Button>`,
      errors: [{ messageId: "width" }],
    },
  ],
});
