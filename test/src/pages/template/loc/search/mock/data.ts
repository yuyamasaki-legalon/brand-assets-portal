/** Search result category types */
export type SearchCategory =
  | "article"
  | "case"
  | "contract"
  | "agreed"
  | "customerTemplate"
  | "legalonTemplate"
  | "other";

export type ArticleResult = {
  id: string;
  title: string;
  body: string;
  source: {
    fileName: string;
    fileHref: string;
    title: string;
    language: string;
  };
  createdAt: string;
  createdBy: string;
  relatedCount: number;
};

export type CaseResult = {
  id: string;
  href: string;
  title: string;
  caseType: string;
  caseNumber: string;
  status: string;
  createdAt: string;
  assignee?: string;
  requester?: string;
  snippet: string;
};

export type ContractResult = {
  id: string;
  href: string;
  fileName: string;
  title?: string;
  language: string;
  createdAt: string;
  createdBy: string;
  companyName?: string;
  counterPartyName?: string;
  isAgreed?: boolean;
  snippet: string;
};

export type TemplateResult = {
  id: string;
  href: string;
  title: string;
  subtitle?: string;
  categories: string[];
  language: string;
  createdBy: string;
  snippet: string;
};

export type OtherFileResult = {
  id: string;
  href: string;
  fileName: string;
  createdAt: string;
  createdBy: string;
};

export type CategorySummary = {
  category: SearchCategory;
  label: string;
  count: number;
};

export const categorySummaries: CategorySummary[] = [
  { category: "article", label: "条文", count: 2233 },
  { category: "case", label: "案件", count: 1228 },
  { category: "contract", label: "契約書", count: 855 },
  { category: "agreed", label: "締結版契約書", count: 35 },
  { category: "customerTemplate", label: "自社ひな形", count: 4 },
  { category: "legalonTemplate", label: "LegalOnテンプレート", count: 897 },
  { category: "other", label: "その他ファイル", count: 291 },
];

export const totalCount = categorySummaries.reduce((sum, c) => sum + c.count, 0);

export const articleResults: ArticleResult[] = [
  {
    id: "art-001",
    title: "秘密保持契約書",
    body: "株式会社AAA(以下「甲」という。)と株式会社BBB(以下「乙」という。)は、甲乙間の業務提携の可能性を検討する目的において、甲が乙に開示又は提供する秘密情報の保持につき、次のとおり秘密保持契約を締結する。",
    source: {
      fileName: "秘密保持契約書.docx",
      fileHref: "/file/sample-001",
      title: "秘密保持契約書",
      language: "日本語",
    },
    createdAt: "2026/04/02",
    createdBy: "taro.yamada",
    relatedCount: 2,
  },
  {
    id: "art-002",
    title: "業務委託契約書",
    body: "委託者は、次の各号の業務を受託者に委託し、受託者はこれを受託する。委託業務に関して別途受託者が定める約款がある場合には、当該約款は本契約に優先する。",
    source: {
      fileName: "【受託者有利ver】業務委託契約書.docx",
      fileHref: "/file/sample-002",
      title: "業務委託契約書",
      language: "日本語",
    },
    createdAt: "2026/03/15",
    createdBy: "hanako.sato",
    relatedCount: 16,
  },
  {
    id: "art-003",
    title: "Purchase and Sale Agreement",
    body: "This Purchase and Sale Agreement is entered into as of the date set forth below, by and between the Buyer and the Seller identified herein.",
    source: {
      fileName: "Purchase_and_Sale_Agreement_20230424.docx",
      fileHref: "/file/sample-003",
      title: "Purchase and Sale Agreement",
      language: "英語",
    },
    createdAt: "2024/01/31",
    createdBy: "jiro.tanaka",
    relatedCount: 5,
  },
];

export const caseResults: CaseResult[] = [
  {
    id: "case-001",
    href: "/case/019d8fb2-f33b-7631-8561-0d86d61db70b",
    title: "NDA締結依頼（株式会社サンプル）",
    caseType: "契約書審査",
    caseNumber: "2026-04-0002",
    status: "未着手",
    createdAt: "2026/04/15",
    assignee: "田中次郎",
    requester: "山田太郎",
    snippet:
      "株式会社サンプルとのNDA締結について審査を依頼します。取引先より受領した秘密保持契約書のレビューをお願いいたします。",
  },
  {
    id: "case-002",
    href: "/case/019d471d-207c-732d-921d-d92d36a1f37a",
    title: "業務委託契約書の起案依頼",
    caseType: "契約書の起案",
    caseNumber: "2026-04-0001",
    status: "未着手",
    createdAt: "2026/04/01",
    requester: "佐藤花子",
    snippet: "新規プロジェクトに伴う業務委託契約書の起案を依頼します。委託先は株式会社テスト商事です。",
  },
  {
    id: "case-003",
    href: "/case/019cff99-2758-767f-94c7-95aef83db212",
    title: "法務相談：競業避止義務について",
    caseType: "法務相談",
    caseNumber: "2026-03-0021",
    status: "進行中",
    createdAt: "2026/03/18",
    assignee: "鈴木三郎",
    requester: "田中次郎",
    snippet: "退職予定の従業員に対する競業避止義務の有効性について法務相談です。",
  },
];

export const contractResults: ContractResult[] = [
  {
    id: "con-001",
    href: "/file/sample-con-001",
    fileName: "秘密保持契約書_AAA_BBB.docx",
    title: "秘密保持契約書",
    language: "日本語",
    createdAt: "2026/04/02",
    createdBy: "taro.yamada",
    companyName: "株式会社AAA",
    counterPartyName: "株式会社BBB",
    snippet:
      "秘密保持契約書 株式会社AAA(以下「甲」という。)と株式会社BBB(以下「乙」という。)は、甲乙間の業務提携の可能性を検討する目的において...",
  },
  {
    id: "con-002",
    href: "/file/sample-con-002",
    fileName: "業務委託契約書_v2.docx",
    title: "業務委託契約書",
    language: "日本語",
    createdAt: "2026/03/20",
    createdBy: "hanako.sato",
    companyName: "株式会社テスト商事",
    counterPartyName: "株式会社サンプル工業",
    snippet:
      "業務委託契約書 委託者と受託者は、以下のとおり業務委託契約を締結する。第1条(委託業務) 委託者は、次の各号の業務を受託者に委託し...",
  },
  {
    id: "con-003",
    href: "/file/sample-con-003",
    fileName: "ライセンス契約書_JP.pdf",
    title: "特許実施許諾契約書",
    language: "日本語",
    createdAt: "2026/03/11",
    createdBy: "goro.ito",
    snippet: "特許実施許諾契約書 甲が乙に対して特許権の実施を許諾することに関し、以下のとおり特許実施契約を締結する。",
  },
];

export const agreedResults: ContractResult[] = [
  {
    id: "agr-001",
    href: "/file/sample-agr-001",
    fileName: "【サンプル】秘密保持契約_取引先なし.pdf",
    title: "秘密保持契約書",
    language: "日本語",
    createdAt: "2026/02/02",
    createdBy: "テストユーザー",
    companyName: "株式会社AAA",
    counterPartyName: "株式会社BBB",
    isAgreed: true,
    snippet: "秘密保持契約書 株式会社AAA(以下「甲」という。)と株式会社BBB(以下「乙」という。)は...",
  },
  {
    id: "agr-002",
    href: "/file/sample-agr-002",
    fileName: "業務委託契約書_連携用.pdf",
    title: "秘密保持契約",
    language: "日本語",
    createdAt: "2026/02/02",
    createdBy: "テストユーザー",
    companyName: "株式会社バスケットボール",
    counterPartyName: "株式会社軟式テニス",
    isAgreed: true,
    snippet: "秘密保持契約 株式会社バスケットボール(以下「甲」という。)と株式会社軟式テニス(以下「乙」という。)は...",
  },
];

export const customerTemplateResults: ContractResult[] = [
  {
    id: "ct-001",
    href: "/file/sample-ct-001",
    fileName: "業務委託契約書ひな形.pdf",
    title: "業務委託契約書",
    language: "日本語",
    createdAt: "2025/12/22",
    createdBy: "shiro.takahashi",
    snippet: "業務委託契約書 委託者と受託者は、以下のとおり業務委託契約を締結する。",
  },
];

export const legalonTemplateResults: TemplateResult[] = [
  {
    id: "lt-001",
    href: "/legalon-template/sample-lt-001",
    title: "業務委託契約書（中立版）",
    subtitle: "/一般・IT",
    categories: ["一般・IT"],
    language: "日本語",
    createdBy: "サンプル法律事務所ライブラリー",
    snippet:
      "業務委託契約書 委託者は、本契約に基づき、第2条に定める内容の業務を受託者に委託し、受託者はこれを受託する。",
  },
  {
    id: "lt-002",
    href: "/legalon-template/sample-lt-002",
    title: "秘密保持契約書（開示者有利版）",
    subtitle: "/一般",
    categories: ["一般"],
    language: "日本語",
    createdBy: "サンプル法律事務所ライブラリー",
    snippet: "秘密保持契約 甲及び乙は、甲乙間の業務提携の可能性を検討することを目的として、本契約を締結する。",
  },
  {
    id: "lt-003",
    href: "/legalon-template/sample-lt-003",
    title: "Confidentiality Agreement",
    categories: ["General"],
    language: "英語",
    createdBy: "LegalOn ライブラリー",
    snippet:
      "This Confidentiality Agreement is made and entered into as of the Effective Date, by and between the Disclosing Party and the Receiving Party.",
  },
];

export const otherFileResults: OtherFileResult[] = [
  {
    id: "of-001",
    href: "/file/sample-of-001",
    fileName: "議事録_20260316.docx",
    createdAt: "2026/03/16",
    createdBy: "伊藤五郎",
  },
  {
    id: "of-002",
    href: "/file/sample-of-002",
    fileName: "取締役会資料_Q1.pdf",
    createdAt: "2026/03/11",
    createdBy: "System User",
  },
  {
    id: "of-003",
    href: "/file/sample-of-003",
    fileName: "社内規程_改訂版.pdf",
    createdAt: "2026/03/11",
    createdBy: "System User",
  },
];

// ============================================================================
// Filter Select Options
// ============================================================================

export type SelectOption = { value: string; label: string };

export const contractFormOptions: SelectOption[] = [
  { value: "all", label: "すべて" },
  { value: "contract", label: "契約書" },
  { value: "agreed", label: "締結版契約書" },
  { value: "customerTemplate", label: "自社ひな形" },
  { value: "legalonTemplate", label: "LegalOnテンプレート" },
];

export const contractStatusOptions: SelectOption[] = [
  { value: "all", label: "すべて" },
  { value: "draft", label: "下書き" },
  { value: "inReview", label: "レビュー中" },
  { value: "inTerm", label: "契約期間中" },
  { value: "expired", label: "終了" },
];

export const customerTemplateStatusOptions: SelectOption[] = [
  { value: "all", label: "すべて" },
  { value: "active", label: "利用中" },
  { value: "archived", label: "アーカイブ" },
];

export const createdAtOptions: SelectOption[] = [
  { value: "all", label: "すべて" },
  { value: "today", label: "今日" },
  { value: "7days", label: "7日以内" },
  { value: "30days", label: "30日以内" },
  { value: "90days", label: "90日以内" },
];

export const creatorContractOptions: SelectOption[] = [
  { value: "all", label: "すべて" },
  { value: "taro.yamada", label: "taro.yamada" },
  { value: "hanako.sato", label: "hanako.sato" },
  { value: "jiro.tanaka", label: "田中次郎" },
  { value: "saburo.suzuki", label: "鈴木三郎" },
  { value: "shiro.takahashi", label: "shiro.takahashi" },
];

export const creatorLegalonTemplateOptions: SelectOption[] = [
  { value: "all", label: "すべて" },
  { value: "sampleLibrary", label: "サンプル法律事務所ライブラリー" },
  { value: "legalon", label: "LegalOn ライブラリー" },
];

export const caseAssigneeOptions: SelectOption[] = [
  { value: "all", label: "すべて" },
  { value: "jiro.tanaka", label: "田中次郎" },
  { value: "saburo.suzuki", label: "鈴木三郎" },
  { value: "rokuro.watanabe", label: "渡辺六郎" },
];

export const caseDepartmentOptions: SelectOption[] = [
  { value: "all", label: "すべて" },
  { value: "legal", label: "法務部" },
  { value: "sales", label: "営業部" },
  { value: "hr", label: "人事部" },
  { value: "procurement", label: "購買部" },
];

export const caseStatusOptions: SelectOption[] = [
  { value: "all", label: "すべて" },
  { value: "notStarted", label: "未着手" },
  { value: "inProgress", label: "進行中" },
  { value: "completed", label: "終了" },
];

export const governingLawOptions: SelectOption[] = [
  { value: "all", label: "すべて" },
  { value: "japan", label: "日本法" },
  { value: "us", label: "米国法" },
  { value: "uk", label: "英国法" },
  { value: "other", label: "その他" },
];

export const contractTypeOptions: SelectOption[] = [
  { value: "all", label: "すべて" },
  { value: "nda", label: "秘密保持契約" },
  { value: "service", label: "業務委託契約" },
  { value: "license", label: "ライセンス契約" },
  { value: "sales", label: "売買契約" },
  { value: "employment", label: "雇用契約" },
];

export const contractSubTypeOptions: SelectOption[] = [
  { value: "all", label: "すべて" },
  { value: "general", label: "一般" },
  { value: "it", label: "IT関連" },
  { value: "financial", label: "金融関連" },
  { value: "realEstate", label: "不動産関連" },
];

export const languageOptions: SelectOption[] = [
  { value: "all", label: "すべて" },
  { value: "ja", label: "日本語" },
  { value: "en", label: "英語" },
  { value: "zh", label: "中国語" },
];

export const storageLocationOptions: SelectOption[] = [
  { value: "all", label: "すべて" },
  { value: "caseReception", label: "案件受付スペース" },
  { value: "legal", label: "法務ワークスペース" },
  { value: "general", label: "全社共有スペース" },
  { value: "archive", label: "アーカイブ" },
];

export const legalonCategoryOptions: SelectOption[] = [
  { value: "all", label: "すべて" },
  { value: "general", label: "一般・IT" },
  { value: "advertising", label: "広告" },
  { value: "employment", label: "雇用" },
  { value: "finance", label: "金融" },
];

export const legalonSubCategoryOptions: SelectOption[] = [
  { value: "all", label: "すべて" },
  { value: "normal", label: "普通1" },
  { value: "special", label: "特殊1" },
];
