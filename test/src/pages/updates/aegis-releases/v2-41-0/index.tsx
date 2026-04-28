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
    name: "StatusLabel 新カラーパターン",
    path: "/updates/aegis-releases/v2-41-0/statuslabel-new-colors",
    description:
      "purple, magenta, orange, lime, indigo の5色が追加。既存の neutral, red, yellow, blue, teal, gray と合わせて11色に",
    tag: "Design",
    tagColor: "blue" as const,
  },
  {
    name: "Tag action API",
    path: "/updates/aegis-releases/v2-41-0/tag-action-api",
    description:
      "action prop と TagLink / TagRemove / TagGroupLabel 新コンポーネントの追加。clickable Tag のスタイルも改善",
    tag: "Design",
    tagColor: "blue" as const,
  },
  {
    name: "DescriptionList xLarge",
    path: "/updates/aegis-releases/v2-41-0/description-list-xlarge",
    description: "DescriptionList に xLarge サイズが追加。より大きな表示が必要なケースに対応",
    tag: "Design",
    tagColor: "blue" as const,
  },
  {
    name: "InformationCard 中央揃え修正",
    path: "/updates/aegis-releases/v2-41-0/informationcard-centering-fix",
    description: "leading アイコン使用時のテキスト垂直中央揃えが修正。複数行テキストでも正しく配置される",
    tag: "Bug Fix",
    tagColor: "teal" as const,
  },
  {
    name: "Dialog 内部移行",
    path: "",
    description: "Floating UI から Base UI への内部移行（API 変更なし）",
    tag: "Internal",
    tagColor: "neutral" as const,
  },
  {
    name: "WCAG 2.5.8 最小ターゲットサイズ",
    path: "",
    description: "Button, BreadcrumbItem, BreadcrumbButton に最小ターゲットサイズ 24x24px を適用",
    tag: "A11y",
    tagColor: "purple" as const,
  },
];

export const AegisUpdateV2410 = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Aegis React v2.41.0</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            v2.41.0 で追加・修正された機能のデモページ一覧です。
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
