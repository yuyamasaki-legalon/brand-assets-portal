import {
  ActionList,
  Badge,
  ContentHeader,
  NavList,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  Search,
  StatusLabel,
  Text,
} from "@legalforce/aegis-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type TemplateItem = {
  title: string;
  description: string;
  to: string;
  category: string;
};

const templates: TemplateItem[] = [
  // Basic (8)
  {
    title: "Chat Template",
    description: "View chat page with sidebar and pane",
    to: "/template/chat",
    category: "Basic",
  },
  {
    title: "Dialog Template",
    description: "Dialogコンポーネントの使用例（削除確認、フォーム入力など）",
    to: "/template/dialog",
    category: "Basic",
  },
  {
    title: "PageLayout Templates",
    description: "Explore various PageLayout patterns and use cases",
    to: "/template/pagelayout",
    category: "Basic",
  },
  {
    title: "Fill Layout",
    description: "PageLayout variant=fill を使用した2カラムマスター・ディテールレイアウト",
    to: "/template/fill-layout",
    category: "Basic",
  },
  {
    title: "Form Layout",
    description: "Header + 中央揃えコンテンツ + Footer のシンプルなフォームレイアウト",
    to: "/template/form-layout",
    category: "Basic",
  },
  {
    title: "Settings Layout",
    description: "左ペインにNavList、右にセクション分けされた設定詳細画面テンプレート",
    to: "/template/settings-layout",
    category: "Basic",
  },
  {
    title: "List Layout",
    description: "DataTableを使用した汎用的な一覧画面テンプレート（タブ、検索、ページネーション付き）",
    to: "/template/list-layout",
    category: "Basic",
  },
  {
    title: "Detail Layout",
    description: "ドキュメント詳細画面テンプレート（Header + メインコンテンツ + 右ペイン切り替え）",
    to: "/template/detail-layout",
    category: "Basic",
  },
  // LO (18)
  {
    title: "Dashboard",
    description: "LegalOnのダッシュボードUIテンプレート",
    to: "/template/dashboard",
    category: "LO",
  },
  {
    title: "Case Reception Form",
    description: "案件受付フォームのUIサンプル",
    to: "/template/case-reception-form",
    category: "LO",
  },
  {
    title: "Error Page",
    description: "NotFound / ServerError / Maintenance のUIを確認できます。",
    to: "/template/root",
    category: "LO",
  },
  {
    title: "E-Sign Template",
    description: "署名依頼作成UIを再現したテンプレート",
    to: "/template/esign",
    category: "LO",
  },
  {
    title: "E-Sign Envelope List",
    description: "電子契約一覧（署名依頼タブ）のUIテンプレート",
    to: "/template/esign/envelope-list",
    category: "LO",
  },
  {
    title: "Legalon Template",
    description: "LegalOnひな形は、法務業務を効率化するためのテンプレート集です。",
    to: "/template/legalon-template",
    category: "LO",
  },
  {
    title: "LegalOn Matter List",
    description: "マターマネジメント案件一覧画面",
    to: "/template/loc/case",
    category: "LO",
  },
  {
    title: "LegalOn Matter Detail",
    description: "マターマネジメント案件詳細画面",
    to: "/template/loc/case/detail",
    category: "LO",
  },
  {
    title: "LO Application Console",
    description: "案件ステータス設定画面",
    to: "/template/loc/application-console",
    category: "LO",
  },
  {
    title: "Word Addin Review",
    description: "Word アドインのレビューパネル UI",
    to: "/template/loc/word-addin",
    category: "LO",
  },
  {
    title: "Word Addin Standalone",
    description: "Word アドイン スタンドアロン版タスクペイン UI",
    to: "/template/loc/word-addin-standalone",
    category: "LO",
  },
  {
    title: "Contract Review",
    description: "契約リスクチェック画面（PDFビューア + プレイブックパネル）",
    to: "/template/loc/review",
    category: "LO",
  },
  {
    title: "LegalOn Assistant",
    description: "AIアシスタントとの会話UI（LOA Conversation）",
    to: "/template/loc/loa",
    category: "LO",
  },
  {
    title: "Review Console",
    description: "LegalOn アラート設定 / プレイブック管理",
    to: "/template/loc/review-console",
    category: "LO",
  },
  {
    title: "File Management",
    description: "契約書管理（一覧・詳細画面）",
    to: "/template/file-management",
    category: "LO",
  },
  {
    title: "Management Console",
    description: "ライセンス使用状況とテナント情報を管理する画面",
    to: "/template/management-console",
    category: "LO",
  },
  {
    title: "Personal Setting",
    description: "個人設定画面（プロフィール、通知設定、外部連携）",
    to: "/template/personal-setting",
    category: "LO",
  },
  {
    title: "Setting Page",
    description: "設定ページテンプレート（各種セクションとgapの実装例）",
    to: "/template/setting-page",
    category: "LO",
  },
  // WorkOn (4)
  {
    title: "Employee Registration",
    description: "従業員登録ページ",
    to: "/template/workon/employee-registration",
    category: "WorkOn",
  },
  { title: "Procedure", description: "手続きページ", to: "/template/workon/procedure", category: "WorkOn" },
  {
    title: "Setting",
    description: "設定ページ（招待、アカウント、権限管理）",
    to: "/template/workon/setting",
    category: "WorkOn",
  },
  { title: "Profile", description: "プロフィールページ", to: "/template/workon/profile", category: "WorkOn" },
  // DealOn (5)
  {
    title: "DealOn Layout",
    description: "DealOnレイアウトテンプレート（ダークHeader + サイドバー）",
    to: "/template/dealon/layout",
    category: "DealOn",
  },
  {
    title: "DealOn Deal 一覧",
    description: "Deal 一覧画面（タブ、検索、DataTable、ページネーション）",
    to: "/template/dealon/deal-list",
    category: "DealOn",
  },
  {
    title: "DealOn Deal 詳細",
    description: "Deal 詳細画面（9タブ: 基本情報、アラート、タスク等）",
    to: "/template/dealon/deal-detail",
    category: "DealOn",
  },
  {
    title: "DealOn 個人設定",
    description: "個人設定画面（プロフィール、MFA、外部連携）",
    to: "/template/dealon/settings-profile",
    category: "DealOn",
  },
  {
    title: "DealOn ユーザー管理",
    description: "ユーザー管理画面（ユーザー一覧テーブル、招待）",
    to: "/template/dealon/settings-users",
    category: "DealOn",
  },
];

const categories = [
  { label: "All", value: null },
  { label: "Basic", value: "Basic" },
  { label: "LO", value: "LO" },
  { label: "WorkOn", value: "WorkOn" },
  { label: "DealOn", value: "DealOn" },
] as const;

function getCategoryCount(category: string | null): number {
  if (category === null) return templates.length;
  return templates.filter((t) => t.category === category).length;
}

const categoryColors: Record<string, "gray" | "blue" | "teal" | "yellow" | "red"> = {
  Basic: "gray",
  LO: "blue",
  WorkOn: "teal",
  DealOn: "yellow",
};

export function TemplateBrowser() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchesCategory = selectedCategory === null || t.category === selectedCategory;
      const query = searchQuery.toLowerCase();
      const matchesSearch = t.title.toLowerCase().includes(query) || t.description.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <PageLayout>
      <PageLayoutPane position="start">
        <PageLayoutHeader>
          <Text as="h2" variant="title.large">
            Categories
          </Text>
        </PageLayoutHeader>
        <PageLayoutBody>
          <NavList>
            {categories.map((cat) => (
              <NavList.Item
                key={cat.label}
                aria-current={selectedCategory === cat.value ? "page" : undefined}
                onClick={() => setSelectedCategory(cat.value)}
                as="button"
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    gap: "var(--aegis-space-small)",
                  }}
                >
                  {cat.label}
                  <Badge count={getCategoryCount(cat.value)} color="subtle" />
                </span>
              </NavList.Item>
            ))}
          </NavList>
        </PageLayoutBody>
      </PageLayoutPane>

      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Template Browser</ContentHeader.Title>
            <ContentHeader.Description>Browse templates by category or search by name</ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--aegis-space-medium)",
            }}
          >
            <Search
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              clearable
              onClear={() => setSearchQuery("")}
              placeholder="Search templates..."
            />
            <Text variant="body.small" color="subtle">
              {filteredTemplates.length} / {templates.length} templates
            </Text>
            <ActionList size="large">
              {filteredTemplates.map((item) => (
                <ActionList.Item key={item.to} onClick={() => navigate(item.to)}>
                  <ActionList.Body>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--aegis-space-small)",
                      }}
                    >
                      <Text variant="body.medium.bold">{item.title}</Text>
                      <StatusLabel size="small" color={categoryColors[item.category]}>
                        {item.category}
                      </StatusLabel>
                    </span>
                    <ActionList.Description>{item.description}</ActionList.Description>
                  </ActionList.Body>
                </ActionList.Item>
              ))}
            </ActionList>
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
}
