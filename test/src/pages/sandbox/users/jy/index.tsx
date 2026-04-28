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

export default function UserJySandbox() {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>jy の Sandbox</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            jy の実験的な機能やプロトタイプを試す場所です。自由にページを追加してください。
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
                  pnpm run sandbox:create
                </Code>
                <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
                  作成先の選択で「ユーザー環境」を選び、jy を選択してください。
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
            {" "}
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/jy/ai-chat">
                    <Text variant="title.xSmall">AI Chat</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">Sandbox experimental page</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/jy/ai-chat-home">
                    <Text variant="title.xSmall">AI Chat Home</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">Sandbox experimental page</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/jy/home">
                    <Text variant="title.xSmall">home</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">Sandbox experimental page</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/jy/attendance-auto-input">
                    <Text variant="title.xSmall">Attendance Auto Input</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">Sandbox experimental page</Text>
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
