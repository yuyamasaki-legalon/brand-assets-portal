var e=`import type { ReactElement } from "react";
import { createElement } from "react";
import { routes as templateRoutes } from "../../../../../template/routes";
import { ChatLayoutTypographyPreview } from "../previews/ChatLayoutTypographyPreview";
import { ReviewTypographyPreview } from "../previews/ReviewTypographyPreview";

export type PreviewPageCategory = "Pages" | "LegalOn" | "WorkOn" | "DealOn";

export type PreviewPage = {
  id: string;
  label: string;
  category: PreviewPageCategory;
  path: string;
  description: string;
  element: ReactElement;
};

const PREVIEW_PAGE_CATEGORY_ORDER: PreviewPageCategory[] = ["Pages", "LegalOn", "WorkOn", "DealOn"];

// Local preview overrides: these paths render sandbox-local forks instead of the template original.
// The forks apply compare-specific typography (explicit variant props) so that Typography Lab
// can verify token changes affect real component output. The template source is intentionally
// left unchanged to keep template PRs clean.
const LOCAL_PREVIEW_OVERRIDES: Partial<Record<string, ReactElement>> = {
  "/template/chat-layout": createElement(ChatLayoutTypographyPreview),
  "/template/loc/review": createElement(ReviewTypographyPreview),
};

// Template page registry — mirrors the template catalog for the four categories used in Typography Lab.
// Layouts and States & Feedback are intentionally excluded (not useful for typography compare).
// This list is kept local to Typography Lab to avoid importing from template internals.
type TemplatePageEntry = {
  category: PreviewPageCategory;
  title: string;
  path: string;
  description: string;
};

const TEMPLATE_PAGE_REGISTRY: TemplatePageEntry[] = [
  // ── Pages ────────────────────────────────────────────────────────────────────
  {
    category: "Pages",
    title: "List Page",
    path: "/template/list-layout",
    description: "DataTable + タブ + 検索 + ページネーションの汎用的な一覧画面のテンプレート",
  },
  {
    category: "Pages",
    title: "Detail Page",
    path: "/template/detail-layout",
    description: "Header + メインコンテンツ + 右ペイン切り替えができる詳細画面のテンプレート",
  },
  {
    category: "Pages",
    title: "Settings Page",
    path: "/template/settings-layout",
    description: "左ペインNavList + 右セクション分けの設定画面のテンプレート",
  },
  {
    category: "Pages",
    title: "Chat Page",
    path: "/template/chat-layout",
    description: "メッセージバブル・ストリーミング応答・アクションボタン付き会話UIのテンプレート",
  },
  {
    category: "Pages",
    title: "Dashboard Page",
    path: "/template/dashboard-layout",
    description: "KPIカード・チャートエリア・アクティビティフィード・ショートカットのダッシュボードのテンプレート",
  },
  {
    category: "Pages",
    title: "Form Page",
    path: "/template/form-template",
    description: "FormControl・バリデーション・送信/キャンセルフロー付きフォームのテンプレート",
  },
  {
    category: "Pages",
    title: "Dialog",
    path: "/template/dialog",
    description: "Dialogコンポーネントの使用例（削除確認、フォーム入力など）のテンプレート",
  },
  // ── LegalOn ──────────────────────────────────────────────────────────────────
  {
    category: "LegalOn",
    title: "Dashboard",
    path: "/template/dashboard",
    description: "LegalOnのダッシュボードUIテンプレート",
  },
  {
    category: "LegalOn",
    title: "Cross Search",
    path: "/template/loc/search",
    description: "横断検索（条文・案件・契約書・ひな形などの全文検索）",
  },
  {
    category: "LegalOn",
    title: "Case Reception Form",
    path: "/template/case-reception-form",
    description: "案件受付フォームのUIサンプル",
  },
  {
    category: "LegalOn",
    title: "Error Page",
    path: "/template/root",
    description: "NotFound / ServerError / Maintenance のUIを確認できます。",
  },
  {
    category: "LegalOn",
    title: "E-Sign Template",
    path: "/template/esign",
    description: "署名依頼作成UIを再現したテンプレート",
  },
  {
    category: "LegalOn",
    title: "E-Sign Envelope List",
    path: "/template/esign/envelope-list",
    description: "電子契約一覧（署名依頼タブ）のUIテンプレート",
  },
  {
    category: "LegalOn",
    title: "Legalon Template",
    path: "/template/legalon-template",
    description: "LegalOnひな形は、法務業務を効率化するためのテンプレート集です。",
  },
  {
    category: "LegalOn",
    title: "Legalon Template Detail",
    path: "/template/legalon-template/tmpl1",
    description: "LegalOnひな形の詳細画面（PDFビューア + メタ情報ペイン）",
  },
  {
    category: "LegalOn",
    title: "LegalOn Matter List",
    path: "/template/loc/case",
    description: "マターマネジメント案件一覧画面",
  },
  {
    category: "LegalOn",
    title: "LegalOn Matter Detail",
    path: "/template/loc/case/detail",
    description: "マターマネジメント案件詳細画面",
  },
  {
    category: "LegalOn",
    title: "LegalOn Application Console",
    path: "/template/loc/application-console",
    description: "案件ステータス設定画面",
  },
  {
    category: "LegalOn",
    title: "LegalOn Application Console (Contract Management)",
    path: "/template/loc/application-console/contract-management/custom-attribute-definition",
    description: "契約カスタム項目・管理番号・期限通知・電子契約サービス連携の設定画面",
  },
  {
    category: "LegalOn",
    title: "LegalOn Application Console (Sign)",
    path: "/template/loc/application-console/sign/sender-name",
    description: "差出人企業名・署名依頼の保存先・承認申請フォームの設定画面",
  },
  {
    category: "LegalOn",
    title: "Customer Template",
    path: "/template/file-management/customer-template",
    description: "自社ひな形の一覧管理画面",
  },
  {
    category: "LegalOn",
    title: "Word Addin Review",
    path: "/template/loc/word-addin",
    description: "Word アドインのレビューパネル UI",
  },
  {
    category: "LegalOn",
    title: "Word Addin Standalone",
    path: "/template/loc/word-addin-standalone",
    description: "Word アドイン スタンドアロン版タスクペイン UI",
  },
  {
    category: "LegalOn",
    title: "Contract Review",
    path: "/template/loc/review",
    description: "契約リスクチェック画面（PDFビューア + プレイブックパネル）",
  },
  {
    category: "LegalOn",
    title: "Manual Correction",
    path: "/template/loc/manual-correction",
    description: "手動補正ツールの契約書一覧画面（検索フォーム + テーブル）",
  },
  {
    category: "LegalOn",
    title: "Manual Correction Detail",
    path: "/template/loc/manual-correction/detail",
    description: "手動補正ツールの契約書詳細画面（PDFビューア + アノテーション確認/編集ペイン）",
  },
  {
    category: "LegalOn",
    title: "LegalOn Assistant",
    path: "/template/loc/loa",
    description: "AIアシスタントとの会話UI（LOA Conversation）",
  },
  {
    category: "LegalOn",
    title: "Review Console",
    path: "/template/loc/review-console",
    description: "LegalOn アラート設定 / プレイブック管理",
  },
  {
    category: "LegalOn",
    title: "File Management",
    path: "/template/file-management",
    description: "契約書管理（一覧・詳細画面）",
  },
  {
    category: "LegalOn",
    title: "Management Console",
    path: "/template/management-console",
    description: "ライセンス使用状況とテナント情報を管理する画面",
  },
  {
    category: "LegalOn",
    title: "Personal Setting",
    path: "/template/personal-setting",
    description: "個人設定画面（プロフィール、通知設定、外部連携）",
  },
  {
    category: "LegalOn",
    title: "Setting Page",
    path: "/template/setting-page",
    description: "設定ページテンプレート（各種セクションとgapの実装例）",
  },
  // ── WorkOn ───────────────────────────────────────────────────────────────────
  {
    category: "WorkOn",
    title: "Employee Registration",
    path: "/template/workon/employee-registration",
    description: "従業員登録ページ",
  },
  {
    category: "WorkOn",
    title: "Procedure",
    path: "/template/workon/procedure",
    description: "手続きページ",
  },
  {
    category: "WorkOn",
    title: "Setting",
    path: "/template/workon/setting",
    description: "設定ページ（招待、アカウント、権限管理）",
  },
  {
    category: "WorkOn",
    title: "Profile",
    path: "/template/workon/profile",
    description: "プロフィールページ",
  },
  // ── DealOn ───────────────────────────────────────────────────────────────────
  {
    category: "DealOn",
    title: "DealOn Layout",
    path: "/template/dealon/layout",
    description: "DealOnレイアウトテンプレート（ダークHeader + サイドバー）",
  },
  {
    category: "DealOn",
    title: "DealOn Deal 一覧",
    path: "/template/dealon/deal-list",
    description: "Deal 一覧画面（タブ、検索、DataTable、ページネーション）",
  },
  {
    category: "DealOn",
    title: "DealOn Deal 詳細",
    path: "/template/dealon/deal-detail",
    description: "Deal 詳細画面（9タブ: 基本情報、アラート、タスク等）",
  },
  {
    category: "DealOn",
    title: "DealOn 個人設定",
    path: "/template/dealon/settings-profile",
    description: "個人設定画面（プロフィール、MFA、外部連携）",
  },
  {
    category: "DealOn",
    title: "DealOn ユーザー管理",
    path: "/template/dealon/settings-users",
    description: "ユーザー管理画面（ユーザー一覧テーブル、招待）",
  },
];

const templateRouteElementMap = new Map(templateRoutes.map((route) => [route.path, route.element]));

const comparePreviewTitle = (a: { title: string }, b: { title: string }) =>
  a.title.localeCompare(b.title, "en", { sensitivity: "base" });

export const PREVIEW_PAGES: PreviewPage[] = PREVIEW_PAGE_CATEGORY_ORDER.flatMap((category) => {
  const entries = TEMPLATE_PAGE_REGISTRY.filter((entry) => entry.category === category);

  return [...entries].sort(comparePreviewTitle).flatMap((entry) => {
    // Use sandbox-local preview fork if available; fall back to template route element.
    const element = LOCAL_PREVIEW_OVERRIDES[entry.path] ?? templateRouteElementMap.get(entry.path);
    if (!element) return [];

    return [
      {
        id: entry.path,
        label: entry.title,
        category,
        path: entry.path,
        description: entry.description,
        element,
      },
    ];
  });
});

export const PREVIEW_PAGE_GROUPS: Array<{ category: PreviewPageCategory; pages: PreviewPage[] }> =
  PREVIEW_PAGE_CATEGORY_ORDER.map((category) => ({
    category,
    pages: PREVIEW_PAGES.filter((page) => page.category === category),
  })).filter((group) => group.pages.length > 0);
`;export{e as default};