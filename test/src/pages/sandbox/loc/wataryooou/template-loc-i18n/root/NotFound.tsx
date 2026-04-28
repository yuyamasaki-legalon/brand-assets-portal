import { ErrorCat3 } from "@legalforce/aegis-illustrations/react";
import { EmptyState, PageLayout, PageLayoutContent, Text } from "@legalforce/aegis-react";
import type { CSSProperties } from "react";
import { useTranslation } from "../../../../../../hooks";
import { type TranslationKey, translations } from "./data/translations";
import { RootSidebarLayout } from "./RootSidebarLayout";

const layoutStyles: Record<string, CSSProperties> = {
  main: {
    display: "grid",
    placeItems: "center",
    inlineSize: "100%",
  },
};

export const NotFoundPage = () => {
  const { t } = useTranslation<TranslationKey>(translations);

  return (
    <RootSidebarLayout>
      <PageLayout>
        <PageLayoutContent style={layoutStyles.main}>
          <EmptyState
            size="large"
            visual={<ErrorCat3 />}
            title={<Text whiteSpace="pre-wrap">{t("notFoundTitle")}</Text>}
          />
        </PageLayoutContent>
      </PageLayout>
    </RootSidebarLayout>
  );
};

export default NotFoundPage;
