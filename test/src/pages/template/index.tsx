import {
  Link as AegisLink,
  Card,
  CardBody,
  CardHeader,
  CardLink,
  ContentHeader,
  ContentHeaderTitle,
  EmptyState,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Search,
  SegmentedControl,
  Text,
} from "@legalforce/aegis-react";
import { type ChangeEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./index.module.css";

type PreviewKind =
  | "chat"
  | "dashboard"
  | "detail"
  | "empty"
  | "error"
  | "feedback"
  | "form"
  | "generic"
  | "list"
  | "loading"
  | "pageLayout"
  | "settings";

type TemplateItem = {
  title: string;
  description: string;
  to: string;
  previewKind: PreviewKind;
  thumbnailFile?: string;
};

type TemplateSection = {
  title: string;
  items: TemplateItem[];
};

// Curated production thumbnails only. Do not import raw e2e snapshots here.
const previewImages = import.meta.glob("./thumbnails/*.webp", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const templateSections = [
  {
    title: "Layouts",
    items: [
      {
        title: "PageLayout Patterns",
        description: "PageLayoutの基本パターン集（Sidebar、Pane、Scroll、Stickyなど）",
        to: "/template/pagelayout",
        previewKind: "pageLayout",
        thumbnailFile: "pagelayout.webp",
      },
      {
        title: "Fill Layout",
        description: "PageLayout variant=fill のフルワイドエディタ/ビューア + サイドパネルレイアウト",
        to: "/template/fill-layout",
        previewKind: "detail",
        thumbnailFile: "fill-layout.webp",
      },
      {
        title: "Form Layout",
        description: "Header + 中央揃えコンテンツ + Footer のフォームレイアウト",
        to: "/template/form-layout",
        previewKind: "form",
        thumbnailFile: "form-layout.webp",
      },
      {
        title: "Chat Layout",
        description: "Sidebar + メッセージエリア + 入力エリア + Pane の会話UIのテンプレート",
        to: "/template/chat",
        previewKind: "chat",
        thumbnailFile: "chat.webp",
      },
    ],
  },
  {
    title: "Pages",
    items: [
      {
        title: "List Page",
        description: "DataTable + タブ + 検索 + ページネーションの汎用的な一覧画面のテンプレート",
        to: "/template/list-layout",
        previewKind: "list",
        thumbnailFile: "list-layout.webp",
      },
      {
        title: "Detail Page",
        description: "Header + メインコンテンツ + 右ペイン切り替えができる詳細画面のテンプレート",
        to: "/template/detail-layout",
        previewKind: "detail",
        thumbnailFile: "detail-layout.webp",
      },
      {
        title: "Settings Page",
        description: "左ペインNavList + 右セクション分けの設定画面のテンプレート",
        to: "/template/settings-layout",
        previewKind: "settings",
        thumbnailFile: "settings-layout.webp",
      },
      {
        title: "Chat Page",
        description: "メッセージバブル・ストリーミング応答・アクションボタン付き会話UIのテンプレート",
        to: "/template/chat-layout",
        previewKind: "chat",
      },
      {
        title: "Dashboard Page",
        description: "KPIカード・チャートエリア・アクティビティフィード・ショートカットのダッシュボードのテンプレート",
        to: "/template/dashboard-layout",
        previewKind: "dashboard",
      },
      {
        title: "Form Page",
        description: "FormControl・バリデーション・送信/キャンセルフロー付きフォームのテンプレート",
        to: "/template/form-template",
        previewKind: "form",
      },
      {
        title: "Dialog",
        description: "Dialogコンポーネントの使用例（削除確認、フォーム入力など）のテンプレート",
        to: "/template/dialog",
        previewKind: "generic",
        thumbnailFile: "dialog.webp",
      },
    ],
  },
  {
    title: "States & Feedback",
    items: [
      {
        title: "Loading",
        description: "Skeleton、ProgressBar/Circle/Overlay、Button/Combobox の loading パターン",
        to: "/template/states/loading",
        previewKind: "loading",
      },
      {
        title: "Error",
        description: "API 取得失敗、フォームバリデーション、送信エラー、Dialog エラー、ErrorBoundary",
        to: "/template/states/error",
        previewKind: "error",
      },
      {
        title: "Empty",
        description: "EmptyState の全サイズ・全コンテキストパターン集",
        to: "/template/states/empty",
        previewKind: "empty",
      },
      {
        title: "Feedback",
        description: "Snackbar パターン、Disabled + Popover 理由説明",
        to: "/template/states/feedback",
        previewKind: "feedback",
      },
    ],
  },
  {
    title: "LegalOn",
    items: [
      {
        title: "Dashboard",
        description: "LegalOnのダッシュボードUIテンプレート",
        to: "/template/dashboard",
        previewKind: "dashboard",
        thumbnailFile: "dashboard.webp",
      },
      {
        title: "Cross Search",
        description: "横断検索（条文・案件・契約書・ひな形などの全文検索）",
        to: "/template/loc/search",
        previewKind: "list",
        thumbnailFile: "loc-search.webp",
      },
      {
        title: "Case Reception Form",
        description: "案件受付フォームのUIサンプル",
        to: "/template/case-reception-form",
        previewKind: "form",
        thumbnailFile: "case-reception-form.webp",
      },
      {
        title: "Error Page",
        description: "NotFound / ServerError / Maintenance のUIを確認できます。",
        to: "/template/root",
        previewKind: "error",
        thumbnailFile: "root.webp",
      },
      {
        title: "E-Sign Template",
        description: "署名依頼作成UIを再現したテンプレート",
        to: "/template/esign",
        previewKind: "form",
        thumbnailFile: "esign.webp",
      },
      {
        title: "E-Sign Envelope List",
        description: "電子契約一覧（署名依頼タブ）のUIテンプレート",
        to: "/template/esign/envelope-list",
        previewKind: "list",
        thumbnailFile: "esign-envelope-list.webp",
      },
      {
        title: "Legalon Template",
        description: "LegalOnひな形は、法務業務を効率化するためのテンプレート集です。",
        to: "/template/legalon-template",
        previewKind: "list",
        thumbnailFile: "legalon-template.webp",
      },
      {
        title: "Legalon Template Detail",
        description: "LegalOnひな形の詳細画面（PDFビューア + メタ情報ペイン）",
        to: "/template/legalon-template/tmpl1",
        previewKind: "detail",
      },
      {
        title: "LegalOn Matter List",
        description: "マターマネジメント案件一覧画面",
        to: "/template/loc/case",
        previewKind: "list",
        thumbnailFile: "loc-case.webp",
      },
      {
        title: "LegalOn Matter Detail",
        description: "マターマネジメント案件詳細画面",
        to: "/template/loc/case/detail",
        previewKind: "detail",
        thumbnailFile: "loc-case-detail.webp",
      },
      {
        title: "LegalOn Application Console",
        description: "案件ステータス設定画面",
        to: "/template/loc/application-console",
        previewKind: "settings",
        thumbnailFile: "loc-application-console.webp",
      },
      {
        title: "LegalOn Application Console (Contract Management)",
        description: "契約カスタム項目・管理番号・期限通知・電子契約サービス連携の設定画面",
        to: "/template/loc/application-console/contract-management/custom-attribute-definition",
        previewKind: "settings",
      },
      {
        title: "LegalOn Application Console (Sign)",
        description: "差出人企業名・署名依頼の保存先・承認申請フォームの設定画面",
        to: "/template/loc/application-console/sign/sender-name",
        previewKind: "settings",
      },
      {
        title: "Customer Template",
        description: "自社ひな形の一覧管理画面",
        to: "/template/file-management/customer-template",
        previewKind: "list",
      },
      {
        title: "Word Addin Review",
        description: "Word アドインのレビューパネル UI",
        to: "/template/loc/word-addin",
        previewKind: "detail",
        thumbnailFile: "loc-word-addin.webp",
      },
      {
        title: "Word Addin Standalone",
        description: "Word アドイン スタンドアロン版タスクペイン UI",
        to: "/template/loc/word-addin-standalone",
        previewKind: "detail",
        thumbnailFile: "loc-word-addin-standalone.webp",
      },
      {
        title: "Contract Review",
        description: "契約リスクチェック画面（PDFビューア + プレイブックパネル）",
        to: "/template/loc/review",
        previewKind: "detail",
        thumbnailFile: "loc-review.webp",
      },
      {
        title: "Manual Correction",
        description: "手動補正ツールの契約書一覧画面（検索フォーム + テーブル）",
        to: "/template/loc/manual-correction",
        previewKind: "list",
      },
      {
        title: "Manual Correction Detail",
        description: "手動補正ツールの契約書詳細画面（PDFビューア + アノテーション確認/編集ペイン）",
        to: "/template/loc/manual-correction/detail",
        previewKind: "detail",
      },
      {
        title: "LegalOn Assistant",
        description: "AIアシスタントとの会話UI（LOA Conversation）",
        to: "/template/loc/loa",
        previewKind: "chat",
        thumbnailFile: "loc-loa.webp",
      },
      {
        title: "Review Console",
        description: "LegalOn アラート設定 / プレイブック管理",
        to: "/template/loc/review-console",
        previewKind: "settings",
        thumbnailFile: "loc-review-console.webp",
      },
      {
        title: "File Management",
        description: "契約書管理（一覧・詳細画面）",
        to: "/template/file-management",
        previewKind: "list",
        thumbnailFile: "file-management.webp",
      },
      {
        title: "Management Console",
        description: "ライセンス使用状況とテナント情報を管理する画面",
        to: "/template/management-console",
        previewKind: "dashboard",
        thumbnailFile: "management-console.webp",
      },
      {
        title: "Personal Setting",
        description: "個人設定画面（プロフィール、通知設定、外部連携）",
        to: "/template/personal-setting",
        previewKind: "settings",
        thumbnailFile: "personal-setting.webp",
      },
      {
        title: "Setting Page",
        description: "設定ページテンプレート（各種セクションとgapの実装例）",
        to: "/template/setting-page",
        previewKind: "settings",
        thumbnailFile: "setting-page.webp",
      },
    ],
  },
  {
    title: "WorkOn",
    items: [
      {
        title: "Employee Registration",
        description: "従業員登録ページ",
        to: "/template/workon/employee-registration",
        previewKind: "form",
        thumbnailFile: "employee-registration.webp",
      },
      {
        title: "Procedure",
        description: "手続きページ",
        to: "/template/workon/procedure",
        previewKind: "list",
        thumbnailFile: "procedure.webp",
      },
      {
        title: "Setting",
        description: "設定ページ（招待、アカウント、権限管理）",
        to: "/template/workon/setting",
        previewKind: "settings",
        thumbnailFile: "workon-setting.webp",
      },
      {
        title: "Profile",
        description: "プロフィールページ",
        to: "/template/workon/profile",
        previewKind: "detail",
        thumbnailFile: "workon-profile.webp",
      },
    ],
  },
  {
    title: "DealOn",
    items: [
      {
        title: "DealOn Layout",
        description: "DealOnレイアウトテンプレート（ダークHeader + サイドバー）",
        to: "/template/dealon/layout",
        previewKind: "pageLayout",
        thumbnailFile: "dealon-layout.webp",
      },
      {
        title: "DealOn Deal 一覧",
        description: "Deal 一覧画面（タブ、検索、DataTable、ページネーション）",
        to: "/template/dealon/deal-list",
        previewKind: "list",
        thumbnailFile: "deal-list.webp",
      },
      {
        title: "DealOn Deal 詳細",
        description: "Deal 詳細画面（9タブ: 基本情報、アラート、タスク等）",
        to: "/template/dealon/deal-detail",
        previewKind: "detail",
        thumbnailFile: "deal-detail.webp",
      },
      {
        title: "DealOn 個人設定",
        description: "個人設定画面（プロフィール、MFA、外部連携）",
        to: "/template/dealon/settings-profile",
        previewKind: "settings",
        thumbnailFile: "dealon-settings-profile.webp",
      },
      {
        title: "DealOn ユーザー管理",
        description: "ユーザー管理画面（ユーザー一覧テーブル、招待）",
        to: "/template/dealon/settings-users",
        previewKind: "list",
        thumbnailFile: "dealon-settings-users.webp",
      },
    ],
  },
] satisfies TemplateSection[];

const getRouteLabel = (item: TemplateItem) => item.to.replace("/template", "template");
const getPreviewSrc = (item: TemplateItem) =>
  item.thumbnailFile ? previewImages[`./thumbnails/${item.thumbnailFile}`] : undefined;

const PreviewFallback = ({ kind }: { kind: PreviewKind }) => {
  return (
    <div className={styles.previewFallback} data-kind={kind}>
      <div className={styles.previewChrome}>
        <div aria-hidden />
        <div aria-hidden />
        <div aria-hidden />
      </div>
      <div className={styles.previewCanvas}>
        <div className={styles.previewSidebar} />
        <div className={styles.previewMain}>
          <div className={styles.previewHero} />
          <div className={styles.previewTiles}>
            <div aria-hidden />
            <div aria-hidden />
            <div aria-hidden />
          </div>
          <div className={styles.previewRows}>
            <div aria-hidden />
            <div aria-hidden />
            <div aria-hidden />
            <div aria-hidden />
          </div>
        </div>
        <div className={styles.previewPane} />
      </div>
    </div>
  );
};

const TemplateCard = ({ item }: { item: TemplateItem }) => {
  const previewSrc = getPreviewSrc(item);

  return (
    <Card className={styles.templateCard} variant="outline" size="medium">
      <CardHeader>
        <CardLink asChild>
          <Link to={item.to} className={styles.titleLink}>
            <Text as="span" variant="title.xSmall">
              {item.title}
            </Text>
          </Link>
        </CardLink>
        <Text as="p" variant="body.small" color="subtle" className={styles.routeLabel}>
          {getRouteLabel(item)}
        </Text>
      </CardHeader>
      <CardBody className={styles.cardBody}>
        <Link to={item.to} className={styles.previewLink} aria-hidden tabIndex={-1}>
          <div className={styles.previewFrame}>
            {previewSrc ? (
              <img className={styles.previewImage} src={previewSrc} alt="" loading="lazy" />
            ) : (
              <PreviewFallback kind={item.previewKind} />
            )}
          </div>
        </Link>
        <Text as="p" variant="body.small" className={styles.description}>
          {item.description}
        </Text>
      </CardBody>
    </Card>
  );
};

const sectionLabels = ["All", ...templateSections.map((s) => s.title)];

const Template = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  const isFiltering = searchQuery.trim() !== "" || activeSectionIndex !== 0;

  const filteredSections = useMemo(() => {
    const sections = activeSectionIndex === 0 ? templateSections : [templateSections[activeSectionIndex - 1]];

    const query = searchQuery.trim().toLowerCase();
    if (!query) return sections;

    return sections
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.to.toLowerCase().includes(query),
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [searchQuery, activeSectionIndex]);

  const totalFilteredCount = filteredSections.reduce((sum, s) => sum + s.items.length, 0);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchClear = () => {
    setSearchQuery("");
  };

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>Templates</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div className={styles.pageIntro}>
            <Text as="p" variant="body.medium">
              プロトタイプ開発の参考となるレイアウト・画面パターンのテンプレート集です。
            </Text>
          </div>

          <div className={styles.filterToolbar}>
            <SegmentedControl index={activeSectionIndex} onChange={setActiveSectionIndex} size="xSmall">
              {sectionLabels.map((label) => (
                <SegmentedControl.Button key={label}>{label}</SegmentedControl.Button>
              ))}
            </SegmentedControl>
            <div className={styles.searchWrapper}>
              <Search
                value={searchQuery}
                onChange={handleSearchChange}
                onClear={handleSearchClear}
                clearable
                shrinkOnBlur
                placeholder="テンプレートを検索..."
                size="medium"
              />
            </div>
          </div>

          {isFiltering && (
            <div className={styles.resultCount}>
              <Text as="p" variant="body.small" color="subtle">
                {totalFilteredCount} 件のテンプレート
              </Text>
            </div>
          )}

          {filteredSections.length > 0 ? (
            filteredSections.map((section) => (
              <section key={section.title} className={styles.section}>
                <div className={styles.sectionHeader}>
                  <Text as="h2" variant="title.small">
                    {section.title}
                  </Text>
                  <Text as="p" variant="body.small" color="subtle">
                    {section.items.length} previews
                  </Text>
                </div>
                <div className={styles.cardGrid}>
                  {section.items.map((item) => (
                    <TemplateCard key={item.to} item={item} />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className={styles.emptyResults}>
              <EmptyState size="medium" title="該当するテンプレートが見つかりません">
                <Text as="p" variant="body.small" color="subtle">
                  検索条件を変更してください
                </Text>
              </EmptyState>
            </div>
          )}

          <AegisLink asChild>
            <Link to="/">← Back to Home</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};

export default Template;
