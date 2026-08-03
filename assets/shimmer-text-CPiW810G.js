var e=`import {
  Link as AegisLink,
  Card,
  CardBody,
  ContentHeader,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";

const LocalShimmerText = ({ children }: { children: string }) => {
  return (
    <Text
      as="span"
      variant="body.medium"
      style={{
        color: "transparent",
        backgroundImage:
          "linear-gradient(90deg, var(--aegis-color-text-subtle) 0%, var(--aegis-color-text-default) 50%, var(--aegis-color-text-subtle) 100%)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        backgroundSize: "200% 100%",
        animation: "localShimmerSweep 1.8s linear infinite",
      }}
    >
      {children}
    </Text>
  );
};

export const ShimmerTextDemo = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>ShimmerText</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <style>{\`
            @keyframes localShimmerSweep {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
          \`}</style>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            現在のインストール済み Aegis には \`ShimmerText\` コンポーネント自体は含まれていないため、このページでは
            近い見た目をローカル実装で再現しています。ローディング中の短い文や AI の処理中表示の参考として確認できます。
          </Text>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, var(--aegis-layout-width-x4Small)), 1fr))",
              gap: "var(--aegis-space-medium)",
              marginBottom: "var(--aegis-space-large)",
            }}
          >
            <Card>
              <CardBody>
                <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
                  Basic
                </Text>
                <LocalShimmerText>Thinking...</LocalShimmerText>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
                  Large text
                </Text>
                <div>
                  <Text variant="title.large" color="information">
                    <LocalShimmerText>Preparing contract summary...</LocalShimmerText>
                  </Text>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Text as="p" variant="label.medium" style={{ marginBottom: "var(--aegis-space-small)" }}>
                  Inline sentence
                </Text>
                <Text as="p" variant="body.medium">
                  AI review status: <LocalShimmerText>checking playbook rules...</LocalShimmerText>
                </Text>
              </CardBody>
            </Card>
          </div>

          <div
            style={{
              padding: "var(--aegis-space-medium)",
              backgroundColor: "var(--aegis-color-background-neutral-xSubtle)",
              borderRadius: "var(--aegis-radius-medium)",
              marginBottom: "var(--aegis-space-large)",
            }}
          >
            <Text as="p" variant="label.small" style={{ marginBottom: "var(--aegis-space-xSmall)" }}>
              使いどころ
            </Text>
            <Text as="p" variant="body.small">
              短い文言を維持したまま待機状態を見せたいときに向いています。正式な Aegis API が入ったら、その実装へ
              置き換える前提のサンプルです。
            </Text>
          </div>

          <AegisLink asChild>
            <Link to="/updates/aegis-releases/v2-49-0">← Back to v2.49.0</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};
`;export{e as default};