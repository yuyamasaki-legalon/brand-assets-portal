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

export function DealOnSandbox() {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>DealOn Sandbox</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" style={{ marginBottom: "var(--aegis-space-large)" }}>
            DealOn の実験用エリアです。
          </Text>

          <Text as="h2" variant="title.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            ユーザー環境
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
                  <Link to="/sandbox/dealon/wataryooou">
                    <Text variant="title.xSmall">wataryooou</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">wataryooou の実験ページ</Text>
              </CardBody>
            </Card>
          </div>

          <AegisLink asChild>
            <Link to="/sandbox">← Back to Sandbox</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
}
