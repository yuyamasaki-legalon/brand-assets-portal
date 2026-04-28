import {
  Banner,
  Button,
  Checkbox,
  CheckboxGroup,
  ContentHeader,
  ContentHeaderTitle,
  Divider,
  Form,
  NavList,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  snackbar,
  Text,
} from "@legalforce/aegis-react";
import { useState } from "react";
import { LocSidebarLayout } from "../_shared";
import { MOCK_LEGAL_NOTIFICATION, MOCK_USER_PROFILE } from "./mock/personalSettingData";

// Shared Navigation Component
const SettingsNavigation = () => {
  return (
    <NavList>
      <NavList.Group title="一般">
        <NavList.Item href="/template/personal-setting/profile">プロフィール</NavList.Item>
      </NavList.Group>

      <NavList.Group title="マターマネジメント">
        <NavList.Item href="/template/personal-setting/legal-notification" aria-current="page">
          通知
        </NavList.Item>
        <NavList.Item href="/template/personal-setting/legalscape">Legalscape連携</NavList.Item>
      </NavList.Group>

      <NavList.Group title="コントラクトマネジメント">
        <NavList.Item href="/template/personal-setting/contract-notification">通知</NavList.Item>
      </NavList.Group>
    </NavList>
  );
};

// Main Legal Notification Page Component
export const LegalNotificationPage = () => {
  const [caseCreated, setCaseCreated] = useState(MOCK_LEGAL_NOTIFICATION.caseCreated);
  const [becameMainAssignee, setBecameMainAssignee] = useState(MOCK_LEGAL_NOTIFICATION.becameMainAssignee);
  const [becameSubAssignee, setBecameSubAssignee] = useState(MOCK_LEGAL_NOTIFICATION.becameSubAssignee);
  const [mentioned, setMentioned] = useState(MOCK_LEGAL_NOTIFICATION.mentioned);

  const handleSave = () => {
    snackbar.show({ message: "通知設定を保存しました" });
  };

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
        <PageLayoutContent>
          <PageLayoutHeader>
            <ContentHeader>
              <ContentHeaderTitle>通知</ContentHeaderTitle>
            </ContentHeader>
          </PageLayoutHeader>
          <PageLayoutBody>
            <div
              style={{
                maxWidth: "var(--aegis-layout-width-medium)",
              }}
            >
              <Text>メール通知を {MOCK_USER_PROFILE.email} 宛に送信します。</Text>

              <Divider
                style={{
                  marginTop: "var(--aegis-space-large)",
                  marginBottom: "var(--aegis-space-large)",
                }}
              />

              <ContentHeader>
                <ContentHeaderTitle>通知のタイミング</ContentHeaderTitle>
              </ContentHeader>

              {/* loc-app: NotificationForm — Banner でエラー表示、Form でラップ */}
              <div style={{ marginTop: "var(--aegis-space-medium)" }}>
                {/* loc-app: submitError 時に Banner を表示 */}
                {false && (
                  <Banner color="danger" closeButton={false}>
                    <Text>通知設定の保存に失敗しました</Text>
                  </Banner>
                )}
                <Form>
                  <CheckboxGroup>
                    <Checkbox checked={caseCreated} onChange={(e) => setCaseCreated(e.target.checked)}>
                      案件が新規作成された
                    </Checkbox>

                    <Checkbox checked={becameMainAssignee} onChange={(e) => setBecameMainAssignee(e.target.checked)}>
                      あなたが案件担当者に割り当てられる
                    </Checkbox>

                    <Checkbox checked={becameSubAssignee} onChange={(e) => setBecameSubAssignee(e.target.checked)}>
                      あなたが副担当者に割り当てられる
                    </Checkbox>

                    <Checkbox checked={mentioned} onChange={(e) => setMentioned(e.target.checked)}>
                      あなたがメッセージ内でメンションされる
                    </Checkbox>
                  </CheckboxGroup>
                  <Button onClick={handleSave} disabled>
                    保存
                  </Button>
                </Form>
              </div>
            </div>
          </PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>
    </LocSidebarLayout>
  );
};
