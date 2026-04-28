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
    name: "DataTable グローバルフィルタリング",
    path: "/updates/aegis-releases/v2-42-0/datatable-global-filter",
    description:
      "globalFilter / onGlobalFilterChange で全カラム横断の検索が可能に。カラム単位で globalFilterable: false を指定して除外もできる",
    tag: "Design",
    tagColor: "blue" as const,
  },
  {
    name: 'Dialog width="full"',
    path: "/updates/aegis-releases/v2-42-0/dialog-width-full",
    description: 'DialogContent に width="full" が追加。画面幅いっぱいのダイアログが表現可能に',
    tag: "Design",
    tagColor: "blue" as const,
  },
  {
    name: "DataTable rowVirtualization",
    path: "/updates/aegis-releases/v2-42-0/datatable-row-virtualization",
    description: "大量行の描画パフォーマンスを改善する仮想スクロール。rowVirtualization prop で有効化",
    tag: "Design",
    tagColor: "blue" as const,
  },
  {
    name: 'Dialog width="auto" 修正',
    path: "/updates/aegis-releases/v2-42-0/dialog-width-auto-fix",
    description: 'width="auto" 指定時にコンテンツ幅にフィットせず全幅に広がっていた不具合を修正',
    tag: "Bug Fix",
    tagColor: "teal" as const,
  },
  {
    name: "DataTable sort checkmark",
    path: "",
    description: "ヘッダーメニュー内のソート項目にチェックマークを表示",
    tag: "Design",
    tagColor: "blue" as const,
  },
  {
    name: "Field 内部リファクタ (Slot → useRender)",
    path: "",
    description: "Field コンポーネントの内部実装を Slot から useRender に移行（API 変更なし）",
    tag: "Internal",
    tagColor: "neutral" as const,
  },
  {
    name: "useDescendant 無限再レンダリング修正",
    path: "",
    description: "useDescendant フックが無限再レンダリングを引き起こすケースを修正",
    tag: "Internal",
    tagColor: "neutral" as const,
  },
  {
    name: "DataTable メモ化 / aria-rowcount",
    path: "",
    description: "DataTable のレンダリングパフォーマンス改善と aria-rowcount 属性の追加",
    tag: "Internal",
    tagColor: "neutral" as const,
  },
];

export const AegisUpdateV2420 = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Aegis React v2.42.0</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            v2.42.0 で追加・修正された機能のデモページ一覧です。
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
