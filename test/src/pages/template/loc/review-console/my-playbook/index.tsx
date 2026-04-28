import {
  Banner,
  ContentHeader,
  ContentHeaderTitle,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  Tab,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { LocSidebarLayout } from "../../_shared";
import { FirstPartyAlertDetailPane } from "./components/FirstPartyAlertDetailPane";
import { FirstPartyPlaybookList, ThirdPartyPlaybookList } from "./components/PlaybookList";
import { PlaybookListHeader } from "./components/PlaybookListHeader";
import { ThirdPartyAlertDetailPane } from "./components/ThirdPartyAlertDetailPane";
import { MOCK_FIRST_PARTY_PLAYBOOKS, MOCK_THIRD_PARTY_PLAYBOOKS } from "./mock/data";

type PaneState =
  | { type: "hidden" }
  | { type: "thirdParty"; playbookId: string; alertId: string }
  | { type: "firstParty"; playbookId: string; alertId: string };

const MyPlaybookTemplate = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [paneState, setPaneState] = useState<PaneState>({ type: "hidden" });
  const [isPlaybookAdmin] = useState(true);
  const [isThirdPartyListOpen, setIsThirdPartyListOpen] = useState(true);
  const [isFirstPartyListOpen, setIsFirstPartyListOpen] = useState(true);

  const showPane = paneState.type !== "hidden";

  const handleTabChange = (index: number) => {
    setActiveTabIndex(index);
    setPaneState({ type: "hidden" });
  };

  const handleSelectThirdPartyAlert = (playbookId: string, alertId: string) => {
    setPaneState({ type: "thirdParty", playbookId, alertId });
  };

  const handleSelectFirstPartyAlert = (playbookId: string, alertId: string) => {
    setPaneState({ type: "firstParty", playbookId, alertId });
  };

  const handleClosePane = () => {
    setPaneState({ type: "hidden" });
  };

  const handleEditPlaybook = (_playbookId: string) => {
    // ロジックは不要なのでモック実装のみ
  };

  const handleCopyPlaybook = (_playbookId: string) => {
    // ロジックは不要なのでモック実装のみ
  };

  const handleOpenAddDialog = () => {
    // ロジックは不要なのでモック実装のみ
  };

  const handleEdit = () => {
    // ロジックは不要なのでモック実装のみ
  };

  const selectedThirdPartyPlaybook =
    paneState.type === "thirdParty"
      ? MOCK_THIRD_PARTY_PLAYBOOKS.find((p) => p.playbookSummary.playbookId === paneState.playbookId)
      : null;

  const selectedThirdPartyAlert =
    paneState.type === "thirdParty" && selectedThirdPartyPlaybook
      ? selectedThirdPartyPlaybook.playbookAlerts.find((a) => a.playbookAlertId === paneState.alertId)
      : null;

  const selectedFirstPartyPlaybook =
    paneState.type === "firstParty"
      ? MOCK_FIRST_PARTY_PLAYBOOKS.find((p) => p.playbookSummary.playbookId === paneState.playbookId)
      : null;

  const selectedFirstPartyAlert =
    paneState.type === "firstParty" && selectedFirstPartyPlaybook
      ? selectedFirstPartyPlaybook.firstPartyPlaybookAlerts.find(
          (a) => a.firstPartyPlaybookAlertId === paneState.alertId,
        )
      : null;

  return (
    <LocSidebarLayout activeId="review-criteria">
      <PageLayout>
        <PageLayoutContent>
          <PageLayoutHeader>
            <ContentHeader>
              <ContentHeaderTitle as="h1">プレイブックアラート</ContentHeaderTitle>
            </ContentHeader>
          </PageLayoutHeader>
          <PageLayoutBody>
            {!isPlaybookAdmin && (
              <Banner closeButton={false}>プレイブックの編集はプレイブック管理者のみ可能です。</Banner>
            )}
            <Tab.Group onChange={handleTabChange} defaultIndex={activeTabIndex}>
              <Tab.List>
                <Tab>プレイブック</Tab>
                <Tab>自社ひな形プレイブック</Tab>
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel>
                  <PlaybookListHeader
                    isListOpen={isThirdPartyListOpen}
                    onToggleList={() => setIsThirdPartyListOpen(!isThirdPartyListOpen)}
                    onOpenAddDialog={handleOpenAddDialog}
                    showAddButton={isPlaybookAdmin}
                  />
                  <ThirdPartyPlaybookList
                    playbooks={MOCK_THIRD_PARTY_PLAYBOOKS}
                    selectedAlertId={paneState.type === "thirdParty" ? paneState.alertId : null}
                    onSelectAlert={handleSelectThirdPartyAlert}
                    onEditPlaybook={handleEditPlaybook}
                    onCopyPlaybook={handleCopyPlaybook}
                    isOpen={isThirdPartyListOpen}
                  />
                </Tab.Panel>
                <Tab.Panel>
                  <PlaybookListHeader
                    isListOpen={isFirstPartyListOpen}
                    onToggleList={() => setIsFirstPartyListOpen(!isFirstPartyListOpen)}
                    onOpenAddDialog={handleOpenAddDialog}
                    showAddButton={isPlaybookAdmin}
                  />
                  <FirstPartyPlaybookList
                    playbooks={MOCK_FIRST_PARTY_PLAYBOOKS}
                    selectedAlertId={paneState.type === "firstParty" ? paneState.alertId : null}
                    onSelectAlert={handleSelectFirstPartyAlert}
                    onEditPlaybook={handleEditPlaybook}
                    onCopyPlaybook={handleCopyPlaybook}
                    isOpen={isFirstPartyListOpen}
                  />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </PageLayoutBody>
        </PageLayoutContent>
        {showPane && (
          <PageLayoutPane position="end" width="large" resizable>
            {paneState.type === "thirdParty" && selectedThirdPartyPlaybook && selectedThirdPartyAlert && (
              <ThirdPartyAlertDetailPane
                playbook={selectedThirdPartyPlaybook}
                alert={selectedThirdPartyAlert}
                onClose={handleClosePane}
                onEdit={handleEdit}
              />
            )}
            {paneState.type === "firstParty" && selectedFirstPartyPlaybook && selectedFirstPartyAlert && (
              <FirstPartyAlertDetailPane
                playbook={selectedFirstPartyPlaybook}
                alert={selectedFirstPartyAlert}
                onClose={handleClosePane}
                onEdit={handleEdit}
              />
            )}
          </PageLayoutPane>
        )}
      </PageLayout>
    </LocSidebarLayout>
  );
};

export default MyPlaybookTemplate;
