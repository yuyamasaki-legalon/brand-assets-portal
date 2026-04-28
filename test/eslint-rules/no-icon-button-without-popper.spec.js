import rule from "./no-icon-button-without-popper.js";
import { createRuleTester } from "./test-utils.js";

const ruleTester = createRuleTester();

ruleTester.run("no-icon-button-without-popper", rule, {
  valid: [
    // Tooltip で囲む
    `<Tooltip content="説明"><IconButton><LfPlus /></IconButton></Tooltip>`,
    // Popover (trigger="hover") で囲む
    `<Popover trigger="hover" content={<div>詳細</div>}><IconButton><LfInfo /></IconButton></Popover>`,
    // ネストした Tooltip
    `<div><Tooltip content="削除"><IconButton><LfTrash /></IconButton></Tooltip></div>`,
    // 通常の Button は対象外
    `<Button>通常ボタン</Button>`,
  ],
  invalid: [
    {
      code: `<IconButton><LfPlus /></IconButton>`,
      errors: [{ messageId: "missingTooltip" }],
    },
    {
      code: `<div><IconButton><LfTrash /></IconButton></div>`,
      errors: [{ messageId: "missingTooltip" }],
    },
    {
      // Popover だが trigger="hover" ではない
      code: `<Popover trigger="click" content={<div>詳細</div>}><IconButton><LfInfo /></IconButton></Popover>`,
      errors: [{ messageId: "missingTooltip" }],
    },
  ],
});
