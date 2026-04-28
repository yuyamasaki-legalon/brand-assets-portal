import {
  LfArchive,
  LfAt,
  LfBarSparkles,
  LfCheckBook,
  LfClip,
  LfDownload,
  LfEllipsisDot,
  LfFile,
  LfFileLines,
  LfFileSigned,
  LfFilesLine,
  LfFilter,
  LfFilterAlt,
  LfHome,
  LfMagnifyingGlass,
  LfMail,
  LfPen,
  LfPlusLarge,
  LfReplyAlt,
  LfWriting,
} from "@legalforce/aegis-icons";
import {
  ActionList,
  Avatar,
  Badge,
  Button,
  Checkbox,
  ContentHeader,
  DataTable,
  DataTableCell,
  type DataTableColumnDef,
  DateField,
  Divider,
  Drawer,
  Form,
  FormControl,
  Icon,
  IconButton,
  Link,
  Menu,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutStickyContainer,
  RangeDateField,
  Search,
  Select,
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarInset,
  SidebarNavigation,
  SidebarNavigationItem,
  SidebarNavigationLink,
  SidebarProvider,
  SidebarTrigger,
  StatusLabel,
  Switch,
  Tab,
  Table,
  TableContainer,
  Tag,
  TagGroup,
  TagPicker,
  Text,
  Textarea,
  TextField,
  Toolbar,
  ToolbarSpacer,
  Tooltip,
} from "@legalforce/aegis-react";
import type { CSSProperties } from "react";
import { useRef, useState } from "react";

// サンプルデータ（ダミー）
const sampleCases = [
  {
    id: "2024-03-0020",
    title: "業務委託契約書のレビュー依頼",
    status: "法務確認中",
    dueDate: "2024/11/08",
    updatedAt: "2025/10/22 18:30",
    requester: "山田 太郎",
    department: "営業部",
  },
  {
    id: "2024-06-0008",
    title: "秘密保持契約書の確認",
    status: "依頼者確認待ち",
    dueDate: "2024/12/15",
    updatedAt: "2025/10/15 17:11",
    requester: "佐藤 花子",
    department: "開発部",
  },
  {
    id: "2025-09-0002",
    title: "新規取引先との基本契約書作成",
    status: "対応中",
    dueDate: "2025/01/20",
    updatedAt: "2025/09/04 13:29",
    requester: "鈴木 一郎",
    department: "経理部",
  },
  {
    id: "2025-08-0052",
    title: "サービス利用規約の改定",
    status: "未着手",
    dueDate: "2025/08/29",
    updatedAt: "2025/08/27 15:07",
    requester: "田中 美咲",
    department: "企画部",
  },
  {
    id: "2025-08-0051",
    title: "ライセンス契約に関する相談",
    status: "完了",
    dueDate: "2025/09/10",
    updatedAt: "2025/08/27 15:06",
    requester: "高橋 健太",
    department: "開発部",
  },
  {
    id: "2025-08-0023",
    title: "個人情報取扱いに関する法務相談",
    status: "法務確認中",
    dueDate: "2025/08/31",
    updatedAt: "2025/08/13 16:19",
    requester: "伊藤 さくら",
    department: "人事部",
  },
  {
    id: "2025-08-0014",
    title: "商標登録に関する確認",
    status: "差戻し",
    dueDate: "2025/09/05",
    updatedAt: "2025/08/07 13:23",
    requester: "渡辺 大輔",
    department: "マーケティング部",
  },
  {
    id: "2025-07-0107",
    title: "海外取引に関する契約書確認",
    status: "対応中",
    dueDate: "2025/08/15",
    updatedAt: "2025/07/30 09:24",
    requester: "中村 翔",
    department: "海外事業部",
  },
  {
    id: "2025-07-0092",
    title: "労働契約書のテンプレート作成",
    status: "依頼者確認待ち",
    dueDate: "2025/07/28",
    updatedAt: "2025/07/24 10:55",
    requester: "小林 愛",
    department: "人事部",
    hasUnread: true,
  },
  {
    id: "2025-07-0086",
    title: "知的財産権に関する相談",
    status: "未着手",
    dueDate: "2025/07/25",
    updatedAt: "2025/07/18 18:37",
    requester: "加藤 誠",
    department: "研究開発部",
    hasUnread: true,
  },
  {
    id: "2025-07-0085",
    title: "取引先との紛争対応",
    status: "法務確認中",
    dueDate: "2025/07/31",
    updatedAt: "2025/07/18 18:35",
    requester: "吉田 恵",
    department: "営業部",
    hasUnread: true,
  },
];

const statusCounts = [
  { label: "法務確認中", count: 45 },
  { label: "依頼者確認待ち", count: 28 },
  { label: "未着手", count: 156 },
  { label: "対応中", count: 37 },
  { label: "完了", count: 999, isOverflow: true },
  { label: "差戻し", count: 8 },
];

// フィルター用のサンプルオプション
const statusOptions = [
  { label: "法務確認中", value: "legal_review" },
  { label: "依頼者確認待ち", value: "requester_pending" },
  { label: "未着手", value: "not_started" },
  { label: "対応中", value: "in_progress" },
  { label: "完了", value: "completed" },
  { label: "差戻し", value: "returned" },
];

const classificationOptions = [
  { label: "契約書レビュー", value: "contract_review" },
  { label: "法務相談", value: "legal_consultation" },
  { label: "訴訟対応", value: "litigation" },
  { label: "その他", value: "other" },
];

const assigneeOptions = [
  { label: "Taro Yamada", value: "yamada" },
  { label: "Hanako Sato", value: "sato" },
  { label: "Ichiro Suzuki", value: "suzuki" },
  { label: "Jiro Tanaka", value: "tanaka" },
  { label: "Saburo Kato", value: "kato" },
];

const departmentOptions = [
  { label: "QA", value: "qa" },
  { label: "法マネ", value: "legal_mane" },
  { label: "test2", value: "test2" },
  { label: "未入力", value: "none" },
];

// 案件詳細用のデータ
const caseDetailData = {
  overview:
    "新規取引先との業務委託契約書について、リスク条項の確認をお願いします。特に損害賠償の上限条項と秘密保持義務の範囲についてご確認いただきたいです。\n\n取引先からの要望により、支払条件を月末締め翌月末払いから翌々月15日払いに変更する案が出ています。契約期間も1年から2年に延長予定です。\n\n下記のドラフトを確認の上、問題になりそうな点があればご連絡ください。",
  url: "https://docs.google.com/document/d/1abc123xyz",
  space: "営業部スペース",
  mainAssignee: "山田 太郎",
  subAssignees: ["佐藤 花子", "鈴木 一郎"],
  dueDate: "2024-11-08",
};

const keywords = ["業務委託", "契約書レビュー", "リスク確認", "秘密保持", "損害賠償", "契約期間"];

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

const timelineEvents: TimelineEvent[] = [
  {
    id: "1",
    type: "mail",
    sender: "高橋 健太",
    date: "2024/10/22 18:30",
    subject: "【依頼者 → 法務】追加条件の確認依頼",
    content:
      "先日ご依頼した業務委託契約書について、取引先から追加の条件変更依頼がありました。支払条件と契約期間の変更に伴うリスクについてご確認ください。",
    attachments: ["業務委託契約書_v3.docx", "条件変更要望.pdf"],
    to: "legal@example.com",
  },
  {
    id: "2",
    type: "message",
    sender: "山田 太郎",
    date: "2024/10/22 14:15",
    content:
      "契約書を確認しました。損害賠償条項は上限金額の明記を推奨します。秘密保持条項は営業秘密に限定するか、具体的な情報カテゴリーを列挙する方向で調整できそうです。",
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

const linkedFiles = [
  { name: "業務委託契約書_v3.docx", updatedAt: "2024/10/21 17:02" },
  { name: "秘密保持契約書（NDA）.pdf", updatedAt: "2024/10/18 12:44" },
  { name: "条件変更要望.pdf", updatedAt: "2024/10/22 09:17" },
];

const relatedCases = [
  { id: "2024-02-0015", title: "基本契約書_取引先A", status: "完了" },
  { id: "2024-05-0031", title: "委託先B_契約条件変更", status: "対応中" },
];

// Drawer用スタイル
const drawerStyles: Record<string, CSSProperties> = {
  body: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-large)",
  },
  card: {
    padding: "var(--aegis-space-medium)",
    backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
    borderRadius: "var(--aegis-radius-medium)",
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-small)",
  },
  keywordSection: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-xxSmall)",
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
  },
  timelineList: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-large)",
  },
  timelineEvent: {
    display: "flex",
    alignItems: "flex-start",
    gap: "var(--aegis-space-small)",
  },
  eventBody: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-xSmall)",
    width: "100%",
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
  linkedItem: {
    display: "flex",
    alignItems: "center",
    gap: "var(--aegis-space-small)",
    padding: "var(--aegis-space-small)",
    border: "1px solid var(--aegis-color-border-default)",
    borderRadius: "var(--aegis-radius-medium)",
  },
};

// DataTable用の型定義
type CaseRow = (typeof sampleCases)[number];

// DataTable用のカラム定義
const dataTableColumns: DataTableColumnDef<CaseRow, string>[] = [
  {
    id: "id",
    name: "案件番号",
    getValue: (row): string => row.id,
    sortable: true,
  },
  {
    id: "title",
    name: "案件名",
    getValue: (row): string => row.title,
    sortable: true,
  },
  {
    id: "status",
    name: "案件ステータス",
    getValue: (row): string => row.status,
    renderCell: ({ value }) => (
      <DataTableCell>
        <Select
          options={statusOptions}
          defaultValue={statusOptions.find((opt) => opt.label === value)?.value}
          placeholder="選択してください"
        />
      </DataTableCell>
    ),
    sortable: true,
  },
  {
    id: "dueDate",
    name: "納期",
    getValue: (row): string => row.dueDate,
    sortable: true,
  },
  {
    id: "updatedAt",
    name: "更新日時",
    getValue: (row): string => row.updatedAt,
    sortable: true,
  },
  {
    id: "requester",
    name: "依頼者",
    getValue: (row): string => row.requester,
    renderCell: ({ value }) => <DataTableCell leading={<Avatar size="xSmall" name={value} />}>{value}</DataTableCell>,
    sortable: true,
  },
  {
    id: "department",
    name: "依頼部署",
    getValue: (row): string => row.department,
    sortable: true,
  },
];

// 統計アイテムコンポーネント
function SegmentItem({ label, count }: { label: string; count: number }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column-reverse",
        justifyContent: "center",
      }}
    >
      <dt style={{ textAlign: "center" }}>
        <Text variant="body.medium" color="subtle" whiteSpace="nowrap">
          {label}
        </Text>
      </dt>
      <dd style={{ margin: 0, textAlign: "center" }}>
        <Text variant="body.xxLarge.bold">{count < 1000 ? count : "999+"}</Text>
      </dd>
    </div>
  );
}

export const LocCaseClaude = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseRow | null>(null);
  const [showAllHistory, setShowAllHistory] = useState(true);
  const [messageValue, setMessageValue] = useState("");
  const [caseType, setCaseType] = useState("contract_review");
  const [status, setStatus] = useState("legal_review");
  const [assignee, setAssignee] = useState("yamada");
  const [department, setDepartment] = useState("sales");
  // biome-ignore lint/style/noNonNullAssertion: Drawer component requires non-null RefObject
  const drawerRoot = useRef<HTMLDivElement>(null!);

  const handleRowClick = (caseItem: CaseRow) => {
    setSelectedCase(caseItem);
    setDetailDrawerOpen(true);
  };

  const messageLengthLabel = `${messageValue.length} / 4000`;
  const visibleTimelineEvents = showAllHistory
    ? timelineEvents
    : timelineEvents.filter((event) => event.type !== "status");

  const renderTimelineEvent = (event: TimelineEvent) => {
    if (event.type === "mail") {
      return (
        <div key={event.id} style={drawerStyles.timelineEvent}>
          <Icon size="large">
            <LfMail />
          </Icon>
          <div style={drawerStyles.externalCard}>
            <div style={drawerStyles.mailCardHeader}>
              <Avatar size="xSmall" name={event.sender} />
              <div style={drawerStyles.mailHeaderText}>
                <Text variant="body.medium.bold">{event.sender}</Text>
                <Text variant="data.medium" color="subtle">
                  {event.date}
                </Text>
              </div>
              <div style={drawerStyles.mailToolbar}>
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
            <div style={drawerStyles.attachmentRow}>
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
        <div key={event.id} style={drawerStyles.timelineEvent}>
          <Icon size="large">
            <LfBarSparkles />
          </Icon>
          <div style={drawerStyles.eventBody}>
            <div style={drawerStyles.eventHeader}>
              <Text variant="body.medium.bold">{event.content}</Text>
              <div style={drawerStyles.eventMeta}>
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
      <div key={event.id} style={drawerStyles.timelineEvent}>
        <Avatar size="xSmall" name={event.sender} />
        <div style={drawerStyles.eventBody}>
          <div style={drawerStyles.eventHeader}>
            <Text variant="body.medium.bold">{event.sender}</Text>
            <div style={drawerStyles.eventMeta}>
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

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarBody>
          <SidebarNavigation>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfHome />
                  </Icon>
                }
              >
                ダッシュボード
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfMagnifyingGlass />
                  </Icon>
                }
              >
                検索
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfMagnifyingGlass />
                  </Icon>
                }
              >
                アシスタント
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                aria-current="page"
                leading={
                  <Icon>
                    <LfArchive />
                  </Icon>
                }
              >
                案件
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfFileLines />
                  </Icon>
                }
              >
                契約書
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
                電子契約
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfFileSigned />
                  </Icon>
                }
              >
                締結済契約書
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfFilesLine />
                  </Icon>
                }
              >
                ひな形
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
                契約書再生産
              </SidebarNavigationLink>
            </SidebarNavigationItem>
            <SidebarNavigationItem>
              <SidebarNavigationLink
                href="#"
                leading={
                  <Icon>
                    <LfEllipsisDot />
                  </Icon>
                }
              >
                その他
              </SidebarNavigationLink>
            </SidebarNavigationItem>
          </SidebarNavigation>
        </SidebarBody>
      </Sidebar>
      <SidebarInset>
        <PageLayout>
          <PageLayoutContent>
            <PageLayoutHeader>
              <ContentHeader
                trailing={
                  <div
                    style={{
                      display: "flex",
                      gap: "var(--aegis-space-xxSmall)",
                    }}
                  >
                    <Button leading={LfPlusLarge} variant="solid" size="medium">
                      案件を作成
                    </Button>
                    <Tooltip title="メール">
                      <IconButton aria-label="メール">
                        <Icon>
                          <LfMail />
                        </Icon>
                      </IconButton>
                    </Tooltip>
                  </div>
                }
              >
                <ContentHeader.Title>案件</ContentHeader.Title>
              </ContentHeader>
            </PageLayoutHeader>
            <PageLayoutBody>
              {/* 統計カード部分 */}
              <div
                style={{
                  display: "flex",
                  gap: "var(--aegis-space-large)",
                  alignItems: "flex-start",
                  paddingBlock: "var(--aegis-space-xSmall)",
                  margin: 0,
                }}
              >
                <dl style={{ margin: 0 }}>
                  <SegmentItem label="案件担当者が未入力" count={852} />
                </dl>

                <Divider orientation="vertical" style={{ alignSelf: "stretch" }} />

                <dl
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "var(--aegis-space-large)",
                    margin: 0,
                  }}
                >
                  {statusCounts.map((item) => (
                    <SegmentItem key={item.label} label={item.label} count={item.count} />
                  ))}
                </dl>
              </div>

              {/* タブとテーブル */}
              <Tab.Group variant="plain">
                <PageLayoutStickyContainer>
                  <Toolbar>
                    <div style={{ overflow: "hidden" }}>
                      <Tab.List>
                        <Tab trailing={<Badge color="danger" count={23} />}>
                          <div
                            style={{
                              inlineSize: "max-content",
                              maxInlineSize: "240px",
                            }}
                          >
                            <Text whiteSpace="nowrap" numberOfLines={1}>
                              すべて
                            </Text>
                          </div>
                        </Tab>
                        <Tab>
                          <div
                            style={{
                              inlineSize: "max-content",
                              maxInlineSize: "240px",
                            }}
                          >
                            <Text whiteSpace="nowrap" numberOfLines={1}>
                              案件担当者が未入力
                            </Text>
                          </div>
                        </Tab>
                        <Tab trailing={<Badge color="danger" count={21} />}>
                          <div
                            style={{
                              inlineSize: "max-content",
                              maxInlineSize: "240px",
                            }}
                          >
                            <Text whiteSpace="nowrap" numberOfLines={1}>
                              担当中
                            </Text>
                          </div>
                        </Tab>
                        <Tab>
                          <div
                            style={{
                              inlineSize: "max-content",
                              maxInlineSize: "240px",
                            }}
                          >
                            <Text whiteSpace="nowrap" numberOfLines={1}>
                              無題のタブ
                            </Text>
                          </div>
                        </Tab>
                        <Tab>
                          <div
                            style={{
                              inlineSize: "max-content",
                              maxInlineSize: "240px",
                            }}
                          >
                            <Text whiteSpace="nowrap" numberOfLines={1}>
                              DataTable
                            </Text>
                          </div>
                        </Tab>
                        <Tab>+</Tab>
                      </Tab.List>
                    </div>
                    <ToolbarSpacer />
                    <Button
                      variant={filterOpen ? "subtle" : "plain"}
                      leading={
                        <Icon>
                          <LfFilter />
                        </Icon>
                      }
                      onClick={() => setFilterOpen(true)}
                    >
                      フィルター
                    </Button>
                    <Search placeholder="検索" shrinkOnBlur />
                    <Menu placement="bottom-end">
                      <Menu.Anchor>
                        <Tooltip title="その他のオプション" placement="top">
                          <IconButton size="medium" aria-label="その他のオプション">
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
                              <ActionList.Body leading={LfFilterAlt} aria-label="表示項目をカスタマイズ">
                                表示項目をカスタマイズ
                              </ActionList.Body>
                            </ActionList.Item>
                          </ActionList.Group>
                          <ActionList.Group>
                            <ActionList.Item>
                              <ActionList.Body leading={LfDownload} aria-label="CSVをダウンロード">
                                CSVをダウンロード
                              </ActionList.Body>
                            </ActionList.Item>
                          </ActionList.Group>
                        </ActionList>
                      </Menu.Box>
                    </Menu>
                  </Toolbar>
                </PageLayoutStickyContainer>

                <Tab.Panels ref={drawerRoot}>
                  <Tab.Panel>
                    <TableContainer stickyHeader>
                      <Table>
                        <Table.Head>
                          <Table.Row>
                            <Table.BadgeCell />
                            <Table.Cell as="th">案件番号</Table.Cell>
                            <Table.Cell as="th">案件名</Table.Cell>
                            <Table.Cell as="th">案件ステータス</Table.Cell>
                            <Table.Cell as="th">
                              <Table.SortLabel>納期</Table.SortLabel>
                            </Table.Cell>
                            <Table.Cell as="th">
                              <Table.SortLabel direction="desc">更新日時</Table.SortLabel>
                            </Table.Cell>
                            <Table.Cell as="th">依頼者</Table.Cell>
                            <Table.Cell as="th">依頼部署</Table.Cell>
                          </Table.Row>
                        </Table.Head>
                        <Table.Body>
                          {sampleCases.map((caseItem) => (
                            <Table.Row
                              key={caseItem.id}
                              style={{ cursor: "pointer" }}
                              onClick={() => handleRowClick(caseItem)}
                            >
                              <Table.BadgeCell invisible={!caseItem.hasUnread} />
                              <Table.Cell>{caseItem.id}</Table.Cell>
                              <Table.Cell maxWidth="medium">
                                <Tooltip title={caseItem.title} placement="top-start" onlyOnOverflow>
                                  <Text>{caseItem.title}</Text>
                                </Tooltip>
                              </Table.Cell>
                              <Table.Cell>
                                <StatusLabel>{caseItem.status}</StatusLabel>
                              </Table.Cell>
                              <Table.Cell>
                                <Text variant="component.medium">{caseItem.dueDate}</Text>
                              </Table.Cell>
                              <Table.Cell>
                                <Text variant="component.medium">{caseItem.updatedAt}</Text>
                              </Table.Cell>
                              <Table.Cell>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "var(--aegis-space-xSmall)",
                                  }}
                                >
                                  <Avatar size="xSmall" name={caseItem.requester} />
                                  <Text variant="component.medium">{caseItem.requester}</Text>
                                </div>
                              </Table.Cell>
                              <Table.Cell>
                                <Text variant="component.medium">{caseItem.department}</Text>
                              </Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table>
                    </TableContainer>
                  </Tab.Panel>
                  <Tab.Panel>
                    <Text>案件担当者が未入力タブの内容</Text>
                  </Tab.Panel>
                  <Tab.Panel>
                    <Text>担当中タブの内容</Text>
                  </Tab.Panel>
                  <Tab.Panel>
                    <Text>無題のタブの内容</Text>
                  </Tab.Panel>
                  <Tab.Panel>
                    <DataTable
                      columns={dataTableColumns}
                      rows={sampleCases}
                      getRowId={(row) => row.id}
                      stickyHeader
                      defaultSorting={[{ id: "updatedAt", desc: true }]}
                    />
                  </Tab.Panel>
                  <Tab.Panel>
                    <Text>新規タブ追加</Text>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </PageLayoutBody>
          </PageLayoutContent>

          {/* フィルター Drawer */}
          <Drawer open={filterOpen} onOpenChange={setFilterOpen} position="end" root={drawerRoot} lockScroll={false}>
            <Drawer.Header>
              <ContentHeader>
                <ContentHeader.Title>フィルター</ContentHeader.Title>
              </ContentHeader>
            </Drawer.Header>
            <Drawer.Body>
              <Form>
                {/* 案件番号 */}
                <FormControl>
                  <FormControl.Label>案件番号/案件名</FormControl.Label>
                  <FormControl.Toolbar ghost>
                    <Button size="xSmall" variant="gutterless">
                      クリア
                    </Button>
                  </FormControl.Toolbar>
                  <TextField placeholder="案件番号または案件名を入力" />
                </FormControl>

                {/* 案件タイプ */}
                <FormControl>
                  <FormControl.Label>案件タイプ</FormControl.Label>
                  <FormControl.Toolbar ghost>
                    <Button size="xSmall" variant="gutterless">
                      クリア
                    </Button>
                  </FormControl.Toolbar>
                  <Select placeholder="選択してください" options={classificationOptions} />
                </FormControl>

                {/* 案件ステータス */}
                <FormControl>
                  <FormControl.Label>案件ステータス</FormControl.Label>
                  <FormControl.Toolbar ghost>
                    <Button size="xSmall" variant="gutterless">
                      クリア
                    </Button>
                  </FormControl.Toolbar>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--aegis-space-xSmall)",
                    }}
                  >
                    <TagPicker options={statusOptions} placeholder="選択してください" />
                    <Checkbox>クローズした案件を除く</Checkbox>
                  </div>
                </FormControl>

                <Divider />

                {/* 主担当者 */}
                <FormControl>
                  <FormControl.Label>主担当者</FormControl.Label>
                  <FormControl.Toolbar ghost>
                    <Button size="xSmall" variant="gutterless">
                      クリア
                    </Button>
                  </FormControl.Toolbar>
                  <Select placeholder="選択してください" options={assigneeOptions} />
                </FormControl>

                {/* 副担当者 */}
                <FormControl>
                  <FormControl.Label>副担当者</FormControl.Label>
                  <FormControl.Toolbar ghost>
                    <Button size="xSmall" variant="gutterless">
                      クリア
                    </Button>
                  </FormControl.Toolbar>
                  <TagPicker options={assigneeOptions} placeholder="選択してください" />
                </FormControl>

                <Divider />

                {/* 依頼部署 */}
                <FormControl>
                  <FormControl.Label>依頼部署</FormControl.Label>
                  <FormControl.Toolbar ghost>
                    <Button size="xSmall" variant="gutterless">
                      クリア
                    </Button>
                  </FormControl.Toolbar>
                  <Select placeholder="選択してください" options={departmentOptions} />
                </FormControl>

                {/* 依頼者 */}
                <FormControl>
                  <FormControl.Label>依頼者</FormControl.Label>
                  <FormControl.Toolbar ghost>
                    <Button size="xSmall" variant="gutterless">
                      クリア
                    </Button>
                  </FormControl.Toolbar>
                  <Select placeholder="選択してください" options={assigneeOptions} />
                </FormControl>

                <Divider />

                {/* 納期 */}
                <FormControl>
                  <FormControl.Label>納期</FormControl.Label>
                  <FormControl.Toolbar ghost>
                    <Button size="xSmall" variant="gutterless">
                      クリア
                    </Button>
                  </FormControl.Toolbar>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--aegis-space-xSmall)",
                    }}
                  >
                    <RangeDateField />
                    <Checkbox>今日を起点に相対指定</Checkbox>
                  </div>
                </FormControl>

                {/* 作成日時 */}
                <FormControl>
                  <FormControl.Label>作成日時</FormControl.Label>
                  <FormControl.Toolbar ghost>
                    <Button size="xSmall" variant="gutterless">
                      クリア
                    </Button>
                  </FormControl.Toolbar>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--aegis-space-xSmall)",
                    }}
                  >
                    <RangeDateField />
                    <Checkbox>今日を起点に相対指定</Checkbox>
                  </div>
                </FormControl>

                {/* 更新日時 */}
                <FormControl>
                  <FormControl.Label>更新日時</FormControl.Label>
                  <FormControl.Toolbar ghost>
                    <Button size="xSmall" variant="gutterless">
                      クリア
                    </Button>
                  </FormControl.Toolbar>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--aegis-space-xSmall)",
                    }}
                  >
                    <RangeDateField />
                    <Checkbox>今日を起点に相対指定</Checkbox>
                  </div>
                </FormControl>
              </Form>
            </Drawer.Body>
            <Divider />
            <Drawer.Footer>
              <div style={{ marginLeft: "auto" }}>
                <Button variant="subtle" onClick={() => setFilterOpen(false)}>
                  フィルターをリセット
                </Button>
              </div>
            </Drawer.Footer>
          </Drawer>

          {/* 案件詳細 Drawer */}
          <Drawer
            open={detailDrawerOpen}
            onOpenChange={setDetailDrawerOpen}
            position="end"
            width="xLarge"
            root={drawerRoot}
            lockScroll={false}
          >
            <Drawer.Header>
              <ContentHeader size="small">
                <ContentHeader.Description variant="data">{selectedCase?.id}</ContentHeader.Description>
                <ContentHeader.Title>{selectedCase?.title}</ContentHeader.Title>
              </ContentHeader>
            </Drawer.Header>

            <Drawer.Body>
              <div style={drawerStyles.body}>
                {/* 案件概要カード */}
                <section style={drawerStyles.card}>
                  <ContentHeader
                    size="small"
                    trailing={
                      <Button leading={LfPen} variant="subtle" size="small">
                        編集
                      </Button>
                    }
                  >
                    <ContentHeader.Title>
                      <Text variant="title.xxSmall">案件概要</Text>
                    </ContentHeader.Title>
                  </ContentHeader>
                  <Text variant="component.medium" whiteSpace="pre-wrap">
                    {caseDetailData.overview}
                    {"\n\n"}
                    <Link href={caseDetailData.url} target="_blank" rel="noreferrer">
                      {caseDetailData.url}
                    </Link>
                  </Text>
                </section>

                {/* 案件キーワード */}
                <section style={drawerStyles.keywordSection}>
                  <Text as="h4" variant="label.medium.bold">
                    案件キーワード
                  </Text>
                  <TagGroup>
                    {keywords.map((keyword) => (
                      <Tag key={keyword} variant="fill" color="neutral">
                        {keyword}
                      </Tag>
                    ))}
                  </TagGroup>
                </section>

                <Divider />

                {/* Tab切り替え: 案件情報 / タイムライン */}
                <Tab.Group>
                  <Tab.List>
                    <Tab>案件情報</Tab>
                    <Tab>タイムライン</Tab>
                    <Tab>関連ファイル</Tab>
                    <Tab>関連案件</Tab>
                  </Tab.List>
                  <Tab.Panels>
                    {/* 案件情報タブ */}
                    <Tab.Panel>
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
                            {caseDetailData.subAssignees.map((name) => (
                              <Text key={name} variant="body.medium">
                                {name}
                              </Text>
                            ))}
                          </div>
                        </FormControl>
                        <FormControl>
                          <FormControl.Label>依頼部署</FormControl.Label>
                          <Select
                            options={departmentOptions}
                            value={department}
                            onChange={(value) => setDepartment(value)}
                          />
                        </FormControl>
                        <FormControl>
                          <FormControl.Label>依頼者</FormControl.Label>
                          <Text variant="body.medium">{selectedCase?.requester}</Text>
                        </FormControl>
                        <FormControl>
                          <FormControl.Label>納期</FormControl.Label>
                          <DateField defaultValue={new Date(caseDetailData.dueDate)} />
                        </FormControl>
                        <FormControl>
                          <FormControl.Label>保存先</FormControl.Label>
                          <Text variant="body.medium">{caseDetailData.space}</Text>
                        </FormControl>
                      </Form>
                    </Tab.Panel>

                    {/* タイムラインタブ */}
                    <Tab.Panel>
                      <div style={drawerStyles.timelineContainer}>
                        {/* メッセージ入力フォーム */}
                        <div style={drawerStyles.messageForm}>
                          <div style={drawerStyles.messageToolbar}>
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
                          <div style={drawerStyles.messageActions}>
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
                              <Button variant="solid" disabled={messageValue.trim().length === 0}>
                                投稿
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* 履歴表示切り替え */}
                        <div style={drawerStyles.timelineToolbar}>
                          <Switch
                            labelPosition="start"
                            checked={showAllHistory}
                            onChange={(event) => setShowAllHistory(event.target.checked)}
                          >
                            履歴を表示
                          </Switch>
                        </div>

                        <Divider />

                        {/* タイムラインリスト */}
                        <div style={drawerStyles.timelineList}>
                          {visibleTimelineEvents.map((event) => renderTimelineEvent(event))}
                        </div>
                      </div>
                    </Tab.Panel>

                    {/* 関連ファイルタブ */}
                    <Tab.Panel>
                      <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
                        {linkedFiles.map((file) => (
                          <div key={file.name} style={drawerStyles.linkedItem}>
                            <Icon size="medium">
                              <LfFile />
                            </Icon>
                            <div
                              style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xxSmall)" }}
                            >
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
                    </Tab.Panel>

                    {/* 関連案件タブ */}
                    <Tab.Panel>
                      <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
                        {relatedCases.map((item) => (
                          <div key={item.id} style={drawerStyles.linkedItem}>
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
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </div>
            </Drawer.Body>

            <Divider />
            <Drawer.Footer>
              <div style={{ marginLeft: "auto" }}>
                <Button variant="subtle" onClick={() => setDetailDrawerOpen(false)}>
                  閉じる
                </Button>
              </div>
            </Drawer.Footer>
          </Drawer>
        </PageLayout>
      </SidebarInset>
    </SidebarProvider>
  );
};
