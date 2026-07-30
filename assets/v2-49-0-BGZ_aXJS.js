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
    name: 'Sidebar width="semiSmall"',
    path: "/updates/aegis-releases/v2-49-0/sidebar-semi-small",
    description:
      "Sidebar に small と medium の間を埋める semiSmall 幅が追加され、一覧+詳細の 2 ペイン構成で幅調整しやすく",
    tag: "Component",
    tagColor: "indigo" as const,
  },
  {
    name: "ShimmerText",
    path: "/updates/aegis-releases/v2-49-0/shimmer-text",
    description: "テキスト自体をシマー表示できる新コンポーネント。asChild で既存 Typography にも適用可能",
    tag: "Component",
    tagColor: "indigo" as const,
  },
  {
    name: "Checkbox/Radio Group labeling",
    path: "",
    description:
      "CheckboxGroup / RadioGroup の title と group 本体が aria-labelledby で関連付けされ、支援技術での理解性を改善",
    tag: "A11y",
    tagColor: "teal" as const,
  },
  {
    name: "ContentHeader hgroup semantics",
    path: "",
    description: "ContentHeader が hgroup セマンティクスを使うようになり、見出しと補助説明のまとまりをより正しく表現",
    tag: "A11y",
    tagColor: "teal" as const,
  },
  {
    name: "AvatarGroup role=group",
    path: "",
    description: 'AvatarGroup に role="group" が追加され、複数アバターの集合が支援技術に伝わりやすく',
    tag: "A11y",
    tagColor: "teal" as const,
  },
  {
    name: "Skeleton.Text/Button/Table deprecation",
    path: "",
    description:
      "Skeleton.Text / Skeleton.Button / Skeleton.Table が非推奨化。直接 expose された API の利用へ移行を促進",
    tag: "DX",
    tagColor: "orange" as const,
  },
];

export const AegisUpdateV2490 = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Aegis React v2.49.0</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            2026年5月12日に公開された v2.49.0 の追加・改善内容です。今回は Sidebar の幅バリエーション追加と
            テキスト向けのシマー表現が主な見どころです。
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