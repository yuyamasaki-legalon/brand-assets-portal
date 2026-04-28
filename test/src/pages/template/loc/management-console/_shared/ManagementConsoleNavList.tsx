import {
  ContentHeader,
  ContentHeaderTitle,
  NavList,
  PageLayoutBody,
  PageLayoutHeader,
  PageLayoutPane,
} from "@legalforce/aegis-react";

type ActivePage =
  | "license"
  | "matter-management"
  | "contract-management"
  | "users"
  | "user-groups"
  | "workspaces"
  | "departments"
  | "audit-logs"
  | "mfa"
  | "sso"
  | "slack"
  | "teams"
  | "company-info"
  | "api-integration";

interface ManagementConsoleNavListProps {
  activePage: ActivePage;
}

/** management-console 配下の全ページで共有するサイドバーナビゲーション。 */
export const ManagementConsoleNavList = ({ activePage }: ManagementConsoleNavListProps) => {
  return (
    <PageLayoutPane position="start" open={true}>
      <PageLayoutHeader>
        <ContentHeader size="medium">
          <ContentHeaderTitle>管理者設定</ContentHeaderTitle>
        </ContentHeader>
      </PageLayoutHeader>
      <PageLayoutBody>
        <NavList>
          <NavList.Group title="組織">
            <NavList.Item
              href="/template/management-console"
              aria-current={activePage === "license" ? "page" : undefined}
            >
              ライセンス
            </NavList.Item>
            <NavList.Item
              href="/template/management-console/users"
              aria-current={activePage === "users" ? "page" : undefined}
            >
              ユーザー
            </NavList.Item>
            <NavList.Item
              href="/template/management-console/user-groups"
              aria-current={activePage === "user-groups" ? "page" : undefined}
            >
              ユーザーグループ
            </NavList.Item>
            <NavList.Item
              href="/template/management-console/spaces"
              aria-current={activePage === "workspaces" ? "page" : undefined}
            >
              ワークスペース
            </NavList.Item>
            <NavList.Item
              href="/template/management-console/company-info"
              aria-current={activePage === "company-info" ? "page" : undefined}
            >
              自社情報
            </NavList.Item>
            <NavList.Item
              href="/template/management-console/departments"
              aria-current={activePage === "departments" ? "page" : undefined}
            >
              部署
            </NavList.Item>
            <NavList.Item
              href="/template/management-console/audit-logs"
              aria-current={activePage === "audit-logs" ? "page" : undefined}
            >
              監査ログ
            </NavList.Item>
          </NavList.Group>

          <NavList.Group title="モジュール">
            <NavList.Item aria-current={activePage === "matter-management" ? "page" : undefined}>
              マターマネジメント
            </NavList.Item>
            <NavList.Item aria-current={activePage === "contract-management" ? "page" : undefined}>
              コントラクトマネジメント
            </NavList.Item>
          </NavList.Group>

          <NavList.Group title="外部連携">
            <NavList.Item
              href="/template/management-console/slack"
              aria-current={activePage === "slack" ? "page" : undefined}
            >
              Slack
            </NavList.Item>
            <NavList.Item
              href="/template/management-console/teams"
              aria-current={activePage === "teams" ? "page" : undefined}
            >
              Microsoft Teams
            </NavList.Item>
          </NavList.Group>

          <NavList.Group title="セキュリティ">
            <NavList.Item
              href="/template/management-console/sso"
              aria-current={activePage === "sso" ? "page" : undefined}
            >
              SSO設定
            </NavList.Item>
            <NavList.Item
              href="/template/management-console/mfa"
              aria-current={activePage === "mfa" ? "page" : undefined}
            >
              多要素認証
            </NavList.Item>
          </NavList.Group>
        </NavList>
      </PageLayoutBody>
    </PageLayoutPane>
  );
};
