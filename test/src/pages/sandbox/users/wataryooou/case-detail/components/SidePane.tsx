import { LfCloseLarge } from "@legalforce/aegis-icons";
import {
  ContentHeader,
  Icon,
  IconButton,
  PageLayoutBody,
  PageLayoutHeader,
  PageLayoutPane,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";
import type { LinkedFile, PaneType, SelectOption, StatusConfig } from "../types";
import { CaseInfoForm } from "./CaseInfoForm";
import { LinkedFileList } from "./LinkedFileList";

interface SidePaneProps {
  paneOpen: boolean;
  paneType: PaneType;
  onClose: () => void;
  // CaseInfoForm props
  caseType: string;
  status: string;
  assignee: string;
  department: string;
  requester: string;
  caseTypeOptions: SelectOption[];
  statusOptions: SelectOption[];
  assigneeOptions: SelectOption[];
  departmentOptions: SelectOption[];
  subAssignees: string[];
  space: string;
  onCaseTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onAssigneeChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onRequesterChange: (value: string) => void;
  // LinkedFileList props
  linkedFiles: LinkedFile[];
  contractStatusConfig: Record<string, StatusConfig>;
}

export function SidePane({
  paneOpen,
  paneType,
  onClose,
  caseType,
  status,
  assignee,
  department,
  requester,
  caseTypeOptions,
  statusOptions,
  assigneeOptions,
  departmentOptions,
  subAssignees,
  space,
  onCaseTypeChange,
  onStatusChange,
  onAssigneeChange,
  onDepartmentChange,
  onRequesterChange,
  linkedFiles,
  contractStatusConfig,
}: SidePaneProps) {
  return (
    <PageLayoutPane position="end" width="large" open={paneOpen} resizable>
      <PageLayoutHeader>
        <ContentHeader
          size="small"
          trailing={
            <Tooltip title="閉じる" placement="top">
              <IconButton variant="plain" size="small" aria-label="閉じる" onClick={onClose}>
                <Icon>
                  <LfCloseLarge />
                </Icon>
              </IconButton>
            </Tooltip>
          }
        >
          <ContentHeader.Title>
            <Text variant="title.small">{paneType === "linked-file" ? "リンク済みファイル" : "案件情報"}</Text>
          </ContentHeader.Title>
        </ContentHeader>
      </PageLayoutHeader>
      <PageLayoutBody>
        {paneType === "linked-file" ? (
          <LinkedFileList files={linkedFiles} statusConfig={contractStatusConfig} />
        ) : (
          <CaseInfoForm
            caseType={caseType}
            status={status}
            assignee={assignee}
            department={department}
            requester={requester}
            caseTypeOptions={caseTypeOptions}
            statusOptions={statusOptions}
            assigneeOptions={assigneeOptions}
            departmentOptions={departmentOptions}
            subAssignees={subAssignees}
            space={space}
            onCaseTypeChange={onCaseTypeChange}
            onStatusChange={onStatusChange}
            onAssigneeChange={onAssigneeChange}
            onDepartmentChange={onDepartmentChange}
            onRequesterChange={onRequesterChange}
          />
        )}
      </PageLayoutBody>
    </PageLayoutPane>
  );
}
