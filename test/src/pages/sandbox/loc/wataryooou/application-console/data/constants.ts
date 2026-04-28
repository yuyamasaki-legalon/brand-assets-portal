import type { CaseStatus } from "../types";

export const MAX_STATUS_COUNT = 10;

export const LEAD_TEXT = "案件のステータスを追加・編集できます。";

export const BUILTIN_NOT_STARTED_STATUS: CaseStatus = {
  id: "builtin-not-started",
  name: "未着手",
  kind: "builtin_not_started",
};

export const BUILTIN_CLOSED_STATUS: CaseStatus = {
  id: "builtin-closed",
  name: "完了",
  kind: "builtin_closed",
};

export const INITIAL_IN_PROGRESS_STATUSES: CaseStatus[] = [
  { id: "1", name: "追加ステータス2", kind: "custom" },
  { id: "2", name: "追加ステータス1", kind: "custom" },
  { id: "3", name: "進行タスク001", kind: "custom" },
  { id: "4", name: "In other dept review", kind: "custom" },
  { id: "5", name: "案件ステータス追加", kind: "custom" },
  { id: "6", name: "test", kind: "custom" },
  { id: "7", name: "あいうえお", kind: "custom" },
  { id: "8", name: "あいうえおおあいうえおおあいうえおおあいうえお", kind: "custom" },
];

export const INITIAL_CLOSED_STATUSES: CaseStatus[] = [{ id: "closed-1", name: "取り下げ", kind: "custom" }];
