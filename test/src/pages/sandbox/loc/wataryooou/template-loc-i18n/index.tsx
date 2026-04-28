import {
  Link as AegisLink,
  Card,
  CardBody,
  CardHeader,
  CardLink,
  ContentHeader,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";
import type { TranslationDictionary } from "../../../../../hooks";
import { useTranslation } from "../../../../../hooks";

type TranslationKey =
  | "pageTitle"
  | "pageDescription"
  | "dashboard"
  | "dashboardDesc"
  | "case"
  | "caseDesc"
  | "caseReceptionForm"
  | "caseReceptionFormDesc"
  | "review"
  | "reviewDesc"
  | "root"
  | "rootDesc"
  | "backToWataryooou";

const translations: TranslationDictionary<TranslationKey> = {
  "en-US": {
    pageTitle: "Template LOC (i18n)",
    pageDescription:
      "Internationalized version of template/loc pages. Use the locale switcher in Settings > Tools > Provider locale to switch languages.",
    dashboard: "Dashboard",
    dashboardDesc: "Home page with summary, shortcuts, and assistant",
    case: "Cases",
    caseDesc: "Case list with filter and table",
    caseReceptionForm: "Case Reception Form",
    caseReceptionFormDesc: "File upload request form",
    review: "Review",
    reviewDesc: "Contract risk check with playbook",
    root: "Error Pages",
    rootDesc: "Not Found, Server Error, Maintenance pages",
    backToWataryooou: "← Back to wataryooou",
  },
  "ja-JP": {
    pageTitle: "Template LOC (i18n)",
    pageDescription: "template/loc ページの多言語化版です。設定 > Tools > Provider locale から言語を切り替えできます。",
    dashboard: "ダッシュボード",
    dashboardDesc: "サマリー、ショートカット、アシスタントを含むホームページ",
    case: "案件",
    caseDesc: "フィルターとテーブル付きの案件一覧",
    caseReceptionForm: "案件受付フォーム",
    caseReceptionFormDesc: "ファイルアップロード依頼フォーム",
    review: "レビュー",
    reviewDesc: "プレイブック付きの契約リスクチェック",
    root: "エラーページ",
    rootDesc: "Not Found、Server Error、Maintenance ページ",
    backToWataryooou: "← wataryooou に戻る",
  },
};

const basePath = "/sandbox/loc/wataryooou/template-loc-i18n";

const pages = [
  { path: "dashboard", titleKey: "dashboard" as TranslationKey, descKey: "dashboardDesc" as TranslationKey },
  { path: "case", titleKey: "case" as TranslationKey, descKey: "caseDesc" as TranslationKey },
  {
    path: "case-reception-form",
    titleKey: "caseReceptionForm" as TranslationKey,
    descKey: "caseReceptionFormDesc" as TranslationKey,
  },
  { path: "review", titleKey: "review" as TranslationKey, descKey: "reviewDesc" as TranslationKey },
  { path: "root", titleKey: "root" as TranslationKey, descKey: "rootDesc" as TranslationKey },
];

export const TemplateLandingPage = () => {
  const { t } = useTranslation<TranslationKey>(translations);

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>{t("pageTitle")}</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            {t("pageDescription")}
          </Text>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(var(--aegis-layout-width-x5Small), 1fr))",
              gap: "var(--aegis-space-medium)",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            {pages.map((page) => (
              <Card key={page.path}>
                <CardHeader>
                  <CardLink asChild>
                    <Link to={`${basePath}/${page.path}`}>
                      <Text variant="title.xSmall">{t(page.titleKey)}</Text>
                    </Link>
                  </CardLink>
                </CardHeader>
                <CardBody>
                  <Text variant="body.small">{t(page.descKey)}</Text>
                </CardBody>
              </Card>
            ))}
          </div>

          <AegisLink asChild>
            <Link to="/sandbox/loc/wataryooou">{t("backToWataryooou")}</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};

export default TemplateLandingPage;
