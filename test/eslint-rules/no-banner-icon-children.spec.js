import rule from "./no-banner-icon-children.js";
import { createRuleTester } from "./test-utils.js";

const ruleTester = createRuleTester();

ruleTester.run("no-banner-icon-children", rule, {
  valid: [
    // テキストのみ
    `<Banner color="info">お知らせメッセージ</Banner>`,
    // 自動表示アイコン以外のアイコン
    `<Banner color="info"><Icon><LfArrowRight /></Icon>リンク付きメッセージ</Banner>`,
    // 対象外のコンポーネント
    `<div><Icon><LfInformationCircle /></Icon></div>`,
    `<Alert><LfCheckCircle /></Alert>`,
  ],
  invalid: [
    {
      code: `<Banner color="info"><Icon><LfInformationCircle /></Icon>メッセージ</Banner>`,
      errors: [{ messageId: "noIconInBanner", data: { iconName: "LfInformationCircle" } }],
    },
    {
      code: `<Banner color="success"><Icon><LfCheckCircle /></Icon>成功メッセージ</Banner>`,
      errors: [{ messageId: "noIconInBanner", data: { iconName: "LfCheckCircle" } }],
    },
    {
      code: `<Banner color="warning"><LfWarningRhombus />警告メッセージ</Banner>`,
      errors: [{ messageId: "noIconInBanner", data: { iconName: "LfWarningRhombus" } }],
    },
    {
      code: `<Banner color="error"><LfWarningTriangleFill />エラーメッセージ</Banner>`,
      errors: [{ messageId: "noIconInBanner", data: { iconName: "LfWarningTriangleFill" } }],
    },
  ],
});
