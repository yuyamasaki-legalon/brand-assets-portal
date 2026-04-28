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

export default function UserJunaKondoSandbox() {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>juna-kondo の Sandbox</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            juna-kondo の実験的な機能やプロトタイプを試す場所です。自由にページを追加してください。
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
                  作成先の選択で「ユーザー環境」を選び、juna-kondo を選択してください。
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
                  <Link to="/sandbox/juna-kondo/my-first-page">
                    <Text variant="title.xSmall">My First Page</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">最初のSandboxページ</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/juna-kondo/signature-request-detail">
                    <Text variant="title.xSmall">Signature Request Detail</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">署名依頼詳細ページの再現</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/juna-kondo/new-page">
                    <Text variant="title.xSmall">New Page</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">新しいSandboxページ</Text>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/juna-kondo/contract-detail">
                    <Text variant="title.xSmall">Contract Detail</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">契約書詳細画面のプロトタイプ</Text>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/juna-kondo/contract-list-ui-improvement">
                    <Text variant="title.xSmall">契約書一覧UI改善 - AI creation</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">締結版契約書画面のプロトタイプ</Text>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/juna-kondo/case-detail-refresh">
                    <Text variant="title.xSmall">案件詳細ページの刷新</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">案件詳細画面の刷新版プロトタイプ</Text>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/juna-kondo/loc-case-detail">
                    <Text variant="title.xSmall">メッセージ公開・非公開設定 Message visibility control</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">メッセージの公開・非公開設定の実験用サンドボックス</Text>
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
