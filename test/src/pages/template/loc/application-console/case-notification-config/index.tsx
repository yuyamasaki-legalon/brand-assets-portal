import { LfArrowUpRightFromSquare, LfQuestionCircle } from "@legalforce/aegis-icons";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Link,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutPane,
  Text,
} from "@legalforce/aegis-react";
import { LocSidebarLayout } from "../../_shared";
import { Navigation, NavigationHeader } from "../_shared";

// フォームセクションレイアウト
const FormSectionLayout = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--aegis-space-medium)",
      }}
    >
      <Text as="h2" variant="title.small">
        {title}
      </Text>
      {children}
    </div>
  );
};

const CaseNotificationConfigTemplate = () => {
  return (
    <LocSidebarLayout activeId="cases">
      <PageLayout>
        <PageLayoutPane>
          <PageLayoutHeader>
            <NavigationHeader />
          </PageLayoutHeader>
          <PageLayoutBody>
            <Navigation currentPage="case-notification-config" />
          </PageLayoutBody>
        </PageLayoutPane>
        <PageLayoutContent align="start" maxWidth="medium">
          <PageLayoutHeader>
            <Text as="h1" variant="title.large">
              依頼者へのメール通知
            </Text>
          </PageLayoutHeader>
          <PageLayoutBody>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--aegis-space-large)",
              }}
            >
              {/* リードテキスト */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-xSmall)",
                  paddingBlockEnd: "var(--aegis-space-medium)",
                }}
              >
                <Text as="p" variant="body.medium" whiteSpace="pre-wrap">
                  {
                    "メールやフォームで案件を受け付けたときに依頼者に送信するメール通知を、社内の運用に即した方法に変更できます。\n自分自身への通知は、"
                  }
                  <Link href="#">個人設定画面</Link>
                  {"で変更できます。"}
                </Text>
                <div>
                  <Link
                    href="#"
                    leading={LfQuestionCircle}
                    trailing={LfArrowUpRightFromSquare}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    案件受付時に依頼者に送信される通知の設定
                  </Link>
                </div>
              </div>

              {/* チェックボックスグループ */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--aegis-space-xxLarge)",
                }}
              >
                {/* フォームによる案件の依頼 */}
                <FormSectionLayout title="フォームによる案件の依頼">
                  <Text as="p" variant="body.medium">
                    フォーム送信時に、依頼者に案件を受け付けたことを通知します。この通知はオフにできません。
                  </Text>
                </FormSectionLayout>

                {/* メールによる案件の依頼 */}
                <FormSectionLayout title="メールによる案件の依頼">
                  <CheckboxGroup>
                    <Checkbox defaultChecked>案件の受付が成功し、案件が作成されたことを依頼者に通知する</Checkbox>
                    <Checkbox defaultChecked>案件の受付が失敗したことを依頼者に通知する</Checkbox>
                  </CheckboxGroup>
                </FormSectionLayout>

                {/* フォーム・メール共通 */}
                <FormSectionLayout title="フォーム・メール共通">
                  <Checkbox defaultChecked>案件に案件担当者が設定されたことを依頼者に通知する</Checkbox>
                </FormSectionLayout>

                {/* 保存ボタン */}
                <div>
                  <Button disabled>保存</Button>
                </div>
              </div>
            </div>
          </PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>
    </LocSidebarLayout>
  );
};

export default CaseNotificationConfigTemplate;
