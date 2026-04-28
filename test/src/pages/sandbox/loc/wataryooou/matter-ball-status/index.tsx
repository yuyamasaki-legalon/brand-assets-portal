import {
  LfArchive,
  LfCheckBook,
  LfCloseLarge,
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
  Tag,
  TagPicker,
  Text,
  TextField,
  Toolbar,
  ToolbarSpacer,
  Tooltip,
} from "@legalforce/aegis-react";
import { useRef, useState } from "react";

type BallStatus = "legal" | "business";

interface CaseItem {
  id: string;
  title: string;
  status: string;
  ballStatus: BallStatus;
  lastRepliedBy: "legal" | "business";
  lastRepliedAt: string;
  dueDate: string;
  createdAt: string;
  requester: string;
  department: string;
  mainAssignee: string;
  subAssignees: string[];
  classification: string;
  hasUnread?: boolean;
}

const sampleCases: CaseItem[] = [
  {
    id: "2024-03-0020",
    title: "業務委託契約書のレビュー依頼",
    status: "法務確認中",
    ballStatus: "legal",
    lastRepliedBy: "business",
    lastRepliedAt: "2025/10/22 18:30",
    dueDate: "2024/11/08",
    createdAt: "2024/10/02 09:12",
    requester: "山田 太郎",
    department: "営業部",
    mainAssignee: "佐藤 花子",
    subAssignees: ["高橋 健太"],
    classification: "契約書レビュー",
  },
  {
    id: "2024-06-0008",
    title: "秘密保持契約書の確認",
    status: "依頼者確認待ち",
    ballStatus: "business",
    lastRepliedBy: "legal",
    lastRepliedAt: "2025/10/15 17:11",
    dueDate: "2024/12/15",
    createdAt: "2024/09/21 11:03",
    requester: "佐藤 花子",
    department: "開発部",
    mainAssignee: "山田 太郎",
    subAssignees: ["伊藤 さくら", "鈴木 一郎"],
    classification: "契約書レビュー",
  },
  {
    id: "2025-09-0002",
    title: "新規取引先との基本契約書作成",
    status: "対応中",
    ballStatus: "legal",
    lastRepliedBy: "business",
    lastRepliedAt: "2025/09/04 13:29",
    dueDate: "2025/01/20",
    createdAt: "2024/08/09 10:40",
    requester: "鈴木 一郎",
    department: "経理部",
    mainAssignee: "中村 翔",
    subAssignees: [],
    classification: "契約書レビュー",
  },
  {
    id: "2025-08-0052",
    title: "サービス利用規約の改定",
    status: "未着手",
    ballStatus: "legal",
    lastRepliedBy: "business",
    lastRepliedAt: "2025/08/27 15:07",
    dueDate: "2025/08/29",
    createdAt: "2025/06/18 15:30",
    requester: "田中 美咲",
    department: "企画部",
    mainAssignee: "加藤 誠",
    subAssignees: ["佐藤 花子"],
    classification: "法務相談",
  },
  {
    id: "2025-08-0051",
    title: "ライセンス契約に関する相談",
    status: "完了",
    ballStatus: "business",
    lastRepliedBy: "legal",
    lastRepliedAt: "2025/08/27 15:06",
    dueDate: "2025/09/10",
    createdAt: "2025/05/08 10:10",
    requester: "高橋 健太",
    department: "開発部",
    mainAssignee: "佐藤 花子",
    subAssignees: ["中村 翔"],
    classification: "法務相談",
  },
  {
    id: "2025-08-0023",
    title: "個人情報取扱いに関する法務相談",
    status: "法務確認中",
    ballStatus: "legal",
    lastRepliedBy: "business",
    lastRepliedAt: "2025/08/13 16:19",
    dueDate: "2025/08/31",
    createdAt: "2025/07/12 09:18",
    requester: "伊藤 さくら",
    department: "人事部",
    mainAssignee: "山田 太郎",
    subAssignees: [],
    classification: "法務相談",
  },
  {
    id: "2025-08-0014",
    title: "商標登録に関する確認",
    status: "差戻し",
    ballStatus: "business",
    lastRepliedBy: "legal",
    lastRepliedAt: "2025/08/07 13:23",
    dueDate: "2025/09/05",
    createdAt: "2025/07/21 17:05",
    requester: "渡辺 大輔",
    department: "マーケティング部",
    mainAssignee: "佐藤 花子",
    subAssignees: ["小林 愛"],
    classification: "法務相談",
  },
  {
    id: "2025-07-0107",
    title: "海外取引に関する契約書確認",
    status: "対応中",
    ballStatus: "legal",
    lastRepliedBy: "business",
    lastRepliedAt: "2025/07/30 09:24",
    dueDate: "2025/08/15",
    createdAt: "2025/06/30 08:34",
    requester: "中村 翔",
    department: "海外事業部",
    mainAssignee: "山田 太郎",
    subAssignees: ["高橋 健太", "鈴木 一郎"],
    classification: "契約書レビュー",
  },
  {
    id: "2025-07-0092",
    title: "労働契約書のテンプレート作成",
    status: "依頼者確認待ち",
    ballStatus: "business",
    lastRepliedBy: "legal",
    lastRepliedAt: "2025/07/24 10:55",
    dueDate: "2025/07/28",
    createdAt: "2025/06/11 14:20",
    requester: "小林 愛",
    department: "人事部",
    mainAssignee: "加藤 誠",
    subAssignees: ["田中 美咲"],
    classification: "契約書レビュー",
    hasUnread: true,
  },
  {
    id: "2025-07-0086",
    title: "知的財産権に関する相談",
    status: "未着手",
    ballStatus: "legal",
    lastRepliedBy: "business",
    lastRepliedAt: "2025/07/18 18:37",
    dueDate: "2025/07/25",
    createdAt: "2025/06/01 11:30",
    requester: "加藤 誠",
    department: "研究開発部",
    mainAssignee: "山田 太郎",
    subAssignees: ["佐藤 花子"],
    classification: "法務相談",
    hasUnread: true,
  },
  {
    id: "2025-07-0085",
    title: "取引先との紛争対応",
    status: "法務確認中",
    ballStatus: "business",
    lastRepliedBy: "legal",
    lastRepliedAt: "2025/07/18 18:35",
    dueDate: "2025/07/31",
    createdAt: "2025/05/23 16:55",
    requester: "吉田 恵",
    department: "営業部",
    mainAssignee: "佐藤 花子",
    subAssignees: ["鈴木 一郎"],
    classification: "訴訟対応",
    hasUnread: true,
  },
];

const ballStatusCounts = {
  all: sampleCases.length,
  legal: sampleCases.filter((c) => c.ballStatus === "legal").length,
  business: sampleCases.filter((c) => c.ballStatus === "business").length,
};

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
  { label: "山田 太郎", value: "yamada" },
  { label: "佐藤 花子", value: "sato" },
  { label: "鈴木 一郎", value: "suzuki" },
  { label: "中村 翔", value: "nakamura" },
  { label: "加藤 誠", value: "kato" },
];

const departmentOptions = [
  { label: "営業部", value: "sales" },
  { label: "開発部", value: "dev" },
  { label: "経理部", value: "accounting" },
  { label: "人事部", value: "hr" },
  { label: "企画部", value: "planning" },
];

const ballStatusFilterOptions = [
  { label: "すべて", value: "all" },
  { label: "法務部ボール", value: "legal" },
  { label: "事業部ボール", value: "business" },
];

function BallStatusTag({ ballStatus }: { ballStatus: BallStatus }) {
  if (ballStatus === "legal") {
    return (
      <Tag variant="fill" color="blue">
        法務部ボール
      </Tag>
    );
  }
  return (
    <Tag variant="fill" color="neutral">
      事業部ボール
    </Tag>
  );
}

function SegmentItem({
  label,
  count,
  isActive,
  onClick,
}: {
  label: string;
  count: number;
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        all: "unset",
        display: "flex",
        flexDirection: "column-reverse",
        justifyContent: "center",
        cursor: "pointer",
        padding: "var(--aegis-space-xSmall)",
        borderRadius: "var(--aegis-radius-medium)",
        backgroundColor: isActive ? "var(--aegis-color-background-neutral-xSubtle)" : undefined,
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
    </button>
  );
}

export function MatterBallStatus() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);
  const [page, setPage] = useState(1);
  const [ballFilter, setBallFilter] = useState<"all" | BallStatus>("all");
  // biome-ignore lint/style/noNonNullAssertion: Drawer component requires non-null RefObject
  const drawerRoot = useRef<HTMLDivElement>(null!);

  const filteredCases = ballFilter === "all" ? sampleCases : sampleCases.filter((c) => c.ballStatus === ballFilter);

  const handleRowClick = (caseItem: CaseItem) => {
    setSelectedCase(caseItem);
    setDetailOpen(true);
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
                <dl
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "var(--aegis-space-small)",
                    margin: 0,
                  }}
                >
                  <SegmentItem
                    label="すべて"
                    count={ballStatusCounts.all}
                    isActive={ballFilter === "all"}
                    onClick={() => setBallFilter("all")}
                  />
                </dl>

                <Divider orientation="vertical" style={{ alignSelf: "stretch" }} />

                <dl
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "var(--aegis-space-small)",
                    margin: 0,
                  }}
                >
                  <SegmentItem
                    label="法務部ボール"
                    count={ballStatusCounts.legal}
                    isActive={ballFilter === "legal"}
                    onClick={() => setBallFilter("legal")}
                  />
                  <SegmentItem
                    label="事業部ボール"
                    count={ballStatusCounts.business}
                    isActive={ballFilter === "business"}
                    onClick={() => setBallFilter("business")}
                  />
                </dl>
              </div>

              <Tab.Group variant="plain">
                <PageLayoutStickyContainer>
                  <Toolbar>
                    <div style={{ overflow: "hidden" }}>
                      <Tab.List>
                        <Tab trailing={<Badge color="danger" count={ballStatusCounts.all} />}>
                          <div style={{ inlineSize: "max-content", maxInlineSize: "240px" }}>
                            <Text whiteSpace="nowrap" numberOfLines={1}>
                              すべて
                            </Text>
                          </div>
                        </Tab>
                        <Tab trailing={<Badge color="danger" count={ballStatusCounts.legal} />}>
                          <div style={{ inlineSize: "max-content", maxInlineSize: "240px" }}>
                            <Text whiteSpace="nowrap" numberOfLines={1}>
                              法務部ボール
                            </Text>
                          </div>
                        </Tab>
                        <Tab trailing={<Badge color="danger" count={ballStatusCounts.business} />}>
                          <div style={{ inlineSize: "max-content", maxInlineSize: "240px" }}>
                            <Text whiteSpace="nowrap" numberOfLines={1}>
                              事業部ボール
                            </Text>
                          </div>
                        </Tab>
                      </Tab.List>
                    </div>
                    <ToolbarSpacer />
                    <Select
                      options={ballStatusFilterOptions}
                      defaultValue="all"
                      onChange={(value) => setBallFilter(value as "all" | BallStatus)}
                    />
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
                    <CaseTable cases={filteredCases} onRowClick={handleRowClick} />
                    <div style={{ marginTop: "var(--aegis-space-medium)" }}>
                      <Pagination
                        page={page}
                        totalCount={filteredCases.length}
                        pageSize={20}
                        onChange={(nextPage) => setPage(nextPage)}
                      />
                    </div>
                  </Tab.Panel>
                  <Tab.Panel>
                    <CaseTable
                      cases={sampleCases.filter((c) => c.ballStatus === "legal")}
                      onRowClick={handleRowClick}
                    />
                  </Tab.Panel>
                  <Tab.Panel>
                    <CaseTable
                      cases={sampleCases.filter((c) => c.ballStatus === "business")}
                      onRowClick={handleRowClick}
                    />
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
                  <FormControl.Label>ボールステータス</FormControl.Label>
                  <FormControl.Toolbar ghost>
                    <Button size="xSmall" variant="gutterless">
                      クリア
                    </Button>
                  </FormControl.Toolbar>
                  <Select placeholder="選択してください" options={ballStatusFilterOptions} />
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
                  <RangeDateField />
                </FormControl>

                <FormControl>
                  <FormControl.Label>作成日時</FormControl.Label>
                  <FormControl.Toolbar ghost>
                    <Button size="xSmall" variant="gutterless">
                      クリア
                    </Button>
                  </FormControl.Toolbar>
                  <RangeDateField />
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
              {selectedCase && (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-large)" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--aegis-space-small)",
                      padding: "var(--aegis-space-medium)",
                      backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
                      borderRadius: "var(--aegis-radius-medium)",
                    }}
                  >
                    <Text variant="body.medium.bold">現在のボール:</Text>
                    <BallStatusTag ballStatus={selectedCase.ballStatus} />
                    <Text variant="body.small" color="subtle" style={{ marginLeft: "auto" }}>
                      最終返信: {selectedCase.lastRepliedBy === "legal" ? "法務部" : "事業部"} (
                      {selectedCase.lastRepliedAt})
                    </Text>
                  </div>

                  <Form>
                    <FormControl>
                      <FormControl.Label>案件ステータス</FormControl.Label>
                      <StatusLabel>{selectedCase.status}</StatusLabel>
                    </FormControl>

                    <FormControl>
                      <FormControl.Label>案件分類</FormControl.Label>
                      <Text variant="body.medium">{selectedCase.classification}</Text>
                    </FormControl>

                    <FormControl>
                      <FormControl.Label>主担当者</FormControl.Label>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "var(--aegis-space-xSmall)",
                        }}
                      >
                        <Avatar size="xSmall" name={selectedCase.mainAssignee} />
                        <Text variant="body.medium">{selectedCase.mainAssignee}</Text>
                      </div>
                    </FormControl>

                    <FormControl>
                      <FormControl.Label>依頼者</FormControl.Label>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "var(--aegis-space-xSmall)",
                        }}
                      >
                        <Avatar size="xSmall" name={selectedCase.requester} />
                        <Text variant="body.medium">{selectedCase.requester}</Text>
                      </div>
                    </FormControl>

                    <FormControl>
                      <FormControl.Label>依頼部署</FormControl.Label>
                      <Text variant="body.medium">{selectedCase.department}</Text>
                    </FormControl>

                    <FormControl>
                      <FormControl.Label>納期</FormControl.Label>
                      <Text variant="body.medium">{selectedCase.dueDate}</Text>
                    </FormControl>

                    <FormControl>
                      <FormControl.Label>作成日時</FormControl.Label>
                      <Text variant="body.medium">{selectedCase.createdAt}</Text>
                    </FormControl>
                  </Form>
                </div>
              )}
            </Drawer.Body>
          </Drawer>
        </PageLayout>
      </SidebarInset>
    </SidebarProvider>
  );
}

function CaseTable({ cases, onRowClick }: { cases: CaseItem[]; onRowClick: (caseItem: CaseItem) => void }) {
  return (
    <TableContainer stickyHeader>
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.BadgeCell />
            <Table.Cell as="th">案件番号</Table.Cell>
            <Table.Cell as="th">案件名</Table.Cell>
            <Table.Cell as="th">ボール</Table.Cell>
            <Table.Cell as="th">案件ステータス</Table.Cell>
            <Table.Cell as="th">主担当者</Table.Cell>
            <Table.Cell as="th">依頼者</Table.Cell>
            <Table.Cell as="th">案件分類</Table.Cell>
            <Table.Cell as="th">
              <Table.SortLabel>納期</Table.SortLabel>
            </Table.Cell>
            <Table.Cell as="th">
              <Table.SortLabel direction="desc">最終返信日時</Table.SortLabel>
            </Table.Cell>
            <Table.Cell as="th">
              <Table.SortLabel>作成日時</Table.SortLabel>
            </Table.Cell>
            <Table.Cell as="th">依頼部署</Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {cases.map((caseItem) => (
            <Table.Row key={caseItem.id} style={{ cursor: "pointer" }} onClick={() => onRowClick(caseItem)}>
              <Table.BadgeCell invisible={!caseItem.hasUnread} />
              <Table.Cell>{caseItem.id}</Table.Cell>
              <Table.Cell maxWidth="medium">
                <Tooltip title={caseItem.title} placement="top-start" onlyOnOverflow>
                  <Text>{caseItem.title}</Text>
                </Tooltip>
              </Table.Cell>
              <Table.Cell>
                <BallStatusTag ballStatus={caseItem.ballStatus} />
              </Table.Cell>
              <Table.Cell>
                <StatusLabel>{caseItem.status}</StatusLabel>
              </Table.Cell>
              <Table.Cell>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--aegis-space-xSmall)",
                  }}
                >
                  <Avatar size="xSmall" name={caseItem.mainAssignee} />
                  <Text variant="component.medium">{caseItem.mainAssignee}</Text>
                </div>
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
                <Text variant="component.medium">{caseItem.classification}</Text>
              </Table.Cell>
              <Table.Cell>
                <Text variant="component.medium">{caseItem.dueDate}</Text>
              </Table.Cell>
              <Table.Cell>
                <Text variant="component.medium">{caseItem.lastRepliedAt}</Text>
              </Table.Cell>
              <Table.Cell>
                <Text variant="component.medium">{caseItem.createdAt}</Text>
              </Table.Cell>
              <Table.Cell>
                <Text variant="component.medium">{caseItem.department}</Text>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </TableContainer>
  );
}
