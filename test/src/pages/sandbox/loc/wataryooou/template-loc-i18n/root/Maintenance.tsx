import { ErrorCat2 } from "@legalforce/aegis-illustrations/react";
import { EmptyState, Link, PageLayout, PageLayoutContent, Text } from "@legalforce/aegis-react";
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

const statusPageHref = "https://status.legalon.jp/";

export const MaintenancePage = () => {
  const { t } = useTranslation<TranslationKey>(translations);

  return (
    <RootSidebarLayout>
      <PageLayout>
        <PageLayoutContent style={layoutStyles.content}>
          <EmptyState
            orientation="vertical"
            size="large"
            visual={<ErrorCat2 />}
            title={
              <Text as="span" whiteSpace="pre-wrap">
                {t("maintenanceTitle")}
              </Text>
            }
          >
            <Text as="span" whiteSpace="pre-wrap">
              {t("maintenanceDescription")}
              {"\n"}
              <Link href={statusPageHref} target="_blank" rel="noreferrer">
                {t("statusSite")}
              </Link>
            </Text>
          </EmptyState>
        </PageLayoutContent>
      </PageLayout>
    </RootSidebarLayout>
  );
};

export default MaintenancePage;
