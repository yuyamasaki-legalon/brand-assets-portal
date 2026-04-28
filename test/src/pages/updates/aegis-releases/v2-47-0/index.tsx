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
    name: "Tabs (Base UI)",
    path: "/updates/aegis-releases/v2-47-0/tabs-base-ui",
    description: "明示的な value で制御できる Tabs / TabsList / TabsTrigger / TabsContent を追加",
    tag: "Component",
    tagColor: "indigo" as const,
  },
  {
    name: "DataTable highlightScope",
    path: "/updates/aegis-releases/v2-47-0/datatable-highlight-scope",
    description: "DataTable のホバー強調範囲を row / cell / none で切り替え可能に",
    tag: "Component",
    tagColor: "indigo" as const,
  },
  {
    name: "TagPicker selectionBehavior",
    path: "/updates/aegis-releases/v2-47-0/tagpicker-selection-behavior",
    description: "TagPicker で選択後に入力値を clear / preserve できるように",
    tag: "Component",
    tagColor: "indigo" as const,
  },
  {
    name: "DataTable interaction transitions",
    path: "",
    description: "DataTable の行・セルのインタラクションにトランジションを追加",
    tag: "Polish",
    tagColor: "teal" as const,
  },
  {
    name: "Dynamic viewport sizing",
    path: "",
    description: "BottomSheet / PageLayout / TableContainer が dynamic viewport units を使用",
    tag: "Bug Fix",
    tagColor: "teal" as const,
  },
  {
    name: "Legacy Tabs internals",
    path: "",
    description: "既存 Tab.Group 系コンポーネント内部で createRequiredContext を利用するよう整理",
    tag: "Internal",
    tagColor: "neutral" as const,
  },
  {
    name: "MCP Server v1.0.1",
    path: "",
    description:
      "peer dependency 範囲の緩和、examples の Tabs API 更新、react-docgen-typescript の ESM import path 修正",
    tag: "DX",
    tagColor: "orange" as const,
  },
];

export const AegisUpdateV2470 = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>Aegis React v2.47.0</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            v2.47.0 と aegis-mcp-server v1.0.1 で追加・修正された機能のデモページ一覧です。
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
