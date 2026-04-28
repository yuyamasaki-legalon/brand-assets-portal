import type { JSX } from "react";
import { useCallback, useState } from "react";
import {
  BUILTIN_CLOSED_STATUS,
  BUILTIN_NOT_STARTED_STATUS,
  INITIAL_CLOSED_STATUSES,
  INITIAL_IN_PROGRESS_STATUSES,
  LEAD_TEXT,
  MAX_STATUS_COUNT,
} from "./data/constants";
import { ApplicationConsolePresentation } from "./Presentation";
import type { CaseStatus } from "./types";

export const ApplicationConsoleContainer = (): JSX.Element => {
  // State
  const [inProgressStatuses, setInProgressStatuses] = useState<CaseStatus[]>(INITIAL_IN_PROGRESS_STATUSES);
  const [closedStatuses, setClosedStatuses] = useState<CaseStatus[]>(INITIAL_CLOSED_STATUSES);

  // Handlers
  const handleInProgressReorder = useCallback((newStatuses: CaseStatus[]) => {
    setInProgressStatuses(newStatuses);
  }, []);

  const handleClosedReorder = useCallback((newStatuses: CaseStatus[]) => {
    setClosedStatuses(newStatuses);
  }, []);

  // Computed
  const canAddInProgressStatus = inProgressStatuses.length < MAX_STATUS_COUNT;
  const canAddClosedStatus = closedStatuses.length < MAX_STATUS_COUNT;

  return (
    <ApplicationConsolePresentation
      // data props
      notStartedStatus={BUILTIN_NOT_STARTED_STATUS}
      closedStatus={BUILTIN_CLOSED_STATUS}
      maxStatusCount={MAX_STATUS_COUNT}
      leadText={LEAD_TEXT}
      // state props
      inProgressStatuses={inProgressStatuses}
      closedStatuses={closedStatuses}
      canAddInProgressStatus={canAddInProgressStatus}
      canAddClosedStatus={canAddClosedStatus}
      // handler props
      onInProgressReorder={handleInProgressReorder}
      onClosedReorder={handleClosedReorder}
    />
  );
};
