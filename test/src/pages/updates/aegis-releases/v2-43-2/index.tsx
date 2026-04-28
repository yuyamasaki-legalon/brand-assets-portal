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
    name: "DataTable bordered checkbox / corner radius 修正",
    path: "/updates/aegis-releases/v2-43-2/datatable-bordered-fix",
    description:
      "bordered テーブルで checkbox セルのパディングが不正だった問題と、outerBordered の角丸が正しく適用されなかった問題を修正",
    tag: "Bug Fix",
    tagColor: "teal" as const,
  },
  {
    name: "Dialog keyboard event 修正 (dnd-kit)",
    path: "",
    description:
      "DialogContent 内で dnd-kit の KeyboardSensor が動作しない問題を修正。キーボードイベントの伝播が正しく処理されるように",
    tag: "Bug Fix",
    tagColor: "teal" as const,
  },
  {
    name: "Base UI Portal container 変更",
    path: "",
    description:
      "v2.43.2 で Portal のデフォルト container を document.body に変更、v2.43.3 で Parent Portal に再変更（API 変更なし）",
    tag: "Internal",
    tagColor: "neutral" as const,
  },
];

export const AegisUpdateV2432 = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Aegis React v2.43.2</ContentHeader.Title>
            <ContentHeader.Description>v2.43.3 パッチ修正を含む</ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            v2.43.2 で修正されたバグのデモページ一覧です。v2.43.3 は Portal container のデフォルト変更のみで、API
            変更はありません。
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
