import {
  Link as AegisLink,
  Card,
  CardBody,
  CardHeader,
  CardLink,
  ContentHeader,
  ContentHeaderTitle,
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
    name: "Banner icon / xSmall",
    path: "/updates/aegis-releases/v2-48-0/banner-icon",
    description: "Banner にカスタム icon prop と xSmall サイズを追加",
    tag: "Component",
    tagColor: "indigo" as const,
  },
  {
    name: "Sidebar resizable",
    path: "/updates/aegis-releases/v2-48-0/sidebar-resizable",
    description: "Sidebar に resizable オプションを追加。width / minWidth / maxWidth / resizeStorage で幅を制御",
    tag: "Component",
    tagColor: "indigo" as const,
  },
  {
    name: "新アイコン (aegis-icons v2.13.0)",
    path: "/updates/aegis-releases/v2-48-0/new-icons",
    description: "レイアウト系 13 アイコン追加、3 アイコン非推奨化",
    tag: "Design",
    tagColor: "teal" as const,
  },
  {
    name: "Button highlight 改善",
    path: "",
    description: "aria-expanded と aria-haspopup が両方ある場合のみボタンをハイライト",
    tag: "Bug Fix",
    tagColor: "teal" as const,
  },
  {
    name: "Tabs パディング調整",
    path: "",
    description: "top / inline-side 配置時の Tabs リストパディングを調整",
    tag: "Polish",
    tagColor: "teal" as const,
  },
  {
    name: "SidebarTrigger a11y",
    path: "",
    description: "SidebarTrigger に aria-expanded / aria-controls を追加（Base UI Collapsible ベース）",
    tag: "Internal",
    tagColor: "neutral" as const,
  },
  {
    name: "Resizable handle tooltip",
    path: "",
    description: "Resizable のハンドル Tooltip がパネルの拡張方向に表示されるよう調整",
    tag: "Polish",
    tagColor: "teal" as const,
  },
];

export const AegisUpdateV2480 = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>Aegis React v2.48.0</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            v2.48.0 と aegis-icons v2.13.0 で追加・修正された機能のデモページ一覧です。
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
