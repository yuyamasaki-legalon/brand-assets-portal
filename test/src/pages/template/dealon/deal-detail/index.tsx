import {
  LfBell,
  LfCalendar,
  LfChartBar,
  LfFileLines,
  LfFiles,
  LfFilesSignature,
  LfList,
  LfMail,
  LfTimeline,
  LfTrash,
} from "@legalforce/aegis-icons";
import {
  ContentHeader,
  ContentHeaderTitle,
  Icon,
  IconButton,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Tab,
  Tooltip,
} from "@legalforce/aegis-react";
import { DealOnLayout } from "../layout";
import { ActivitiesTabContent } from "./activities";
import { AlertsTabContent } from "./alerts";
import { BasicInfoTabContent } from "./basic-info";
import { FilesTabContent } from "./files";
import { JobsTabContent } from "./jobs";
import { MeetingsTabContent } from "./meetings";
import { MessagesTabContent } from "./messages";
import { MinutesTabContent } from "./minutes";
import { TasksTabContent } from "./tasks";

// ---------------------------------------------------------------------------
// Tab definitions
// ---------------------------------------------------------------------------

const tabs = [
  { label: "基本情報", icon: LfFileLines },
  { label: "アラート", icon: LfBell },
  { label: "タスク", icon: LfList },
  { label: "ミーティング", icon: LfCalendar },
  { label: "議事録", icon: LfFilesSignature },
  { label: "ファイル", icon: LfFiles },
  { label: "メッセージ", icon: LfMail },
  { label: "アクティビティ", icon: LfTimeline },
  { label: "ジョブ", icon: LfChartBar },
] as const;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DealOnDealDetailPage() {
  return (
    <DealOnLayout>
      <PageLayoutContent scrollBehavior="outside">
        <PageLayoutHeader>
          <ContentHeader
            trailing={
              <Tooltip title="案件を削除">
                <IconButton variant="plain" size="small" color="danger" aria-label="案件を削除">
                  <Icon>
                    <LfTrash />
                  </Icon>
                </IconButton>
              </Tooltip>
            }
          >
            <ContentHeaderTitle>【三峰商事株式会社】DealOn20260101</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>

        <PageLayoutBody>
          <Tab.Group size="medium">
            <Tab.List>
              {tabs.map((tab) => (
                <Tab key={tab.label} leading={tab.icon}>
                  {tab.label}
                </Tab>
              ))}
            </Tab.List>

            <Tab.Panels>
              {/* 基本情報 */}
              <Tab.Panel>
                <BasicInfoTabContent />
              </Tab.Panel>

              {/* アラート */}
              <Tab.Panel>
                <AlertsTabContent />
              </Tab.Panel>

              {/* タスク */}
              <Tab.Panel>
                <TasksTabContent />
              </Tab.Panel>

              {/* ミーティング */}
              <Tab.Panel>
                <MeetingsTabContent />
              </Tab.Panel>

              {/* 議事録 */}
              <Tab.Panel>
                <MinutesTabContent />
              </Tab.Panel>

              {/* ファイル */}
              <Tab.Panel>
                <FilesTabContent />
              </Tab.Panel>

              {/* メッセージ */}
              <Tab.Panel>
                <MessagesTabContent />
              </Tab.Panel>

              {/* アクティビティ */}
              <Tab.Panel>
                <ActivitiesTabContent />
              </Tab.Panel>

              {/* ジョブ */}
              <Tab.Panel>
                <JobsTabContent />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </PageLayoutBody>
      </PageLayoutContent>
    </DealOnLayout>
  );
}
