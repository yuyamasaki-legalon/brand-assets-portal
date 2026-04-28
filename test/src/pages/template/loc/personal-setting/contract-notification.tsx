import {
  ContentHeader,
  ContentHeaderTitle,
  NavList,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
} from "@legalforce/aegis-react";
import { LocSidebarLayout } from "../_shared";

// Shared Navigation Component
const SettingsNavigation = () => {
  return (
    <NavList>
      <NavList.Group title="一般">
        <NavList.Item href="/template/personal-setting/profile">プロフィール</NavList.Item>
      </NavList.Group>

      <NavList.Group title="マターマネジメント">
        <NavList.Item href="/template/personal-setting/legal-notification">通知</NavList.Item>
        <NavList.Item href="/template/personal-setting/legalscape">Legalscape連携</NavList.Item>
      </NavList.Group>

      <NavList.Group title="コントラクトマネジメント">
        <NavList.Item href="/template/personal-setting/contract-notification" aria-current="page">
          通知
        </NavList.Item>
      </NavList.Group>
    </NavList>
  );
};

// Main Contract Notification Page Component
export const ContractNotificationPage = () => {
  return (
    <LocSidebarLayout activeId="others">
      <PageLayout>
        {/* Left Sidebar Navigation */}
        <PageLayoutPane position="start" open={true}>
          <PageLayoutHeader>
            <ContentHeader>
              <ContentHeaderTitle>個人設定</ContentHeaderTitle>
            </ContentHeader>
          </PageLayoutHeader>
          <PageLayoutBody>
            <SettingsNavigation />
          </PageLayoutBody>
        </PageLayoutPane>

        {/* Main Content */}
        <PageLayoutContent align="start" maxWidth="medium">
          <PageLayoutHeader>
            <ContentHeader>
              <ContentHeaderTitle>コントラクトマネジメント通知設定</ContentHeaderTitle>
            </ContentHeader>
          </PageLayoutHeader>
          <PageLayoutBody>{/* Blank page - no content */}</PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>
    </LocSidebarLayout>
  );
};
