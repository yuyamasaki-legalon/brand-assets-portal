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
    name: "DataTable colSpan",
    path: "/updates/aegis-releases/v2-38-0/datatable-colspan",
    description: "DataTable のカラム定義に colSpan を指定してヘッダーセルを結合するデモ",
    tag: "Design",
    tagColor: "blue" as const,
  },
  {
    name: "Drawer maxWidth: none",
    path: "/updates/aegis-releases/v2-38-0/drawer-maxwidth-none",
    description: "Drawer の maxWidth に none を指定して制限なしリサイズを確認するデモ",
    tag: "Design",
    tagColor: "blue" as const,
  },
  {
    name: "Tree フリッカー修正",
    path: "/updates/aegis-releases/v2-38-0/tree-flicker-fix",
    description: "Tree の items を動的に更新してもフリッカーが発生しないことを確認するデモ",
    tag: "Bug Fix",
    tagColor: "teal" as const,
  },
  {
    name: "Popover max-width",
    path: "/updates/aegis-releases/v2-38-0/popover-max-width",
    description: "Popover が画面端ではみ出さないよう max-width が適用されることを確認するデモ",
    tag: "Bug Fix",
    tagColor: "teal" as const,
  },
  {
    name: "新規アイコン",
    path: "/updates/aegis-releases/v2-38-0/new-icons",
    description: "chart-bar-horizontal, chart-bar-vertical, chart-pie, pen-sparkles の表示デモ",
    tag: "Design",
    tagColor: "blue" as const,
  },
];

export const AegisUpdateV2380 = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Aegis React v2.38.0</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            v2.38.0 で追加・修正された機能のデモページ一覧です。
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
                  <CardLink asChild>
                    <Link to={f.path}>
                      <Text variant="title.xSmall">{f.name}</Text>
                    </Link>
                  </CardLink>
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
