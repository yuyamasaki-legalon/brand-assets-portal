import {
  Link as AegisLink,
  Card,
  CardBody,
  CardHeader,
  CardLink,
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderTitle,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";

const pages = [
  {
    title: "Fetch Error",
    description: "API 取得失敗 + リトライ + Banner エラー",
    to: "/template/states/error/fetch",
  },
  {
    title: "Form Validation",
    description: "インラインバリデーション + 必須チェック + サマリー Banner",
    to: "/template/states/error/validation",
  },
  {
    title: "Form Submission",
    description: "送信エラー + 確認画面 + 状態遷移（input → confirm → success）",
    to: "/template/states/error/submission",
  },
  {
    title: "Dialog Error",
    description: "Dialog 内のフォーム送信エラー + Banner 表示",
    to: "/template/states/error/dialog",
  },
  {
    title: "ErrorBoundary Demo",
    description: "ErrorBoundary + Suspense 構成デモ",
    to: "/template/states/error/boundary",
  },
];

export default function ErrorIndex() {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>Error Patterns</ContentHeaderTitle>
            <ContentHeaderDescription>エラー状態のテンプレート集</ContentHeaderDescription>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(var(--aegis-layout-width-x5Small), 1fr))",
              gap: "var(--aegis-space-medium)",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            {pages.map((item) => (
              <Card key={item.title}>
                <CardHeader>
                  <CardLink asChild>
                    <Link to={item.to}>
                      <Text variant="title.xSmall">{item.title}</Text>
                    </Link>
                  </CardLink>
                </CardHeader>
                <CardBody>
                  <Text variant="body.small">{item.description}</Text>
                </CardBody>
              </Card>
            ))}
          </div>

          <AegisLink asChild>
            <Link to="/template/states">← Back to States</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
}
