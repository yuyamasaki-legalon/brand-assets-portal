import { LfAngleLeftMiddle, LfEllipsisDot, LfMagnifyingGlass, LfMenu } from "@legalforce/aegis-icons";
import {
  Button,
  Divider,
  Header,
  Icon,
  IconButton,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";
import type { CaseData, LinkedFile, PaneType, SelectOption, StatusConfig, TimelineMessage } from "../types";
import { CaseInfoCard } from "./CaseInfoCard";
import { CaseLabels } from "./CaseLabels";
import { PrimaryContractFileCard } from "./PrimaryContractFileCard";
import { SideNavigation } from "./SideNavigation";
import { SidePane } from "./SidePane";
import { TimelineSection } from "./TimelineSection";

export interface CaseDetailPresentationProps {
  // data props
  caseData: CaseData;
  currentUser: string;
  linkedFiles: LinkedFile[];
  primaryContractFile: LinkedFile;
  contractStatusConfig: Record<string, StatusConfig>;
  caseTypeOptions: SelectOption[];
  statusOptions: SelectOption[];
  assigneeOptions: SelectOption[];
  departmentOptions: SelectOption[];
  // state props
  paneOpen: boolean;
  paneType: PaneType;
  showHistory: boolean;
  caseType: string;
  status: string;
  assignee: string;
  department: string;
  requester: string;
  timelineMessages: TimelineMessage[];
  // handler props
  onNavigateBack: () => void;
  onSelectPane: (pane: PaneType) => void;
  onOpenLinkedFiles: () => void;
  onStampClick: (messageId: string, stampId: string) => void;
  onCloseSidePane: () => void;
  onShowHistoryChange: (show: boolean) => void;
  onCaseTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onAssigneeChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onRequesterChange: (value: string) => void;
}

export function CaseDetailPresentation({
  caseData,
  currentUser,
  linkedFiles,
  primaryContractFile,
  contractStatusConfig,
  caseTypeOptions,
  statusOptions,
  assigneeOptions,
  departmentOptions,
  paneOpen,
  paneType,
  showHistory,
  caseType,
  status,
  assignee,
  department,
  requester,
  timelineMessages,
  onNavigateBack,
  onSelectPane,
  onOpenLinkedFiles,
  onStampClick,
  onCloseSidePane,
  onShowHistoryChange,
  onCaseTypeChange,
  onStatusChange,
  onAssigneeChange,
  onDepartmentChange,
  onRequesterChange,
}: CaseDetailPresentationProps) {
  return (
    <>
      {/* ヘッダー */}
      <Header>
        <Header.Item>
          <Tooltip title="メニュー">
            <IconButton variant="plain" aria-label="メニュー">
              <Icon>
                <LfMenu />
              </Icon>
            </IconButton>
          </Tooltip>
          <Divider orientation="vertical" />
          <Tooltip title="戻る">
            <IconButton variant="plain" aria-label="戻る" onClick={onNavigateBack}>
              <Icon>
                <LfAngleLeftMiddle />
              </Icon>
            </IconButton>
          </Tooltip>
        </Header.Item>
        <Header.Item>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Header.Title>
              <Tooltip title={caseData.title} onlyOnOverflow>
                <Text numberOfLines={1} variant="title.xxSmall">
                  {caseData.title}
                </Text>
              </Tooltip>
            </Header.Title>
            <Button size="xSmall" variant="gutterless">
              <Text variant="body.small" color="subtle">
                {caseData.id}
              </Text>
            </Button>
          </div>
        </Header.Item>
        <Header.Spacer />
        <Header.Item>
          <Tooltip title="検索">
            <IconButton variant="plain" aria-label="検索">
              <Icon>
                <LfMagnifyingGlass />
              </Icon>
            </IconButton>
          </Tooltip>
          <Tooltip title="その他">
            <IconButton variant="plain" aria-label="その他">
              <Icon>
                <LfEllipsisDot />
              </Icon>
            </IconButton>
          </Tooltip>
        </Header.Item>
      </Header>

      <PageLayout>
        <PageLayoutContent maxWidth="medium">
          <PageLayoutBody>
            {/* 案件情報カード */}
            <CaseInfoCard caseData={caseData} />

            <PrimaryContractFileCard
              file={primaryContractFile}
              statusConfig={contractStatusConfig}
              onOpenLinkedFiles={onOpenLinkedFiles}
            />

            {/* 案件ラベル */}
            <CaseLabels labels={caseData.labels} />

            {/* タブ（タイムライン / Slack / メール） */}
            <TimelineSection
              messages={timelineMessages}
              showHistory={showHistory}
              currentUser={currentUser}
              onShowHistoryChange={onShowHistoryChange}
              onStampClick={onStampClick}
            />
          </PageLayoutBody>
        </PageLayoutContent>

        {/* 右サイドペイン */}
        <SidePane
          paneOpen={paneOpen}
          paneType={paneType}
          onClose={onCloseSidePane}
          caseType={caseType}
          status={status}
          assignee={assignee}
          department={department}
          requester={requester}
          caseTypeOptions={caseTypeOptions}
          statusOptions={statusOptions}
          assigneeOptions={assigneeOptions}
          departmentOptions={departmentOptions}
          subAssignees={caseData.subAssignees}
          space={caseData.space}
          linkedFiles={linkedFiles}
          contractStatusConfig={contractStatusConfig}
          onCaseTypeChange={onCaseTypeChange}
          onStatusChange={onStatusChange}
          onAssigneeChange={onAssigneeChange}
          onDepartmentChange={onDepartmentChange}
          onRequesterChange={onRequesterChange}
        />

        {/* 右サイドバー（ナビゲーション） */}
        <SideNavigation paneOpen={paneOpen} paneType={paneType} onSelectPane={onSelectPane} />
      </PageLayout>
    </>
  );
}
