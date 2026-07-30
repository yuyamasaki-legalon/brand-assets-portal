var e=`import {
  Link as AegisLink,
  Card,
  CardBody,
  CardHeader,
  ContentHeader,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Tag,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";

const tagVariants = [
  {
    name: "outline",
    description: "既存の標準アウトライン。通常の補助ラベルや絞り込み条件に使う基準形。",
    tag: (
      <Tag color="neutral" variant="outline">
        Outline
      </Tag>
    ),
  },
  {
    name: "fill",
    description: "塗りつぶし強調。状態やカテゴリを明確に見せたいケース向け。",
    tag: (
      <Tag color="neutral" variant="fill">
        Fill
      </Tag>
    ),
  },
  {
    name: "outline (alternate usage)",
    description: "現行パッケージでは \`dash\` が未搭載のため、近い温度感の補助ラベルとして outline を使います。",
    tag: (
      <Tag color="neutral" variant="outline">
        Outline
      </Tag>
    ),
  },
];

const exampleTags = [
  { label: "ドラフト", color: "orange" as const },
  { label: "要確認", color: "teal" as const },
  { label: "社外共有前", color: "indigo" as const },
];

export const TagDashDemo = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Tag dash variant</ContentHeader.Title>
            <ContentHeader.Description>
              現行パッケージでは \`dash\` variant 未搭載のため、近い用途を outline で確認
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            このリポジトリに入っている \`@legalforce/aegis-react@2.48.2\` では \`Tag variant="dash"\` はまだ使えません。
            そのため、近い用途の補助ラベルを \`outline\` と \`fill\` の組み合わせで確認できるようにしています。
          </Text>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "var(--aegis-space-medium)",
              marginBottom: "var(--aegis-space-large)",
            }}
          >
            {tagVariants.map((variant) => (
              <Card key={variant.name}>
                <CardHeader>{variant.name}</CardHeader>
                <CardBody>
                  <div style={{ marginBottom: "var(--aegis-space-medium)" }}>{variant.tag}</div>
                  <Text variant="body.small">{variant.description}</Text>
                </CardBody>
              </Card>
            ))}
          </div>

          <div
            style={{
              padding: "var(--aegis-space-medium)",
              backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
              borderRadius: "var(--aegis-radius-medium)",
              marginBottom: "var(--aegis-space-large)",
            }}
          >
            <Text as="p" variant="label.small" style={{ marginBottom: "var(--aegis-space-small)" }}>
              利用イメージ
            </Text>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--aegis-space-small)" }}>
              {exampleTags.map((item) => (
                <Tag key={item.label} color={item.color} variant="outline">
                  {item.label}
                </Tag>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: "var(--aegis-space-medium)",
              backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
              borderRadius: "var(--aegis-radius-medium)",
              marginBottom: "var(--aegis-space-large)",
            }}
          >
            <Text as="p" variant="label.small" style={{ marginBottom: "var(--aegis-space-small)" }}>
              API
            </Text>
            <Text as="p" variant="body.small">
              現行版では \`&lt;Tag variant="outline"&gt;...&lt;/Tag&gt;\` を利用
            </Text>
          </div>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-50-0">← Back to v2.50.0</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
`;export{e as default};