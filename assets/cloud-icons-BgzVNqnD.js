var e=`import { LfBan, LfCloudUpload } from "@legalforce/aegis-icons";
import {
  Link as AegisLink,
  Card,
  CardBody,
  CardHeader,
  ContentHeader,
  Icon,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";

const cloudIcons = [
  {
    name: "LfCloudUpload",
    icon: <LfCloudUpload />,
    description: "現行パッケージで利用できるクラウド系アイコン。アップロードや同期開始の表現に向きます。",
  },
  {
    name: "LfBan",
    icon: <LfBan />,
    description: "無効化やアクセス制限を表す既存アイコン。クラウド停止状態の代替表現にも使えます。",
  },
];

export const CloudIconsDemo = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Cloud icons</ContentHeader.Title>
            <ContentHeader.Description>
              現行パッケージで利用できるクラウド関連アイコンの代替サンプル
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            このリポジトリに入っているのは \`@legalforce/aegis-icons@2.13.0\` のため、\`LfCloudSlash\` と \`LfCloudXmark\`
            はまだ使えません。ここでは近い用途に使える既存アイコンを確認できるようにしています。
          </Text>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "var(--aegis-space-medium)",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            {cloudIcons.map((item) => (
              <Card key={item.name}>
                <CardHeader>{item.name}</CardHeader>
                <CardBody>
                  <div style={{ marginBottom: "var(--aegis-space-medium)" }}>
                    <Icon size="xLarge" aria-label={item.name}>
                      {item.icon}
                    </Icon>
                  </div>
                  <Text variant="body.small">{item.description}</Text>
                </CardBody>
              </Card>
            ))}
          </div>

          <div
            style={{
              padding: "var(--aegis-space-medium)",
              backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
              borderRadius: "var(--aegis-radius-medium)",
              marginBottom: "var(--aegis-space-large)",
            }}
          >
            <Text as="p" variant="label.small" style={{ marginBottom: "var(--aegis-space-small)" }}>
              想定ユースケース
            </Text>
            <Text as="p" variant="body.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
              - \`LfCloudUpload\`: 同期開始、アップロード待ち、クラウド保存
            </Text>
            <Text as="p" variant="body.small">
              - \`LfBan\`: アクセス制限、無効化、利用不可状態の代替表現
            </Text>
          </div>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-50-0">← Back to v2.50.0</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
`;export{e as default};