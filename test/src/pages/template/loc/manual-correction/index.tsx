import { LfFileSearch, LfPen, LfQuestionCircle } from "@legalforce/aegis-icons";
import {
  Button,
  ContentHeader,
  ContentHeaderTitle,
  EmptyState,
  Form,
  FormControl,
  Icon,
  IconButton,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Pagination,
  type PaginationOptions,
  Popover,
  Radio,
  RadioGroup,
  Select,
  StatusLabel,
  Table,
  TableContainer,
  Text,
  TextField,
  Tooltip,
} from "@legalforce/aegis-react";
import { useMemo, useState } from "react";

// =============================================================================
// Types
// =============================================================================

type CorrectionWorkStep = "firstCheck" | "secondCheck";

type CorrectionWorkStatus =
  | "notAssigned"
  | "firstCheck"
  | "firstCheckCompleted"
  | "secondCheck"
  | "secondCheckCompleted";

type ManualCorrectionContract = {
  locfileId: string;
  fileName: string;
  title: string;
  managementStartDatetime: string;
  correctionWorkStep: CorrectionWorkStatus;
  correctionAssigneeNameFirst: string | null;
  correctionAssigneeNameSecond: string | null;
  firstCheckCompletedDatetime: string | null;
};

// =============================================================================
// Mock Data
// =============================================================================

const MOCK_TENANTS = [
  { label: "case-mgmt-display-name_d18c93", value: "tenant-1" },
  { label: "sample-tenant-002", value: "tenant-2" },
  { label: "demo-tenant-003", value: "tenant-3" },
];

const MOCK_LANGUAGES = [
  { label: "すべて", value: "" },
  { label: "日本語", value: "ja" },
  { label: "英語", value: "en" },
  { label: "中国語", value: "zh" },
];

const MOCK_CONTRACTS: ManualCorrectionContract[] = [
  {
    locfileId: "lf-001",
    fileName: "秘密保持契約書_2024年度版.pdf",
    title: "秘密保持契約",
    managementStartDatetime: "2024/07/05 12:49",
    correctionWorkStep: "firstCheck",
    correctionAssigneeNameFirst: "田中 太郎",
    correctionAssigneeNameSecond: null,
    firstCheckCompletedDatetime: null,
  },
  {
    locfileId: "lf-002",
    fileName: "業務委託契約書_株式会社サンプル.pdf",
    title: "業務委託契約",
    managementStartDatetime: "2024/07/06 09:15",
    correctionWorkStep: "notAssigned",
    correctionAssigneeNameFirst: null,
    correctionAssigneeNameSecond: null,
    firstCheckCompletedDatetime: null,
  },
  {
    locfileId: "lf-003",
    fileName: "売買契約書_FY2024Q3.pdf",
    title: "売買契約",
    managementStartDatetime: "2024/07/10 14:30",
    correctionWorkStep: "firstCheckCompleted",
    correctionAssigneeNameFirst: "佐藤 花子",
    correctionAssigneeNameSecond: null,
    firstCheckCompletedDatetime: "2024/07/15 10:00",
  },
  {
    locfileId: "lf-004",
    fileName: "ライセンス契約書_ソフトウェアA.pdf",
    title: "ライセンス契約",
    managementStartDatetime: "2024/07/12 11:00",
    correctionWorkStep: "secondCheck",
    correctionAssigneeNameFirst: "鈴木 一郎",
    correctionAssigneeNameSecond: "山田 二郎",
    firstCheckCompletedDatetime: "2024/07/18 16:45",
  },
  {
    locfileId: "lf-005",
    fileName: "取引基本契約書_株式会社テスト.pdf",
    title: "取引基本契約",
    managementStartDatetime: "2024/07/15 08:30",
    correctionWorkStep: "secondCheckCompleted",
    correctionAssigneeNameFirst: "高橋 健太",
    correctionAssigneeNameSecond: "渡辺 美咲",
    firstCheckCompletedDatetime: "2024/07/20 09:00",
  },
  {
    locfileId: "lf-006",
    fileName: "賃貸借契約書_オフィスビルA棟.pdf",
    title: "賃貸借契約",
    managementStartDatetime: "2024/07/18 13:20",
    correctionWorkStep: "firstCheck",
    correctionAssigneeNameFirst: "伊藤 直樹",
    correctionAssigneeNameSecond: null,
    firstCheckCompletedDatetime: null,
  },
  {
    locfileId: "lf-007",
    fileName: "共同開発契約書_プロジェクトX.pdf",
    title: "共同開発契約",
    managementStartDatetime: "2024/07/20 10:00",
    correctionWorkStep: "notAssigned",
    correctionAssigneeNameFirst: null,
    correctionAssigneeNameSecond: null,
    firstCheckCompletedDatetime: null,
  },
  {
    locfileId: "lf-008",
    fileName: "コンサルティング契約書_2024年度.pdf",
    title: "コンサルティング契約",
    managementStartDatetime: "2024/07/22 15:00",
    correctionWorkStep: "firstCheckCompleted",
    correctionAssigneeNameFirst: "中村 さくら",
    correctionAssigneeNameSecond: null,
    firstCheckCompletedDatetime: "2024/07/28 11:30",
  },
  {
    locfileId: "lf-009",
    fileName: "販売代理店契約書_東日本エリア.pdf",
    title: "販売代理店契約",
    managementStartDatetime: "2024/07/25 09:45",
    correctionWorkStep: "secondCheck",
    correctionAssigneeNameFirst: "小林 大輔",
    correctionAssigneeNameSecond: "加藤 恵",
    firstCheckCompletedDatetime: "2024/07/30 14:00",
  },
  {
    locfileId: "lf-010",
    fileName: "保守契約書_システムメンテナンス.pdf",
    title: "保守契約",
    managementStartDatetime: "2024/07/28 11:15",
    correctionWorkStep: "firstCheck",
    correctionAssigneeNameFirst: "松本 翔",
    correctionAssigneeNameSecond: null,
    firstCheckCompletedDatetime: null,
  },
  {
    locfileId: "lf-011",
    fileName: "業務提携契約書_株式会社パートナー.pdf",
    title: "業務提携契約",
    managementStartDatetime: "2024/08/01 08:00",
    correctionWorkStep: "notAssigned",
    correctionAssigneeNameFirst: null,
    correctionAssigneeNameSecond: null,
    firstCheckCompletedDatetime: null,
  },
  {
    locfileId: "lf-012",
    fileName: "顧問契約書_法律事務所ABC.pdf",
    title: "顧問契約",
    managementStartDatetime: "2024/08/03 16:30",
    correctionWorkStep: "secondCheckCompleted",
    correctionAssigneeNameFirst: "田中 太郎",
    correctionAssigneeNameSecond: "佐藤 花子",
    firstCheckCompletedDatetime: "2024/08/08 10:00",
  },
];

const PAGE_SIZE = 10;

// =============================================================================
// Helper: 補正ステップラベル
// =============================================================================

const correctionWorkStepLabel = (step: CorrectionWorkStatus): string => {
  switch (step) {
    case "notAssigned":
      return "未アサイン";
    case "firstCheck":
      return "1stチェック";
    case "firstCheckCompleted":
      return "1stチェック完了";
    case "secondCheck":
      return "2ndチェック";
    case "secondCheckCompleted":
      return "2ndチェック完了";
  }
};

const correctionWorkStepColor = (step: CorrectionWorkStatus): "yellow" | "blue" | "teal" | "neutral" => {
  switch (step) {
    case "notAssigned":
      return "neutral";
    case "firstCheck":
      return "yellow";
    case "firstCheckCompleted":
      return "teal";
    case "secondCheck":
      return "blue";
    case "secondCheckCompleted":
      return "teal";
  }
};

// =============================================================================
// Helper: フィルタリング
// =============================================================================

const isFirstCheckStep = (step: CorrectionWorkStatus): boolean => step === "notAssigned" || step === "firstCheck";

const isSecondCheckStep = (step: CorrectionWorkStatus): boolean =>
  step === "firstCheckCompleted" || step === "secondCheck" || step === "secondCheckCompleted";

// =============================================================================
// Search Form Section
// =============================================================================

type SearchFormProps = {
  selectedTenant: string;
  onChangeTenant: (value: string) => void;
  selectedLanguage: string;
  onChangeLanguage: (value: string) => void;
  titleSearch: string;
  onChangeTitleSearch: (value: string) => void;
  correctionWorkStep: CorrectionWorkStep;
  onChangeCorrectionWorkStep: (value: CorrectionWorkStep) => void;
};

const SearchFormSection = ({
  selectedTenant,
  onChangeTenant,
  selectedLanguage,
  onChangeLanguage,
  titleSearch,
  onChangeTitleSearch,
  correctionWorkStep,
  onChangeCorrectionWorkStep,
}: SearchFormProps) => (
  <div
    style={{
      padding: "var(--aegis-space-large) var(--aegis-space-medium) var(--aegis-space-medium)",
      backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
    }}
  >
    <div style={{ display: "flex", paddingInlineStart: "var(--aegis-space-small)" }}>
      <Icon size="xLarge">
        <LfFileSearch />
      </Icon>
      <Text variant="title.large">検索フィルター</Text>
    </div>

    <Form onSubmit={(e) => e.preventDefault()}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--aegis-space-medium)",
          padding: "var(--aegis-space-medium)",
        }}
      >
        {/* Row 1: テナント + 言語 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--aegis-space-medium)" }}>
          <div style={{ flex: 3, display: "flex", flexDirection: "column" }}>
            <FormControl required>
              <FormControl.Label>テナント</FormControl.Label>
              <Select options={MOCK_TENANTS} value={selectedTenant} onChange={onChangeTenant} />
            </FormControl>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <FormControl>
              <FormControl.Label>言語</FormControl.Label>
              <Select options={MOCK_LANGUAGES} value={selectedLanguage} onChange={onChangeLanguage} />
            </FormControl>
          </div>
        </div>

        {/* Row 2: ファイル名 + タイトル + ステータス */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--aegis-space-medium)" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <FormControl>
              <FormControl.Label>ファイル名</FormControl.Label>
              <TextField disabled placeholder="現在利用できません" />
            </FormControl>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <FormControl>
              <FormControl.Label>タイトル</FormControl.Label>
              <TextField value={titleSearch} onChange={(e) => onChangeTitleSearch(e.target.value)} />
            </FormControl>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <RadioGroup
              orientation="horizontal"
              title="ステータス"
              value={correctionWorkStep}
              onChange={(value) => onChangeCorrectionWorkStep(value as CorrectionWorkStep)}
            >
              <Radio value="firstCheck">1stチェック</Radio>
              <Radio value="secondCheck">2ndチェック</Radio>
            </RadioGroup>
          </div>
        </div>
      </div>
    </Form>
  </div>
);

// =============================================================================
// Table Header Cell with Popover
// =============================================================================

const TableCellPopover = ({ label, description }: { label: string; description: string }) => (
  <Table.Cell>
    <div style={{ display: "flex", alignItems: "center" }}>
      <Text>{label}</Text>
      <Popover trigger="hover" placement="top">
        <Popover.Anchor>
          <IconButton icon={LfQuestionCircle} aria-label={description} variant="plain" size="xSmall" />
        </Popover.Anchor>
        <Popover.Content>
          <Popover.Body>
            <Text whiteSpace="pre-wrap" variant="body.small">
              {description}
            </Text>
          </Popover.Body>
        </Popover.Content>
      </Popover>
    </div>
  </Table.Cell>
);

// =============================================================================
// Contract Row
// =============================================================================

type ContractRowProps = {
  contract: ManualCorrectionContract;
  isFirstCheck: boolean;
  userRole: "leader" | "operator";
};

const ContractRow = ({ contract, isFirstCheck, userRole }: ContractRowProps) => (
  <Table.Row>
    <Table.Cell maxWidth="small">
      <Tooltip title={contract.fileName} placement="top-start" onlyOnOverflow>
        <Text numberOfLines={1}>
          <a href="/template/loc/manual-correction/detail" style={{ color: "inherit", textDecoration: "underline" }}>
            {contract.fileName}
          </a>
        </Text>
      </Tooltip>
    </Table.Cell>
    <Table.Cell maxWidth="small">
      {contract.title ? (
        <Tooltip title={contract.title} placement="top-start" onlyOnOverflow>
          <Text numberOfLines={1}>{contract.title}</Text>
        </Tooltip>
      ) : null}
    </Table.Cell>
    <Table.Cell maxWidth="small">
      <Text>{contract.managementStartDatetime}</Text>
    </Table.Cell>
    <Table.Cell maxWidth="small">
      <StatusLabel color={correctionWorkStepColor(contract.correctionWorkStep)} variant="fill">
        {correctionWorkStepLabel(contract.correctionWorkStep)}
      </StatusLabel>
    </Table.Cell>
    <Table.Cell maxWidth="small">
      {contract.correctionAssigneeNameFirst ? (
        <Text>{contract.correctionAssigneeNameFirst}</Text>
      ) : (
        <Button
          size="small"
          variant="subtle"
          leading={
            <Icon>
              <LfPen />
            </Icon>
          }
        >
          アサイン
        </Button>
      )}
    </Table.Cell>
    {!isFirstCheck ? (
      <Table.Cell maxWidth="small">
        <Text>{contract.firstCheckCompletedDatetime ?? ""}</Text>
      </Table.Cell>
    ) : null}
    <Table.Cell maxWidth="small">
      {contract.correctionAssigneeNameSecond ? (
        <Text>{contract.correctionAssigneeNameSecond}</Text>
      ) : isSecondCheckStep(contract.correctionWorkStep) ? (
        <Button
          size="small"
          variant="subtle"
          leading={
            <Icon>
              <LfPen />
            </Icon>
          }
        >
          アサイン
        </Button>
      ) : (
        <Text>-</Text>
      )}
    </Table.Cell>
    {userRole === "leader" ? (
      <Table.Cell maxWidth="small">
        <Button
          size="small"
          variant="subtle"
          onClick={() => (window.location.href = "/template/loc/manual-correction/detail")}
        >
          閲覧
        </Button>
      </Table.Cell>
    ) : null}
  </Table.Row>
);

// =============================================================================
// Main Component
// =============================================================================

const ManualCorrectionListTemplate = () => {
  const [selectedTenant, setSelectedTenant] = useState("tenant-1");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [titleSearch, setTitleSearch] = useState("");
  const [correctionWorkStep, setCorrectionWorkStep] = useState<CorrectionWorkStep>("firstCheck");
  const [userRole] = useState<"leader" | "operator">("leader");
  const [page, setPage] = useState(1);

  const isFirstCheck = correctionWorkStep === "firstCheck";

  const filteredContracts = useMemo(() => {
    return MOCK_CONTRACTS.filter((contract) => {
      // ステータスフィルター
      if (isFirstCheck && !isFirstCheckStep(contract.correctionWorkStep)) return false;
      if (!isFirstCheck && !isSecondCheckStep(contract.correctionWorkStep)) return false;
      // タイトル検索
      if (titleSearch && !contract.title.includes(titleSearch)) return false;
      return true;
    });
  }, [isFirstCheck, titleSearch]);

  const pagedContracts = useMemo(
    () => filteredContracts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredContracts, page],
  );

  const handlePagination: Exclude<PaginationOptions["onChange"], undefined> = (value, action) => {
    if (action === "go-to-first") {
      setPage(1);
      return;
    }
    setPage(value);
  };

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>契約書一覧</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          {/* 検索フォーム */}
          <SearchFormSection
            selectedTenant={selectedTenant}
            onChangeTenant={(value) => {
              setSelectedTenant(value);
              setPage(1);
            }}
            selectedLanguage={selectedLanguage}
            onChangeLanguage={(value) => {
              setSelectedLanguage(value);
              setPage(1);
            }}
            titleSearch={titleSearch}
            onChangeTitleSearch={(value) => {
              setTitleSearch(value);
              setPage(1);
            }}
            correctionWorkStep={correctionWorkStep}
            onChangeCorrectionWorkStep={(value) => {
              setCorrectionWorkStep(value);
              setPage(1);
            }}
          />

          {/* 契約書リスト */}
          {pagedContracts.length === 0 ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "var(--aegis-space-xLarge)" }}>
              <EmptyState>条件に一致する契約書がありません</EmptyState>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "var(--aegis-space-medium)" }}>
              <TableContainer stickyHeader>
                <Table>
                  <Table.Head>
                    <Table.Row>
                      <Table.Cell>ファイル名</Table.Cell>
                      <Table.Cell>タイトル</Table.Cell>
                      <TableCellPopover
                        label="管理開始日時"
                        description="契約書が締結版として確定し、手動補正の対象になった日時"
                      />
                      <Table.Cell>ステータス</Table.Cell>
                      <Table.Cell>1st担当者</Table.Cell>
                      {!isFirstCheck ? <Table.Cell>1stチェック完了日</Table.Cell> : null}
                      <Table.Cell>2nd担当者</Table.Cell>
                      {userRole === "leader" ? <Table.Cell /> : null}
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {pagedContracts.map((contract) => (
                      <ContractRow
                        key={contract.locfileId}
                        contract={contract}
                        isFirstCheck={isFirstCheck}
                        userRole={userRole}
                      />
                    ))}
                  </Table.Body>
                </Table>
              </TableContainer>
              <Pagination
                page={page}
                pageSize={PAGE_SIZE}
                totalCount={filteredContracts.length}
                onChange={handlePagination}
              />
            </div>
          )}
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};

export default ManualCorrectionListTemplate;
