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
  Tag,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";
import { getSandboxDocStatus } from "../../../../hooks";

const pages = [
  { path: "template-loc-i18n", title: "Template LOC (i18n)", description: "多言語化対応テンプレート一覧" },
  { path: "application-console", title: "application-console", description: "案件ステータスの完了項目カスタム機能" },
  { path: "case-detail", title: "case-detail", description: "案件詳細ページ（スタンプ機能付き）" },
  { path: "case-detail-stamp", title: "case-detail-stamp", description: "案件詳細ページ（並び替え可能なPane）" },
  { path: "case-detail-test", title: "case-detail-test", description: "案件詳細画面テスト（復元）" },
  { path: "case-claude", title: "case-claude", description: "案件一覧（Drawerで詳細表示）" },
  { path: "case-codex", title: "case-codex", description: "案件一覧 + Drawer 詳細ビュー" },
  { path: "case-codex-slack", title: "case-codex-slack", description: "案件一覧 + Drawer 詳細ビュー (Slack)" },
  { path: "case-devin", title: "case-devin", description: "案件一覧 + Drawer で詳細Pane表示" },
  { path: "menu-width-test", title: "menu-width-test", description: "Menu.Box の width prop が効くか検証" },
  { path: "rules", title: "rules", description: "LegalOn アラート ルール一覧" },
  { path: "datatable-simple", title: "datatable-simple", description: "DataTable シンプル一覧（全オプション OFF）" },
  { path: "word-addin", title: "word-addin", description: "Word Add-in タスクペイン UI サンプル" },
  { path: "ai-roleplay", title: "AIロープレ面接システム", description: "ロープレ関連画面のまとめ" },
  { path: "email-template", title: "メールテンプレート", description: "メールテンプレートの管理・CRUD機能" },
  {
    path: "matter-ball-status",
    title: "案件ボールステータス",
    description: "案件が事業部ボールか法務部ボールかを自動判別・表示",
  },
  {
    path: "datatable-drag-perf",
    title: "DataTable ドラッグ性能テスト",
    description: "カラムドラッグの性能を行数別に検証",
  },
  {
    path: "datatable-iconbutton",
    title: "DataTable IconButton",
    description: "DataTable + IconButton アクション列（width fit）",
  },
  {
    path: "case-self-assign-bulk",
    title: "案件担当化 A",
    description: "複数案件を選択して一括で自分の担当案件にする案",
  },
  {
    path: "case-self-assign-priority",
    title: "案件担当化 B",
    description: "優先度の高い候補を上から提示して即担当化する案",
  },
  {
    path: "case-self-assign-workload",
    title: "案件担当化 C",
    description: "候補キューと確認ダイアログで負荷を見てから担当化する案",
  },
  {
    path: "sidebar-drawer",
    title: "Sidebar + Drawer",
    description: "Sidebar と Drawer を組み合わせたレイアウトサンプル",
  },
] as const;

const basePath = "/sandbox/loc/wataryooou";

export function LocWataryooou() {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>LegalOn - wataryooou</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            wataryooou の LegalOn 向け実験ページです。
          </Text>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(var(--aegis-layout-width-x5Small), 1fr))",
              gap: "var(--aegis-space-medium)",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            {pages.map((page) => {
              const route = `${basePath}/${page.path}`;
              const { hasPrd, hasSpec } = getSandboxDocStatus(route);
              return (
                <Card key={page.path}>
                  <CardHeader>
                    <CardLink asChild>
                      <Link to={route}>
                        <Text variant="title.xSmall">{page.title}</Text>
                      </Link>
                    </CardLink>
                  </CardHeader>
                  <CardBody>
                    <Text variant="body.small">{page.description}</Text>
                    {(hasPrd || hasSpec) && (
                      <div
                        style={{
                          display: "flex",
                          gap: "var(--aegis-space-xxSmall)",
                          marginTop: "var(--aegis-space-xSmall)",
                        }}
                      >
                        {hasPrd && (
                          <Tag size="small" variant="outline" color="blue">
                            PRD
                          </Tag>
                        )}
                        {hasSpec && (
                          <Tag size="small" variant="outline" color="teal">
                            SPEC
                          </Tag>
                        )}
                      </div>
                    )}
                  </CardBody>
                </Card>
              );
            })}
          </div>

          <AegisLink asChild>
            <Link to="/sandbox/loc">← Back to LegalOn Sandbox</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
}
