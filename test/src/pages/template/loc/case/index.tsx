import {
  LfChart,
  LfDownload,
  LfEllipsisDot,
  LfFilter,
  LfFilterAlt,
  LfMail,
  LfPlusLarge,
} from "@legalforce/aegis-icons";
import { Box } from "@legalforce/aegis-illustrations/react";
import {
  ActionList,
  Avatar,
  Badge,
  Button,
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
import { LocSidebarLayout } from "../_shared";

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

const caseColumns: DataTableColumnDef<CaseItem, string>[] = [
  {
    id: "case-key",
    name: "案件番号",
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
    name: "案件名",
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
    name: "主担当者",
    getValue: (row): string => row.mainAssignee,
    pinnable: false,
    renderCell: ({ value }) => <DataTableCell leading={<Avatar size="xSmall" name={value} />}>{value}</DataTableCell>,
  },
  {
    id: "case-status",
    name: "案件ステータス",
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
    name: "依頼者",
    getValue: (row): string => row.requester,
    pinnable: false,
    renderCell: ({ value }) => <DataTableCell leading={<Avatar size="xSmall" name={value} />}>{value}</DataTableCell>,
  },
  {
    id: "case-sub-assignees",
    name: "副担当者",
    getValue: (row): string => (row.subAssignees.length > 0 ? row.subAssignees.join(", ") : "—"),
    pinnable: false,
  },
  {
    id: "case-classification",
    name: "案件分類",
    getValue: (row): string => row.classification,
    pinnable: false,
  },
  {
    id: "space",
    name: "スペース",
    getValue: (row): string => row.space,
    pinnable: false,
  },
  {
    id: "case-due-date",
    name: "納期",
    getValue: (row): string => row.dueDate,
    sortable: true,
    pinnable: false,
  },
  {
    id: "case-last-message-time",
    name: "最終メッセージ日時",
    getValue: (row): string => row.lastMessageTime,
    sortable: true,
    pinnable: false,
  },
  {
    id: "case-created-time",
    name: "作成日時",
    getValue: (row): string => row.createdAt,
    sortable: true,
    pinnable: false,
  },
  {
    id: "department",
    name: "依頼部署",
    getValue: (row): string => row.department,
    pinnable: false,
  },
];

// カラム表示順序（loc-app では atom + localStorage で管理）
const defaultColumnOrder = caseColumns.map((col) => col.id);

// カラム表示/非表示（loc-app では atom で管理）
const defaultColumnVisibility: Record<string, boolean> = Object.fromEntries(caseColumns.map((col) => [col.id, true]));

const statusCounts = [
  { label: "法務確認中", count: 45 },
  { label: "依頼者確認待ち", count: 28 },
  { label: "未着手", count: 156 },
  { label: "対応中", count: 37 },
  { label: "差戻し", count: 8 },
  { label: "完了", count: 999, isOverflow: true, isClosed: true },
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
        <Text variant="body.xxLarge.bold">{count < displayMax ? count : `${displayMax}+`}</Text>
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
 * - Suspense + ErrorBoundary でラップ
 */
const CaseDataTable = ({ cases }: { cases: CaseItem[] }) => {
  const [page, setPage] = useState(1);
  const badgedRows = useMemo(() => cases.filter((c) => c.hasUnread).map((c) => c.id), [cases]);

  // テナントに案件が存在しない場合の EmptyState
  if (cases.length === 0) {
    return (
      <EmptyState title="案件がまだありません" visual={<Box />}>
        案件を作成して法務相談を始めましょう
      </EmptyState>
    );
  }

  return (
    <div style={{ display: "grid", gap: "var(--aegis-space-medium)" }}>
      <DataTable
        columns={caseColumns}
        rows={cases}
        getRowId={(row) => row.id}
        stickyHeader
        badgedRows={badgedRows}
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
 * - Feature flag `fe-enable-data-table-for-case` で CaseDataTable / CaseTable を切替
 * - すべての Tab.Panel で同一の CaseListTable コンポーネントを使用
 */
const CaseListTemplate = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  // biome-ignore lint/style/noNonNullAssertion: Drawer component requires non-null RefObject
  const drawerRoot = useRef<HTMLDivElement>(null!);

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
              <ContentHeaderTitle>案件</ContentHeaderTitle>
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
                        現在の業務状況を見る
                      </Text>
                    </div>
                  </CardLink>
                </CardBody>
              </Card>
            </div>

            {/* CaseTableToolbar + Tab: loc-app では全タブで同一の CaseListTable を表示 */}
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

              {/* loc-app: すべてのタブパネルで同一の CaseListTable (CaseDataTable | CaseTable) を描画 */}
              <Tab.Panels ref={drawerRoot}>
                <Tab.Panel>
                  <CaseDataTable cases={sampleCases} />
                </Tab.Panel>
                <Tab.Panel>
                  <CaseDataTable cases={sampleCases} />
                </Tab.Panel>
                <Tab.Panel>
                  <CaseDataTable cases={sampleCases} />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </PageLayoutBody>
        </PageLayoutContent>

        {/* フィルター Drawer */}
        <Drawer open={filterOpen} onOpenChange={setFilterOpen} position="end" root={drawerRoot} lockScroll={false}>
          <Drawer.Header>
            <ContentHeader>
              <ContentHeaderTitle>フィルター</ContentHeaderTitle>
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

              {/* 案件分類 */}
              <FormControl>
                <FormControl.Label>案件分類</FormControl.Label>
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

              {/* スペース */}
              <FormControl>
                <FormControl.Label>スペース</FormControl.Label>
                <FormControl.Toolbar ghost>
                  <Button size="xSmall" variant="gutterless">
                    クリア
                  </Button>
                </FormControl.Toolbar>
                <Select
                  placeholder="選択してください"
                  options={[
                    { label: "営業部スペース", value: "sales" },
                    { label: "開発部スペース", value: "dev" },
                    { label: "経理部スペース", value: "accounting" },
                    { label: "人事部スペース", value: "hr" },
                  ]}
                />
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

              {/* 最終メッセージ日時 */}
              <FormControl>
                <FormControl.Label>最終メッセージ日時</FormControl.Label>
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
    </LocSidebarLayout>
  );
};

export default CaseListTemplate;
