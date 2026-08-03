var e=`import {
  Link as AegisLink,
  Card,
  CardBody,
  CardHeader,
  ContentHeader,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Tag,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";

const backgroundPattern = {
  backgroundImage:
    "linear-gradient(45deg, var(--aegis-color-background-accent-blue-subtle) 25%, transparent 25%), linear-gradient(-45deg, var(--aegis-color-background-accent-teal-subtle) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--aegis-color-background-accent-blue-subtle) 75%), linear-gradient(-45deg, transparent 75%, var(--aegis-color-background-accent-teal-subtle) 75%)",
  backgroundSize: "32px 32px",
  backgroundPosition: "0 0, 0 16px, 16px -16px, -16px 0",
};

export const CardOutlineOpaqueDemo = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>Card outline opaque background</ContentHeader.Title>
            <ContentHeader.Description>
              v2.51.0: Card outline variant の背景を opaque token に変更
            </ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            outline variant の Card が不透明背景を使うようになり、柄や色のある面に重ねても下地が透けません。
            ダッシュボードや設定画面でカードを面の上に置くケースを想定した確認です。
          </Text>

          <div
            style={{
              ...backgroundPattern,
              padding: "var(--aegis-space-large)",
              borderRadius: "var(--aegis-radius-medium)",
              marginBottom: "var(--aegis-space-large)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "var(--aegis-space-medium)",
              }}
            >
              <Card variant="outline">
                <CardHeader
                  trailing={
                    <Tag size="small" color="indigo" variant="outline">
                      outline
                    </Tag>
                  }
                >
                  Opaque outline
                </CardHeader>
                <CardBody>
                  <Text as="p" variant="body.small">
                    背景 token が opaque になったため、背後のパターンがカード面に混ざりません。
                  </Text>
                </CardBody>
              </Card>

              <Card variant="fill">
                <CardHeader
                  trailing={
                    <Tag size="small" color="neutral" variant="outline">
                      fill
                    </Tag>
                  }
                >
                  Fill variant
                </CardHeader>
                <CardBody>
                  <Text as="p" variant="body.small">
                    fill variant と並べても、カード同士の面表現が揃って見えます。
                  </Text>
                </CardBody>
              </Card>
            </div>
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
              API
            </Text>
            <Text as="p" variant="body.small">
              \`&lt;Card variant="outline"&gt;...&lt;/Card&gt;\`
            </Text>
          </div>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-51-0">← Back to v2.51.0</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
`;export{e as default};