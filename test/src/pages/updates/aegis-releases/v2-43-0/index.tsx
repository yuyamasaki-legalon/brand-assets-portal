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
    name: "DataTable columnBordered / outerBordered",
    path: "/updates/aegis-releases/v2-43-0/datatable-bordered",
    description: "DataTable に columnBordered（列間ボーダー）と outerBordered（外枠ボーダー + 角丸）の Props を追加",
    tag: "Design",
    tagColor: "blue" as const,
  },
  {
    name: "Button / ButtonGroup fill",
    path: "/updates/aegis-releases/v2-43-0/button-fill",
    description: "Button と ButtonGroup に fill オプションを追加。利用可能なスペースを埋めるレイアウトが可能に",
    tag: "Design",
    tagColor: "blue" as const,
  },
  {
    name: "Stepper.Item loading / error ステータス",
    path: "/updates/aegis-releases/v2-43-0/stepper-status",
    description:
      'Stepper.Item の status に "loading"（回転アイコン）と "error"（警告アイコン）を追加。medium / small 両サイズ対応',
    tag: "Design",
    tagColor: "blue" as const,
  },
  {
    name: "ButtonGroup orientation",
    path: "/updates/aegis-releases/v2-43-0/buttongroup-orientation",
    description: 'ButtonGroup に orientation オプションを追加。"horizontal"（デフォルト）と "vertical" を切り替え可能',
    tag: "Design",
    tagColor: "blue" as const,
  },
  {
    name: "DataTable badge 列 pin 修正",
    path: "/updates/aegis-releases/v2-43-0/datatable-badge-pin-fix",
    description:
      "columnOrder 指定時に badge 列が正しく左端にピン留めされない不具合を修正。v2.43.1 で columnOrder 未指定時の修正も追加",
    tag: "Bug Fix",
    tagColor: "teal" as const,
  },
  {
    name: "LinkBox / LinkOverlay 内部リファクタ",
    path: "",
    description: "LinkBox / LinkOverlay の内部実装を Slot から useRender に移行（API 変更なし）",
    tag: "Internal",
    tagColor: "neutral" as const,
  },
  {
    name: "DataTable 仮想化ライブラリ変更",
    path: "",
    description: "DataTable の仮想スクロール実装で使用するライブラリを変更（API 変更なし）",
    tag: "Internal",
    tagColor: "neutral" as const,
  },
  {
    name: "DataTable rowVirtualization スタイリング修正",
    path: "",
    description: "rowVirtualization 有効時のスタイリングに関する不具合を修正",
    tag: "Bug Fix",
    tagColor: "teal" as const,
  },
  {
    name: "Base UI 1.3.0 アップグレード",
    path: "",
    description: "依存ライブラリ Base UI を 1.3.0 にアップグレード（API 変更なし）",
    tag: "Internal",
    tagColor: "neutral" as const,
  },
];

export const AegisUpdateV2430 = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Aegis React v2.43.0</ContentHeader.Title>
            <ContentHeader.Description>v2.43.1 パッチ修正を含む</ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            v2.43.0 で追加・修正された機能のデモページ一覧です。v2.43.1 は DataTable badge 位置修正のパッチで、badge pin
            fix デモ内で言及しています。
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
