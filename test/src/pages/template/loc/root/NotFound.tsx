import { ErrorCat3 } from "@legalforce/aegis-illustrations/react";
import { EmptyState, PageLayout, PageLayoutContent, Text } from "@legalforce/aegis-react";
import type { CSSProperties } from "react";
import { RootSidebarLayout } from "./RootSidebarLayout";

const layoutStyles: Record<string, CSSProperties> = {
  main: {
    display: "grid",
    placeItems: "center",
    inlineSize: "100%",
  },
};

const RootNotFoundTemplate = () => {
  return (
    <RootSidebarLayout>
      <PageLayout>
        <PageLayoutContent style={layoutStyles.main}>
          <EmptyState
            size="large"
            visual={<ErrorCat3 />}
            title={
              <Text whiteSpace="pre-wrap">{`お探しのページは存在しないか\n権限がないためアクセスできません`}</Text>
            }
          />
        </PageLayoutContent>
      </PageLayout>
    </RootSidebarLayout>
  );
};

export default RootNotFoundTemplate;
