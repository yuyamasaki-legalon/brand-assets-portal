// === データ型 ===

export type CaseStatusKind = "builtin_not_started" | "builtin_closed" | "custom";

export interface CaseStatus {
  id: string;
  name: string;
  kind: CaseStatusKind;
}

// === Props 型 ===

export interface StatusRowProps {
  status: CaseStatus;
  isDraggable: boolean;
}

export interface ApplicationConsolePresentationProps {
  // data props
  notStartedStatus: CaseStatus;
  closedStatus: CaseStatus;
  maxStatusCount: number;
  leadText: string;
  // state props
  inProgressStatuses: CaseStatus[];
  closedStatuses: CaseStatus[];
  canAddInProgressStatus: boolean;
  canAddClosedStatus: boolean;
  // handler props
  onInProgressReorder: (statuses: CaseStatus[]) => void;
  onClosedReorder: (statuses: CaseStatus[]) => void;
}
