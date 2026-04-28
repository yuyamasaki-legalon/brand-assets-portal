import {
  LfAngleDownMiddle,
  LfAngleLeftMiddle,
  LfAngleRightMiddle,
  LfAngleUpMiddle,
  LfArchive,
  LfArrowRotateRight,
  LfArrowUpRightFromSquare,
  LfAt,
  LfBarSparkles,
  LfBook,
  LfClip,
  LfCloseLarge,
  LfComments,
  LfEllipsisDot,
  LfFile,
  LfFileLines,
  LfInformationCircle,
  LfMagnifyingGlass,
  LfMail,
  LfMenu,
  LfMinusLarge,
  LfPen,
  LfPlusLarge,
  LfQuestionCircle,
  LfReplyAlt,
  LfScaleBalanced,
  LfWand,
} from "@legalforce/aegis-icons";
import { SlackLogo } from "@legalforce/aegis-logos/react";
import {
  Avatar,
  Button,
  ContentHeader,
  DateField,
  Divider,
  EmptyState,
  Form,
  FormControl,
  Header,
  Icon,
  IconButton,
  Link,
  Logo,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  PageLayoutSidebar,
  Select,
  SideNavigation,
  Switch,
  Tab,
  Tag,
  TagGroup,
  Text,
  Textarea,
  Toolbar,
  ToolbarSpacer,
  Tooltip,
} from "@legalforce/aegis-react";
import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

type PaneType =
  | "case-detail"
  | "case-attribute"
  | "case-summary"
  | "linked-file"
  | "linked-case"
  | "reference"
  | "book";

type TimelineEvent =
  | {
      id: string;
      type: "mail";
      sender: string;
      date: string;
      subject: string;
      content: string;
      attachments: string[];
      to: string;
    }
  | {
      id: string;
      type: "message";
      sender: string;
      date: string;
      content: string;
    }
  | {
      id: string;
      type: "status";
      sender: string;
      date: string;
      content: string;
    };

const caseData = {
  id: "2024-03-0020",
  title: "業務委託契約書のレビュー依頼",
  overview:
    "新規取引先との業務委託契約書について、リスク条項の確認をお願いします。特に損害賠償の上限条項と秘密保持義務の範囲についてご確認いただきたいです。\n\n取引先からの要望により、支払条件を月末締め翌月末払いから翌々月15日払いに変更する案が出ています。契約期間も1年から2年に延長予定です。\n\n下記のドラフトを確認の上、問題になりそうな点があればご連絡ください。",
  url: "https://docs.google.com/document/d/1abc123xyz",
  space: "営業部スペース",
  classification: "契約書レビュー",
  status: "法務確認中",
  requester: "高橋 健太",
  department: "営業部",
  mainAssignee: "山田 太郎",
  subAssignees: ["佐藤 花子", "鈴木 一郎"],
  dueDate: "2024-11-08",
};

const keywords = ["業務委託", "契約書レビュー", "リスク確認", "秘密保持", "損害賠償", "契約期間"];

const timelineEvents: TimelineEvent[] = [
  {
    id: "1",
    type: "mail",
    sender: "高橋 健太",
    date: "2024/10/22 18:30",
    subject: "【依頼者 → 法務】追加条件の確認依頼",
    content:
      "先日ご依頼した業務委託契約書について、取引先から追加の条件変更依頼がありました。支払条件と契約期間の変更に伴うリスクについてもご確認いただけますと幸いです。",
    attachments: ["業務委託契約書_v3.docx", "条件変更要望.pdf"],
    to: "legal@example.com",
  },
  {
    id: "2",
    type: "message",
    sender: "山田 太郎",
    date: "2024/10/22 14:15",
    content:
      "契約書を確認しました。損害賠償条項は上限金額の明記を推奨します。秘密保持条項は営業秘密に限定するか、具体的な情報カテゴリを列挙する方向で調整できそうです。",
  },
  {
    id: "3",
    type: "status",
    sender: "システム",
    date: "2024/10/21 09:12",
    content: "案件ステータスが「対応中」に更新されました。担当者：山田 太郎",
  },
];

const caseTypeOptions = [
  { label: "契約書の起案", value: "contract_draft" },
  { label: "契約書レビュー", value: "contract_review" },
  { label: "法務相談", value: "legal_consultation" },
];

const statusOptions = [
  { label: "法務確認中", value: "legal_review" },
  { label: "依頼者確認待ち", value: "requester_pending" },
  { label: "未着手", value: "not_started" },
  { label: "対応中", value: "in_progress" },
  { label: "完了", value: "completed" },
  { label: "差戻し", value: "returned" },
];

const assigneeOptions = [
  { label: "山田 太郎", value: "yamada" },
  { label: "佐藤 花子", value: "sato" },
  { label: "鈴木 一郎", value: "suzuki" },
  { label: "田中 美咲", value: "tanaka" },
  { label: "高橋 健太", value: "takahashi" },
];

const departmentOptions = [
  { label: "営業部", value: "sales" },
  { label: "開発部", value: "dev" },
  { label: "人事部", value: "hr" },
  { label: "経理部", value: "accounting" },
  { label: "法務部", value: "legal" },
];

const linkedFiles = [
  { name: "業務委託契約書_v3.docx", updatedAt: "2024/10/21 17:02" },
  { name: "秘密保持契約書（NDA）.pdf", updatedAt: "2024/10/18 12:44" },
  { name: "条件変更要望.pdf", updatedAt: "2024/10/22 09:17" },
];

const relatedCases = [
  { id: "2024-02-0015", title: "基本契約書_取引先A", status: "完了" },
  { id: "2024-05-0031", title: "委託先B_契約条件変更", status: "対応中" },
];

const referenceLinks = [
  { title: "業務委託契約に関するガイドライン", url: "https://example.com/guideline" },
  { title: "秘密保持条項チェックリスト", url: "https://example.com/checklist" },
  { title: "損害賠償条項のサンプル", url: "https://example.com/sample" },
];

const MAX_OVERVIEW_PREVIEW_HEIGHT_PX = 168;
const MAX_OVERVIEW_EXPANDED_HEIGHT_PX = 400;

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
  caseInfoContent: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-xSmall)",
  },
  caseOverview: {
    maxHeight: `${MAX_OVERVIEW_PREVIEW_HEIGHT_PX}px`,
    overflowY: "hidden",
  },
  caseOverviewExpanded: {
    maxHeight: `${MAX_OVERVIEW_EXPANDED_HEIGHT_PX}px`,
    overflowY: "auto",
  },
  toggleRow: {
    display: "flex",
    justifyContent: "flex-end",
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
  keywordTitle: {
    display: "flex",
    alignItems: "center",
    gap: "var(--aegis-space-xxSmall)",
  },
  tagGroupWrapper: {
    paddingBlock: "var(--aegis-space-xxSmall)",
  },
  tabContainer: {
    marginBlockStart: "var(--aegis-space-medium)",
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-large)",
  },
  messageForm: {
    padding: "var(--aegis-space-medium)",
    border: "1px solid var(--aegis-color-border-default)",
    borderRadius: "var(--aegis-radius-medium)",
    backgroundColor: "var(--aegis-color-surface-default)",
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-small)",
  },
  messageToolbar: {
    display: "flex",
    gap: "var(--aegis-space-xxSmall)",
  },
  messageActions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "var(--aegis-space-small)",
    flexWrap: "wrap",
  },
  timelineContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-large)",
  },
  timelineToolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "var(--aegis-space-medium)",
    height: "var(--aegis-size-xLarge)",
  },
  timelineList: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-xxLarge)",
  },
  timelineEvent: {
    display: "flex",
    alignItems: "flex-start",
    gap: "var(--aegis-space-small)",
  },
  eventHeader: {
    display: "flex",
    alignItems: "center",
    gap: "var(--aegis-space-small)",
  },
  eventMeta: {
    display: "flex",
    alignItems: "center",
    gap: "var(--aegis-space-xxSmall)",
    marginLeft: "auto",
  },
  eventBody: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-xSmall)",
    width: "100%",
  },
  externalCard: {
    width: "100%",
    padding: "var(--aegis-size-xSmall)",
    border: "1px solid var(--aegis-color-border-input)",
    borderRadius: "var(--aegis-radius-medium)",
    backgroundColor: "var(--aegis-color-surface-default)",
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-small)",
  },
  mailCardHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: "var(--aegis-space-small)",
  },
  mailHeaderText: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-xxSmall)",
  },
  mailToolbar: {
    display: "flex",
    gap: "var(--aegis-space-small)",
    marginLeft: "auto",
  },
  attachmentRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "var(--aegis-space-xSmall)",
  },
  paneBody: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-medium)",
  },
  summaryBody: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-medium)",
  },
  summaryTextGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-xxSmall)",
  },
  // 契約書プレビュー用スタイル
  contractPreviewContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "hidden",
  },
  contractPreviewToolbar: {
    display: "flex",
    alignItems: "center",
    gap: "var(--aegis-space-small)",
    padding: "var(--aegis-space-small)",
    borderBottom: "1px solid var(--aegis-color-border-default)",
  },
  contractPreviewContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 24,
    overflow: "auto",
    backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
    padding: "var(--aegis-space-large)",
  },
  // A4サイズ: 210mm x 297mm = 595px x 842px (72dpi)
  contractPage: {
    width: 595,
    height: 842,
    backgroundColor: "white",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15), 0 0 1px rgba(0, 0, 0, 0.1)",
    padding: "48px 56px",
    fontFamily: "'Yu Mincho', 'Hiragino Mincho ProN', serif",
    fontSize: 12,
    lineHeight: 1.8,
    color: "#1a1a1a",
    position: "relative" as const,
    boxSizing: "border-box" as const,
    flexShrink: 0,
  },
  contractTitle: {
    textAlign: "center" as const,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 28,
    letterSpacing: 6,
  },
  contractSection: {
    fontWeight: "bold",
    marginTop: 18,
    marginBottom: 8,
  },
  contractParagraph: {
    marginBottom: 10,
    textIndent: "1em",
    textAlign: "justify" as const,
  },
  contractPageNumber: {
    position: "absolute" as const,
    bottom: 24,
    left: 0,
    right: 0,
    textAlign: "center" as const,
    fontSize: 11,
    color: "#666",
  },
  contractHighlight: {
    backgroundColor: "#fff3cd",
    padding: "2px 4px",
  },
  contractNote: {
    fontSize: 10,
    color: "#666",
    marginTop: 4,
  },
  contractSignatureArea: {
    marginTop: 32,
    display: "flex",
    justifyContent: "space-between",
    gap: 32,
  },
  contractSignatureBox: {
    flex: 1,
    padding: 16,
    border: "1px solid #ccc",
    minHeight: 100,
    fontSize: 11,
  },
};

export const LabTestPageDetail = () => {
  const navigate = useNavigate();
  const [paneType, setPaneType] = useState<PaneType>("case-detail");
  const [paneOpen, setPaneOpen] = useState(true);
  const [overviewExpanded, setOverviewExpanded] = useState(false);
  const [shouldShowOverviewToggle, setShouldShowOverviewToggle] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(true);
  const [messageValue, setMessageValue] = useState("");
  const [caseType, setCaseType] = useState("contract_review");
  const [status, setStatus] = useState("legal_review");
  const [assignee, setAssignee] = useState("yamada");
  const [department, setDepartment] = useState("sales");
  const [requester, setRequester] = useState("takahashi");
  const [zoom, setZoom] = useState(100);
  const [previewTab, setPreviewTab] = useState(0);
  const overviewRef = useRef<HTMLDivElement>(null);

  const overviewToggleLabel = overviewExpanded ? "全文を折りたたむ" : "全文を表示";
  const messageLengthLabel = `${messageValue.length} / 4000`;
  const currentPane = paneOpen ? paneType : undefined;
  const visibleTimelineEvents = showAllHistory
    ? timelineEvents
    : timelineEvents.filter((event) => event.type !== "status");
  const caseOverviewStyle = overviewExpanded
    ? { ...inlineStyles.caseOverview, ...inlineStyles.caseOverviewExpanded }
    : inlineStyles.caseOverview;

  useEffect(() => {
    const element = overviewRef.current;
    if (!element) return;
    setShouldShowOverviewToggle(element.scrollHeight > MAX_OVERVIEW_PREVIEW_HEIGHT_PX);
  }, []);

  const handleSelectPane = (nextPane: PaneType) => {
    setPaneType(nextPane);
    setPaneOpen(true);
  };

  const handleZoomIn = useCallback(() => setZoom((prev) => Math.min(prev + 10, 200)), []);
  const handleZoomOut = useCallback(() => setZoom((prev) => Math.max(prev - 10, 50)), []);

  const renderTimelineEvent = (event: TimelineEvent) => {
    if (event.type === "mail") {
      return (
        <div key={event.id} style={inlineStyles.timelineEvent}>
          <Icon size="large">
            <LfMail />
          </Icon>
          <div style={inlineStyles.externalCard}>
            <div style={inlineStyles.mailCardHeader}>
              <Avatar size="xSmall" name={event.sender} />
              <div style={inlineStyles.mailHeaderText}>
                <Text variant="body.medium.bold">{event.sender}</Text>
                <Text variant="data.medium" color="subtle">
                  {event.date}
                </Text>
              </div>
              <div style={inlineStyles.mailToolbar}>
                <Tooltip title="詳細" placement="top">
                  <IconButton aria-label="詳細" size="xSmall" variant="plain">
                    <Icon size="small">
                      <LfInformationCircle />
                    </Icon>
                  </IconButton>
                </Tooltip>
                <Button size="xSmall" variant="solid" leading={LfReplyAlt}>
                  返信
                </Button>
              </div>
            </div>
            <Text variant="body.medium.bold">{event.subject}</Text>
            <Text variant="body.small" color="subtle">
              To: {event.to}
            </Text>
            <Text variant="body.medium" whiteSpace="pre-wrap">
              {event.content}
            </Text>
            <div style={inlineStyles.attachmentRow}>
              {event.attachments.map((file) => (
                <Tag key={file} variant="outline" leading={LfFile}>
                  {file}
                </Tag>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (event.type === "status") {
      return (
        <div key={event.id} style={inlineStyles.timelineEvent}>
          <Icon size="large">
            <LfBarSparkles />
          </Icon>
          <div style={inlineStyles.eventBody}>
            <div style={inlineStyles.eventHeader}>
              <Text variant="body.medium.bold">{event.content}</Text>
              <div style={inlineStyles.eventMeta}>
                <Text variant="body.small" color="subtle">
                  {event.date}
                </Text>
              </div>
            </div>
            <Text variant="body.small" color="subtle">
              更新元: {event.sender}
            </Text>
          </div>
        </div>
      );
    }

    return (
      <div key={event.id} style={inlineStyles.timelineEvent}>
        <Avatar size="xSmall" name={event.sender} />
        <div style={inlineStyles.eventBody}>
          <div style={inlineStyles.eventHeader}>
            <Text variant="body.medium.bold">{event.sender}</Text>
            <div style={inlineStyles.eventMeta}>
              <Text variant="body.small" color="subtle">
                {event.date}
              </Text>
            </div>
          </div>
          <Text variant="body.medium" whiteSpace="pre-wrap">
            {event.content}
          </Text>
        </div>
      </div>
    );
  };

  // 案件詳細パネル（元のメインコンテンツ）
  const renderCaseDetailPane = () => {
    const timelineHeader = (
      <div style={inlineStyles.messageForm}>
        <div style={inlineStyles.messageToolbar}>
          <Tooltip title="太字">
            <IconButton variant="plain" size="small" aria-label="太字">
              <Text variant="body.medium.bold">B</Text>
            </IconButton>
          </Tooltip>
          <Tooltip title="取り消し線">
            <IconButton variant="plain" size="small" aria-label="取り消し線">
              <Text variant="body.medium" style={{ textDecoration: "line-through" }}>
                S
              </Text>
            </IconButton>
          </Tooltip>
          <Tooltip title="下線">
            <IconButton variant="plain" size="small" aria-label="下線">
              <Text variant="body.medium" style={{ textDecoration: "underline" }}>
                U
              </Text>
            </IconButton>
          </Tooltip>
        </div>
        <Textarea
          placeholder="案件に関するメッセージを入力"
          value={messageValue}
          onChange={(event) => setMessageValue(event.target.value)}
          minRows={3}
        />
        <div style={inlineStyles.messageActions}>
          <div style={{ display: "flex", gap: "var(--aegis-space-xSmall)" }}>
            <Tooltip title="ファイル添付">
              <IconButton variant="plain" size="small" aria-label="ファイル添付">
                <Icon>
                  <LfClip />
                </Icon>
              </IconButton>
            </Tooltip>
            <Tooltip title="メンション">
              <IconButton variant="plain" size="small" aria-label="メンション">
                <Icon>
                  <LfAt />
                </Icon>
              </IconButton>
            </Tooltip>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-small)" }}>
            <Text variant="body.small" color="subtle">
              {messageLengthLabel}
            </Text>
            <Button variant="solid" size="small" disabled={messageValue.trim().length === 0}>
              投稿
            </Button>
          </div>
        </div>
      </div>
    );

    return (
      <>
        <PageLayoutHeader>
          <ContentHeader
            size="small"
            trailing={
              <Tooltip title="閉じる" placement="top">
                <IconButton variant="plain" size="small" aria-label="閉じる" onClick={() => setPaneOpen(false)}>
                  <Icon>
                    <LfCloseLarge />
                  </Icon>
                </IconButton>
              </Tooltip>
            }
          >
            <ContentHeader.Title>
              <Text variant="title.small">案件詳細</Text>
            </ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div style={inlineStyles.pageBody}>
            {/* 案件概要カード */}
            <section style={inlineStyles.card}>
              <ContentHeader
                size="small"
                trailing={
                  <Button leading={LfPen} variant="subtle" size="small">
                    編集
                  </Button>
                }
              >
                <ContentHeader.Description variant="data">{caseData.id}</ContentHeader.Description>
                <ContentHeader.Title>{caseData.title}</ContentHeader.Title>
              </ContentHeader>
              <div style={inlineStyles.caseInfoContent}>
                <Text as="h4" variant="title.xxSmall">
                  案件概要
                </Text>
                <div style={caseOverviewStyle} ref={overviewRef}>
                  <Text variant="component.medium" whiteSpace="pre-wrap">
                    {caseData.overview}
                    {"\n\n"}
                    <Link href={caseData.url} target="_blank" rel="noreferrer">
                      {caseData.url}
                    </Link>
                  </Text>
                </div>
                {shouldShowOverviewToggle ? (
                  <div style={inlineStyles.toggleRow}>
                    <Button
                      size="xSmall"
                      aria-expanded={overviewExpanded}
                      variant="gutterless"
                      leading={<Icon color="subtle" source={overviewExpanded ? LfAngleUpMiddle : LfAngleDownMiddle} />}
                      onClick={() => setOverviewExpanded((prev) => !prev)}
                    >
                      <Text variant="data.medium" color="subtle">
                        {overviewToggleLabel}
                      </Text>
                    </Button>
                  </div>
                ) : null}
              </div>
            </section>

            {/* 案件キーワード */}
            <section style={inlineStyles.keywordSection}>
              <div style={inlineStyles.keywordHeader}>
                <div style={inlineStyles.keywordTitle}>
                  <Text as="h4" variant="label.medium.bold">
                    案件キーワード
                  </Text>
                  <Tooltip title="案件に紐づくキーワードです" placement="top">
                    <IconButton variant="plain" size="xSmall" aria-label="ヘルプ">
                      <Icon size="small">
                        <LfInformationCircle />
                      </Icon>
                    </IconButton>
                  </Tooltip>
                </div>
                <Button
                  variant="gutterless"
                  size="small"
                  weight="normal"
                  leading={LfScaleBalanced}
                  trailing={LfAngleRightMiddle}
                >
                  法令・ガイドラインを検索
                </Button>
              </div>
              <div style={inlineStyles.tagGroupWrapper}>
                <TagGroup>
                  {keywords.map((keyword) => (
                    <Tag key={keyword} variant="fill" color="neutral">
                      {keyword}
                    </Tag>
                  ))}
                </TagGroup>
              </div>
            </section>

            {/* タイムライン */}
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
                    タイムライン
                  </Tab>
                  <Tab leading={<Logo source={SlackLogo} size="medium" />} width="full">
                    Slack
                  </Tab>
                  <Tab
                    leading={
                      <Icon size="medium">
                        <LfMail />
                      </Icon>
                    }
                    width="full"
                  >
                    メール
                  </Tab>
                </Tab.List>
                <Tab.Panels>
                  <Tab.Panel>
                    <div style={inlineStyles.timelineContainer}>
                      {timelineHeader}
                      <div style={inlineStyles.timelineToolbar}>
                        <Switch
                          labelPosition="start"
                          checked={showAllHistory}
                          onChange={(event) => setShowAllHistory(event.target.checked)}
                        >
                          履歴を表示
                        </Switch>
                        <Tooltip title="更新" placement="top">
                          <IconButton variant="plain" size="small" aria-label="更新">
                            <Icon size="small">
                              <LfArrowRotateRight />
                            </Icon>
                          </IconButton>
                        </Tooltip>
                      </div>
                      <Divider />
                      <div style={inlineStyles.timelineList}>
                        {visibleTimelineEvents.map((event) => renderTimelineEvent(event))}
                      </div>
                    </div>
                  </Tab.Panel>
                  <Tab.Panel>
                    <div style={inlineStyles.card}>
                      <ContentHeader size="small">
                        <ContentHeader.Title>Slack スレッド</ContentHeader.Title>
                      </ContentHeader>
                      <Text variant="body.medium" color="subtle">
                        Slack連携されたメッセージがここに表示されます。
                      </Text>
                    </div>
                  </Tab.Panel>
                  <Tab.Panel>
                    <div style={inlineStyles.card}>
                      <ContentHeader size="small">
                        <ContentHeader.Title>メールスレッド</ContentHeader.Title>
                      </ContentHeader>
                      <Text variant="body.medium" color="subtle">
                        メールスレッドがここに表示されます。
                      </Text>
                    </div>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </section>
          </div>
        </PageLayoutBody>
      </>
    );
  };

  const renderPaneContent = () => {
    const PaneHeader = ({ title }: { title: string }) => (
      <PageLayoutHeader>
        <ContentHeader
          size="small"
          trailing={
            <Tooltip title="閉じる" placement="top">
              <IconButton variant="plain" size="small" aria-label="閉じる" onClick={() => setPaneOpen(false)}>
                <Icon>
                  <LfCloseLarge />
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

    // 案件詳細パネル
    if (paneType === "case-detail") {
      return renderCaseDetailPane();
    }

    if (paneType === "case-summary") {
      return (
        <>
          <PaneHeader title="案件要約" />
          <PageLayoutBody>
            <div style={inlineStyles.summaryBody}>
              <Button variant="solid" width="full" leading={LfWand}>
                案件要約を生成
              </Button>
              <EmptyState size="small" title="メッセージのやり取りを元に案件要約を生成します">
                上記ボタンを押下しなくても、メッセージの最終更新から72時間経過した日の0:00頃に自動で生成します。
              </EmptyState>
              <div style={inlineStyles.summaryTextGroup}>
                <Text variant="body.small" color="subtle">
                  メッセージ数が少ない場合、案件要約の精度が低下することがあります。要約の内容はお客様の判断でご利用ください。
                </Text>
                <Link
                  href="#"
                  size="small"
                  leading={LfQuestionCircle}
                  trailing={LfArrowUpRightFromSquare}
                  target="_blank"
                  rel="noreferrer"
                  underline
                >
                  案件要約機能のご利用における注意点
                </Link>
              </div>
            </div>
          </PageLayoutBody>
        </>
      );
    }

    if (paneType === "linked-file") {
      return (
        <>
          <PaneHeader title="関連ファイル" />
          <PageLayoutBody>
            <div style={inlineStyles.paneBody}>
              {linkedFiles.map((file) => (
                <div
                  key={file.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--aegis-space-small)",
                    padding: "var(--aegis-space-small)",
                    border: "1px solid var(--aegis-color-border-default)",
                    borderRadius: "var(--aegis-radius-medium)",
                  }}
                >
                  <Icon size="medium">
                    <LfFile />
                  </Icon>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xxSmall)" }}>
                    <Text variant="body.medium.bold">{file.name}</Text>
                    <Text variant="body.small" color="subtle">
                      最終更新 {file.updatedAt}
                    </Text>
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <Button size="small" variant="subtle">
                      開く
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </PageLayoutBody>
        </>
      );
    }

    if (paneType === "linked-case") {
      return (
        <>
          <PaneHeader title="関連案件" />
          <PageLayoutBody>
            <div style={inlineStyles.paneBody}>
              {relatedCases.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--aegis-space-small)",
                    padding: "var(--aegis-space-small)",
                    border: "1px solid var(--aegis-color-border-default)",
                    borderRadius: "var(--aegis-radius-medium)",
                  }}
                >
                  <div>
                    <Text variant="data.medium">{item.id}</Text>
                    <Text variant="body.medium.bold" numberOfLines={1}>
                      {item.title}
                    </Text>
                  </div>
                  <Tag variant="fill" color="neutral">
                    {item.status}
                  </Tag>
                  <div style={{ marginLeft: "auto" }}>
                    <Button size="small" variant="subtle">
                      詳細へ
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </PageLayoutBody>
        </>
      );
    }

    if (paneType === "reference") {
      return (
        <>
          <PaneHeader title="参考情報" />
          <PageLayoutBody>
            <div style={inlineStyles.paneBody}>
              <Form>
                <FormControl>
                  <FormControl.Label>案件キーワードで検索</FormControl.Label>
                  <Textarea defaultValue={keywords.join(" ")} />
                </FormControl>
              </Form>
              <Divider />
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
                {referenceLinks.map((item) => (
                  <div key={item.title}>
                    <Link href={item.url} target="_blank" rel="noreferrer">
                      {item.title}
                    </Link>
                    <Text variant="body.small" color="subtle">
                      {item.url}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          </PageLayoutBody>
        </>
      );
    }

    if (paneType === "book") {
      return (
        <>
          <PaneHeader title="参考資料" />
          <PageLayoutBody>
            <div style={inlineStyles.paneBody}>
              <Text variant="body.medium">案件に関連する資料をここにまとめて表示します。</Text>
              <Divider />
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-small)" }}>
                <Text variant="body.small" color="subtle">
                  ・業務委託契約の雛形
                </Text>
                <Text variant="body.small" color="subtle">
                  ・秘密保持条項の解説記事
                </Text>
                <Text variant="body.small" color="subtle">
                  ・判例・論文リンク
                </Text>
              </div>
              <Button variant="subtle" width="full">
                新しい資料を追加
              </Button>
            </div>
          </PageLayoutBody>
        </>
      );
    }

    // 案件情報（デフォルト）
    return (
      <>
        <PaneHeader title="案件情報" />
        <PageLayoutBody>
          <div style={inlineStyles.paneBody}>
            <Form>
              <FormControl>
                <FormControl.Label>案件タイプ</FormControl.Label>
                <Select options={caseTypeOptions} value={caseType} onChange={(value) => setCaseType(value)} />
              </FormControl>
              <FormControl>
                <FormControl.Label>案件ステータス</FormControl.Label>
                <Select options={statusOptions} value={status} onChange={(value) => setStatus(value)} />
              </FormControl>
              <FormControl>
                <FormControl.Label>案件担当者</FormControl.Label>
                <Select options={assigneeOptions} value={assignee} onChange={(value) => setAssignee(value)} />
              </FormControl>
              <FormControl>
                <FormControl.Label>副担当者</FormControl.Label>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xxSmall)" }}>
                  {caseData.subAssignees.map((name) => (
                    <Text key={name} variant="body.medium">
                      {name}
                    </Text>
                  ))}
                </div>
              </FormControl>
              <FormControl>
                <FormControl.Label>依頼部署</FormControl.Label>
                <Select options={departmentOptions} value={department} onChange={(value) => setDepartment(value)} />
              </FormControl>
              <FormControl>
                <FormControl.Label>依頼者</FormControl.Label>
                <Select options={assigneeOptions} value={requester} onChange={(value) => setRequester(value)} />
              </FormControl>
              <FormControl>
                <FormControl.Label>納期</FormControl.Label>
                <DateField defaultValue={new Date(caseData.dueDate)} />
              </FormControl>
              <FormControl>
                <FormControl.Label>保存先</FormControl.Label>
                <Text variant="body.medium">{caseData.space}</Text>
              </FormControl>
              <Button variant="subtle" width="full">
                案件を移動
              </Button>
              <Divider />
              <FormControl>
                <FormControl.Label>案件ラベル</FormControl.Label>
                <TagGroup>
                  {keywords.map((keyword) => (
                    <Tag key={keyword} variant="outline">
                      {keyword}
                    </Tag>
                  ))}
                </TagGroup>
              </FormControl>
            </Form>
          </div>
        </PageLayoutBody>
      </>
    );
  };

  // 契約書プレビューコンポーネント
  const ContractPreview = useMemo(
    () => (
      <div style={inlineStyles.contractPreviewContainer}>
        <Tab.Group index={previewTab} variant="plain">
          <Toolbar>
            <Tab.List>
              <Tab onClick={() => setPreviewTab(0)}>プレビュー</Tab>
              <Tab onClick={() => setPreviewTab(1)}>テキスト</Tab>
            </Tab.List>
            <ToolbarSpacer />
            <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
              <Tooltip title="縮小">
                <IconButton size="small" aria-label="縮小" onClick={handleZoomOut}>
                  <Icon size="small">
                    <LfMinusLarge />
                  </Icon>
                </IconButton>
              </Tooltip>
              <Text variant="body.small" color="subtle">
                {zoom}%
              </Text>
              <Tooltip title="拡大">
                <IconButton size="small" aria-label="拡大" onClick={handleZoomIn}>
                  <Icon size="small">
                    <LfPlusLarge />
                  </Icon>
                </IconButton>
              </Tooltip>
            </div>
          </Toolbar>

          <Tab.Panels style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
            <Tab.Panel style={{ height: "100%", overflow: "hidden" }}>
              <div style={{ ...inlineStyles.contractPreviewContent, height: "100%", overflowY: "auto" }}>
                {/* 1ページ目 */}
                <div
                  style={{
                    ...inlineStyles.contractPage,
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: "top center",
                  }}
                >
                  <div style={inlineStyles.contractTitle}>業 務 委 託 契 約 書</div>
                  <div style={inlineStyles.contractParagraph}>
                    株式会社●●（以下「甲」という。）と株式会社△△（以下「乙」という。）は、甲乙間において、次のとおり業務委託契約（以下「本契約」という。）を締結する。
                  </div>
                  <div style={inlineStyles.contractSection}>第1条（目的）</div>
                  <div style={inlineStyles.contractParagraph}>
                    甲は乙に対し、別紙に定める業務（以下「本業務」という。）を委託し、乙はこれを受託する。
                  </div>
                  <div style={inlineStyles.contractSection}>第2条（委託料）</div>
                  <div style={inlineStyles.contractParagraph}>
                    1. 甲は乙に対し、本業務の対価として、別紙に定める委託料を支払う。
                  </div>
                  <div style={inlineStyles.contractParagraph}>
                    2.
                    前項の委託料には、本業務の遂行に必要な一切の費用（交通費、通信費その他の経費を含む。）が含まれるものとする。ただし、甲が事前に書面で承認した費用については、この限りでない。
                  </div>
                  <div style={inlineStyles.contractSection}>第3条（支払条件）</div>
                  <div style={inlineStyles.contractParagraph}>
                    <Text style={inlineStyles.contractHighlight}>
                      1.
                      甲は、乙からの請求書を受領した月の翌々月15日までに、前条に定める委託料を乙の指定する銀行口座に振り込む方法により支払う。なお、振込手数料は甲の負担とする。
                    </Text>
                  </div>
                  <div style={inlineStyles.contractNote}>※ 変更箇所：月末締め翌月末払い → 翌々月15日払い</div>
                  <div style={inlineStyles.contractParagraph}>
                    2.
                    甲は、本業務の成果物に瑕疵がある場合、乙が当該瑕疵を修補するまで委託料の支払いを拒むことができる。
                  </div>
                  <div style={inlineStyles.contractSection}>第4条（契約期間）</div>
                  <div style={inlineStyles.contractParagraph}>
                    <Text style={inlineStyles.contractHighlight}>
                      本契約の有効期間は、本契約締結日から2年間とする。
                    </Text>
                    ただし、期間満了の1ヶ月前までに甲乙いずれからも書面による解約の申し出がない場合、本契約は同一条件でさらに1年間更新されるものとし、以後も同様とする。
                  </div>
                  <div style={inlineStyles.contractNote}>※ 変更箇所：1年間 → 2年間</div>
                  <div style={inlineStyles.contractSection}>第5条（業務の遂行）</div>
                  <div style={inlineStyles.contractParagraph}>
                    1. 乙は、本契約に定める条件に従い、善良な管理者の注意をもって本業務を遂行するものとする。
                  </div>
                  <div style={inlineStyles.contractPageNumber}>1 / 3</div>
                </div>

                {/* 2ページ目 */}
                <div
                  style={{
                    ...inlineStyles.contractPage,
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: "top center",
                  }}
                >
                  <div style={inlineStyles.contractParagraph}>
                    2.
                    乙は、本業務の全部又は一部を第三者に再委託してはならない。ただし、甲の事前の書面による承諾を得た場合はこの限りでない。
                  </div>
                  <div style={inlineStyles.contractSection}>第6条（秘密保持）</div>
                  <div style={inlineStyles.contractParagraph}>
                    1.
                    甲及び乙は、本契約に関連して相手方から開示された技術上又は営業上の情報であって、秘密である旨明示されたもの（以下「秘密情報」という。）を、相手方の事前の書面による承諾なく、第三者に開示又は漏洩してはならない。
                  </div>
                  <div style={inlineStyles.contractParagraph}>
                    2. 前項の規定にかかわらず、次の各号のいずれかに該当する情報は、秘密情報に含まれない。
                  </div>
                  <div style={{ ...inlineStyles.contractParagraph, paddingLeft: 20 }}>
                    (1) 開示を受けた時点で既に公知であった情報
                    <br />
                    (2) 開示を受けた後、自己の責めに帰すべき事由によらず公知となった情報
                    <br />
                    (3) 開示を受けた時点で既に自己が保有していた情報
                    <br />
                    (4) 正当な権限を有する第三者から秘密保持義務を負うことなく取得した情報
                    <br />
                    (5) 相手方の秘密情報によらず独自に開発した情報
                  </div>
                  <div style={inlineStyles.contractSection}>第7条（知的財産権）</div>
                  <div style={inlineStyles.contractParagraph}>
                    1.
                    本業務の遂行により生じた成果物に係る著作権（著作権法第27条及び第28条に定める権利を含む。）その他の知的財産権は、委託料の完済をもって乙から甲に移転する。
                  </div>
                  <div style={inlineStyles.contractParagraph}>
                    2. 乙は、甲に対し、前項の成果物について著作者人格権を行使しないものとする。
                  </div>
                  <div style={inlineStyles.contractSection}>第8条（損害賠償）</div>
                  <div style={inlineStyles.contractParagraph}>
                    1.
                    甲及び乙は、本契約に違反して相手方に損害を与えた場合、相手方に対し、当該違反に起因する直接かつ現実に生じた通常の損害を賠償する責任を負う。
                  </div>
                  <div style={inlineStyles.contractParagraph}>
                    2.
                    前項の損害賠償の累計総額は、債務不履行、不法行為その他請求原因の如何にかかわらず、本契約に基づき甲が乙に支払った委託料の総額を上限とする。
                  </div>
                  <div style={inlineStyles.contractSection}>第9条（解除）</div>
                  <div style={inlineStyles.contractParagraph}>
                    1.
                    甲及び乙は、相手方が次の各号のいずれかに該当する場合、何らの催告を要せず、直ちに本契約を解除することができる。
                  </div>
                  <div style={inlineStyles.contractPageNumber}>2 / 3</div>
                </div>

                {/* 3ページ目 */}
                <div
                  style={{
                    ...inlineStyles.contractPage,
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: "top center",
                  }}
                >
                  <div style={{ ...inlineStyles.contractParagraph, paddingLeft: 20 }}>
                    (1) 本契約に違反し、相当期間を定めた催告にもかかわらず当該違反が是正されないとき
                    <br />
                    (2) 支払停止若しくは支払不能となったとき、又は手形若しくは小切手が不渡りとなったとき
                    <br />
                    (3) 破産手続開始、民事再生手続開始、会社更生手続開始又は特別清算開始の申立てがあったとき
                    <br />
                    (4) 差押え、仮差押え、仮処分又は競売の申立てを受けたとき
                    <br />
                    (5) 租税公課を滞納し、督促を受けたとき
                    <br />
                    (6) その他信用状態に重大な変化が生じたとき
                  </div>
                  <div style={inlineStyles.contractSection}>第10条（反社会的勢力の排除）</div>
                  <div style={inlineStyles.contractParagraph}>
                    甲及び乙は、自己又は自己の役員若しくは従業員が、暴力団、暴力団員、暴力団関係企業、総会屋、社会運動標榜ゴロ、政治活動標榜ゴロ、特殊知能暴力集団その他の反社会的勢力に該当しないことを表明し、保証する。
                  </div>
                  <div style={inlineStyles.contractSection}>第11条（存続条項）</div>
                  <div style={inlineStyles.contractParagraph}>
                    第6条（秘密保持）、第7条（知的財産権）、第8条（損害賠償）及び本条の規定は、本契約終了後もなお有効に存続する。
                  </div>
                  <div style={inlineStyles.contractSection}>第12条（管轄裁判所）</div>
                  <div style={inlineStyles.contractParagraph}>
                    本契約に関する一切の紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とする。
                  </div>
                  <div style={inlineStyles.contractSection}>第13条（協議事項）</div>
                  <div style={inlineStyles.contractParagraph}>
                    本契約に定めのない事項又は本契約の解釈に疑義が生じた事項については、甲乙誠意をもって協議の上、解決するものとする。
                  </div>
                  <div style={{ ...inlineStyles.contractParagraph, marginTop: 24 }}>
                    本契約の成立を証するため、本書2通を作成し、甲乙記名押印の上、各1通を保有する。
                  </div>
                  <div style={{ textAlign: "right", marginTop: 16 }}>令和6年10月22日</div>
                  <div style={inlineStyles.contractSignatureArea}>
                    <div style={inlineStyles.contractSignatureBox}>
                      <div style={{ marginBottom: 8 }}>（甲）</div>
                      <div>東京都千代田区丸の内一丁目1番1号</div>
                      <div style={{ marginTop: 8 }}>株式会社●●</div>
                      <div style={{ marginTop: 8 }}>代表取締役　山田 太郎　㊞</div>
                    </div>
                    <div style={inlineStyles.contractSignatureBox}>
                      <div style={{ marginBottom: 8 }}>（乙）</div>
                      <div>東京都港区六本木二丁目2番2号</div>
                      <div style={{ marginTop: 8 }}>株式会社△△</div>
                      <div style={{ marginTop: 8 }}>代表取締役　佐藤 花子　㊞</div>
                    </div>
                  </div>
                  <div style={inlineStyles.contractPageNumber}>3 / 3</div>
                </div>
              </div>
            </Tab.Panel>
            <Tab.Panel style={{ height: "100%", overflow: "hidden" }}>
              <div
                style={{
                  padding: "var(--aegis-space-large)",
                  backgroundColor: "white",
                  height: "100%",
                  overflowY: "auto",
                }}
              >
                <Text variant="body.medium" whiteSpace="pre-wrap">
                  {`業務委託契約書

株式会社●●（以下「甲」という。）と株式会社△△（以下「乙」という。）は、甲乙間において、次のとおり業務委託契約（以下「本契約」という。）を締結する。

第1条（目的）
甲は乙に対し、別紙に定める業務（以下「本業務」という。）を委託し、乙はこれを受託する。

第2条（委託料）
1. 甲は乙に対し、本業務の対価として、別紙に定める委託料を支払う。
2. 前項の委託料には、本業務の遂行に必要な一切の費用（交通費、通信費その他の経費を含む。）が含まれるものとする。ただし、甲が事前に書面で承認した費用については、この限りでない。

第3条（支払条件）【変更箇所】
1. 甲は、乙からの請求書を受領した月の翌々月15日までに、前条に定める委託料を乙の指定する銀行口座に振り込む方法により支払う。なお、振込手数料は甲の負担とする。
※ 変更：月末締め翌月末払い → 翌々月15日払い
2. 甲は、本業務の成果物に瑕疵がある場合、乙が当該瑕疵を修補するまで委託料の支払いを拒むことができる。

第4条（契約期間）【変更箇所】
本契約の有効期間は、本契約締結日から2年間とする。ただし、期間満了の1ヶ月前までに甲乙いずれからも書面による解約の申し出がない場合、本契約は同一条件でさらに1年間更新されるものとし、以後も同様とする。
※ 変更：1年間 → 2年間

第5条（業務の遂行）
1. 乙は、本契約に定める条件に従い、善良な管理者の注意をもって本業務を遂行するものとする。
2. 乙は、本業務の全部又は一部を第三者に再委託してはならない。ただし、甲の事前の書面による承諾を得た場合はこの限りでない。

第6条（秘密保持）
1. 甲及び乙は、本契約に関連して相手方から開示された技術上又は営業上の情報であって、秘密である旨明示されたもの（以下「秘密情報」という。）を、相手方の事前の書面による承諾なく、第三者に開示又は漏洩してはならない。
2. 前項の規定にかかわらず、次の各号のいずれかに該当する情報は、秘密情報に含まれない。
(1) 開示を受けた時点で既に公知であった情報
(2) 開示を受けた後、自己の責めに帰すべき事由によらず公知となった情報
(3) 開示を受けた時点で既に自己が保有していた情報
(4) 正当な権限を有する第三者から秘密保持義務を負うことなく取得した情報
(5) 相手方の秘密情報によらず独自に開発した情報

第7条（知的財産権）
1. 本業務の遂行により生じた成果物に係る著作権（著作権法第27条及び第28条に定める権利を含む。）その他の知的財産権は、委託料の完済をもって乙から甲に移転する。
2. 乙は、甲に対し、前項の成果物について著作者人格権を行使しないものとする。

第8条（損害賠償）
1. 甲及び乙は、本契約に違反して相手方に損害を与えた場合、相手方に対し、当該違反に起因する直接かつ現実に生じた通常の損害を賠償する責任を負う。
2. 前項の損害賠償の累計総額は、債務不履行、不法行為その他請求原因の如何にかかわらず、本契約に基づき甲が乙に支払った委託料の総額を上限とする。

第9条（解除）
1. 甲及び乙は、相手方が次の各号のいずれかに該当する場合、何らの催告を要せず、直ちに本契約を解除することができる。
(1) 本契約に違反し、相当期間を定めた催告にもかかわらず当該違反が是正されないとき
(2) 支払停止若しくは支払不能となったとき、又は手形若しくは小切手が不渡りとなったとき
(3) 破産手続開始、民事再生手続開始、会社更生手続開始又は特別清算開始の申立てがあったとき
(4) 差押え、仮差押え、仮処分又は競売の申立てを受けたとき
(5) 租税公課を滞納し、督促を受けたとき
(6) その他信用状態に重大な変化が生じたとき

第10条（反社会的勢力の排除）
甲及び乙は、自己又は自己の役員若しくは従業員が、暴力団、暴力団員、暴力団関係企業、総会屋、社会運動標榜ゴロ、政治活動標榜ゴロ、特殊知能暴力集団その他の反社会的勢力に該当しないことを表明し、保証する。

第11条（存続条項）
第6条（秘密保持）、第7条（知的財産権）、第8条（損害賠償）及び本条の規定は、本契約終了後もなお有効に存続する。

第12条（管轄裁判所）
本契約に関する一切の紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とする。

第13条（協議事項）
本契約に定めのない事項又は本契約の解釈に疑義が生じた事項については、甲乙誠意をもって協議の上、解決するものとする。

本契約の成立を証するため、本書2通を作成し、甲乙記名押印の上、各1通を保有する。

令和6年10月22日

（甲）
東京都千代田区丸の内一丁目1番1号
株式会社●●
代表取締役　山田 太郎

（乙）
東京都港区六本木二丁目2番2号
株式会社△△
代表取締役　佐藤 花子`}
                </Text>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    ),
    [previewTab, zoom, handleZoomIn, handleZoomOut],
  );

  return (
    <div className="case-detail-page" style={{ display: "contents" }}>
      <Header>
        <Header.Item>
          <Tooltip title="メニュー">
            <IconButton variant="plain" aria-label="メニュー">
              <Icon>
                <LfMenu />
              </Icon>
            </IconButton>
          </Tooltip>
          <Divider orientation="vertical" />
          <Tooltip title="戻る">
            <IconButton variant="plain" aria-label="戻る" onClick={() => navigate("/sandbox/nomura/lab-test-page")}>
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
          <Tooltip title="検索">
            <IconButton variant="plain" aria-label="検索">
              <Icon>
                <LfMagnifyingGlass />
              </Icon>
            </IconButton>
          </Tooltip>
          <Tooltip title="その他">
            <IconButton variant="plain" aria-label="その他">
              <Icon>
                <LfEllipsisDot />
              </Icon>
            </IconButton>
          </Tooltip>
        </Header.Item>
      </Header>

      <PageLayout>
        {/* メインコンテンツ：契約書プレビュー */}
        <PageLayoutContent>
          <PageLayoutBody style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {ContractPreview}
          </PageLayoutBody>
        </PageLayoutContent>

        {/* 右ペイン */}
        <PageLayoutPane position="end" width="large" resizable open={paneOpen}>
          {renderPaneContent()}
        </PageLayoutPane>

        {/* 右サイドバー */}
        <PageLayoutSidebar position="end">
          <SideNavigation>
            <SideNavigation.Group>
              <SideNavigation.Item
                icon={LfFileLines}
                onClick={() => handleSelectPane("case-detail")}
                aria-current={currentPane === "case-detail" ? true : undefined}
              >
                案件詳細
              </SideNavigation.Item>
              <SideNavigation.Item
                icon={LfInformationCircle}
                onClick={() => handleSelectPane("case-attribute")}
                aria-current={currentPane === "case-attribute" ? true : undefined}
              >
                案件情報
              </SideNavigation.Item>
              <SideNavigation.Item
                icon={LfBarSparkles}
                onClick={() => handleSelectPane("case-summary")}
                aria-current={currentPane === "case-summary" ? true : undefined}
              >
                案件サマリー
              </SideNavigation.Item>
              <SideNavigation.Item
                icon={LfFile}
                onClick={() => handleSelectPane("linked-file")}
                aria-current={currentPane === "linked-file" ? true : undefined}
              >
                関連ファイル
              </SideNavigation.Item>
              <SideNavigation.Item
                icon={LfArchive}
                onClick={() => handleSelectPane("linked-case")}
                aria-current={currentPane === "linked-case" ? true : undefined}
              >
                関連案件
              </SideNavigation.Item>
            </SideNavigation.Group>
            <SideNavigation.Group>
              <SideNavigation.Item
                icon={LfScaleBalanced}
                onClick={() => handleSelectPane("reference")}
                aria-current={currentPane === "reference" ? true : undefined}
              >
                参考情報
              </SideNavigation.Item>
              <SideNavigation.Item
                icon={LfBook}
                onClick={() => handleSelectPane("book")}
                aria-current={currentPane === "book" ? true : undefined}
              >
                参考資料
              </SideNavigation.Item>
            </SideNavigation.Group>
          </SideNavigation>
        </PageLayoutSidebar>
      </PageLayout>
    </div>
  );
};
