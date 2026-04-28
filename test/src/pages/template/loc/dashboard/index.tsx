import {
  LfAiSparkles,
  LfAngleRightMiddle,
  LfArrowUpRightFromSquare,
  LfBook,
  LfChart,
  LfChartBar,
  LfCheckBook,
  LfCheckCircle,
  LfCloseLarge,
  LfEarth,
  LfFileSigned,
  LfFilesLine,
  LfFolder,
  LfInformationCircle,
  LfLayoutHorizon,
  LfMagnifyingGlass,
  LfMail,
  LfPlusLarge,
  LfSetting,
  LfSparkles,
  LfUpload,
  LfUsers,
  LfWriting,
} from "@legalforce/aegis-icons";
import {
  ActionList,
  Avatar,
  Badge,
  Banner,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardLink,
  ContentHeader,
  ContentHeaderTitle,
  EmptyState,
  Icon,
  IconButton,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  PageLayoutStickyContainer,
  Select,
  Tab,
  Tag,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";
import { type CSSProperties, type ReactNode, useState } from "react";
import { LocSidebarLayout } from "../_shared";

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
  { label: "未読の返信", value: 21, accent: "danger" },
  { label: "押印の承認待ち", value: 0 },
  { label: "電子契約の署名待ち", value: 0 },
];

const progressStats: StatItem[] = [
  { label: "担当中", value: 70 },
  { label: "3日", value: 0 },
  { label: "今日", value: 0 },
  { label: "超過", value: 25, accent: "danger" },
  { label: "担当者が未割り当て", value: 851 },
];

const myRequests: StatItem[] = [
  { label: "押印の承認待ち", value: 0 },
  { label: "電子契約の署名待ち", value: 0 },
];

const shortcutCategories: ShortcutCategory[] = [
  {
    headerName: "契約書をレビューする",
    items: [
      {
        title: "契約書レビュー・校正",
        description: "契約類型別のリスクや取適法などの法令違反をチェック",
        icon: <LfCheckCircle />,
        color: "orange",
      },
      {
        title: "過去契約書の条文を検索",
        icon: <LfMagnifyingGlass />,
      },
      {
        title: "プレイブックを編集",
        description: "契約書レビューに使う、自社の契約審査基準を登録",
        icon: <LfCheckBook />,
        color: "orange",
      },
      {
        title: "プレイブックをAIで作成",
        icon: <LfAiSparkles />,
        color: "orange",
      },
    ],
  },
  {
    headerName: "依頼・申請をする",
    items: [
      {
        title: "契約締結の承認申請",
        icon: <LfWriting />,
        color: "indigo",
      },
      {
        title: "電子契約を送信（署名依頼）",
        icon: <LfWriting />,
        color: "indigo",
      },
    ],
  },
  {
    headerName: "契約を管理する",
    items: [
      {
        title: "最近アップロードした契約書",
        icon: <LfFileSigned />,
        color: "indigo",
      },
      {
        title: "締結済み契約書をアップロード",
        description: "Word Online 利用権限があれば PDF / Word / Excel / PowerPoint をアップロード可能",
        icon: <LfUpload />,
        color: "indigo",
      },
      {
        title: "締結済み契約書を検索",
        icon: <LfFileSigned />,
        color: "indigo",
      },
    ],
  },
  {
    headerName: "契約書の作成",
    items: [
      {
        title: "自社ひな形",
        icon: <LfFilesLine />,
      },
      {
        title: "LegalOnテンプレート",
        icon: <LfFilesLine />,
        color: "lime",
      },
    ],
  },
  {
    headerName: "テナントの設定",
    items: [
      {
        title: "ユーザー",
        description: "招待・ライセンス設定",
        icon: <LfUsers />,
      },
      {
        title: "ワークスペース（フォルダ）",
        description: "ファイルなどの保存先の作成・アクセス権限の設定",
        icon: <LfFolder />,
      },
      {
        title: "利用量の確認",
        description: "契約ライセンスの状況",
        icon: <LfChartBar />,
      },
      {
        title: "案件カスタム項目",
        description: "案件の項目を追加・修正",
        icon: <LfSetting />,
      },
      {
        title: "案件へのAI自動対応",
        description: "マターマネジメントエージェント",
        icon: <LfAiSparkles />,
      },
      {
        title: "契約カスタム項目",
        description: "契約書の項目を追加・修正",
        icon: <LfSetting />,
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
  summaryContent: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-medium)",
    paddingTop: "var(--aegis-space-medium)",
  },
  paneSectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "var(--aegis-space-xSmall)",
  },
  cardsColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-xSmall)",
  },
  summaryCardBody: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-small)",
  },
  deadlineRow: {
    display: "flex",
    alignItems: "flex-end",
    gap: "var(--aegis-space-xxSmall)",
  },
  deadlineItem: {
    display: "flex",
    alignItems: "center",
    gap: "var(--aegis-space-xxSmall)",
  },
  deadlineSeparator: {
    width: 1,
    height: "var(--aegis-size-large)",
    backgroundColor: "var(--aegis-color-border-default)",
    border: "none",
    margin: 0,
  },
  deadlineCell: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0 var(--aegis-space-xxSmall)",
  },
  activityContent: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-medium)",
    paddingTop: "var(--aegis-space-medium)",
  },
  activityHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activityList: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-medium)",
    margin: 0,
    padding: 0,
  },
  activityLink: {
    display: "flex",
    gap: "var(--aegis-space-small)",
    alignItems: "flex-start",
    textDecoration: "none",
    color: "inherit",
  },
  activityItemBody: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-x3Small)",
    flex: 1,
    minWidth: 0,
  },
};

const iconBgColors: Record<ShortcutItemColor, string> = {
  orange: "var(--aegis-color-background-accent-orange-xSubtle)",
  lime: "var(--aegis-color-background-accent-lime-xSubtle)",
  indigo: "var(--aegis-color-background-accent-indigo-xSubtle)",
  default: "var(--aegis-color-background-neutral-xSubtle)",
};

const DashboardTemplate = () => {
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
                <Tooltip title="閉じる">
                  <IconButton aria-label="閉じる" variant="plain" size="small" onClick={() => setSummaryOpen(false)}>
                    <Icon>
                      <LfCloseLarge />
                    </Icon>
                  </IconButton>
                </Tooltip>
              }
            >
              <ContentHeaderTitle>
                <Text variant="title.small">ホーム</Text>
              </ContentHeaderTitle>
            </ContentHeader>
          </PageLayoutHeader>
          <PageLayoutBody>
            <div style={{ ...styles.leftContainer, padding: "var(--aegis-space-2XLarge)" }}>
              <Tab.Group variant="plain" size="large">
                <Tab.List bordered={false}>
                  <Tab>サマリー</Tab>
                  <Tab trailing={<Badge color="danger" count={2} />}>アクティビティ</Tab>
                </Tab.List>
                <Tab.Panels>
                  <Tab.Panel>
                    <div style={styles.summaryContent}>
                      {/* セクション: あなたの対応が必要 */}
                      <PaneSectionHeader title="あなたの対応が必要" color="danger" icon={<LfSparkles />} />
                      <div style={styles.cardsColumn}>
                        <SummaryCard label="案件">
                          <StatRow item={attentionStats[0]} />
                        </SummaryCard>
                        <SummaryCard label="契約締結に関する申請" accentColor="warning">
                          {attentionStats.slice(1).map((item) => (
                            <StatRow key={item.label} item={item} isSecondary />
                          ))}
                        </SummaryCard>
                      </div>

                      {/* セクション: 案件（進捗） */}
                      <PaneSectionHeader title="案件" icon={<LfMail />} />
                      <div style={styles.cardsColumn}>
                        <SummaryCard>
                          <StatRow item={progressStats[0]} />
                        </SummaryCard>
                        <SummaryCard label="納期間近">
                          <div style={styles.deadlineRow}>
                            {progressStats.slice(1, 4).map((item, i) => (
                              <div key={item.label} style={styles.deadlineItem}>
                                {i > 0 ? <hr style={styles.deadlineSeparator} /> : null}
                                <div style={styles.deadlineCell}>
                                  <Text variant="body.xSmall" color="subtle">
                                    {item.label}
                                  </Text>
                                  <Text
                                    variant="body.large.bold"
                                    color={item.accent === "danger" ? "danger" : "default"}
                                  >
                                    {item.value}
                                  </Text>
                                </div>
                              </div>
                            ))}
                          </div>
                        </SummaryCard>
                        <SummaryCard>
                          <StatRow item={progressStats[4]} />
                          <ActionList size="small">
                            <ActionList.Item as="a" href="#">
                              <ActionList.Body
                                leading={<Icon source={LfChart} color="subtle" />}
                                trailing={<Icon source={LfAngleRightMiddle} color="subtle" />}
                              >
                                <Text color="accent.gray.subtle">現在の業務状況を見る</Text>
                              </ActionList.Body>
                            </ActionList.Item>
                          </ActionList>
                        </SummaryCard>
                      </div>

                      {/* セクション: 自分の依頼・申請 */}
                      <PaneSectionHeader title="自分の依頼・申請" icon={<LfInformationCircle />} />
                      <div style={styles.cardsColumn}>
                        <SummaryCard label="契約締結に関する申請" accentColor="warning">
                          {myRequests.map((item) => (
                            <StatRow key={item.label} item={item} isSecondary />
                          ))}
                        </SummaryCard>
                      </div>

                      {/* セクション: 確認が必要な契約 */}
                      <PaneSectionHeader title="確認が必要な契約" icon={<LfInformationCircle />} />
                      <div style={styles.cardsColumn}>
                        <SummaryCard label="すべて">
                          {contractCheckItems.map((item) => (
                            <StatRow key={`all-${item.label}`} item={item} isSecondary />
                          ))}
                        </SummaryCard>
                        <SummaryCard label="契約担当者が自分">
                          {contractCheckItems.map((item) => (
                            <StatRow key={`mine-${item.label}`} item={item} isSecondary />
                          ))}
                        </SummaryCard>
                      </div>
                    </div>
                  </Tab.Panel>
                  <Tab.Panel>
                    <div style={styles.activityContent}>
                      <div role="toolbar" style={styles.activityHeader}>
                        <Button variant="subtle" size="small">
                          すべて既読にする
                        </Button>
                        <Select
                          aria-label="アクティビティの表示範囲"
                          size="small"
                          width="auto"
                          defaultValue="unread"
                          options={[
                            { label: "未読", value: "unread" },
                            { label: "すべて", value: "all" },
                          ]}
                        />
                      </div>
                      <ul style={styles.activityList}>
                        {activityItems.map((item) => (
                          <li key={`${item.date}-${item.description}`} style={{ listStyle: "none" }}>
                            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                              <li>
                                <a href={item.href} style={styles.activityLink}>
                                  {item.avatar ? (
                                    <Avatar size="small" name={item.avatar.label} color={item.avatar.color} />
                                  ) : (
                                    <div style={styles.activityDot} />
                                  )}
                                  <div style={styles.activityItemBody}>
                                    <Text as="time" variant="body.xSmall" color="subtle">
                                      {item.date}
                                    </Text>
                                    <Text variant="label.small.bold">{item.title}</Text>
                                    <Text variant="body.xSmall" color="subtle">
                                      {item.description}
                                    </Text>
                                  </div>
                                </a>
                              </li>
                            </ul>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
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
                    サマリーを開く
                  </Button>
                </div>
              </PageLayoutStickyContainer>
            ) : null}

            <div style={styles.rightColumn}>
              <Banner color="information">
                <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-small)", width: "100%" }}>
                  <Text variant="body.small" style={{ flex: 1 }}>
                    Word Online の利用権限があるユーザーは、PDF に加えて Word / Excel / PowerPoint 形式も
                    締結済み契約書としてアップロードできます。
                  </Text>
                  <Icon color="subtle">
                    <LfArrowUpRightFromSquare />
                  </Icon>
                </div>
              </Banner>

              <div style={styles.legalonAssistant}>
                <div style={styles.legalonAssistantTitle}>
                  <Text variant="title.medium">{"LegalOnアシスタントです。\n何かお手伝いすることはありますか？"}</Text>
                </div>
                <div style={styles.legalonAssistantFormWrapper}>
                  <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                    <Tag variant="outline" size="small" color="neutral" leading={<Icon source={LfBook} />}>
                      プロンプトライブラリー
                    </Tag>
                  </div>
                  <div style={styles.promptField}>
                    <Text variant="body.medium" color="subtle">
                      質問を入力
                    </Text>
                    <div style={styles.promptFieldRow}>
                      <Icon color="subtle">
                        <LfPlusLarge />
                      </Icon>
                      <Tag variant="fill" color="neutral" size="small" leading={<Icon source={LfWriting} />}>
                        Draft
                      </Tag>
                      <Tag variant="fill" color="neutral" size="small" leading={<Icon source={LfEarth} />}>
                        すべてのソース
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
                  <Tab>ショートカット</Tab>
                  <Tab>法改正・アップデート</Tab>
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
                      title="最新の法改正情報やシステムアップデートを表示します"
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

export default DashboardTemplate;

const PaneSectionHeader = ({ title, color, icon }: { title: string; color?: "danger"; icon: ReactNode }) => {
  return (
    <div style={styles.paneSectionHeader}>
      <Icon color={color === "danger" ? "danger" : "subtle"} size="small">
        {icon}
      </Icon>
      <Text variant="title.xxSmall" color={color}>
        {title}
      </Text>
    </div>
  );
};

type SummaryCardProps = {
  label?: string;
  accentColor?: "warning";
  children: ReactNode;
};

const SummaryCard = ({ label, accentColor, children }: SummaryCardProps) => {
  return (
    <Card
      style={{
        backgroundColor: "var(--aegis-color-background-default)",
        ...(accentColor === "warning"
          ? { borderLeft: "3px solid var(--aegis-color-border-accent-orange-default)" }
          : {}),
      }}
    >
      <CardBody style={styles.summaryCardBody}>
        {label ? (
          <Text variant="label.small" color="subtle">
            {label}
          </Text>
        ) : null}
        {children}
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
        <ContentHeaderTitle>
          <Text variant="title.x3Small" color="subtle">
            {headerName}
          </Text>
        </ContentHeaderTitle>
      </ContentHeader>
      {children}
    </section>
  );
};

const contractCheckItems: StatItem[] = [
  { label: "更新拒絶期限日が60日以内", value: "-" },
  { label: "契約終了日が60日以内", value: "-" },
];

type ActivityItem = {
  avatar?: { label: string; color?: "orange" | "indigo" };
  date: string;
  title: string;
  description: string;
  href: string;
};

const activityItems: ActivityItem[] = [
  {
    date: "2026/02/20 20:00",
    title: "あなたが案件担当者に割り当てられました",
    description: "2026-02-0016 外部公開フォームでemailにもファイル貼付される : 1 file attached (2nd)",
    href: "#",
  },
  {
    avatar: { label: "shoji.arai" },
    date: "2026/02/19 13:53",
    title: "あなたが案件担当者に割り当てられました",
    description: "2026-01-0020 案件作成テスト",
    href: "#",
  },
];

const IconWrapper = ({ color = "default", children }: { color?: ShortcutItemColor; children: ReactNode }) => {
  return <div style={{ ...styles.cardIcon, backgroundColor: iconBgColors[color] }}>{children}</div>;
};
