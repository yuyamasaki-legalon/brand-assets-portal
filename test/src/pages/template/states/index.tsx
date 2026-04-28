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

const categories = [
  {
    title: "Loading",
    description: "Skeleton、ProgressBar/Circle/Overlay、Button/Combobox の loading パターン",
    to: "/template/states/loading",
  },
  {
    title: "Error",
    description: "API 取得失敗、フォームバリデーション、送信エラー、Dialog エラー、ErrorBoundary",
    to: "/template/states/error",
  },
  {
    title: "Empty",
    description: "EmptyState の全サイズ・全コンテキストパターン集",
    to: "/template/states/empty",
  },
  {
    title: "Feedback",
    description: "Snackbar パターン、Disabled + Popover 理由説明",
    to: "/template/states/feedback",
  },
];

export default function StatesIndex() {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>States &amp; Feedback</ContentHeaderTitle>
            <ContentHeaderDescription>
              ローディング・エラー・空状態・フィードバックのテンプレート集
            </ContentHeaderDescription>
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
            {categories.map((item) => (
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
            <Link to="/template">← Back to Templates</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
}
