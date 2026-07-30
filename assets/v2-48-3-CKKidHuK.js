var e=`import {
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
    name: "Sidebar data-slot 属性",
    path: "/updates/aegis-releases/v2-48-3/sidebar-data-slot",
    description:
      "Sidebar / SidebarInset / PageLayout の各要素に data-slot 属性が追加され、CSS の属性セレクタによる外部からのスタイリングが容易に",
    tag: "Component",
    tagColor: "teal" as const,
  },
  {
    name: "Sidebar transition 判定の修正",
    path: "",
    description:
      'Sidebar 展開時の transitionComplete 判定が state.transitionStatus === "idle" を要求するようになり、アニメーション途中の不安定な見え方を解消',
    tag: "Bug Fix",
    tagColor: "teal" as const,
  },
  {
    name: "PageLayout の grid 化",
    path: "",
    description:
      "PageLayout のサイドバー / インセット配置が flex から grid （grid-template-areas）ベースに変更。data-slot 経由でエリアに割り当てる構造に",
    tag: "Internal",
    tagColor: "neutral" as const,
  },
  {
    name: "Sidebar 内部に spacer 追加",
    path: "",
    description:
      "Sidebar のレイアウト計算をシンプル化するため、内部に spacer 要素を追加。collapsed / push / resizable の幅変化を spacer の inline-size で表現",
    tag: "Internal",
    tagColor: "neutral" as const,
  },
];

export const AegisUpdateV2483 = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Aegis React v2.48.3</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            v2.48.3 で追加・修正された内容のデモページ一覧です。Sidebar まわりの内部リファクタが中心の
            パッチリリースです。
          </Text>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(var(--aegis-layout-width-x5Small), 1fr))",
              gap: "var(--aegis-space-medium)",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            {features.map((feature) => (
              <Card key={feature.name}>
                <CardHeader
                  trailing={
                    <span style={{ flexShrink: 0 }}>
                      <Tag size="small" color={feature.tagColor} variant="outline">
                        {feature.tag}
                      </Tag>
                    </span>
                  }
                >
                  {feature.path ? (
                    <CardLink asChild>
                      <Link to={feature.path}>
                        <Text variant="title.xSmall">{feature.name}</Text>
                      </Link>
                    </CardLink>
                  ) : (
                    <Text variant="title.xSmall">{feature.name}</Text>
                  )}
                </CardHeader>
                <CardBody>
                  <Text variant="body.small">{feature.description}</Text>
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
`;export{e as default};