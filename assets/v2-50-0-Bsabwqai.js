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
    name: 'Tag variant="dash"',
    path: "/updates/aegis-releases/v2-50-0/tag-dash",
    description: "Tag に dashed outline の dash variant が追加され、補助ラベルを線種で差別化しやすく",
    tag: "Component",
    tagColor: "indigo" as const,
  },
  {
    name: "Cloud icons",
    path: "/updates/aegis-releases/v2-50-0/cloud-icons",
    description: "lf-cloud-slash / lf-cloud-xmark が追加され、クラウド停止や無効状態を明示しやすく",
    tag: "Component",
    tagColor: "indigo" as const,
  },
  {
    name: "Stepper collection internals",
    path: "",
    description: "Stepper が createCollection ベースへ移行し、内部の並び順管理と拡張性を改善",
    tag: "DX",
    tagColor: "orange" as const,
  },
  {
    name: "ListBase / TextDecoration asChild",
    path: "",
    description: "内部 wrapper が deprecated な as ではなく asChild パターンへ移行し、API 一貫性を改善",
    tag: "DX",
    tagColor: "orange" as const,
  },
  {
    name: "createCollection rollout",
    path: "",
    description: "collection 基盤が createCollection に寄せられ、reorder 検知や metadata 拡張の土台を整理",
    tag: "DX",
    tagColor: "orange" as const,
  },
];

export const AegisUpdateV2500 = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Aegis React v2.50.0</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            2026年5月13日に GitHub の release PR で公開準備が完了した v2.50.0 の追加・改善内容です。今回は Tag の dashed
            variant と、クラウド状態を表す新アイコン 2 種が主な確認ポイントです。
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