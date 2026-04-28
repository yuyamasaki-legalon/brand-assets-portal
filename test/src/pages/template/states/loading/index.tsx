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
    title: "Skeleton Patterns",
    description: "リスト・詳細・フォーム・ヘッダーの Skeleton パターン集",
    to: "/template/states/loading/skeleton",
  },
  {
    title: "Progress Indicators",
    description: "ProgressBar / ProgressCircle / ProgressOverlay の使い分け",
    to: "/template/states/loading/progress",
  },
  {
    title: "Button & Combobox Loading",
    description: "Button loading 状態と Combobox loading 状態",
    to: "/template/states/loading/component",
  },
];

export default function LoadingIndex() {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>Loading Patterns</ContentHeaderTitle>
            <ContentHeaderDescription>ローディング状態のテンプレート集</ContentHeaderDescription>
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
