var e=`import {
  LfChart,
  LfDownload,
  LfEllipsisDot,
  LfFilter,
  LfFilterAlt,
  LfMail,
  LfMarge,
  LfPlusLarge,
  LfQuestionCircle,
} from "@legalforce/aegis-icons";
import { Box } from "@legalforce/aegis-illustrations/react";
import {
  ActionList,
  Avatar,
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardLink,
  Checkbox,
  ContentHeader,
  ContentHeaderTitle,
  DataTable,
  DataTableCell,
  type DataTableColumnDef,
  DataTableLink,
  Divider,
  Drawer,
  EmptyState,
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
  Popover,
  Radio,
  RadioGroup,
  RangeDateField,
  Search,
  Select,
  StatusLabel,
  Tab,
  TagPicker,
  Text,
  TextField,
  Toolbar,
  ToolbarSpacer,
  Tooltip,
} from "@legalforce/aegis-react";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "../../../../hooks";
import { LocSidebarLayout } from "../_shared";
import { type TranslationKey, translations } from "./data/translations";

type TFn = (key: TranslationKey) => string;

// サンプルデータ（ダミー）
type CaseItem = {
  id: string;
  title: string;
  status: string;
  dueDate: string;
  lastMessageTime: string;
  createdAt: string;
  requester: string;
  department: string;
  mainAssignee: string;
  subAssignees: string[];
  classification: string;
  space: string;
  hasUnread?: boolean;
};

const sampleCases: CaseItem[] = [
  {
    id: "2024-03-0020",
    title: "業務委託契約書のレビュー依頼",
    status: "法務確認中",
    dueDate: "2024/11/08",
    lastMessageTime: "2025/10/22 18:30",
    createdAt: "2024/10/02 09:12",
    requester: "山田 太郎",
    department: "営業部",
    mainAssignee: "佐藤 花子",
    subAssignees: ["高橋 健太"],
    classification: "契約書レビュー",
    space: "営業部スペース",
  },
  {
    id: "2024-06-0008",
    title: "秘密保持契約書の確認",
    status: "依頼者確認待ち",
    dueDate: "2024/12/15",
    lastMessageTime: "2025/10/15 17:11",
    createdAt: "2024/09/21 11:03",
    requester: "佐藤 花子",
    department: "開発部",
    mainAssignee: "山田 太郎",
    subAssignees: ["伊藤 さくら", "鈴木 一郎"],
    classification: "契約書レビュー",
    space: "開発部スペース",
  },
  {
    id: "2025-09-0002",
    title: "新規取引先との基本契約書作成",
    status: "対応中",
    dueDate: "2025/01/20",
    lastMessageTime: "2025/09/04 13:29",
    createdAt: "2024/08/09 10:40",
    requester: "鈴木 一郎",
    department: "経理部",
    mainAssignee: "中村 翔",
    subAssignees: [],
    classification: "契約書レビュー",
    space: "経理部スペース",
  },
  {
    id: "2025-08-0052",
    title: "サービス利用規約の改定",
    status: "未着手",
    dueDate: "2025/08/29",
    lastMessageTime: "2025/08/27 15:07",
    createdAt: "2025/06/18 15:30",
    requester: "田中 美咲",
    department: "企画部",
    mainAssignee: "加藤 誠",
    subAssignees: ["佐藤 花子"],
    classification: "法務相談",
    space: "企画部スペース",
  },
  {
    id: "2025-08-0051",
    title: "ライセンス契約に関する相談",
    status: "完了",
    dueDate: "2025/09/10",
    lastMessageTime: "2025/08/27 15:06",
    createdAt: "2025/05/08 10:10",
    requester: "高橋 健太",
    department: "開発部",
    mainAssignee: "佐藤 花子",
    subAssignees: ["中村 翔"],
    classification: "法務相談",
    space: "開発部スペース",
  },
  {
    id: "2025-08-0023",
    title: "個人情報取扱いに関する法務相談",
    status: "法務確認中",
    dueDate: "2025/08/31",
    lastMessageTime: "2025/08/13 16:19",
    createdAt: "2025/07/12 09:18",
    requester: "伊藤 さくら",
    department: "人事部",
    mainAssignee: "山田 太郎",
    subAssignees: [],
    classification: "法務相談",
    space: "人事部スペース",
  },
  {
    id: "2025-08-0014",
    title: "商標登録に関する確認",
    status: "差戻し",
    dueDate: "2025/09/05",
    lastMessageTime: "2025/08/07 13:23",
    createdAt: "2025/07/21 17:05",
    requester: "渡辺 大輔",
    department: "マーケティング部",
    mainAssignee: "佐藤 花子",
    subAssignees: ["小林 愛"],
    classification: "法務相談",
    space: "マーケティング部スペース",
  },
  {
    id: "2025-07-0107",
    title: "海外取引に関する契約書確認",
    status: "対応中",
    dueDate: "2025/08/15",
    lastMessageTime: "2025/07/30 09:24",
    createdAt: "2025/06/30 08:34",
    requester: "中村 翔",
    department: "海外事業部",
    mainAssignee: "山田 太郎",
    subAssignees: ["高橋 健太", "鈴木 一郎"],
    classification: "契約書レビュー",
    space: "海外事業部スペース",
  },
  {
    id: "2025-07-0092",
    title: "労働契約書のテンプレート作成",
    status: "依頼者確認待ち",
    dueDate: "2025/07/28",
    lastMessageTime: "2025/07/24 10:55",
    createdAt: "2025/06/11 14:20",
    requester: "小林 愛",
    department: "人事部",
    mainAssignee: "加藤 誠",
    subAssignees: ["田中 美咲"],
    classification: "契約書レビュー",
    space: "人事部スペース",
    hasUnread: true,
  },
  {
    id: "2025-07-0086",
    title: "知的財産権に関する相談",
    status: "未着手",
    dueDate: "2025/07/25",
    lastMessageTime: "2025/07/18 18:37",
    createdAt: "2025/06/01 11:30",
    requester: "加藤 誠",
    department: "研究開発部",
    mainAssignee: "山田 太郎",
    subAssignees: ["佐藤 花子"],
    classification: "法務相談",
    space: "研究開発部スペース",
    hasUnread: true,
  },
  {
    id: "2025-07-0085",
    title: "取引先との紛争対応",
    status: "法務確認中",
    dueDate: "2025/07/31",
    lastMessageTime: "2025/07/18 18:35",
    createdAt: "2025/05/23 16:55",
    requester: "吉田 恵",
    department: "営業部",
    mainAssignee: "佐藤 花子",
    subAssignees: ["鈴木 一郎"],
    classification: "訴訟対応",
    space: "営業部スペース",
    hasUnread: true,
  },
];

// カラム定義は t() を使うため factory 化。id 群は order/visibility 用に静的保持。
const CASE_COLUMN_IDS = [
  "case-key",
  "case-title",
  "case-main-assignee",
  "case-status",
  "case-client",
  "case-sub-assignees",
  "case-classification",
  "space",
  "case-due-date",
  "case-last-message-time",
  "case-created-time",
  "department",
] as const;

const buildCaseColumns = (t: TFn): DataTableColumnDef<CaseItem, string>[] => [
  {
    id: "case-key",
    name: t("caseId"),
    getValue: (row): string => row.id,
    pinnable: false,
    renderCell: ({ value }) => (
      <DataTableCell>
        <DataTableLink href="/template/loc/case/detail">{value}</DataTableLink>
      </DataTableCell>
    ),
  },
  {
    id: "case-title",
    name: t("caseName"),
    getValue: (row): string => row.title,
    pinnable: false,
    renderCell: ({ value }) => (
      <DataTableCell>
        <Tooltip title={value} placement="top-start" onlyOnOverflow>
          <Text numberOfLines={1}>{value}</Text>
        </Tooltip>
      </DataTableCell>
    ),
  },
  {
    id: "case-main-assignee",
    name: t("mainAssignee"),
    getValue: (row): string => row.mainAssignee,
    pinnable: false,
    renderCell: ({ value }) => <DataTableCell leading={<Avatar size="xSmall" name={value} />}>{value}</DataTableCell>,
  },
  {
    id: "case-status",
    name: t("caseStatus"),
    getValue: (row): string => row.status,
    pinnable: false,
    renderCell: ({ row }) => (
      <DataTableCell>
        <StatusLabel>{row.status}</StatusLabel>
      </DataTableCell>
    ),
  },
  {
    id: "case-client",
    name: t("requester"),
    getValue: (row): string => row.requester,
    pinnable: false,
    renderCell: ({ value }) => <DataTableCell leading={<Avatar size="xSmall" name={value} />}>{value}</DataTableCell>,
  },
  {
    id: "case-sub-assignees",
    name: t("subAssignee"),
    getValue: (row): string => (row.subAssignees.length > 0 ? row.subAssignees.join(", ") : "—"),
    pinnable: false,
  },
  {
    id: "case-classification",
    name: t("caseType"),
    getValue: (row): string => row.classification,
    pinnable: false,
  },
  {
    id: "space",
    name: t("space"),
    getValue: (row): string => row.space,
    pinnable: false,
  },
  {
    id: "case-due-date",
    name: t("dueDate"),
    getValue: (row): string => row.dueDate,
    sortable: true,
    pinnable: false,
  },
  {
    id: "case-last-message-time",
    name: t("updatedAt"),
    getValue: (row): string => row.lastMessageTime,
    sortable: true,
    pinnable: false,
  },
  {
    id: "case-created-time",
    name: t("createdAt"),
    getValue: (row): string => row.createdAt,
    sortable: true,
    pinnable: false,
  },
  {
    id: "department",
    name: t("requesterDepartment"),
    getValue: (row): string => row.department,
    pinnable: false,
  },
];

// 案件統合に必要な選択件数（loc-app: CASE_COUNT_REQUIRED_FOR_CONSOLIDATION）
const CASE_COUNT_REQUIRED_FOR_CONSOLIDATION = 2;

// カラム表示順序（loc-app では atom + localStorage で管理）
const defaultColumnOrder = [...CASE_COLUMN_IDS];

// カラム表示/非表示（loc-app では atom で管理）
const defaultColumnVisibility: Record<string, boolean> = Object.fromEntries(CASE_COLUMN_IDS.map((id) => [id, true]));

// ステータス別件数（CaseSegmentCounter）。ラベルは t() で翻訳。
const buildStatusCounts = (t: TFn) => [
  { label: t("statusLegalReview"), count: 45 },
  { label: t("statusRequesterWaiting"), count: 28 },
  { label: t("statusNotStarted"), count: 156 },
  { label: t("statusInProgress"), count: 37 },
  { label: t("statusReturned"), count: 8 },
  { label: t("statusCompleted"), count: 999, isOverflow: true, isClosed: true },
];

// フィルター用のサンプルオプション
const buildStatusOptions = (t: TFn) => [
  { label: t("statusLegalReview"), value: "legal_review" },
  { label: t("statusRequesterWaiting"), value: "requester_pending" },
  { label: t("statusNotStarted"), value: "not_started" },
  { label: t("statusInProgress"), value: "in_progress" },
  { label: t("statusCompleted"), value: "completed" },
  { label: t("statusReturned"), value: "returned" },
];

// loc-app: 案件タイプ（FilterButtonWithDrawer の classificationOptions）
const buildClassificationOptions = (t: TFn) => [
  { label: t("caseTypeContractReview"), value: "contract_review" },
  { label: t("caseTypeContractDrafting"), value: "contract_drafting" },
  { label: t("caseTypeLegalConsultation"), value: "legal_consultation" },
  { label: t("caseTypeOther"), value: "other" },
];

// 担当者は氏名なのでサンプルデータ扱い（翻訳対象外）。
const assigneeOptions = [
  { label: "Taro Yamada", value: "yamada" },
  { label: "Hanako Sato", value: "sato" },
  { label: "Ichiro Suzuki", value: "suzuki" },
  { label: "Jiro Tanaka", value: "tanaka" },
  { label: "Saburo Kato", value: "kato" },
];

const buildDepartmentOptions = (t: TFn) => [
  { label: "QA", value: "qa" },
  { label: "法マネ", value: "legal_mane" },
  { label: "test2", value: "test2" },
  { label: t("deptUnassigned"), value: "none" },
];

// 統計アイテムコンポーネント
const SegmentItem = ({ label, count }: { label: string; count: number }) => {
  const displayMax = 999;
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
        <Text variant="body.xxLarge.bold">{count < displayMax ? count : \`\${displayMax}+\`}</Text>
      </dd>
    </div>
  );
};

/**
 * 案件一覧 DataTable コンポーネント。
 *
 * loc-app では以下の機能を持つ:
 * - EmptyState: テナントに案件がない場合 / 検索結果なしの場合で表示を分岐
 * - columnOrder / columnVisibility: atom + localStorage で管理
 * - columnPinning: ユーザー操作でピン留め可能
 * - isConsolidationMode 時は複数行選択（rowSelectionType="multiple"）を有効化し、
 *   選択件数が CASE_COUNT_REQUIRED_FOR_CONSOLIDATION に達したら追加選択を抑止する
 * - Suspense + ErrorBoundary でラップ
 */
const CaseDataTable = ({
  cases,
  isConsolidationMode,
  selectedCaseIds,
  onSelectedCaseIdsChange,
}: {
  cases: CaseItem[];
  isConsolidationMode: boolean;
  selectedCaseIds: string[];
  onSelectedCaseIdsChange: (ids: string[]) => void;
}) => {
  const { t } = useTranslation<TranslationKey>(translations);
  const columns = useMemo(() => buildCaseColumns(t), [t]);
  const [page, setPage] = useState(1);
  const badgedRows = useMemo(() => cases.filter((c) => c.hasUnread).map((c) => c.id), [cases]);
  // loc-app では notification === 'read' の行をハイライト表示する
  const highlightedRows = useMemo(
    () =>
      cases
        .filter((c) => !c.hasUnread)
        .map((c) => c.id)
        .slice(0, 2),
    [cases],
  );

  // テナントに案件が存在しない場合の EmptyState
  if (cases.length === 0) {
    return (
      <EmptyState title={t("emptyTitle")} visual={<Box />}>
        {t("emptyDescription")}
      </EmptyState>
    );
  }

  return (
    <div style={{ display: "grid", gap: "var(--aegis-space-medium)" }}>
      <DataTable
        columns={columns}
        rows={cases}
        getRowId={(row) => row.id}
        stickyHeader
        rowSelectionType={isConsolidationMode ? "multiple" : "none"}
        selectedRows={isConsolidationMode ? selectedCaseIds : undefined}
        onSelectedRowsChange={isConsolidationMode ? onSelectedCaseIdsChange : undefined}
        // 選択は CASE_COUNT_REQUIRED_FOR_CONSOLIDATION 件まで。超過後は既選択行のみ操作可（解除用）
        canSelectRow={({ row }) =>
          selectedCaseIds.length < CASE_COUNT_REQUIRED_FOR_CONSOLIDATION || selectedCaseIds.includes(row.id)
        }
        badgedRows={badgedRows}
        highlightedRows={highlightedRows}
        highlightRowOnHover
        rowVirtualization
        manualSorting
        defaultSorting={[{ id: "case-last-message-time", desc: true }]}
        columnOrder={defaultColumnOrder}
        defaultColumnOrder={defaultColumnOrder}
        columnVisibility={defaultColumnVisibility}
        defaultColumnVisibility={defaultColumnVisibility}
        defaultColumnPinning={{}}
      />
      <Pagination page={page} totalCount={258} pageSize={20} onChange={(nextPage) => setPage(nextPage)} />
    </div>
  );
};

/**
 * 案件一覧ページ メインコンテンツ。
 *
 * loc-app では ProUserMainContent として以下の構造を持つ:
 * - ErrorBoundary + Suspense でラップ
 * - Feature flag \`fe-enable-data-table-for-case\` で CaseDataTable / CaseTable を切替
 * - すべての Tab.Panel で同一の CaseListTable コンポーネントを使用
 */
const CaseListTemplate = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  // biome-ignore lint/style/noNonNullAssertion: Drawer component requires non-null RefObject
  const drawerRoot = useRef<HTMLDivElement>(null!);

  // 案件統合モード（loc-app: ProUserMainContent の isConsolidationMode / selectedCaseIds）
  const [isConsolidationMode, setIsConsolidationMode] = useState(false);
  const [selectedCaseIds, setSelectedCaseIds] = useState<string[]>([]);
  const canConsolidate = selectedCaseIds.length === CASE_COUNT_REQUIRED_FOR_CONSOLIDATION;
  const { t } = useTranslation<TranslationKey>(translations);
  const statusCounts = buildStatusCounts(t);
  const statusOptions = buildStatusOptions(t);
  const classificationOptions = buildClassificationOptions(t);
  const departmentOptions = buildDepartmentOptions(t);
  const handleStartSelectingCases = () => setIsConsolidationMode(true);
  const handleCancelSelectingCases = () => {
    setIsConsolidationMode(false);
    setSelectedCaseIds([]);
  };

  return (
    <LocSidebarLayout activeId="cases">
      <PageLayout>
        <PageLayoutContent>
          {/* Header: loc-app では PageLayout.Header 内に ContentHeader を配置 */}
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
                    {t("createCase")}
                  </Button>
                  <Tooltip title={t("copyReceptionMail")} placement="top">
                    <IconButton size="medium" aria-label={t("copyReceptionMail")}>
                      <Icon>
                        <LfMail />
                      </Icon>
                    </IconButton>
                  </Tooltip>
                </div>
              }
            >
              <ContentHeaderTitle>{t("pageTitle")}</ContentHeaderTitle>
            </ContentHeader>
          </PageLayoutHeader>
          <PageLayoutBody>
            {/* CaseSegmentCounter + WorkloadLink: ステータス別の案件数 + 業務状況リンク */}
            <div
              style={{
                display: "flex",
                gap: "var(--aegis-space-large)",
                alignItems: "flex-start",
                paddingBlockEnd: "var(--aegis-space-xSmall)",
              }}
            >
              <dl style={{ margin: 0 }}>
                <SegmentItem label={t("assigneeUnset")} count={852} />
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

              {/* WorkloadLink: 現在の業務状況ページへのリンク */}
              <Card size="small">
                <CardBody>
                  <CardLink href="#">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--aegis-space-xSmall)",
                        alignItems: "center",
                      }}
                    >
                      <Icon size="small">
                        <LfChart />
                      </Icon>
                      <Text variant="body.small" whiteSpace="nowrap">
                        {t("viewWorkload")}
                      </Text>
                    </div>
                  </CardLink>
                </CardBody>
              </Card>
            </div>

            {/* CaseTableToolbar + Tab: loc-app では全タブで同一の CaseListTable を表示 */}
            <Tab.Group variant="plain">
              <PageLayoutStickyContainer>
                {isConsolidationMode ? (
                  // 案件統合モード: 通常 Toolbar を選択操作用 Toolbar に差し替える（loc-app: CaseConsolidationToolbar）
                  <Toolbar>
                    <div
                      style={{
                        display: "flex",
                        gap: "var(--aegis-space-small)",
                        alignItems: "center",
                      }}
                    >
                      <Text variant="component.medium">
                        {t("selectedCount").replace("{count}", String(selectedCaseIds.length))}
                      </Text>
                      <ButtonGroup>
                        <Button variant="plain" color="neutral" leading={LfMarge} disabled={!canConsolidate}>
                          {t("consolidateCases")}
                        </Button>
                        <Button variant="plain" color="neutral" onClick={handleCancelSelectingCases}>
                          {t("cancel")}
                        </Button>
                      </ButtonGroup>
                    </div>
                  </Toolbar>
                ) : (
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
                              {t("tabAll")}
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
                              {t("assigneeUnset")}
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
                              {t("tabInCharge")}
                            </Text>
                          </div>
                        </Tab>
                      </Tab.List>
                    </div>
                    {/* カスタム案件検索条件タブを追加（loc-app: AddCustomCaseSearchConditionDefinitionButton） */}
                    <Tooltip title={t("addTab")} placement="top">
                      <IconButton variant="plain" aria-label={t("addTab")}>
                        <Icon size="small">
                          <LfPlusLarge />
                        </Icon>
                      </IconButton>
                    </Tooltip>
                    <ToolbarSpacer />
                    <Button
                      variant={filterOpen ? "subtle" : "plain"}
                      leading={
                        // loc-app: フィルター適用中は情報バッジを表示（FilterButtonWithDrawer の isFilteringEnabled）
                        <Badge color="information">
                          <Icon>
                            <LfFilter />
                          </Icon>
                        </Badge>
                      }
                      onClick={() => setFilterOpen(true)}
                    >
                      {t("filter")}
                    </Button>
                    <Search placeholder={t("searchPlaceholder")} shrinkOnBlur />
                    <Menu placement="bottom-end">
                      <Menu.Anchor>
                        <Tooltip title={t("displayMenu")} placement="top">
                          <IconButton size="medium" aria-label={t("displayMenu")}>
                            <Icon>
                              <LfEllipsisDot />
                            </Icon>
                          </IconButton>
                        </Tooltip>
                      </Menu.Anchor>
                      <Menu.Box width="small">
                        {/* loc-app IconButtonWithMenu の構成:
                            「表示項目をカスタマイズ」と「案件をエクスポート/案件をまとめる」グループの間にだけ全幅の区切り線。
                            エクスポートと統合は同一グループなので両者の間に線は引かない */}
                        <ActionList size="large">
                          <ActionList.Item>
                            <ActionList.Body leading={LfFilterAlt} aria-label={t("customizeDisplay")}>
                              {t("customizeDisplay")}
                            </ActionList.Body>
                          </ActionList.Item>
                        </ActionList>
                        <Divider />
                        <ActionList size="large">
                          <ActionList.Item>
                            <ActionList.Body leading={LfDownload} aria-label={t("exportCases")}>
                              {t("exportCases")}
                            </ActionList.Body>
                          </ActionList.Item>
                          {/* 案件統合（loc-app: feature flag fe-enabled-consolidate-cases。dev は有効） */}
                          <ActionList.Item onClick={handleStartSelectingCases}>
                            <ActionList.Body leading={LfMarge} aria-label={t("consolidateCases")}>
                              {t("consolidateCases")}
                            </ActionList.Body>
                          </ActionList.Item>
                        </ActionList>
                      </Menu.Box>
                    </Menu>
                  </Toolbar>
                )}
              </PageLayoutStickyContainer>

              {/* loc-app: すべてのタブパネルで同一の CaseListTable (CaseDataTable | CaseTable) を描画 */}
              <Tab.Panels ref={drawerRoot}>
                <Tab.Panel>
                  <CaseDataTable
                    cases={sampleCases}
                    isConsolidationMode={isConsolidationMode}
                    selectedCaseIds={selectedCaseIds}
                    onSelectedCaseIdsChange={setSelectedCaseIds}
                  />
                </Tab.Panel>
                <Tab.Panel>
                  <CaseDataTable
                    cases={sampleCases}
                    isConsolidationMode={isConsolidationMode}
                    selectedCaseIds={selectedCaseIds}
                    onSelectedCaseIdsChange={setSelectedCaseIds}
                  />
                </Tab.Panel>
                <Tab.Panel>
                  <CaseDataTable
                    cases={sampleCases}
                    isConsolidationMode={isConsolidationMode}
                    selectedCaseIds={selectedCaseIds}
                    onSelectedCaseIdsChange={setSelectedCaseIds}
                  />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </PageLayoutBody>
        </PageLayoutContent>

        {/* フィルター Drawer */}
        <Drawer open={filterOpen} onOpenChange={setFilterOpen} position="end" root={drawerRoot} lockScroll={false}>
          <Drawer.Header>
            <ContentHeader>
              <ContentHeaderTitle>{t("filter")}</ContentHeaderTitle>
            </ContentHeader>
          </Drawer.Header>
          <Drawer.Body>
            {/* loc-app: CaseTableToolbar/FilterButtonWithDrawer の FilterBody。
                並び順: 案件番号 → 案件タイプ → 案件ステータス → 担当者 → 依頼部署 → 依頼者 → 納期 → 案件作成日 → 更新日 → 保存先 */}
            <Form>
              {/* 案件番号 (KeyFilter) */}
              <FormControl>
                <FormControl.Label>{t("caseId")}</FormControl.Label>
                <FormControl.Toolbar ghost>
                  <Button size="xSmall" variant="gutterless">
                    {t("clear")}
                  </Button>
                </FormControl.Toolbar>
                <TextField placeholder={t("caseNumberSearchPlaceholder")} />
              </FormControl>

              {/* 案件タイプ (ClassificationFilter) */}
              <FormControl>
                <FormControl.Label>{t("caseType")}</FormControl.Label>
                <FormControl.Toolbar ghost>
                  <Button size="xSmall" variant="gutterless">
                    {t("clear")}
                  </Button>
                </FormControl.Toolbar>
                <Select placeholder={t("all")} options={classificationOptions} />
              </FormControl>

              {/* 案件ステータス (StatusFilter) */}
              <FormControl>
                <FormControl.Label>{t("caseStatus")}</FormControl.Label>
                <FormControl.Toolbar ghost>
                  <Button size="xSmall" variant="gutterless">
                    {t("clear")}
                  </Button>
                </FormControl.Toolbar>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--aegis-space-xSmall)",
                  }}
                >
                  <TagPicker options={statusOptions} placeholder={t("all")} aria-label={t("selectStatus")} />
                  <Checkbox>{t("excludeClosed")}</Checkbox>
                </div>
              </FormControl>

              {/* 担当者 (AssigneesFilter): AND/OR 検索 + 案件担当者 + 副担当者 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-medium)",
                }}
              >
                <FormControl>
                  <FormControl.Label
                    trailing={
                      <Popover trigger="hover" arrow placement="top-end">
                        <Popover.Anchor>
                          <IconButton aria-label={t("assigneesHelp")}>
                            <Icon>
                              <LfQuestionCircle />
                            </Icon>
                          </IconButton>
                        </Popover.Anchor>
                        <Popover.Content width="small">
                          <Popover.Body>
                            <Text whiteSpace="pre-wrap">{t("assigneesHelperText")}</Text>
                          </Popover.Body>
                        </Popover.Content>
                      </Popover>
                    }
                  >
                    {t("assignees")}
                  </FormControl.Label>
                  <RadioGroup orientation="horizontal" defaultValue="and">
                    <Radio value="and">{t("andSearch")}</Radio>
                    <Radio value="or">{t("orSearch")}</Radio>
                  </RadioGroup>
                </FormControl>

                {/* 案件担当者 (MainAssigneeFilter) */}
                <FormControl>
                  <FormControl.Label>{t("mainAssignee")}</FormControl.Label>
                  <FormControl.Toolbar ghost>
                    <Button size="xSmall" variant="gutterless">
                      {t("clear")}
                    </Button>
                  </FormControl.Toolbar>
                  <TagPicker options={assigneeOptions} placeholder={t("all")} aria-label={t("selectMainAssignee")} />
                </FormControl>

                {/* 副担当者 (SubAssigneeFilter) */}
                <FormControl>
                  <FormControl.Label>{t("subAssignee")}</FormControl.Label>
                  <FormControl.Toolbar ghost>
                    <Button size="xSmall" variant="gutterless">
                      {t("clear")}
                    </Button>
                  </FormControl.Toolbar>
                  <TagPicker options={assigneeOptions} placeholder={t("all")} aria-label={t("selectSubAssignee")} />
                </FormControl>
              </div>

              {/* 依頼部署 (ClientDepartmentFilter) */}
              <FormControl>
                <FormControl.Label>{t("requesterDepartment")}</FormControl.Label>
                <FormControl.Toolbar ghost>
                  <Button size="xSmall" variant="gutterless">
                    {t("clear")}
                  </Button>
                </FormControl.Toolbar>
                <TagPicker options={departmentOptions} placeholder={t("all")} />
              </FormControl>

              {/* 依頼者 (ClientFilter) */}
              <FormControl>
                <FormControl.Label>{t("requester")}</FormControl.Label>
                <FormControl.Toolbar ghost>
                  <Button size="xSmall" variant="gutterless">
                    {t("clear")}
                  </Button>
                </FormControl.Toolbar>
                <TagPicker options={assigneeOptions} placeholder={t("all")} />
              </FormControl>

              {/* 納期 (DateFilter) */}
              <FormControl>
                <FormControl.Label>{t("dueDate")}</FormControl.Label>
                <FormControl.Toolbar ghost>
                  <Button size="xSmall" variant="gutterless">
                    {t("clear")}
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
                  <Checkbox>{t("relativeToToday")}</Checkbox>
                </div>
              </FormControl>

              {/* 案件作成日 (DateFilter) */}
              <FormControl>
                <FormControl.Label>{t("caseCreatedDate")}</FormControl.Label>
                <FormControl.Toolbar ghost>
                  <Button size="xSmall" variant="gutterless">
                    {t("clear")}
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
                  <Checkbox>{t("relativeToToday")}</Checkbox>
                </div>
              </FormControl>

              {/* 更新日 (DateFilter) */}
              <FormControl>
                <FormControl.Label>{t("updatedDate")}</FormControl.Label>
                <FormControl.Toolbar ghost>
                  <Button size="xSmall" variant="gutterless">
                    {t("clear")}
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
                  <Checkbox>{t("relativeToToday")}</Checkbox>
                </div>
              </FormControl>

              {/* 保存先 (SpaceFilter) */}
              <FormControl>
                <FormControl.Label>{t("space")}</FormControl.Label>
                <FormControl.Toolbar ghost>
                  <Button size="xSmall" variant="gutterless">
                    {t("clear")}
                  </Button>
                </FormControl.Toolbar>
                <Select
                  placeholder={t("all")}
                  options={[
                    { label: "営業部スペース", value: "sales" },
                    { label: "開発部スペース", value: "dev" },
                    { label: "経理部スペース", value: "accounting" },
                    { label: "人事部スペース", value: "hr" },
                  ]}
                />
              </FormControl>
            </Form>
          </Drawer.Body>
          <Divider />
          <Drawer.Footer>
            {/* loc-app: ResetButton（variant="plain"） */}
            <div style={{ marginLeft: "auto" }}>
              <Button variant="plain" onClick={() => setFilterOpen(false)}>
                {t("reset")}
              </Button>
            </div>
          </Drawer.Footer>
        </Drawer>
      </PageLayout>
    </LocSidebarLayout>
  );
};

export default CaseListTemplate;
`;export{e as default};