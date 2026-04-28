import { LfFolder, LfMagnifyingGlass, LfSparkles } from "@legalforce/aegis-icons/react";
import { Box, ErrorCat1 } from "@legalforce/aegis-illustrations/react";
import {
  Link as AegisLink,
  Button,
  Card,
  CardBody,
  CardHeader,
  ContentHeader,
  ContentHeaderTitle,
  EmptyState,
  Icon,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";

export default function EmptyStatePatterns() {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>EmptyState Patterns</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div style={{ display: "grid", gap: "var(--aegis-space-large)" }}>
            {/* Large - Page level error */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">size=&quot;large&quot; — ページ全体（fetch error）</Text>
              </CardHeader>
              <CardBody>
                <div style={{ display: "grid", placeItems: "center", padding: "var(--aegis-space-large)" }}>
                  <EmptyState
                    size="large"
                    orientation="vertical"
                    visual={<ErrorCat1 />}
                    title={
                      <Text as="span" variant="title.small">
                        エラーが発生しました
                      </Text>
                    }
                    action={<Button minWidth="wide">再読み込み</Button>}
                  >
                    <Text as="span">サーバーで問題が発生しているためページを表示できません。</Text>
                  </EmptyState>
                </div>
              </CardBody>
            </Card>

            {/* Medium - List empty */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">size=&quot;medium&quot; — リスト（データなし）</Text>
              </CardHeader>
              <CardBody>
                <div style={{ display: "grid", placeItems: "center", padding: "var(--aegis-space-large)" }}>
                  <EmptyState
                    size="medium"
                    visual={<Box />}
                    title="案件がありません"
                    action={<Button variant="subtle">新規作成</Button>}
                  >
                    <Text variant="body.small">案件を作成して管理を始めましょう。</Text>
                  </EmptyState>
                </div>
              </CardBody>
            </Card>

            {/* Medium - Search no results */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">size=&quot;medium&quot; — 検索結果なし</Text>
              </CardHeader>
              <CardBody>
                <div style={{ display: "grid", placeItems: "center", padding: "var(--aegis-space-large)" }}>
                  <EmptyState
                    size="medium"
                    visual={
                      <Icon size="xLarge">
                        <LfMagnifyingGlass />
                      </Icon>
                    }
                    title="検索結果がありません"
                    action={<Button variant="subtle">フィルタをリセット</Button>}
                  >
                    <Text variant="body.small">検索条件を変更してお試しください。</Text>
                  </EmptyState>
                </div>
              </CardBody>
            </Card>

            {/* Small - Pane (AI summary) */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">size=&quot;small&quot; — ペイン（AI要約なし）</Text>
              </CardHeader>
              <CardBody>
                <div
                  style={{
                    display: "grid",
                    placeItems: "center",
                    padding: "var(--aegis-space-medium)",
                    maxWidth: "var(--aegis-layout-width-x4Small)",
                  }}
                >
                  <EmptyState
                    size="small"
                    visual={
                      <Icon>
                        <LfSparkles />
                      </Icon>
                    }
                    title="AI要約がありません"
                    action={
                      <Button variant="subtle" size="small">
                        生成
                      </Button>
                    }
                  >
                    <Text variant="body.small">AIで案件の要約を生成できます。</Text>
                  </EmptyState>
                </div>
              </CardBody>
            </Card>

            {/* Small - Combobox no results */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">size=&quot;small&quot; — Combobox（検索結果なし）</Text>
              </CardHeader>
              <CardBody>
                <div
                  style={{
                    display: "grid",
                    placeItems: "center",
                    padding: "var(--aegis-space-medium)",
                    maxWidth: "var(--aegis-layout-width-x4Small)",
                    backgroundColor: "var(--aegis-color-surface-neutral-xSubtle)",
                    borderRadius: "var(--aegis-radius-medium)",
                  }}
                >
                  <EmptyState size="small" title="該当する選択肢がありません">
                    <Text variant="body.small">別のキーワードで検索してください。</Text>
                  </EmptyState>
                </div>
              </CardBody>
            </Card>

            {/* Small - Popover/Drawer */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">size=&quot;small&quot; — Popover / Drawer</Text>
              </CardHeader>
              <CardBody>
                <div
                  style={{
                    display: "grid",
                    placeItems: "center",
                    padding: "var(--aegis-space-medium)",
                    maxWidth: "var(--aegis-layout-width-x4Small)",
                  }}
                >
                  <EmptyState
                    size="small"
                    visual={
                      <Icon>
                        <LfFolder />
                      </Icon>
                    }
                    title="参照文献がありません"
                  >
                    <Text variant="body.small">該当する文献が見つかりませんでした。</Text>
                  </EmptyState>
                </div>
              </CardBody>
            </Card>

            {/* Rules */}
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">使い分けルール</Text>
              </CardHeader>
              <CardBody>
                <div style={{ display: "grid", gap: "var(--aegis-space-small)" }}>
                  <Text variant="body.small">
                    <Text as="span" variant="body.small.bold">
                      large
                    </Text>
                    : ページ全体のエラー。illustration を使用
                  </Text>
                  <Text variant="body.small">
                    <Text as="span" variant="body.small.bold">
                      medium
                    </Text>
                    : リストやメインコンテンツの空状態。illustration または大きめ Icon を使用
                  </Text>
                  <Text variant="body.small" color="danger">
                    <Text as="span" variant="body.small.bold">
                      small
                    </Text>
                    : ペイン、Combobox、Popover 内。illustration 使用禁止（Icon のみ）
                  </Text>
                </div>
              </CardBody>
            </Card>
          </div>

          <div style={{ marginTop: "var(--aegis-space-xLarge)" }}>
            <AegisLink asChild>
              <Link to="/template/states/empty">← Back to Empty</Link>
            </AegisLink>
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
}
