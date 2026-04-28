import { ErrorCat1 } from "@legalforce/aegis-illustrations/react";
import { Button, EmptyState, Link, PageLayout, PageLayoutContent, Text } from "@legalforce/aegis-react";
import type { CSSProperties } from "react";
import { useTranslation } from "../../../../../../hooks";
import { type TranslationKey, translations } from "./data/translations";
import { RootSidebarLayout } from "./RootSidebarLayout";

const layoutStyles: Record<string, CSSProperties> = {
  content: {
    display: "grid",
    placeItems: "center",
    inlineSize: "100%",
    paddingBlock: "var(--aegis-space-xxLarge)",
  },
};

export const ServerErrorPage = () => {
  const { t } = useTranslation<TranslationKey>(translations);

  return (
    <RootSidebarLayout>
      <PageLayout>
        <PageLayoutContent style={layoutStyles.content}>
          <EmptyState
            size="large"
            orientation="vertical"
            visual={<ErrorCat1 />}
            title={
              <Text as="span" variant="title.small">
                {t("serverErrorTitle")}
              </Text>
            }
            action={
              <Button minWidth="wide" onClick={() => window.location.reload()}>
                {t("reload")}
              </Button>
            }
          >
            <Text as="span" whiteSpace="pre-wrap">
              {t("serverErrorDescription")}
              {"\n"}
              {t("serverErrorContact")}
              <Link href="mailto:support@example.com">support@example.com</Link>
            </Text>
          </EmptyState>
        </PageLayoutContent>
      </PageLayout>
    </RootSidebarLayout>
  );
};

export default ServerErrorPage;
