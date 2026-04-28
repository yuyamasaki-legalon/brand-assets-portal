import {
  LfBan,
  LfCheckCircleFill,
  LfClock,
  LfFilter,
  LfPlusLarge,
  LfWarningCircle,
  LfWarningRhombus,
  LfWarningTriangle,
} from "@legalforce/aegis-icons";
import { Box, MagnifyingGlass } from "@legalforce/aegis-illustrations/react";
import {
  Avatar,
  Badge,
  Button,
  ButtonGroup,
  Checkbox,
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderTitle,
  DatePicker,
  Divider,
  Drawer,
  EmptyState,
  FormControl,
  Icon,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutStickyContainer,
  Pagination,
  type PaginationOptions,
  Radio,
  RadioGroup,
  Search as SearchField,
  SegmentedControl,
  StatusLabel,
  Tab,
  Table,
  TableContainer,
  Tag,
  Text,
  TextField,
  Toolbar,
  Tooltip,
  VisuallyHidden,
} from "@legalforce/aegis-react";
import { type ChangeEvent, useMemo, useRef, useState } from "react";
import { LocSidebarLayout } from "../_shared";
import styles from "./envelope-list.module.css";

type EnvelopeStatus =
  | "inProgress"
  | "withdrawn"
  | "declined"
  | "expired"
  | "concluded"
  | "unimported"
  | "reimporting"
  | "initialImporting";

type SignerStatus = "waiting" | "signed" | "declined" | "expired" | "failedToSend" | "unsignable";

type EnvelopeTab = "inProgress" | "all" | "completed" | "withdrawn" | "declined" | "expired" | "archived";

type EnvelopeRow = {
  id: string;
  title: string;
  sentAt: Date;
  status: EnvelopeStatus;
  isArchived?: boolean;
  signers: { name: string; status: SignerStatus }[];
  creator: { name: string; avatar?: string; isMe?: boolean };
};

type FilterState = {
  sentFrom: Date | null;
  sentTo: Date | null;
  statuses: EnvelopeStatus[];
  signerStatus: SignerStatus | null;
  signerName: string;
  creator: "all" | "me";
};

const completedStatuses: EnvelopeStatus[] = ["concluded", "unimported", "reimporting", "initialImporting"];

const envelopeRows: EnvelopeRow[] = [
  {
    id: "env-001",
    title: "業務委託契約書（再送）",
    sentAt: new Date("2024-12-18T09:30:00"),
    status: "inProgress",
    signers: [
      { name: "山田 太郎", status: "waiting" },
      { name: "John Smith", status: "signed" },
      { name: "佐藤 花子", status: "waiting" },
    ],
    creator: { name: "田中 さくら", isMe: true },
  },
  {
    id: "env-002",
    title: "NDA_取引先A_最新版",
    sentAt: new Date("2024-11-02T14:15:00"),
    status: "concluded",
    signers: [
      { name: "青木 梨乃", status: "signed" },
      { name: "Michael Chen", status: "signed" },
    ],
    creator: { name: "山本 蓮" },
  },
  {
    id: "env-003",
    title: "業務委託契約（動画編集）",
    sentAt: new Date("2024-10-11T16:00:00"),
    status: "declined",
    signers: [
      { name: "伊藤 海斗", status: "declined" },
      { name: "鈴木 沙耶", status: "waiting" },
    ],
    creator: { name: "小林 奈緒" },
  },
  {
    id: "env-004",
    title: "発注書_5月分",
    sentAt: new Date("2024-09-02T10:00:00"),
    status: "expired",
    signers: [
      { name: "吉田 光", status: "expired" },
      { name: "Caroline Lee", status: "waiting" },
    ],
    creator: { name: "田中 さくら", isMe: true },
    isArchived: true,
  },
  {
    id: "env-005",
    title: "覚書_デザインガイドライン",
    sentAt: new Date("2024-08-23T11:45:00"),
    status: "withdrawn",
    signers: [
      { name: "佐々木 美月", status: "failedToSend" },
      { name: "松本 瑛斗", status: "unsignable" },
    ],
    creator: { name: "山本 蓮" },
  },
  {
    id: "env-006",
    title: "取引基本契約_アップデート",
    sentAt: new Date("2024-07-14T09:20:00"),
    status: "reimporting",
    signers: [
      { name: "小野 浩介", status: "signed" },
      { name: "中村 彩音", status: "waiting" },
      { name: "Bruno Costa", status: "waiting" },
    ],
    creator: { name: "加藤 琴葉" },
  },
];

const envelopeStatusLabels: Record<EnvelopeStatus, string> = {
  inProgress: "署名待ち",
  withdrawn: "取り下げ",
  declined: "署名辞退",
  expired: "期限超過",
  concluded: "締結済み",
  unimported: "締結済み：ファイル未取り込み",
  reimporting: "締結済み：ファイル未取り込み",
  initialImporting: "締結済み",
};

const signerStatusLabels: Record<SignerStatus, string> = {
  waiting: "未署名",
  signed: "署名済み",
  declined: "署名辞退",
  expired: "期限超過",
  failedToSend: "送信失敗",
  unsignable: "署名不可",
};

const envelopeTabs: { value: EnvelopeTab; label: string }[] = [
  { value: "inProgress", label: "署名待ち" },
  { value: "all", label: "すべて" },
  { value: "completed", label: "締結済み" },
  { value: "withdrawn", label: "取り下げ" },
  { value: "declined", label: "署名辞退" },
  { value: "expired", label: "期限超過" },
  { value: "archived", label: "アーカイブ" },
];

const defaultFilters: FilterState = {
  sentFrom: null,
  sentTo: null,
  statuses: [],
  signerStatus: null,
  signerName: "",
  creator: "all",
};

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

const formatDate = (value: Date): string => dateFormatter.format(value);

const progressColorMap: Record<EnvelopeStatus, "default" | "accent.teal"> = {
  inProgress: "default",
  withdrawn: "default",
  declined: "default",
  expired: "default",
  concluded: "accent.teal",
  unimported: "default",
  reimporting: "default",
  initialImporting: "accent.teal",
};

const statusColorMap: Record<EnvelopeStatus, "neutral" | "red" | "teal" | "yellow"> = {
  inProgress: "neutral",
  withdrawn: "red",
  declined: "red",
  expired: "red",
  concluded: "teal",
  unimported: "yellow",
  reimporting: "yellow",
  initialImporting: "teal",
};

const signerTagStyle: Record<SignerStatus, { color: "teal" | "red" | "transparent"; icon?: typeof LfCheckCircleFill }> =
  {
    waiting: { color: "transparent" },
    signed: { color: "teal", icon: LfCheckCircleFill },
    declined: { color: "red", icon: LfBan },
    expired: { color: "red", icon: LfClock },
    failedToSend: { color: "red", icon: LfWarningCircle },
    unsignable: { color: "transparent", icon: LfBan },
  };

const EnvelopeListTemplate = () => {
  const [outerTabIndex, setOuterTabIndex] = useState(1);
  const [statusTabIndex, setStatusTabIndex] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterAnchorRef = useRef<HTMLElement | null>(null);

  const selectedTab = envelopeTabs[statusTabIndex]?.value ?? "inProgress";
  const isFiltering =
    filters.sentFrom !== null ||
    filters.sentTo !== null ||
    filters.statuses.length > 0 ||
    filters.signerStatus !== null ||
    filters.signerName.trim() !== "" ||
    filters.creator !== "all";

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return envelopeRows
      .filter((row) => {
        if (selectedTab === "archived") return row.isArchived === true;
        if (selectedTab === "all") return row.isArchived !== true;
        if (selectedTab === "completed") return completedStatuses.includes(row.status) && row.isArchived !== true;
        return row.status === selectedTab && row.isArchived !== true;
      })
      .filter((row) => {
        if (filters.statuses.length > 0 && !filters.statuses.includes(row.status)) return false;
        if (filters.signerStatus && !row.signers.some((signer) => signer.status === filters.signerStatus)) return false;
        if (filters.signerName.trim()) {
          const keyword = filters.signerName.trim().toLowerCase();
          const hasMatch = row.signers.some((signer) => signer.name.toLowerCase().includes(keyword));
          if (!hasMatch) return false;
        }
        if (filters.creator === "me" && !row.creator.isMe) return false;
        if (filters.sentFrom && row.sentAt < filters.sentFrom) return false;
        if (filters.sentTo && row.sentAt > filters.sentTo) return false;
        return true;
      })
      .filter((row) => {
        if (!normalizedSearch) return true;
        return (
          row.title.toLowerCase().includes(normalizedSearch) ||
          row.creator.name.toLowerCase().includes(normalizedSearch) ||
          row.signers.some((signer) => signer.name.toLowerCase().includes(normalizedSearch))
        );
      });
  }, [filters, searchValue, selectedTab]);

  const pageSize = 5;
  const pagedRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

  const updateFilters = (updater: FilterState | ((prev: FilterState) => FilterState)) => {
    setFilters((prev) =>
      typeof updater === "function" ? (updater as (state: FilterState) => FilterState)(prev) : updater,
    );
    setPage(1);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    setPage(1);
  };

  const handleToggleStatusFilter = (status: EnvelopeStatus, checked: boolean) => {
    updateFilters((prev) => {
      const nextStatuses = checked ? [...prev.statuses, status] : prev.statuses.filter((item) => item !== status);
      return { ...prev, statuses: nextStatuses };
    });
  };

  const handlePagination: Exclude<PaginationOptions["onChange"], undefined> = (value, action) => {
    if (action === "go-to-first") {
      setPage(1);
      return;
    }
    setPage(value);
  };

  const handleChangeStatusTab = (index: number) => {
    setStatusTabIndex(index);
    setPage(1);
  };

  const resetFilters = () => updateFilters(defaultFilters);

  return (
    <LocSidebarLayout activeId="esign">
      <PageLayout>
        <PageLayoutContent>
          <PageLayoutHeader>
            <ContentHeader>
              <ContentHeaderTitle as="h1">電子契約一覧</ContentHeaderTitle>
              <ContentHeaderDescription>
                サイン画面（署名依頼タブ）をテンプレートとして再現しています。
              </ContentHeaderDescription>
            </ContentHeader>
          </PageLayoutHeader>
          <PageLayoutBody>
            <Tab.Group variant="plain" index={outerTabIndex} onChange={setOuterTabIndex}>
              <PageLayoutStickyContainer>
                <Toolbar>
                  <Tab.List>
                    <Tab trailing={<Badge color="danger" />} aria-label="要対応">
                      要対応
                    </Tab>
                    <Tab aria-label="署名依頼送信">署名依頼送信</Tab>
                    <Tab aria-label="承認申請">承認申請</Tab>
                  </Tab.List>
                  <Toolbar.Spacer />
                  <div className={styles.toolbarRight}>
                    <EnvelopeUsageSummary sentCount={38} planLimit={50} />
                    <ButtonGroup>
                      <Button variant="solid" size="medium" leading={<Icon source={LfPlusLarge} />}>
                        署名依頼を作成
                      </Button>
                    </ButtonGroup>
                  </div>
                </Toolbar>
              </PageLayoutStickyContainer>
              <Tab.Panels>
                <Tab.Panel>
                  <EmptyState title="要対応なし" visual={<Box />}>
                    <Text>署名依頼タブでUI全体を確認できます。</Text>
                  </EmptyState>
                </Tab.Panel>
                <Tab.Panel>
                  <div className={styles.stack}>
                    <Toolbar>
                      <SegmentedControl index={statusTabIndex} onChange={handleChangeStatusTab}>
                        {envelopeTabs.map((tab) => (
                          <SegmentedControl.Button key={tab.value}>{tab.label}</SegmentedControl.Button>
                        ))}
                      </SegmentedControl>
                      <Toolbar.Spacer />
                      <ButtonGroup>
                        <Button
                          variant={filterOpen ? "subtle" : "plain"}
                          leading={
                            isFiltering ? (
                              <Badge color="information">
                                <Icon source={LfFilter} />
                              </Badge>
                            ) : (
                              <Icon source={LfFilter} />
                            )
                          }
                          onClick={() => setFilterOpen((prev) => !prev)}
                        >
                          フィルター
                        </Button>
                        <SearchField
                          shrinkOnBlur
                          value={searchValue}
                          onChange={handleSearchChange}
                          placeholder="タイトル・署名者・作成者を検索"
                        />
                      </ButtonGroup>
                      <VisuallyHidden ref={filterAnchorRef} className={styles.filterButtonAnchor} />
                    </Toolbar>

                    {isFiltering ? (
                      <div className={styles.toolbarRow}>
                        {filters.statuses.length > 0 ? (
                          <Tag>
                            ステータス: {filters.statuses.map((status) => envelopeStatusLabels[status]).join(" / ")}
                          </Tag>
                        ) : null}
                        {filters.signerStatus ? <Tag>署名者: {signerStatusLabels[filters.signerStatus]}</Tag> : null}
                        {filters.signerName.trim() ? <Tag>名前: {filters.signerName}</Tag> : null}
                        {filters.creator === "me" ? <Tag>作成者: 自分が作成</Tag> : null}
                        {filters.sentFrom || filters.sentTo ? (
                          <Tag>
                            送信日時{" "}
                            {[filters.sentFrom, filters.sentTo]
                              .map((value, index) =>
                                value ? `${index === 0 ? "From" : "To"} ${formatDate(value)}` : "",
                              )
                              .filter(Boolean)
                              .join(" / ")}
                          </Tag>
                        ) : null}
                        <Button size="small" variant="plain" onClick={resetFilters}>
                          リセット
                        </Button>
                      </div>
                    ) : null}

                    <div className={styles.tableContainer}>
                      <TableContainer stickyHeader>
                        {pagedRows.length > 0 ? (
                          <Table>
                            <Table.Head>
                              <Table.Row>
                                <Table.Cell width="small">署名依頼タイトル</Table.Cell>
                                <Table.Cell>送信日時</Table.Cell>
                                <Table.Cell>ステータス</Table.Cell>
                                <Table.Cell>署名進捗</Table.Cell>
                                <Table.Cell>署名者</Table.Cell>
                                <Table.Cell>署名依頼作成者</Table.Cell>
                                <Table.ActionCell />
                              </Table.Row>
                            </Table.Head>
                            <Table.Body>
                              {pagedRows.map((row) => {
                                const signedCount = row.signers.filter((signer) => signer.status === "signed").length;
                                const progress =
                                  row.signers.length > 0 ? `${signedCount} / ${row.signers.length}` : "-";

                                return (
                                  <Table.Row key={row.id}>
                                    <Table.Cell width="small">
                                      <Tooltip onlyOnOverflow title={row.title}>
                                        <Text>{row.title}</Text>
                                      </Tooltip>
                                    </Table.Cell>
                                    <Table.Cell>{formatDate(row.sentAt)}</Table.Cell>
                                    <Table.Cell>
                                      <StatusLabel
                                        color={statusColorMap[row.status]}
                                        variant={row.status === "inProgress" ? "outline" : "fill"}
                                      >
                                        {envelopeStatusLabels[row.status]}
                                      </StatusLabel>
                                    </Table.Cell>
                                    <Table.Cell>
                                      <Text color={progressColorMap[row.status]}>{progress}</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                      <div className={styles.signers}>
                                        {row.signers.map((signer) => {
                                          const style = signerTagStyle[signer.status];
                                          return (
                                            <Tooltip
                                              key={signer.name + signer.status}
                                              title={signerStatusLabels[signer.status]}
                                            >
                                              <Tag leading={style.icon} color={style.color} variant="fill">
                                                {signer.name}
                                              </Tag>
                                            </Tooltip>
                                          );
                                        })}
                                      </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                      <div className={styles.creator}>
                                        <Avatar name={row.creator.name} size="xSmall" src={row.creator.avatar} />
                                        <Tooltip onlyOnOverflow title={row.creator.name}>
                                          <Text numberOfLines={1}>{row.creator.name}</Text>
                                        </Tooltip>
                                      </div>
                                    </Table.Cell>
                                    <Table.ActionCell>
                                      <ButtonGroup>
                                        <Button size="small" variant="plain">
                                          詳細を見る
                                        </Button>
                                        <Button size="small" variant="subtle">
                                          操作
                                        </Button>
                                      </ButtonGroup>
                                    </Table.ActionCell>
                                  </Table.Row>
                                );
                              })}
                            </Table.Body>
                          </Table>
                        ) : (
                          <EmptyState
                            title={
                              searchValue || isFiltering ? "条件に一致する署名依頼がありません" : "署名依頼がありません"
                            }
                            visual={searchValue || isFiltering ? <MagnifyingGlass /> : <Box />}
                          >
                            <Text>
                              {searchValue || isFiltering
                                ? "検索条件やフィルターを調整して、もう一度お試しください。"
                                : "署名依頼の一覧が表示されます。"}
                            </Text>
                          </EmptyState>
                        )}
                      </TableContainer>
                      <Pagination
                        page={page}
                        pageSize={pageSize}
                        totalCount={filteredRows.length}
                        onChange={handlePagination}
                      />
                    </div>
                  </div>
                </Tab.Panel>
                <Tab.Panel>
                  <EmptyState title="承認申請はダミー表示です" visual={<Box />}>
                    <Text>承認申請タブのUIは任意で差し替えてください。</Text>
                  </EmptyState>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </PageLayoutBody>
        </PageLayoutContent>

        <Drawer
          onOpenChange={() => setFilterOpen((prev) => !prev)}
          open={filterOpen}
          position="end"
          root={filterAnchorRef as React.RefObject<HTMLElement>}
        >
          <Drawer.Header>
            <ContentHeader>
              <ContentHeaderTitle>フィルター</ContentHeaderTitle>
            </ContentHeader>
          </Drawer.Header>
          <Drawer.Body>
            <div className={styles.drawerContent}>
              <div className={styles.inlineFilters}>
                <FormControl>
                  <FormControl.Label>送信日時（From）</FormControl.Label>
                  <DatePicker
                    granularity="minute"
                    value={filters.sentFrom}
                    onChange={(value) => updateFilters((prev) => ({ ...prev, sentFrom: value ?? null }))}
                    maxValue={filters.sentTo ?? undefined}
                  />
                </FormControl>
                <FormControl>
                  <FormControl.Label>送信日時（To）</FormControl.Label>
                  <DatePicker
                    granularity="minute"
                    value={filters.sentTo}
                    onChange={(value) => updateFilters((prev) => ({ ...prev, sentTo: value ?? null }))}
                    minValue={filters.sentFrom ?? undefined}
                  />
                </FormControl>
              </div>

              <FormControl>
                <FormControl.Label>署名依頼ステータス</FormControl.Label>
                <div style={{ display: "grid", gap: "var(--aegis-space-xSmall)" }}>
                  {Object.keys(envelopeStatusLabels).map((status) => (
                    <Checkbox
                      key={status}
                      checked={filters.statuses.includes(status as EnvelopeStatus)}
                      onChange={(event) => handleToggleStatusFilter(status as EnvelopeStatus, event.target.checked)}
                    >
                      {envelopeStatusLabels[status as EnvelopeStatus]}
                    </Checkbox>
                  ))}
                </div>
              </FormControl>

              <FormControl>
                <FormControl.Label>署名者</FormControl.Label>
                <TextField
                  value={filters.signerName}
                  onChange={(event) => updateFilters((prev) => ({ ...prev, signerName: event.target.value }))}
                  placeholder="署名者の氏名を入力"
                />
              </FormControl>

              <FormControl>
                <FormControl.Label>署名者ステータス</FormControl.Label>
                <RadioGroup
                  value={filters.signerStatus ?? "all"}
                  onChange={(value) =>
                    updateFilters((prev) => ({
                      ...prev,
                      signerStatus: value === "all" ? null : (value as SignerStatus),
                    }))
                  }
                >
                  <Radio value="all">すべて</Radio>
                  {Object.entries(signerStatusLabels).map(([value, label]) => (
                    <Radio key={value} value={value}>
                      {label}
                    </Radio>
                  ))}
                </RadioGroup>
              </FormControl>

              <FormControl>
                <FormControl.Label>作成者</FormControl.Label>
                <RadioGroup
                  value={filters.creator}
                  onChange={(value) => updateFilters((prev) => ({ ...prev, creator: value as FilterState["creator"] }))}
                >
                  <Radio value="all">すべて</Radio>
                  <Radio value="me">自分が作成</Radio>
                </RadioGroup>
              </FormControl>
            </div>
          </Drawer.Body>
          <div className={styles.filterFooter}>
            <Drawer.Footer>
              <ButtonGroup>
                <Button variant="plain" onClick={resetFilters}>
                  リセット
                </Button>
                <Button onClick={() => setFilterOpen(false)}>閉じる</Button>
              </ButtonGroup>
            </Drawer.Footer>
          </div>
        </Drawer>
      </PageLayout>
    </LocSidebarLayout>
  );
};

export default EnvelopeListTemplate;

const EnvelopeUsageSummary = ({ sentCount, planLimit }: { sentCount: number; planLimit: number }) => {
  const usageRatio = sentCount / planLimit;
  const status: "normal" | "warning" | "limit" =
    sentCount >= planLimit ? "limit" : usageRatio >= 0.8 ? "warning" : "normal";

  return (
    <div className={styles.usage}>
      <div className={styles.usageContent}>
        <Text as="p" variant="body.small" color="subtle">
          送信済み
        </Text>
        <div className={styles.counter}>
          {status === "limit" ? <Icon source={LfWarningTriangle} color="danger" /> : null}
          {status === "warning" ? <Icon source={LfWarningRhombus} color="warning" /> : null}
          <Text
            as="p"
            variant="body.medium.bold"
            color={status === "limit" ? "danger" : status === "warning" ? "warning" : "default"}
          >
            {sentCount}
          </Text>
        </div>
      </div>
      <Divider orientation="vertical" />
      <div className={styles.usageContent}>
        <Text as="p" variant="body.small" color="subtle">
          購入枠
        </Text>
        <Text as="p" variant="body.medium.bold">
          {planLimit}
        </Text>
      </div>
    </div>
  );
};
