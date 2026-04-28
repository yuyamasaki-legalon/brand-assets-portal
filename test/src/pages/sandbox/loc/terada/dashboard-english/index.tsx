import {
  LfAiSparkles,
  LfAngleRightMiddle,
  LfArchive,
  LfArrowUpRightFromSquare,
  LfBook,
  LfCheckBook,
  LfCheckCircle,
  LfCloseLarge,
  LfEarth,
  LfFileLines,
  LfFileSigned,
  LfFilesLine,
  LfHome,
  LfInformationCircle,
  LfLayoutHorizon,
  LfMagnifyingGlass,
  LfPlusLarge,
  LfProofreading,
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
  PageLayoutStickyContainer,
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarInset,
  SidebarNavigation,
  SidebarNavigationItem,
  SidebarNavigationLink,
  SidebarNavigationSeparator,
  SidebarProvider,
  Tab,
  Tag,
  Text,
} from "@legalforce/aegis-react";
import { type CSSProperties, type ReactNode, useState } from "react";

type StatItem = {
  label: string;
  value: number | string;
  accent?: "danger";
};

type ShortcutItemColor = "orange" | "lime" | "indigo" | "default";

type ShortcutItem = {
  title: string;
  description?: string;
  icon: ReactNode;
  color?: ShortcutItemColor;
};

type ShortcutCategory = {
  headerName: string;
  items: ShortcutItem[];
};

const attentionStats: StatItem[] = [
  { label: "Unread replies", value: 21, accent: "danger" },
  { label: "Pending seal approval", value: 0 },
  { label: "Pending e-signature", value: 0 },
];

const progressStats: StatItem[] = [
  { label: "In progress", value: 70 },
  { label: "Due in 3 days", value: 0 },
  { label: "Today", value: 0 },
  { label: "Overdue", value: 25, accent: "danger" },
  { label: "Unassigned", value: 851 },
];

const myRequests: StatItem[] = [
  { label: "Pending seal approval", value: 0 },
  { label: "Pending e-signature", value: 0 },
];

const shortcutCategories: ShortcutCategory[] = [
  {
    headerName: "Review contracts",
    items: [
      {
        title: "Contract review & proofreading",
        description: "Check for legal violations such as risks by contract type and cancellation laws",
        icon: <LfCheckCircle />,
        color: "orange",
      },
      {
        title: "Search past contract clauses",
        icon: <LfMagnifyingGlass />,
      },
      {
        title: "Edit playbook",
        description: "Register your company's contract review standards for contract review",
        icon: <LfCheckBook />,
        color: "orange",
      },
    ],
  },
  {
    headerName: "Make requests & applications",
    items: [
      {
        title: "Request contract approval",
        icon: <LfWriting />,
        color: "indigo",
      },
      {
        title: "Send e-contract (signature request)",
        icon: <LfWriting />,
        color: "indigo",
      },
    ],
  },
  {
    headerName: "Manage contracts",
    items: [
      {
        title: "Upload executed contracts",
        icon: <LfUpload />,
        color: "indigo",
      },
      {
        title: "Search executed contracts",
        icon: <LfFileSigned />,
        color: "indigo",
      },
    ],
  },
  {
    headerName: "Create contracts",
    items: [
      {
        title: "Company templates",
        icon: <LfFilesLine />,
      },
      {
        title: "LegalOn templates",
        icon: <LfFilesLine />,
        color: "lime",
      },
    ],
  },
];

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

const DashboardEnglish = () => {
  const [summaryOpen, setSummaryOpen] = useState(true);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader />
        <SidebarBody>
          <SidebarNavigation>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                aria-current="page"
                leading={
                  <Icon>
                    <LfHome />
                  </Icon>
                }
              >
                Home
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfAiSparkles />
                  </Icon>
                }
              >
                Assistant
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfProofreading />
                  </Icon>
                }
              >
                Review
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfArchive />
                  </Icon>
                }
              >
                Cases
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationSeparator />
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfFileLines />
                  </Icon>
                }
              >
                Contract management
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfWriting />
                  </Icon>
                }
              >
                E-contracts
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfCheckBook />
                  </Icon>
                }
              >
                Contract review standards
              </SidebarNavigationLink>
            </SidebarNavigationItem>
          </SidebarNavigation>
        </SidebarBody>
      </Sidebar>

      <SidebarInset>
        <PageLayout>
          <PageLayout.Pane
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
            <PageLayout.Header>
              <ContentHeader
                trailing={
                  <IconButton aria-label="Close" variant="plain" size="small" onClick={() => setSummaryOpen(false)}>
                    <Icon>
                      <LfCloseLarge />
                    </Icon>
                  </IconButton>
                }
              >
                <ContentHeader.Title>
                  <Text variant="title.small">Home</Text>
                </ContentHeader.Title>
              </ContentHeader>
            </PageLayout.Header>
            <PageLayout.Body>
              <div style={{ ...styles.leftContainer, padding: "var(--aegis-space-2XLarge)" }}>
                <Tab.Group variant="plain" index={0} size="large">
                  <Tab.List bordered={false}>
                    <Tab>Summary</Tab>
                    <Tab trailing={<Badge color="danger" count={1} />}>Activity</Tab>
                  </Tab.List>
                </Tab.Group>

                <Text variant="label.medium.bold" color="danger">
                  Action required
                </Text>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--aegis-space-small)",
                  }}
                >
                  <SectionCard
                    title="Cases"
                    stats={attentionStats.slice(0, 1)}
                    secondaryTitle="Contract execution applications"
                    secondary={attentionStats.slice(1)}
                  />
                  <SectionCard
                    title="Cases"
                    stats={progressStats.slice(0, 1)}
                    secondaryTitle="By due date"
                    secondary={progressStats.slice(1, 4)}
                    footerTitle="Unassigned"
                    footer={progressStats.slice(4)}
                  />
                  <SectionCard title="My requests & applications" stats={myRequests} />
                  <Card style={{ backgroundColor: "var(--aegis-color-background-default)" }}>
                    <CardHeader>
                      <Text variant="title.xSmall">Contracts requiring review</Text>
                    </CardHeader>
                    <CardBody>
                      <EmptyState
                        size="small"
                        title="No contracts require review"
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
            </PageLayout.Body>
          </PageLayout.Pane>
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
                      Open summary
                    </Button>
                  </div>
                </PageLayoutStickyContainer>
              ) : null}

              <div style={styles.rightColumn}>
                <Banner color="information">
                  <div
                    style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-small)", width: "100%" }}
                  >
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
                    <Text variant="title.medium">{"I'm LegalOn Assistant.\nHow can I help you today?"}</Text>
                  </div>
                  <div style={styles.legalonAssistantFormWrapper}>
                    <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                      <Tag variant="outline" size="small" color="neutral" leading={<Icon source={LfBook} />}>
                        Prompt library
                      </Tag>
                    </div>
                    <div style={styles.promptField}>
                      <Text variant="body.medium" color="subtle">
                        Enter your question
                      </Text>
                      <div style={styles.promptFieldRow}>
                        <Icon color="subtle">
                          <LfPlusLarge />
                        </Icon>
                        <Tag variant="fill" color="neutral" size="small" leading={<Icon source={LfEarth} />}>
                          2 sources
                        </Tag>
                        <div style={{ flex: 1 }} />
                        <IconButton aria-label="Send prompt" variant="plain" icon={LfAngleRightMiddle} />
                      </div>
                    </div>
                  </div>
                </div>

                <Tab.Group>
                  <Tab.List bordered={false}>
                    <Tab>Shortcuts</Tab>
                    <Tab>Legal updates & system updates</Tab>
                  </Tab.List>
                  <Tab.Panels>
                    <Tab.Panel>
                      <div style={styles.shortcutRoot}>
                        {shortcutCategories.map((category) => (
                          <ShortcutSection key={category.headerName} headerName={category.headerName}>
                            <div style={styles.cardList}>
                              {category.items.map((item) => (
                                <Card key={item.title} size="small">
                                  <CardHeader
                                    leading={
                                      <IconWrapper color={item.color}>
                                        <Icon>{item.icon}</Icon>
                                      </IconWrapper>
                                    }
                                  >
                                    <CardLink href="#">
                                      <Text as="span" style={styles.cardContent}>
                                        <Text variant="label.medium">{item.title}</Text>
                                        {item.description ? (
                                          <Text variant="body.xSmall" color="subtle">
                                            {item.description}
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
                        title="Latest legal updates and system updates will be displayed here"
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
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardEnglish;

type SectionCardProps = {
  title: string;
  stats: StatItem[];
  secondary?: StatItem[];
  footer?: StatItem[];
  secondaryTitle?: string;
  footerTitle?: string;
};

const SectionCard = ({ title, stats, secondary, footer, secondaryTitle, footerTitle }: SectionCardProps) => {
  return (
    <Card style={{ backgroundColor: "var(--aegis-color-background-default)" }}>
      <CardHeader>
        <Text variant="title.xSmall">{title}</Text>
      </CardHeader>
      <CardBody style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
        {stats.map((item) => (
          <StatRow key={item.label} item={item} />
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
            {secondaryTitle ? (
              <Text variant="label.medium.bold" color="subtle">
                {secondaryTitle}
              </Text>
            ) : null}
            {secondary.map((item) => (
              <StatRow key={item.label} item={item} isSecondary />
            ))}
          </div>
        ) : null}
        {footer && footer.length > 0 ? (
          <div style={{ marginTop: "var(--aegis-space-small)" }}>
            {footerTitle ? (
              <Text variant="label.medium.bold" color="subtle">
                {footerTitle}
              </Text>
            ) : null}
            {footer.map((item) => (
              <StatRow key={item.label} item={item} />
            ))}
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
};

const StatRow = ({ item, isSecondary = false }: { item: StatItem; isSecondary?: boolean }) => {
  return (
    <div
      style={{
        ...styles.statRow,
        alignItems: isSecondary ? "flex-start" : "center",
      }}
    >
      <Text variant={isSecondary ? "body.small" : "label.medium.bold"} color={isSecondary ? "subtle" : "default"}>
        {item.label}
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
