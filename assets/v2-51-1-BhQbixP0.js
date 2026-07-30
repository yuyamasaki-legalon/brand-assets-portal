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
    name: "Filter guidance caption",
    path: "/updates/aegis-releases/v2-51-1/filter-guidance-caption",
    description: "Combobox / TagPicker のドロップダウン上部に「文字入力で候補を絞り込めます」キャプションが表示",
    tag: "Component",
    tagColor: "indigo" as const,
  },
  {
    name: "Breadcrumb IconButton size",
    path: "/updates/aegis-releases/v2-51-1/breadcrumb-iconbutton-size",
    description: "Breadcrumb.Item 内の IconButton サイズ override を削除し、Button / Link と高さが揃うように",
    tag: "Component",
    tagColor: "indigo" as const,
  },
  {
    name: "Combobox shared option list internals",
    path: "",
    description: "Select 由来の option list 内部実装を Combobox 側へ移管。新しいキャプション挙動の下地",
    tag: "DX",
    tagColor: "orange" as const,
  },
  {
    name: "Centralized global class name generation",
    path: "",
    description: "React コンポーネントのグローバルクラス名生成を共通化",
    tag: "DX",
    tagColor: "orange" as const,
  },
  {
    name: "Forwarded ref order fix",
    path: "",
    description: "ref をマージする際、forwarded ref を内部 ref より先に置くよう順序を修正",
    tag: "DX",
    tagColor: "orange" as const,
  },
];

export const AegisUpdateV2511 = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Aegis React v2.51.1</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            2026年5月のパッチリリース v2.51.1 では、Combobox / TagPicker
            のドロップダウンにフィルタガイダンスキャプションが追加され、Breadcrumb 内の IconButton サイズが Button /
            Link と揃いました。あわせて aegis-tokens v2.14.0 にローカライズ済みのキャプション文言が追加されています。
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