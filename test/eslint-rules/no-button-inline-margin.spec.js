import rule from "./no-button-inline-margin.js";
import { createRuleTester } from "./test-utils.js";

const ruleTester = createRuleTester();

ruleTester.run("no-button-inline-margin", rule, {
  valid: [
    // margin なし
    `<Button>ボタン</Button>`,
    // style に margin がない
    `<Button style={{ padding: 8 }}>ボタン</Button>`,
    `<Button style={{ color: "red" }}>ボタン</Button>`,
    // 対象外のコンポーネント
    `<div style={{ margin: 8 }}>テキスト</div>`,
    `<Input style={{ marginTop: 16 }} />`,
  ],
  invalid: [
    {
      code: `<Button style={{ margin: 8 }}>ボタン</Button>`,
      errors: [{ messageId: "margin" }],
    },
    {
      code: `<Button style={{ marginTop: 16 }}>ボタン</Button>`,
      errors: [{ messageId: "margin" }],
    },
    {
      code: `<Button style={{ marginBottom: 16 }}>ボタン</Button>`,
      errors: [{ messageId: "margin" }],
    },
    {
      code: `<Button style={{ marginLeft: 8 }}>ボタン</Button>`,
      errors: [{ messageId: "margin" }],
    },
    {
      code: `<Button style={{ marginRight: 8 }}>ボタン</Button>`,
      errors: [{ messageId: "margin" }],
    },
    {
      code: `<Button style={{ marginInline: 8 }}>ボタン</Button>`,
      errors: [{ messageId: "margin" }],
    },
    {
      code: `<Button style={{ marginBlock: 8 }}>ボタン</Button>`,
      errors: [{ messageId: "margin" }],
    },
    {
      code: `<Button style={{ color: "red", marginTop: 16 }}>ボタン</Button>`,
      errors: [{ messageId: "margin" }],
    },
  ],
});
