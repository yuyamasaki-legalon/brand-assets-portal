import { ErrorCat2 } from "@legalforce/aegis-illustrations/react";
import { EmptyState, Link, PageLayout, PageLayoutContent, Text } from "@legalforce/aegis-react";
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

const statusPageHref = "https://status.legalon.jp/";

const RootMaintenanceTemplate = () => {
  return (
    <RootSidebarLayout>
      <PageLayout style={layoutStyles.body}>
        <PageLayoutContent style={layoutStyles.content}>
          <EmptyState
            orientation="vertical"
            size="large"
            visual={<ErrorCat2 />}
            title={
              <Text as="span" whiteSpace="pre-wrap">
                メンテナンス中のため{"\n"}この機能はご利用いただけません
              </Text>
            }
          >
            <Text as="span" whiteSpace="pre-wrap">
              メンテナンス終了まで今しばらくお待ちください。
              {"\n"}
              詳細については
              <Link href={statusPageHref} target="_blank" rel="noreferrer">
                サービスステータスサイト
              </Link>
              をご確認ください。
            </Text>
          </EmptyState>
        </PageLayoutContent>
      </PageLayout>
    </RootSidebarLayout>
  );
};

export default RootMaintenanceTemplate;
