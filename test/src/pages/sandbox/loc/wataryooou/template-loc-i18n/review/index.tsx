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
import { useTranslation } from "../../../../../../hooks";
import { type TranslationKey, translations } from "./data/translations";
import type { CheckpointStatus, Severity } from "./mock/data";
import { MOCK_ALERT_COUNTS, MOCK_PLAYBOOKS } from "./mock/data";

type SeverityFilter = Severity | "all";
type ReviewTab = "risk" | "compliance";

export const ReviewPage = () => {
  const { t } = useTranslation<TranslationKey>(translations);
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
              <SegmentedControl.Button>{t("contractRisk")}</SegmentedControl.Button>
              <SegmentedControl.Button>{t("compliance")}</SegmentedControl.Button>
            </SegmentedControl>
          </div>
        }
      >
        <Header.Item>
          <Tooltip title={t("back")}>
            <IconButton aria-label={t("back")}>
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
              {t("ndaTitle")}.pdf
            </Text>
            <Text variant="caption.small">{t("ndaVersion")}</Text>
          </div>
        </Header.Item>
        <Header.Spacer />
        <Header.Item>
          <ButtonGroup>
            <Tooltip title={t("search")}>
              <IconButton aria-label={t("search")}>
                <Icon>
                  <LfMagnifyingGlass />
                </Icon>
              </IconButton>
            </Tooltip>
            <Tooltip title={t("settings")}>
              <IconButton aria-label={t("settings")}>
                <Icon>
                  <LfSetting />
                </Icon>
              </IconButton>
            </Tooltip>
            <Tooltip title={t("more")}>
              <IconButton aria-label={t("more")}>
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
                {t("edit")}
              </Button>
            </Menu.Anchor>
            <Menu.Box>
              <ActionList size="large">
                <ActionList.Group>
                  <ActionList.Item>
                    <ActionList.Body>{t("editFile")}</ActionList.Body>
                  </ActionList.Item>
                  <ActionList.Item>
                    <ActionList.Body>{t("addComment")}</ActionList.Body>
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
                    minHeight: "600px",
                  }}
                >
                  <div style={{ textAlign: "center", marginBottom: "var(--aegis-space-xLarge)" }}>
                    <Text variant="title.medium">{t("ndaTitle")}</Text>
                  </div>
                  <Text variant="body.medium" color="subtle">
                    株式会社●●（以下「甲」という。）と株式会社 LegalForce（以下「乙」という。）は、甲
                    乙間において、次のとおり契約（以下「本契約」という。）を締結する。
                  </Text>
                  <div style={{ marginTop: "var(--aegis-space-large)" }}>
                    <Text variant="body.medium" style={{ fontWeight: "bold" }}>
                      {t("article1Title")}
                    </Text>
                    <Text variant="body.medium" color="subtle">
                      {t("article1Content")}
                    </Text>
                  </div>
                  <div style={{ marginTop: "var(--aegis-space-large)" }}>
                    <Text variant="body.medium" style={{ fontWeight: "bold" }}>
                      {t("article2Title")}
                    </Text>
                    <Text variant="body.medium" color="subtle">
                      {t("article2Content")}
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
              <Text variant="title.small">{t("riskCheck")}</Text>

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
                  {t("reviewSettings")}
                </Button>
                <div style={{ marginLeft: "auto", display: "flex", gap: "var(--aegis-space-xxSmall)" }}>
                  <Tooltip title={t("filter")}>
                    <IconButton aria-label={t("filter")} variant="plain">
                      <Icon>
                        <LfFilter />
                      </Icon>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t("download")}>
                    <IconButton aria-label={t("download")} variant="plain">
                      <Icon>
                        <LfDownload />
                      </Icon>
                    </IconButton>
                  </Tooltip>
                </div>
              </div>

              {/* Loading Banner */}
              <Banner color="information" closeButton={false}>
                {t("loading")}
              </Banner>

              {/* Playbook Section */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-medium)",
                }}
              >
                <Text variant="title.xSmall">{t("playbook")}</Text>

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
                  {t("checkpointTips")}
                </Button>

                {/* Severity Filter */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--aegis-space-small)",
                  }}
                >
                  <Text variant="label.small">{t("severity")}</Text>
                  <ButtonGroup size="small">
                    <Button
                      variant={severityFilter === "low" ? "solid" : "subtle"}
                      onClick={() => setSeverityFilter(severityFilter === "low" ? "all" : "low")}
                    >
                      {t("severityLow")} {MOCK_ALERT_COUNTS.low}
                    </Button>
                    <Button
                      variant={severityFilter === "medium" ? "solid" : "subtle"}
                      onClick={() => setSeverityFilter(severityFilter === "medium" ? "all" : "medium")}
                    >
                      {t("severityMedium")} {MOCK_ALERT_COUNTS.medium}
                    </Button>
                    <Button
                      variant="solid"
                      color="danger"
                      onClick={() => setSeverityFilter(severityFilter === "high" ? "all" : "high")}
                    >
                      {t("severityHigh")} {MOCK_ALERT_COUNTS.high}
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
                      <Tooltip title={t("edit")}>
                        <IconButton aria-label={t("edit")} variant="plain" size="small">
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
                                {t("showDetails")}
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

export default ReviewPage;
