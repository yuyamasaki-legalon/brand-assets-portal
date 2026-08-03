var e=`import {
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
    name: "Textarea ghost option",
    path: "/updates/aegis-releases/v2-52-0/textarea-ghost",
    description: "Textarea に ghost オプションを追加。境界線を持たず本文に馴染む形で配置できる",
    tag: "Component",
    tagColor: "indigo" as const,
  },
  {
    name: "RadioGroup preview components",
    path: "/updates/aegis-releases/v2-52-0/radio-group-preview",
    description: "preview API として RadioGroup / RadioGroupList / RadioGroupItem / Title / Label / Description を追加",
    tag: "Component",
    tagColor: "indigo" as const,
  },
  {
    name: "Link fit-content in flex/grid",
    path: "/updates/aegis-releases/v2-52-0/link-fit-content",
    description: "Link に inline-size: fit-content を追加し、flex/grid 内でリンクが余白いっぱいに広がらないよう調整",
    tag: "Component",
    tagColor: "indigo" as const,
  },
  {
    name: "DataTable Manage columns hide",
    path: "/updates/aegis-releases/v2-52-0/datatable-manage-columns-hide",
    description: "DataTable のヘッダーメニューで、リサイズ系操作だけのときは Manage columns 項目を非表示に",
    tag: "Component",
    tagColor: "indigo" as const,
  },
  {
    name: "DataTable badge column auto sizing",
    path: "",
    description: "DataTable で badge column の追加 / 削除に応じて、自動カラム幅計算が追従するよう調整",
    tag: "Component",
    tagColor: "indigo" as const,
  },
  {
    name: "DataTable header menu internal refactor",
    path: "",
    description: "ヘッダーメニュー描画を中間配列を介さず、明示的な条件分岐ベースに置き換えた内部リファクタ",
    tag: "DX",
    tagColor: "orange" as const,
  },
];

export const AegisUpdateV2520 = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Aegis React v2.52.0</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            2026年6月のマイナーリリース v2.52.0 では、Textarea に <code>ghost</code> オプションが追加され、preview
            ステータスの RadioGroup 系コンポーネントが新規追加されました。あわせて Link の flex/grid 内挙動と DataTable
            のヘッダーメニュー / カラム幅まわりの細かな改善が含まれています。
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
                    <div style={{ flexShrink: 0 }}>
                      <Tag size="small" color={feature.tagColor} variant="outline">
                        {feature.tag}
                      </Tag>
                    </div>
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
`;export{e as default};