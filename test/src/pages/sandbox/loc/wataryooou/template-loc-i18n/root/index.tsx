import {
  Button,
  Card,
  CardBody,
  CardHeader,
  ContentHeader,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Text,
} from "@legalforce/aegis-react";
import type { CSSProperties } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "../../../../../../hooks";
import { type TranslationKey, translations } from "./data/translations";

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

const basePath = "/sandbox/loc/wataryooou/template-loc-i18n/root";

export const RootPage = () => {
  const { t } = useTranslation<TranslationKey>(translations);

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>{t("pageTitle")}</ContentHeader.Title>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div style={layoutStyles.body}>
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">{t("statusPageSamples")}</Text>
              </CardHeader>
              <CardBody>
                <div style={layoutStyles.actionsGrid}>
                  <Button as={RouterLink} to={`${basePath}/not-found`} variant="subtle" width="full">
                    {t("notFound")}
                  </Button>
                  <Button as={RouterLink} to={`${basePath}/server-error`} variant="subtle" width="full">
                    {t("serverError")}
                  </Button>
                  <Button as={RouterLink} to={`${basePath}/maintenance`} variant="subtle" width="full">
                    {t("maintenance")}
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

export default RootPage;
