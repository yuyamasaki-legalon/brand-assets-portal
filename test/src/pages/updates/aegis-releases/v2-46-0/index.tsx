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
    name: "BottomNavigation",
    path: "/updates/aegis-releases/v2-46-0/bottom-navigation",
    description:
      "モバイルアプリ風のボトムナビゲーションコンポーネントを新規追加。BottomNavigationItem + BottomNavigationLink で構成",
    tag: "Component",
    tagColor: "indigo" as const,
  },
  {
    name: "ActionList bordered",
    path: "/updates/aegis-releases/v2-46-0/actionlist-bordered",
    description: "ActionList に bordered オプションを追加。各アイテム間にセパレーターラインを表示可能に",
    tag: "Component",
    tagColor: "indigo" as const,
  },
  {
    name: "Calendar small scale 対応",
    path: "/updates/aegis-releases/v2-46-0/calendar-small-scale",
    description: "Calendar / RangeCalendar を small scale レイアウトに対応。ナビゲーション Select のクリック領域も拡張",
    tag: "Component",
    tagColor: "indigo" as const,
  },
  {
    name: "BottomNavigation レイアウト連携",
    path: "",
    description: "Footer・Snackbar・PageLayout が BottomNavigation 表示時に自動で位置を調整するように",
    tag: "Component",
    tagColor: "indigo" as const,
  },
  {
    name: "新アイコン追加",
    path: "/updates/aegis-releases/v2-46-0/new-icons",
    description:
      "aegis-icons v2.12.0: lf-layout 系アイコン（align-center/left/right）、lf-paint-roller、lf-palette、lf-ruler-measure を追加",
    tag: "Design",
    tagColor: "blue" as const,
  },
  {
    name: "Field アイコンサイズ修正",
    path: "",
    description: "scale:full 時の Field のアイコンサイズを修正",
    tag: "Bug Fix",
    tagColor: "teal" as const,
  },
  {
    name: "Header small scale 修正",
    path: "",
    description: "scale:small 時の Header のインライン padding を修正、背景色を追加",
    tag: "Bug Fix",
    tagColor: "teal" as const,
  },
  {
    name: "DataTable sticky header z-index 修正",
    path: "",
    description: "DataTable の sticky header の blanket z-index を修正",
    tag: "Bug Fix",
    tagColor: "teal" as const,
  },
  {
    name: "MCP Server v1.0.0",
    path: "",
    description:
      "aegis-mcp-server が v1.0.0 にメジャーアップデート。list_logos ツール追加、get_component_detail → get_component_details にリネーム、componentSource リソース削除",
    tag: "DX",
    tagColor: "orange" as const,
  },
  {
    name: "VisuallyHidden useRender 移行",
    path: "",
    description: "VisuallyHidden を Slot から useRender 利用に置き換え",
    tag: "Internal",
    tagColor: "neutral" as const,
  },
];

export const AegisUpdateV2460 = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>Aegis React v2.46.0</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            v2.46.0 で追加・修正された機能のデモページ一覧です。
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
