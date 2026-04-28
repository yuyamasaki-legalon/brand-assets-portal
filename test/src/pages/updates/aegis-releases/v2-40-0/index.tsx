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
    name: "DescriptionList bordered",
    path: "/updates/aegis-releases/v2-40-0/description-list-bordered",
    description: "DescriptionList に bordered オプションが追加。項目間にボーダーを表示して視認性を向上",
    tag: "Design",
    tagColor: "blue" as const,
  },
  {
    name: "DataTable checkbox fix",
    path: "/updates/aegis-releases/v2-40-0/datatable-checkbox-fix",
    description: "全行選択時にヘッダーチェックボックスが indeterminate のままになるバグを修正",
    tag: "Bug Fix",
    tagColor: "teal" as const,
  },
  {
    name: "LfSort91 icon update",
    path: "",
    description: "LfSort91 アイコンのデザインが更新（aegis-icons v2.11.1）",
    tag: "Design",
    tagColor: "blue" as const,
  },
  {
    name: "Portal event bubbling fix",
    path: "",
    description: "新しい Portal でも React イベントのバブリングを停止するように修正（内部改善）",
    tag: "Bug Fix",
    tagColor: "teal" as const,
  },
];

export const AegisUpdateV2400 = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Aegis React v2.40.0</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            v2.40.0 で追加・修正された機能のデモページ一覧です。
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
