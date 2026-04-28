import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CaseDetailPresentation } from "./components/CaseDetailPresentation";
import {
  AVAILABLE_STAMPS,
  assigneeOptions,
  CURRENT_USER,
  caseData,
  caseTypeOptions,
  contractStatusConfig,
  departmentOptions,
  initialTimelineMessages,
  linkedFiles,
  primaryContractFile,
  statusOptions,
} from "./constants";
import type { PaneType, TimelineMessage } from "./types";

export function CaseDetailContainer() {
  const navigate = useNavigate();

  // Pane state
  const [paneOpen, setPaneOpen] = useState(true);
  const [paneType, setPaneType] = useState<PaneType>("case-info");

  // Timeline state
  const [showHistory, setShowHistory] = useState(false);
  const [timelineMessages, setTimelineMessages] = useState<TimelineMessage[]>(initialTimelineMessages);

  // Form state
  const [caseType, setCaseType] = useState("contract_draft");
  const [status, setStatus] = useState("in_progress_001");
  const [assignee, setAssignee] = useState("yamada");
  const [department, setDepartment] = useState("sales");
  const [requester, setRequester] = useState("takahashi");

  // Navigation handler
  const handleNavigateBack = () => {
    navigate("/template/loc/case");
  };

  // Pane handlers
  const handleSelectPane = (nextPane: PaneType) => {
    setPaneType(nextPane);
    setPaneOpen(true);
  };

  const handleOpenLinkedFiles = () => {
    setPaneType("linked-file");
    setPaneOpen(true);
  };

  const handleCloseSidePane = () => {
    setPaneOpen(false);
  };

  // Stamp handler
  const handleStampClick = (messageId: string, stampId: string) => {
    setTimelineMessages((prevMessages) =>
      prevMessages.map((msg) => {
        if (msg.id !== messageId) return msg;

        const existingStamps = msg.stamps || [];
        const stampInfo = AVAILABLE_STAMPS.find((s) => s.id === stampId);
        if (!stampInfo) return msg;

        const existingStampIndex = existingStamps.findIndex((s) => s.id === stampId);

        if (existingStampIndex >= 0) {
          const existingStamp = existingStamps[existingStampIndex];
          const userIndex = existingStamp.users.indexOf(CURRENT_USER);

          if (userIndex >= 0) {
            const newUsers = existingStamp.users.filter((u) => u !== CURRENT_USER);
            if (newUsers.length === 0) {
              return {
                ...msg,
                stamps: existingStamps.filter((s) => s.id !== stampId),
              };
            }
            return {
              ...msg,
              stamps: existingStamps.map((s) => (s.id === stampId ? { ...s, count: s.count - 1, users: newUsers } : s)),
            };
          }
          return {
            ...msg,
            stamps: existingStamps.map((s) =>
              s.id === stampId ? { ...s, count: s.count + 1, users: [...s.users, CURRENT_USER] } : s,
            ),
          };
        }
        return {
          ...msg,
          stamps: [...existingStamps, { id: stampId, emoji: stampInfo.emoji, count: 1, users: [CURRENT_USER] }],
        };
      }),
    );
  };

  return (
    <CaseDetailPresentation
      // data props
      caseData={caseData}
      currentUser={CURRENT_USER}
      linkedFiles={linkedFiles}
      primaryContractFile={primaryContractFile}
      contractStatusConfig={contractStatusConfig}
      caseTypeOptions={caseTypeOptions}
      statusOptions={statusOptions}
      assigneeOptions={assigneeOptions}
      departmentOptions={departmentOptions}
      // state props
      paneOpen={paneOpen}
      paneType={paneType}
      showHistory={showHistory}
      caseType={caseType}
      status={status}
      assignee={assignee}
      department={department}
      requester={requester}
      timelineMessages={timelineMessages}
      // handler props
      onNavigateBack={handleNavigateBack}
      onSelectPane={handleSelectPane}
      onOpenLinkedFiles={handleOpenLinkedFiles}
      onStampClick={handleStampClick}
      onCloseSidePane={handleCloseSidePane}
      onShowHistoryChange={setShowHistory}
      onCaseTypeChange={setCaseType}
      onStatusChange={setStatus}
      onAssigneeChange={setAssignee}
      onDepartmentChange={setDepartment}
      onRequesterChange={setRequester}
    />
  );
}
