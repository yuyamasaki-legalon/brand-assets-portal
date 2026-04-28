import rule from "./no-link-icon-children.js";
import { createRuleTester } from "./test-utils.js";

const ruleTester = createRuleTester();

ruleTester.run("no-link-icon-children", rule, {
  valid: [
    // trailing prop を使用
    `<Link href="/" trailing={<Icon><LfArrowRight /></Icon>}>リンク</Link>`,
    // leading prop を使用
    `<Link href="/" leading={<Icon><LfArrowLeft /></Icon>}>リンク</Link>`,
    // Icon なしの子要素
    `<Link href="/">リンクテキスト</Link>`,
    // 対象外のコンポーネント
    `<Button><Icon><LfArrowRight /></Icon></Button>`,
  ],
  invalid: [
    {
      code: `<Link href="/"><Icon><LfArrowRight /></Icon></Link>`,
      errors: [{ messageId: "useTrailing" }],
    },
    {
      code: `<Link href="/">テキスト<Icon><LfCheck /></Icon></Link>`,
      errors: [{ messageId: "useTrailing" }],
    },
    {
      code: `<Link href="/"><LfArrowRight /></Link>`,
      errors: [{ messageId: "useTrailing" }],
    },
  ],
});
