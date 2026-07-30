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
    name: "DataTable columnVirtualization",
    path: "/updates/aegis-releases/v2-51-0/datatable-column-virtualization",
    description: "DataTable に横方向の列仮想化オプションが追加され、横に長い表の描画負荷を抑えやすく",
    tag: "Component",
    tagColor: "indigo" as const,
  },
  {
    name: "CardLink disabled",
    path: "/updates/aegis-releases/v2-51-0/cardlink-disabled",
    description: "CardLink に disabled オプションが追加され、カードリンクを無効状態として表現可能に",
    tag: "Component",
    tagColor: "indigo" as const,
  },
  {
    name: "Card outline opaque background",
    path: "/updates/aegis-releases/v2-51-0/card-outline-opaque",
    description: "outline variant の Card 背景が opaque になり、重なった背景の透けを避けられるように",
    tag: "Component",
    tagColor: "indigo" as const,
  },
  {
    name: "Forwarded ref naming",
    path: "",
    description: "React component 実装内の forwarded ref 命名が標準化され、内部実装の読みやすさと一貫性を改善",
    tag: "DX",
    tagColor: "orange" as const,
  },
];

export const AegisUpdateV2510 = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Aegis React v2.51.0</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            2026年5月の v2.51.0 では、DataTable の列仮想化、CardLink の無効状態、Card outline variant
            の背景改善が追加されました。横に長い表とカード型ナビゲーションを中心に確認できます。
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
                    <div style={{ flexShrink: 0 }}>
                      <Tag size="small" color={feature.tagColor} variant="outline">
                        {feature.tag}
                      </Tag>
                    </div>
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