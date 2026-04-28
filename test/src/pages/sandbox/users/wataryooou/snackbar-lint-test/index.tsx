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
  snackbar,
  Text,
} from "@legalforce/aegis-react";
import { useTranslation } from "../../../../../hooks";
import { translations } from "./data/translations";

export const SnackbarLintTest = () => {
  const { t } = useTranslation(translations);

  return (
    <PageLayout>
      <PageLayoutContent>
        <PageLayoutHeader>
          <ContentHeader>
            <ContentHeader.Title>{t("pageTitle")}</ContentHeader.Title>
            <ContentHeader.Description>{t("pageDescription")}</ContentHeader.Description>
          </ContentHeader>
        </PageLayoutHeader>
        <PageLayoutBody>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aegis-space-medium)" }}>
            <Card>
              <CardHeader>
                <Text variant="title.xSmall">{t("basicUsageTitle")}</Text>
              </CardHeader>
              <CardBody>
                <div style={{ display: "flex", gap: "var(--aegis-space-small)", flexWrap: "wrap" }}>
                  <Button
                    variant="subtle"
                    onClick={() => {
                      snackbar.show({ message: t("savedMessage") });
                    }}
                  >
                    {t("savedMessage")}
                  </Button>
                  <Button
                    variant="subtle"
                    onClick={() => {
                      snackbar.show({ message: t("deletedMessage") });
                    }}
                  >
                    {t("deletedMessage")}
                  </Button>
                  <Button
                    variant="subtle"
                    onClick={() => {
                      snackbar.show({ message: t("settingsUpdatedMessage") });
                    }}
                  >
                    {t("settingsUpdatedMessage")}
                  </Button>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <Text variant="title.xSmall">{t("twoSentencesTitle")}</Text>
              </CardHeader>
              <CardBody>
                <Text variant="body.small" style={{ marginBottom: "var(--aegis-space-small)" }}>
                  {t("twoSentencesDescription")}
                </Text>
                <div style={{ display: "flex", gap: "var(--aegis-space-small)", flexWrap: "wrap" }}>
                  <Button
                    variant="subtle"
                    onClick={() => {
                      snackbar.show({ message: t("savedContinueMessage") });
                    }}
                  >
                    {t("savedContinueMessage")}
                  </Button>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <Text variant="title.xSmall">{t("errorDisplayTitle")}</Text>
              </CardHeader>
              <CardBody>
                <div style={{ display: "flex", gap: "var(--aegis-space-small)", flexWrap: "wrap" }}>
                  <Button
                    variant="subtle"
                    onClick={() => {
                      snackbar.show({ message: t("errorMessage"), color: "danger" });
                    }}
                  >
                    {t("errorMessage")}
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
