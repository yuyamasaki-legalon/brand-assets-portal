import {
  LfAngleRightMiddle,
  LfArrowUpRightFromSquare,
  LfBook,
  LfCheckBook,
  LfCheckCircle,
  LfCloseLarge,
  LfEarth,
  LfFileSigned,
  LfFilesLine,
  LfInformationCircle,
  LfLayoutHorizon,
  LfMagnifyingGlass,
  LfPlusLarge,
  LfUpload,
  LfWriting,
} from "@legalforce/aegis-icons";
import {
  Badge,
  Banner,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardLink,
  ContentHeader,
  EmptyState,
  Icon,
  IconButton,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  PageLayoutStickyContainer,
  Tab,
  Tag,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";
import { type CSSProperties, type ReactNode, useState } from "react";
import { useTranslation } from "../../../../../../hooks";
import { LocSidebarLayout } from "../_shared";
import { type TranslationKey, translations } from "./data/translations";

type StatItem = {
  labelKey: TranslationKey;
  value: number | string;
  accent?: "danger";
};

type ShortcutItemColor = "orange" | "lime" | "indigo" | "default";

type ShortcutItem = {
  titleKey: TranslationKey;
  descriptionKey?: TranslationKey;
  icon: ReactNode;
  color?: ShortcutItemColor;
};

type ShortcutCategory = {
  headerKey: TranslationKey;
  items: ShortcutItem[];
};

const styles: Record<string, CSSProperties> = {
  mainContent: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-large)",
    alignItems: "stretch",
    width: "100%",
    maxWidth: "var(--aegis-layout-width-x3Large)",
    margin: "0 auto",
    padding: "var(--aegis-space-large) var(--aegis-space-2XLarge)",
  },
  leftContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-medium)",
    borderRadius: "var(--aegis-radius-large)",
  },
  statRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "var(--aegis-space-medium)",
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-large)",
    width: "100%",
    maxWidth: "var(--aegis-layout-width-x3Large)",
    margin: "0 auto",
  },
  legalonAssistant: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-xLarge)",
    alignItems: "center",
    paddingTop: "var(--aegis-space-xSmall)",
    paddingBottom: "var(--aegis-space-xLarge)",
  },
  legalonAssistantTitle: {
    textAlign: "center",
  },
  legalonAssistantFormWrapper: {
    width: "100%",
    maxWidth: "var(--aegis-layout-width-small)",
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-small)",
  },
  promptField: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-small)",
    width: "100%",
    padding: "var(--aegis-space-small)",
    borderRadius: "var(--aegis-radius-medium)",
    border: "1px solid var(--aegis-color-border-default)",
    backgroundColor: "var(--aegis-color-background-default)",
  },
  promptFieldRow: {
    display: "flex",
    alignItems: "center",
    gap: "var(--aegis-space-small)",
    width: "100%",
  },
  shortcutRoot: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-large)",
  },
  shortcutSection: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-xSmall)",
  },
  cardList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(256px, 1fr))",
    gap: "var(--aegis-space-xSmall)",
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minHeight: "var(--aegis-size-x5Large)",
  },
  cardIcon: {
    display: "inline-flex",
    padding: "var(--aegis-space-xxSmall)",
    borderRadius: "var(--aegis-radius-medium)",
  },
};

const iconBgColors: Record<ShortcutItemColor, string> = {
  orange: "var(--aegis-color-background-accent-orange-xSubtle)",
  lime: "var(--aegis-color-background-accent-lime-xSubtle)",
  indigo: "var(--aegis-color-background-accent-indigo-xSubtle)",
  default: "var(--aegis-color-background-neutral-xSubtle)",
};

const attentionStats: StatItem[] = [
  { labelKey: "unreadReplies", value: 21, accent: "danger" },
  { labelKey: "sealApprovalWaiting", value: 0 },
  { labelKey: "esignWaiting", value: 0 },
];

const progressStats: StatItem[] = [
  { labelKey: "inCharge", value: 70 },
  { labelKey: "days3", value: 0 },
  { labelKey: "today", value: 0 },
  { labelKey: "overdue", value: 25, accent: "danger" },
  { labelKey: "unassigned", value: 851 },
];

const myRequests: StatItem[] = [
  { labelKey: "sealApprovalWaiting", value: 0 },
  { labelKey: "esignWaiting", value: 0 },
];

const shortcutCategories: ShortcutCategory[] = [
  {
    headerKey: "reviewContracts",
    items: [
      {
        titleKey: "contractReview",
        descriptionKey: "contractReviewDescription",
        icon: <LfCheckCircle />,
        color: "orange",
      },
      {
        titleKey: "searchPastContracts",
        icon: <LfMagnifyingGlass />,
      },
      {
        titleKey: "editPlaybook",
        descriptionKey: "editPlaybookDescription",
        icon: <LfCheckBook />,
        color: "orange",
      },
    ],
  },
  {
    headerKey: "requestApply",
    items: [
      {
        titleKey: "contractApproval",
        icon: <LfWriting />,
        color: "indigo",
      },
      {
        titleKey: "sendEsign",
        icon: <LfWriting />,
        color: "indigo",
      },
    ],
  },
  {
    headerKey: "manageContracts",
    items: [
      {
        titleKey: "uploadConcluded",
        icon: <LfUpload />,
        color: "indigo",
      },
      {
        titleKey: "searchConcluded",
        icon: <LfFileSigned />,
        color: "indigo",
      },
    ],
  },
  {
    headerKey: "createContracts",
    items: [
      {
        titleKey: "companyTemplates",
        icon: <LfFilesLine />,
      },
      {
        titleKey: "legalonTemplates",
        icon: <LfFilesLine />,
        color: "lime",
      },
    ],
  },
];

export const DashboardPage = () => {
  const { t } = useTranslation<TranslationKey>(translations);
  const [summaryOpen, setSummaryOpen] = useState(true);

  return (
    <LocSidebarLayout activeId="home">
      <PageLayout>
        <PageLayoutPane
          position="start"
          variant="plain"
          resizable
          width="medium"
          minWidth="medium"
          maxWidth="large"
          open={summaryOpen}
          onOpenChange={setSummaryOpen}
          scrollBehavior="inside"
          style={{ borderRight: "1px solid var(--aegis-color-border-default)" }}
        >
          <PageLayoutHeader>
            <ContentHeader
              trailing={
                <Tooltip title={t("close")}>
                  <IconButton
                    aria-label={t("close")}
                    variant="plain"
                    size="small"
                    onClick={() => setSummaryOpen(false)}
                  >
                    <Icon>
                      <LfCloseLarge />
                    </Icon>
                  </IconButton>
                </Tooltip>
              }
            >
              <ContentHeader.Title>
                <Text variant="title.small">{t("pageTitle")}</Text>
              </ContentHeader.Title>
            </ContentHeader>
          </PageLayoutHeader>
          <PageLayoutBody>
            <div style={{ ...styles.leftContainer, padding: "var(--aegis-space-2XLarge)" }}>
              <Tab.Group variant="plain" index={0} size="large">
                <Tab.List bordered={false}>
                  <Tab>{t("summaryTab")}</Tab>
                  <Tab trailing={<Badge color="danger" count={1} />}>{t("activityTab")}</Tab>
                </Tab.List>
              </Tab.Group>

              <Text variant="label.medium.bold" color="danger">
                {t("attentionRequired")}
              </Text>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-small)",
                }}
              >
                <SectionCard
                  t={t}
                  titleKey="cases"
                  stats={attentionStats.slice(0, 1)}
                  secondaryTitleKey="applicationRequest"
                  secondary={attentionStats.slice(1)}
                />
                <SectionCard
                  t={t}
                  titleKey="cases"
                  stats={progressStats.slice(0, 1)}
                  secondaryTitleKey="dueDateOrder"
                  secondary={progressStats.slice(1, 4)}
                  footerTitleKey="unassigned"
                  footer={progressStats.slice(4)}
                />
                <SectionCard t={t} titleKey="myRequests" stats={myRequests} />
                <Card style={{ backgroundColor: "var(--aegis-color-background-default)" }}>
                  <CardHeader>
                    <Text variant="title.xSmall">{t("contractsNeedConfirmation")}</Text>
                  </CardHeader>
                  <CardBody>
                    <EmptyState
                      size="small"
                      title={t("noContractsNeedConfirmation")}
                      visual={
                        <Icon color="subtle">
                          <LfInformationCircle />
                        </Icon>
                      }
                    />
                  </CardBody>
                </Card>
              </div>
            </div>
          </PageLayoutBody>
        </PageLayoutPane>
        <PageLayoutContent align="start">
          <PageLayoutBody style={styles.mainContent}>
            {!summaryOpen ? (
              <PageLayoutStickyContainer>
                <div
                  style={{
                    display: "inline-block",
                    border: "1px solid var(--aegis-color-border-default)",
                    borderRadius: "var(--aegis-radius-medium)",
                    boxShadow: "var(--aegis-depth-low)",
                    padding: "var(--aegis-space-xxSmall)",
                  }}
                >
                  <Button
                    variant="plain"
                    leading={
                      <Icon>
                        <LfLayoutHorizon />
                      </Icon>
                    }
                    onClick={() => setSummaryOpen(true)}
                    style={{ alignSelf: "flex-start" }}
                  >
                    {t("openSummary")}
                  </Button>
                </div>
              </PageLayoutStickyContainer>
            ) : null}

            <div style={styles.rightColumn}>
              <Banner color="information">
                <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-small)", width: "100%" }}>
                  <Icon>
                    <LfInformationCircle />
                  </Icon>
                  <Text variant="body.small" style={{ flex: 1 }}>
                    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                  </Text>
                  <Icon color="subtle">
                    <LfArrowUpRightFromSquare />
                  </Icon>
                </div>
              </Banner>

              <div style={styles.legalonAssistant}>
                <div style={styles.legalonAssistantTitle}>
                  <Text variant="title.medium">{t("assistantTitle")}</Text>
                </div>
                <div style={styles.legalonAssistantFormWrapper}>
                  <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                    <Tag variant="outline" size="small" color="neutral" leading={<Icon source={LfBook} />}>
                      {t("promptLibrary")}
                    </Tag>
                  </div>
                  <div style={styles.promptField}>
                    <Text variant="body.medium" color="subtle">
                      {t("enterQuestion")}
                    </Text>
                    <div style={styles.promptFieldRow}>
                      <Icon color="subtle">
                        <LfPlusLarge />
                      </Icon>
                      <Tag variant="fill" color="neutral" size="small" leading={<Icon source={LfEarth} />}>
                        2{t("sources")}
                      </Tag>
                      <div style={{ flex: 1 }} />
                      <Tooltip title="Send prompt">
                        <IconButton aria-label="Send prompt" variant="plain" icon={LfAngleRightMiddle} />
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>

              <Tab.Group>
                <Tab.List bordered={false}>
                  <Tab>{t("shortcutsTab")}</Tab>
                  <Tab>{t("lawUpdatesTab")}</Tab>
                </Tab.List>
                <Tab.Panels>
                  <Tab.Panel>
                    <div style={styles.shortcutRoot}>
                      {shortcutCategories.map((category) => (
                        <ShortcutSection key={category.headerKey} headerName={t(category.headerKey)}>
                          <div style={styles.cardList}>
                            {category.items.map((item) => (
                              <Card key={item.titleKey} size="small">
                                <CardHeader
                                  leading={
                                    <IconWrapper color={item.color}>
                                      <Icon>{item.icon}</Icon>
                                    </IconWrapper>
                                  }
                                >
                                  <CardLink href="#">
                                    <Text as="span" style={styles.cardContent}>
                                      <Text variant="label.medium">{t(item.titleKey)}</Text>
                                      {item.descriptionKey ? (
                                        <Text variant="body.xSmall" color="subtle">
                                          {t(item.descriptionKey)}
                                        </Text>
                                      ) : null}
                                    </Text>
                                  </CardLink>
                                </CardHeader>
                              </Card>
                            ))}
                          </div>
                        </ShortcutSection>
                      ))}
                    </div>
                  </Tab.Panel>
                  <Tab.Panel>
                    <EmptyState
                      title={t("lawUpdatesEmpty")}
                      visual={
                        <Icon color="subtle">
                          <LfInformationCircle />
                        </Icon>
                      }
                    />
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          </PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>
    </LocSidebarLayout>
  );
};

export default DashboardPage;

type SectionCardProps = {
  t: (key: TranslationKey) => string;
  titleKey: TranslationKey;
  stats: StatItem[];
  secondary?: StatItem[];
  footer?: StatItem[];
  secondaryTitleKey?: TranslationKey;
  footerTitleKey?: TranslationKey;
};

const SectionCard = ({
  t,
  titleKey,
  stats,
  secondary,
  footer,
  secondaryTitleKey,
  footerTitleKey,
}: SectionCardProps) => {
  return (
    <Card style={{ backgroundColor: "var(--aegis-color-background-default)" }}>
      <CardHeader>
        <Text variant="title.xSmall">{t(titleKey)}</Text>
      </CardHeader>
      <CardBody style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
        {stats.map((item) => (
          <StatRow key={item.labelKey} t={t} item={item} />
        ))}
        {secondary && secondary.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--aegis-space-xxSmall)",
              marginTop: "var(--aegis-space-xSmall)",
            }}
          >
            {secondaryTitleKey ? (
              <Text variant="label.medium.bold" color="subtle">
                {t(secondaryTitleKey)}
              </Text>
            ) : null}
            {secondary.map((item) => (
              <StatRow key={item.labelKey} t={t} item={item} isSecondary />
            ))}
          </div>
        ) : null}
        {footer && footer.length > 0 ? (
          <div style={{ marginTop: "var(--aegis-space-small)" }}>
            {footerTitleKey ? (
              <Text variant="label.medium.bold" color="subtle">
                {t(footerTitleKey)}
              </Text>
            ) : null}
            {footer.map((item) => (
              <StatRow key={item.labelKey} t={t} item={item} />
            ))}
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
};

const StatRow = ({
  t,
  item,
  isSecondary = false,
}: {
  t: (key: TranslationKey) => string;
  item: StatItem;
  isSecondary?: boolean;
}) => {
  return (
    <div
      style={{
        ...styles.statRow,
        alignItems: isSecondary ? "flex-start" : "center",
      }}
    >
      <Text variant={isSecondary ? "body.small" : "label.medium.bold"} color={isSecondary ? "subtle" : "default"}>
        {t(item.labelKey)}
      </Text>
      <Text
        variant={isSecondary ? "body.large.bold" : "body.xxLarge.bold"}
        color={item.accent === "danger" ? "danger" : "default"}
      >
        {item.value}
      </Text>
    </div>
  );
};

const ShortcutSection = ({ headerName, children }: { headerName: string; children: ReactNode }) => {
  return (
    <section style={styles.shortcutSection}>
      <ContentHeader>
        <ContentHeader.Title>
          <Text variant="title.x3Small" color="subtle">
            {headerName}
          </Text>
        </ContentHeader.Title>
      </ContentHeader>
      {children}
    </section>
  );
};

const IconWrapper = ({ color = "default", children }: { color?: ShortcutItemColor; children: ReactNode }) => {
  return <div style={{ ...styles.cardIcon, backgroundColor: iconBgColors[color] }}>{children}</div>;
};
