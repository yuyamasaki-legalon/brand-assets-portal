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

export const UserWataryooouSandbox = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>wataryooou の Sandbox</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            wataryooou の実験的な機能やプロトタイプを試す場所です。自由にページを追加してください。
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
                  作成先の選択で「ユーザー環境」を選び、wataryooou を選択してください。
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
                  <Link to="/sandbox/wataryooou/langgraph-chat-widget">
                    <Text variant="title.xSmall">langgraph-chat-widget</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">LangGraph を使った会話型デモ</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/wataryooou/case-detail">
                    <Text variant="title.xSmall">case-detail</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">案件詳細ページ（スタンプ機能付き）</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/wataryooou/case-detail-test">
                    <Text variant="title.xSmall">case-detail-test</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">案件詳細画面テスト（復元）</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/wataryooou/application-console">
                    <Text variant="title.xSmall">application-console</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">案件ステータスの完了項目カスタム機能</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/wataryooou/loc-case-detail">
                    <Text variant="title.xSmall">loc-case-detail</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">案件詳細ページ（並び替え可能なPane）</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/wataryooou/loc-case-claude">
                    <Text variant="title.xSmall">loc-case-claude</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">案件一覧（Drawerで詳細表示）</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/wataryooou/loc-case-codex">
                    <Text variant="title.xSmall">loc-case-codex</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">案件一覧 + Drawer 詳細ビュー</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/wataryooou/loc-case-codex-slack">
                    <Text variant="title.xSmall">loc-case-codex-slack</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">案件一覧 + Drawer 詳細ビュー (Slack)</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/wataryooou/loc-case-devin">
                    <Text variant="title.xSmall">loc-case-devin</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">案件一覧 + Drawer で詳細Pane表示</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/wataryooou/loc-contract-list-sticky">
                    <Text variant="title.xSmall">loc-contract-list-sticky</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">契約書一覧（Sticky Tab 下線の検証）</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/wataryooou/category-selection">
                    <Text variant="title.xSmall">category-selection</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">カテゴリー選択UIパターン（8種類）</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/wataryooou/snackbar-lint-test">
                    <Text variant="title.xSmall">snackbar-lint-test</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">Snackbar の text-linter テスト</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/wataryooou/invite">
                    <Text variant="title.xSmall">invite</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">従業員招待ページ（DataTable）</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/wataryooou/procedure">
                    <Text variant="title.xSmall">procedure</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">手続き一覧ページ（DataTable）</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/wataryooou/workspace-settings">
                    <Text variant="title.xSmall">workspace-settings</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">ワークスペース設定（通知とセキュリティ）</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/wataryooou/texture-masking-chat">
                    <Text variant="title.xSmall">texture-masking-chat</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">秘匿情報テクスチャマスキング チャットUI</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/wataryooou/ai-roleplay">
                    <Text variant="title.xSmall">ai-roleplay</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">AIロープレ面接システム一覧</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/wataryooou/popover-dialog">
                    <Text variant="title.xSmall">popover-dialog</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">Popover から Dialog を開くデモ</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/wataryooou/template-browser">
                    <Text variant="title.xSmall">template-browser</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">テンプレート一覧ブラウザ（設定画面レイアウト + ActionList）</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/updates">
                    <Text variant="title.xSmall">aegis-update</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">Aegis React リリースノート デモ</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/wataryooou/split-button-banner">
                    <Text variant="title.xSmall">split-button-banner</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">Banner + SplitButton パターン</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/wataryooou/pr-template-trends">
                    <Text variant="title.xSmall">pr-template-trends</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">PR テンプレート利用傾向分析（全219件）</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/wataryooou/loc-overview-map">
                    <Text variant="title.xSmall">LOC Overview Map</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">LegalOn の画面遷移フローを ReactFlow で俯瞰する Bird&apos;s Eye View</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/wataryooou/check-in">
                    <Text variant="title.xSmall">check-in</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">Chromatic examples/Page の CheckIn 画面を sandbox に再現</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/wataryooou/preview-url-guide">
                    <Text variant="title.xSmall">preview-url-guide</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">Preview URL プロジェクト固定 URL 機能の説明ページ</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/wataryooou/structural-tokens">
                    <Text variant="title.xSmall">structural-tokens</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">Spacing, Radius, Depth, Motion のデザイントークン一覧</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/wataryooou/about-aegis-lab">
                    <Text variant="title.xSmall">about-aegis-lab</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">aegis-lab の説明ページ</Text>
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
};
