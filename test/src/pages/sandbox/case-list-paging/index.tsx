import {
  LfArchive,
  LfCheckBook,
  LfDownload,
  LfEllipsisDot,
  LfFileLines,
  LfFileSigned,
  LfFilesLine,
  LfFilter,
  LfFilterAlt,
  LfHome,
  LfMagnifyingGlass,
  LfMail,
  LfPlusLarge,
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
  Divider,
  Drawer,
  Footer,
  FooterSpacer,
  Form,
  FormControl,
  Icon,
  IconButton,
  Menu,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutStickyContainer,
  Pagination,
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
  Tab,
  Table,
  TableContainer,
  TagPicker,
  Text,
  TextField,
  Toolbar,
  ToolbarSpacer,
  Tooltip,
} from "@legalforce/aegis-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  {
    id: "2025-07-0072",
    title: "システム開発契約の法務確認",
    status: "対応中",
    dueDate: "2025/08/10",
    updatedAt: "2025/07/15 14:20",
    requester: "木村 直樹",
    department: "開発部",
  },
  {
    id: "2025-07-0065",
    title: "プライバシーポリシー更新対応",
    status: "未着手",
    dueDate: "2025/08/20",
    updatedAt: "2025/07/12 11:45",
    requester: "林 真由美",
    department: "法務部",
  },
  {
    id: "2025-07-0058",
    title: "代理店契約書の作成支援",
    status: "法務確認中",
    dueDate: "2025/08/05",
    updatedAt: "2025/07/10 16:30",
    requester: "森 健一",
    department: "営業部",
  },
  {
    id: "2025-07-0041",
    title: "顧問契約に関する法的助言",
    status: "完了",
    dueDate: "2025/07/30",
    updatedAt: "2025/07/08 09:15",
    requester: "清水 裕子",
    department: "総務部",
  },
  {
    id: "2025-06-0134",
    title: "M&Aに関する契約書確認",
    status: "依頼者確認待ち",
    dueDate: "2025/07/25",
    updatedAt: "2025/06/28 17:50",
    requester: "石川 浩二",
    department: "経営企画部",
  },
  {
    id: "2025-06-0128",
    title: "広告掲載契約の法務レビュー",
    status: "差戻し",
    dueDate: "2025/07/18",
    updatedAt: "2025/06/25 13:40",
    requester: "井上 明美",
    department: "マーケティング部",
  },
  {
    id: "2025-06-0115",
    title: "サブスクリプション規約改定",
    status: "対応中",
    dueDate: "2025/07/22",
    updatedAt: "2025/06/22 10:25",
    requester: "斎藤 大介",
    department: "企画部",
  },
  {
    id: "2025-06-0102",
    title: "特許出願に関する相談",
    status: "法務確認中",
    dueDate: "2025/07/15",
    updatedAt: "2025/06/20 15:10",
    requester: "遠藤 理恵",
    department: "研究開発部",
  },
  {
    id: "2025-06-0095",
    title: "ソフトウェアライセンス契約確認",
    status: "未着手",
    dueDate: "2025/07/28",
    updatedAt: "2025/06/18 12:05",
    requester: "藤田 圭太",
    department: "IT部",
  },
  {
    id: "2025-06-0087",
    title: "業務提携契約書の作成",
    status: "完了",
    dueDate: "2025/07/10",
    updatedAt: "2025/06/15 16:55",
    requester: "中島 優子",
    department: "事業開発部",
  },
  {
    id: "2025-06-0073",
    title: "データ利用規約の法務確認",
    status: "依頼者確認待ち",
    dueDate: "2025/07/20",
    updatedAt: "2025/06/12 14:30",
    requester: "松本 和也",
    department: "データ分析部",
  },
  {
    id: "2025-06-0061",
    title: "コンサルティング契約のレビュー",
    status: "法務確認中",
    dueDate: "2025/07/12",
    updatedAt: "2025/06/10 11:20",
    requester: "竹内 沙織",
    department: "営業部",
  },
  {
    id: "2025-06-0054",
    title: "海外事業展開に関する法的相談",
    status: "対応中",
    dueDate: "2025/08/01",
    updatedAt: "2025/06/08 09:45",
    requester: "橋本 誠",
    department: "海外事業部",
  },
  {
    id: "2025-06-0042",
    title: "派遣契約書の確認",
    status: "差戻し",
    dueDate: "2025/07/05",
    updatedAt: "2025/06/05 16:15",
    requester: "野村 恵美",
    department: "人事部",
  },
  {
    id: "2025-05-0156",
    title: "フランチャイズ契約に関する助言",
    status: "完了",
    dueDate: "2025/06/30",
    updatedAt: "2025/05/30 13:50",
    requester: "菅原 隆",
    department: "事業部",
  },
  {
    id: "2025-05-0143",
    title: "不動産賃貸借契約の確認",
    status: "未着手",
    dueDate: "2025/07/08",
    updatedAt: "2025/05/28 10:35",
    requester: "岡田 真紀",
    department: "総務部",
  },
  {
    id: "2025-05-0131",
    title: "インフルエンサー契約書作成",
    status: "法務確認中",
    dueDate: "2025/07/14",
    updatedAt: "2025/05/25 15:25",
    requester: "前田 健",
    department: "マーケティング部",
  },
  {
    id: "2025-05-0118",
    title: "クラウドサービス利用契約レビュー",
    status: "依頼者確認待ち",
    dueDate: "2025/07/03",
    updatedAt: "2025/05/22 12:40",
    requester: "長谷川 直美",
    department: "IT部",
  },
  {
    id: "2025-05-0105",
    title: "著作権譲渡契約の確認",
    status: "対応中",
    dueDate: "2025/07/16",
    updatedAt: "2025/05/20 09:20",
    requester: "阿部 光一",
    department: "コンテンツ制作部",
  },
  {
    id: "2025-05-0092",
    title: "取引基本契約書の改定",
    status: "差戻し",
    dueDate: "2025/06/28",
    updatedAt: "2025/05/18 16:05",
    requester: "内藤 佳子",
    department: "営業部",
  },
  {
    id: "2025-05-0081",
    title: "株主間契約に関する法務相談",
    status: "完了",
    dueDate: "2025/06/25",
    updatedAt: "2025/05/15 14:50",
    requester: "大野 修",
    department: "経営企画部",
  },
  {
    id: "2025-05-0067",
    title: "輸出入契約の法務確認",
    status: "未着手",
    dueDate: "2025/07/22",
    updatedAt: "2025/05/12 11:30",
    requester: "西村 亜希",
    department: "貿易部",
  },
  {
    id: "2025-05-0054",
    title: "セキュリティーポリシー策定支援",
    status: "法務確認中",
    dueDate: "2025/07/11",
    updatedAt: "2025/05/10 10:15",
    requester: "平野 達也",
    department: "情報セキュリティー部",
  },
  {
    id: "2025-05-0041",
    title: "パートナーシップ契約書作成",
    status: "依頼者確認待ち",
    dueDate: "2025/06/29",
    updatedAt: "2025/05/08 15:40",
    requester: "小川 美穂",
    department: "事業開発部",
  },
  {
    id: "2025-04-0178",
    title: "製造委託契約のレビュー",
    status: "対応中",
    dueDate: "2025/07/06",
    updatedAt: "2025/04/30 13:25",
    requester: "村上 健二",
    department: "製造部",
  },
  {
    id: "2025-04-0165",
    title: "販売代理店契約の確認",
    status: "差戻し",
    dueDate: "2025/06/24",
    updatedAt: "2025/04/28 09:50",
    requester: "山口 さゆり",
    department: "営業部",
  },
  {
    id: "2025-04-0152",
    title: "研究開発委託契約書作成",
    status: "完了",
    dueDate: "2025/06/20",
    updatedAt: "2025/04/25 16:30",
    requester: "増田 俊介",
    department: "研究開発部",
  },
  {
    id: "2025-04-0139",
    title: "コンプライアンス規程改定",
    status: "未着手",
    dueDate: "2025/07/18",
    updatedAt: "2025/04/22 12:10",
    requester: "池田 理香",
    department: "法務部",
  },
  {
    id: "2025-04-0126",
    title: "ECサイト利用規約の作成",
    status: "法務確認中",
    dueDate: "2025/07/09",
    updatedAt: "2025/04/20 10:45",
    requester: "近藤 真一",
    department: "EC事業部",
  },
  {
    id: "2025-04-0113",
    title: "人材紹介契約書の確認",
    status: "依頼者確認待ち",
    dueDate: "2025/06/27",
    updatedAt: "2025/04/18 15:20",
    requester: "坂本 奈々",
    department: "人事部",
  },
  {
    id: "2025-04-0101",
    title: "API利用規約の法務レビュー",
    status: "対応中",
    dueDate: "2025/07/13",
    updatedAt: "2025/04/15 11:35",
    requester: "福田 浩",
    department: "開発部",
  },
  {
    id: "2025-04-0088",
    title: "共同研究契約に関する相談",
    status: "差戻し",
    dueDate: "2025/06/22",
    updatedAt: "2025/04/12 14:05",
    requester: "後藤 麻衣",
    department: "研究開発部",
  },
  {
    id: "2025-04-0075",
    title: "プロモーション契約書の作成",
    status: "完了",
    dueDate: "2025/06/18",
    updatedAt: "2025/04/10 09:40",
    requester: "三浦 拓也",
    department: "マーケティング部",
  },
  {
    id: "2025-04-0062",
    title: "グローバル展開に関する法務支援",
    status: "未着手",
    dueDate: "2025/07/24",
    updatedAt: "2025/04/08 16:25",
    requester: "宮本 裕美",
    department: "海外事業部",
  },
  {
    id: "2025-04-0049",
    title: "投資契約書の法務確認",
    status: "法務確認中",
    dueDate: "2025/07/07",
    updatedAt: "2025/04/05 13:15",
    requester: "酒井 大樹",
    department: "財務部",
  },
  {
    id: "2025-04-0036",
    title: "SaaS利用契約のレビュー",
    status: "依頼者確認待ち",
    dueDate: "2025/06/26",
    updatedAt: "2025/04/03 10:50",
    requester: "川口 愛",
    department: "IT部",
  },
  {
    id: "2025-04-0023",
    title: "メディア掲載許諾契約の確認",
    status: "対応中",
    dueDate: "2025/07/17",
    updatedAt: "2025/04/01 15:30",
    requester: "横山 健吾",
    department: "広報部",
  },
];

// Unused for now - reserved for future feature
// const statusCounts = [
//   { label: "法務確認中", count: 45 },
//   { label: "依頼者確認待ち", count: 28 },
//   { label: "未着手", count: 156 },
//   { label: "対応中", count: 37 },
//   { label: "完了", count: 999, isOverflow: true },
//   { label: "差戻し", count: 8 },
// ];

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
function SegmentItem({
  label,
  count,
  onClick,
  isSelected,
}: {
  label: string;
  count: number;
  onClick?: () => void;
  isSelected?: boolean;
}) {
  const content = (
    <>
      <dt style={{ textAlign: "center" }}>
        <Text variant="body.medium" color="subtle" whiteSpace="nowrap">
          {label}
        </Text>
      </dt>
      <dd style={{ margin: 0, textAlign: "center" }}>
        <Text variant="body.xxLarge.bold">{count < 1000 ? count : "999+"}</Text>
      </dd>
    </>
  );

  const baseStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column-reverse",
    justifyContent: "center",
    padding: "var(--aegis-space-small)",
    borderRadius: "var(--aegis-radius-medium)",
    backgroundColor: isSelected ? "var(--aegis-color-background-neutral-subtle)" : "transparent",
    border: isSelected ? "2px solid var(--aegis-color-border-neutral-emphasis)" : "2px solid transparent",
    transition: "all 0.2s ease",
  };

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        style={{
          ...baseStyle,
          cursor: "pointer",
          background: isSelected ? "var(--aegis-color-background-neutral-subtle)" : "transparent",
          font: "inherit",
        }}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = "var(--aegis-color-background-neutral-subtlest)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = "transparent";
          }
        }}
      >
        {content}
      </button>
    );
  }

  return <div style={baseStyle}>{content}</div>;
}

const PAGE_SIZE = 20;

export const CaseListPaging = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  // biome-ignore lint/style/noNonNullAssertion: Drawer component requires non-null RefObject
  const drawerRoot = useRef<HTMLDivElement>(null!);
  const navigate = useNavigate();

  const handleRowClick = () => {
    navigate("/template/loc/case/detail");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusClick = (status: string) => {
    if (selectedStatus === status) {
      // 既に選択されている場合は解除
      setSelectedStatus(null);
    } else {
      // 新しいステータスを選択
      setSelectedStatus(status);
    }
    // ページを1にリセット
    setCurrentPage(1);
  };

  // データフィルタリング
  const filteredCases = selectedStatus
    ? sampleCases.filter((caseItem) => caseItem.status === selectedStatus)
    : sampleCases;

  // ステータス別件数を動的に計算
  const statusLabels = ["法務確認中", "依頼者確認待ち", "未着手", "対応中", "完了", "差戻し"];
  const dynamicStatusCounts = statusLabels.map((label) => ({
    label,
    count: filteredCases.filter((caseItem) => caseItem.status === label).length,
  }));

  // ページネーション計算
  const totalCount = filteredCases.length;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedCases = filteredCases.slice(startIndex, endIndex);

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
        <PageLayout scrollBehavior="inside">
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
                  {dynamicStatusCounts.map((item) => (
                    <SegmentItem
                      key={item.label}
                      label={item.label}
                      count={item.count}
                      onClick={() => handleStatusClick(item.label)}
                      isSelected={selectedStatus === item.label}
                    />
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
                          {paginatedCases.map((caseItem) => (
                            <Table.Row key={caseItem.id} style={{ cursor: "pointer" }} onClick={handleRowClick}>
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
                      rows={paginatedCases}
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
        </PageLayout>

        <Footer>
          <FooterSpacer />
          <Pagination page={currentPage} totalCount={totalCount} pageSize={PAGE_SIZE} onChange={handlePageChange} />
        </Footer>
      </SidebarInset>
    </SidebarProvider>
  );
};
