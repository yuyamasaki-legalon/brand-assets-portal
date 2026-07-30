var e=`import {
  LfAngleDown,
  LfArrowUpRightFromSquare,
  LfCheckCircle,
  LfCloudUpload,
  LfEllipsisDot,
} from "@legalforce/aegis-icons";
import { ActionList, Button, ButtonGroup, Icon, IconButton, Menu, Tab, Text, Tooltip } from "@legalforce/aegis-react";

export type WordAddinTab = "review" | "assistant" | "search" | "contracts";

const tabs: ReadonlyArray<{ id: WordAddinTab; label: string }> = [
  { id: "review", label: "レビュー" },
  { id: "assistant", label: "アシスタント" },
  { id: "search", label: "条文検索" },
  { id: "contracts", label: "契約書" },
];

type Props = {
  activeTab: WordAddinTab;
  onTabChange: (tab: WordAddinTab) => void;
  saved?: boolean;
  hasBeenUpToDate?: boolean;
  savedAt?: string;
};

export const WordAddinTabNavigation = ({
  activeTab,
  onTabChange,
  saved = false,
  hasBeenUpToDate = false,
  savedAt,
}: Props) => {
  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.id === activeTab),
  );

  const statusLabel = saved
    ? savedAt
      ? \`\${savedAt}に保存しました\`
      : "LegalOnに保存済みです"
    : hasBeenUpToDate
      ? "まだLegalOnに保存されていない更新があります"
      : "まだLegalOnに保存されていません";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        borderBlockEnd: "1px solid var(--aegis-color-border-default)",
        backgroundColor: "var(--aegis-color-background-default)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--aegis-space-small)",
          minBlockSize: "44px",
          padding: "var(--aegis-space-xSmall) var(--aegis-space-medium)",
        }}
      >
        <Text
          as="span"
          variant="body.small"
          color={saved ? "success" : "subtle"}
          style={{ display: "inline-flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}
        >
          <Icon size="small">{saved ? <LfCheckCircle /> : <LfCloudUpload />}</Icon>
          {statusLabel}
        </Text>
        <Tooltip title={saved ? "LegalOnに保存済みです" : "契約書をアップロード"}>
          <Text as="span" style={{ display: "inline-flex" }}>
            <ButtonGroup>
              <Button size="small" variant="solid" disabled={saved}>
                保存
              </Button>
              <Menu placement="bottom-end">
                <Menu.Anchor>
                  <IconButton size="small" variant="solid" aria-label="保存オプション" disabled={saved}>
                    <Icon>
                      <LfAngleDown />
                    </Icon>
                  </IconButton>
                </Menu.Anchor>
                <Menu.Box width="small">
                  <ActionList size="large">
                    <ActionList.Group>
                      <ActionList.Item>
                        <ActionList.Body>LegalOnに新規ファイルとして保存</ActionList.Body>
                      </ActionList.Item>
                    </ActionList.Group>
                  </ActionList>
                </Menu.Box>
              </Menu>
            </ButtonGroup>
          </Text>
        </Tooltip>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--aegis-space-xSmall)",
          paddingInline: "var(--aegis-space-small)",
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <Tab.Group index={activeIndex} onChange={(index) => onTabChange(tabs[index]?.id ?? "review")}>
            <Tab.List bordered={false}>
              {tabs.map((tab) => (
                <Tab key={tab.id}>{tab.label}</Tab>
              ))}
            </Tab.List>
          </Tab.Group>
        </div>
        <Menu placement="bottom-end">
          <Menu.Anchor>
            <Tooltip title="その他のメニュー">
              <IconButton aria-label="その他のメニュー" variant="plain">
                <Icon>
                  <LfEllipsisDot />
                </Icon>
              </IconButton>
            </Tooltip>
          </Menu.Anchor>
          <Menu.Box width="small">
            <ActionList size="large">
              <ActionList.Group>
                <ActionList.Item>
                  <ActionList.Body
                    trailing={
                      <Icon>
                        <LfArrowUpRightFromSquare />
                      </Icon>
                    }
                  >
                    LegalOn
                  </ActionList.Body>
                </ActionList.Item>
                <ActionList.Item>
                  <ActionList.Body
                    trailing={
                      <Icon>
                        <LfArrowUpRightFromSquare />
                      </Icon>
                    }
                  >
                    ヘルプページ
                  </ActionList.Body>
                </ActionList.Item>
                <ActionList.Item>
                  <ActionList.Body
                    trailing={
                      <Icon>
                        <LfArrowUpRightFromSquare />
                      </Icon>
                    }
                  >
                    ステータスサイト
                  </ActionList.Body>
                </ActionList.Item>
              </ActionList.Group>
              <ActionList.Group>
                <ActionList.Item>
                  <ActionList.Body>ログアウト</ActionList.Body>
                </ActionList.Item>
              </ActionList.Group>
            </ActionList>
          </Menu.Box>
        </Menu>
      </div>
    </div>
  );
};
`;export{e as default};