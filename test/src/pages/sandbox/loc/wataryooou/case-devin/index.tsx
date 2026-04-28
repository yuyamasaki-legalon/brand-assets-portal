import {
  LfArchive,
  LfBarSparkles,
  LfBook,
  LfCheckBook,
  LfCloseLarge,
  LfDownload,
  LfEllipsisDot,
  LfFile,
  LfFileLines,
  LfFileSigned,
  LfFilesLine,
  LfFilter,
  LfFilterAlt,
  LfHome,
  LfInformationCircle,
  LfMagnifyingGlass,
  LfMail,
  LfPlusLarge,
  LfQuestionCircle,
  LfScaleBalanced,
  LfWand,
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
  EmptyState,
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
import { useRef, useState } from "react";

type PaneType = "case-attribute" | "case-summary" | "linked-file" | "linked-case" | "reference" | "book";

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

const referenceLinks = [
  { title: "業務委託契約に関するガイドライン", url: "https://example.com/guideline" },
  { title: "秘密保持条項チェックリスト", url: "https://example.com/checklist" },
  { title: "損害賠償条項のサンプル", url: "https://example.com/sample" },
];

const keywords = ["業務委託", "契約書レビュー", "リスク確認", "秘密保持", "損害賠償", "契約期間"];

type CaseRow = (typeof sampleCases)[number];

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

const inlineStyles = {
  paneBody: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "var(--aegis-space-medium)",
  },
  summaryBody: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "var(--aegis-space-medium)",
  },
  summaryTextGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "var(--aegis-space-xxSmall)",
  },
  drawerSection: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "var(--aegis-space-medium)",
    padding: "var(--aegis-space-medium)",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "var(--aegis-space-small)",
  },
  tabButton: {
    display: "flex",
    alignItems: "center",
    gap: "var(--aegis-space-xxSmall)",
    padding: "var(--aegis-space-xSmall) var(--aegis-space-small)",
    borderRadius: "var(--aegis-radius-medium)",
    border: "1px solid var(--aegis-color-border-default)",
    backgroundColor: "var(--aegis-color-surface-default)",
    cursor: "pointer",
  },
  tabButtonActive: {
    backgroundColor: "var(--aegis-color-background-neutral-subtle)",
    borderColor: "var(--aegis-color-border-strong)",
  },
};

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

export const LocCaseDevin = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseRow | null>(null);
  const [paneType, setPaneType] = useState<PaneType>("case-attribute");
  const [caseType, setCaseType] = useState("contract_review");
  const [status, setStatus] = useState("legal_review");
  const [assignee, setAssignee] = useState("yamada");
  const [department, setDepartment] = useState("sales");
  const [requester, setRequester] = useState("takahashi");
  // biome-ignore lint/style/noNonNullAssertion: Drawer component requires non-null RefObject
  const drawerRoot = useRef<HTMLDivElement>(null!);

  const handleRowClick = (caseItem: CaseRow) => {
    setSelectedCase(caseItem);
    setDetailOpen(true);
    setPaneType("case-attribute");
  };

  const renderPaneContent = () => {
    if (paneType === "case-summary") {
      return (
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
            <Link href="#" size="small" leading={LfQuestionCircle} target="_blank" rel="noreferrer" underline>
              案件要約機能のご利用における注意点
            </Link>
          </div>
        </div>
      );
    }

    if (paneType === "linked-file") {
      return (
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
      );
    }

    if (paneType === "linked-case") {
      return (
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
      );
    }

    if (paneType === "reference") {
      return (
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
      );
    }

    if (paneType === "book") {
      return (
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
      );
    }

    return (
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
              <Text variant="body.medium">佐藤 花子</Text>
              <Text variant="body.medium">鈴木 一郎</Text>
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
            <DateField defaultValue={new Date("2024-11-08")} />
          </FormControl>
          <FormControl>
            <FormControl.Label>保存先</FormControl.Label>
            <Text variant="body.medium">営業部スペース</Text>
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
    );
  };

  const getPaneTitle = () => {
    switch (paneType) {
      case "case-attribute":
        return "案件情報";
      case "case-summary":
        return "案件サマリー";
      case "linked-file":
        return "関連ファイル";
      case "linked-case":
        return "関連案件";
      case "reference":
        return "参考情報";
      case "book":
        return "参考資料";
      default:
        return "案件情報";
    }
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

          <Drawer open={filterOpen} onOpenChange={setFilterOpen} position="end" root={drawerRoot} lockScroll={false}>
            <Drawer.Header>
              <ContentHeader>
                <ContentHeader.Title>フィルター</ContentHeader.Title>
              </ContentHeader>
            </Drawer.Header>
            <Drawer.Body>
              <Form>
                <FormControl>
                  <FormControl.Label>案件番号/案件名</FormControl.Label>
                  <FormControl.Toolbar ghost>
                    <Button size="xSmall" variant="gutterless">
                      クリア
                    </Button>
                  </FormControl.Toolbar>
                  <TextField placeholder="案件番号または案件名を入力" />
                </FormControl>

                <FormControl>
                  <FormControl.Label>案件タイプ</FormControl.Label>
                  <FormControl.Toolbar ghost>
                    <Button size="xSmall" variant="gutterless">
                      クリア
                    </Button>
                  </FormControl.Toolbar>
                  <Select placeholder="選択してください" options={classificationOptions} />
                </FormControl>

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

                <FormControl>
                  <FormControl.Label>主担当者</FormControl.Label>
                  <FormControl.Toolbar ghost>
                    <Button size="xSmall" variant="gutterless">
                      クリア
                    </Button>
                  </FormControl.Toolbar>
                  <Select placeholder="選択してください" options={assigneeOptions} />
                </FormControl>

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

                <FormControl>
                  <FormControl.Label>依頼部署</FormControl.Label>
                  <FormControl.Toolbar ghost>
                    <Button size="xSmall" variant="gutterless">
                      クリア
                    </Button>
                  </FormControl.Toolbar>
                  <Select placeholder="選択してください" options={departmentOptions} />
                </FormControl>

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

          <Drawer
            open={detailOpen}
            onOpenChange={setDetailOpen}
            position="end"
            root={drawerRoot}
            lockScroll={false}
            width="large"
          >
            <Drawer.Header>
              <ContentHeader
                trailing={
                  <Tooltip title="閉じる" placement="top">
                    <IconButton variant="plain" size="small" aria-label="閉じる" onClick={() => setDetailOpen(false)}>
                      <Icon>
                        <LfCloseLarge />
                      </Icon>
                    </IconButton>
                  </Tooltip>
                }
              >
                <ContentHeader.Description variant="data">{selectedCase?.id}</ContentHeader.Description>
                <ContentHeader.Title>{selectedCase?.title}</ContentHeader.Title>
              </ContentHeader>
            </Drawer.Header>
            <Drawer.Body>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "var(--aegis-space-xSmall)",
                    padding: "var(--aegis-space-small)",
                    backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
                    borderRadius: "var(--aegis-radius-medium)",
                  }}
                >
                  <Button
                    size="small"
                    variant={paneType === "case-attribute" ? "subtle" : "plain"}
                    onClick={() => setPaneType("case-attribute")}
                    leading={LfInformationCircle}
                  >
                    案件情報
                  </Button>
                  <Button
                    size="small"
                    variant={paneType === "case-summary" ? "subtle" : "plain"}
                    onClick={() => setPaneType("case-summary")}
                    leading={LfBarSparkles}
                  >
                    案件サマリー
                  </Button>
                  <Button
                    size="small"
                    variant={paneType === "linked-file" ? "subtle" : "plain"}
                    onClick={() => setPaneType("linked-file")}
                    leading={LfFile}
                  >
                    関連ファイル
                  </Button>
                  <Button
                    size="small"
                    variant={paneType === "linked-case" ? "subtle" : "plain"}
                    onClick={() => setPaneType("linked-case")}
                    leading={LfArchive}
                  >
                    関連案件
                  </Button>
                  <Button
                    size="small"
                    variant={paneType === "reference" ? "subtle" : "plain"}
                    onClick={() => setPaneType("reference")}
                    leading={LfScaleBalanced}
                  >
                    参考情報
                  </Button>
                  <Button
                    size="small"
                    variant={paneType === "book" ? "subtle" : "plain"}
                    onClick={() => setPaneType("book")}
                    leading={LfBook}
                  >
                    参考資料
                  </Button>
                </div>

                <div style={inlineStyles.drawerSection}>
                  <Text as="h3" variant="title.small">
                    {getPaneTitle()}
                  </Text>
                  <Divider />
                  {renderPaneContent()}
                </div>
              </div>
            </Drawer.Body>
          </Drawer>
        </PageLayout>
      </SidebarInset>
    </SidebarProvider>
  );
};
