import type { TranslationDictionary } from "../../../../../../hooks";

export type TranslationKey =
  | "pageTitle"
  | "pageDescription"
  | "basicUsageTitle"
  | "savedMessage"
  | "deletedMessage"
  | "settingsUpdatedMessage"
  | "twoSentencesTitle"
  | "twoSentencesDescription"
  | "savedContinueMessage"
  | "errorDisplayTitle"
  | "errorMessage";

export const translations: TranslationDictionary<TranslationKey> = {
  "en-US": {
    pageTitle: "Snackbar Examples",
    pageDescription: "Examples of using Snackbar",
    basicUsageTitle: "Basic Usage",
    savedMessage: "Saved",
    deletedMessage: "Deletion completed",
    settingsUpdatedMessage: "Settings updated",
    twoSentencesTitle: "Two Sentences",
    twoSentencesDescription: "Add a period only at the end of the first sentence",
    savedContinueMessage: "Saved. You can continue editing",
    errorDisplayTitle: "Error Display",
    errorMessage: "An error occurred",
  },
  "ja-JP": {
    pageTitle: "Snackbar Examples",
    pageDescription: "Snackbar の使用例",
    basicUsageTitle: "基本的な使い方",
    savedMessage: "保存しました",
    deletedMessage: "削除が完了しました",
    settingsUpdatedMessage: "設定を更新しました",
    twoSentencesTitle: "2文の場合",
    twoSentencesDescription: "1つ目の文の終わりにのみ句点を付けます",
    savedContinueMessage: "保存しました。続けて編集できます",
    errorDisplayTitle: "エラー表示",
    errorMessage: "エラーが発生しました",
  },
};
