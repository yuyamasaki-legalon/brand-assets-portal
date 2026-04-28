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
  Tag,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";

const features = [
  {
    name: "PageLayoutBleed",
    path: "/updates/aegis-releases/v2-39-0/pagelayout-bleed",
    description: "PageLayoutBody の inline padding を打ち消して、コンテンツを端まで広げる新コンポーネントのデモ",
    tag: "Design",
    tagColor: "blue" as const,
  },
  {
    name: "PageLayout compound API deprecated",
    path: "",
    description: "PageLayout.Header 等の compound API が deprecated に。従来の PageLayoutHeader 等のインポートを推奨",
    tag: "Design",
    tagColor: "blue" as const,
  },
  {
    name: "DataTable pin disabled",
    path: "/updates/aegis-releases/v2-39-0/datatable-unpin-fix",
    description: "pinnable: false のカラムでヘッダーメニューの pin ボタンが disabled になるバグ修正の確認",
    tag: "Bug Fix",
    tagColor: "teal" as const,
  },
];

export const AegisUpdateV2390 = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Aegis React v2.39.0</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            v2.39.0 で追加・修正された機能のデモページ一覧です。
          </Text>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(var(--aegis-layout-width-x5Small), 1fr))",
              gap: "var(--aegis-space-medium)",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            {features.map((f) => (
              <Card key={f.name}>
                <CardHeader
                  trailing={
                    <span style={{ flexShrink: 0 }}>
                      <Tag size="small" color={f.tagColor} variant="outline">
                        {f.tag}
                      </Tag>
                    </span>
                  }
                >
                  {f.path ? (
                    <CardLink asChild>
                      <Link to={f.path}>
                        <Text variant="title.xSmall">{f.name}</Text>
                      </Link>
                    </CardLink>
                  ) : (
                    <Text variant="title.xSmall">{f.name}</Text>
                  )}
                </CardHeader>
                <CardBody>
                  <Text variant="body.small">{f.description}</Text>
                </CardBody>
              </Card>
            ))}
          </div>

          <AegisLink asChild>
            <Link to="/updates">← Back to Updates</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
