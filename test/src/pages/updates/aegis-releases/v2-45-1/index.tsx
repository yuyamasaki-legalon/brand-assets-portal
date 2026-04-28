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
    name: "Portal イベントバブリング修正",
    path: "/updates/aegis-releases/v2-45-1/portal-event-bubbling-fix",
    description:
      "Popup 系コンポーネント（Popover, Tooltip, Select 等）の Portal 内イベントが親要素にバブリングしなくなるよう修正",
    tag: "Bug Fix",
    tagColor: "teal" as const,
  },
  {
    name: "Portal コンポーネント簡素化",
    path: "",
    description: "Portal の内部実装から CSS module・mergeProps・cx を除去しシンプル化",
    tag: "Internal",
    tagColor: "neutral" as const,
  },
  {
    name: "Popup content ラッパー追加",
    path: "",
    description: "Popup 内部の Portal に STOP_BUBBLING_PROPS 付き content div ラッパーを追加し、イベント伝播を防止",
    tag: "Internal",
    tagColor: "neutral" as const,
  },
];

export const AegisUpdateV2451 = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Aegis React v2.45.1</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            v2.45.1 で追加・修正された機能のデモページ一覧です。
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
