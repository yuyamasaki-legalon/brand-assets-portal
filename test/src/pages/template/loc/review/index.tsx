import {
  LfAngleDown,
  LfAngleLeft,
  LfBar,
  LfCheckLarge,
  LfCloseLarge,
  LfDownload,
  LfEllipsisDotVertical,
  LfFilter,
  LfLightBulb,
  LfMagnifyingGlass,
  LfPen,
  LfSetting,
} from "@legalforce/aegis-icons";
import {
  ActionList,
  Banner,
  Button,
  ButtonGroup,
  Header,
  Icon,
  IconButton,
  Menu,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutPane,
  ProgressCircle,
  SegmentedControl,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";
import { useState } from "react";
import type { CheckpointStatus, Severity } from "./mock/data";
import { MOCK_ALERT_COUNTS, MOCK_PLAYBOOKS } from "./mock/data";

type SeverityFilter = Severity | "all";
type ReviewTab = "risk" | "compliance";

const ReviewTemplate = () => {
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");
  const [activeTab, setActiveTab] = useState<ReviewTab>("risk");

  const getStatusIcon = (status: CheckpointStatus) => {
    switch (status) {
      case "analyzing":
        return <ProgressCircle size="small" />;
      case "met":
        return (
          <Icon color="success" size="xSmall">
            <LfCheckLarge />
          </Icon>
        );
      case "unmet":
        return (
          <Icon color="danger" size="xSmall">
            <LfCloseLarge />
          </Icon>
        );
    }
  };

  const filteredCheckpoints = MOCK_PLAYBOOKS[0].checkpoints.filter((cp) => {
    if (severityFilter === "all") return true;
    return cp.severity === severityFilter;
  });

  return (
    <>
      <Header
        sub={
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "var(--aegis-space-xSmall)" }}>
            <SegmentedControl
              index={activeTab === "risk" ? 0 : 1}
              onChange={(index) => setActiveTab(index === 0 ? "risk" : "compliance")}
            >
              <SegmentedControl.Button>契約リスク</SegmentedControl.Button>
              <SegmentedControl.Button>法令遵守</SegmentedControl.Button>
            </SegmentedControl>
          </div>
        }
      >
        <Header.Item>
          <Tooltip title="戻る">
            <IconButton aria-label="戻る">
              <Icon>
                <LfAngleLeft />
              </Icon>
            </IconButton>
          </Tooltip>
        </Header.Item>
        <Header.Item>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--aegis-space-xxSmall)",
              alignItems: "flex-start",
            }}
          >
            <Text as="h1" variant="title.xxSmall" numberOfLines={1}>
              秘密保持契約書.pdf
            </Text>
            <Text variant="caption.small">v.1</Text>
          </div>
        </Header.Item>
        <Header.Spacer />
        <Header.Item>
          <ButtonGroup>
            <Tooltip title="検索">
              <IconButton aria-label="検索">
                <Icon>
                  <LfMagnifyingGlass />
                </Icon>
              </IconButton>
            </Tooltip>
            <Tooltip title="設定">
              <IconButton aria-label="設定">
                <Icon>
                  <LfSetting />
                </Icon>
              </IconButton>
            </Tooltip>
            <Tooltip title="その他">
              <IconButton aria-label="その他">
                <Icon>
                  <LfEllipsisDotVertical />
                </Icon>
              </IconButton>
            </Tooltip>
          </ButtonGroup>
        </Header.Item>
        <Header.Item>
          <Menu placement="bottom-end">
            <Menu.Anchor>
              <Button
                variant="solid"
                leading={
                  <Icon>
                    <LfPen />
                  </Icon>
                }
                trailing={
                  <Icon>
                    <LfAngleDown />
                  </Icon>
                }
              >
                編集
              </Button>
            </Menu.Anchor>
            <Menu.Box>
              <ActionList size="large">
                <ActionList.Group>
                  <ActionList.Item>
                    <ActionList.Body>ファイルを編集</ActionList.Body>
                  </ActionList.Item>
                  <ActionList.Item>
                    <ActionList.Body>コメントを追加</ActionList.Body>
                  </ActionList.Item>
                </ActionList.Group>
              </ActionList>
            </Menu.Box>
          </Menu>
        </Header.Item>
      </Header>
      <PageLayout variant="fill">
        <PageLayoutContent>
          <PageLayoutBody>
            {/* PDF Placeholder */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
              }}
            >
              {/* PDF Content Placeholder */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "var(--aegis-space-large)",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    maxWidth: "var(--aegis-layout-width-large)",
                    backgroundColor: "var(--aegis-color-background-default)",
                    borderRadius: "var(--aegis-radius-medium)",
                    border: "1px solid var(--aegis-color-border-default)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    padding: "var(--aegis-space-xLarge)",
                    minHeight: "var(--aegis-layout-width-small)",
                  }}
                >
                  <div style={{ textAlign: "center", marginBottom: "var(--aegis-space-xLarge)" }}>
                    <Text variant="title.medium">秘密保持契約</Text>
                  </div>
                  <Text variant="body.medium" color="subtle">
                    株式会社●●（以下「甲」という。）と株式会社 LegalForce（以下「乙」という。）は、甲
                    乙間において、次のとおり契約（以下「本契約」という。）を締結する。
                  </Text>
                  <div style={{ marginTop: "var(--aegis-space-large)" }}>
                    <Text variant="body.medium" style={{ fontWeight: "bold" }}>
                      第１条（目的）
                    </Text>
                    <Text variant="body.medium" color="subtle">
                      甲及び乙は、甲乙間の業務提携（以下「本件取引」という。）の可能性を検討することを
                      目的（以下「本目的」という。）として、本契約を締結する（以下、情報を開示提供した
                      当事者を「開示者」、情報の開示提供を受けた当事者を「受領者」という。）。
                    </Text>
                  </div>
                  <div style={{ marginTop: "var(--aegis-space-large)" }}>
                    <Text variant="body.medium" style={{ fontWeight: "bold" }}>
                      第２条（秘密情報の定義）
                    </Text>
                    <Text variant="body.medium" color="subtle">
                      1. 本契約において秘密情報とは、文書、口頭、電磁的記録媒体その他開示の方法及び媒体
                      並びに本契約締結の前後を問わず、甲又は乙が開示した技術、開発、製品、営業、人事、
                      財務、組織、計画、ノウハウその他の事項に関する一切の情報、本契約の存在及び内容、
                      並びに本件取引に関する協議・交渉の存在及び内容をいう。
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </PageLayoutBody>
        </PageLayoutContent>

        <PageLayoutPane position="end" width="large" resizable scrollBehavior="inside">
          <PageLayoutBody>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-medium)",
              }}
            >
              {/* Title */}
              <Text variant="title.small">契約リスクチェック</Text>

              {/* Toolbar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--aegis-space-small)",
                }}
              >
                <Button
                  variant="subtle"
                  leading={
                    <Icon>
                      <LfSetting />
                    </Icon>
                  }
                >
                  レビュー設定
                </Button>
                <div style={{ marginLeft: "auto", display: "flex", gap: "var(--aegis-space-xxSmall)" }}>
                  <Tooltip title="フィルター">
                    <IconButton aria-label="フィルター" variant="plain">
                      <Icon>
                        <LfFilter />
                      </Icon>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="ダウンロード">
                    <IconButton aria-label="ダウンロード" variant="plain">
                      <Icon>
                        <LfDownload />
                      </Icon>
                    </IconButton>
                  </Tooltip>
                </div>
              </div>

              {/* Loading Banner */}
              <Banner color="information" closeButton={false}>
                追加のアラートを読み込んでいます...
              </Banner>

              {/* Playbook Section */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-medium)",
                }}
              >
                <Text variant="title.xSmall">プレイブック</Text>

                {/* Tips Link */}
                <Button
                  variant="plain"
                  size="small"
                  leading={
                    <Icon>
                      <LfLightBulb />
                    </Icon>
                  }
                >
                  チェックポイント作成のヒント
                </Button>

                {/* Severity Filter */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--aegis-space-small)",
                  }}
                >
                  <Text variant="label.small">重要度:</Text>
                  <ButtonGroup size="small">
                    <Button
                      variant={severityFilter === "low" ? "solid" : "subtle"}
                      onClick={() => setSeverityFilter(severityFilter === "low" ? "all" : "low")}
                    >
                      低 {MOCK_ALERT_COUNTS.low}
                    </Button>
                    <Button
                      variant={severityFilter === "medium" ? "solid" : "subtle"}
                      onClick={() => setSeverityFilter(severityFilter === "medium" ? "all" : "medium")}
                    >
                      中 {MOCK_ALERT_COUNTS.medium}
                    </Button>
                    <Button
                      variant="solid"
                      color="danger"
                      onClick={() => setSeverityFilter(severityFilter === "high" ? "all" : "high")}
                    >
                      高 {MOCK_ALERT_COUNTS.high}
                    </Button>
                  </ButtonGroup>
                </div>

                {/* Playbook Card */}
                {MOCK_PLAYBOOKS.map((playbook) => (
                  <div
                    key={playbook.id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--aegis-space-small)",
                    }}
                  >
                    {/* Playbook Header */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--aegis-space-small)",
                      }}
                    >
                      <Text variant="label.medium.bold" style={{ flex: 1 }}>
                        {playbook.name}
                      </Text>
                      <Tooltip title="編集">
                        <IconButton aria-label="編集" variant="plain" size="small">
                          <Icon>
                            <LfPen />
                          </Icon>
                        </IconButton>
                      </Tooltip>
                    </div>

                    {/* Checkpoint List */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {filteredCheckpoints.map((checkpoint) => (
                        <div
                          key={checkpoint.id}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--aegis-space-xSmall)",
                            padding: "var(--aegis-space-small) 0",
                            borderBottom: "1px solid var(--aegis-color-border-default)",
                            borderLeft: `2px solid ${
                              checkpoint.status === "met"
                                ? "var(--aegis-color-border-accent-teal-bold)"
                                : checkpoint.status === "unmet"
                                  ? "var(--aegis-color-border-accent-red-bold)"
                                  : "var(--aegis-color-border-neutral-bold)"
                            }`,
                            paddingLeft: "var(--aegis-space-small)",
                          }}
                        >
                          {/* アイコン */}
                          {getStatusIcon(checkpoint.status)}

                          {/* テキスト */}
                          <Text variant="body.medium">{checkpoint.instruction}</Text>
                          <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <button
                              type="button"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "var(--aegis-space-xxSmall)",
                                padding: "var(--aegis-space-x3Small) var(--aegis-space-xxSmall)",
                                background: "none",
                                border: "none",
                                borderBottom: "1px solid var(--aegis-color-border-default)",
                                cursor: "pointer",
                              }}
                            >
                              <Icon size="small" color="subtle">
                                <LfBar />
                              </Icon>
                              <Text variant="body.medium" color="subtle">
                                詳細を表示
                              </Text>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </PageLayoutBody>
        </PageLayoutPane>
      </PageLayout>
    </>
  );
};

export default ReviewTemplate;
