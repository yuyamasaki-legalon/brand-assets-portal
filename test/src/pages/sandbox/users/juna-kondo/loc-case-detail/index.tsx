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
  LfInformationCircle,
  LfLink,
  LfMagnifyingGlass,
  LfMail,
  LfMegaphone,
  LfMenu,
  LfPen,
  LfPlusSmall,
  LfQuestionCircle,
  LfReplyAlt,
  LfScaleBalanced,
  LfTrash,
  LfWand,
  LfWriting,
} from "@legalforce/aegis-icons";
import { SlackLogo } from "@legalforce/aegis-logos/react";
import {
  ActionList,
  Avatar,
  Badge,
  BottomSheet,
  Button,
  ButtonGroup,
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
  Popover,
  Select,
  SideNavigation,
  Switch,
  Tab,
  Tag,
  TagGroup,
  TagPicker,
  Text,
  Textarea,
  TextField,
  Toolbar,
  Tooltip,
} from "@legalforce/aegis-react";
import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type PaneType = "case-attribute" | "case-summary" | "linked-file" | "linked-case" | "reference" | "book";

type Reaction = {
  emoji: string;
  count: number;
  reacted: boolean;
};

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
      reactions?: Reaction[];
    }
  | {
      id: string;
      type: "message";
      sender: string;
      date: string;
      content: string;
      reactions?: Reaction[];
    }
  | {
      id: string;
      type: "caseCreate";
      timestamp: string;
      creator: string;
    }
  | {
      id: string;
      type: "titleUpdate";
      oldTitle: string;
      newTitle: string;
      updatedBy: string;
      timestamp: string;
    }
  | {
      id: string;
      type: "assigneeUpdate";
      previousAssignee: string;
      newAssignee: string;
      updatedBy: string;
      timestamp: string;
    }
  | {
      id: string;
      type: "dueDateUpdate";
      oldDate: string;
      newDate: string;
      updatedBy: string;
      timestamp: string;
    }
  | {
      id: string;
      type: "statusChange";
      oldStatus: string;
      newStatus: string;
      updatedBy: string;
      timestamp: string;
    }
  | {
      id: string;
      type: "slackMessage";
      channel: string;
      sender: string;
      content: string;
      timestamp: string;
      reactions?: Reaction[];
    }
  | {
      id: string;
      type: "recommendation";
      title: string;
      description: string;
      recommendationType: "case" | "document";
      timestamp: string;
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
      "先日ご依頼した業務委託契約書について、取引先から追加の条件変更依頼がありました。支払条件と契約期間の変更に伴うリスクについてご確認ください。",
    attachments: ["業務委託契約書_v3.docx", "条件変更要望.pdf"],
    to: "legal@example.com",
    reactions: [
      { emoji: "👍", count: 2, reacted: true },
      { emoji: "✅", count: 1, reacted: false },
    ],
  },
  {
    id: "2",
    type: "message",
    sender: "山田 太郎",
    date: "2024/10/22 14:15",
    content:
      "契約書を確認しました。損害賠償条項は上限金額の明記を推奨します。秘密保持条項は営業秘密に限定するか、具体的な情報カテゴリーを列挙する方向で調整できそうです。",
    reactions: [
      { emoji: "👍", count: 3, reacted: false },
      { emoji: "❤️", count: 1, reacted: true },
    ],
  },
  {
    id: "3",
    type: "statusChange",
    oldStatus: "未着手",
    newStatus: "対応中",
    updatedBy: "山田 太郎",
    timestamp: "2024/10/21 09:12",
  },
  {
    id: "4",
    type: "recommendation",
    title: "類似案件: 基本契約書_取引先A",
    description: "過去の類似案件で損害賠償条項の上限金額を委託料の3ヶ月分に設定した事例があります。",
    recommendationType: "case",
    timestamp: "2024/10/21 09:00",
  },
  {
    id: "5",
    type: "slackMessage",
    channel: "#contract-review",
    sender: "佐藤 花子",
    content: "高橋さんから依頼のあった業務委託契約書、午後にレビュー開始しますね。",
    timestamp: "2024/10/20 17:45",
    reactions: [{ emoji: "👍", count: 1, reacted: false }],
  },
  {
    id: "6",
    type: "assigneeUpdate",
    previousAssignee: "佐藤 花子",
    newAssignee: "山田 太郎",
    updatedBy: "佐藤 花子",
    timestamp: "2024/10/20 14:30",
  },
  {
    id: "7",
    type: "dueDateUpdate",
    oldDate: "2024/11/01",
    newDate: "2024/11/08",
    updatedBy: "高橋 健太",
    timestamp: "2024/10/19 16:00",
  },
  {
    id: "8",
    type: "titleUpdate",
    oldTitle: "業務委託契約書のレビュー",
    newTitle: "業務委託契約書のレビュー依頼",
    updatedBy: "高橋 健太",
    timestamp: "2024/10/18 11:30",
  },
  {
    id: "9",
    type: "recommendation",
    title: "参考: 秘密保持契約書テンプレート",
    description: "秘密保持条項の記載例として、弊社標準テンプレートをご参照ください。",
    recommendationType: "document",
    timestamp: "2024/10/18 10:00",
  },
  {
    id: "10",
    type: "caseCreate",
    timestamp: "2024/10/18 09:30",
    creator: "高橋 健太",
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

// メールアドレス（送信元・宛先用）
const emailAddressOptions = [
  { label: "legal@example.com", value: "legal@example.com" },
  { label: "sales@example.com", value: "sales@example.com" },
  { label: "support@example.com", value: "support@example.com" },
  { label: "takahashi@example.com", value: "takahashi@example.com" },
  { label: "yamada@example.com", value: "yamada@example.com" },
];

// Slackチャンネル
const slackChannelOptions = [
  { label: "#contract-review", value: "contract-review" },
  { label: "#legal-general", value: "legal-general" },
  { label: "#sales-support", value: "sales-support" },
];

// Slackユーザー（メンション用）
const slackUserOptions = [
  { label: "@yamada", value: "yamada" },
  { label: "@sato", value: "sato" },
  { label: "@suzuki", value: "suzuki" },
  { label: "@takahashi", value: "takahashi" },
];

// メールスレッド一覧
const mailThreads = [
  {
    id: "thread-1",
    subject: "【依頼者 → 法務】追加条件の確認依頼",
    messageCount: 3,
    latestDate: "2024/10/22 18:30",
  },
  {
    id: "thread-2",
    subject: "【法務 → 依頼者】契約書レビュー完了のお知らせ",
    messageCount: 2,
    latestDate: "2024/10/21 14:15",
  },
  {
    id: "thread-3",
    subject: "【依頼】業務委託契約書のレビュー",
    messageCount: 1,
    latestDate: "2024/10/18 09:30",
  },
];

// メールメッセージ型
type MailMessage = {
  id: string;
  sender: string;
  from: string;
  to: string[];
  cc: string[];
  date: string;
  subject: string;
  content: string;
  attachments: string[];
};

// スレッド内メール一覧
const mailMessagesData: Record<string, MailMessage[]> = {
  "thread-1": [
    {
      id: "mail-1-1",
      sender: "高橋 健太",
      from: "takahashi@example.com",
      to: ["legal@example.com"],
      cc: ["manager@example.com"],
      date: "2024/10/22 18:30",
      subject: "【依頼者 → 法務】追加条件の確認依頼",
      content:
        "先日ご依頼した業務委託契約書について、取引先から追加の条件変更依頼がありました。支払条件と契約期間の変更に伴うリスクについてご確認ください。\n\n具体的には以下の点について確認をお願いします：\n1. 支払条件の変更（月末締め翌月末払い → 翌々月15日払い）\n2. 契約期間の延長（1年 → 2年）\n\nご多忙のところ恐れ入りますが、よろしくお願いいたします。",
      attachments: ["業務委託契約書_v3.docx", "条件変更要望.pdf"],
    },
    {
      id: "mail-1-2",
      sender: "山田 太郎",
      from: "legal@example.com",
      to: ["takahashi@example.com"],
      cc: [],
      date: "2024/10/22 14:00",
      subject: "Re: 【依頼者 → 法務】追加条件の確認依頼",
      content:
        "高橋様\n\nご連絡いただきありがとうございます。\n条件変更について確認いたしました。\n\n支払条件の変更については、キャッシュフローへの影響を考慮する必要があります。\n契約期間の延長については、解約条項の見直しも併せて検討することをお勧めします。\n\n詳細は添付資料をご確認ください。",
      attachments: ["リスク評価レポート.pdf"],
    },
    {
      id: "mail-1-3",
      sender: "高橋 健太",
      from: "takahashi@example.com",
      to: ["legal@example.com"],
      cc: [],
      date: "2024/10/21 10:30",
      subject: "【依頼者 → 法務】業務委託契約書について",
      content:
        "法務部 山田様\n\nお世話になっております。営業部の高橋です。\n\n新規取引先との業務委託契約書について、リスク確認をお願いしたくご連絡いたしました。\n添付ファイルをご確認いただき、問題点があればご指摘ください。\n\nよろしくお願いいたします。",
      attachments: ["業務委託契約書_draft.docx"],
    },
  ],
  "thread-2": [
    {
      id: "mail-2-1",
      sender: "山田 太郎",
      from: "legal@example.com",
      to: ["takahashi@example.com"],
      cc: ["sato@example.com"],
      date: "2024/10/21 14:15",
      subject: "【法務 → 依頼者】契約書レビュー完了のお知らせ",
      content:
        "高橋様\n\nお疲れ様です。法務部の山田です。\n\nご依頼いただいた契約書のレビューが完了いたしましたのでご報告いたします。\n\n主な指摘事項：\n・損害賠償条項の上限金額を明記することを推奨\n・秘密保持義務の範囲を具体化\n・契約解除条項の追加\n\n詳細は添付のレビューコメントをご確認ください。",
      attachments: ["契約書_レビューコメント付.docx"],
    },
    {
      id: "mail-2-2",
      sender: "高橋 健太",
      from: "takahashi@example.com",
      to: ["legal@example.com"],
      cc: [],
      date: "2024/10/20 16:45",
      subject: "Re: 【法務 → 依頼者】契約書レビュー完了のお知らせ",
      content:
        "山田様\n\nレビューありがとうございます。\nご指摘いただいた点について、取引先と調整いたします。\n\n進捗がありましたら改めてご連絡いたします。",
      attachments: [],
    },
  ],
  "thread-3": [
    {
      id: "mail-3-1",
      sender: "高橋 健太",
      from: "takahashi@example.com",
      to: ["legal@example.com"],
      cc: [],
      date: "2024/10/18 09:30",
      subject: "【依頼】業務委託契約書のレビュー",
      content:
        "法務部 御中\n\nお世話になっております。営業部の高橋です。\n\n新規案件の業務委託契約書について、レビューをお願いしたくご連絡いたしました。\n締め切りは10月25日を予定しております。\n\nお忙しいところ恐れ入りますが、よろしくお願いいたします。",
      attachments: ["業務委託契約書_初稿.docx"],
    },
  ],
};

const MAX_MAIL_CONTENT_HEIGHT_PX = 240;
const MAX_MAIL_CONTENT_EXPANDED_HEIGHT_PX = 400;

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
  reactionRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "var(--aegis-space-xxSmall)",
    marginTop: "var(--aegis-space-xSmall)",
  },
  reactionButton: {
    display: "flex",
    alignItems: "center",
    gap: "var(--aegis-space-xxSmall)",
    padding: "var(--aegis-space-xxSmall) var(--aegis-space-xSmall)",
    border: "1px solid var(--aegis-color-border-default)",
    borderRadius: "var(--aegis-radius-medium)",
    backgroundColor: "var(--aegis-color-surface-default)",
    cursor: "pointer",
    fontSize: "var(--aegis-font-size-small)",
  },
  reactionButtonActive: {
    display: "flex",
    alignItems: "center",
    gap: "var(--aegis-space-xxSmall)",
    padding: "var(--aegis-space-xxSmall) var(--aegis-space-xSmall)",
    border: "1px solid var(--aegis-color-border-information)",
    borderRadius: "var(--aegis-radius-medium)",
    backgroundColor: "var(--aegis-color-background-information-xSubtle)",
    cursor: "pointer",
    fontSize: "var(--aegis-font-size-small)",
  },
  historyEventSimple: {
    display: "flex",
    gap: "var(--aegis-space-small)",
  },
  historyEventTextContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-xSmall)",
  },
  knowledgeSuggestCard: {
    width: "100%",
    backgroundColor: "var(--aegis-color-surface-default)",
    borderRadius: "var(--aegis-radius-medium)",
    display: "flex",
    flexDirection: "column",
  },
  knowledgeSuggestHeader: {
    display: "flex",
    alignItems: "center",
    gap: "var(--aegis-space-xSmall)",
    paddingBottom: "var(--aegis-space-small)",
  },
  knowledgeSuggestContent: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-small)",
    padding: "var(--aegis-space-medium)",
    border: "1px solid var(--aegis-color-border-default)",
    borderRadius: "var(--aegis-radius-medium)",
  },
  knowledgeSuggestToggle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    background: "none",
    border: "none",
    padding: "0",
    cursor: "pointer",
  },
  knowledgeSuggestItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "var(--aegis-space-small)",
  },
  slackCard: {
    width: "100%",
    padding: "var(--aegis-space-small)",
    border: "1px solid var(--aegis-color-border-default)",
    borderRadius: "var(--aegis-radius-medium)",
    backgroundColor: "var(--aegis-color-surface-default)",
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-small)",
  },
  slackCardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "var(--aegis-space-small)",
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
};

const CaseDetailTemplate = () => {
  const navigate = useNavigate();
  const [paneType, setPaneType] = useState<PaneType>("case-attribute");
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
  const overviewRef = useRef<HTMLDivElement>(null);

  // 追加: 案件編集モード
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(caseData.title);
  const [editOverview, setEditOverview] = useState(caseData.overview);

  // 追加: メール作成フォーム
  const [isMailFormOpen, setIsMailFormOpen] = useState(false);
  const [mailFrom, setMailFrom] = useState("legal@example.com");
  const [mailTo, setMailTo] = useState<string[]>([]);
  const [mailCc, setMailCc] = useState<string[]>([]);
  const [mailSubject, setMailSubject] = useState("");
  const [mailBody, setMailBody] = useState("");

  // 追加: Slackメッセージ有無（設定フォーム表示切替用）
  const [hasSlackMessages, setHasSlackMessages] = useState(true);
  const [slackChannel, setSlackChannel] = useState("");
  const [slackMentions, setSlackMentions] = useState<string[]>([]);

  // 追加: メールスレッド表示用
  const [selectedMailThread, setSelectedMailThread] = useState<string | null>(null);
  const [expandedMails, setExpandedMails] = useState<Set<string>>(new Set());

  // 追加: AI レコメンド展開状態
  const [expandedRecommendations, setExpandedRecommendations] = useState<Set<string>>(new Set());

  // 追加: リアクション状態管理
  const [reactions, setReactions] = useState<Record<string, Reaction[]>>(() => {
    const initial: Record<string, Reaction[]> = {};
    for (const event of timelineEvents) {
      if ("reactions" in event && event.reactions) {
        initial[event.id] = event.reactions;
      }
    }
    return initial;
  });

  const toggleReaction = (eventId: string, emoji: string) => {
    setReactions((prev) => {
      const eventReactions = prev[eventId] ?? [];
      const existingIndex = eventReactions.findIndex((r) => r.emoji === emoji);
      if (existingIndex >= 0) {
        const existing = eventReactions[existingIndex];
        if (existing.reacted) {
          // Remove reaction
          if (existing.count === 1) {
            return {
              ...prev,
              [eventId]: eventReactions.filter((_, i) => i !== existingIndex),
            };
          }
          return {
            ...prev,
            [eventId]: eventReactions.map((r, i) =>
              i === existingIndex ? { ...r, count: r.count - 1, reacted: false } : r,
            ),
          };
        }
        // Add reaction
        return {
          ...prev,
          [eventId]: eventReactions.map((r, i) =>
            i === existingIndex ? { ...r, count: r.count + 1, reacted: true } : r,
          ),
        };
      }
      // New reaction
      return {
        ...prev,
        [eventId]: [...eventReactions, { emoji, count: 1, reacted: true }],
      };
    });
  };

  const toggleMailExpanded = (mailId: string) => {
    setExpandedMails((prev) => {
      const next = new Set(prev);
      if (next.has(mailId)) {
        next.delete(mailId);
      } else {
        next.add(mailId);
      }
      return next;
    });
  };

  const toggleRecommendation = (recommendationId: string) => {
    setExpandedRecommendations((prev) => {
      const next = new Set(prev);
      if (next.has(recommendationId)) {
        next.delete(recommendationId);
      } else {
        next.add(recommendationId);
      }
      return next;
    });
  };

  const selectedThread = mailThreads.find((t) => t.id === selectedMailThread);
  const selectedThreadMessages = selectedMailThread ? (mailMessagesData[selectedMailThread] ?? []) : [];

  const overviewToggleLabel = overviewExpanded ? "全文を折りたたむ" : "全文を表示";
  const messageLengthLabel = `${messageValue.length} / 4000`;
  const currentPane = paneOpen ? paneType : undefined;

  // 履歴イベント型の定義
  const historyEventTypes = ["statusChange", "assigneeUpdate", "dueDateUpdate", "titleUpdate", "caseCreate"];
  const visibleTimelineEvents = showAllHistory
    ? timelineEvents
    : timelineEvents.filter((event) => !historyEventTypes.includes(event.type));
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

  // リアクションピッカーで使用する絵文字リスト
  const availableEmojis = ["👍", "❤️", "✅", "👏", "🎉", "🤔"];

  // リアクション UI コンポーネント
  const renderReactions = (eventId: string) => {
    const eventReactions = reactions[eventId] ?? [];
    return (
      <div style={inlineStyles.reactionRow}>
        {eventReactions.map((reaction) => (
          <button
            key={reaction.emoji}
            type="button"
            style={reaction.reacted ? inlineStyles.reactionButtonActive : inlineStyles.reactionButton}
            onClick={() => toggleReaction(eventId, reaction.emoji)}
          >
            <Text>{reaction.emoji}</Text>
            <Text variant="data.small">{reaction.count}</Text>
          </button>
        ))}
        <Popover placement="bottom-start">
          <Popover.Anchor>
            <button type="button" style={inlineStyles.reactionButton} aria-label="リアクションを追加">
              <Icon size="xSmall">
                <LfPlusSmall />
              </Icon>
            </button>
          </Popover.Anchor>
          <Popover.Content width="small">
            <Popover.Body>
              <div style={{ display: "flex", gap: "var(--aegis-space-xSmall)", flexWrap: "wrap" }}>
                {availableEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    style={{ ...inlineStyles.reactionButton, fontSize: "var(--aegis-font-size-large)" }}
                    onClick={() => toggleReaction(eventId, emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </Popover.Body>
          </Popover.Content>
        </Popover>
      </div>
    );
  };

  const renderTimelineEvent = (event: TimelineEvent) => {
    // メールイベント
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
                <Button
                  size="xSmall"
                  variant="solid"
                  leading={LfReplyAlt}
                  onClick={() => {
                    setMailSubject(`Re: ${event.subject}`);
                    setMailTo([event.to]);
                    setIsMailFormOpen(true);
                  }}
                >
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
            {renderReactions(event.id)}
          </div>
        </div>
      );
    }

    // メッセージイベント
    if (event.type === "message") {
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
            {renderReactions(event.id)}
          </div>
        </div>
      );
    }

    // 案件作成イベント
    if (event.type === "caseCreate") {
      return (
        <div key={event.id} style={inlineStyles.historyEventSimple}>
          <Icon size="large">
            <LfMegaphone />
          </Icon>
          <div style={inlineStyles.historyEventTextContainer}>
            <Text variant="data.medium" color="subtle">
              {event.timestamp}
            </Text>
            <Text variant="component.medium">
              <Text variant="component.medium.bold">{event.creator}</Text>
              さんが案件を依頼しました
            </Text>
          </div>
        </div>
      );
    }

    // タイトル更新イベント
    if (event.type === "titleUpdate") {
      return (
        <div key={event.id} style={inlineStyles.historyEventSimple}>
          <Icon size="large">
            <LfMegaphone />
          </Icon>
          <div style={inlineStyles.historyEventTextContainer}>
            <Text variant="data.medium" color="subtle">
              {event.timestamp}
            </Text>
            <Text variant="component.medium">
              <Text variant="component.medium.bold">{event.updatedBy}</Text>
              さんが案件名を変更しました：
              <Text variant="component.medium.bold">{event.oldTitle}</Text>
              {" → "}
              <Text variant="component.medium.bold">{event.newTitle}</Text>
            </Text>
          </div>
        </div>
      );
    }

    // 担当者変更イベント
    if (event.type === "assigneeUpdate") {
      return (
        <div key={event.id} style={inlineStyles.historyEventSimple}>
          <Icon size="large">
            <LfMegaphone />
          </Icon>
          <div style={inlineStyles.historyEventTextContainer}>
            <Text variant="data.medium" color="subtle">
              {event.timestamp}
            </Text>
            <Text variant="component.medium">
              <Text variant="component.medium.bold">{event.updatedBy}</Text>
              さんが案件担当者を変更しました：
              <Text variant="component.medium.bold">{event.previousAssignee}</Text>
              {" → "}
              <Text variant="component.medium.bold">{event.newAssignee}</Text>
            </Text>
          </div>
        </div>
      );
    }

    // 納期変更イベント
    if (event.type === "dueDateUpdate") {
      return (
        <div key={event.id} style={inlineStyles.historyEventSimple}>
          <Icon size="large">
            <LfMegaphone />
          </Icon>
          <div style={inlineStyles.historyEventTextContainer}>
            <Text variant="data.medium" color="subtle">
              {event.timestamp}
            </Text>
            <Text variant="component.medium">
              <Text variant="component.medium.bold">{event.updatedBy}</Text>
              さんが納期を変更しました：
              <Text variant="component.medium.bold">{event.oldDate}</Text>
              {" → "}
              <Text variant="component.medium.bold">{event.newDate}</Text>
            </Text>
          </div>
        </div>
      );
    }

    // ステータス変更イベント
    if (event.type === "statusChange") {
      return (
        <div key={event.id} style={inlineStyles.historyEventSimple}>
          <Icon size="large">
            <LfMegaphone />
          </Icon>
          <div style={inlineStyles.historyEventTextContainer}>
            <Text variant="data.medium" color="subtle">
              {event.timestamp}
            </Text>
            <Text variant="component.medium">
              ステータスが変更されました：
              <Text variant="component.medium.bold">{event.oldStatus}</Text>
              {" → "}
              <Text variant="component.medium.bold">{event.newStatus}</Text>
            </Text>
          </div>
        </div>
      );
    }

    // Slack メッセージイベント
    if (event.type === "slackMessage") {
      return (
        <div key={event.id} style={inlineStyles.timelineEvent}>
          <Logo source={SlackLogo} size="large" />
          <div style={inlineStyles.slackCard}>
            <div style={inlineStyles.slackCardHeader}>
              <Avatar size="xSmall" name={event.sender} />
              <div style={inlineStyles.mailHeaderText}>
                <Text variant="body.medium.bold">{event.sender}</Text>
                <Text variant="data.medium" color="subtle">
                  {event.channel} | {event.timestamp}
                </Text>
              </div>
            </div>
            <Text variant="body.medium" whiteSpace="pre-wrap">
              {event.content}
            </Text>
            {renderReactions(event.id)}
          </div>
        </div>
      );
    }

    // AI レコメンドイベント
    if (event.type === "recommendation") {
      const isExpanded = expandedRecommendations.has(event.id);
      // サンプル: 類似案件リスト（実際のデータは event から取得）
      const similarCases = [
        { id: "1", title: "案件カスタム項目テスト" },
        { id: "2", title: "フォームから" },
        { id: "3", title: "内部公開フォーム＋カスタム項目の確認" },
      ];
      return (
        <div key={event.id} style={inlineStyles.knowledgeSuggestCard}>
          {/* ヘッダー */}
          <div style={inlineStyles.knowledgeSuggestHeader}>
            <Icon size="large">
              <LfBarSparkles />
            </Icon>
            <Text variant="body.medium.bold">過去ナレッジからのサジェスト</Text>
            <div style={{ marginLeft: "auto" }}>
              <Tooltip title="過去の類似案件を表示します" placement="top">
                <IconButton variant="plain" size="xSmall" aria-label="ヘルプ">
                  <Icon size="small">
                    <LfQuestionCircle />
                  </Icon>
                </IconButton>
              </Tooltip>
            </div>
          </div>
          {/* コンテンツ（展開可能） */}
          <div style={inlineStyles.knowledgeSuggestContent}>
            <button
              type="button"
              style={inlineStyles.knowledgeSuggestToggle}
              onClick={() => toggleRecommendation(event.id)}
              aria-expanded={isExpanded}
            >
              <Text variant="body.medium">過去の似ている案件をみる</Text>
              <Tooltip title="展開">
                <IconButton variant="subtle" size="xSmall" aria-label="展開">
                  <Icon size="small" source={isExpanded ? LfAngleUpMiddle : LfAngleDownMiddle} />
                </IconButton>
              </Tooltip>
            </button>
            {isExpanded && (
              <>
                <Divider />
                <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
                  <Icon size="small">
                    <LfMail />
                  </Icon>
                  <Text variant="body.small" color="subtle">
                    依頼内容が類似する案件
                  </Text>
                </div>
                {/* 類似案件リスト */}
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                  {similarCases.map((item) => (
                    <div key={item.id} style={inlineStyles.knowledgeSuggestItem}>
                      <Text variant="body.medium">{item.title}</Text>
                      <Tooltip title="開く">
                        <IconButton variant="plain" size="xSmall" aria-label="開く">
                          <Icon size="small">
                            <LfLink />
                          </Icon>
                        </IconButton>
                      </Tooltip>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button variant="plain" size="small" onClick={() => toggleRecommendation(event.id)}>
                    閉じる
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      );
    }

    // フォールバック（型安全のため到達しないはず）
    return null;
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
              <Text variant="body.medium">案件に関連する資料を一覧表示します。</Text>
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

  const timelineHeader = useMemo(
    () => (
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
          minRows={4}
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
            <Button variant="solid" disabled={messageValue.trim().length === 0}>
              投稿
            </Button>
          </div>
        </div>
      </div>
    ),
    [messageLengthLabel, messageValue],
  );

  return (
    <>
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
            <IconButton variant="plain" aria-label="戻る" onClick={() => navigate("/sandbox/juna-kondo")}>
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
        <PageLayoutContent maxWidth="medium">
          <PageLayoutBody>
            <div style={inlineStyles.pageBody}>
              <section style={inlineStyles.card}>
                {isEditMode ? (
                  <>
                    <ContentHeader size="small">
                      <ContentHeader.Description variant="data">{caseData.id}</ContentHeader.Description>
                    </ContentHeader>
                    <Form>
                      <FormControl required>
                        <FormControl.Label>案件名</FormControl.Label>
                        <TextField value={editTitle} onChange={(event) => setEditTitle(event.target.value)} />
                      </FormControl>
                      <FormControl>
                        <FormControl.Label>案件概要</FormControl.Label>
                        <Textarea
                          value={editOverview}
                          onChange={(event) => setEditOverview(event.target.value)}
                          minRows={6}
                          maxRows={12}
                        />
                      </FormControl>
                    </Form>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <ButtonGroup>
                        <Button
                          variant="plain"
                          onClick={() => {
                            setEditTitle(caseData.title);
                            setEditOverview(caseData.overview);
                            setIsEditMode(false);
                          }}
                        >
                          キャンセル
                        </Button>
                        <Button
                          variant="solid"
                          onClick={() => setIsEditMode(false)}
                          disabled={editTitle.trim().length === 0}
                        >
                          保存
                        </Button>
                      </ButtonGroup>
                    </div>
                  </>
                ) : (
                  <>
                    <ContentHeader
                      size="small"
                      trailing={
                        <Button leading={LfPen} variant="subtle" size="small" onClick={() => setIsEditMode(true)}>
                          編集
                        </Button>
                      }
                    >
                      <ContentHeader.Description variant="data">{caseData.id}</ContentHeader.Description>
                      <ContentHeader.Title>{editTitle}</ContentHeader.Title>
                    </ContentHeader>
                    <div style={inlineStyles.caseInfoContent}>
                      <Text as="h4" variant="title.xxSmall">
                        案件概要
                      </Text>
                      <div style={caseOverviewStyle} ref={overviewRef}>
                        <Text variant="component.medium" whiteSpace="pre-wrap">
                          {editOverview}
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
                            leading={
                              <Icon color="subtle" source={overviewExpanded ? LfAngleUpMiddle : LfAngleDownMiddle} />
                            }
                            onClick={() => setOverviewExpanded((prev) => !prev)}
                          >
                            <Text variant="data.medium" color="subtle">
                              {overviewToggleLabel}
                            </Text>
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </>
                )}
              </section>

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
                      {hasSlackMessages ? (
                        <div style={inlineStyles.card}>
                          <ContentHeader size="small">
                            <ContentHeader.Title>Slack スレッド</ContentHeader.Title>
                          </ContentHeader>
                          <Text variant="body.medium" color="subtle">
                            Slack連携されたメッセージを表示します。
                          </Text>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "var(--aegis-space-small)",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--aegis-space-small)",
                                padding: "var(--aegis-space-small)",
                                border: "1px solid var(--aegis-color-border-default)",
                                borderRadius: "var(--aegis-radius-medium)",
                              }}
                            >
                              <Logo source={SlackLogo} size="medium" />
                              <div style={{ display: "flex", flexDirection: "column" }}>
                                <Text variant="body.medium.bold">#contract-review</Text>
                                <Text variant="body.small" color="subtle">
                                  取引先からの条件変更について相談されています
                                </Text>
                              </div>
                              <div style={{ marginLeft: "auto" }}>
                                <Button size="small" variant="subtle">
                                  スレッドを開く
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <Button size="small" variant="gutterless" onClick={() => setHasSlackMessages(false)}>
                              設定フォームを表示（デモ用）
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div style={inlineStyles.card}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
                            <Text variant="body.medium" whiteSpace="pre-wrap">
                              案件に関連する Slack スレッドを作成します。{"\n"}
                              チャンネルを選択し、メンションするユーザーを指定してください。
                            </Text>
                            <Link
                              href="#"
                              size="small"
                              leading={LfQuestionCircle}
                              trailing={LfArrowUpRightFromSquare}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Slack 連携の詳細
                            </Link>
                          </div>
                          <Form>
                            <FormControl>
                              <FormControl.Label>チャンネル</FormControl.Label>
                              <Select
                                options={slackChannelOptions}
                                value={slackChannel}
                                onChange={(value) => setSlackChannel(value)}
                                placeholder="チャンネルを選択"
                              />
                            </FormControl>
                            <FormControl>
                              <FormControl.Label>メンション</FormControl.Label>
                              <TagPicker options={slackUserOptions} value={slackMentions} onChange={setSlackMentions} />
                            </FormControl>
                          </Form>
                          <div style={{ display: "flex", gap: "var(--aegis-space-small)", justifyContent: "flex-end" }}>
                            <Button variant="plain" onClick={() => setHasSlackMessages(true)}>
                              キャンセル
                            </Button>
                            <Button
                              variant="solid"
                              disabled={slackChannel.length === 0}
                              onClick={() => setHasSlackMessages(true)}
                            >
                              スレッドを作成
                            </Button>
                          </div>
                        </div>
                      )}
                    </Tab.Panel>
                    <Tab.Panel>
                      {selectedMailThread === null ? (
                        // Stage 1: スレッド一覧
                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
                          <div style={{ paddingBlockEnd: "var(--aegis-space-small)" }}>
                            <Button
                              variant="plain"
                              leading={LfWriting}
                              onClick={() => {
                                setMailSubject("");
                                setMailBody("");
                                setMailTo([]);
                                setMailCc([]);
                                setIsMailFormOpen(true);
                              }}
                            >
                              新規メールを作成
                            </Button>
                          </div>
                          <Divider />
                          <ActionList size="large">
                            {mailThreads.map((thread) => (
                              <ActionList.Item key={thread.id} onClick={() => setSelectedMailThread(thread.id)}>
                                <ActionList.Body trailing={<Badge count={thread.messageCount} color="inverse" />}>
                                  <Text variant="data.medium.bold">{thread.subject}</Text>
                                  <ActionList.Description>
                                    <Text variant="data.small">{thread.latestDate}</Text>
                                  </ActionList.Description>
                                </ActionList.Body>
                              </ActionList.Item>
                            ))}
                          </ActionList>
                        </div>
                      ) : (
                        // Stage 2: スレッド詳細
                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
                          <ContentHeader
                            size="small"
                            leading={
                              <Tooltip title="戻る">
                                <IconButton
                                  variant="plain"
                                  size="small"
                                  aria-label="戻る"
                                  onClick={() => setSelectedMailThread(null)}
                                >
                                  <Icon>
                                    <LfAngleLeftMiddle />
                                  </Icon>
                                </IconButton>
                              </Tooltip>
                            }
                          >
                            <ContentHeader.Title>
                              <Text variant="title.small" numberOfLines={1}>
                                {selectedThread?.subject}
                              </Text>
                            </ContentHeader.Title>
                          </ContentHeader>
                          <Divider />
                          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xxLarge)" }}>
                            {selectedThreadMessages.map((mail) => (
                              <article
                                key={mail.id}
                                style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "var(--aegis-space-xSmall)",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      gap: "var(--aegis-space-small)",
                                    }}
                                  >
                                    <div style={{ display: "flex", gap: "var(--aegis-space-small)" }}>
                                      <Avatar size="xSmall" name={mail.sender} />
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          gap: "var(--aegis-space-xxSmall)",
                                        }}
                                      >
                                        <Text variant="body.medium.bold" numberOfLines={1}>
                                          {mail.sender}
                                        </Text>
                                        <Text variant="body.small" color="subtle">
                                          {mail.date}
                                        </Text>
                                      </div>
                                    </div>
                                    <Toolbar>
                                      <Popover placement="bottom-end" arrow>
                                        <Popover.Anchor>
                                          <Tooltip title="詳細" placement="top">
                                            <IconButton variant="plain" size="small" aria-label="詳細">
                                              <Icon size="small">
                                                <LfInformationCircle />
                                              </Icon>
                                            </IconButton>
                                          </Tooltip>
                                        </Popover.Anchor>
                                        <Popover.Content width="large">
                                          <Popover.Header>
                                            <Text variant="body.medium.bold">{mail.subject}</Text>
                                          </Popover.Header>
                                          <Popover.Body>
                                            <div
                                              style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "var(--aegis-space-xSmall)",
                                              }}
                                            >
                                              <div>
                                                <Text variant="body.small" color="subtle">
                                                  差出人:
                                                </Text>
                                                <Text variant="body.small"> {mail.from}</Text>
                                              </div>
                                              <div>
                                                <Text variant="body.small" color="subtle">
                                                  宛先:
                                                </Text>
                                                <Text variant="body.small"> {mail.to.join(", ")}</Text>
                                              </div>
                                              {mail.cc.length > 0 && (
                                                <div>
                                                  <Text variant="body.small" color="subtle">
                                                    CC:
                                                  </Text>
                                                  <Text variant="body.small"> {mail.cc.join(", ")}</Text>
                                                </div>
                                              )}
                                            </div>
                                          </Popover.Body>
                                        </Popover.Content>
                                      </Popover>
                                      <Button
                                        size="small"
                                        variant="subtle"
                                        leading={LfReplyAlt}
                                        onClick={() => {
                                          setMailSubject(`Re: ${mail.subject}`);
                                          setMailTo(mail.to);
                                          setIsMailFormOpen(true);
                                        }}
                                      >
                                        返信
                                      </Button>
                                    </Toolbar>
                                  </div>
                                  <div
                                    style={{
                                      maxHeight: expandedMails.has(mail.id)
                                        ? `${MAX_MAIL_CONTENT_EXPANDED_HEIGHT_PX}px`
                                        : `${MAX_MAIL_CONTENT_HEIGHT_PX}px`,
                                      overflowY: expandedMails.has(mail.id) ? "auto" : "hidden",
                                    }}
                                  >
                                    <Text variant="body.medium" whiteSpace="pre-wrap">
                                      {mail.content}
                                    </Text>
                                  </div>
                                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <Button
                                      size="xSmall"
                                      variant="gutterless"
                                      leading={
                                        <Icon
                                          color="subtle"
                                          source={expandedMails.has(mail.id) ? LfAngleUpMiddle : LfAngleDownMiddle}
                                        />
                                      }
                                      onClick={() => toggleMailExpanded(mail.id)}
                                    >
                                      <Text variant="data.medium" color="subtle">
                                        {expandedMails.has(mail.id) ? "折りたたむ" : "続きを表示"}
                                      </Text>
                                    </Button>
                                  </div>
                                </div>
                                {mail.attachments.length > 0 && (
                                  <div style={inlineStyles.attachmentRow}>
                                    {mail.attachments.map((file) => (
                                      <Tag key={file} variant="outline" leading={LfFile}>
                                        {file}
                                      </Tag>
                                    ))}
                                  </div>
                                )}
                              </article>
                            ))}
                          </div>
                        </div>
                      )}
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </section>
            </div>
          </PageLayoutBody>
        </PageLayoutContent>

        <PageLayoutPane position="end" width="large" resizable open={paneOpen}>
          {renderPaneContent()}
        </PageLayoutPane>

        <PageLayoutSidebar position="end">
          <SideNavigation>
            <SideNavigation.Group>
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

      {/* メール作成フォーム（BottomSheet） */}
      <BottomSheet width="large" open={isMailFormOpen} onOpenChange={setIsMailFormOpen}>
        <BottomSheet.Button>メール作成</BottomSheet.Button>
        <BottomSheet.Panel>
          <BottomSheet.Body>
            <Form>
              <FormControl>
                <FormControl.Label>送信元</FormControl.Label>
                <Select options={emailAddressOptions} value={mailFrom} onChange={(value) => setMailFrom(value)} />
              </FormControl>
              <FormControl>
                <FormControl.Label>宛先 (To)</FormControl.Label>
                <TagPicker options={emailAddressOptions} value={mailTo} onChange={setMailTo} />
              </FormControl>
              <FormControl>
                <FormControl.Label>CC</FormControl.Label>
                <TagPicker options={emailAddressOptions} value={mailCc} onChange={setMailCc} />
              </FormControl>
              <FormControl>
                <FormControl.Label>件名</FormControl.Label>
                <TextField value={mailSubject} onChange={(event) => setMailSubject(event.target.value)} />
              </FormControl>
              <FormControl>
                <FormControl.Label>本文</FormControl.Label>
                <Textarea
                  value={mailBody}
                  onChange={(event) => setMailBody(event.target.value)}
                  minRows={8}
                  maxRows={16}
                  placeholder="メール本文を入力してください"
                />
              </FormControl>
            </Form>
          </BottomSheet.Body>
          <BottomSheet.Footer>
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <div style={{ display: "flex", gap: "var(--aegis-space-small)" }}>
                <Tooltip title="破棄" placement="top">
                  <IconButton
                    aria-label="破棄"
                    variant="plain"
                    onClick={() => {
                      setMailSubject("");
                      setMailBody("");
                      setMailTo([]);
                      setMailCc([]);
                      setIsMailFormOpen(false);
                    }}
                  >
                    <Icon>
                      <LfTrash />
                    </Icon>
                  </IconButton>
                </Tooltip>
                <Tooltip title="ファイル添付" placement="top">
                  <IconButton aria-label="ファイル添付" variant="plain">
                    <Icon>
                      <LfClip />
                    </Icon>
                  </IconButton>
                </Tooltip>
              </div>
              <Button
                variant="solid"
                disabled={mailTo.length === 0 || mailSubject.trim().length === 0}
                onClick={() => {
                  setMailSubject("");
                  setMailBody("");
                  setMailTo([]);
                  setMailCc([]);
                  setIsMailFormOpen(false);
                }}
              >
                送信
              </Button>
            </div>
          </BottomSheet.Footer>
        </BottomSheet.Panel>
      </BottomSheet>
    </>
  );
};

export default CaseDetailTemplate;
