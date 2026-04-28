import {
  Button,
  Card,
  CardBody,
  CardHeader,
  ContentHeader,
  ContentHeaderTitle,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
} from "@legalforce/aegis-react";
import type { CSSProperties } from "react";
import { Link as RouterLink } from "react-router-dom";

const layoutStyles: Record<string, CSSProperties> = {
  body: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-large)",
    inlineSize: "100%",
    maxInlineSize: "var(--aegis-layout-width-large)",
    marginInline: "auto",
  },
  actionsGrid: {
    display: "grid",
    gap: "var(--aegis-space-small)",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  },
};

const RootTemplate = () => {
  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeaderTitle>Error Page</ContentHeaderTitle>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div style={layoutStyles.body}>
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">状態別の画面サンプル</Text>
              </CardHeader>
              <CardBody>
                <div style={layoutStyles.actionsGrid}>
                  <Button as={RouterLink} to="/template/root/not-found" variant="subtle" width="full">
                    NotFound
                  </Button>
                  <Button as={RouterLink} to="/template/root/server-error" variant="subtle" width="full">
                    Server Error
                  </Button>
                  <Button as={RouterLink} to="/template/root/maintenance" variant="subtle" width="full">
                    Maintenance
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </PageLayoutBody>
      </PageLayoutContent>
    </PageLayout>
  );
};

export default RootTemplate;
