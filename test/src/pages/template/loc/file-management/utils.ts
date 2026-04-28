import type { AgreedContractStatus, ContractDocumentStatus, ManualCorrectionStatus } from "./mock";

// "すべて"タブ — 契約書ステータスのラベル
export const contractDocumentStatusLabels: Record<ContractDocumentStatus, string> = {
  none: "なし",
  ownPartyDraft: "自社ドラフト",
  counterPartyDraft: "相手方ドラフト",
  approved: "承認済み",
  agreedContract: "締結済み",
};

// "締結版"タブ — StatusLabel 表示
export const agreedContractStatusLabels: Record<AgreedContractStatus, string> = {
  inTerm: "契約期間中",
  scheduledToEnd: "契約終了予定",
  finished: "契約終了済み",
};

export const agreedContractStatusColors: Record<AgreedContractStatus, "teal" | "yellow" | "neutral"> = {
  inTerm: "teal",
  scheduledToEnd: "yellow",
  finished: "neutral",
};

// 手動補正ステータス — プレーンテキスト表示
export const manualCorrectionStatusLabels: Record<ManualCorrectionStatus, string> = {
  beforeStart: "未着手",
  inProgress: "対応中",
  completed: "完了",
  completedWithComment: "完了(コメントあり)",
  notSubject: "対象外",
};
