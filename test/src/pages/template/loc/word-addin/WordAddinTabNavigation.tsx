import { LfArrowUpRightFromSquare, LfCheckCircle, LfCloudUpload, LfEllipsisDot } from "@legalforce/aegis-icons";
import { ActionList, Button, Icon, IconButton, Menu, Tab, Text, Tooltip } from "@legalforce/aegis-react";

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
};

export const WordAddinTabNavigation = ({ activeTab, onTabChange, saved = false }: Props) => {
  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.id === activeTab),
  );

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
          {saved ? "保存済み" : "未保存の変更があります"}
        </Text>
        <Tooltip title={saved ? "保存済みです" : "現在の契約書を保存"}>
          <Text as="span" style={{ display: "inline-flex" }}>
            <Button size="small" variant="solid" disabled={saved}>
              保存
            </Button>
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
