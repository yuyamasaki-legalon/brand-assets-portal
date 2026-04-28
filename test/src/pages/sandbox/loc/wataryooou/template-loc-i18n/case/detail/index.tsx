import {
  LfAngleLeftMiddle,
  LfArchive,
  LfBarSparkles,
  LfBook,
  LfComments,
  LfEllipsisDot,
  LfFile,
  LfInformationCircle,
  LfMagnifyingGlass,
  LfMail,
  LfMenu,
  LfScaleBalanced,
} from "@legalforce/aegis-icons";
import { SlackLogo } from "@legalforce/aegis-logos/react";
import {
  Button,
  ContentHeader,
  Divider,
  Header,
  Icon,
  IconButton,
  Logo,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  PageLayoutSidebar,
  SideNavigation,
  Tab,
  Tag,
  TagGroup,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";
import { type CSSProperties, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../../../../../../hooks";
import { type TranslationKey, translations } from "./data/translations";

type PaneType = "case-attribute" | "case-summary" | "linked-file" | "linked-case" | "reference" | "book";

const caseData = {
  id: "2024-03-0020",
  title: "業務委託契約書のレビュー依頼",
  overview:
    "新規取引先との業務委託契約書について、リスク条項の確認をお願いします。特に損害賠償の上限条項と秘密保持義務の範囲についてご確認いただきたいです。",
};

const keywords = ["業務委託", "契約書レビュー", "リスク確認", "秘密保持", "損害賠償", "契約期間"];

const inlineStyles: Record<string, CSSProperties> = {
  pageBody: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-large)",
  },
  card: {
    padding: "var(--aegis-space-large)",
    backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
    borderRadius: "var(--aegis-radius-large)",
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-large)",
  },
  keywordSection: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-xxSmall)",
  },
  keywordHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "var(--aegis-space-small)",
  },
  tabContainer: {
    marginBlockStart: "var(--aegis-space-medium)",
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-large)",
  },
};

export const CaseDetailPage = () => {
  const { t } = useTranslation<TranslationKey>(translations);
  const navigate = useNavigate();
  const [paneType, setPaneType] = useState<PaneType>("case-attribute");
  const [paneOpen, setPaneOpen] = useState(true);

  const currentPane = paneOpen ? paneType : undefined;

  const handleSelectPane = (nextPane: PaneType) => {
    setPaneType(nextPane);
    setPaneOpen(true);
  };

  const PaneHeader = ({ title }: { title: string }) => (
    <PageLayoutHeader>
      <ContentHeader
        size="small"
        trailing={
          <Tooltip title={t("close")} placement="top">
            <IconButton variant="plain" size="small" aria-label={t("close")} onClick={() => setPaneOpen(false)}>
              <Icon>
                <LfAngleLeftMiddle />
              </Icon>
            </IconButton>
          </Tooltip>
        }
      >
        <ContentHeader.Title>
          <Text variant="title.small">{title}</Text>
        </ContentHeader.Title>
      </ContentHeader>
    </PageLayoutHeader>
  );

  return (
    <>
      <Header>
        <Header.Item>
          <Tooltip title="menu">
            <IconButton variant="plain" aria-label="menu">
              <Icon>
                <LfMenu />
              </Icon>
            </IconButton>
          </Tooltip>
          <Divider orientation="vertical" />
          <Tooltip title={t("back")}>
            <IconButton
              variant="plain"
              aria-label={t("back")}
              onClick={() => navigate("/sandbox/loc/wataryooou/template-loc-i18n/case")}
            >
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
          <Tooltip title={t("search")}>
            <IconButton variant="plain" aria-label={t("search")}>
              <Icon>
                <LfMagnifyingGlass />
              </Icon>
            </IconButton>
          </Tooltip>
          <Tooltip title={t("more")}>
            <IconButton variant="plain" aria-label={t("more")}>
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
            <div style={inlineStyles.pageBody}>
              <section style={inlineStyles.card}>
                <ContentHeader
                  size="small"
                  trailing={
                    <Button variant="subtle" size="small">
                      {t("edit")}
                    </Button>
                  }
                >
                  <ContentHeader.Description variant="data">{caseData.id}</ContentHeader.Description>
                  <ContentHeader.Title>{caseData.title}</ContentHeader.Title>
                </ContentHeader>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                  <Text as="h4" variant="title.xxSmall">
                    {t("caseOverview")}
                  </Text>
                  <Text variant="component.medium" whiteSpace="pre-wrap">
                    {caseData.overview}
                  </Text>
                </div>
              </section>

              <section style={inlineStyles.keywordSection}>
                <div style={inlineStyles.keywordHeader}>
                  <Text as="h4" variant="label.medium.bold">
                    {t("caseKeywords")}
                  </Text>
                  <Button variant="gutterless" size="small" weight="normal">
                    {t("searchLaws")}
                  </Button>
                </div>
                <TagGroup>
                  {keywords.map((keyword) => (
                    <Tag key={keyword} variant="fill" color="neutral">
                      {keyword}
                    </Tag>
                  ))}
                </TagGroup>
              </section>

              <section style={inlineStyles.tabContainer}>
                <Tab.Group size="large">
                  <Tab.List>
                    <Tab
                      leading={
                        <Icon size="medium">
                          <LfComments />
                        </Icon>
                      }
                      width="full"
                    >
                      {t("timeline")}
                    </Tab>
                    <Tab leading={<Logo source={SlackLogo} size="medium" />} width="full">
                      {t("slack")}
                    </Tab>
                    <Tab
                      leading={
                        <Icon size="medium">
                          <LfMail />
                        </Icon>
                      }
                      width="full"
                    >
                      {t("email")}
                    </Tab>
                  </Tab.List>
                  <Tab.Panels>
                    <Tab.Panel>
                      <Text color="subtle">{t("timeline")} content placeholder</Text>
                    </Tab.Panel>
                    <Tab.Panel>
                      <Text color="subtle">{t("slack")} content placeholder</Text>
                    </Tab.Panel>
                    <Tab.Panel>
                      <Text color="subtle">{t("email")} content placeholder</Text>
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </section>
            </div>
          </PageLayoutBody>
        </PageLayoutContent>

        <PageLayoutPane position="end" width="large" resizable open={paneOpen}>
          <PaneHeader
            title={t(
              paneType === "case-attribute"
                ? "caseInfo"
                : paneType === "case-summary"
                  ? "caseSummary"
                  : paneType === "linked-file"
                    ? "relatedFiles"
                    : paneType === "linked-case"
                      ? "relatedCases"
                      : paneType === "reference"
                        ? "reference"
                        : "materials",
            )}
          />
          <PageLayoutBody>
            <Text color="subtle">Pane content placeholder</Text>
          </PageLayoutBody>
        </PageLayoutPane>

        <PageLayoutSidebar position="end">
          <SideNavigation>
            <SideNavigation.Group>
              <SideNavigation.Item
                icon={LfInformationCircle}
                onClick={() => handleSelectPane("case-attribute")}
                aria-current={currentPane === "case-attribute" ? true : undefined}
              >
                {t("caseInfo")}
              </SideNavigation.Item>
              <SideNavigation.Item
                icon={LfBarSparkles}
                onClick={() => handleSelectPane("case-summary")}
                aria-current={currentPane === "case-summary" ? true : undefined}
              >
                {t("caseSummary")}
              </SideNavigation.Item>
              <SideNavigation.Item
                icon={LfFile}
                onClick={() => handleSelectPane("linked-file")}
                aria-current={currentPane === "linked-file" ? true : undefined}
              >
                {t("relatedFiles")}
              </SideNavigation.Item>
              <SideNavigation.Item
                icon={LfArchive}
                onClick={() => handleSelectPane("linked-case")}
                aria-current={currentPane === "linked-case" ? true : undefined}
              >
                {t("relatedCases")}
              </SideNavigation.Item>
            </SideNavigation.Group>
            <SideNavigation.Group>
              <SideNavigation.Item
                icon={LfScaleBalanced}
                onClick={() => handleSelectPane("reference")}
                aria-current={currentPane === "reference" ? true : undefined}
              >
                {t("reference")}
              </SideNavigation.Item>
              <SideNavigation.Item
                icon={LfBook}
                onClick={() => handleSelectPane("book")}
                aria-current={currentPane === "book" ? true : undefined}
              >
                {t("materials")}
              </SideNavigation.Item>
            </SideNavigation.Group>
          </SideNavigation>
        </PageLayoutSidebar>
      </PageLayout>
    </>
  );
};

export default CaseDetailPage;
