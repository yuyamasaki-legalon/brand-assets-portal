// =============================================================================
// Types
// =============================================================================

/** "すべて"タブ: 契約書ステータス（テナントカスタマイズ可） */
export type ContractDocumentStatus = "none" | "ownPartyDraft" | "counterPartyDraft" | "approved" | "agreedContract";

/** "締結版"タブ: 契約状況（ライフサイクル） */
export type AgreedContractStatus = "inTerm" | "scheduledToEnd" | "finished";

/** 手動補正ステータス */
export type ManualCorrectionStatus = "beforeStart" | "inProgress" | "completed" | "completedWithComment" | "notSubject";

export type ContractDocument = {
  id: string;
  title: string;
  counterPartyNames: string[];
  contractAssignee: string;
  inhouseId: string;
  // --- "すべて"タブ用フィールド ---
  version: number;
  contractDocumentStatus: ContractDocumentStatus;
  createBy: string;
  voucherId: string;
  spaceName: string;
  fileName: string;
  createTime: string;
  contractCategory: string;
  ownPartyNames: string[];
  language: string;
  // --- "締結版"タブ用フィールド（null = 非締結版） ---
  agreedContractStatus: AgreedContractStatus | null;
  signingDate: string | null;
  effectiveDate: string | null;
  expirationDate: string | null;
  isAutoRenewable: boolean;
  nextRefusalDate: string | null;
  transactionAmount: string | null;
  manualCorrectionStatus: ManualCorrectionStatus | null;
};

// =============================================================================
// Mock Data
// =============================================================================

export const mockAllContracts: ContractDocument[] = [
  {
    id: "1",
    title: "秘密保持契約",
    counterPartyNames: ["株式会社LegalOn Technologies"],
    contractAssignee: "山田太郎",
    inhouseId: "CTR-2024-001",
    version: 3,
    contractDocumentStatus: "none",
    createBy: "田中花子",
    voucherId: "V-20240601-001",
    spaceName: "法務部",
    fileName: "秘密保持契約_LegalOn.pdf",
    createTime: "2024/06/01 10:30",
    contractCategory: "秘密保持契約・受領側",
    ownPartyNames: ["株式会社LegalOn Technologies"],
    language: "日本語",
    agreedContractStatus: "inTerm",
    signingDate: "2024/06/01",
    effectiveDate: "2024/06/01",
    expirationDate: "2025/05/31",
    isAutoRenewable: true,
    nextRefusalDate: "2025/03/31",
    transactionAmount: null,
    manualCorrectionStatus: "completed",
  },
  {
    id: "2",
    title: "業務委託契約書",
    counterPartyNames: ["株式会社サンプル商事"],
    contractAssignee: "佐藤次郎",
    inhouseId: "CTR-2024-002",
    version: 1,
    contractDocumentStatus: "ownPartyDraft",
    createBy: "鈴木一郎",
    voucherId: "V-20240715-002",
    spaceName: "営業部",
    fileName: "業務委託契約書_サンプル商事.docx",
    createTime: "2024/07/15 14:20",
    contractCategory: "業務委託契約",
    ownPartyNames: ["株式会社LegalOn Technologies"],
    language: "日本語",
    agreedContractStatus: null,
    signingDate: null,
    effectiveDate: null,
    expirationDate: null,
    isAutoRenewable: false,
    nextRefusalDate: null,
    transactionAmount: null,
    manualCorrectionStatus: null,
  },
  {
    id: "3",
    title: "ソフトウェア使用許諾契約",
    counterPartyNames: ["テクノロジー株式会社", "株式会社デジタルソリューション"],
    contractAssignee: "高橋美咲",
    inhouseId: "CTR-2024-003",
    version: 2,
    contractDocumentStatus: "none",
    createBy: "伊藤健太",
    voucherId: "V-20240501-003",
    spaceName: "情報システム部",
    fileName: "ソフトウェア使用許諾契約.pdf",
    createTime: "2024/05/01 09:00",
    contractCategory: "ソフトウェアライセンス契約",
    ownPartyNames: ["株式会社LegalOn Technologies"],
    language: "日本語",
    agreedContractStatus: "inTerm",
    signingDate: "2024/05/15",
    effectiveDate: "2024/06/01",
    expirationDate: "2025/05/31",
    isAutoRenewable: false,
    nextRefusalDate: null,
    transactionAmount: "3,600,000円",
    manualCorrectionStatus: "completed",
  },
  {
    id: "4",
    title: "販売代理店契約書",
    counterPartyNames: ["株式会社グローバル商社"],
    contractAssignee: "中村真理",
    inhouseId: "CTR-2024-004",
    version: 4,
    contractDocumentStatus: "none",
    createBy: "小林良太",
    voucherId: "V-20240415-004",
    spaceName: "営業部",
    fileName: "販売代理店契約書_グローバル商社.pdf",
    createTime: "2024/04/15 11:45",
    contractCategory: "販売代理店契約",
    ownPartyNames: ["株式会社LegalOn Technologies"],
    language: "日本語",
    agreedContractStatus: "inTerm",
    signingDate: "2024/04/15",
    effectiveDate: "2024/04/15",
    expirationDate: "2026/04/14",
    isAutoRenewable: true,
    nextRefusalDate: "2026/01/14",
    transactionAmount: "12,000,000円",
    manualCorrectionStatus: "inProgress",
  },
  {
    id: "5",
    title: "秘密保持契約",
    counterPartyNames: ["株式会社イノベーション"],
    contractAssignee: "渡辺直樹",
    inhouseId: "CTR-2024-005",
    version: 1,
    contractDocumentStatus: "none",
    createBy: "加藤明美",
    voucherId: "",
    spaceName: "法務部",
    fileName: "NDA_イノベーション_draft.docx",
    createTime: "2024/08/20 16:00",
    contractCategory: "秘密保持契約・受領側",
    ownPartyNames: ["株式会社LegalOn Technologies"],
    language: "日本語",
    agreedContractStatus: null,
    signingDate: null,
    effectiveDate: null,
    expirationDate: null,
    isAutoRenewable: false,
    nextRefusalDate: null,
    transactionAmount: null,
    manualCorrectionStatus: null,
  },
  {
    id: "6",
    title: "リース契約書",
    counterPartyNames: ["株式会社ファイナンス"],
    contractAssignee: "山本恵子",
    inhouseId: "CTR-2024-006",
    version: 2,
    contractDocumentStatus: "none",
    createBy: "吉田大輔",
    voucherId: "V-20220101-006",
    spaceName: "経理部",
    fileName: "リース契約書_ファイナンス.pdf",
    createTime: "2022/01/01 09:30",
    contractCategory: "リース契約",
    ownPartyNames: ["株式会社LegalOn Technologies"],
    language: "日本語",
    agreedContractStatus: "finished",
    signingDate: "2022/01/01",
    effectiveDate: "2022/01/01",
    expirationDate: "2023/12/31",
    isAutoRenewable: false,
    nextRefusalDate: null,
    transactionAmount: "4,800,000円",
    manualCorrectionStatus: "completed",
  },
  {
    id: "7",
    title: "保守サービス契約",
    counterPartyNames: ["サポート株式会社"],
    contractAssignee: "松本裕子",
    inhouseId: "CTR-2024-007",
    version: 1,
    contractDocumentStatus: "none",
    createBy: "井上修",
    voucherId: "V-20240901-007",
    spaceName: "情報システム部",
    fileName: "保守サービス契約_サポート.pdf",
    createTime: "2024/09/01 08:15",
    contractCategory: "保守サービス契約",
    ownPartyNames: ["株式会社LegalOn Technologies"],
    language: "日本語",
    agreedContractStatus: "inTerm",
    signingDate: "2024/09/01",
    effectiveDate: "2024/09/01",
    expirationDate: "2025/08/31",
    isAutoRenewable: true,
    nextRefusalDate: "2025/06/30",
    transactionAmount: "1,200,000円",
    manualCorrectionStatus: "beforeStart",
  },
  {
    id: "8",
    title: "秘密保持契約",
    counterPartyNames: ["株式会社パートナーズ", "株式会社アライアンス"],
    contractAssignee: "木村智子",
    inhouseId: "CTR-2024-008",
    version: 1,
    contractDocumentStatus: "none",
    createBy: "林誠",
    voucherId: "",
    spaceName: "法務部",
    fileName: "NDA_パートナーズ_アライアンス.docx",
    createTime: "2024/10/05 13:00",
    contractCategory: "秘密保持契約・開示・受領側",
    ownPartyNames: ["株式会社LegalOn Technologies"],
    language: "日本語",
    agreedContractStatus: null,
    signingDate: null,
    effectiveDate: null,
    expirationDate: null,
    isAutoRenewable: false,
    nextRefusalDate: null,
    transactionAmount: null,
    manualCorrectionStatus: null,
  },
  {
    id: "9",
    title: "共同開発契約書",
    counterPartyNames: ["株式会社リサーチ"],
    contractAssignee: "清水雅人",
    inhouseId: "CTR-2024-009",
    version: 2,
    contractDocumentStatus: "none",
    createBy: "斎藤由美",
    voucherId: "V-20241001-009",
    spaceName: "研究開発部",
    fileName: "共同開発契約書_リサーチ.pdf",
    createTime: "2024/10/01 10:00",
    contractCategory: "共同開発契約",
    ownPartyNames: ["株式会社LegalOn Technologies"],
    language: "日本語",
    agreedContractStatus: "scheduledToEnd",
    signingDate: "2024/10/01",
    effectiveDate: "2024/10/01",
    expirationDate: "2025/03/31",
    isAutoRenewable: false,
    nextRefusalDate: null,
    transactionAmount: "8,500,000円",
    manualCorrectionStatus: "completedWithComment",
  },
  {
    id: "10",
    title: "顧問契約書",
    counterPartyNames: ["コンサルティング株式会社"],
    contractAssignee: "山口博之",
    inhouseId: "CTR-2024-010",
    version: 1,
    contractDocumentStatus: "none",
    createBy: "阿部千尋",
    voucherId: "V-20240701-010",
    spaceName: "経営企画部",
    fileName: "顧問契約書_コンサルティング.pdf",
    createTime: "2024/07/01 15:30",
    contractCategory: "顧問契約",
    ownPartyNames: ["株式会社LegalOn Technologies"],
    language: "日本語",
    agreedContractStatus: "inTerm",
    signingDate: "2024/07/01",
    effectiveDate: "2024/07/01",
    expirationDate: "2025/06/30",
    isAutoRenewable: false,
    nextRefusalDate: null,
    transactionAmount: "6,000,000円",
    manualCorrectionStatus: "notSubject",
  },
  {
    id: "11",
    title: "秘密保持契約",
    counterPartyNames: ["株式会社エンタープライズ"],
    contractAssignee: "橋本優子",
    inhouseId: "CTR-2024-011",
    version: 1,
    contractDocumentStatus: "none",
    createBy: "藤田浩二",
    voucherId: "",
    spaceName: "法務部",
    fileName: "NDA_エンタープライズ.docx",
    createTime: "2024/11/10 09:45",
    contractCategory: "秘密保持契約・受領側",
    ownPartyNames: ["株式会社LegalOn Technologies"],
    language: "日本語",
    agreedContractStatus: null,
    signingDate: null,
    effectiveDate: null,
    expirationDate: null,
    isAutoRenewable: false,
    nextRefusalDate: null,
    transactionAmount: null,
    manualCorrectionStatus: null,
  },
  {
    id: "12",
    title: "売買基本契約書",
    counterPartyNames: ["トレーディング株式会社", "株式会社マーケットプレイス"],
    contractAssignee: "石井正樹",
    inhouseId: "CTR-2024-012",
    version: 3,
    contractDocumentStatus: "none",
    createBy: "前田美穂",
    voucherId: "V-20240301-012",
    spaceName: "営業部",
    fileName: "売買基本契約書_トレーディング.pdf",
    createTime: "2024/03/01 11:00",
    contractCategory: "売買基本契約",
    ownPartyNames: ["株式会社LegalOn Technologies"],
    language: "日本語",
    agreedContractStatus: "scheduledToEnd",
    signingDate: "2024/03/01",
    effectiveDate: "2024/03/01",
    expirationDate: "2025/02/28",
    isAutoRenewable: true,
    nextRefusalDate: "2024/12/31",
    transactionAmount: "24,000,000円",
    manualCorrectionStatus: "completed",
  },
  {
    id: "13",
    title: "秘密保持契約",
    counterPartyNames: ["株式会社ビジネスソリューションズ"],
    contractAssignee: "長谷川隆",
    inhouseId: "CTR-2024-013",
    version: 2,
    contractDocumentStatus: "none",
    createBy: "近藤さくら",
    voucherId: "V-20230101-013",
    spaceName: "法務部",
    fileName: "NDA_ビジネスソリューションズ.pdf",
    createTime: "2023/01/01 10:00",
    contractCategory: "秘密保持契約・開示側",
    ownPartyNames: ["株式会社LegalOn Technologies"],
    language: "日本語",
    agreedContractStatus: "finished",
    signingDate: "2023/01/01",
    effectiveDate: "2023/01/01",
    expirationDate: "2024/06/30",
    isAutoRenewable: false,
    nextRefusalDate: null,
    transactionAmount: null,
    manualCorrectionStatus: "completed",
  },
  {
    id: "14",
    title: "システム開発契約書",
    counterPartyNames: ["ソフトウェア開発株式会社"],
    contractAssignee: "森田和也",
    inhouseId: "CTR-2024-014",
    version: 1,
    contractDocumentStatus: "none",
    createBy: "池田香織",
    voucherId: "",
    spaceName: "情報システム部",
    fileName: "システム開発契約書_ソフトウェア開発.docx",
    createTime: "2024/11/20 14:30",
    contractCategory: "システム開発契約",
    ownPartyNames: ["株式会社LegalOn Technologies"],
    language: "日本語",
    agreedContractStatus: null,
    signingDate: null,
    effectiveDate: null,
    expirationDate: null,
    isAutoRenewable: false,
    nextRefusalDate: null,
    transactionAmount: null,
    manualCorrectionStatus: null,
  },
];

export const mockAgreedContracts: ContractDocument[] = mockAllContracts.filter((d) => d.agreedContractStatus !== null);

// =============================================================================
// Detail Page Types
// =============================================================================

/**
 * ステータスラベルの表示種別。ファイル種別によって表示スタイルが異なる。
 * - defaultStatusLabel: 自社ひな形・その他ファイル（neutral/outline固定）
 * - contractDocumentStatusLabel: 契約書ファイル（ステータスIDに応じた色分け）
 * - none: 表示なし
 */
export type StatusLabelInfo =
  | {
      text: string;
      displayType: "defaultStatusLabel";
    }
  | {
      text: string;
      documentStatusId: string;
      displayType: "contractDocumentStatusLabel";
    }
  | "none";

/**
 * 契約書ステータスIDに対応するStatusLabelの表示スタイル
 *
 * ソースでは purple を使用しているが、Aegis StatusLabel の color は
 * "blue" | "gray" | "neutral" | "red" | "teal" | "yellow" のみ対応。
 * purple → yellow に読み替えてテンプレートで再現する。
 */
export const contractDocumentStatusLabelStyleMap: Record<
  string,
  { variant: "fill" | "outline"; color: "blue" | "gray" | "neutral" | "red" | "teal" | "yellow" }
> = {
  counterPartyDraft: { variant: "fill", color: "blue" },
  counterPartyRedraft: { variant: "fill", color: "blue" },
  ownPartyDraft: { variant: "fill", color: "blue" },
  ownPartyRedraft: { variant: "fill", color: "blue" },
  approved: { variant: "fill", color: "yellow" },
  scheduledAgreedContract: { variant: "fill", color: "yellow" },
  agreedContract: { variant: "fill", color: "teal" },
};

export type FileDetail = {
  id: string;
  fileName: string;
  statusLabel: StatusLabelInfo;
  createUserName: string;
  createTime: string;
};

export type FileVersion = {
  version: string;
  fileName: string;
  status: string;
  date: string;
  language?: string;
};

export type SimilarContractCandidate = {
  id: string;
  title: string;
  counterPartyNames: string[];
  categoryPosition: string;
  exactMatch: boolean;
  createTime?: string;
  spaceName?: string;
};

export type SimilarTemplate = {
  id: string;
  title: string;
  documentStatus: string;
};

export type SimilarLegalonTemplate = {
  id: string;
  title: string;
  fileName: string;
};

// =============================================================================
// Detail Page Mock Data
// =============================================================================

export const mockFileDetail: FileDetail = {
  id: "sample-001",
  fileName: "秘密保持契約書_株式会社LegalOnTechnologies_20251113.docx",
  statusLabel: {
    text: "自社ドラフト",
    documentStatusId: "ownPartyDraft",
    displayType: "contractDocumentStatusLabel",
  },
  createUserName: "田中花子",
  createTime: "2025-11-13T14:11:00+09:00",
};

export const mockDetailAttributes = {
  basic: {
    counterPartyNames: ["株式会社●●"],
    ownPartyNames: ["株式会社LegalOn Technologies"],
    title: "秘密保持契約書",
    contractKind: "日本法 / 秘密保持契約（NDA）/ 受領者",
    documentStatus: "自社ドラフト",
    language: "日本語",
    startDate: "2025/11/13",
    endDate: "2026/11/12",
    autoRenewal: "あり",
  },
  management: {
    space: "案件受付スペース",
    contractAssignee: "未入力",
    inhouseId: "未入力",
    voucherIds: [] as string[],
    customFields: [
      { label: "重要度", value: "未入力" },
      { label: "カスタム", value: "未入力" },
      { label: "関連部門", value: "未入力" },
      { label: "test", value: "未入力" },
      { label: "hoge", value: "未入力" },
    ],
  },
};

export const mockDetailRelatedFiles = {
  contracts: [
    {
      id: "f1",
      fileName: "基本契約書_株式会社●●.docx",
      status: "締結済み",
      title: "基本業務委託契約",
      dates: "2024/04/01〜2025/03/31",
    },
    {
      id: "f2",
      fileName: "業務委託契約書_株式会社●●.docx",
      status: "レビュー中",
      title: "業務委託契約（第2期）",
      dates: "2025/04/01〜2026/03/31",
    },
  ],
  attachedFiles: [
    {
      id: "f3",
      fileName: "取引先情報_株式会社●●.xlsx",
      createUserName: "田中花子",
      createDateTime: "2025/11/13 14:11",
    },
  ],
};

export const mockDetailSpecialNotices = [
  {
    id: "n1",
    author: "田中花子",
    content: "第5条に競業避止義務の条項が含まれています。期間は契約終了後2年間。",
    updatedAt: "2025/11/13 14:30",
  },
  {
    id: "n2",
    author: "山田太郎",
    content: "第8条に自動更新条項があります。解約通知は期間満了の3ヶ月前まで。",
    updatedAt: "2025/11/13 10:15",
  },
];

export const mockDetailInternalComments = [
  {
    id: "c1",
    author: "山田太郎",
    content: "第3条の秘密保持義務の範囲について、先方と再確認が必要です。",
    createdAt: "2025/11/14 10:30",
    resolved: false,
  },
  {
    id: "c2",
    author: "佐藤花子",
    content: "前回の契約書と比較して、損害賠償条項が追加されています。",
    createdAt: "2025/11/13 16:00",
    resolved: false,
  },
];

export const mockDetailCases = [{ id: "case-001", name: "20MB 以下でファイルが添付できること" }];

export const mockDetailVersions: FileVersion[] = [
  {
    version: "v1",
    fileName: "a.docx",
    status: "自社ドラフト",
    date: "2026/02/24 18:22",
  },
];

export const mockDetailSimilarContracts = {
  referenced: [] as { id: string; title: string; counterPartyNames: string[] }[],
  candidates: {
    contracts: [
      {
        id: "s1",
        title: "秘密保持契約書_株式会社ABC",
        counterPartyNames: ["株式会社ABC"],
        categoryPosition: "秘密保持契約・開示・受領側",
        exactMatch: true,
        createTime: "2025-08-01T10:00:00+09:00",
        spaceName: "法務部",
      },
      {
        id: "s2",
        title: "NDA_株式会社XYZ_20250801",
        counterPartyNames: ["株式会社XYZ"],
        categoryPosition: "秘密保持契約・受領側",
        exactMatch: false,
        createTime: "2025-06-15T14:30:00+09:00",
        spaceName: "営業部",
      },
      {
        id: "s3",
        title: "秘密保持契約書_株式会社DEF_20250601",
        counterPartyNames: ["株式会社DEF"],
        categoryPosition: "秘密保持契約・開示側",
        exactMatch: false,
        createTime: "2025-05-20T09:00:00+09:00",
        spaceName: "法務部",
      },
    ] satisfies SimilarContractCandidate[],
    templates: [
      { id: "t1", title: "秘密保持契約書（自社ひな形）", documentStatus: "最終版" },
      { id: "t2", title: "業務委託契約書（自社ひな形）", documentStatus: "ドラフト" },
    ] satisfies SimilarTemplate[],
    legalonTemplates: [
      { id: "lt1", title: "秘密保持契約書（LegalOn標準）", fileName: "NDA_template_v3.docx" },
    ] satisfies SimilarLegalonTemplate[],
  },
};
