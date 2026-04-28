import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Link as AegisLink,
  Card,
  CardBody,
  CardHeader,
  CardLink,
  Code,
  ContentHeader,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";

export const UserTeradaSandbox = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>terada の Sandbox</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            terada の実験的な機能やプロトタイプを試す場所です。自由にページを追加してください。
          </Text>

          <Accordion style={{ marginBottom: "var(--aegis-space-large)" }}>
            <AccordionItem>
              <AccordionButton>
                <Text as="p" variant="label.medium">
                  コマンドの使い方
                </Text>
              </AccordionButton>
              <AccordionPanel>
                <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-small)" }}>
                  この環境に新しいページを作成するには、以下のコマンドを実行してください：
                </Text>
                <Code
                  style={{
                    display: "block",
                    marginBottom: "var(--aegis-space-medium)",
                  }}
                >
                  pnpm run sandbox:create-user
                </Code>
                <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
                  作成先の選択で「ユーザー環境」を選び、terada を選択してください。
                </Text>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

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
                  <Link to="/sandbox/loc/terada/file-management">
                    <Text variant="title.xSmall">File Management</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">契約書管理の実験ページ</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/loc/terada/api-example">
                    <Text variant="title.xSmall">API Example</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">API Server Example のデモページ</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/loc/terada/dashboard-english">
                    <Text variant="title.xSmall">Dashboard English</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">ダッシュボードの英語版プロトタイプ</Text>
              </CardBody>
            </Card>
          </div>

          <AegisLink asChild>
            <Link to="/sandbox/loc">← Back to LegalOn Sandbox</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
