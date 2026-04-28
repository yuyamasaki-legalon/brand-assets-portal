import tsParser from "@typescript-eslint/parser";
import noTypographyInlineStyle from "./eslint-rules/no-aegis-typography-inline-style.js";
import noLinkIconChildren from "./eslint-rules/no-link-icon-children.js";
import noButtonInlineWidth from "./eslint-rules/no-button-inline-width.js";
import noButtonInlineMargin from "./eslint-rules/no-button-inline-margin.js";
import noRawSpan from "./eslint-rules/no-raw-span.js";
import noIconButtonWithoutPopper from "./eslint-rules/no-icon-button-without-popper.js";
import noBannerIconChildren from "./eslint-rules/no-banner-icon-children.js";
import noMultipleSolidButtons from "./eslint-rules/no-multiple-solid-buttons.js";
import noTextfieldWithoutFormcontrol from "./eslint-rules/no-textfield-without-formcontrol.js";
import noRawPixelValues from "./eslint-rules/no-raw-pixel-values.js";
import noDialogWithoutHeader from "./eslint-rules/no-dialog-without-header.js";
import requireIconbuttonAriaLabel from "./eslint-rules/require-iconbutton-aria-label.js";

const aegisCustomPlugin = {
  rules: {
    "no-aegis-typography-inline-style": noTypographyInlineStyle,
    "no-link-icon-children": noLinkIconChildren,
    "no-button-inline-width": noButtonInlineWidth,
    "no-button-inline-margin": noButtonInlineMargin,
    "no-raw-span": noRawSpan,
    "no-icon-button-without-popper": noIconButtonWithoutPopper,
    "no-banner-icon-children": noBannerIconChildren,
    "no-multiple-solid-buttons": noMultipleSolidButtons,
    "no-textfield-without-formcontrol": noTextfieldWithoutFormcontrol,
    "no-raw-pixel-values": noRawPixelValues,
    "no-dialog-without-header": noDialogWithoutHeader,
    "require-iconbutton-aria-label": requireIconbuttonAriaLabel,
  },
};

export default [
  {
    ignores: ["lib/**", "dist/**", "node_modules/**", "src-tauri/**"],
  },
  {
    files: ["src/pages/template/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      "aegis-custom": aegisCustomPlugin,
    },
    rules: {
      "aegis-custom/no-aegis-typography-inline-style": "error",
      "aegis-custom/no-link-icon-children": "error",
      "aegis-custom/no-button-inline-width": "error",
      "aegis-custom/no-button-inline-margin": "error",
      "aegis-custom/no-icon-button-without-popper": "error",
      "aegis-custom/no-banner-icon-children": "error",
      // β版: 新規追加ルール
      "aegis-custom/no-multiple-solid-buttons": "warn",
      "aegis-custom/no-textfield-without-formcontrol": "warn",
      "aegis-custom/no-raw-pixel-values": "warn",
      "aegis-custom/no-dialog-without-header": "warn",
      "aegis-custom/require-iconbutton-aria-label": "warn",
    },
  },
  {
    files: ["src/pages/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      "aegis-custom": aegisCustomPlugin,
    },
    rules: {
      "aegis-custom/no-raw-span": "warn",
      "aegis-custom/no-icon-button-without-popper": "warn",
      "aegis-custom/no-banner-icon-children": "warn",
      // β版: 新規追加ルール
      "aegis-custom/no-multiple-solid-buttons": "warn",
      "aegis-custom/no-textfield-without-formcontrol": "warn",
      "aegis-custom/no-raw-pixel-values": "warn",
      "aegis-custom/no-dialog-without-header": "warn",
      "aegis-custom/require-iconbutton-aria-label": "warn",
    },
  },
];
