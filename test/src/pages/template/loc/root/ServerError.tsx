import { ErrorCat1 } from "@legalforce/aegis-illustrations/react";
import { Button, EmptyState, Link, PageLayout, PageLayoutContent, Text } from "@legalforce/aegis-react";
import type { CSSProperties } from "react";
import { RootSidebarLayout } from "./RootSidebarLayout";

const layoutStyles: Record<string, CSSProperties> = {
  content: {
    display: "grid",
    placeItems: "center",
    inlineSize: "100%",
    paddingBlock: "var(--aegis-space-xxLarge)",
  },
};

const RootServerErrorTemplate = () => {
  return (
    <RootSidebarLayout>
      <PageLayout>
        <PageLayoutContent style={layoutStyles.content}>
          <EmptyState
            size="large"
            orientation="vertical"
            visual={<ErrorCat1 />}
            title={
              <Text as="span" variant="title.small" style={layoutStyles.multilineText}>
                エラーが発生しました
              </Text>
            }
            action={
              <Button minWidth="wide" onClick={() => window.location.reload()}>
                再読み込み
              </Button>
            }
          >
            <Text as="span" whiteSpace="pre-wrap">
              サーバーで問題が発生しているためページを表示できません。
              {"\n"}
              お困りの際は
              <Link href="mailto:support@example.com">support@example.com</Link>
              へお問い合わせください。
            </Text>
          </EmptyState>
        </PageLayoutContent>
      </PageLayout>
    </RootSidebarLayout>
  );
};

export default RootServerErrorTemplate;
