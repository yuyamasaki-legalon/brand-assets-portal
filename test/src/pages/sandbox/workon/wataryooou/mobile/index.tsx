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

export function MobilePage() {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Mobile</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            モバイル実験ページです。
          </Text>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(var(--aegis-layout-width-x5Small), 1fr))",
              gap: "var(--aegis-space-medium)",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/workon/wataryooou/mobile/login?scale=small">
                    <Text variant="title.xSmall">ログイン</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">ユーザーログイン画面</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/workon/wataryooou/mobile/attendance?scale=small">
                    <Text variant="title.xSmall">勤怠打刻</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">勤怠打刻画面</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/workon/wataryooou/mobile/edit-attendance?scale=small">
                    <Text variant="title.xSmall">勤怠編集</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">勤怠編集画面</Text>
              </CardBody>
            </Card>
          </div>

          <AegisLink asChild>
            <Link to="/sandbox/workon/wataryooou">← Back to wataryooou</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
}
