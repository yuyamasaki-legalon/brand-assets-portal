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
  Text,
} from "@legalforce/aegis-react";
import { Link } from "react-router-dom";

export function WorkOnSyujiHiga() {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>WorkOn - syuji-higa</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
            syuji-higa の WorkOn 向け実験ページです。
          </Text>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(var(--aegis-layout-width-x5Small), 1fr))",
              gap: "var(--aegis-space-medium)",
              marginBottom: "var(--aegis-space-xLarge)",
            }}
          >
            <Card>
              <CardHeader>
                <CardLink asChild>
                  <Link to="/sandbox/workon/syuji-higa/sandbox">
                    <Text variant="title.xSmall">Sandbox</Text>
                  </Link>
                </CardLink>
              </CardHeader>
              <CardBody>
                <Text variant="body.small">aegis-lab を試す場所</Text>
              </CardBody>
            </Card>
          </div>

          <AegisLink asChild>
            <Link to="/sandbox/workon">← Back to WorkOn Sandbox</Link>
          </AegisLink>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
}
`;export{e as default};