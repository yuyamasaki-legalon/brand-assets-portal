import {
  Card,
  CardBody,
  CardHeader,
  CardLink,
  ContentHeader,
  ContentHeaderTitle,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";

export const PersonalSettingIndex = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>Personal Setting Templates</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            個人設定に関する4つのページテンプレートです。
          </Text>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(var(--aegis-layout-width-x5Small), 1fr))",
              gap: "var(--aegis-space-medium)",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/template/personal-setting/profile">
                    <Text variant="title.xSmall">Profile</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">
                  ユーザープロフィール設定ページ。基本情報の編集、言語・タイムゾーン設定、組織情報の表示
                </Text>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/template/personal-setting/contract-notification">
                    <Text variant="title.xSmall">Contract Notification</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">
                  コントラクトマネジメントの通知設定ページ。期限通知の有効/無効と通知期間の設定
                </Text>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/template/personal-setting/legal-notification">
                    <Text variant="title.xSmall">Legal Notification</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">
                  法務マネジメントの通知設定ページ。案件作成、担当者割当、メンション等の通知設定
                </Text>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/template/personal-setting/legalscape">
                    <Text variant="title.xSmall">Legalscape Integration</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">Legalscape連携設定ページ。外部サービスとの連携を有効化/無効化</Text>
              </CardBody>
            </Card>
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
