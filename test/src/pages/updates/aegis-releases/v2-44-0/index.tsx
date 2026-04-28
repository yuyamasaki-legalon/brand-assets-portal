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
    name: "DataTable empty オプション",
    path: "/updates/aegis-releases/v2-44-0/datatable-empty",
    description: "DataTable に empty プロップを追加。rows が空の場合に表示するカスタムコンテンツを指定可能に",
    tag: "Design",
    tagColor: "blue" as const,
  },
  {
    name: "Button yellow カラー",
    path: "/updates/aegis-releases/v2-44-0/button-yellow",
    description: "Button に yellow カラーを追加。subtle / plain variant で使用可能",
    tag: "Design",
    tagColor: "blue" as const,
  },
  {
    name: "Draggable / Droppable キーボードセンサー改善",
    path: "",
    description: "Draggable と Droppable のキーボードセンサーを document ではなくターゲット要素にアタッチするよう変更",
    tag: "Bug Fix",
    tagColor: "teal" as const,
  },
  {
    name: "Resizable Drawer オフセット改善",
    path: "",
    description: "リサイズ中にウィンドウ端からの大きなオフセットを維持するよう更新",
    tag: "Bug Fix",
    tagColor: "teal" as const,
  },
  {
    name: "Form 内部リファクタ",
    path: "",
    description: "Form の内部実装で Slot を useRender に置き換え（API 変更なし）",
    tag: "Internal",
    tagColor: "neutral" as const,
  },
];

export const AegisUpdateV2440 = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Aegis React v2.44.0</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            v2.44.0 で追加・修正された機能のデモページ一覧です。
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
