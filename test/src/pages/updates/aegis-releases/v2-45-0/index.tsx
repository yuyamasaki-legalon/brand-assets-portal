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
    name: "Drawer bottom position",
    path: "/updates/aegis-releases/v2-45-0/drawer-bottom",
    description: "Drawer に position='bottom' を追加。画面下部からスライドインする Drawer が利用可能に",
    tag: "Design",
    tagColor: "blue" as const,
  },
  {
    name: "Textarea 改善",
    path: "/updates/aegis-releases/v2-45-0/textarea-improvements",
    description: "TextareaCountLabel のエラー時カラー修正 + leading/trailing とテキストボックス間の row gap 追加",
    tag: "Bug Fix",
    tagColor: "teal" as const,
  },
  {
    name: "DataTable バッジカラム固定",
    path: "/updates/aegis-releases/v2-45-0/datatable-badge-pin",
    description: "DataTable のバッジカラムが自動的に固定されるよう更新。横スクロール時もバッジが常に表示",
    tag: "Bug Fix",
    tagColor: "teal" as const,
  },
  {
    name: "Drawer サブコンポーネント直接エクスポート",
    path: "",
    description:
      "DrawerHeader, DrawerBody, DrawerFooter を Drawer とは別に直接インポート可能に。Drawer.Header 等の compound パターンも引き続き利用可",
    tag: "Design",
    tagColor: "blue" as const,
  },
  {
    name: "Dialog スケール別スペーシング",
    path: "",
    description: "Dialog の内部スペーシングがスケール（small / medium）に応じて自動調整されるよう更新",
    tag: "Design",
    tagColor: "blue" as const,
  },
  {
    name: "Drawer backdrop（small scale）",
    path: "",
    description: "スケールが small の場合に Drawer にバックドロップ（背景オーバーレイ）を自動表示",
    tag: "Design",
    tagColor: "blue" as const,
  },
  {
    name: "Drawer Base UI 移行",
    path: "",
    description: "Drawer の内部実装を Base UI ベースに刷新。初期フォーカスが最初のタブ可能要素からダイアログ自体に変更",
    tag: "Internal",
    tagColor: "neutral" as const,
  },
  {
    name: "透明背景修正",
    path: "",
    description: "Field と Table Row の透明背景を修正",
    tag: "Bug Fix",
    tagColor: "teal" as const,
  },
  {
    name: "Overflow / OverflowItem 内部改善",
    path: "",
    description: "useRender によるレンダリングと ref 型の厳密化（API 変更なし）",
    tag: "Internal",
    tagColor: "neutral" as const,
  },
  {
    name: "dnd-kit hydration 修正",
    path: "",
    description: "ID を明示的に渡すことで hydration の不整合を解消",
    tag: "Bug Fix",
    tagColor: "teal" as const,
  },
  {
    name: "Droppable useDndMonitor 移行",
    path: "",
    description: "内部コンテキストの代わりに dnd-kit 提供の useDndMonitor を使用するよう変更",
    tag: "Internal",
    tagColor: "neutral" as const,
  },
];

export const AegisUpdateV2450 = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Aegis React v2.45.0</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            v2.45.0 で追加・修正された機能のデモページ一覧です。
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
