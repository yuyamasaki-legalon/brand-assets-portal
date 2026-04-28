import {
  LfArchive,
  LfArrowUpRightFromSquare,
  LfCheckBook,
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
  TextField,
  Toolbar,
  ToolbarSpacer,
  Tooltip,
} from "@legalforce/aegis-react";
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

const caseDetail = {
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
  dueDate: "2024/11/08",
};

const keywords = ["業務委託", "契約書レビュー", "リスク確認", "秘密保持", "損害賠償", "契約期間"];

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

const referenceMaterials = [
  { title: "業務委託契約のモデル条項", category: "契約ナレッジ" },
  { title: "秘密保持契約のチェックポイント", category: "社内ドキュメント" },
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

export const LocCaseCodexSlack = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseRow | null>(null);
  const [overviewExpanded, setOverviewExpanded] = useState(false);
  // biome-ignore lint/style/noNonNullAssertion: Drawer component requires non-null RefObject
  const drawerRoot = useRef<HTMLDivElement>(null!);

  const handleRowClick = (row: CaseRow) => {
    setSelectedCase(row);
    setDetailOpen(true);
    setOverviewExpanded(false);
  };

  const mergedCaseDetail = {
    ...caseDetail,
    ...(selectedCase
      ? {
          id: selectedCase.id,
          title: selectedCase.title,
          status: selectedCase.status,
          requester: selectedCase.requester,
          department: selectedCase.department,
          dueDate: selectedCase.dueDate,
        }
      : {}),
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

          {/* 詳細 Drawer */}
          <Drawer open={detailOpen} onOpenChange={setDetailOpen} position="end" root={drawerRoot} lockScroll={false}>
            <Drawer.Header>
              <ContentHeader>
                <ContentHeader.Title>{mergedCaseDetail.title}</ContentHeader.Title>
                <ContentHeader.Description>{mergedCaseDetail.id}</ContentHeader.Description>
                <TagGroup>
                  <Tag color="neutral">{mergedCaseDetail.department}</Tag>
                  <Tag color="blue">{mergedCaseDetail.status}</Tag>
                </TagGroup>
              </ContentHeader>
            </Drawer.Header>
            <Drawer.Body>
              <Tab.Group variant="line" defaultIndex={0}>
                <Tab.List>
                  <Tab>案件情報</Tab>
                  <Tab>案件サマリー</Tab>
                  <Tab>関連ファイル</Tab>
                  <Tab>関連案件</Tab>
                  <Tab>参考情報</Tab>
                  <Tab>参考資料</Tab>
                </Tab.List>
                <Tab.Panels>
                  <Tab.Panel>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                        gap: "var(--aegis-space-large)",
                      }}
                    >
                      <Form>
                        <FormControl>
                          <FormControl.Label>案件タイプ</FormControl.Label>
                          <Select
                            placeholder="選択してください"
                            defaultValue={
                              classificationOptions.find((option) => option.label === caseDetail.classification)?.value
                            }
                            options={classificationOptions}
                          />
                        </FormControl>
                        <FormControl>
                          <FormControl.Label>案件ステータス</FormControl.Label>
                          <Select
                            placeholder="選択してください"
                            defaultValue={
                              statusOptions.find((option) => option.label === mergedCaseDetail.status)?.value
                            }
                            options={statusOptions}
                          />
                        </FormControl>
                        <FormControl>
                          <FormControl.Label>納期</FormControl.Label>
                          <TextField defaultValue={mergedCaseDetail.dueDate} />
                        </FormControl>
                      </Form>
                      <Form>
                        <FormControl>
                          <FormControl.Label>依頼部署</FormControl.Label>
                          <Select
                            placeholder="選択してください"
                            defaultValue={
                              departmentOptions.find((option) => option.label === mergedCaseDetail.department)?.value
                            }
                            options={departmentOptions}
                          />
                        </FormControl>
                        <FormControl>
                          <FormControl.Label>依頼者</FormControl.Label>
                          <Select
                            placeholder="選択してください"
                            defaultValue={
                              assigneeOptions.find((option) => option.label === mergedCaseDetail.requester)?.value
                            }
                            options={assigneeOptions}
                          />
                        </FormControl>
                        <FormControl>
                          <FormControl.Label>主担当者</FormControl.Label>
                          <Select
                            placeholder="選択してください"
                            defaultValue={
                              assigneeOptions.find((option) => option.label === caseDetail.mainAssignee)?.value
                            }
                            options={assigneeOptions}
                          />
                        </FormControl>
                      </Form>
                    </div>
                  </Tab.Panel>
                  <Tab.Panel>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--aegis-space-medium)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--aegis-space-xSmall)" }}>
                        <Text variant="body.small" color="subtle">
                          依頼スペース
                        </Text>
                        <Tag>{caseDetail.space}</Tag>
                      </div>
                      <div style={{ display: "flex", gap: "var(--aegis-space-xSmall)", flexWrap: "wrap" }}>
                        <TagGroup>
                          {keywords.map((keyword) => (
                            <Tag key={keyword} color="neutral">
                              {keyword}
                            </Tag>
                          ))}
                        </TagGroup>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-xSmall)" }}>
                        <Text variant="body.small" color="subtle">
                          案件サマリー
                        </Text>
                        <Text style={{ whiteSpace: "pre-line" }} numberOfLines={overviewExpanded ? undefined : 4}>
                          {mergedCaseDetail.overview}
                        </Text>
                        <Button variant="gutterless" size="xSmall" onClick={() => setOverviewExpanded((prev) => !prev)}>
                          {overviewExpanded ? "閉じる" : "もっと見る"}
                        </Button>
                      </div>
                      <div>
                        <Text variant="body.small" color="subtle">
                          依頼ファイル
                        </Text>
                        <Button
                          as="a"
                          href={caseDetail.url}
                          target="_blank"
                          rel="noreferrer"
                          variant="plain"
                          leading={LfFile}
                          trailing={LfArrowUpRightFromSquare}
                        >
                          ドキュメントを開く
                        </Button>
                      </div>
                    </div>
                  </Tab.Panel>
                  <Tab.Panel>
                    <TableContainer>
                      <Table>
                        <Table.Head>
                          <Table.Row>
                            <Table.Cell as="th">ファイル名</Table.Cell>
                            <Table.Cell as="th">更新日時</Table.Cell>
                          </Table.Row>
                        </Table.Head>
                        <Table.Body>
                          {linkedFiles.map((file) => (
                            <Table.Row key={file.name}>
                              <Table.Cell>
                                <Button
                                  as="a"
                                  href="#"
                                  rel="noreferrer"
                                  variant="plain"
                                  leading={LfFile}
                                  trailing={LfArrowUpRightFromSquare}
                                >
                                  {file.name}
                                </Button>
                              </Table.Cell>
                              <Table.Cell>
                                <Text variant="component.medium">{file.updatedAt}</Text>
                              </Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table>
                    </TableContainer>
                  </Tab.Panel>
                  <Tab.Panel>
                    <TableContainer>
                      <Table>
                        <Table.Head>
                          <Table.Row>
                            <Table.Cell as="th">案件番号</Table.Cell>
                            <Table.Cell as="th">案件名</Table.Cell>
                            <Table.Cell as="th">ステータス</Table.Cell>
                          </Table.Row>
                        </Table.Head>
                        <Table.Body>
                          {relatedCases.map((relatedCase) => (
                            <Table.Row key={relatedCase.id}>
                              <Table.Cell>{relatedCase.id}</Table.Cell>
                              <Table.Cell maxWidth="large">
                                <Tooltip title={relatedCase.title} placement="top-start" onlyOnOverflow>
                                  <Text>{relatedCase.title}</Text>
                                </Tooltip>
                              </Table.Cell>
                              <Table.Cell>
                                <StatusLabel>{relatedCase.status}</StatusLabel>
                              </Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table>
                    </TableContainer>
                  </Tab.Panel>
                  <Tab.Panel>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--aegis-space-xSmall)",
                      }}
                    >
                      {referenceLinks.map((link) => (
                        <Button
                          key={link.title}
                          as="a"
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          variant="plain"
                          leading={LfArrowUpRightFromSquare}
                        >
                          {link.title}
                        </Button>
                      ))}
                    </div>
                  </Tab.Panel>
                  <Tab.Panel>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                        gap: "var(--aegis-space-medium)",
                      }}
                    >
                      {referenceMaterials.map((material) => (
                        <div
                          key={material.title}
                          style={{
                            border: "1px solid var(--aegis-color-border-default)",
                            borderRadius: "var(--aegis-radius-medium)",
                            padding: "var(--aegis-space-medium)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--aegis-space-xSmall)",
                          }}
                        >
                          <Tag color="neutral">{material.category}</Tag>
                          <Text variant="body.medium.bold">{material.title}</Text>
                          <Button variant="plain" size="small" trailing={LfArrowUpRightFromSquare}>
                            開く
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </Drawer.Body>
            <Drawer.Footer>
              <div style={{ marginLeft: "auto", display: "flex", gap: "var(--aegis-space-small)" }}>
                <Button variant="subtle" onClick={() => setDetailOpen(false)}>
                  閉じる
                </Button>
                <Button leading={LfMail}>依頼者に連絡</Button>
              </div>
            </Drawer.Footer>
          </Drawer>

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
      </SidebarInset>
    </SidebarProvider>
  );
};
