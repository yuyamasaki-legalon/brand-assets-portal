import {
  LfArrowDownFromLine,
  LfClipboardList,
  LfCopy,
  LfEllipsisDot,
  LfGripDotVertical,
  LfPen,
  LfPlusLarge,
  LfTrash,
} from "@legalforce/aegis-icons";
import { Accordion, ActionList, Icon, IconButton, Menu, Text, Tooltip } from "@legalforce/aegis-react";
import type { FirstPartyPlaybook, Playbook } from "../mock/data";
import { FirstPartyAlertList } from "./FirstPartyAlertList";
import { ThirdPartyAlertList } from "./ThirdPartyAlertList";

interface ThirdPartyPlaybookListProps {
  playbooks: Playbook[];
  selectedAlertId: string | null;
  onSelectAlert: (playbookId: string, alertId: string) => void;
  onEditPlaybook: (playbookId: string) => void;
  onCopyPlaybook: (playbookId: string) => void;
  isOpen: boolean;
}

export const ThirdPartyPlaybookList = ({
  playbooks,
  selectedAlertId,
  onSelectAlert,
  onEditPlaybook,
  onCopyPlaybook,
  isOpen,
}: ThirdPartyPlaybookListProps) => {
  if (playbooks.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "var(--aegis-space-xLarge)",
        }}
      >
        <Text color="subtle">プレイブックがありません</Text>
      </div>
    );
  }

  return (
    <Accordion multiple defaultIndex={isOpen ? playbooks.map((_, i) => i) : []}>
      {playbooks.map((playbook) => (
        <PlaybookAccordionItem
          key={playbook.playbookSummary.playbookId}
          playbookName={playbook.playbookSummary.playbookName}
          onEdit={() => onEditPlaybook(playbook.playbookSummary.playbookId)}
          onCopy={() => onCopyPlaybook(playbook.playbookSummary.playbookId)}
        >
          <ThirdPartyAlertList
            alerts={playbook.playbookAlerts}
            selectedAlertId={selectedAlertId}
            onSelectAlert={(alertId) => onSelectAlert(playbook.playbookSummary.playbookId, alertId)}
          />
        </PlaybookAccordionItem>
      ))}
    </Accordion>
  );
};

interface FirstPartyPlaybookListProps {
  playbooks: FirstPartyPlaybook[];
  selectedAlertId: string | null;
  onSelectAlert: (playbookId: string, alertId: string) => void;
  onEditPlaybook: (playbookId: string) => void;
  onCopyPlaybook: (playbookId: string) => void;
  isOpen: boolean;
}

export const FirstPartyPlaybookList = ({
  playbooks,
  selectedAlertId,
  onSelectAlert,
  onEditPlaybook,
  onCopyPlaybook,
  isOpen,
}: FirstPartyPlaybookListProps) => {
  if (playbooks.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "var(--aegis-space-xLarge)",
        }}
      >
        <Text color="subtle">プレイブックがありません</Text>
      </div>
    );
  }

  return (
    <Accordion multiple defaultIndex={isOpen ? playbooks.map((_, i) => i) : []}>
      {playbooks.map((playbook) => (
        <PlaybookAccordionItem
          key={playbook.playbookSummary.playbookId}
          playbookName={playbook.playbookSummary.playbookName}
          onEdit={() => onEditPlaybook(playbook.playbookSummary.playbookId)}
          onCopy={() => onCopyPlaybook(playbook.playbookSummary.playbookId)}
        >
          <FirstPartyAlertList
            alerts={playbook.firstPartyPlaybookAlerts}
            selectedAlertId={selectedAlertId}
            onSelectAlert={(alertId) => onSelectAlert(playbook.playbookSummary.playbookId, alertId)}
          />
        </PlaybookAccordionItem>
      ))}
    </Accordion>
  );
};

interface PlaybookAccordionItemProps {
  playbookName: string;
  onEdit: () => void;
  onCopy: () => void;
  children: React.ReactNode;
}

const PlaybookAccordionItem = ({ playbookName, onEdit, onCopy, children }: PlaybookAccordionItemProps) => {
  const handleAddCheckpoint = () => {
    // ロジックは不要なのでモック実装のみ
  };

  const handleExport = () => {
    // ロジックは不要なのでモック実装のみ
  };

  const handleCheckItems = () => {
    // ロジックは不要なのでモック実装のみ
  };

  const handleDelete = () => {
    // ロジックは不要なのでモック実装のみ
  };

  return (
    <Accordion.Item>
      <Accordion.Button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--aegis-space-small)",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-small)", minWidth: 0 }}>
            <Icon size="small" color="subtle">
              <LfGripDotVertical />
            </Icon>
            <Text variant="body.medium.bold" numberOfLines={1}>
              {playbookName}
            </Text>
          </div>
          {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: stopPropagation prevents accordion toggle */}
          <fieldset
            aria-label="アクション"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--aegis-space-xxSmall)",
              border: "none",
              padding: 0,
              margin: 0,
            }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <Menu placement="bottom-end">
              <Menu.Anchor>
                <Tooltip title="その他">
                  <IconButton
                    aria-label="その他のオプション"
                    icon={LfEllipsisDot}
                    variant="plain"
                    size="small"
                    onClick={(e) => e.stopPropagation()}
                  />
                </Tooltip>
              </Menu.Anchor>
              <Menu.Box>
                <ActionList size="large">
                  <ActionList.Group>
                    <ActionList.Item onClick={onEdit}>
                      <ActionList.Body leading={LfPen}>編集</ActionList.Body>
                    </ActionList.Item>
                    <ActionList.Item onClick={onCopy}>
                      <ActionList.Body leading={LfCopy}>コピー</ActionList.Body>
                    </ActionList.Item>
                    <ActionList.Item onClick={handleCheckItems}>
                      <ActionList.Body leading={LfClipboardList}>確認事項</ActionList.Body>
                    </ActionList.Item>
                    <ActionList.Item onClick={handleExport}>
                      <ActionList.Body leading={LfArrowDownFromLine}>エクスポート</ActionList.Body>
                    </ActionList.Item>
                  </ActionList.Group>
                  <ActionList.Group>
                    <ActionList.Item onClick={handleDelete}>
                      <ActionList.Body leading={LfTrash}>削除</ActionList.Body>
                    </ActionList.Item>
                  </ActionList.Group>
                </ActionList>
              </Menu.Box>
            </Menu>
            <Tooltip title="チェックポイントを追加">
              <IconButton
                aria-label="チェックポイントを追加"
                icon={LfPlusLarge}
                variant="plain"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddCheckpoint();
                }}
              />
            </Tooltip>
          </fieldset>
        </div>
      </Accordion.Button>
      <Accordion.Panel>{children}</Accordion.Panel>
    </Accordion.Item>
  );
};
