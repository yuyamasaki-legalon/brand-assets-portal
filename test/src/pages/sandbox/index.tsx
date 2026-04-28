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

export const Sandbox = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Sandbox</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            実験的な機能やプロトタイプを試す場所です。自由にページを追加してください。
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
                  新しいSandboxページを作成するには、以下のコマンドを実行してください：
                </Text>

                <Text
                  as="p"
                  variant="label.small"
                  style={{ marginTop: "var(--aegis-space-medium)", marginBottom: "var(--aegis-space-xSmall)" }}
                >
                  ユーザー環境にページを作成（推奨）
                </Text>
                <Code
                  style={{
                    display: "block",
                    marginBottom: "var(--aegis-space-small)",
                  }}
                >
                  pnpm run sandbox:create-user
                </Code>
                <Text
                  as="p"
                  variant="body.small"
                  style={{ marginBottom: "var(--aegis-space-xSmall)", color: "var(--aegis-color-text-subtle)" }}
                >
                  ユーザー名を指定して、個人専用の環境でページを作成します。コンフリクトを防ぎ、管理しやすくなります。
                </Text>

                <Text
                  as="p"
                  variant="label.small"
                  style={{ marginTop: "var(--aegis-space-medium)", marginBottom: "var(--aegis-space-xSmall)" }}
                >
                  共有ページを作成
                </Text>
                <Code
                  style={{
                    display: "block",
                    marginBottom: "var(--aegis-space-medium)",
                  }}
                >
                  pnpm run sandbox:create
                </Code>
                <Text
                  as="p"
                  variant="body.small"
                  style={{ marginBottom: "var(--aegis-space-xSmall)", color: "var(--aegis-color-text-subtle)" }}
                >
                  従来の共有Sandboxページを作成します。
                </Text>

                <Text
                  as="p"
                  variant="body.small"
                  style={{ marginTop: "var(--aegis-space-medium)", marginBottom: "var(--aegis-space-xSmall)" }}
                >
                  対話形式で以下を選択できます：
                </Text>
                <ul
                  style={{
                    marginLeft: "var(--aegis-space-medium)",
                    marginBottom: "var(--aegis-space-small)",
                  }}
                >
                  <li>
                    <Text variant="body.small">ユーザー名（create-user のみ）</Text>
                  </li>
                  <li>
                    <Text variant="body.small">ページ名</Text>
                  </li>
                  <li>
                    <Text variant="body.small">説明</Text>
                  </li>
                  <li>
                    <Text variant="body.small">PageLayoutテンプレート（7種類）</Text>
                  </li>
                  <li>
                    <Text variant="body.small">日付サフィックスの有無</Text>
                  </li>
                </ul>
                <Text
                  as="p"
                  variant="body.small"
                  style={{
                    color: "var(--aegis-color-text-subtle)",
                  }}
                >
                  ファイル生成、ルート追加、カード追加がすべて自動で行われます。
                </Text>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

          <Text as="h2" variant="title.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            プロダクト別
          </Text>
          <Text
            as="p"
            variant="body.small"
            style={{ marginBottom: "var(--aegis-space-medium)", color: "var(--aegis-color-text-subtle)" }}
          >
            各プロダクトのテーマが適用されるSandbox環境です。
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
                  <Link to="/sandbox/loc">
                    <Text variant="title.xSmall">LegalOn</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">LegalOn の実験用エリア</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/workon">
                    <Text variant="title.xSmall">WorkOn</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">WorkOn の実験用エリア</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/dealon">
                    <Text variant="title.xSmall">DealOn</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">DealOn の実験用エリア</Text>
              </CardBody>
            </Card>
          </div>

          <Text as="h2" variant="title.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            ユーザー環境
          </Text>
          <Text
            as="p"
            variant="body.small"
            style={{ marginBottom: "var(--aegis-space-medium)", color: "var(--aegis-color-text-subtle)" }}
          >
            各開発者専用のSandbox環境です。
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
                  <Link to="/sandbox/wataryooou">
                    <Text variant="title.xSmall">wataryooou</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">wataryooou の実験ページ</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/user1">
                    <Text variant="title.xSmall">user1</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">user1 の実験ページ</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/user2">
                    <Text variant="title.xSmall">user2</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">user2 の実験ページ</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/chie">
                    <Text variant="title.xSmall">chie</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">chie の実験ページ</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/nomura">
                    <Text variant="title.xSmall">nomura</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">nomura の実験ページ</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/jy">
                    <Text variant="title.xSmall">jy</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">jy の実験ページ</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/ichibasan">
                    <Text variant="title.xSmall">ichibasan</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">ichibasan の実験ページ</Text>
              </CardBody>
            </Card>
          </div>

          <Text as="h2" variant="title.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
            共有ページ
          </Text>
          <Text
            as="p"
            variant="body.small"
            style={{ marginBottom: "var(--aegis-space-medium)", color: "var(--aegis-color-text-subtle)" }}
          >
            既存の共有Sandboxページです。
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
                  <Link to="/sandbox/case-list-paging">
                    <Text variant="title.xSmall">case-list-paging</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">Copied from template</Text>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/analytics">
                    <Text variant="title.xSmall">analytics</Text>
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
                  <Link to="/sandbox/case-detail-linked-files">
                    <Text variant="title.xSmall">Case Detail Linked Files</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">案件詳細画面からリンク済みファイルにアクセスしやすくする改善版</Text>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/brand-asset-portal">
                    <Text variant="title.xSmall">Brand Asset Portal</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">ブランドアセット検索ポータルの再構築版</Text>
              </CardBody>
            </Card>
          </div>

          <AegisLink asChild>
            <Link to="/">← Back to Home</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
