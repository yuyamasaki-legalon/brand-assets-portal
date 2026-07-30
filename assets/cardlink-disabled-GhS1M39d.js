var e=`import { LfAngleRightMiddle, LfLock } from "@legalforce/aegis-icons";
import {
  Link as AegisLink,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardLink,
  ContentHeader,
  Icon,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Tag,
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";

const cards = [
  {
    title: "利用可能なテンプレート",
    description: "リンクとして押下できる通常状態。カード全体に overlay link が広がります。",
    disabled: false,
  },
  {
    title: "権限が必要なテンプレート",
    description: "v2.51.0 で追加された disabled により、CardLink 自体を無効状態にできます。",
    disabled: true,
  },
];

export const CardLinkDisabledDemo = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>CardLink disabled</ContentHeader.Title>
            <ContentHeader.Description>v2.51.0: CardLink に \`disabled\` オプションを追加</ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-large)" }}>
            CardLink を持つカードで、利用不可の項目をリンクとして無効化できます。無効なカードは hover / press
            のリンク操作対象から外れます。
          </Text>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "var(--aegis-space-medium)",
              marginBottom: "var(--aegis-space-large)",
            }}
          >
            {cards.map((item) => (
              <Card key={item.title} variant="outline">
                <CardHeader
                  leading={
                    item.disabled ? (
                      <Icon>
                        <LfLock />
                      </Icon>
                    ) : null
                  }
                  trailing={
                    item.disabled ? (
                      <Tag color="neutral" variant="outline" size="small">
                        Disabled
                      </Tag>
                    ) : (
                      <Icon>
                        <LfAngleRightMiddle />
                      </Icon>
                    )
                  }
                >
                  {item.disabled ? (
                    <Text as="span" color="subtle">
                      {item.title}
                    </Text>
                  ) : (
                    <CardLink href="#">{item.title}</CardLink>
                  )}
                </CardHeader>
                <CardBody>
                  <Text as="p" variant="body.small">
                    {item.description}
                  </Text>
                </CardBody>
                <CardFooter>
                  <Text variant="body.xSmall">{item.disabled ? "申請後に利用可能" : "クリック可能"}</Text>
                </CardFooter>
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
              API
            </Text>
            <Text as="p" variant="body.small">
              現行版では、無効時は \`CardLink\` を描画せず通常テキストに切り替える形で代替
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